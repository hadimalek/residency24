import { LANGS, LANG_CONFIG, getPageUrl } from "@/lib/seo";
import { getIndexableStaticRoutes } from "@/lib/seo/routes";
import { listSitemapArticles } from "@/lib/cms/articles";
import type { Lang } from "@/translations";

const BASE_URL = "https://residency24.com";

interface SitemapEntry {
  loc: string;
  /** ISO 8601 datetime trimmed to seconds (no milliseconds), or undefined to omit <lastmod>. */
  lastmod?: string;
  changefreq?: string;
  priority?: number;
  /** locale -> absolute URL */
  alternates: Record<string, string>;
}

/**
 * W3C Datetime format Google's sitemap protocol expects: `YYYY-MM-DDTHH:MM:SSZ`.
 * `Date#toISOString()` includes milliseconds (`...946Z`), which is technically
 * valid ISO 8601 but is not what crawlers expect for sitemaps.
 */
function toSitemapDate(d: Date): string {
  return d.toISOString().replace(/\.\d{3}Z$/, "Z");
}

/**
 * Builds the XML for one language's sitemap (a <urlset>): static pages + blog
 * articles translated in that locale. Each entry carries hreflang alternates.
 *
 * Static pages intentionally omit <lastmod> — we don't track real per-page
 * edit dates for hand-coded pages, and Google explicitly recommends omitting
 * lastmod over emitting an inaccurate "now" value on every revalidate (they
 * ignore lastmod entirely if it looks fabricated). Articles carry the real
 * `updatedAt` from the DB.
 */
export async function buildLanguageSitemap(lang: Lang): Promise<string> {
  const staticEntries: SitemapEntry[] = getIndexableStaticRoutes().map((r) => {
    const path = r.path ? `${r.path}/` : "";
    return {
      loc: getPageUrl(lang, path),
      changefreq: r.changeFrequency,
      priority: r.priority,
      alternates: alternatesForPath(path, LANGS),
    };
  });

  const articles = await listSitemapArticles(lang).catch(() => []);
  const articleEntries: SitemapEntry[] = articles.map((a) => ({
    loc: getPageUrl(lang, `blog/${a.slug}/`),
    lastmod: toSitemapDate(a.updatedAt ?? a.publishedAt ?? new Date()),
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
 * Sitemap-index XML pointing at each per-language sitemap. Each sub-sitemap's
 * lastmod is the most recent article updatedAt for that language (with a
 * fallback for languages that have no articles yet). This gives crawlers a
 * meaningful signal of when each sitemap's content actually changed.
 */
export async function buildSitemapIndex(): Promise<string> {
  const entries = await Promise.all(
    LANGS.map(async (lang) => {
      const articles = await listSitemapArticles(lang).catch(() => []);
      const latest = articles
        .map((a) => a.updatedAt ?? a.publishedAt)
        .filter((d): d is Date => d != null)
        .sort((a, b) => b.getTime() - a.getTime())[0];
      const lastmod = latest ? toSitemapDate(latest) : undefined;
      return { lang, lastmod };
    })
  );

  const sitemaps = entries
    .map(({ lang, lastmod }) => {
      const inner = [
        `    <loc>${BASE_URL}/sitemap-${lang}.xml</loc>`,
        lastmod ? `    <lastmod>${lastmod}</lastmod>` : "",
      ].filter(Boolean).join("\n");
      return `  <sitemap>\n${inner}\n  </sitemap>`;
    })
    .join("\n");

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
      e.lastmod ? `    <lastmod>${e.lastmod}</lastmod>` : "",
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
