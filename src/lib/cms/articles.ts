import { prisma } from "@/lib/prisma";
import type { Locale } from "@/i18n/routing";

export async function getArticleBySlug(slug: string, locale: Locale) {
  const article = await prisma.article.findUnique({
    where: { slug },
    include: {
      translations: { where: { locale } },
      featuredImage: { include: { translations: { where: { locale } } } },
      country: { include: { translations: { where: { locale } } } },
    },
  });

  if (
    !article ||
    article.status !== "PUBLISHED" ||
    article.translations.length === 0
  ) {
    return null;
  }

  return { ...article, translation: article.translations[0] };
}

export async function listPublishedArticles(
  locale: Locale,
  options: {
    countrySlug?: string;
    category?: string;
    take?: number;
    skip?: number;
  } = {}
) {
  const { countrySlug, category, take = 12, skip = 0 } = options;

  return prisma.article.findMany({
    where: {
      status: "PUBLISHED",
      ...(category && { category }),
      ...(countrySlug && { country: { slug: countrySlug } }),
    },
    include: {
      translations: { where: { locale } },
      featuredImage: true,
    },
    orderBy: { publishedAt: "desc" },
    take,
    skip,
  });
}

export async function listFeaturedArticles(locale: Locale, limit = 3) {
  return prisma.article.findMany({
    where: { status: "PUBLISHED", isFeatured: true },
    include: { translations: { where: { locale } }, featuredImage: true },
    orderBy: { publishedAt: "desc" },
    take: limit,
  });
}

export interface HomePostPreview {
  slug: string;
  title: string;
  excerpt: string;
  href: string;
  img: string | null;
  alt: string;
  tag: string;
  date: string;
}

export interface SitemapArticle {
  slug: string;
  publishedAt: Date | null;
  updatedAt: Date;
  /** Locales for which a translation exists (used to build hreflang alternates). */
  locales: string[];
}

/**
 * Returns one row per published, indexable article that has a translation in
 * `locale`. The returned `locales` array tells the sitemap which hreflang
 * alternates to emit (only locales where the article is actually translated).
 *
 * Articles whose `robots` field matches /noindex/i are excluded entirely.
 */
export async function listSitemapArticles(locale: Locale): Promise<SitemapArticle[]> {
  const articles = await prisma.article.findMany({
    where: {
      status: "PUBLISHED",
      translations: { some: { locale } },
      // Tolerate both the legacy null case and explicit "index,follow".
      OR: [{ robots: null }, { robots: { not: { contains: "noindex" } } }],
    },
    select: {
      slug: true,
      publishedAt: true,
      updatedAt: true,
      translations: { select: { locale: true } },
    },
    orderBy: { publishedAt: "desc" },
  });

  return articles.map((a) => ({
    slug: a.slug,
    publishedAt: a.publishedAt,
    updatedAt: a.updatedAt,
    locales: a.translations.map((t) => t.locale),
  }));
}

export async function listHomePagePreviewArticles(
  locale: Locale,
  limit = 6
): Promise<HomePostPreview[]> {
  const articles = await prisma.article.findMany({
    where: {
      status: "PUBLISHED",
      translations: { some: { locale } },
    },
    include: {
      translations: { where: { locale } },
      featuredImage: true,
    },
    orderBy: { publishedAt: "desc" },
    take: limit,
  });

  const monthYear = new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" });

  return articles
    .filter((a) => a.translations.length > 0)
    .map((a) => {
      const t = a.translations[0];
      const raw = a.featuredImage?.filePath ?? null;
      const img = raw ? (raw.startsWith("/") || raw.startsWith("http") ? raw : `/${raw}`) : null;
      return {
        slug: a.slug,
        title: t.title,
        excerpt: t.excerpt ?? "",
        href: `/${locale}/blog/${a.slug}/`,
        img,
        alt: t.title,
        tag: a.category ?? "",
        date: a.publishedAt ? monthYear.format(a.publishedAt) : "",
      };
    });
}
