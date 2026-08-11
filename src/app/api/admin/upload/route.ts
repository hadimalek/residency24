import { NextRequest, NextResponse } from "next/server";
import { storeImageBuffer, MediaError } from "@/lib/media-store";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 60;

// Admin panel image upload. Shares one storage implementation with the
// programmatic Content API — see src/lib/media-store.ts.
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ message: "missing file field" }, { status: 400 });
    }

    const stored = await storeImageBuffer({
      buffer: Buffer.from(await file.arrayBuffer()),
      mimeType: file.type,
      originalName: file.name,
    });

    return NextResponse.json({
      id: stored.id,
      url: stored.url,
      fileName: stored.fileName,
      mimeType: stored.mimeType,
      size: stored.size,
    });
  } catch (err: unknown) {
    if (err instanceof MediaError) {
      const status =
        err.kind === "unsupported_media_type" ? 415 : err.kind === "payload_too_large" ? 413 : 400;
      return NextResponse.json({ message: err.message }, { status });
    }
    console.error("[/api/admin/upload] error:", err);
    const message = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ message }, { status: 500 });
  }
}
