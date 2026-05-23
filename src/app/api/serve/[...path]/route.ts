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

const ROOTS = [
  path.join(process.cwd(), ".next/standalone/public"),
  path.join(process.cwd(), "public"),
];

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path: segments } = await params;
  const relPath = segments.join("/");

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

  return new NextResponse(null, { status: 404 });
}
