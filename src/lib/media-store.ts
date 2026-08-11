/**
 * Shared image storage for uploads.
 *
 * Both the admin upload route (src/app/api/admin/upload) and the programmatic
 * Content API (src/app/api/content/media) funnel through here so there is ONE
 * implementation of: validate → write to the persistent data dir → mirror to
 * public dirs → upsert a Media row.
 *
 * Files are written to a persistent dir (survives rebuilds) and best-effort
 * mirrored into the public dirs. They are served back through /api/serve via
 * the proxy rewrite of /uploads/* (Next standalone does not serve files added
 * to public/ after build time).
 */
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { createHash } from "node:crypto";
import { prisma } from "@/lib/db";

export const IMAGE_MIME_EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/svg+xml": "svg",
  "image/avif": "avif",
};

export const ALLOWED_IMAGE_MIME = new Set(Object.keys(IMAGE_MIME_EXT));

export const MAX_IMAGE_BYTES = (() => {
  const raw = Number(process.env.CONTENT_API_MAX_IMAGE_BYTES);
  return Number.isFinite(raw) && raw > 0 ? raw : 10 * 1024 * 1024; // 10 MB
})();

const CWD = process.cwd();
// Standalone server.js chdirs into .next/standalone; resolve back to the app
// root so fallback paths land outside the build output and survive rebuilds.
const APP_ROOT = CWD.endsWith(path.join(".next", "standalone"))
  ? path.resolve(CWD, "..", "..")
  : CWD;
const DATA_DIR = process.env.UPLOAD_PERSIST_DIR || path.join(APP_ROOT, "data");
const MIRROR_DIRS = [
  path.join(APP_ROOT, "public"),
  path.join(APP_ROOT, ".next/standalone/public"),
];

export class MediaError extends Error {
  constructor(
    message: string,
    readonly kind: "unsupported_media_type" | "payload_too_large" | "bad_request"
  ) {
    super(message);
    this.name = "MediaError";
  }
}

function extFromMime(mime: string): string {
  return IMAGE_MIME_EXT[mime] ?? "bin";
}

function buildRelPath(fileName: string, subdir: string): string {
  const now = new Date();
  const yyyy = String(now.getFullYear());
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const clean = subdir.replace(/^\/+|\/+$/g, "");
  return `/uploads/${clean}/${yyyy}/${mm}/${fileName}`;
}

export interface StoredImage {
  id: string;
  url: string;
  fileName: string;
  mimeType: string;
  size: number;
}

/**
 * Persist an image buffer and return (or reuse, when identical) its Media row.
 * De-duplicates by content hash embedded in the filename + a Media lookup.
 */
export async function storeImageBuffer(params: {
  buffer: Buffer;
  mimeType: string;
  originalName?: string;
  subdir?: string;
}): Promise<StoredImage> {
  const { buffer, mimeType, originalName, subdir = "blog/manual" } = params;

  if (!ALLOWED_IMAGE_MIME.has(mimeType)) {
    throw new MediaError(`Unsupported image type: ${mimeType}`, "unsupported_media_type");
  }
  if (buffer.byteLength === 0) {
    throw new MediaError("Empty image", "bad_request");
  }
  if (buffer.byteLength > MAX_IMAGE_BYTES) {
    throw new MediaError("Image too large", "payload_too_large");
  }

  const ext = extFromMime(mimeType);
  const hash = createHash("sha1").update(buffer).digest("hex").slice(0, 16);
  const safeName = (originalName || "image")
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .slice(0, 80)
    .replace(/\.[^.]+$/, "");
  const fileName = `${hash}-${safeName || "image"}.${ext}`;
  const relPath = buildRelPath(fileName, subdir);

  // Write to the persistent data dir first (authoritative for /api/serve).
  const primaryTarget = path.join(DATA_DIR, relPath);
  await mkdir(path.dirname(primaryTarget), { recursive: true });
  await writeFile(primaryTarget, buffer);

  // Best-effort mirror to public dirs for static serving.
  for (const baseDir of MIRROR_DIRS) {
    const target = path.join(baseDir, relPath);
    try {
      await mkdir(path.dirname(target), { recursive: true });
      await writeFile(target, buffer);
    } catch {
      // Non-critical — /api/serve reads from the data dir as primary.
    }
  }

  const existing = await prisma.media.findFirst({ where: { filePath: relPath } });
  const media =
    existing ??
    (await prisma.media.create({
      data: {
        filePath: relPath,
        fileName,
        mimeType,
        fileSize: buffer.byteLength,
      },
    }));

  return {
    id: media.id,
    url: relPath,
    fileName,
    mimeType,
    size: buffer.byteLength,
  };
}

