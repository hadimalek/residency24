import { prisma } from "@/lib/prisma";
import type { Locale } from "@/i18n/routing";

export async function getCostTableBySlug(slug: string, locale: Locale) {
  const table = await prisma.costTable.findUnique({
    where: { slug },
    include: {
      translations: { where: { locale } },
      items: {
        include: { translations: { where: { locale } } },
        orderBy: { sortOrder: "asc" },
      },
    },
  });

  if (!table || !table.isActive || table.translations.length === 0) return null;

  return { ...table, translation: table.translations[0] };
}

export async function listCostTablesFor(
  locale: Locale,
  filter: { countrySlug?: string; visaTypeSlug?: string; serviceSlug?: string }
) {
  return prisma.costTable.findMany({
    where: {
      isActive: true,
      ...(filter.countrySlug && { country: { slug: filter.countrySlug } }),
      ...(filter.visaTypeSlug && { visaType: { slug: filter.visaTypeSlug } }),
      ...(filter.serviceSlug && { service: { slug: filter.serviceSlug } }),
    },
    include: {
      translations: { where: { locale } },
      items: {
        include: { translations: { where: { locale } } },
        orderBy: { sortOrder: "asc" },
      },
    },
    orderBy: { updatedAt: "desc" },
  });
}
