# 02 — Old Migrations Folder Handling

**Status:** Migration in progress
**Last updated:** 2026-04-25
**Phase:** 1-B

---

## Check performed

```bash
ls -la prisma/migrations/
# → ls: cannot access 'prisma/migrations': No such file or directory
```

---

## Findings

The `prisma/migrations/` folder **does not exist**. This matches the Phase 1-A finding (`docs/discovery/03_PRISMA_CURRENT_STATE.md` and `06_DEPLOYMENT_REALITY.md`):

> The schema has been managed with `prisma db push`, not `prisma migrate dev`.
> `deploy.sh` uses `npx prisma db push` instead of `npx prisma migrate deploy`.

So there is no SQLite-shaped migration history to preserve, archive, or convert.

---

## What this means for Phase 1-B

When the user runs `npx prisma migrate dev --name init_mysql` for the first time on their Windows machine, Prisma will:

1. Create a brand-new `prisma/migrations/<timestamp>_init_mysql/migration.sql` file.
2. Apply it against the local Docker MySQL database.
3. Generate the Prisma Client.

There is **no risk of conflict** with any pre-existing migration history.

---

## Action taken

- ✅ Added `prisma/_old_sqlite_migrations/` to `.gitignore` as a pre-emptive safety net (in case the user finds an older migrations folder on their Windows machine and wants to move it aside without committing it).
- ✅ No actual files moved or deleted in this sandbox.

---

**End of report.**
