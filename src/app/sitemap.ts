import type { MetadataRoute } from "next";
import { LANGS, LANG_CONFIG, getPageUrl } from "@/lib/seo";
import { getIndexableStaticRoutes } from "@/lib/seo/routes";
import { listSitemapArticles } from "@/lib/cms/articles";
import type { Lang } from "@/translations";

// Refresh sitemaps at most once an hour. New posts show up within this window
// even without a rebuild.
export const revalidate = 3600;

/**
 * Produces one sitemap per language. URLs end up at:
 *   /sitemap/en.xml, /sitemap/fa.xml, /sitemap/ar.xml, /sitemap/ru.xml
 * `robots.ts` then references all four.
 */
export async function generateSitemaps() {
  return LANGS.map((lang) => ({ id: lang }));
}

export default async function sitemap(props: {
  id: Promise<string>;
}): Promise<MetadataRoute.Sitemap> {
  const id = await props.id;
  const lang = (LANGS.includes(id as Lang) ? id : "en") as Lang;

  return [
    ...buildStaticEntries(lang),
    ...(await buildArticleEntries(lang)),
  ];
}

/**
 * Static page entries for the given language. Each URL carries hreflang
 * alternates to every other language (all static routes exist in all 4 langs).
 */
function buildStaticEntries(lang: Lang): MetadataRoute.Sitemap {
  const now = new Date();
  return getIndexableStaticRoutes().map((route) => {
    const path = route.path ? `${route.path}/` : "";
    return {
      url: getPageUrl(lang, path),
      lastModified: now,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
      alternates: { languages: buildAlternates(path, LANGS) },
    };
  });
}

/**
 * Blog article entries for the given language. Only articles translated in
 * `lang` are emitted; hreflang alternates only point to locales where the
 * article actually has a translation. Articles flagged noindex are already
 * filtered out by `listSitemapArticles`.
 */
async function buildArticleEntries(lang: Lang): Promise<MetadataRoute.Sitemap> {
  const articles = await listSitemapArticles(lang).catch(() => []);

  return articles.map((a) => ({
    url: getPageUrl(lang, `blog/${a.slug}/`),
    lastModified: a.updatedAt ?? a.publishedAt ?? new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
    alternates: {
      languages: buildAlternates(
        `blog/${a.slug}/`,
        a.locales.filter((l): l is Lang => (LANGS as readonly string[]).includes(l))
      ),
    },
  }));
}

/**
 * Builds the { hreflang -> url } map for one URL.
 * Always emits x-default pointing to the English version (per the en-at-root
 * convention used by this site).
 */
function buildAlternates(path: string, availableLangs: Lang[]): Record<string, string> {
  const out: Record<string, string> = {};
  for (const l of availableLangs) {
    out[LANG_CONFIG[l].hreflang] = getPageUrl(l, path);
  }
  if (availableLangs.includes("en")) {
    out["x-default"] = getPageUrl("en", path);
  }
  return out;
}
