#!/bin/sh
# Sync build assets into the standalone bundle. Must be idempotent:
# `next build` does NOT clean .next/standalone between builds, and
# `cp -r SRC DST` nests SRC inside an existing DST, leaving stale
# chunks at the top level (production 404s on new chunk hashes).
set -eu

[ -d .next/standalone ] || exit 0

rm -rf .next/standalone/.next/static .next/standalone/public
cp -r .next/static .next/standalone/.next/static
cp -r public .next/standalone/public

# nginx serves /_next/static directly from this tree; needs world-read.
chmod -R o+rx .next/standalone
