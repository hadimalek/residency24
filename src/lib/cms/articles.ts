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
