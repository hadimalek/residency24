import { NextRequest } from "next/server";
import { authenticateContentRequest } from "@/lib/content-api/auth";
import { created, apiError, guard } from "@/lib/content-api/http";
import {
  storeImageBuffer,
  storeImageFromUrl,
  setMediaMeta,
  MediaError,
  type StoredImage,
} from "@/lib/media-store";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 60;

/**
 * POST /api/content/media
 *
 * Two ways to send an image:
 *   1. multipart/form-data with a `file` field (raw bytes).
 *   2. application/json  { "sourceUrl": "https://…/photo.jpg" }  (server fetches it).
 *
 * Optional (both modes): `alt`, `title`, `caption`, `locale` (default "en")
 * store localized SEO metadata; `subdir` overrides the upload folder.
 *
 * Returns the Media id + a site-relative `url` to embed in article HTML.
 */
export async function POST(request: NextRequest) {
  const denied = authenticateContentRequest(request);
  if (denied) return denied;

  return guard(async () => {
    const contentType = request.headers.get("content-type") ?? "";

    let stored: StoredImage;
    let alt: string | null = null;
    let title: string | null = null;
    let caption: string | null = null;
    let locale = "en";
    let subdir: string | undefined;

    try {
      if (contentType.includes("multipart/form-data")) {
        const form = await request.formData();
        const file = form.get("file");
        if (!(file instanceof File)) {
          return apiError("bad_request", "Missing 'file' field in multipart body.");
        }
        alt = (form.get("alt") as string) || null;
        title = (form.get("title") as string) || null;
        caption = (form.get("caption") as string) || null;
        locale = (form.get("locale") as string) || "en";
        subdir = (form.get("subdir") as string) || undefined;

        stored = await storeImageBuffer({
          buffer: Buffer.from(await file.arrayBuffer()),
          mimeType: file.type,
          originalName: file.name,
          subdir,
        });
      } else {
        const body = await request.json().catch(() => null);
        if (!body || typeof body.sourceUrl !== "string") {
          return apiError(
            "bad_request",
            "Send multipart/form-data with a 'file', or JSON with a 'sourceUrl'."
          );
        }
        alt = body.alt ?? null;
        title = body.title ?? null;
        caption = body.caption ?? null;
        locale = body.locale ?? "en";
        subdir = body.subdir ?? undefined;

        stored = await storeImageFromUrl({ sourceUrl: body.sourceUrl, subdir });
      }
    } catch (err) {
      if (err instanceof MediaError) return apiError(err.kind, err.message);
      throw err;
    }

    if (alt || title || caption) {
      await setMediaMeta(stored.id, locale, { altText: alt, title, caption });
    }

    return created(stored);
  }, "POST /media");
}
