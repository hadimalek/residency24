import { prisma } from "@/lib/prisma";
import type { Locale } from "@/i18n/routing";
import type { PageType } from "@prisma/client";

export async function getPageBySlug(
  slug: string,
  pageType: PageType,
  locale: Locale
) {
  const page = await prisma.page.findUnique({
    where: { slug_pageType: { slug, pageType } },
    include: {
      translations: { where: { locale } },
      blocks: {
        where: { isActive: true },
        include: { translations: { where: { locale } } },
        orderBy: { sortOrder: "asc" },
      },
      seoMeta: { where: { locale } },
      country: { include: { translations: { where: { locale } } } },
      visaType: { include: { translations: { where: { locale } } } },
      service: { include: { translations: { where: { locale } } } },
    },
  });

  if (!page || page.status !== "PUBLISHED" || page.translations.length === 0) {
    return null;
  }

  return { ...page, translation: page.translations[0] };
}

export async function getHomepage(locale: Locale) {
  const page = await prisma.page.findFirst({
    where: { isHomepage: true, status: "PUBLISHED" },
    include: {
      translations: { where: { locale } },
      blocks: {
        where: { isActive: true },
        include: { translations: { where: { locale } } },
        orderBy: { sortOrder: "asc" },
      },
      seoMeta: { where: { locale } },
    },
  });

  if (!page || page.translations.length === 0) return null;

  return { ...page, translation: page.translations[0] };
}

export async function listPublishedPagesByType(
  pageType: PageType,
  locale: Locale
) {
  return prisma.page.findMany({
    where: { pageType, status: "PUBLISHED" },
    include: { translations: { where: { locale } } },
    orderBy: { publishedAt: "desc" },
  });
}
