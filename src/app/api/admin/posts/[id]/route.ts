import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { slugify, tiptapJsonToHtml } from "@/lib/cms/admin-queries";

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
    return NextResponse.json(article);
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

    const contentJson = body.contentJson ?? trans?.contentJson ?? null;
    const contentHtml =
      body.contentJson !== undefined
        ? tiptapJsonToHtml(contentJson)
        : (body.contentHtml ?? trans?.content ?? "");

    const status =
      body.status === "PUBLISHED" || body.status === "DRAFT" || body.status === "ARCHIVED"
        ? body.status
        : article.status;

    // Set publishedAt the first time we go to PUBLISHED.
    let publishedAt = article.publishedAt;
    if (status === "PUBLISHED" && !article.publishedAt) {
      publishedAt = new Date();
    }
    if (status !== "PUBLISHED") {
      publishedAt = article.publishedAt; // preserve original published timestamp on un-publish
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
