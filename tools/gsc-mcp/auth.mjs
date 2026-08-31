#!/usr/bin/env node
/**
 * One-time Google consent for the Search Console MCP server.
 *
 *   node auth.mjs                 start the flow
 *   node auth.mjs --url           just print the consent URL
 *   node auth.mjs --code <value>  finish it: <value> is the redirected URL, or
 *                                 the bare code out of it
 *   node auth.mjs --check         report whether it works, without authorising
 *
 * Two flows, chosen by what the OAuth client has registered. If the loopback
 * URI is registered this runs a local listener and the whole thing is hands
 * off. If not — the usual case for a client created for a hosted connector —
 * it uses whichever https URI *is* registered and the code comes back by
 * paste, so the setup works without editing the client in Cloud Console.
 */
import { createServer } from "node:http";
import { randomBytes } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import {
  loadClient,
  buildConsentUrl,
  pickRedirect,
  extractCode,
  exchangeCode,
  saveRefreshToken,
  loadRefreshToken,
  getAccessToken,
  googleFetch,
  clientSecretPath,
  tokenPath,
  REDIRECT_PORT,
  REDIRECT_URI,
  SCOPES,
} from "./google-auth.mjs";

const line = "─".repeat(72);
// Remembered between `--url` and `--code`, which run as separate processes.
const statePath = join(tmpdir(), "gsc-mcp-oauth-state.json");

async function check() {
  console.log(line);
  console.log("Search Console MCP — connection check");
  console.log(line);
  const client = await loadClient();
  console.log(`client file   ${await clientSecretPath()}`);
  console.log(`client type   ${client.kind}   project ${client.projectId}`);
  console.log(`token file    ${tokenPath()}`);
  const have = await loadRefreshToken();
  console.log(`refresh token ${have ? "present" : "MISSING — run: npm run auth"}`);

  if (!have) process.exit(1);

  await getAccessToken({ force: true });
  console.log("access token  obtained OK");

  const sites = await googleFetch("https://www.googleapis.com/webmasters/v3/sites");
  const entries = sites?.siteEntry ?? [];
  console.log(`\nproperties visible to this account (${entries.length}):`);
  for (const s of entries) {
    console.log(`  ${s.permissionLevel.padEnd(20)} ${s.siteUrl}`);
  }
  const r24 = entries.filter((s) => /residency24/i.test(s.siteUrl));
  console.log(
    r24.length
      ? `\nresidency24 found: ${r24.map((s) => s.siteUrl).join(", ")}`
      : "\nresidency24 NOT among them — authorise an account that has access to it."
  );
}

async function noUsableRedirect(client, reason) {
  console.error(line);
  console.error(`Google will not accept any redirect this client has: ${reason}`);
  console.error(line);
  console.error(`This is a "${client.kind}" client. Registered URIs:`);
  for (const u of client.registeredRedirects) console.error(`    ${u}`);
  console.error(`\nRegister one of these in Cloud Console and run this again:`);
  console.error(`    ${REDIRECT_URI}          (gives the hands-off local flow)`);
  console.error(`  console.cloud.google.com/apis/credentials?project=${client.projectId}`);
  console.error(
    `  -> the OAuth 2.0 Client ID starting ${client.clientId.split(".")[0].slice(0, 26)}…`
  );
  process.exit(2);
}

/** Print the URL to open, remembering the state so --code can verify it. */
async function printConsentUrl() {
  const client = await loadClient();
  const chosen = await pickRedirect(client);
  if (!chosen.uri) await noUsableRedirect(client, chosen.reason);

  const state = randomBytes(16).toString("hex");
  await writeFile(
    statePath,
    JSON.stringify({ state, redirectUri: chosen.uri, clientId: client.clientId }),
    { mode: 0o600 }
  );

  console.log(line);
  console.log("1. Open this URL and grant access. Sign in with the Google account");
  console.log("   that has residency24 in Search Console.");
  console.log(line);
  console.log(buildConsentUrl(client, state, chosen.uri));
  console.log(line);
  if (chosen.mode === "paste") {
    console.log(`2. Google then sends you to ${chosen.uri} with ?code=... appended.`);
    console.log(`   It will look like an ordinary page — the code is only in the URL.`);
    console.log(`   Copy the whole address bar, then run:`);
    console.log(`\n     node auth.mjs --code "<paste the URL here>"\n`);
  }
  return { client, chosen, state };
}

