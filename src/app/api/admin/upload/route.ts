import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { createHash } from "node:crypto";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 60;

const ALLOWED_MIME = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
  "image/avif",
]);
const MAX_BYTES = 10 * 1024 * 1024; // 10 MB

const CWD = process.cwd();
// Standalone server.js chdirs into .next/standalone; resolve back to the
// app root so fallback paths land outside the build output and survive
// rebuilds.
const APP_ROOT = CWD.endsWith(path.join(".next", "standalone"))
  ? path.resolve(CWD, "..", "..")
  : CWD;
const DATA_DIR = process.env.UPLOAD_PERSIST_DIR || path.join(APP_ROOT, "data");
const MIRROR_DIRS = [
  path.join(APP_ROOT, "public"),
  path.join(APP_ROOT, ".next/standalone/public"),
];

function extFromMime(mime: string): string {
  switch (mime) {
    case "image/jpeg": return "jpg";
    case "image/png": return "png";
    case "image/webp": return "webp";
    case "image/gif": return "gif";
    case "image/svg+xml": return "svg";
    case "image/avif": return "avif";
    default: return "bin";
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    if (!file) {
      return NextResponse.json({ message: "missing file field" }, { status: 400 });
    }
    if (!ALLOWED_MIME.has(file.type)) {
      return NextResponse.json(
        { message: `unsupported mime type: ${file.type}` },
        { status: 415 }
      );
    }
    const arrayBuf = await file.arrayBuffer();
    if (arrayBuf.byteLength > MAX_BYTES) {
      return NextResponse.json({ message: "file too large" }, { status: 413 });
    }
    const buf = Buffer.from(arrayBuf);

    const now = new Date();
    const yyyy = String(now.getFullYear());
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const ext = extFromMime(file.type);
    const hash = createHash("sha1").update(buf).digest("hex").slice(0, 16);
    const safeName = (file.name || "image").replace(/[^a-zA-Z0-9._-]+/g, "-").slice(0, 80);
    const fileName = `${hash}-${safeName.replace(/\.[^.]+$/, "")}.${ext}`;

    const relPath = `/uploads/blog/manual/${yyyy}/${mm}/${fileName}`;

    // Write to persistent data dir first (survives rebuilds).
    const primaryTarget = path.join(DATA_DIR, relPath);
    await mkdir(path.dirname(primaryTarget), { recursive: true });
    await writeFile(primaryTarget, buf);

    // Best-effort mirror to public dirs for static serving.
    for (const baseDir of MIRROR_DIRS) {
      const target = path.join(baseDir, relPath);
      try {
        await mkdir(path.dirname(target), { recursive: true });
        await writeFile(target, buf);
      } catch {
        // Non-critical — serve route reads from data/ as primary.
      }
    }

    const existing = await prisma.media.findFirst({ where: { filePath: relPath } });
    const media =
      existing ??
      (await prisma.media.create({
        data: {
          filePath: relPath,
          fileName,
          mimeType: file.type,
          fileSize: buf.byteLength,
        },
      }));

    return NextResponse.json({
      id: media.id,
      url: relPath,
      fileName,
      mimeType: file.type,
      size: buf.byteLength,
    });
  } catch (err: any) {
    console.error("[/api/admin/upload] error:", err);
    return NextResponse.json({ message: err?.message ?? "Server error" }, { status: 500 });
  }
}
