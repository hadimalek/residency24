import { NextRequest } from "next/server";
import { authenticateContentRequest } from "@/lib/content-api/auth";
import { ok, apiError, validationError, guard } from "@/lib/content-api/http";
import {
  getArticle,
  updateArticle,
  updateArticleSchema,
  deleteArticle,
} from "@/lib/content-api/articles";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// GET /api/content/articles/[id] — full article with all translations
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = authenticateContentRequest(request);
  if (denied) return denied;

  return guard(async () => {
    const { id } = await params;
    const article = await getArticle(id);
    if (!article) return apiError("not_found", "Article not found.");
    return ok(article);
  }, "GET /articles/[id]");
}

// PATCH /api/content/articles/[id] — partial update (+ optional single locale)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = authenticateContentRequest(request);
  if (denied) return denied;

  return guard(async () => {
    const { id } = await params;
    const body = await request.json().catch(() => null);
    const parsed = updateArticleSchema.safeParse(body);
    if (!parsed.success) return validationError(parsed.error.issues);

    const result = await updateArticle(id, parsed.data);
    if (!result.ok) {
      if (result.reason === "not_found") return apiError("not_found", "Article not found.");
      return apiError("conflict", "Slug already in use by another article.");
    }
    return ok(result.article);
  }, "PATCH /articles/[id]");
}

// DELETE /api/content/articles/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = authenticateContentRequest(request);
  if (denied) return denied;

  return guard(async () => {
    const { id } = await params;
    const removed = await deleteArticle(id);
    if (!removed) return apiError("not_found", "Article not found.");
    return ok({ id, deleted: true });
  }, "DELETE /articles/[id]");
}
