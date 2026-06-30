#!/usr/bin/env bash
set -euo pipefail

# ============================================================================
# Residency24 — Backup script
# ============================================================================
# Snapshots BOTH things that have been lost in the past:
#   1. The MySQL database  -> data/backups/db-<UTCstamp>.sql.gz   (mysqldump)
#   2. The uploaded files  -> data/backups/uploads-<UTCstamp>.tgz (tar of data/uploads)
#
# It is called automatically by deploy.sh *before* any Prisma step, so every
# deploy takes a snapshot first. It can also be run by hand or from cron:
#   bash scripts/db-backup.sh
#   # crontab (daily 03:30):  30 3 * * *  cd /var/www/residency24 && bash scripts/db-backup.sh >> data/backups/backup.log 2>&1
#
# Reads DATABASE_URL from the environment, or from the .env file in APP_DIR.
# Retention: keeps the most recent $KEEP backups of each kind (default 14).
# ============================================================================

APP_DIR="${APP_DIR:-$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)}"
BACKUP_DIR="${BACKUP_DIR:-$APP_DIR/data/backups}"
KEEP="${BACKUP_KEEP:-14}"

# UTC timestamp, no colons (safe for filenames). date is allowed in shell.
STAMP="$(date -u +%Y%m%d-%H%M%S)"

mkdir -p "$BACKUP_DIR"

# ---------------------------------------------------------------------------
# Load DATABASE_URL from .env if not already in the environment.
# ---------------------------------------------------------------------------
if [ -z "${DATABASE_URL:-}" ] && [ -f "$APP_DIR/.env" ]; then
  # Grab the first DATABASE_URL= line, strip surrounding quotes.
  DATABASE_URL="$(grep -E '^DATABASE_URL=' "$APP_DIR/.env" | head -1 | cut -d= -f2- | sed -e 's/^"//' -e 's/"$//' -e "s/^'//" -e "s/'$//")"
fi

if [ -z "${DATABASE_URL:-}" ]; then
  echo "ERROR: DATABASE_URL not set and not found in $APP_DIR/.env" >&2
  exit 1
fi

# ---------------------------------------------------------------------------
# Parse mysql://user:pass@host:port/dbname[?params]
# ---------------------------------------------------------------------------
proto_removed="${DATABASE_URL#mysql://}"
if [ "$proto_removed" = "$DATABASE_URL" ]; then
  echo "ERROR: DATABASE_URL is not a mysql:// URL (got: ${DATABASE_URL%%:*}://...)" >&2
  exit 1
fi

# Strip any ?query string
no_query="${proto_removed%%\?*}"
# Split credentials@hostpart on the LAST '@' (passwords may contain '@' rarely;
# user/pass rarely contain '@', host never does — last '@' is the safe split).
creds="${no_query%@*}"
hostpart="${no_query##*@}"

db_user="${creds%%:*}"
db_pass=""
if [ "$creds" != "$db_user" ]; then
  db_pass="${creds#*:}"
fi

hostport="${hostpart%%/*}"
db_name="${hostpart#*/}"
db_host="${hostport%%:*}"
db_port="3306"
if [ "$hostport" != "$db_host" ]; then
  db_port="${hostport##*:}"
fi

# URL-decode percent-encoded password/user (common: %40 = @, %23 = #).
urldecode() { printf '%b' "${1//%/\\x}"; }
db_user="$(urldecode "$db_user")"
db_pass="$(urldecode "$db_pass")"

if [ -z "$db_name" ] || [ -z "$db_host" ]; then
  echo "ERROR: could not parse host/db from DATABASE_URL" >&2
  exit 1
fi

# ---------------------------------------------------------------------------
# 1) Dump the database. Use MYSQL_PWD so the password never appears in argv.
# ---------------------------------------------------------------------------
DB_OUT="$BACKUP_DIR/db-$STAMP.sql.gz"
echo "==> Backing up database '$db_name' on $db_host:$db_port -> $DB_OUT"
MYSQL_PWD="$db_pass" mysqldump \
  --host="$db_host" --port="$db_port" --user="$db_user" \
  --single-transaction --quick --routines --triggers --events \
  --no-tablespaces --default-character-set=utf8mb4 \
  "$db_name" | gzip -c > "$DB_OUT"

DB_SIZE="$(du -h "$DB_OUT" | cut -f1)"
echo "    ✅ DB dump written ($DB_SIZE)"

# ---------------------------------------------------------------------------
# 2) Archive the uploaded files (the article images that have been lost).
# ---------------------------------------------------------------------------
UPLOADS_DIR="${UPLOAD_PERSIST_DIR:-$APP_DIR/data/uploads}"
if [ -d "$UPLOADS_DIR" ]; then
  UP_OUT="$BACKUP_DIR/uploads-$STAMP.tgz"
  echo "==> Backing up uploads from $UPLOADS_DIR -> $UP_OUT"
  tar czf "$UP_OUT" -C "$(dirname "$UPLOADS_DIR")" "$(basename "$UPLOADS_DIR")"
  UP_SIZE="$(du -h "$UP_OUT" | cut -f1)"
  echo "    ✅ Uploads archive written ($UP_SIZE)"
else
  echo "==> No uploads dir at $UPLOADS_DIR — skipping uploads archive."
fi

# ---------------------------------------------------------------------------
# 3) Retention: keep the newest $KEEP of each kind, delete the rest.
# ---------------------------------------------------------------------------
prune() {
  local pattern="$1"
  # List newest-first; delete everything past $KEEP. Null-safe with nullglob.
  local files
  mapfile -t files < <(ls -1t "$BACKUP_DIR"/$pattern 2>/dev/null || true)
  local i=0
  for f in "${files[@]}"; do
    i=$((i + 1))
    if [ "$i" -gt "$KEEP" ]; then
      rm -f "$f" && echo "    🗑  pruned $(basename "$f")"
    fi
  done
}
prune "db-*.sql.gz"
prune "uploads-*.tgz"

echo "==> Backup complete. Newest snapshots in $BACKUP_DIR:"
ls -1t "$BACKUP_DIR"/db-*.sql.gz 2>/dev/null | head -1 || true
ls -1t "$BACKUP_DIR"/uploads-*.tgz 2>/dev/null | head -1 || true
