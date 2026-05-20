/**
 * CMS query helpers — read blog data from Prisma and shape it for the
 * existing CmsPost* contract consumed by /api/cms/* routes and ultimately
 * by the frontend Server Components in src/app/[lang]/blog.
 *
 * IMPORTANT: server-only — never import from a Client Component.
 */
import { prisma } from "@/lib/db";
import type { Prisma } from "@prisma/client";

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://new.residency24.com").replace(/\/$/, "");

const BREADCRUMB_LABELS: Record<string, { home: string; blog: string }> = {
  en: { home: "Residency24", blog: "Blog" },
  fa: { home: "رزیدنسی۲۴", blog: "بلاگ" },
  ar: { home: "رزیدنسی۲۴", blog: "المدونة" },
  ru: { home: "Residency24", blog: "Блог" },
};

function postUrl(lang: string, slug: string): string {
  return lang === "en" ? `/blog/${slug}` : `/${lang}/blog/${slug}`;
}

function blogIndexUrl(lang: string): string {
  return lang === "en" ? `/blog` : `/${lang}/blog`;
}

function homeUrl(lang: string): string {
  return lang === "en" ? `/` : `/${lang}/`;
}

/**
 * Stable 32-bit hash of a cuid → exposed as numeric id in the public API.
 */
function hashId(cuid: string): number {
  let h = 0;
  for (let i = 0; i < cuid.length; i++) h = ((h << 5) - h + cuid.charCodeAt(i)) | 0;
  return Math.abs(h);
}

type MediaWithTrans = Prisma.MediaGetPayload<{ include: { translations: true } }>;

function mediaToCms(media: MediaWithTrans | null | undefined) {
  if (!media) return null;
  const t = media.translations?.[0];
  const raw = media.filePath ?? "";
  // Strip any existing domain so DB entries with absolute URLs are re-prefixed
  // with the current SITE_URL (handles migration from new.residency24.com → residency24.com).
  const path = raw.replace(/^https?:\/\/[^/]+/, "");
  const url = path ? `${SITE_URL}${path.startsWith("/") ? "" : "/"}${path}` : "";
  return {
    url,
    alt: t?.altText ?? null,
    width: media.width,
    height: media.height,
    mime_type: media.mimeType,
  };
}

// ─────────────────────────────────────────────────────────────────────
// LIST POSTS
// ─────────────────────────────────────────────────────────────────────

export interface ListPostsOpts {
  lang: string;
  category?: string;
  tag?: string;
  q?: string;
  type?: string;
  page: number;
  perPage: number;
  slugs?: string[];
}

export async function listPosts(opts: ListPostsOpts) {
  const { lang, category, q, page, perPage, slugs } = opts;

  const where: Prisma.ArticleWhereInput = {
    status: "PUBLISHED",
    translations: { some: { locale: lang } },
    ...(category ? { category } : {}),
    ...(slugs && slugs.length > 0 ? { slug: { in: slugs } } : {}),
    ...(q
      ? {
          translations: {
            some: {
              locale: lang,
              OR: [
                { title: { contains: q } },
                { excerpt: { contains: q } },
              ],
            },
          },
        }
      : {}),
  };

  const [total, articles] = await Promise.all([
    prisma.article.count({ where }),
    prisma.article.findMany({
      where,
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
      skip: (page - 1) * perPage,
      take: perPage,
      include: {
        translations: { where: { locale: lang } },
        featuredImage: { include: { translations: { where: { locale: lang } } } },
      },
    }),
  ]);

  const data = articles.map((a) => {
    const t = a.translations[0];
    return {
      id: hashId(a.id),
      lang,
      type: "post",
      title: t?.title ?? "",
      slug: a.slug,
      url: postUrl(lang, a.slug),
      excerpt: t?.excerpt ?? null,
      reading_time_minutes: null as number | null,
      published_at: a.publishedAt?.toISOString() ?? null,
      updated_at: a.updatedAt.toISOString(),
      author: null,
      category: a.category ? { name: a.category, slug: a.category } : null,
      tags: [] as { name: string; slug: string }[],
      featured_image: mediaToCms(a.featuredImage),
      has_translations: false,
      translation_count: a.translations.length,
    };
  });

  const lastPage = Math.max(1, Math.ceil(total / perPage));
  return {
    data,
    meta: {
      current_page: page,
      last_page: lastPage,
      per_page: perPage,
      total,
      from: total > 0 ? (page - 1) * perPage + 1 : null,
      to: total > 0 ? Math.min(page * perPage, total) : null,
    },
    links: {
      first: total > 0 ? `?page=1` : null,
      last: total > 0 ? `?page=${lastPage}` : null,
      prev: page > 1 ? `?page=${page - 1}` : null,
      next: page < lastPage ? `?page=${page + 1}` : null,
    },
  };
}

