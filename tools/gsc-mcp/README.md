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

### 1. Enable the API

The Search Console API has to be on for the client's Cloud project:
<https://console.cloud.google.com/apis/library/searchconsole.googleapis.com?project=gtm-claude-mcp-498114>

Nothing else here works until it is; requests come back as a 403 carrying the
enable URL, which `googleFetch` surfaces rather than swallowing.

### 2. Grant consent

```bash
cd tools/gsc-mcp
npm install
npm run auth
```

Which flow runs depends on what the OAuth client has registered, and `auth.mjs`
asks Google rather than trusting the downloaded json — that file is a snapshot
and does not change when a URI is added in Cloud Console.

**If `http://localhost:8765/oauth2callback` is registered**, this is hands off:
it prints a URL, listens on the loopback, catches the code and saves the token.

**Otherwise** it uses whichever https URI *is* registered. The client in use
registers `https://residency24.com`, so:

1. `npm run auth` prints a consent URL — open it, sign in with an account that
   has residency24 in Search Console, grant access.
2. Google sends the browser to `https://residency24.com/?code=…`. That renders
   as the ordinary homepage; the code is only in the address bar. (Verified: the
   site answers 200 there and does not redirect, so the query survives.)
3. Copy the whole address bar and finish:

```bash
node auth.mjs --code "<the URL you were sent to>"
```

`--code` also takes the bare code. `--url` prints the consent URL and stops,
which is useful when the person clicking is not the person at the terminal.

**Sign in with an account that has access to the residency24 property.** The
OAuth client's project has nothing to do with which properties you can read;
that comes entirely from the account you pick.

Verify any time without re-authorising:

```bash
npm run check
```

### Which client file is used

The newest `client_secret_*.json` in `~/Desktop/residency file/`. Creating a new
client in Cloud Console and dropping its download in there is all that is
needed — no code change. `GSC_CLIENT_SECRET_FILE` overrides it.

The refresh token is stored as `.gsc-token.json` in that same directory, and is
deliberately *not* keyed to a client id: what matters is which account was
authorised, not which client did the asking.

## Where the secrets live

Nothing sensitive is in this repo.

| | Default location | Override |
|---|---|---|
| OAuth client id/secret | newest `~/Desktop/residency file/client_secret_*.json` | `GSC_CLIENT_SECRET_FILE` |
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
