import { prisma } from "@/lib/prisma";

/**
 * Look up a redirect for a given path. Locale-specific match wins over the
 * global (locale=null) fallback.
 *
 * Returns the toPath + statusCode if a redirect should fire, or null if not.
 *
 * On a hit, increments hitCount and updates lastHitAt asynchronously
 * (fire-and-forget). The tiny extra latency is acceptable for redirects
 * because they're already a one-shot HTTP response.
 */
export async function findActiveRedirect(
  fromPath: string,
  locale?: string | null
) {
  const candidates = await prisma.redirect.findMany({
    where: {
      isActive: true,
      fromPath,
      OR: [
        { locale: null },
        ...(locale ? [{ locale }] : []),
      ],
    },
  });

  if (candidates.length === 0) return null;

  // Prefer the locale-specific row if both exist.
  const match = locale
    ? candidates.find((r) => r.locale === locale) ?? candidates[0]
    : candidates[0];

  // Fire-and-forget bookkeeping.
  prisma.redirect
    .update({
      where: { id: match.id },
      data: { hitCount: { increment: 1 }, lastHitAt: new Date() },
    })
    .catch(() => {
      /* ignore — redirect logic must not fail on bookkeeping errors */
    });

  return { toPath: match.toPath, statusCode: match.statusCode };
}
