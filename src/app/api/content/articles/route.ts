import { NextRequest } from "next/server";
import { authenticateContentRequest } from "@/lib/content-api/auth";
import { ok, created, validationError, guard } from "@/lib/content-api/http";
import { createArticle, createArticleSchema, listArticles } from "@/lib/content-api/articles";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// GET /api/content/articles — list / search (any status, all locales)
export async function GET(request: NextRequest) {
  const denied = authenticateContentRequest(request);
  if (denied) return denied;

  return guard(async () => {
    const sp = request.nextUrl.searchParams;
    const page = Math.max(1, parseInt(sp.get("page") ?? "1", 10) || 1);
    const perPage = Math.min(100, Math.max(1, parseInt(sp.get("per_page") ?? "20", 10) || 20));

    const result = await listArticles({
      locale: sp.get("locale") ?? undefined,
      status: sp.get("status") ?? undefined,
      category: sp.get("category") ?? undefined,
      q: sp.get("q") ?? undefined,
      page,
      perPage,
    });
    return ok(result.items, result.meta);
  }, "GET /articles");
}

// POST /api/content/articles — create a full article (one or many locales)
export async function POST(request: NextRequest) {
  const denied = authenticateContentRequest(request);
  if (denied) return denied;

  return guard(async () => {
    const body = await request.json().catch(() => null);
    const parsed = createArticleSchema.safeParse(body);
    if (!parsed.success) return validationError(parsed.error.issues);

    const article = await createArticle(parsed.data);
    return created(article);
  }, "POST /articles");
}
