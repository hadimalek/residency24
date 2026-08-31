/**
 * Google OAuth for the Search Console MCP server.
 *
 * Credentials never live in this repo. The client id/secret are read from the
 * client_secret_*.json that Google Cloud Console hands out, located by
 * GSC_CLIENT_SECRET_FILE; the refresh token is written next to that file. Both
 * paths default to somewhere outside the repository.
 *
 * Only the refresh token is persisted. Access tokens are short-lived and kept in
 * memory, refreshed on demand.
 */
import { readFile, writeFile, mkdir, readdir, stat } from "node:fs/promises";
import { dirname, join } from "node:path";
import { homedir } from "node:os";

export const SCOPES = ["https://www.googleapis.com/auth/webmasters.readonly"];

/** Loopback redirect used by the one-time consent flow (auth.mjs). */
export const REDIRECT_PORT = Number(process.env.GSC_OAUTH_PORT ?? 8765);
export const REDIRECT_URI = `http://localhost:${REDIRECT_PORT}/oauth2callback`;

const CREDENTIAL_DIR = join(homedir(), "Desktop", "residency file");

/**
 * Where the OAuth client file lives.
 *
 * Rather than naming one client id, this picks the most recently written
 * `client_secret_*.json` in the credential directory: creating a new client in
 * Cloud Console and dropping its download in there is then all that is needed,
 * with no code change. GSC_CLIENT_SECRET_FILE still wins if set.
 */
export async function clientSecretPath() {
  if (process.env.GSC_CLIENT_SECRET_FILE) return process.env.GSC_CLIENT_SECRET_FILE;
  let names;
  try {
    names = (await readdir(CREDENTIAL_DIR)).filter(
      (n) => n.startsWith("client_secret") && n.endsWith(".json")
    );
  } catch {
    names = [];
  }
  if (!names.length) return join(CREDENTIAL_DIR, "client_secret_<from-cloud-console>.json");
  const withTimes = await Promise.all(
    names.map(async (n) => {
      const full = join(CREDENTIAL_DIR, n);
      return { full, mtime: (await stat(full)).mtimeMs };
    })
  );
  withTimes.sort((a, b) => b.mtime - a.mtime);
  return withTimes[0].full;
}

export function tokenPath() {
  if (process.env.GSC_TOKEN_FILE) return process.env.GSC_TOKEN_FILE;
  // Beside the client secrets, i.e. outside the repo. Deliberately not keyed to
  // a client id: one authorised account is what matters, not which client was
  // used to authorise it.
  return join(CREDENTIAL_DIR, ".gsc-token.json");
}

export async function loadClient() {
  const path = await clientSecretPath();
  let raw;
  try {
    raw = await readFile(path, "utf8");
  } catch {
    throw new Error(
      `Could not read the OAuth client file at:\n  ${path}\n` +
        `Set GSC_CLIENT_SECRET_FILE to its location.`
    );
  }
  const parsed = JSON.parse(raw);
  const cfg = parsed.web ?? parsed.installed;
  if (!cfg?.client_id || !cfg?.client_secret) {
    throw new Error(`${path} does not look like a Google OAuth client file.`);
  }
  return {
    clientId: cfg.client_id,
    clientSecret: cfg.client_secret,
    authUri: cfg.auth_uri ?? "https://accounts.google.com/o/oauth2/auth",
    tokenUri: cfg.token_uri ?? "https://oauth2.googleapis.com/token",
    registeredRedirects: cfg.redirect_uris ?? [],
    projectId: cfg.project_id,
    kind: parsed.web ? "web" : "installed",
  };
}

export async function saveRefreshToken(refreshToken, meta = {}) {
  const path = tokenPath();
  await mkdir(dirname(path), { recursive: true });
  await writeFile(
    path,
    JSON.stringify({ refresh_token: refreshToken, ...meta }, null, 2),
    { mode: 0o600 }
  );
  return path;
}

export async function loadRefreshToken() {
  try {
    const parsed = JSON.parse(await readFile(tokenPath(), "utf8"));
    return parsed.refresh_token ?? null;
  } catch {
    return null;
  }
}

export function buildConsentUrl(client, state, redirectUri = REDIRECT_URI) {
  const p = new URLSearchParams({
    client_id: client.clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: SCOPES.join(" "),
    // offline + consent is what actually returns a refresh_token; without
    // prompt=consent Google omits it on re-authorisation.
    access_type: "offline",
    prompt: "consent",
    include_granted_scopes: "true",
    state,
  });
  return `${client.authUri}?${p}`;
}

/**
 * Ask Google whether REDIRECT_URI is registered for this client, instead of
 * trusting the redirect_uris in the downloaded client_secret json — that file is
 * a snapshot and does NOT change when a URI is added in Cloud Console, so
 * trusting it would keep blocking a setup that is actually fine.
 *
 * Google answers a bad redirect with a 302 to /signin/oauth/error carrying a
 * base64 `authError` blob; the reason string is inside it.
 */
