import { LANGS, LANG_CONFIG, getPageUrl } from "@/lib/seo";
import { getIndexableStaticRoutes } from "@/lib/seo/routes";
import { listSitemapArticles } from "@/lib/cms/articles";
import type { Lang } from "@/translations";

const BASE_URL = "https://residency24.com";

interface SitemapEntry {
  loc: string;
  lastmod: string;
  changefreq?: string;
  priority?: number;
  /** locale -> absolute URL */
  alternates: Record<string, string>;
}

/**
 * Builds the XML for one language's sitemap (a <urlset>): static pages + blog
 * articles translated in that locale. Each entry carries hreflang alternates.
 */
export async function buildLanguageSitemap(lang: Lang): Promise<string> {
  const now = new Date().toISOString();
  const staticEntries: SitemapEntry[] = getIndexableStaticRoutes().map((r) => {
    const path = r.path ? `${r.path}/` : "";
    return {
      loc: getPageUrl(lang, path),
      lastmod: now,
      changefreq: r.changeFrequency,
      priority: r.priority,
      alternates: alternatesForPath(path, LANGS),
    };
  });

  const articles = await listSitemapArticles(lang).catch(() => []);
  const articleEntries: SitemapEntry[] = articles.map((a) => ({
    loc: getPageUrl(lang, `blog/${a.slug}/`),
    lastmod: (a.updatedAt ?? a.publishedAt ?? new Date()).toISOString(),
    changefreq: "monthly",
    priority: 0.7,
    alternates: alternatesForPath(
      `blog/${a.slug}/`,
      a.locales.filter((l): l is Lang => (LANGS as readonly string[]).includes(l))
    ),
  }));

  return renderUrlset([...staticEntries, ...articleEntries]);
}

/**
 * Builds the sitemap-index XML pointing at each per-language sitemap, with
 * each sub-sitemap's lastmod.
 */
export function buildSitemapIndex(): string {
  const now = new Date().toISOString();
  const sitemaps = LANGS.map(
    (lang) =>
      `  <sitemap>\n    <loc>${BASE_URL}/sitemap-${lang}.xml</loc>\n    <lastmod>${now}</lastmod>\n  </sitemap>`
  ).join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemaps}\n</sitemapindex>\n`;
}

function alternatesForPath(path: string, availableLangs: Lang[]): Record<string, string> {
  const out: Record<string, string> = {};
  for (const l of availableLangs) {
    out[LANG_CONFIG[l].hreflang] = getPageUrl(l, path);
  }
  if (availableLangs.includes("en")) {
    out["x-default"] = getPageUrl("en", path);
  }
  return out;
}

function renderUrlset(entries: SitemapEntry[]): string {
  const urls = entries.map((e) => {
    const alts = Object.entries(e.alternates)
      .map(
        ([hreflang, href]) =>
          `    <xhtml:link rel="alternate" hreflang="${hreflang}" href="${escapeXml(href)}"/>`
      )
      .join("\n");
    return [
      "  <url>",
      `    <loc>${escapeXml(e.loc)}</loc>`,
      alts,
      `    <lastmod>${e.lastmod}</lastmod>`,
      e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : "",
      e.priority != null ? `    <priority>${e.priority}</priority>` : "",
      "  </url>",
    ]
      .filter(Boolean)
      .join("\n");
  }).join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls}\n</urlset>\n`;
}

function escapeXml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
