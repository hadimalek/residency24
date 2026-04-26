import { prisma } from "@/lib/prisma";
import type { Locale } from "@/i18n/routing";

export async function getSeoMetaForPage(pageId: string, locale: Locale) {
  return prisma.seoMeta.findUnique({
    where: { pageId_locale: { pageId, locale } },
  });
}