export async function probeRedirectUri(client, redirectUri = REDIRECT_URI) {
  const url = buildConsentUrl(client, "probe", redirectUri);
  let res;
  try {
    res = await fetch(url, { redirect: "manual" });
  } catch (e) {
    return { ok: false, reason: `could not reach Google: ${e.message}` };
  }
  const location = res.headers.get("location") ?? "";
  const authError = new URL(location, "https://accounts.google.com").searchParams.get("authError");
  if (!authError) {
    // No error payload -> Google is willing to show the consent/sign-in screen.
    return { ok: true, reason: null };
  }
  let decoded = "";
  try {
    decoded = Buffer.from(authError, "base64").toString("utf8");
  } catch {
    decoded = authError;
  }
  const reason = /redirect_uri_mismatch/.test(decoded)
    ? "redirect_uri_mismatch"
    : (decoded.match(/^[ -~]+/) ?? ["unknown OAuth error"])[0];
  return { ok: false, reason };
}

/**
 * Decide which redirect URI to use.
 *
 * The loopback gives a hands-off flow — a local listener catches the code — but
 * Google only allows it if it has been registered for the client. When it has
 * not, fall back to whichever URI the client *does* have registered and hand
 * the code over by paste instead. That keeps the setup working without anyone
 * having to edit the client in Cloud Console.
 */
export async function pickRedirect(client) {
  const probe = await probeRedirectUri(client, REDIRECT_URI);
  if (probe.ok) return { uri: REDIRECT_URI, mode: "loopback", reason: null };

  const registered = client.registeredRedirects.filter((u) => /^https?:\/\//.test(u));
  for (const uri of registered) {
    const p = await probeRedirectUri(client, uri);
    if (p.ok) return { uri, mode: "paste", reason: probe.reason };
  }
  return { uri: null, mode: "none", reason: probe.reason };
}

/**
 * Accepts either a bare authorisation code or the whole URL the browser was
 * redirected to — pasting the address bar is easier to get right than picking
 * the code out of it, and the code contains characters (`/`) that make people
 * think they have selected too much.
 */
export function extractCode(input) {
  const raw = String(input).trim().replace(/^["']|["']$/g, "");
  if (!/^https?:\/\//.test(raw)) return { code: raw, state: null };
  const u = new URL(raw);
  const err = u.searchParams.get("error");
  if (err) throw new Error(`Google reported "${err}" instead of a code.`);
  const code = u.searchParams.get("code");
  if (!code) {
    throw new Error(
      "That URL has no ?code= in it. Copy the address bar *after* granting access."
    );
  }
  return { code, state: u.searchParams.get("state") };
}

export async function exchangeCode(client, code, redirectUri = REDIRECT_URI) {
  const res = await fetch(client.tokenUri, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: client.clientId,
      client_secret: client.clientSecret,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }),
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(`token exchange failed (${res.status}): ${JSON.stringify(json)}`);
  }
  return json;
}

/** In-memory access token, refreshed when it is within 60s of expiry. */
let cached = { token: null, expiresAt: 0 };

export async function getAccessToken({ force = false } = {}) {
  if (!force && cached.token && Date.now() < cached.expiresAt - 60_000) {
    return cached.token;
  }
  const client = await loadClient();
  const refreshToken = await loadRefreshToken();
  if (!refreshToken) {
    throw new Error(
      `No refresh token yet. Run the one-time consent step:\n` +
        `  cd tools/gsc-mcp && npm run auth\n` +
        `(expected token file: ${tokenPath()})`
    );
  }
  const res = await fetch(client.tokenUri, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: client.clientId,
      client_secret: client.clientSecret,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(
      `Could not refresh the access token (${res.status}): ${JSON.stringify(json)}\n` +
        `If this says invalid_grant the consent was revoked — re-run: npm run auth`
    );
  }
  cached = {
    token: json.access_token,
    expiresAt: Date.now() + (json.expires_in ?? 3600) * 1000,
  };
  return cached.token;
}

/**
 * Call a Google API and turn failures into messages worth reading. The two that
 * actually happen are a disabled API (with an enable URL in the payload) and a
 * property the authorised account cannot see — both look like generic 403s
 * unless the body is surfaced.
 */
export async function googleFetch(url, { method = "GET", body } = {}) {
  const token = await getAccessToken();
  const res = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(body ? { "Content-Type": "application/json" } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });

  const text = await res.text();
  let json = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    /* keep the raw text below */
  }

  if (!res.ok) {
    const detail = json?.error?.message ?? text.slice(0, 400);
    const reason = json?.error?.details?.[0]?.reason ?? json?.error?.status ?? "";
    let hint = "";
    if (res.status === 403 && /has not been used|is disabled/i.test(detail)) {
      hint =
        "\nHint: enable the Search Console API for this Google Cloud project — " +
        "the URL to do it is in the message above.";
    } else if (res.status === 403) {
      hint =
        "\nHint: the authorised Google account may not have access to this " +
        "property in Search Console. Check with gsc_list_sites.";
    }
    throw new Error(`${method} ${url} -> ${res.status} ${reason}\n${detail}${hint}`);
  }

  return json;
}
