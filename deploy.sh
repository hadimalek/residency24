#!/usr/bin/env bash
set -euo pipefail

# ============================================
# Residency24 — PM2 Deploy Script
# ============================================
# Configure APP_DIR via env var for non-default installs, e.g.
#   APP_DIR=~/htdocs/new.residency24.com/residency24 bash deploy.sh
#
# First time setup:
#   1. Clone repo into your APP_DIR
#   2. Copy .env.example to .env and fill values
#   3. npm install && npx prisma generate && npx prisma migrate deploy
#      (see docs/BACKUP_AND_MIGRATIONS.md for the one-time baseline if the
#       DB predates the migrations/ folder)
#   4. npx prisma db seed
#   5. npm run build
#   6. APP_DIR=$(pwd) pm2 start ecosystem.config.js
#
# After that, just run: bash deploy.sh   (or APP_DIR=... bash deploy.sh)
# ============================================

BRANCH="${1:-main}"
APP_DIR="${APP_DIR:-/var/www/residency24}"

cd "$APP_DIR" || { echo "ERROR: APP_DIR=$APP_DIR not found. Pass APP_DIR=/path/to/repo if non-default."; exit 1; }
echo "==> Working in $APP_DIR (branch: $BRANCH)"

echo "==> Pulling latest from $BRANCH..."
git pull origin "$BRANCH" --rebase

echo "==> Installing dependencies..."
npm ci

# ---------------------------------------------------------------------------
# Pre-deploy snapshot — ALWAYS back up the DB + uploads before touching the
# schema. `set -e` means a failed backup aborts the deploy, so we never run a
# (potentially destructive) migration without a fresh snapshot to restore from.
# Restore with: bash scripts/db-restore.sh data/backups/db-<stamp>.sql.gz
# ---------------------------------------------------------------------------
echo "==> Taking pre-deploy backup (DB + uploads)..."
APP_DIR="$APP_DIR" bash scripts/db-backup.sh

echo "==> Generating Prisma client..."
npx prisma generate --schema=./prisma/schema.prisma

# Apply versioned migrations from prisma/migrations/ (non-destructive).
# IMPORTANT: do NOT switch this back to `prisma db push` — db push diffs the
# live DB against schema.prisma and SILENTLY DROPS tables/columns that were
# removed from the schema (this is what wiped BlogCategory and Media rows).
# `migrate deploy` only ever applies the committed migration files in order.
# See docs/BACKUP_AND_MIGRATIONS.md for the one-time server baseline.
echo "==> Running database migrations (migrate deploy)..."
npx prisma migrate deploy --schema=./prisma/schema.prisma

echo "==> Building Next.js..."
npm run build

# Standalone is only produced when next.config.ts has `output: "standalone"`.
# These copies are no-ops if standalone isn't in use.
if [ -d ".next/standalone" ]; then
  echo "==> Setting up standalone bundle..."
  # public/ and .next/static are synced by scripts/postbuild-standalone.sh
  # (runs inside `npm run build`). Only prisma/.env/uploads remain here.
  rm -rf .next/standalone/prisma
  cp -r prisma .next/standalone/prisma 2>/dev/null || true
  cp .env .next/standalone/.env 2>/dev/null || true

  # Mirror persisted uploads into the freshly rebuilt standalone public/
  # so static serving works even if UPLOAD_PERSIST_DIR is ever unset.
  if [ -d "$APP_DIR/data/uploads" ]; then
    mkdir -p .next/standalone/public/uploads
    cp -r "$APP_DIR/data/uploads/." .next/standalone/public/uploads/
    chmod -R o+rx .next/standalone/public/uploads
  fi
fi

echo "==> Restarting PM2..."
# startOrReload re-reads ecosystem.config.js so env changes (e.g.
# UPLOAD_PERSIST_DIR) actually reach the process — `pm2 restart <name>`
# only refreshes env from the shell, not from the ecosystem file.
APP_DIR="$APP_DIR" pm2 startOrReload ecosystem.config.js --update-env
pm2 save

# ---------------------------------------------------------------------------
# Post-deploy self-check: confirm the running Node server actually serves a
# freshly-hashed JS chunk. This isolates the two causes behind the recurring
# "/_next/static 404 + ChunkLoadError after deploy" problem:
#   • check FAILS  -> the standalone bundle is out of sync (postbuild issue).
#   • check PASSES but the live site still 404s on /_next/static
#                  -> the problem is your nginx/CDN layer, NOT the build.
#                     Make nginx PROXY /_next/ to the Node server instead of
#                     serving it from disk (see deploy/nginx.conf.example) and
#                     purge any CDN/HTML cache.
# Wrapped so it can never abort the deploy.
# ---------------------------------------------------------------------------
CHECK_PORT="${PORT:-3000}"
( set +e
  sleep 2
  HTML=$(curl -s "http://127.0.0.1:${CHECK_PORT}/fa" 2>/dev/null || true)
  CHUNK=$(printf '%s' "$HTML" | grep -oE '/_next/static/[^"]+\.js' | head -1 || true)
  if [ -n "$CHUNK" ]; then
    CODE=$(curl -s -o /dev/null -w "%{http_code}" "http://127.0.0.1:${CHECK_PORT}${CHUNK}" 2>/dev/null || echo "000")
    if [ "$CODE" = "200" ]; then
      echo "  ✅ Static self-check OK — Node serves a fresh chunk (200)."
      echo "     If the LIVE site still 404s on /_next/static, the BUILD is fine —"
      echo "     fix nginx/CDN (see deploy/nginx.conf.example), do not rebuild."
    else
      echo "  ⚠️  Static self-check: Node returned ${CODE} for ${CHUNK}."
      echo "     Standalone bundle looks out of sync — verify scripts/postbuild-standalone.sh ran."
    fi
  fi
) || true

echo ""
echo "  ✅ Deploy complete!"
echo "  pm2 logs residency24    # View logs"
echo "  pm2 status              # Check status"
echo ""
