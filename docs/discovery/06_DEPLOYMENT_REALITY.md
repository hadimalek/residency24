# 06 — Deployment Reality

**Status:** Discovery
**Last updated:** 2026-04-25
**Phase:** 1-A (read-only)

---

## How the project actually deploys today

The active deployment is **PM2 on a server at `/var/www/residency24`**. Here is the flow as it currently exists, reconstructed from `deploy.sh` and `ecosystem.config.js`.

```
┌──────────────┐        ┌────────────────────────┐
│   Dev push   │        │ Production server       │
│   git push   │ ─────► │ /var/www/residency24    │
└──────────────┘        │                         │
                        │ 1. git pull (rebase)    │
                        │ 2. npm ci               │
                        │ 3. prisma generate      │
                        │ 4. prisma db push       │ ← schema sync, no migration history
                        │ 5. npm run build        │
                        │ 6. copy public/.next/   │
                        │    /prisma/.env into    │
                        │    .next/standalone/    │
                        │ 7. pm2 restart          │
                        │                         │
                        │ Process:                │
                        │ ┌─────────────────────┐ │
                        │ │ pm2 → node          │ │
                        │ │ .next/standalone/   │ │
                        │ │ server.js           │ │
                        │ │ on port 3000        │ │
                        │ └─────────────────────┘ │
                        └─────────────────────────┘
```

The deploy is triggered manually by SSH-ing to the server and running `bash deploy.sh` (or `bash deploy.sh <branch>` for a non-`main` deploy). There is **no GitHub Actions workflow**, **no webhook**, **no automated CI**.

---

## `deploy.sh` line-by-line

```bash
#!/usr/bin/env bash
set -euo pipefail
```
Strict mode: exit on any error, undefined var, or pipe failure. Good.

```bash
BRANCH="${1:-main}"
APP_DIR="/var/www/residency24"
```
Branch defaults to `main`. App directory is hard-coded.

```bash
cd "$APP_DIR" || { echo "ERROR: $APP_DIR not found"; exit 1; }
```
Bail if the dir doesn't exist.

```bash
git pull origin "$BRANCH" --rebase
npm ci
npx prisma generate --schema=./prisma/schema.prisma
npx prisma db push --schema=./prisma/schema.prisma     # ⚠️ see below
npm run build
```
Standard build pipeline. **The use of `prisma db push` instead of `prisma migrate deploy` is a known issue** — `db push` is fine for SQLite during prototyping, but on MySQL with real data it will:
- silently drop columns if the schema diverges (with `--accept-data-loss`)
- never produce a SQL audit trail
- cause divergence between environments

