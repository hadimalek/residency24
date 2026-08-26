import type { MetadataRoute } from "next";

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
    // /sitemap.xml is the sitemap-INDEX file pointing to each per-language
    // sitemap. Modern search engines follow the index and fetch all of them.
    // Listing each per-language sitemap individually is also valid; we
    // include both for maximum crawler compatibility.
    sitemap: [
      `${BASE_URL}/sitemap.xml`,
      `${BASE_URL}/sitemap-en.xml`,
      `${BASE_URL}/sitemap-fa.xml`,
      `${BASE_URL}/sitemap-ar.xml`,
      `${BASE_URL}/sitemap-ru.xml`,
    ],
    // No `host:`. It emits the non-standard `Host:` directive, which Search
    // Console reports as "Rule ignored by Googlebot" — it was only ever a Yandex
    // extension, and Yandex itself dropped it in 2018 in favour of redirects and
    // rel=canonical. The canonical host is declared by those instead.
  };
}
