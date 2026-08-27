#!/usr/bin/env node
/**
 * One-time Google consent for the Search Console MCP server.
 *
 *   node auth.mjs           run the consent flow
 *   node auth.mjs --check    don't authorise, just report whether it works
 *
 * Starts a loopback listener, prints the URL to open, catches the redirect, and
 * saves the refresh token. After this the MCP server runs unattended.
 */
import { createServer } from "node:http";
import { randomBytes } from "node:crypto";
import {
  loadClient,
  buildConsentUrl,
  probeRedirectUri,
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

async function check() {
  console.log(line);
  console.log("Search Console MCP — connection check");
  console.log(line);
  const client = await loadClient();
  console.log(`client file   ${clientSecretPath()}`);
  console.log(`client type   ${client.kind}   project ${client.projectId}`);
  console.log(`token file    ${tokenPath()}`);
  console.log(`refresh token ${(await loadRefreshToken()) ? "present" : "MISSING — run: npm run auth"}`);

  if (!(await loadRefreshToken())) process.exit(1);

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

async function authorise() {
  const client = await loadClient();

  // Ask Google rather than reading redirect_uris out of the downloaded json:
  // that file is a snapshot and does not change when a URI is added in Cloud
  // Console, so trusting it would keep blocking a setup that is already fixed.
  const probe = await probeRedirectUri(client);
  if (!probe.ok) {
    console.error(line);
    console.error(`Google rejected the loopback redirect: ${probe.reason}`);
    console.error(line);
    console.error(`This is a "${client.kind}" client. The redirect URIs in the`);
    console.error(`downloaded json (possibly out of date) are:`);
    for (const u of client.registeredRedirects) console.error(`    ${u}`);
    console.error(`\nA local MCP server needs this one:`);
    console.error(`    ${REDIRECT_URI}`);
    console.error(`\nAdd it once in Google Cloud Console:`);
    console.error(`  console.cloud.google.com/apis/credentials?project=${client.projectId}`);
    // The numeric prefix is what identifies the client in the console list;
    // the ...apps.googleusercontent.com suffix is the same for every client.
    console.error(`  -> the OAuth 2.0 Client ID starting ${client.clientId.split(".")[0].slice(0, 26)}…`);
    console.error(`  -> Authorized redirect URIs -> ADD URI -> ${REDIRECT_URI} -> SAVE`);
    console.error(`\nGoogle allows http://localhost for web clients, so this is fine.`);
    console.error(`Then run this again. (Or create a "Desktop app" client instead and`);
    console.error(`point GSC_CLIENT_SECRET_FILE at its JSON — those need no URI.)`);
    process.exit(2);
  }

  const state = randomBytes(16).toString("hex");
  const url = buildConsentUrl(client, state);

  const result = await new Promise((resolve, reject) => {
    const server = createServer(async (req, res) => {
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
      if (u.searchParams.get("state") !== state) {
        send(400, "<h2>State mismatch — start over.</h2>");
        server.close();
        reject(new Error("state mismatch"));
        return;
      }
      const err = u.searchParams.get("error");
      if (err) {
        send(400, `<h2>Consent refused: ${err}</h2>`);
        server.close();
        reject(new Error(`consent refused: ${err}`));
        return;
      }
      const code = u.searchParams.get("code");
      send(200, "<h2>Done.</h2><p>You can close this tab and go back to the terminal.</p>");
      server.close();
      resolve(code);
    });
    server.on("error", reject);
    server.listen(REDIRECT_PORT, "127.0.0.1", () => {
      console.log(line);
      console.log("Open this URL in your browser and grant access:");
      console.log(line);
      console.log(url);
      console.log(line);
      console.log(`Waiting for the redirect on ${REDIRECT_URI} …`);
    });
  });

  const tokens = await exchangeCode(client, result);
  if (!tokens.refresh_token) {
    throw new Error(
      "Google returned no refresh_token. Revoke this app's access at " +
        "myaccount.google.com/permissions and run this again."
    );
  }
  const saved = await saveRefreshToken(tokens.refresh_token, {
    scopes: SCOPES,
    client_id: client.clientId,
    obtained_at: new Date().toISOString(),
  });
  console.log(`\nRefresh token saved to ${saved}`);
  console.log("Verifying …\n");
  await check();
}

const mode = process.argv.includes("--check") ? check : authorise;
mode().catch((e) => {
  console.error(`\n${e.message}`);
  process.exit(1);
});
