# Backups & safe migrations

This document explains how Residency24 protects your data so that **adding a new
feature can no longer silently delete categories, article images, or other DB
rows** — and how to restore if something ever does go wrong.

## TL;DR

- Every deploy now takes a **backup first** (database + uploaded files).
- Deploys now use **versioned migrations** (`prisma migrate deploy`) instead of
  `prisma db push`, which was the thing that kept dropping data.
- To undo a bad deploy: `bash scripts/db-restore.sh <db backup> [uploads backup]`.

---

## Why data kept disappearing

The old `deploy.sh` ran:

```bash
npx prisma db push
```

`db push` compares the live database to `schema.prisma` and rewrites the DB to
match. When a model was **removed** from the schema (e.g. `BlogCategory`), push
**silently dropped that table** — and every row in it — with no confirmation and
no backup. The same mechanism could drop/alter `Media` rows, which is why
articles "lost" their featured images (the image *files* survived in
`data/uploads`, but the DB rows pointing at them were gone).

There were also **no backups**, so once data was dropped it was unrecoverable.

Both problems are now fixed.

---

## 1. Backups

### What gets backed up

`scripts/db-backup.sh` writes two files to `data/backups/` (ignored by git):

| File | Contents |
|------|----------|
| `db-<UTCstamp>.sql.gz` | Full `mysqldump` of the MySQL database (gzipped) |
| `uploads-<UTCstamp>.tgz` | `tar` of `data/uploads` (the article images, etc.) |

Retention: the newest **14** of each are kept; older ones are pruned. Override
with `BACKUP_KEEP=30 bash scripts/db-backup.sh`.

### When it runs

- **Automatically before every deploy.** `deploy.sh` calls the backup script
  *before* generating Prisma / running migrations. Because the script uses
  `set -e`, a failed backup aborts the deploy — so a deploy can never run
  without a fresh snapshot to fall back to.
- **On demand:** `bash scripts/db-backup.sh`
- **Daily via cron (recommended).** Add this to the server's crontab
  (`crontab -e`), adjusting the path:

  ```cron
  30 3 * * * cd /var/www/residency24 && bash scripts/db-backup.sh >> data/backups/backup.log 2>&1
  ```

> The script reads `DATABASE_URL` from the environment, or from `.env` in the
> app directory. The DB password is passed via `MYSQL_PWD`, never on the command
> line.

### Off-server copies

`data/backups/` lives on the same server. For real disaster recovery, also copy
the backups somewhere off-box periodically (e.g. `rclone`/`scp` to object
storage). The dumps are plain gzipped SQL + tar, so any tool works.

---

## 2. Restore (the undo button)

List available backups:

```bash
bash scripts/db-restore.sh
```

Restore a database snapshot (and optionally the matching uploads archive):

```bash
bash scripts/db-restore.sh data/backups/db-20260630-031500.sql.gz \
                           data/backups/uploads-20260630-031500.tgz
```

The script:
1. Offers to back up the **current** state first (so a restore is itself
   reversible).
2. Asks you to type the database name to confirm (destructive op).
3. Restores the DB, then optionally extracts the uploads archive over
   `data/uploads`.

Then reload the app:

```bash
pm2 reload ecosystem.config.js --update-env
```

For unattended/scripted recovery set `RESTORE_YES=1` to skip the prompts.

---

## 3. Safe migrations (no more `db push`)

`deploy.sh` now runs:

```bash
npx prisma migrate deploy
```

`migrate deploy` only applies the committed SQL files in `prisma/migrations/`,
in order. It **never** diffs-and-drops, so removing a model from the schema can
no longer wipe a table behind your back.

### New workflow for schema changes

Whenever you change `prisma/schema.prisma`:

1. **Locally**, generate a migration (this writes a new folder under
   `prisma/migrations/`):

   ```bash
   npx prisma migrate dev --name describe_your_change
   ```

2. **Commit** the generated `prisma/migrations/<...>/migration.sql` along with
   the schema change.

3. **On the server**, `deploy.sh` runs `prisma migrate deploy` and applies it.

> **Never run `prisma db push` against production again.** If you need to drop a
> column/table on purpose, do it via a reviewed migration so the change is
> explicit and recorded.

---

## 4. One-time server baseline (do this once, carefully)

The production database predates the `prisma/migrations/` folder, so its
`_prisma_migrations` ledger may not list the two base migrations. Before the
first `migrate deploy`, tell Prisma those are already applied — otherwise it
would try to re-create tables that already exist.

Run these **on the server, after taking a backup**, in the app directory:

```bash
# 0) Safety first.
bash scripts/db-backup.sh

# 1) See what Prisma thinks is applied.
npx prisma migrate status --schema=./prisma/schema.prisma

# 2) ONLY if the two base migrations are NOT already recorded as applied,
#    mark them as applied (they reflect tables that already exist in prod):
npx prisma migrate resolve --applied 20260425201310_init_mysql       --schema=./prisma/schema.prisma
npx prisma migrate resolve --applied 20260426145724_add_cms_data_model --schema=./prisma/schema.prisma

# 3) Apply the remaining migrations (recreates BlogCategory if missing).
npx prisma migrate deploy --schema=./prisma/schema.prisma

# 4) Confirm.
npx prisma migrate status --schema=./prisma/schema.prisma
```

The new `20260630120000_restore_blog_category` migration uses
`CREATE TABLE IF NOT EXISTS`, so it is safe whether or not the `BlogCategory`
table still exists in prod.

After the baseline is done once, every future deploy just runs
`migrate deploy` automatically — no manual steps.

### Verify current prod data

To check what survived before/after, run in MySQL:

```sql
SELECT COUNT(*) FROM `BlogCategory`;
SELECT category, COUNT(*) FROM `Article` GROUP BY category;
```

If `BlogCategory` still has rows, your old categories are intact and will show
in **/admin/categories** as soon as the model/table is in place. Articles store
their category as a slug string in `Article.category`, so those assignments are
preserved independently of the category table.