/**
 * Attach/replace localized alt text, title and caption on a Media row — the
 * SEO metadata for an image. Keyed on (mediaId, locale) so it is idempotent.
 */
export async function setMediaMeta(
  mediaId: string,
  locale: string,
  meta: { altText?: string | null; title?: string | null; caption?: string | null }
): Promise<void> {
  const data = {
    altText: meta.altText ?? null,
    title: meta.title ?? null,
    caption: meta.caption ?? null,
  };
  await prisma.mediaTranslation.upsert({
    where: { mediaId_locale: { mediaId, locale } },
    create: { mediaId, locale, ...data },
    update: data,
  });
}

/** Block requests to loopback / link-local / private ranges (SSRF guard). */
function isBlockedHost(hostname: string): boolean {
  const h = hostname.toLowerCase().replace(/^\[|\]$/g, "");
  if (h === "localhost" || h.endsWith(".localhost")) return true;
  if (h === "::1" || h === "0.0.0.0") return true;
  // IPv4 private / loopback / link-local / metadata endpoint.
  const v4 = h.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (v4) {
    const [a, b] = [Number(v4[1]), Number(v4[2])];
    if (a === 127 || a === 10) return true;
    if (a === 192 && b === 168) return true;
    if (a === 172 && b >= 16 && b <= 31) return true;
    if (a === 169 && b === 254) return true; // includes 169.254.169.254
    if (a === 0) return true;
  }
  // IPv6 unique-local / link-local.
  if (h.startsWith("fc") || h.startsWith("fd") || h.startsWith("fe80")) return true;
  return false;
}

/**
 * Fetch a remote image server-side and persist it. Enforces protocol, host,
 * content-type and size limits before touching disk.
 */
export async function storeImageFromUrl(params: {
  sourceUrl: string;
  subdir?: string;
  timeoutMs?: number;
}): Promise<StoredImage> {
  const { sourceUrl, subdir, timeoutMs = 15000 } = params;

  let url: URL;
  try {
    url = new URL(sourceUrl);
  } catch {
    throw new MediaError("sourceUrl is not a valid URL", "bad_request");
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new MediaError("sourceUrl must be http(s)", "bad_request");
  }
  if (isBlockedHost(url.hostname)) {
    throw new MediaError("sourceUrl host is not allowed", "bad_request");
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  let resp: Response;
  try {
    resp = await fetch(url, {
      redirect: "follow",
      signal: controller.signal,
      headers: { "User-Agent": "residency24-content-api/1.0" },
    });
  } catch (err) {
    throw new MediaError(
      `Failed to fetch sourceUrl: ${err instanceof Error ? err.message : "unknown"}`,
      "bad_request"
    );
  } finally {
    clearTimeout(timer);
  }

  if (!resp.ok) {
    throw new MediaError(`sourceUrl returned HTTP ${resp.status}`, "bad_request");
  }

  const contentType = (resp.headers.get("content-type") ?? "").split(";")[0].trim().toLowerCase();
  if (!ALLOWED_IMAGE_MIME.has(contentType)) {
    throw new MediaError(
      `sourceUrl content-type not a supported image: ${contentType || "unknown"}`,
      "unsupported_media_type"
    );
  }

  const declaredLength = Number(resp.headers.get("content-length"));
  if (Number.isFinite(declaredLength) && declaredLength > MAX_IMAGE_BYTES) {
    throw new MediaError("Remote image too large", "payload_too_large");
  }

  const buffer = Buffer.from(await resp.arrayBuffer());

  const nameFromUrl = decodeURIComponent(url.pathname.split("/").pop() || "image");
  return storeImageBuffer({
    buffer,
    mimeType: contentType,
    originalName: nameFromUrl,
    subdir,
  });
}
