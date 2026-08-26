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
