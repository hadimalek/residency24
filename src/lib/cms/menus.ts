import { prisma } from "@/lib/prisma";
import type { Locale } from "@/i18n/routing";

/**
 * Fetch a menu by its key (e.g. "header_main", "footer_legal") and return its
 * top-level items (parentId = null) with their children + locale-specific
 * labels resolved.
 */
export async function getMenuByKey(key: string, locale: Locale) {
  const menu = await prisma.menu.findUnique({
    where: { key },
    include: {
      items: {
        where: { isActive: true, parentId: null },
        include: {
          translations: { where: { locale } },
          children: {
            where: { isActive: true },
            include: { translations: { where: { locale } } },
            orderBy: { sortOrder: "asc" },
          },
        },
        orderBy: { sortOrder: "asc" },
      },
    },
  });

  if (!menu || !menu.isActive) return null;
  return menu;
}
