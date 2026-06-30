#!/usr/bin/env bash
set -euo pipefail

# ============================================================================
# Residency24 — Restore script  (the "undo button")
# ============================================================================
# Restores a database dump (and, optionally, an uploads archive) produced by
# scripts/db-backup.sh.
#
#   bash scripts/db-restore.sh data/backups/db-20260630-031500.sql.gz
#   bash scripts/db-restore.sh data/backups/db-20260630-031500.sql.gz \
#                              data/backups/uploads-20260630-031500.tgz
#
# With no arguments it lists the available backups so you can pick one.
#
# DESTRUCTIVE: it overwrites the current database with the dump's contents.
# Always take a fresh backup first (it offers to) and confirm the prompt.
# Set RESTORE_YES=1 to skip the confirmation (use only in scripted recovery).
# ============================================================================

APP_DIR="${APP_DIR:-$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)}"
BACKUP_DIR="${BACKUP_DIR:-$APP_DIR/data/backups}"

DB_FILE="${1:-}"
UPLOADS_FILE="${2:-}"

if [ -z "$DB_FILE" ]; then
  echo "Usage: bash scripts/db-restore.sh <db-*.sql.gz> [uploads-*.tgz]"
  echo ""
  echo "Available database backups in $BACKUP_DIR:"
  ls -1t "$BACKUP_DIR"/db-*.sql.gz 2>/dev/null || echo "  (none found)"
  echo ""
  echo "Available uploads archives:"
  ls -1t "$BACKUP_DIR"/uploads-*.tgz 2>/dev/null || echo "  (none found)"
  exit 1
fi

if [ ! -f "$DB_FILE" ]; then
  echo "ERROR: db backup file not found: $DB_FILE" >&2
  exit 1
fi
if [ -n "$UPLOADS_FILE" ] && [ ! -f "$UPLOADS_FILE" ]; then
  echo "ERROR: uploads archive not found: $UPLOADS_FILE" >&2
  exit 1
fi

# ---------------------------------------------------------------------------
# Load DATABASE_URL from .env if not in the environment.
# ---------------------------------------------------------------------------
if [ -z "${DATABASE_URL:-}" ] && [ -f "$APP_DIR/.env" ]; then
  DATABASE_URL="$(grep -E '^DATABASE_URL=' "$APP_DIR/.env" | head -1 | cut -d= -f2- | sed -e 's/^"//' -e 's/"$//' -e "s/^'//" -e "s/'$//")"
fi
if [ -z "${DATABASE_URL:-}" ]; then
  echo "ERROR: DATABASE_URL not set and not found in $APP_DIR/.env" >&2
  exit 1
fi

# ---------------------------------------------------------------------------
# Parse mysql://user:pass@host:port/dbname[?params]  (same logic as backup).
# ---------------------------------------------------------------------------
proto_removed="${DATABASE_URL#mysql://}"
no_query="${proto_removed%%\?*}"
creds="${no_query%@*}"
hostpart="${no_query##*@}"
db_user="${creds%%:*}"
db_pass=""
if [ "$creds" != "$db_user" ]; then db_pass="${creds#*:}"; fi
hostport="${hostpart%%/*}"
db_name="${hostpart#*/}"
db_host="${hostport%%:*}"
db_port="3306"
if [ "$hostport" != "$db_host" ]; then db_port="${hostport##*:}"; fi
urldecode() { printf '%b' "${1//%/\\x}"; }
db_user="$(urldecode "$db_user")"
db_pass="$(urldecode "$db_pass")"

echo "About to RESTORE into database '$db_name' on $db_host:$db_port"
echo "  DB dump:  $DB_FILE"
[ -n "$UPLOADS_FILE" ] && echo "  Uploads:  $UPLOADS_FILE"
echo ""
echo "⚠️  This OVERWRITES the current database. The existing data will be replaced."

if [ "${RESTORE_YES:-0}" != "1" ]; then
  # Offer a safety snapshot first.
  read -r -p "Take a fresh backup of the CURRENT state before restoring? [Y/n] " pre
  case "${pre:-Y}" in
    [nN]*) echo "    skipping pre-restore backup." ;;
    *) bash "$APP_DIR/scripts/db-backup.sh" ;;
  esac
  read -r -p "Type the database name ('$db_name') to confirm restore: " confirm
  if [ "$confirm" != "$db_name" ]; then
    echo "Aborted (confirmation did not match)."
    exit 1
  fi
fi

# ---------------------------------------------------------------------------
# 1) Restore the database.
# ---------------------------------------------------------------------------
echo "==> Restoring database '$db_name'..."
gunzip -c "$DB_FILE" | MYSQL_PWD="$db_pass" mysql \
  --host="$db_host" --port="$db_port" --user="$db_user" \
  --default-character-set=utf8mb4 "$db_name"
echo "    ✅ Database restored."

# ---------------------------------------------------------------------------
# 2) Restore uploads (optional). Extracts back over data/uploads.
# ---------------------------------------------------------------------------
if [ -n "$UPLOADS_FILE" ]; then
  UPLOADS_DIR="${UPLOAD_PERSIST_DIR:-$APP_DIR/data/uploads}"
  PARENT="$(dirname "$UPLOADS_DIR")"
  echo "==> Restoring uploads into $PARENT ..."
  mkdir -p "$PARENT"
  tar xzf "$UPLOADS_FILE" -C "$PARENT"
  echo "    ✅ Uploads restored. Re-run deploy (or the mirror step) to sync into the standalone bundle."
fi

echo ""
echo "  ✅ Restore complete."
echo "     Restart the app if needed:  pm2 reload ecosystem.config.js --update-env"
