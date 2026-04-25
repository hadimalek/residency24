# 00 — Phase 1-B: MySQL Migration Setup — Summary

**Status:** File-edits complete; runtime steps await user execution on Windows
**Last updated:** 2026-04-25
**Branch:** `phase-1b-mysql-migration` (committed locally; not pushed)
**Sandbox:** Linux, Node 22.22.2, Docker CLI present but daemon unreachable

---

## TL;DR

All file edits and the baseline migration SQL are in place on the
`phase-1b-mysql-migration` branch. The user needs to run the **runtime
steps** (`docker compose up`, `prisma migrate deploy`, `db seed`, smoke tests)
on their Windows machine — those couldn't be executed in the sandbox because
no Docker daemon is running here.

**The migration is mechanically ready. It just needs you to push the buttons.**

---

## What was done in this sandbox

| # | Task | Sandbox status | Output |
|---|------|----------------|--------|
| 0 | Pre-flight (branch, Docker check) | ✅ done | Branch `phase-1b-mysql-migration` created |
| 1 | Backup SQLite | ✅ no DB to back up | `01_SQLITE_BACKUP.md` |
| 2 | `docker-compose.yml` add MySQL | ✅ done | `mysql:8.4` service, healthcheck, `web` updated |
| 3 | `.env.example` add MySQL vars | ✅ done | `DATABASE_URL`, `MYSQL_*`, `SHADOW_DATABASE_URL` |
| 4 | `prisma/schema.prisma` switch + annotations + indexes | ✅ done | provider `mysql`, `@db.VarChar`/`@db.Text`, 7 new indexes |
| 5 | Old migrations folder | ✅ none existed | `02_OLD_MIGRATIONS_HANDLING.md` |
| 4.4 | `prisma format` + `prisma validate` | ✅ both pass | schema is valid 🚀 |
| — | Generate baseline `migration.sql` | ✅ done | `prisma/migrations/20260425201310_init_mysql/migration.sql` (118 lines) |
| 6 | `docker compose up -d mysql` | ⏸ deferred to user | `03_MYSQL_STARTUP_NOTES.md` |
| 7 | `prisma migrate deploy` | ⏸ deferred to user | `04_MIGRATION_NOTES.md` |
| 8 | `prisma db seed` | ⏸ deferred to user | `05_SEED_VERIFICATION.md` |
| 9 | `tsc --noEmit` + `npm run lint` | ⏸ deferred to user | `06_TYPE_CHECK_RESULTS.md` |
| 10 | Dev server boot test | ⏸ deferred to user | `07_SMOKE_TEST_RESULTS.md` |
| 11 | `package.json` Prisma block check | ✅ already correct | no edit needed |
| 12 | Local dev workflow doc | ✅ done | `08_LOCAL_DEV_WORKFLOW.md` |
| 14 | Deferred production items | ✅ documented | `09_PRODUCTION_DEFERRED.md` |
| 13 | Final commit (no push) | (next step) | one commit holding all of the above |

---

## Files modified

