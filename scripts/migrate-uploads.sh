#!/bin/bash
# Consolidate ALL uploaded files from every location into data/uploads/.
# Run on production: cd /path/to/project && bash scripts/migrate-uploads.sh

PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DST="$PROJECT_ROOT/data/uploads"

echo "Project root: $PROJECT_ROOT"
echo "Destination:  $DST"
echo ""

mkdir -p "$DST"

COPIED=0
SKIPPED=0

# Find every uploads/blog directory anywhere in the project tree
while IFS= read -r src_dir; do
  echo "Found uploads in: $src_dir"
  # Walk all files in this uploads dir
  while IFS= read -r src_file; do
    # Get the relative path from the "uploads/" part
    rel="${src_file#*uploads/}"
    dst_file="$DST/$rel"
    if [ -f "$dst_file" ]; then
      SKIPPED=$((SKIPPED + 1))
    else
      mkdir -p "$(dirname "$dst_file")"
      cp "$src_file" "$dst_file"
      COPIED=$((COPIED + 1))
    fi
  done < <(find "$src_dir" -type f 2>/dev/null)
done < <(find "$PROJECT_ROOT" -path "*/uploads/blog" -type d 2>/dev/null | grep -v "$DST")

echo ""
echo "Done. Copied: $COPIED, Already existed: $SKIPPED"
echo "Total files in $DST: $(find "$DST" -type f 2>/dev/null | wc -l)"
