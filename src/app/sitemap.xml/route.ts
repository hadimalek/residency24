import { buildSitemapIndex } from "@/lib/seo/sitemap-xml";

// Sitemap-index file at /sitemap.xml — the canonical entry point. Points to
// each per-language sitemap. Manual route handler (instead of Next's metadata
// file convention) so we own the URL completely and can also serve the
// per-language sitemaps at /sitemap-{lang}.xml.
export const revalidate = 3600;

export function GET() {
  return new Response(buildSitemapIndex(), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
