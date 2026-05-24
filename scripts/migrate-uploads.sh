#!/bin/bash
# One-time script: copy existing uploads from public/ to data/ so they survive rebuilds.
# Run on the production server: bash scripts/migrate-uploads.sh

PROJECT_ROOT="${APP_DIR:-/var/www/residency24}"
SRC="$PROJECT_ROOT/public/uploads"
DST="$PROJECT_ROOT/data/uploads"

if [ ! -d "$SRC" ]; then
  echo "Source not found: $SRC"
  # Try standalone as fallback
  SRC="$PROJECT_ROOT/.next/standalone/public/uploads"
  if [ ! -d "$SRC" ]; then
    echo "No uploads directory found."
    exit 1
  fi
fi

echo "Copying $SRC → $DST ..."
mkdir -p "$DST"
cp -rn "$SRC/"* "$DST/" 2>/dev/null
echo "Done. $(find "$DST" -type f | wc -l) files in $DST"
