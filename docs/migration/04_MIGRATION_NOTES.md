# 04 — Initial MySQL Migration Notes

**Status:** Migration prepared (not yet applied)
**Last updated:** 2026-04-25
**Phase:** 1-B
**Sandbox limitation:** Docker daemon is not running in this sandbox, so the
SQL was generated as a static `migration.sql` file but **not applied to a
running database**. The user must run `prisma migrate deploy` (or equivalent)
on their Windows machine after starting MySQL.

---

## What was generated in this sandbox

```
prisma/migrations/
├── migration_lock.toml                              ← provider = mysql
└── 20260425201310_init_mysql/
    └── migration.sql                                ← 118 lines, full DDL
```

The `migration.sql` was produced by:

```bash
DATABASE_URL="mysql://test:test@localhost:3306/test" \
  npx prisma migrate diff \
    --from-empty \
    --to-schema-datamodel ./prisma/schema.prisma \
    --script \
  > prisma/migrations/20260425201310_init_mysql/migration.sql
```

This is a **read-only** Prisma command — it computes the SQL diff between an
empty database and the current `schema.prisma`, without touching any DB. The
output is the exact same SQL that `prisma migrate dev --name init_mysql` would
produce against an empty MySQL.

---

## What the migration.sql does (summary)

It creates **7 tables** with the following structure (full file: 118 lines):

| Table | Columns | Indexes | Foreign keys |
|-------|---------|---------|--------------|
| `User` | 6 | 1 unique on `email` | — |
| `Session` | 8 | 1 unique on `sessionKey`, 2 secondary | — |
| `Message` | 6 | 1 composite secondary on `(sessionId, createdAt)` | `sessionId → Session.id` ON DELETE CASCADE |
| `Lead` | 8 | 1 unique on `sessionId`, 2 secondary | `sessionId → Session.id` ON DELETE SET NULL |
| `Prompt` | 11 | 1 composite secondary on `(type, language, isActive, sortOrder)` | — |
| `PagePrompt` | 10 | 1 composite unique on `(language, pageSlug)`, 1 secondary | — |
| `Provider` | 10 | 1 secondary on `isActive` | — |

All tables use:
- `DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci` (multibyte safe — handles Persian, Arabic, Russian, English without issue)
- `INTEGER NOT NULL AUTO_INCREMENT` primary keys
- `DATETIME(3)` with `DEFAULT CURRENT_TIMESTAMP(3)` for created/updated timestamps

This matches every recommendation in
`docs/discovery/03_PRISMA_CURRENT_STATE.md`.

---

## How the user applies this migration on Windows

After MySQL is up and `.env` has the right `DATABASE_URL`:

### Option A (recommended): treat the bundled migration as the baseline

```bash
npx prisma migrate deploy
```

This:
1. Connects to the database in `DATABASE_URL`.
2. Applies the `20260425201310_init_mysql/migration.sql` file.
3. Records it in the `_prisma_migrations` bookkeeping table.

`migrate deploy` is the **same command we'll use in production** — so testing
it locally is also a verification of the production deploy path.

### Option B: regenerate the migration locally with `migrate dev`

If you'd rather have your own timestamped migration directory:

```bash
# WARNING: this deletes the bundled migration file in the repo. Only do this
# if you want to re-baseline, e.g. because Prisma added a new annotation since
# this commit.

rm -rf prisma/migrations
npx prisma migrate dev --name init_mysql
```

`migrate dev` is more interactive — it will prompt to reset the DB if it
detects drift, ask if you want to seed, etc. **Don't run this against
production.**

For the very first run on a fresh local Docker MySQL (which is what Phase 1-B
expects), Option A is faster and matches production behavior exactly.

---

## After applying the migration

```bash
# Verify the tables exist
docker compose exec mysql mysql -uresidency24 -p${MYSQL_PASSWORD} residency24 \
  -e "SHOW TABLES;"
```

Expected output:

```
+----------------------+
| Tables_in_residency24 |
+----------------------+
| Lead                 |
| Message              |
| PagePrompt           |
| Prompt               |
| Provider             |
| Session              |
| User                 |
| _prisma_migrations   |
+----------------------+
```

(8 tables total: 7 application tables + 1 Prisma bookkeeping table.)

---

## Troubleshooting

### "Database `residency24` does not exist"

The MySQL container creates the database from `MYSQL_DATABASE`. If you started
the container before setting that env var, fix `.env` then:

```bash
docker compose down -v
docker compose up -d mysql
```

(You'll lose any data — fine in local dev.)

### "Access denied for user 'residency24'@'10.x.x.x'"

The user/password embedded in `DATABASE_URL` doesn't match what the container
created. See the troubleshooting in `03_MYSQL_STARTUP_NOTES.md` section B.

### "drift detected: Your database schema is not in sync"

Means the DB has tables that Prisma didn't create, or vice versa. For a
freshly-baked local MySQL, this is unexpected — most likely cause is that you
ran `prisma db push` against this DB before. **Fix:**

```bash
npx prisma migrate reset    # WIPES DATA
```

Then re-apply with `migrate deploy` or `migrate dev`.

---

## Was this executed in the sandbox?

| Step | Done? | Why / why not |
|------|-------|--------------|
| `prisma format` | ✅ | No DB needed |
| `prisma validate` | ✅ | No DB needed (used placeholder DATABASE_URL) |
| `prisma migrate diff --from-empty` | ✅ | No DB needed; output saved to migration.sql |
| `prisma migrate deploy` | ❌ | Needs running MySQL — sandbox has no Docker daemon |
| `prisma generate` | ❌ | Skipped to avoid populating node_modules in the sandbox |

---

**End of report.**
