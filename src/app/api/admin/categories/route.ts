import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { slugify } from "@/lib/cms/admin-queries";
import { articleCategoryCounts, isHubCategory, prettifySlug } from "@/lib/cms/queries";

export const dynamic = "force-dynamic";

const LOCALES = ["fa", "en", "ar", "ru"] as const;

/**
 * GET /api/admin/categories — list (optionally filtered by lang)
 *
 * Lists the categories that ACTUALLY EXIST, which means the distinct
 * `Article.category` slugs per locale — not the rows of `BlogCategory`. That
 * table is only a naming overlay and is empty in production, so listing it
 * directly showed an empty admin screen while the site had ten live categories,
 * and left the post editor's category dropdown blank too.
 *
 * Each row carries:
 *   id        — the overlay row's id, or null when no overlay exists yet
 *                (saving such a row creates one; there is nothing to delete)
 *   name      — the overlay's localised name, else the prettified slug
 *   postCount — published articles with a translation in THIS locale
 *   hub       — false for slugs the site deliberately does not link or index
 *                (WordPress's "uncategorized"), see src/proxy.ts
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const lang = searchParams.get("lang") || undefined;
  const locales = lang ? [lang] : [...LOCALES];

  try {
    const rows = [];

    for (const locale of locales) {
      const [counts, overlay] = await Promise.all([
        articleCategoryCounts(locale),
        prisma.blogCategory.findMany({ where: { locale } }),
      ]);
      const bySlug = new Map(overlay.map((c) => [c.slug, c]));

      // Union: slugs in use by articles, plus overlay rows that exist but have
      // no articles yet (so a newly created category is still visible/editable).
      const slugs = new Set<string>([...counts.keys(), ...bySlug.keys()]);

      for (const slug of slugs) {
        const managed = bySlug.get(slug);
        rows.push({
          id: managed?.id ?? null,
          locale,
          slug,
          name: managed?.name ?? prettifySlug(slug),
          description: managed?.description ?? null,
          sortOrder: managed?.sortOrder ?? 0,
          postCount: counts.get(slug) ?? 0,
          hub: isHubCategory(slug),
          named: Boolean(managed),
        });
      }
    }

    rows.sort(
      (a, b) =>
        a.locale.localeCompare(b.locale) ||
        a.sortOrder - b.sortOrder ||
        b.postCount - a.postCount ||
        a.name.localeCompare(b.name)
    );

    return NextResponse.json({ data: rows });
  } catch (err) {
    console.error("[/api/admin/categories] GET error:", err);
    return NextResponse.json({ data: [] }, { status: 500 });
  }
}

// POST /api/admin/categories — create the overlay row for a (locale, slug).
// Also how a derived, not-yet-named category gets its localised name: the client
// posts the existing slug and the name to use.
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const locale: string = body.locale;
    const name: string = (body.name ?? "").trim();
    if (!locale || !name) {
      return NextResponse.json({ message: "locale and name are required" }, { status: 400 });
    }
    // Keep an existing slug verbatim — slugify() would mangle the non-latin ones
    // that came out of the WordPress import. Only derive a slug from the name
    // when the caller did not supply one.
    const raw = (body.slug ?? "").trim();
    const slug = raw || slugify(name);

    const conflict = await prisma.blogCategory.findUnique({
      where: { locale_slug: { locale, slug } },
    });
    if (conflict) {
      return NextResponse.json({ message: "Slug already exists in this locale" }, { status: 409 });
    }
    const cat = await prisma.blogCategory.create({
      data: {
        locale,
        slug: slug.slice(0, 128),
        name: name.slice(0, 255),
        description: body.description ?? null,
        sortOrder: body.sortOrder ?? 0,
        source: "manual",
      },
    });
    return NextResponse.json(cat, { status: 201 });
  } catch (err: unknown) {
    console.error("[/api/admin/categories] POST error:", err);
    const message = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ message }, { status: 500 });
  }
}
