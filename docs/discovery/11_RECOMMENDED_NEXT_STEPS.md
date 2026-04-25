# 11 — Recommended Next Steps

**Status:** Discovery
**Last updated:** 2026-04-25
**Phase:** 1-A (read-only) → outputs feed into 1-B and 1-C

---

## 1. Recommended path forward

### For local development on Windows: Docker for MySQL only

Use a small `docker-compose.dev.yml` that runs **only** a MySQL 8 container with a named volume. Keep `npm run dev` for the app. This:

- Doesn't require installing MySQL Server on Windows.
- Makes "wipe the database, start fresh" trivial (`docker compose down -v`).
- Doesn't change anything about how the Next.js app runs locally.

Sketch (do NOT apply yet — Phase 1-B):

```yaml
# docker-compose.dev.yml
services:
  mysql:
    image: mysql:8.0
    ports:
      - "3306:3306"
    environment:
      MYSQL_ROOT_PASSWORD: rootpass
      MYSQL_DATABASE: residency24
      MYSQL_USER: r24user
      MYSQL_PASSWORD: devpass
    volumes:
      - r24-mysql:/var/lib/mysql
    restart: unless-stopped
volumes:
  r24-mysql:
```

Then `DATABASE_URL="mysql://r24user:devpass@localhost:3306/residency24"`.

### For production: install MySQL 8 directly on the existing server

The current production model is "PM2 on a single server". Adding Docker for one extra service complicates ops without adding value at this scale. Install MySQL 8 with the package manager (`apt`/`dnf`), enable strong-password auth, create the `residency24` database and a non-root user, and point `DATABASE_URL` at `localhost:3306`.

This keeps the deploy mental model unchanged: PM2 still runs the Node process, MySQL is just another systemd service alongside.

### Why this split

- Local: developer convenience > ops parity. Devs want fast spin-up/teardown; Docker delivers that.
- Prod: ops simplicity > dev parity. One service per server keeps incident response straightforward.

If the user explicitly wants dev/prod parity, switch both to Docker (Option 3 in `05_DOCKER_SETUP_EXPLAINED.md`). That requires also fixing the standalone-output mismatch and writing migrations — more work for Phase 1-B.

---

## 2. Pre-flight checklist (must complete BEFORE Phase 1-B starts)

Tick each item before you run a single migration command.

- [ ] **Run the SQLite-discovery commands from `04_SQLITE_DATA_AUDIT.md` on your Windows dev machine.** Report back: file found / not found / size / row counts.
- [ ] **Run the same discovery commands on the production server** (SSH into `/var/www/residency24` and check `prisma/dev.db`). Report back the same.
- [ ] **If any `.db` file was found**, copy it to a safe place and label it (`dev.db.backup-2026-04-25`). Do not skip this even if you're "pretty sure" there's no data.
- [ ] **Tag the current commit** so you can roll back: `git tag -a pre-mysql-migration-$(date +%Y%m%d) -m "Last commit on SQLite" && git push origin pre-mysql-migration-$(date +%Y%m%d)`.
- [ ] **Confirm the production server's actual hostname and SSH access** so we can verify the deploy.
- [ ] **Confirm the live status of `https://residency24.com`** — is it serving the new Next.js code or still the old WordPress?
- [ ] **Resolve the `next.config.ts` standalone-output mismatch** (see `06_DEPLOYMENT_REALITY.md` and risk #4 in `10_MIGRATION_RISK_ASSESSMENT.md`). This is the single biggest blocker.
- [ ] **Push this `phase-1a-discovery` branch** to origin for safekeeping (optional but recommended): `git push -u origin phase-1a-discovery`.
- [ ] **Decide on the local-MySQL approach** (Docker vs. native install on Windows). Default recommendation above is Docker.

---

## 3. Open questions for the user

Answer these before starting Phase 1-B. Any "I don't know" is a yellow flag — investigate first.

1. **Is the live site (`https://residency24.com`) currently serving the new Next.js code, or is it still the legacy WordPress?**
2. **Have you ever run `npm run dev` and used the chat or the admin panel on your Windows laptop?** (If yes, real test data exists locally.)
3. **What is the production server's hostname / IP?** (Needed to inspect the live SQLite file.)
4. **Has the production server actually been updated since commit `1b1a4f7` ("disable standalone output")?** Or has it been silently running an older bundle from before that commit? See risk #4.
5. **Do you have admin users other than the seeded `admin@residency24.com`?** They will need to be re-imported into MySQL.
6. **Is there any data in the `Lead` table that has business value** (real prospect contacts) — even a single row? If yes, mass loss is unacceptable and Phase 1-C must include row-count verification.
7. **What database hosting do you want long-term in production?** Options:
   a. MySQL 8 installed on the same VM as the app (simplest, default recommendation).
   b. Managed MySQL (e.g. AWS RDS, DigitalOcean Managed Databases) — better backups and HA, costs more.
   c. MySQL in Docker on the same VM — middle ground, requires keeping the Docker setup current.
8. **Are you comfortable with `npm install --legacy-peer-deps`** if the React 19 + NextAuth v4 peer-dep resolution complains? (Phase 1-B will reinstall packages and may surface this.)
9. **Do you want the Docker setup kept in the repo as a future option, or removed?** It's broken right now (see `05_DOCKER_SETUP_EXPLAINED.md`).

---

## 4. Suggested shape of Phase 1-B (the actual migration work — for planning, not execution now)

Once the pre-flight checklist is green, Phase 1-B should be a small sequence of commits:

1. **Cleanup commit:** fix `next.config.ts` standalone output issue, pin Node version, add `.env` to `.dockerignore`, add `postinstall: prisma generate`. *No DB change yet.*
2. **MySQL provisioning commit:** add `docker-compose.dev.yml` with MySQL 8 service, document local startup in README. *Still on SQLite for the app itself.*
3. **Schema migration commit:** change `provider = "sqlite"` → `mysql`, add `@db.*` annotations from `03_PRISMA_CURRENT_STATE.md`, add new `@@index` directives.
4. **Migration bootstrap commit:** run `npx prisma migrate dev --name init` against the local MySQL container to generate `prisma/migrations/<timestamp>_init/migration.sql`. Commit the migrations folder. **Verify it compiles cleanly**.
5. **Seed parameterization commit:** make `admin123` env-var-driven, document `SEED_ADMIN_PASSWORD` in `.env.example`.
6. **Deploy script commit:** change `prisma db push` → `prisma migrate deploy` in `deploy.sh`. Update the setup-comment paths.

Each commit should pass `npm run build` and `npx prisma validate`. Push to a `phase-1b-mysql` branch and open a PR for review before merging to `main`.

Phase 1-C is the production cut-over: provision MySQL on the prod server, copy `.env` updates, run `bash deploy.sh`, run `npx prisma migrate deploy && npx prisma db seed`, smoke-test the regression checklist from `08_FUNCTIONALITY_INVENTORY.md`.

---

**End of report.**
