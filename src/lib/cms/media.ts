import { prisma } from "@/lib/prisma";
import type { Locale } from "@/i18n/routing";

export async function getMediaById(id: string, locale: Locale) {
  return prisma.media.findUnique({
    where: { id },
    include: { translations: { where: { locale } } },
  });
}

/**
 * Resolve the locale-specific alt text for a Media row, with fallback to
 * a non-empty alt in any other locale, then to the file name.
 */
export function pickAltText(
  media: {
    fileName: string;
    translations: { altText: string | null; locale: string }[];
  },
  locale: Locale
): string {
  const exact = media.translations.find(
    (t) => t.locale === locale && t.altText
  );
  if (exact?.altText) return exact.altText;

  const fallback = media.translations.find((t) => t.altText);
  return fallback?.altText ?? media.fileName;
}
