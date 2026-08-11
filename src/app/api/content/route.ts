import { NextRequest } from "next/server";
import { authenticateContentRequest } from "@/lib/content-api/auth";
import { ok, guard } from "@/lib/content-api/http";
import { ALLOWED_IMAGE_MIME, MAX_IMAGE_BYTES } from "@/lib/media-store";
import { ARTICLE_STATUSES } from "@/lib/content-api/articles";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// GET /api/content — authenticated discovery document. Lets a client confirm
// its key works and enumerate the article-scoped surface in one call.
export async function GET(request: NextRequest) {
  const denied = authenticateContentRequest(request);
  if (denied) return denied;

  return guard(async () => {
    return ok({
      name: "residency24 Content API",
      version: "1.0",
      scope: "articles",
      description:
        "Programmatic, article-scoped API for automated publishing, internal linking, images and SEO. No access to leads, users, providers or admin routes.",
      auth: "Authorization: Bearer <CONTENT_API_KEY>",
      articleStatuses: ARTICLE_STATUSES,
      contentFormats: ["contentHtml", "contentMarkdown", "contentJson"],
      images: {
        allowedMimeTypes: [...ALLOWED_IMAGE_MIME],
        maxBytes: MAX_IMAGE_BYTES,
      },
      endpoints: {
        "GET /api/content": "This discovery document.",
        "GET /api/content/articles": "List/search articles (page, per_page, locale, status, category, q).",
        "POST /api/content/articles": "Create a full article (one or many locales).",
        "GET /api/content/articles/{id}": "Fetch one article with all translations.",
        "PATCH /api/content/articles/{id}": "Update fields and/or one locale.",
        "DELETE /api/content/articles/{id}": "Delete an article.",
        "PUT /api/content/articles/{id}/translations": "Add/replace one locale.",
        "GET /api/content/categories": "List blog categories (locale).",
        "POST /api/content/categories": "Create a blog category.",
        "POST /api/content/media": "Upload an image (multipart file) or ingest by { sourceUrl }.",
        "GET /api/content/link-index": "Published articles as internal-link targets (locale, q, limit).",
      },
    });
  }, "GET /content");
}
