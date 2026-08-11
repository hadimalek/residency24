import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { authenticateContentRequest } from "@/lib/content-api/auth";
import { ok, guard } from "@/lib/content-api/http";
import { articleUrl } from "@/lib/content-api/articles";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * GET /api/content/link-index?locale=fa&q=golden
 *
 * The internal-linking helper for the SEO agent. Returns PUBLISHED articles as
 * ready-to-use link targets ({ title, url, excerpt }) so the agent can weave
 * contextually relevant internal links into new article bodies. Defaults to the
 * 200 most recently published; narrow with `q` (title/slug contains).
 */
export async function GET(request: NextRequest) {
  const denied = authenticateContentRequest(request);
  if (denied) return denied;

  return guard(async () => {
    const sp = request.nextUrl.searchParams;
    const locale = sp.get("locale") ?? undefined;
    const q = sp.get("q") ?? undefined;
    const limit = Math.min(500, Math.max(1, parseInt(sp.get("limit") ?? "200", 10) || 200));

    const rows = await prisma.article.findMany({
      where: {
        status: "PUBLISHED",
        translations: {
          some: {
            ...(locale ? { locale } : {}),
            ...(q ? { title: { contains: q } } : {}),
          },
        },
      },
      orderBy: [{ publishedAt: "desc" }],
      take: limit,
      select: {
        slug: true,
        category: true,
        publishedAt: true,
        translations: {
          where: locale ? { locale } : undefined,
          select: { locale: true, title: true, excerpt: true },
        },
      },
    });

    const targets = rows.flatMap((a) =>
      a.translations.map((t) => ({
        title: t.title,
        excerpt: t.excerpt,
        locale: t.locale,
        category: a.category,
        url: articleUrl(t.locale, a.slug),
        publishedAt: a.publishedAt,
      }))
    );

    return ok(targets, { total: targets.length });
  }, "GET /link-index");
}