/** Finish the flow from a pasted URL or bare code. */
async function finishWithCode(input) {
  const client = await loadClient();
  const { code, state } = extractCode(input);

  let expected = null;
  try {
    expected = JSON.parse(await readFile(statePath, "utf8"));
  } catch {
    /* no remembered flow — fall through and probe instead */
  }
  if (expected && state && state !== expected.state) {
    throw new Error(
      "The state in that URL is not the one this flow issued. " +
        "Start over with: node auth.mjs --url"
    );
  }
  // The exchange only succeeds against the same redirect_uri the consent
  // request used, so prefer the remembered one over probing again.
  const redirectUri = expected?.redirectUri ?? (await pickRedirect(client)).uri;
  if (!redirectUri) throw new Error("No usable redirect URI for this client.");

  const tokens = await exchangeCode(client, code, redirectUri);
  if (!tokens.refresh_token) {
    throw new Error(
      "Google returned no refresh_token. Revoke this app at " +
        "myaccount.google.com/permissions and run the flow again."
    );
  }
  const saved = await saveRefreshToken(tokens.refresh_token, {
    scopes: SCOPES,
    client_id: client.clientId,
    obtained_at: new Date().toISOString(),
  });
  console.log(`Refresh token saved to ${saved}`);
  console.log("Verifying …\n");
  await check();
}

/** Loopback flow: we catch the redirect ourselves, nothing to paste. */
async function authoriseViaLoopback(state) {
  const code = await new Promise((resolve, reject) => {
    const server = createServer((req, res) => {
      const u = new URL(req.url, `http://localhost:${REDIRECT_PORT}`);
      if (u.pathname !== "/oauth2callback") {
        res.writeHead(404).end("not here");
        return;
      }
      const send = (status, msg) => {
        res.writeHead(status, { "Content-Type": "text/html; charset=utf-8" });
        res.end(
          `<html><body style="font:16px system-ui;padding:3rem;text-align:center">${msg}</body></html>`
        );
      };
      const fail = (shown, thrown) => {
        send(400, `<h2>${shown}</h2>`);
        server.close();
        reject(new Error(thrown));
      };
      if (u.searchParams.get("state") !== state) {
        return fail("State mismatch — start over.", "state mismatch");
      }
      const e = u.searchParams.get("error");
      if (e) return fail(`Consent refused: ${e}`, `consent refused: ${e}`);
      send(200, "<h2>Done.</h2><p>You can close this tab and go back to the terminal.</p>");
      server.close();
      resolve(u.searchParams.get("code"));
    });
    server.on("error", reject);
    server.listen(REDIRECT_PORT, "127.0.0.1", () =>
      console.log(`Waiting for the redirect on ${REDIRECT_URI} …`)
    );
  });
  await finishWithCode(code);
}

async function main() {
  const argv = process.argv.slice(2);
  if (argv.includes("--check")) return check();

  const codeAt = argv.indexOf("--code");
  if (codeAt !== -1) {
    const value = argv[codeAt + 1];
    if (!value) throw new Error("--code needs the redirected URL, or the code from it.");
    return finishWithCode(value);
  }

  const { chosen, state } = await printConsentUrl();
  if (argv.includes("--url")) return;
  if (chosen.mode === "loopback") return authoriseViaLoopback(state);
  // Paste mode cannot continue on its own; step 2 is already printed above.
}

main().catch((e) => {
  console.error(`\n${e.message}`);
  process.exit(1);
});
