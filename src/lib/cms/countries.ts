import { prisma } from "@/lib/prisma";
import type { Locale } from "@/i18n/routing";

export async function getCountryBySlug(slug: string, locale: Locale) {
  const country = await prisma.country.findUnique({
    where: { slug },
    include: {
      translations: { where: { locale } },
      heroImage: { include: { translations: { where: { locale } } } },
    },
  });

  if (!country || !country.isActive || country.translations.length === 0) {
    return null;
  }

  return {
    ...country,
    translation: country.translations[0],
  };
}

export async function listFeaturedCountries(locale: Locale, limit = 6) {
  return prisma.country.findMany({
    where: { isActive: true, isFeatured: true },
    include: {
      translations: { where: { locale } },
      heroImage: true,
    },
    orderBy: { sortOrder: "asc" },
    take: limit,
  });
}

export async function listAllCountries(locale: Locale) {
  return prisma.country.findMany({
    where: { isActive: true },
    include: { translations: { where: { locale } } },
    orderBy: { sortOrder: "asc" },
  });
}
