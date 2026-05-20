import type { MetadataRoute } from "next";

type ChangeFrequency = NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]>;

export interface SitemapRoute {
  /**
   * Path WITHOUT the language prefix and WITHOUT leading/trailing slash.
   * Empty string = locale homepage.
   * Example: "uae/golden-visa"
   */
  path: string;
  priority?: number;
  changeFrequency?: ChangeFrequency;
  /** Set true to exclude this route from the sitemap (e.g. legacy alias / soft 404). */
  noindex?: boolean;
}

/**
 * Single source of truth for the sitemap's static page list.
 *
 * When a developer adds a new public page under `src/app/[lang]/...`, they
 * should also add it here. Treat this file like a route manifest — it is what
 * gets shipped to Google.
 *
 * If a route should NOT be indexed, either omit it OR set `noindex: true`
 * (omitting is cleaner; the flag is only useful as a temporary mute).
 */
export const STATIC_ROUTES: SitemapRoute[] = [
  // Homepage
  { path: "", priority: 1.0, changeFrequency: "weekly" },

  // Company
  { path: "about", priority: 0.6, changeFrequency: "yearly" },

  // Blog index
  { path: "blog", priority: 0.9, changeFrequency: "daily" },

  // UAE
  { path: "uae", priority: 0.9, changeFrequency: "weekly" },
  { path: "uae/golden-visa", priority: 0.9, changeFrequency: "monthly" },
  { path: "uae/company-registration", priority: 0.8, changeFrequency: "monthly" },
  { path: "uae/buy-property", priority: 0.8, changeFrequency: "monthly" },
  { path: "uae/tourist-visa", priority: 0.7, changeFrequency: "monthly" },
  // Legacy aliases — kept for backlinks but lower priority
  { path: "uae/register-company", priority: 0.4, changeFrequency: "yearly" },
  { path: "uae/property-purchase", priority: 0.4, changeFrequency: "yearly" },

  // Oman
  { path: "oman", priority: 0.9, changeFrequency: "weekly" },
  { path: "oman/company-registration", priority: 0.8, changeFrequency: "monthly" },
  { path: "oman/residency-visa", priority: 0.8, changeFrequency: "monthly" },
  { path: "oman/buy-property", priority: 0.8, changeFrequency: "monthly" },
  { path: "oman/tourist-visa", priority: 0.7, changeFrequency: "monthly" },

  // Turkey
  { path: "turkey", priority: 0.9, changeFrequency: "weekly" },
  { path: "turkey/citizenship", priority: 0.9, changeFrequency: "monthly" },
  { path: "turkey/company-registration", priority: 0.8, changeFrequency: "monthly" },
  { path: "turkey/buy-property", priority: 0.8, changeFrequency: "monthly" },
  { path: "turkey/tourist-visa", priority: 0.7, changeFrequency: "monthly" },
];

export function getIndexableStaticRoutes(): SitemapRoute[] {
  return STATIC_ROUTES.filter((r) => !r.noindex);
}
