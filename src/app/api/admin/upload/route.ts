import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { createHash } from "node:crypto";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
// Increase the body size cap so a 10MB image upload doesn't 413.
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

const PROJECT_ROOT = process.cwd();
const PUBLIC_DIR = path.join(PROJECT_ROOT, "public");
const STANDALONE_PUBLIC_DIR = path.join(PROJECT_ROOT, ".next/standalone/public");
const DATA_DIR = path.join(process.env.UPLOAD_PERSIST_DIR || path.join(PROJECT_ROOT, "data"));

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

// POST /api/admin/upload — multipart/form-data with field "file"
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

    // Mirror into source, standalone, and persistent data dir so files survive rebuilds.
    for (const baseDir of [PUBLIC_DIR, STANDALONE_PUBLIC_DIR, DATA_DIR]) {
      const target = path.join(baseDir, relPath);
      try {
        await mkdir(path.dirname(target), { recursive: true });
        await writeFile(target, buf);
      } catch (e) {
        console.warn("[/api/admin/upload] mirror write failed:", baseDir, (e as Error).message);
      }
    }

    // Persist a Media record (idempotent on filePath)
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
