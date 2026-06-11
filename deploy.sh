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
#   3. npm install && npx prisma generate && npx prisma db push
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

echo "==> Generating Prisma client..."
npx prisma generate --schema=./prisma/schema.prisma

echo "==> Running database migrations..."
npx prisma db push --schema=./prisma/schema.prisma

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

echo ""
echo "  ✅ Deploy complete!"
echo "  pm2 logs residency24    # View logs"
echo "  pm2 status              # Check status"
echo ""