// ─────────────────────────────────────────────────────────────────────
// LIST CATEGORIES
// ─────────────────────────────────────────────────────────────────────

export async function listCategories(_lang: string) {
  // BlogCategory model has been removed; return empty list.
  return [];
}

// ─────────────────────────────────────────────────────────────────────
// POST DETAIL
// ─────────────────────────────────────────────────────────────────────

export async function getPostDetail(lang: string, slug: string) {
  const article = await prisma.article.findFirst({
    where: {
      slug,
      status: "PUBLISHED",
      translations: { some: { locale: lang } },
    },
    include: {
      translations: { where: { locale: lang } },
      featuredImage: { include: { translations: { where: { locale: lang } } } },
    },
  });
  if (!article) return null;
  const t = article.translations[0];
  if (!t) return null;

  const canonical = `${SITE_URL}${postUrl(lang, article.slug)}`;
  const featured = mediaToCms(article.featuredImage);

  const post = {
    id: hashId(article.id),
    lang,
    type: "post",
    title: t.title,
    slug: article.slug,
    url: postUrl(lang, article.slug),
    canonical_url: canonical,
    excerpt: t.excerpt ?? null,
    content_html: t.content,
    reading_time_minutes: null as number | null,
    published_at: article.publishedAt?.toISOString() ?? null,
    updated_at: article.updatedAt.toISOString(),
    author: null,
    category: article.category ? { name: article.category, slug: article.category } : null,
    tags: [] as { name: string; slug: string }[],
    featured_image: featured,
  };

  const seo = {
    meta_title: t.metaTitle ?? null,
    meta_description: t.metaDescription ?? t.excerpt?.slice(0, 300) ?? null,
    robots: "index,follow",
    canonical_url: canonical,
    og_title: t.metaTitle ?? t.title,
    og_description: t.metaDescription ?? t.excerpt ?? null,
    og_image_url: featured?.url ?? null,
    og_type: "article",
    twitter_card: "summary_large_image",
    twitter_title: t.metaTitle ?? t.title,
    twitter_description: t.metaDescription ?? t.excerpt ?? null,
    twitter_image_url: featured?.url ?? null,
  };

  // Each WP-import post is mono-locale; expose just its own URL.
  const hreflang = [{ lang, url: canonical }];

  // FAQs — model removed, return empty list.
  const faqs: Array<{ question: string; answer: string; sort_order: number }> = [];

  // Same-category related posts (most recent 6, excluding self).
  let related: { entity_type: string; entity_key: string; relation: string }[] = [];
  if (article.category) {
    const sameCat = await prisma.article.findMany({
      where: {
        category: article.category,
        translations: { some: { locale: lang } },
        status: "PUBLISHED",
        id: { not: article.id },
      },
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
      take: 6,
      select: { slug: true },
    });
    related = sameCat.map((r) => ({
      entity_type: "post",
      entity_key: r.slug,
      relation: "category",
    }));
  }
  // If still short on related (uncategorized post), fall back to most-recent in lang.
  if (related.length === 0) {
    const recent = await prisma.article.findMany({
      where: {
        translations: { some: { locale: lang } },
        status: "PUBLISHED",
        id: { not: article.id },
      },
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
      take: 6,
      select: { slug: true },
    });
    related = recent.map((r) => ({
      entity_type: "post",
      entity_key: r.slug,
      relation: "recent",
    }));
  }

  const labels = BREADCRUMB_LABELS[lang] ?? BREADCRUMB_LABELS.en;
  const breadcrumbs = [
    { label: labels.home, href: `${SITE_URL}${homeUrl(lang)}` },
    { label: labels.blog, href: `${SITE_URL}${blogIndexUrl(lang)}` },
    { label: t.title, href: canonical },
  ];

  return {
    post,
    seo,
    hreflang,
    faqs,
    ctas: [] as Array<{
      type: string;
      title: string | null;
      body: string | null;
      button_label: string | null;
      target_url: string | null;
      service_context: string | null;
      placement: string | null;
    }>,
    related,
    breadcrumbs,
  };
}

// ─────────────────────────────────────────────────────────────────────
// ALL POST PARAMS (for generateStaticParams)
// ─────────────────────────────────────────────────────────────────────

export async function getAllPostParams() {
  const articles = await prisma.article.findMany({
    where: { status: "PUBLISHED" },
    include: {
      translations: { select: { locale: true } },
    },
  });
  const params: { lang: string; slug: string }[] = [];
  for (const a of articles) {
    for (const t of a.translations) {
      params.push({ lang: t.locale, slug: a.slug });
    }
  }
  return params;
}
