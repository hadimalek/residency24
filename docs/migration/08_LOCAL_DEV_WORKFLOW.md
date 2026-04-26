# 08 — Local Dev Workflow (after MySQL migration)

**Status:** Reference
**Last updated:** 2026-04-25
**Phase:** 1-B
**Audience:** any developer working on Residency24 locally on Windows

---

## One-time setup (Windows, fresh machine)

### Prerequisites

- **Node.js 20+** — install from https://nodejs.org or via `winget install OpenJS.NodeJS.LTS`
- **Docker Desktop for Windows** — install from https://www.docker.com/products/docker-desktop/
- **Git for Windows** — https://git-scm.com/download/win (includes Git Bash)
- A code editor — VS Code recommended

Verify:

```bash
node --version    # v20.9.0 or higher
npm --version     # 10.x or higher
docker --version
docker compose version
```

### First-time bring-up

```bash
# 1. Clone the repo
git clone <repo-url>
cd residency24

# 2. Install JS dependencies
npm ci

# 3. Set up env vars
cp .env.example .env

# Open .env in your editor and replace EVERY "CHANGE_ME*" with a strong
# local password. The MYSQL_PASSWORD and the password embedded in the
# DATABASE_URL must MATCH.

# 4. Start MySQL
docker compose up -d mysql

# Wait for healthy status (~15-30 seconds the first time)
docker compose ps

# 5. Apply the migration
npx prisma migrate deploy

# 6. Seed the database
npx prisma db seed

# 7. Generate the Prisma Client (usually automatic, but explicit is safer)
npx prisma generate

# 8. Start the dev server
npm run dev

# Open http://localhost:3000 — you'll be redirected to /en/
# Admin: http://localhost:3000/admin/login
#   email: admin@residency24.com
#   password: admin123  (change this immediately in production)
```

If anything fails, check the relevant migration doc:
- MySQL won't start → `03_MYSQL_STARTUP_NOTES.md`
- Migration fails → `04_MIGRATION_NOTES.md`
- Seed fails → `05_SEED_VERIFICATION.md`
- Smoke tests fail → `07_SMOKE_TEST_RESULTS.md`

---

## Daily workflow

```bash
# Make sure MySQL is up (no-op if already running)
docker compose up -d mysql

# Start the app
npm run dev
```

That's it. No need to re-run migrations or seed unless `prisma/schema.prisma`
changed.

---

## When you change `prisma/schema.prisma`

```bash
# Make sure MySQL is up
docker compose up -d mysql

# Generate a new migration AND apply it
npx prisma migrate dev --name <short_description_of_change>

# Restart the dev server (it auto-rebuilds, but Prisma client typing
# won't refresh in your IDE without a restart)
# Ctrl+C then: npm run dev
```

This:
1. Diffs the schema against the current DB state.
2. Generates `prisma/migrations/<timestamp>_<name>/migration.sql`.
3. Applies it.
4. Re-generates the Prisma client.

**Always commit** `prisma/migrations/` to git — that folder is the migration
history.

---

## When you pull changes that include a new migration

```bash
git pull
npm ci                            # in case package.json changed
docker compose up -d mysql
npx prisma migrate deploy         # apply any new migrations
npx prisma generate               # refresh client (usually a no-op)
npm run dev
```

Use `migrate deploy` (not `migrate dev`) when applying someone else's
migrations — it's non-interactive and never modifies the schema files.

---

## Useful Docker commands

```bash
docker compose ps                                # status of all services
docker compose logs mysql                        # full MySQL log
docker compose logs -f mysql                     # tail MySQL log
docker compose stop mysql                        # stop (data preserved)
docker compose start mysql                       # restart it
docker compose down                              # stop everything (data preserved)
docker compose down -v                           # ⚠️ DELETES the mysql-data volume
docker compose exec mysql bash                   # shell into the container
docker compose exec mysql mysql -uroot -p${MYSQL_ROOT_PASSWORD}   # MySQL CLI
```

---

## Useful Prisma commands

```bash
npx prisma studio                  # GUI at http://localhost:5555
npx prisma migrate status          # show which migrations are applied
npx prisma migrate reset           # ⚠️ wipes DB and re-applies all migrations
npx prisma db seed                 # re-run the seed (idempotent for User)
npx prisma format                  # auto-format schema.prisma
npx prisma validate                # lint schema.prisma
npx prisma generate                # regenerate Prisma Client
```

---

## Common pitfalls

### "drift detected"

Means MySQL has tables/columns that Prisma didn't create. Most often happens
if someone ran `prisma db push` against this DB before migrations existed.

**Fix:** `npx prisma migrate reset` (LOCAL DEV ONLY — wipes data, then re-applies migrations and re-seeds).

### Type errors after pulling a schema change

```bash
npx prisma generate
# Then in VS Code: Cmd/Ctrl+Shift+P → "TypeScript: Restart TS server"
```

### "Database `residency24` does not exist"

The MySQL container's data dir was created with no `MYSQL_DATABASE` env var
set. Most likely you started the container before filling in `.env`.

**Fix (LOCAL DEV ONLY):**
```bash
docker compose down -v
# Make sure .env is filled in correctly
docker compose up -d mysql
npx prisma migrate deploy
npx prisma db seed
```

### Port 3306 already in use

See `03_MYSQL_STARTUP_NOTES.md` section A.

---

## Wiping everything and starting fresh (nuclear option)

```bash
docker compose down -v        # deletes the MySQL data volume
rm -rf node_modules           # nuclear node_modules wipe
rm -rf .next                  # nuclear Next.js cache wipe
npm ci                        # reinstall
docker compose up -d mysql
npx prisma migrate deploy
npx prisma db seed
npm run dev
```

Useful if your local state has gotten weird and you want a guaranteed clean
slate.

---

## What this workflow does NOT cover

- **Production deploy** — see `09_PRODUCTION_DEFERRED.md` (deferred until VPS exists)
- **Auth fixes** — see Phase 1-D plan (the custom base64 cookie auth is broken)
- **WordPress-leads import** — separate phase, after CMS data model is built
- **CMS data model** — Phase 3 in `docs/discovery/00_DISCOVERY_SUMMARY.md`

---

**End of report.**
