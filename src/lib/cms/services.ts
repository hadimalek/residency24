import { prisma } from "@/lib/prisma";
import type { Locale } from "@/i18n/routing";

export async function getServiceBySlug(slug: string, locale: Locale) {
  const service = await prisma.service.findUnique({
    where: { slug },
    include: {
      translations: { where: { locale } },
      heroImage: true,
    },
  });

  if (!service || !service.isActive || service.translations.length === 0) {
    return null;
  }

  return { ...service, translation: service.translations[0] };
}

export async function listFeaturedServices(locale: Locale, limit = 6) {
  return prisma.service.findMany({
    where: { isActive: true, isFeatured: true },
    include: { translations: { where: { locale } }, heroImage: true },
    orderBy: { sortOrder: "asc" },
    take: limit,
  });
}

export async function listServicesForCountry(
  countrySlug: string,
  locale: Locale
) {
  return prisma.service.findMany({
    where: {
      isActive: true,
      countryLinks: { some: { country: { slug: countrySlug } } },
    },
    include: { translations: { where: { locale } } },
    orderBy: { sortOrder: "asc" },
  });
}
