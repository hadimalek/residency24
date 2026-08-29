import type { Lang } from "@/translations";

export const LANGS: Lang[] = ["fa", "en", "ar", "ru"];

/**
 * Client-safe locale path builder.
 *
 * Lives in its own module (rather than in `@/lib/seo`) because Client
 * Components need it: importing `@/lib/seo` would drag BLOG_SEO and every
 * JSON-LD builder into the browser bundle. `@/lib/seo` re-exports from here so
 * there is exactly one implementation.
 *
 * English is served at the root with no `/en` prefix — `/en/...` 301s to `/...`
 * (see src/proxy.ts), so emitting an `/en/` link costs a redirect hop. The site
 * also canonicalises to NO trailing slash (`/path/` 308s to `/path`), so both
 * ends are stripped here.
 */
export function localizedPath(lang: Lang, path: string = ""): string {
  const normalized = path.replace(/^\/+/, "").replace(/\/+$/, "");
  if (lang === "en") return normalized ? `/${normalized}` : "/";
  return normalized ? `/${lang}/${normalized}` : `/${lang}`;
}

/** Strips a leading locale segment: "/fa/uae/golden-visa" → "uae/golden-visa". */
export function stripLocale(pathname: string): string {
  return pathname
    .replace(/^\/(fa|en|ar|ru)(?=\/|$)/, "")
    .replace(/^\/+/, "")
    .replace(/\/+$/, "");
}

/**
 * First crumb of every breadcrumb trail, in the page's own language.
 *
 * It has to be a translated word rather than the brand name: the visible trail
 * and the BreadcrumbList JSON-LD must agree, and the JSON-LD has always used
 * these. A Persian page showing a Latin "Residency24" above Persian crumbs was
 * both a mismatch Google can flag and simply wrong for the reader.
 */
export const BREADCRUMB_HOME: Record<Lang, string> = {
  fa: "خانه",
  en: "Home",
  ar: "الرئيسية",
  ru: "Главная",
};

/**
 * Country crumb for the UAE hub. The Oman and Turkey hubs already carry theirs
 * in translations.ts; the UAE hub was the one still hardcoding Latin "UAE" for
 * every language.
 */
export const BREADCRUMB_UAE: Record<Lang, string> = {
  fa: "امارات",
  en: "UAE",
  ar: "الإمارات",
  ru: "ОАЭ",
};
