# 09 — Production Items Deferred

**Status:** Reference (intentional out-of-scope list for Phase 1-B)
**Last updated:** 2026-04-25
**Phase:** 1-B → addressed in later phases when prerequisites are met

---

## Why this report exists

Phase 1-B intentionally limits itself to **local development setup**. The user
does not yet have a production VPS, the live site (`https://residency24.com`)
still serves WordPress, and there is no production data to migrate. Each item
below was deliberately deferred for a later phase, with a clear trigger for
when it becomes actionable.

---

## Deferred items

### 1. Production MySQL provisioning

**Trigger:** the user has a VPS / cloud server provisioned and ready to deploy.

**Options to choose between when the time comes:**

- **A — MySQL on the same VM as the app (simplest, recommended for single-server deploys).**
  - `apt install mysql-server-8.0` (Debian/Ubuntu) or `dnf install mysql-server` (RHEL/Rocky)
  - `mysql_secure_installation`
  - Create the `residency24` database and a non-root user
  - Bind to `127.0.0.1` (don't expose 3306 publicly)
  - `DATABASE_URL=mysql://r24user:STRONG_PASS@127.0.0.1:3306/residency24?connection_limit=10`

- **B — Managed MySQL (DigitalOcean, AWS RDS, PlanetScale-MySQL-compatible).**
  - Better backups, HA, monitoring out of the box
  - Higher recurring cost
  - `DATABASE_URL` becomes the managed service's connection string

- **C — MySQL in Docker on the same VM (middle ground).**
  - Reuse the `docker-compose.yml` from Phase 1-B with adjusted credentials
  - Requires keeping Docker installed and updated on the production VM
  - Easier dev/prod parity at the cost of more moving parts

**Default recommendation when this becomes actionable:** Option A for a single-server setup, Option B if HA matters.

---

### 2. `deploy.sh` fix (the broken standalone-output chain)

**Trigger:** before the first production deploy.

**Source:** `docs/discovery/06_DEPLOYMENT_REALITY.md` and risk #4 in
`docs/discovery/10_MIGRATION_RISK_ASSESSMENT.md`.

**Summary of the issue:** `next.config.ts` has `output: "standalone"`
commented out (commit `1b1a4f7`). `deploy.sh` and `ecosystem.config.js` both
depend on `.next/standalone/server.js` existing. Every `cp` in `deploy.sh` is
wrapped in `2>/dev/null || true`, silently swallowing failures. The PM2
restart "succeeds" while the on-disk code never changes.

**Fix options (pick one in Phase 1-C cleanup):**

- **A — re-enable `output: "standalone"`** in `next.config.ts` and accept that
  `npm start` won't work locally (use `npm run dev` for local; the standalone
  bundle is only for production).
- **B — rewrite `deploy.sh` and `ecosystem.config.js`** to use `next start`
  with PM2 (e.g. `pm2 start npm --name residency24 -- start`), drop the
  `cp .next/standalone/...` lines, and don't rely on standalone output at all.

The `Dockerfile` also depends on standalone output — it would need to be
re-tested after this is resolved.

---

### 3. `ecosystem.config.js` validation against actual server paths

**Trigger:** server is provisioned and `APP_DIR` is finalized.

Currently both `deploy.sh` (`APP_DIR=/var/www/residency24`) and
`ecosystem.config.js` (`cwd: /var/www/residency24`) are consistent. But the
setup-comment block at the top of `deploy.sh` mistakenly says "Clone repo to
`/opt/residency24`". Fix the comment when the server is real.

---

### 4. Production `.env` strategy

**Trigger:** before first production deploy.

Currently the deploy model is "create `.env` manually on the server, copy it
into `.next/standalone/.env` via `deploy.sh`". This is fragile but works for
single-server. Decide whether to:

- Keep manual `.env` per server (low overhead, low security)
- Move to a secret manager (AWS SSM Parameter Store, DigitalOcean App Platform secrets, HashiCorp Vault) — better for rotation and audit
- Use systemd's `EnvironmentFile=` and stop relying on the standalone copy step

