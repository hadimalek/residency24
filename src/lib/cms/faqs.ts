import { prisma } from "@/lib/prisma";
import type { Locale } from "@/i18n/routing";

export async function listFaqs(
  locale: Locale,
  options: {
    countrySlug?: string;
    visaTypeSlug?: string;
    serviceSlug?: string;
    category?: string;
  } = {}
) {
  const { countrySlug, visaTypeSlug, serviceSlug, category } = options;

  return prisma.faq.findMany({
    where: {
      isActive: true,
      ...(category && { category }),
      ...(countrySlug && { country: { slug: countrySlug } }),
      ...(visaTypeSlug && { visaType: { slug: visaTypeSlug } }),
      ...(serviceSlug && { service: { slug: serviceSlug } }),
    },
    include: { translations: { where: { locale } } },
    orderBy: { sortOrder: "asc" },
  });
}
