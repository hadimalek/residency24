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