For the MySQL migration, this line **must change** to `npx prisma migrate deploy`, and you must commit a `prisma/migrations/` folder. (That's a Phase 1-B task, not now.)

```bash
echo "==> Setting up standalone..."
cp -r public .next/standalone/public 2>/dev/null || true
cp -r .next/static .next/standalone/.next/static 2>/dev/null || true
cp -r prisma .next/standalone/prisma 2>/dev/null || true
cp .env .next/standalone/.env 2>/dev/null || true
```
This block assumes `.next/standalone/` exists. **But `next.config.ts` currently has `output: "standalone"` commented out**, so `.next/standalone/` will NOT be produced by `npm run build`. Every `cp` here will silently fail (`2>/dev/null || true` swallows the error). **The `pm2 restart` immediately below is then trying to run `.next/standalone/server.js` — which doesn't exist either.**

> 🚨 **The deploy script in its current state will silently fail to update the running app.** If PM2 is already running with an old `.next/standalone/server.js` from a previous build (when standalone WAS enabled), the process will continue running the old code indefinitely. Confirm with the user whether the live site has actually been updated since commit `1b1a4f7` ("fix: disable standalone output so npm start works correctly").
>
> This is the **single biggest find** in the deployment audit and must be resolved before Phase 1-B touches the database.

```bash
pm2 restart residency24 || pm2 start ecosystem.config.js
```
Restart by name, falling back to first-time start.

---

## `ecosystem.config.js`

```js
module.exports = {
  apps: [{
    name: "residency24",
    script: ".next/standalone/server.js",     // ← assumes standalone build
    cwd: "/var/www/residency24",
    env: {
      NODE_ENV: "production",
      PORT: 3000,
      HOSTNAME: "0.0.0.0",
    },
    instances: 1,
    autorestart: true,
    max_memory_restart: "512M",
  }],
};
```

| Key | Value | Notes |
|-----|-------|-------|
| `name` | `residency24` | PM2 process identifier |
| `script` | `.next/standalone/server.js` | **Same standalone-output mismatch as `deploy.sh`.** |
| `cwd` | `/var/www/residency24` | **Matches** `APP_DIR` in `deploy.sh`. No inconsistency between these two files. |
| `instances` | `1` | Single process. No clustering. |
| `max_memory_restart` | `512M` | Auto-restart if it grows past 512 MB. Reasonable for a small app; raise if MySQL connection pooling pushes it higher. |

Env vars in `ecosystem.config.js` are limited to `NODE_ENV`, `PORT`, `HOSTNAME`. **All other env vars (`DATABASE_URL`, `OPENAI_API_KEY`, `NEXTAUTH_SECRET`, etc.) are sourced from `/var/www/residency24/.env` via the `cp .env .next/standalone/.env` step in `deploy.sh`.** This is fragile but works.

---

## `APP_DIR` consistency check

The user's earlier brief mentioned an "APP_DIR inconsistency between deploy.sh and ecosystem.config.js". I verified:

- `deploy.sh` line 19: `APP_DIR="/var/www/residency24"`
- `ecosystem.config.js` line 6: `cwd: "/var/www/residency24"`

> ✅ **They match.** No inconsistency between these two files.

There **is** a different inconsistency though: the comment block at the top of `deploy.sh` (lines 7–15) says:

```
First time setup:
  1. Clone repo to /opt/residency24
```

But `APP_DIR` is `/var/www/residency24`. **The setup comment is stale** and should be corrected to `/var/www/residency24` to match. (Cleanup task — flag for Phase 1-B.)

---

## Migration tooling currently in use

| Step | Tool used | Recommended for MySQL |
|------|-----------|------------------------|
| Schema sync | `prisma db push` | ❌ Replace with `prisma migrate deploy` (production) and `prisma migrate dev` (local) |
| Migration history | none (no `prisma/migrations/` folder) | Bootstrap with `prisma migrate dev --name init` |
| Seed | `npx tsx prisma/seed.ts` (run manually after first push, per the comment in `deploy.sh`) | Keep — but make `admin123` env-var-driven |

---

## Where secrets live on the production server

- `/var/www/residency24/.env` (created manually by the deployer at first setup, per the comment block).
- This file gets copied into `/var/www/residency24/.next/standalone/.env` by `deploy.sh` so the standalone server can read it from its own working directory.
- **Not** in the PM2 ecosystem file (only `NODE_ENV`/`PORT`/`HOSTNAME` are there).
- **Not** in any vault, secret manager, or encrypted store.

For MySQL, the new `DATABASE_URL` will simply be added/edited in the same `.env` file:

```ini
# Old:
DATABASE_URL="file:./dev.db"
# New (example):
DATABASE_URL="mysql://r24user:STRONG_PASSWORD@localhost:3306/residency24?connection_limit=10"
```

---

## Is the project actually deployed somewhere right now?

I cannot determine this from inside the sandbox. Indicators that suggest "yes":

- `https://residency24.com` is referenced as the public URL throughout `src/lib/seo.ts` (`BASE_URL`).
- The team has been actively committing for weeks, including hero text and price tweaks — suggests live iteration.
- Sitemaps point to `https://residency24.com/{locale}/` paths.

But I have no proof the live site is serving the **current Next.js code** vs. the legacy WordPress. **The user must answer this** before Phase 1-B (see Open Questions in `11_RECOMMENDED_NEXT_STEPS.md`).

---

## CI / GitHub Actions

**None.** No `.github/workflows/` directory exists. No automated lint, no automated tests, no automated deploy. Every change goes from local `git push` → manual `bash deploy.sh` on the server.

For the MySQL migration, this is actually a *good* thing — it means we don't need to worry about CI breaking on the schema change. But it's worth documenting because Phase 2+ should add at least a basic CI (`npm ci && npx prisma generate && npm run build && npm run lint`) to catch regressions.

---

## Summary of issues to fix in Phase 1-B (before MySQL cut-over)

| # | Issue | Severity | Fix |
|---|-------|----------|-----|
| 1 | `output: "standalone"` is commented out in `next.config.ts` but `deploy.sh` and `ecosystem.config.js` both depend on `.next/standalone/server.js` | 🔴 **Deploy is broken** | Either re-enable standalone output AND drop `npm start` use, OR rewrite `deploy.sh` to use `npm start` with a `next start`-compatible PM2 script. |
| 2 | `deploy.sh` uses `prisma db push` instead of `prisma migrate deploy` | 🟡 Will break on MySQL with data | Bootstrap migrations folder, switch the command. |
| 3 | `prisma/migrations/` does not exist | 🟡 No audit trail | Run `npx prisma migrate dev --name init` after switching to MySQL provider. |
| 4 | `deploy.sh` setup comment references wrong path (`/opt/residency24` vs `/var/www/residency24`) | 🟢 Documentation drift | Edit comment. |
| 5 | No automated CI to catch deploy-script breakage | 🟢 Quality of life | Add minimal GitHub Actions workflow. |

---

**End of report.**