---

### 5. MySQL backup automation

**Trigger:** production MySQL has any real data (i.e., real leads / sessions).

Until then, no backup needed.

When needed:

- **mysqldump cron** for small DBs (< 1 GB):
  ```bash
  0 3 * * * mysqldump -uroot -p$MYSQL_ROOT_PASSWORD residency24 \
    | gzip > /var/backups/r24-$(date +\%F).sql.gz
  ```
- **Managed-service automated backups** if Option 1.B was chosen.
- **Point-in-time recovery** via binary logs if RPO < 24h is required.

Combine with offsite storage (S3, Backblaze B2, Glacier).

---

### 6. Migration of 200 WordPress leads

**Trigger:** Phase 3 is complete (CMS data model exists with proper Lead-equivalent entities).

Out of scope for Phase 1. The plan when it becomes actionable:

1. Export WordPress leads to CSV (`wp-cli post-meta` or a custom SQL query against the WordPress DB).
2. Define a one-shot migration script in `prisma/scripts/import-wp-leads.ts`.
3. Map WordPress fields to `Lead` columns (or to whatever Lead-equivalent the future CMS uses).
4. Run on the production MySQL with explicit dry-run / count-verify steps.
5. Document in a new migration doc.

---

### 7. Production-grade authentication

**Trigger:** Phase 1-D (immediately after Phase 1-B verification).

**Source:** `docs/discovery/08_FUNCTIONALITY_INVENTORY.md` Authentication section, risk #8 in `10_MIGRATION_RISK_ASSESSMENT.md`.

The current auth is **broken**: an unsigned base64 cookie that anyone can
forge, with no middleware enforcing it on `/admin/*`. This must be fixed
before any production exposure.

Suggested approach:

- Replace the custom auth route with **Auth.js v5** (the React 19 / Next 16 friendly successor to NextAuth v4) using the Credentials provider.
- Add `proxy.ts` (Next.js 16's renamed middleware) to gate `/admin/*` and `/api/admin/*` routes.
- Rotate the seeded admin password to an env-var-driven value.
- Add a real logout route that clears the cookie.
- Schedule periodic password rotation.

---

### 8. CI / GitHub Actions

**Trigger:** anytime; quality-of-life improvement.

Add a minimal workflow that runs on every PR:

```yaml
# .github/workflows/ci.yml
name: CI
on: [pull_request]
jobs:
  build:
    runs-on: ubuntu-latest
    services:
      mysql:
        image: mysql:8.4
        env:
          MYSQL_ROOT_PASSWORD: ci
          MYSQL_DATABASE: residency24_ci
        ports: ["3306:3306"]
        options: >-
          --health-cmd "mysqladmin ping -uroot -pci"
          --health-interval 10s --health-retries 10
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20 }
      - run: npm ci
      - run: npx prisma generate
      - run: npx prisma migrate deploy
        env:
          DATABASE_URL: mysql://root:ci@127.0.0.1:3306/residency24_ci
      - run: npm run lint
      - run: npx tsc --noEmit
      - run: npm run build
```

---

## Summary table

| # | Deferred item | Trigger | Estimated effort |
|---|---------------|---------|------------------|
| 1 | Production MySQL provisioning | VPS exists | 0.5 day |
| 2 | `deploy.sh` fix | Before first prod deploy | 0.5 day |
| 3 | `ecosystem.config.js` validation | Server provisioned | 0.25 day |
| 4 | Production `.env` strategy | Before first prod deploy | 0.5 day |
| 5 | MySQL backup automation | Real data on prod | 1 day |
| 6 | WordPress leads import | Phase 3 done | 1–2 days |
| 7 | Production auth (Phase 1-D) | Immediately after 1-B verified | 2–3 days |
| 8 | CI / GitHub Actions | Anytime | 0.5 day |

**Total deferred effort: ~6–8 days** spread across multiple later phases.

---

**End of report.**
