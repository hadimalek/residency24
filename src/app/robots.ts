import type { MetadataRoute } from "next";
import { LANGS } from "@/lib/seo";

const BASE_URL = "https://residency24.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin/",
          "/api/",
          "/*?s=*",
          "/*?replytocom*",
        ],
      },
    ],
    // One sitemap entry per language. Modern search engines accept multiple
    // sitemap entries here and crawl each in parallel — no separate index
    // file needed for four sitemaps.
    sitemap: LANGS.map((lang) => `${BASE_URL}/sitemap/${lang}.xml`),
    host: BASE_URL,
  };
}
