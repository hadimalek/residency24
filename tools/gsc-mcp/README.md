# Search Console MCP (residency24)

A local stdio MCP server that gives Claude read access to Google Search Console
for residency24.com. Registered in the repo's `.mcp.json` as `residency24-gsc`.

## Tools

| Tool | What it answers |
|---|---|
| `gsc_list_sites` | Which properties the authorised account can see, and in which exact form (`sc-domain:…` vs `https://…`). Run this first when anything 403s. |
| `gsc_search_analytics` | Clicks / impressions / CTR / average position by any dimensions (`query`, `page`, `date`, `country`, `device`, `searchAppearance`), with filters. |
| `gsc_top_pages` | Shortcut: best pages for a trailing window, optionally under one path. |
| `gsc_inspect_url` | Google's own verdict for a single URL — indexed or not and why, the canonical Google chose vs the one declared, last crawl, robots state, which sitemaps reference it. Quota 2000/day per property. |
| `gsc_list_sitemaps` | Submitted sitemaps, last downloaded, error/warning counts, URLs found per type. |

Scope is `webmasters.readonly`, so nothing here can modify the property.

## One-time setup

### 1. Register the loopback redirect URI

The OAuth client in use (`gtm-claude-mcp-498114`) is a **Web application** client
created for a hosted claude.ai connector, so its only redirect URI is
`https://claude.ai/api/mcp/auth_callback`. A local server needs a loopback URI,
which Google permits for web clients but which must be registered:

1. <https://console.cloud.google.com/apis/credentials?project=gtm-claude-mcp-498114>
2. Open the OAuth 2.0 Client ID starting `553917233521-9j1h7pbmk23v7…`
3. **Authorized redirect URIs → ADD URI →** `http://localhost:8765/oauth2callback` → **SAVE**

Alternatively create a **Desktop app** client — those accept loopback redirects
with no registration — and point `GSC_CLIENT_SECRET_FILE` at its JSON.

### 2. Enable the API

The Search Console API must be on for that project:
<https://console.cloud.google.com/apis/library/searchconsole.googleapis.com?project=gtm-claude-mcp-498114>

### 3. Grant consent

```bash
cd tools/gsc-mcp
npm install
npm run auth
```

It prints a URL, waits on the loopback, and saves the refresh token. **Sign in
with a Google account that has access to the residency24 property in Search
Console** — the OAuth client's project is unrelated to which properties you can
read; that comes from the account you pick.

Verify any time without re-authorising:

```bash
npm run check
```

## Where the secrets live

Nothing sensitive is in this repo.

| | Default location | Override |
|---|---|---|
| OAuth client id/secret | `~/Desktop/residency file/client_secret_…json` | `GSC_CLIENT_SECRET_FILE` |
| Refresh token | `~/Desktop/residency file/.gsc-token.json` (mode 600) | `GSC_TOKEN_FILE` |
| Default property | `sc-domain:residency24.com` | `GSC_SITE_URL` |
| Loopback port | `8765` | `GSC_OAUTH_PORT` |

Only the refresh token is stored; access tokens stay in memory and are refreshed
on demand. `.gitignore` also blocks `client_secret*.json` and `.gsc-token.json`
in case someone points those paths in here.

## Notes

- **Data lag.** Search Console is 2–3 days behind, so `end_date` defaults to 3
  days ago. Asking for yesterday returns zeros and looks like a bug.
- **Property form matters.** A Domain property is `sc-domain:residency24.com`, a
  URL-prefix property is `https://residency24.com/`. The wrong form returns 403,
  not 404. `gsc_list_sites` shows which exists.
- **`invalid_grant` on refresh** means consent was revoked or the token was
  rotated — re-run `npm run auth`.

## Testing the protocol without credentials

```bash
printf '%s\n%s\n%s\n' \
  '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"probe","version":"0"}}}' \
  '{"jsonrpc":"2.0","method":"notifications/initialized"}' \
  '{"jsonrpc":"2.0","id":2,"method":"tools/list"}' \
  | node server.mjs
```
