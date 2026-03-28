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
APP_DIR="$(cd "$(dirname "$0")" && pwd)"

cd "$APP_DIR"

echo "==> Pulling latest from $BRANCH..."
git pull origin "$BRANCH" --rebase

echo "==> Installing dependencies..."
npm ci --production=false

echo "==> Generating Prisma client..."
npx prisma generate

echo "==> Running database migrations..."
npx prisma db push

echo "==> Building Next.js..."
npm run build

echo "==> Restarting PM2..."
pm2 restart residency24 || pm2 start ecosystem.config.js

echo ""
echo "  ✅ Deploy complete!"
echo "  pm2 logs residency24    # View logs"
echo "  pm2 status              # Check status"
echo ""
