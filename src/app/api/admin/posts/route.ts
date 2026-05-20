import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { slugify, tiptapJsonToHtml, readingTimeFromHtml } from "@/lib/cms/admin-queries";

export const dynamic = "force-dynamic";

// GET /api/admin/posts — admin list (any status, all locales)
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const lang = searchParams.get("lang") || undefined;
  const status = searchParams.get("status") || undefined;
  const q = searchParams.get("q") || undefined;
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10) || 1);
  const perPage = Math.min(100, Math.max(1, parseInt(searchParams.get("per_page") ?? "20", 10) || 20));

  const where: any = {
    ...(lang ? { primaryLocale: lang } : {}),
    ...(status ? { status } : {}),
    ...(q
      ? {
          OR: [
            { slug: { contains: q } },
            { translations: { some: { OR: [{ title: { contains: q } }] } } },
          ],
        }
      : {}),
  };

  try {
    const [total, articles] = await Promise.all([
      prisma.article.count({ where }),
      prisma.article.findMany({
        where,
        orderBy: [{ updatedAt: "desc" }],
        skip: (page - 1) * perPage,
        take: perPage,
        include: {
          translations: true,
          author: true,
          blogCategory: true,
          featuredImage: true,
        },
      }),
    ]);

    const data = articles.map((a) => {
      const t = a.translations.find((x) => x.locale === a.primaryLocale) ?? a.translations[0];
      return {
        id: a.id,
        slug: a.slug,
        status: a.status,
        primaryLocale: a.primaryLocale,
        title: t?.title ?? "(بدون عنوان)",
        excerpt: t?.excerpt ?? null,
        publishedAt: a.publishedAt,
        updatedAt: a.updatedAt,
        author: a.author ? { id: a.author.id, name: a.author.name } : null,
        category: a.blogCategory ? { id: a.blogCategory.id, name: a.blogCategory.name } : null,
        featuredImagePath: a.featuredImage?.filePath ?? null,
        readingTimeMinutes: a.readingTimeMinutes,
      };
    });

    return NextResponse.json({
      data,
      meta: {
        page,
        perPage,
        total,
        lastPage: Math.max(1, Math.ceil(total / perPage)),
      },
    });
  } catch (err) {
    console.error("[/api/admin/posts] GET error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

// POST /api/admin/posts — create new
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const lang: string = body.lang;
    const title: string = (body.title ?? "").trim();
    if (!lang || !title) {
      return NextResponse.json({ message: "lang and title are required" }, { status: 400 });
    }

    let slug = (body.slug ?? "").trim() || slugify(title);
    // ensure unique
    const tryUnique = async (s: string): Promise<string> => {
      const existing = await prisma.article.findUnique({ where: { slug: s } });
      if (!existing) return s;
      // suffix with -2, -3, ...
      for (let i = 2; i < 50; i++) {
        const candidate = `${s}-${i}`;
        const ex = await prisma.article.findUnique({ where: { slug: candidate } });
        if (!ex) return candidate;
      }
      throw new Error("could not allocate unique slug");
    };
    slug = await tryUnique(slug);

    const contentJson = body.contentJson ?? null;
    const contentHtml = contentJson ? tiptapJsonToHtml(contentJson) : (body.contentHtml ?? "");
    const excerpt = body.excerpt ?? null;
    const status = body.status === "PUBLISHED" ? "PUBLISHED" : "DRAFT";
    const authorId = body.authorId ?? null;
    const blogCategoryId = body.blogCategoryId ?? null;
    const featuredImageId = body.featuredImageId ?? null;
    const metaTitle = body.metaTitle ?? null;
    const metaDescription = body.metaDescription ?? null;

    const publishedAt = status === "PUBLISHED" ? new Date() : null;
    const rt = readingTimeFromHtml(contentHtml);

    const article = await prisma.article.create({
      data: {
        slug,
        status,
        publishedAt,
        primaryLocale: lang,
        authorId,
        blogCategoryId,
        featuredImageId,
        readingTimeMinutes: rt,
        source: "manual",
        translations: {
          create: {
            locale: lang,
            title: title.slice(0, 255),
            excerpt,
            content: contentHtml,
            contentJson: contentJson ?? undefined,
            metaTitle,
            metaDescription,
          },
        },
      },
    });

    return NextResponse.json({ id: article.id, slug: article.slug }, { status: 201 });
  } catch (err: any) {
    console.error("[/api/admin/posts] POST error:", err);
    return NextResponse.json({ message: err?.message ?? "Server error" }, { status: 500 });
  }
}
