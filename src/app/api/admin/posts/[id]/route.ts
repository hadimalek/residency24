import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { slugify, tiptapJsonToHtml } from "@/lib/cms/admin-queries";

/**
 * Parse a date coming from the admin form. Accepts an ISO string or a
 * `datetime-local` value ("2026-08-26T14:30"), returns undefined for absent /
 * unparseable input so the caller can tell "leave alone" from "clear".
 */
function parseDate(v: unknown): Date | null | undefined {
  if (v === undefined) return undefined;
  if (v === null || v === "") return null;
  if (typeof v !== "string") return undefined;
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? undefined : d;
}

export const dynamic = "force-dynamic";

// GET /api/admin/posts/[id] — fetch single post (with all translations + relations)
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const article = await prisma.article.findUnique({
      where: { id },
      include: {
        translations: true,
        featuredImage: true,
      },
    });
    if (!article) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }
    // Normalize filePath: strip any legacy absolute URL domain so the client
    // always gets a path relative to the current site.
    const normalized = {
      ...article,
      featuredImage: article.featuredImage
        ? {
            ...article.featuredImage,
            filePath: article.featuredImage.filePath?.replace(/^https?:\/\/[^/]+/, "") ?? null,
          }
        : null,
    };
    return NextResponse.json(normalized);
  } catch (err) {
    console.error("[/api/admin/posts/[id]] GET error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

// PATCH /api/admin/posts/[id] — update fields + primary translation
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const body = await request.json();
    const article = await prisma.article.findUnique({
      where: { id },
      include: { translations: true },
    });
    if (!article) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    const lang = body.lang ?? article.translations[0]?.locale ?? "en";
    const trans = article.translations.find((t) => t.locale === lang) ?? article.translations[0];

    // Slug change handling — must remain unique
    let nextSlug: string | undefined;
    if (typeof body.slug === "string" && body.slug.trim() && body.slug !== article.slug) {
      const candidate = slugify(body.slug);
      const conflict = await prisma.article.findUnique({ where: { slug: candidate } });
      if (conflict && conflict.id !== id) {
        return NextResponse.json({ message: "Slug already in use" }, { status: 409 });
      }
      nextSlug = candidate;
    }

    const contentJson = body.contentJson ?? (trans as any)?.contentJson ?? null;
    let contentHtml =
      body.contentJson !== undefined
        ? tiptapJsonToHtml(contentJson)
        : (body.contentHtml ?? trans?.content ?? "");
    // Safety net: never let an empty render silently wipe content that already
    // exists. Posts imported with HTML-only (no contentJson) would otherwise be
    // blanked if saved before the editor seeded its JSON.
    if (!contentHtml.trim() && trans?.content) {
      contentHtml = trans.content;
    }

    const status =
      body.status === "PUBLISHED" || body.status === "DRAFT" || body.status === "ARCHIVED"
        ? body.status
        : article.status;

    // Publish date. An explicit value from the form always wins — editors need
    // to backdate imported posts and correct wrong dates. Otherwise fall back to
    // stamping "now" the first time an article goes to PUBLISHED, and never
    // discard an existing timestamp on un-publish.
    const publishedAtInput = parseDate(body.publishedAt);
    let publishedAt = article.publishedAt;
    if (publishedAtInput !== undefined) {
      publishedAt = publishedAtInput;
    } else if (status === "PUBLISHED" && !article.publishedAt) {
      publishedAt = new Date();
    }

    // Update date. `Article.updatedAt` is @updatedAt, so Prisma stamps it on
    // every write unless we pass a value explicitly — which is exactly what an
    // editor setting this field wants, since this timestamp is what the sitemap
    // publishes as <lastmod>. Omitting it keeps the automatic behaviour.
    const updatedAtInput = parseDate(body.updatedAt);

    // authorId: undefined → leave unchanged; null/"" → clear the byline
    let nextAuthorId: string | null | undefined = undefined;
    if (body.authorId !== undefined) {
      nextAuthorId =
        typeof body.authorId === "string" && body.authorId.trim() ? body.authorId.trim() : null;
    }

    // category: undefined → leave unchanged; null/"" → clear; string → set slug
    let nextCategory: string | null | undefined = undefined;
    if (body.category !== undefined) {
      nextCategory =
        typeof body.category === "string" && body.category.trim()
          ? body.category.trim().slice(0, 64)
          : null;
    }

    await prisma.$transaction(async (tx) => {
      await tx.article.update({
        where: { id },
        data: {
          slug: nextSlug ?? article.slug,
          status,
          publishedAt,
          featuredImageId:
            body.featuredImageId === undefined ? article.featuredImageId : body.featuredImageId,
          category: nextCategory === undefined ? article.category : nextCategory,
          authorId: nextAuthorId === undefined ? article.authorId : nextAuthorId,
          ...(updatedAtInput ? { updatedAt: updatedAtInput } : {}),
        },
      });

      const transData = {
        locale: lang,
        title: (body.title ?? trans?.title ?? "").slice(0, 255),
        excerpt: body.excerpt ?? trans?.excerpt ?? null,
        content: contentHtml,
        contentJson: contentJson ?? undefined,
        metaTitle: body.metaTitle ?? trans?.metaTitle ?? null,
        metaDescription: body.metaDescription ?? trans?.metaDescription ?? null,
        faqs: body.faqs !== undefined ? body.faqs : ((trans as any)?.faqs ?? null),
      };

      if (trans) {
        await tx.articleTranslation.update({
          where: { articleId_locale: { articleId: id, locale: trans.locale } },
          data: transData,
        });
      } else {
        await tx.articleTranslation.create({
          data: { ...transData, articleId: id },
        });
      }
    });

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("[/api/admin/posts/[id]] PATCH error:", err);
    return NextResponse.json({ message: err?.message ?? "Server error" }, { status: 500 });
  }
}

// DELETE /api/admin/posts/[id]
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await prisma.$transaction([
      prisma.articleTranslation.deleteMany({ where: { articleId: id } }),
      prisma.article.delete({ where: { id } }),
    ]);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[/api/admin/posts/[id]] DELETE error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
