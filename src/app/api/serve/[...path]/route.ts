import { NextRequest, NextResponse } from "next/server";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";

export const dynamic = "force-dynamic";

const MIME: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".avif": "image/avif",
  ".svg": "image/svg+xml",
};

const CWD = process.cwd();

function buildRoots(): string[] {
  const roots: string[] = [];
  const seen = new Set<string>();
  const add = (p: string) => {
    const resolved = path.resolve(p);
    if (!seen.has(resolved)) {
      seen.add(resolved);
      roots.push(resolved);
    }
  };

  if (process.env.UPLOAD_PERSIST_DIR) {
    add(process.env.UPLOAD_PERSIST_DIR);
  }
  add(path.join(CWD, "data"));
  add(path.join(CWD, "public"));
  add(path.join(CWD, ".next/standalone/public"));

  return roots;
}

const ROOTS = buildRoots();

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path: segments } = await params;
  const relPath = segments.map((s) => decodeURIComponent(s)).join("/");

  for (const root of ROOTS) {
    const filePath = path.join(root, relPath);
    if (!filePath.startsWith(root)) continue;
    try {
      const s = await stat(filePath);
      if (!s.isFile()) continue;
      const buf = await readFile(filePath);
      const ext = path.extname(filePath).toLowerCase();
      return new NextResponse(buf, {
        headers: {
          "Content-Type": MIME[ext] || "application/octet-stream",
          "Cache-Control": "public, max-age=31536000, immutable",
        },
      });
    } catch {
      continue;
    }
  }

  console.warn(`[serve] 404: ${relPath} — checked: ${ROOTS.join(", ")}`);
  return new NextResponse(null, { status: 404 });
}
