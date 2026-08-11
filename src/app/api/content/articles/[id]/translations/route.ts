import { NextRequest } from "next/server";
import { authenticateContentRequest } from "@/lib/content-api/auth";
import { ok, apiError, validationError, guard } from "@/lib/content-api/http";
import { upsertTranslation, upsertTranslationSchema } from "@/lib/content-api/articles";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// PUT /api/content/articles/[id]/translations — add or replace one locale.
// Idempotent: keyed on (articleId, locale). Use this to publish a translated
// version of an existing article without touching its other locales.
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = authenticateContentRequest(request);
  if (denied) return denied;

  return guard(async () => {
    const { id } = await params;
    const body = await request.json().catch(() => null);
    const parsed = upsertTranslationSchema.safeParse(body);
    if (!parsed.success) return validationError(parsed.error.issues);

    const result = await upsertTranslation(id, parsed.data);
    if (!result.ok) return apiError("not_found", "Article not found.");
    return ok(result.article);
  }, "PUT /articles/[id]/translations");
}
