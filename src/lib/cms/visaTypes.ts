import { prisma } from "@/lib/prisma";
import type { Locale } from "@/i18n/routing";

export async function getVisaTypeBySlug(slug: string, locale: Locale) {
  const visa = await prisma.visaType.findUnique({
    where: { slug },
    include: {
      translations: { where: { locale } },
      heroImage: true,
      requirements: {
        where: { isActive: true },
        include: { translations: { where: { locale } } },
        orderBy: { sortOrder: "asc" },
      },
    },
  });

  if (!visa || !visa.isActive || visa.translations.length === 0) return null;

  return { ...visa, translation: visa.translations[0] };
}

export async function listFeaturedVisaTypes(locale: Locale, limit = 12) {
  return prisma.visaType.findMany({
    where: { isActive: true, isFeatured: true },
    include: { translations: { where: { locale } }, heroImage: true },
    orderBy: [{ sortOrder: "asc" }, { slug: "asc" }],
    take: limit,
  });
}

export async function listVisaTypesByCategory(
  category: string,
  locale: Locale
) {
  return prisma.visaType.findMany({
    where: { isActive: true, category },
    include: { translations: { where: { locale } } },
    orderBy: { sortOrder: "asc" },
  });
}

export async function listVisaTypesForCountry(
  countrySlug: string,
  locale: Locale
) {
  return prisma.visaType.findMany({
    where: {
      isActive: true,
      countryLinks: { some: { country: { slug: countrySlug } } },
    },
    include: { translations: { where: { locale } } },
    orderBy: { sortOrder: "asc" },
  });
}
