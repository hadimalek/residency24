# 04 — SQLite Data Audit  ⚠️ CRITICAL

**Status:** Discovery
**Last updated:** 2026-04-25
**Phase:** 1-A (read-only)

---

## Why this report exists

You (the user) said you don't know if real data exists in the current SQLite database. This report determines whether anything must be migrated before the cut-over to MySQL, or whether the database can be safely re-seeded from scratch.

---

## What I searched for

```bash
find /home/user/residency24 -name "*.db"      → no results
find /home/user/residency24 -name "*.sqlite"  → no results
find /home/user/residency24 -name "*.sqlite3" → no results
find /home/user/residency24 -name "dev.db"    → no results
find /home/user/residency24 -name "prod.db"   → no results
ls -la /home/user/residency24/prisma/
  total 26
  drwxr-xr-x 2 root root  4096 Apr 20 09:55 .
  drwxr-xr-x 7 root root  4096 Apr 25 11:02 ..
  -rw-r--r-- 1 root root  2617 Apr 20 09:55 schema.prisma
  -rw-r--r-- 1 root root 14491 Apr 20 09:55 seed.ts
ls -la /home/user/residency24/.env             → does not exist
ls /home/user/residency24/node_modules         → does not exist
```

---

## Key findings about THIS sandbox

| Question | Answer |
|----------|--------|
| Is there a `.db` file anywhere in the working tree? | **No.** |
| Does `prisma/dev.db` exist? | **No.** |
| Does `prisma/dev.db-journal` exist? | **No.** |
| Does `.env` exist? | **No.** (only `.env.example`) |
| Is `node_modules/` present? | **No.** Project has never been built or run here. |
| Is `sqlite3` CLI available on this machine? | **No** — cannot inspect a DB file even if one were attached |
| Is `better-sqlite3` available via `node_modules`? | **No** (no `node_modules`) |

---

## What `.gitignore` tells us

```gitignore
# database
prisma/dev.db
prisma/dev.db-journal
```

Both `dev.db` and its WAL journal are excluded from git. **By design, no SQLite file is ever committed.** This means:

- The database has *always* lived only on the developer's local machine and on the production server.
- Whether real data exists depends on the developer's workstation and the production server — **not** on this repo.

---

## Where the SQLite file would live, if it existed

| Environment | Path | Source |
|-------------|------|--------|
| Local dev (npm run dev) | `prisma/dev.db` (relative to schema.prisma) | `.env.example` says `DATABASE_URL="file:./dev.db"` |
| PM2 production (`/var/www/residency24`) | `/var/www/residency24/prisma/dev.db` (or wherever the `.env` on the server points) | Whatever the deployer set in their `.env` |
| Docker (if used) | `/app/data/prod.db` inside the container, persisted on the named volume `db-data` | `docker-compose.yml` line 9 |

---

## Verdict for THIS sandbox

> **🟢 SAFE TO REBUILD (in this sandbox).**
>
> No database file exists in the repository or its working tree. No data could be lost from this sandbox. If we were to wipe and re-seed here, nothing would change.

---

## ⚠️ But: this sandbox is NOT necessarily your production system

The user is on a different machine (Windows) and may be running the project against a production server. **You must independently verify on every environment that holds a real DB.** Before running any migration command in Phase 1-B, run these commands in **each environment that matters**:

### A. On your Windows dev machine

```powershell
# From the project root:
Get-ChildItem -Recurse -Force -Include *.db,*.sqlite,*.sqlite3 |
  Where-Object { $_.FullName -notmatch "node_modules|\.next|\.git" }
```

If anything turns up, **back it up** before doing anything else:

```powershell
Copy-Item .\prisma\dev.db .\prisma\dev.db.backup-2026-04-25
```

### B. On the production server (PM2 host at `/var/www/residency24`)

```bash
ssh user@your-prod-host
cd /var/www/residency24
ls -la prisma/
find . -maxdepth 3 -name "*.db" -not -path "*/node_modules/*"
```

If a `.db` file exists, copy it locally **before any migration touches the production server**:

```bash
# On prod
cp prisma/dev.db prisma/dev.db.backup-$(date +%Y%m%d-%H%M%S)
# Then download a copy:
scp user@your-prod-host:/var/www/residency24/prisma/dev.db ./backups/prod-dev.db
```

### C. If you've ever run Docker locally or in production

```bash
docker volume ls | grep db-data
docker run --rm -v residency24_db-data:/data alpine ls -la /data
# If a prod.db is found:
docker run --rm -v residency24_db-data:/data -v "$PWD/backups:/backup" alpine cp /data/prod.db /backup/docker-prod.db
```

---

## Sizing expectations (when you do find a file)

For interpretation:

- **< 100 KB** → empty database, schema only, or one or two seeded rows. Safe to discard.
- **100 KB – 1 MB** → some seed data, perhaps a handful of admin sessions and leads. Worth migrating.
- **> 1 MB** → real usage. Migrate carefully with row-count verification before/after.

If the database file is large (> 100 MB), the migration approach changes — we'd batch-export rather than do a full Prisma `dataMigration`.

---

## Final verdict

> **INCONCLUSIVE — MANUAL CHECK NEEDED ON YOUR DEV MACHINE AND PRODUCTION SERVER.**
>
> In this sandbox: SAFE TO REBUILD.
> Outside this sandbox: I cannot see your laptop or production host. **Run the commands above and report back before Phase 1-B.**

This is the single most important finding to act on before we touch anything. If real production data exists and no one has checked, a careless migration will destroy it.

---

## Open question for the user

1. **Have you ever run `npm run dev` and used the chat / admin panel on your Windows laptop?** If yes, a `.db` file is sitting in `prisma/dev.db` on your laptop and may contain test conversations, leads, or admin login state.
2. **Is `https://residency24.com` already serving the new Next.js code, or is it still WordPress?** If it's serving the new Next.js code, then a production SQLite file exists on the server. If it's still WordPress, the new app has never seen real users and we're free to rebuild.
3. **Do you know the IP / hostname of the production server (the one referenced by `APP_DIR=/var/www/residency24`)?** Without it I cannot help you verify.

---

**End of report.**