| File | Change |
|------|--------|
| `prisma/schema.prisma` | provider → `mysql`; added `@db.VarChar(N)` / `@db.Text` annotations; added 7 secondary indexes |
| `docker-compose.yml` | added `mysql:8.4` service with healthcheck and named volume; updated `web.DATABASE_URL` to use the new MySQL service; preserved `db-data` volume with a "legacy" comment |
| `.env.example` | added `DATABASE_URL` (MySQL form), `SHADOW_DATABASE_URL`, `MYSQL_ROOT_PASSWORD`, `MYSQL_DATABASE`, `MYSQL_USER`, `MYSQL_PASSWORD`; preserved `OPENAI_API_KEY` and `NEXTAUTH_*` |
| `.gitignore` | added `backups/` and `prisma/_old_sqlite_migrations/` (defensive, no-op if those dirs don't exist) |

## Files created

| File | Purpose |
|------|---------|
| `prisma/migrations/migration_lock.toml` | declares `provider = "mysql"` |
| `prisma/migrations/20260425201310_init_mysql/migration.sql` | full DDL for all 7 tables with indexes and FKs |
| `docs/migration/00_PHASE_1B_SUMMARY.md` | this file |
| `docs/migration/01_SQLITE_BACKUP.md` | SQLite backup instructions |
| `docs/migration/02_OLD_MIGRATIONS_HANDLING.md` | old migrations folder (none existed) |
| `docs/migration/03_MYSQL_STARTUP_NOTES.md` | how to start the MySQL container on Windows |
| `docs/migration/04_MIGRATION_NOTES.md` | how to apply the baseline migration |
| `docs/migration/05_SEED_VERIFICATION.md` | how to seed and verify row counts |
| `docs/migration/06_TYPE_CHECK_RESULTS.md` | type-check expectations |
| `docs/migration/07_SMOKE_TEST_RESULTS.md` | end-to-end smoke tests |
| `docs/migration/08_LOCAL_DEV_WORKFLOW.md` | reference: daily dev workflow |
| `docs/migration/09_PRODUCTION_DEFERRED.md` | items intentionally deferred to later phases |

---

## What you (the user) MUST run on Windows

Open Git Bash or PowerShell in the project directory after pulling the
`phase-1b-mysql-migration` branch:

```bash
# 1. Install / refresh JS deps
npm ci

# 2. Set up env
cp .env.example .env
# Edit .env: replace every CHANGE_ME with a strong local password.
# MYSQL_PASSWORD and the password in DATABASE_URL must MATCH.

# 3. Start MySQL
docker compose up -d mysql
docker compose ps    # wait for "(healthy)"

# 4. Apply the bundled migration
npx prisma migrate deploy

# 5. Seed
npx prisma db seed

# 6. Generate Prisma client (refresh)
npx prisma generate

# 7. Type check & lint
npx tsc --noEmit
npm run lint

# 8. Boot test
npm run dev
# Open http://localhost:3000 — should redirect to /en/
# Open http://localhost:3000/admin/login — log in admin@residency24.com / admin123
# In a chat, ask "How much does Dubai company setup cost?" and verify a reply

# 9. (optional) verify table row counts
docker compose exec mysql mysql -uresidency24 -pYourMysqlPassword residency24 -e "
  SELECT 'User'       AS tbl, COUNT(*) AS rows FROM User
  UNION ALL SELECT 'Prompt',     COUNT(*) FROM Prompt
  UNION ALL SELECT 'PagePrompt', COUNT(*) FROM PagePrompt
  UNION ALL SELECT 'Provider',   COUNT(*) FROM Provider;
"
# Expected: User=1, Prompt=24, PagePrompt=10, Provider=1
```

If everything passes, push the branch:

```bash
git push -u origin phase-1b-mysql-migration
```

---

## What was NOT done (per the rules in the brief)

- ❌ Did NOT modify any file under `src/` (no `.ts`/`.tsx` source-code edits)
- ❌ Did NOT install or remove any npm packages
- ❌ Did NOT modify `next.config.ts`, `deploy.sh`, `ecosystem.config.js`, or `Dockerfile`
- ❌ Did NOT push to remote (kept all work local)
- ❌ Did NOT migrate the WordPress 200 leads (out of scope; future phase)
- ❌ Did NOT fix the broken auth (Phase 1-D)
- ❌ Did NOT delete any SQLite `.db` file (none existed in the sandbox; user must check their own machine — see `01_SQLITE_BACKUP.md`)
- ❌ Did NOT execute `docker compose up`, `prisma migrate deploy`, `db seed`, `npm run dev`, or any other runtime command (Docker daemon unreachable in this sandbox)

---

## Verification checklist for the user

After running the runtime steps above, mark each:

- [ ] Docker MySQL container is `(healthy)` in `docker compose ps`
- [ ] `npx prisma migrate deploy` reports the `init_mysql` migration applied
- [ ] `SHOW TABLES` returns 8 tables (7 application + `_prisma_migrations`)
- [ ] `npx prisma db seed` exits 0 with the expected row counts
- [ ] `npx tsc --noEmit` exits 0 (no new errors vs. main)
- [ ] `npm run lint` exits 0 (no new errors vs. main)
- [ ] `npm run dev` starts without errors and the home page renders at `/en/`
- [ ] Chat in any language returns a reply (assumes a real `OPENAI_API_KEY`)
- [ ] Admin login works at `/admin/login`
- [ ] All 6 smoke tests in `07_SMOKE_TEST_RESULTS.md` pass

If all green: ✅ **Phase 1-B verified.** Move on to Phase 1-C (deploy-script
cleanup) or Phase 1-D (fix auth).

If anything red: open a `BLOCKED_QUESTIONS.md` at the repo root with the
exact error and we resolve before pushing.

---

## Known follow-up work

See `09_PRODUCTION_DEFERRED.md` for the full list. The two highest-priority
follow-ups:

1. **Phase 1-C** — fix the `next.config.ts` standalone-output mismatch in
   `deploy.sh` and `ecosystem.config.js` (silent-failure issue from Phase 1-A
   risk #4).
2. **Phase 1-D** — replace the broken custom auth with Auth.js v5 + add a
   `proxy.ts` to gate `/admin/*`.

---

**End of summary.**
