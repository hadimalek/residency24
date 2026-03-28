#!/usr/bin/env bash
set -euo pipefail

# ============================================
# Residency24 — PM2 Deploy Script
# ============================================
# First time setup:
#   1. Clone repo to /opt/residency24
#   2. Copy .env.example to .env and fill values
#   3. npm install && npx prisma generate && npx prisma db push
#   4. npx prisma db seed
#   5. npm run build
#   6. pm2 start ecosystem.config.js
#
# After that, just run: bash deploy.sh
# ============================================

BRANCH="${1:-main}"
APP_DIR="/opt/residency24"

cd "$APP_DIR" || { echo "ERROR: $APP_DIR not found"; exit 1; }
echo "==> Working in $APP_DIR"

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

echo "==> Restarting PM2..."
pm2 restart residency24 || pm2 start ecosystem.config.js

echo ""
echo "  ✅ Deploy complete!"
echo "  pm2 logs residency24    # View logs"
echo "  pm2 status              # Check status"
echo ""
