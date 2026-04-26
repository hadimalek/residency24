# 20 — Current i18n State Inventory (Phase A, Layer 1)

**Status:** Discovery
**Last updated:** 2026-04-25
**Phase:** A (Layer 1)

---

## Summary

The current i18n implementation is **client-side React Context with the segment `[lang]`**. Migrating to `next-intl` with `localePrefix: "as-needed"` is architecturally invasive — the numbers below show why this is a multi-step migration, not a one-session change.

---

## Quantitative footprint

| Concern | Files / count |
|---------|---------------|
| Files importing `useLanguage` / `LanguageContext` / `LanguageProvider` | **87** |
| `process.env`-driven branches that depend on lang | none |
| Hardcoded `/fa/`, `/en/`, `/ar/`, `/ru/` URLs in `src/translations.ts` | **264** |
| Pages reading `params.lang` (App Router) | **14** files in `src/app/[lang]/` |
| Total files referencing `params.lang` (anywhere in `src/`) | **14** |
| Static sitemap files referencing `/en/`, `/fa/`, `/ar/`, `/ru/` | 4 (`public/sitemap-{en,fa,ar,ru}.xml`) |
| Other public asset references to `/{locale}/` paths | `public/sitemap.xml`, `public/robots.txt` |
| Total lines in `src/translations.ts` | 4,565 |

---

## Where the language is read from

1. **URL segment**: `src/app/[lang]/...` — `params.lang` flows into:
   - `src/app/[lang]/layout.tsx` (line 51): `const { lang: rawLang } = await params;`
   - This sets `initialLang` on `<LanguageProvider>`.
2. **React state**: `src/contexts/LanguageContext.tsx` keeps `lang` in component state initialised from `initialLang`.
3. **Effect**: a `useEffect` writes `document.documentElement.dir = t.dir` and `document.documentElement.lang = lang` imperatively.
4. **Cookie**: none.
5. **localStorage**: none.

---

## Where `dir="rtl"` is set

- `src/app/[lang]/layout.tsx` does NOT set `dir` on `<html>` — there's no `<html>` tag in this layout (it's inside the root layout at `src/app/layout.tsx` which sets `dir="ltr"` unconditionally).
- The `dir` is set imperatively by `LanguageContext`'s `useEffect` at line 21–23.
- This means **the very first paint always shows LTR** for `fa` and `ar`. Hydration switches to RTL. This is a known FOUC (flash of unstyled content) bug.
- A proper `next-intl` setup with `<html dir={isRTL(locale) ? "rtl" : "ltr"} lang={locale}>` in the locale layout fixes this.

---

## Components that rely on `LanguageContext` (sample of the 87)

The largest categories:
- **Public site sections**: `Navbar.tsx`, `Footer.tsx`, `HeroChat.tsx`, `Services.tsx`, `Testimonials.tsx`, `FAQ.tsx`, `WhatsAppFloat.tsx`, `Compare*.tsx`, all `p003/`–`p006/` components, all `uae/` components, all `shared/` components.
- **Admin chrome**: `AdminSidebar.tsx`, `AdminHeader.tsx` (these are Persian-only; they technically don't need i18n — they hardcode Persian strings).
- **Layout helpers**: `LanguageSwitcher.tsx` (the floating switcher).

The **AI chat** lives in `ChatModal.tsx`, which uses `useLanguage()` to send `language: lang` to `/api/chat`. **Breaking this would silently break the chat.**

---

## How `LanguageSwitcher.tsx` works today

```tsx
const handleSetLang = (newLang: Lang) => {
  setLang(newLang);
  if (typeof window !== 'undefined') {
    const currentPath = window.location.pathname;
    const langPattern = /^\/(fa|en|ar|ru)(\/|$)/;
    if (langPattern.test(currentPath)) {
      const newPath = currentPath.replace(langPattern, `/${newLang}$2`);
      window.location.href = newPath;
    } else {
      window.location.href = `/${newLang}/`;
    }
  }
};
```

This **assumes every URL starts with `/{locale}/`**. If we move to `localePrefix: "as-needed"`, English URLs will be `/foo` (no prefix), and this regex `^\/(fa|en|ar|ru)(\/|$)` will fail to match — landing the user on `/en/foo` instead of `/foo`. **The switcher must be rewritten** as part of the migration.

---

## How translations.ts hardcoded URLs work

Lines 51–58 (Persian section as example):

```ts
{
  id: "uae", flag: "🇦🇪", name: "امارات متحده عربی", tagline: "هاب جهانی کسب‌وکار",
  ...
  cta: "خدمات امارات", href: "/fa/uae/",
  services: [
    { name: "گلدن ویزا", href: "/fa/uae/golden-visa/", price: "از ۹,۶۴۸ درهم" },
    { name: "ثبت شرکت", href: "/fa/uae/company-registration/", price: "از ۱۱,۹۰۰ درهم" },
    { name: "خرید ملک", href: "/fa/uae/buy-property/", price: "از ۷۵۰,۰۰۰ درهم" },
    { name: "ویزای توریستی", href: "/fa/uae/tourist-visa/", price: "از ۵۰۰ درهم" },
  ],
},
```

These hardcoded `/fa/...` paths exist for **every** language section, totalling 264 occurrences. After `localePrefix: "as-needed"`:
- `/fa/uae/golden-visa/` would still work (Persian keeps the prefix).
- `/en/uae/golden-visa/` would **301 redirect to `/uae/golden-visa/`**.
- All English sitemap entries break.
- All Open-Graph URLs based on `getPageUrl(lang)` (in `src/lib/seo.ts`) break.

**Migration of these URLs is its own multi-day project.** It can be done incrementally with `next-intl`'s `<Link>` helper, but it requires touching every place that emits a URL.

---

## What `src/lib/seo.ts` does

It builds canonical URLs and JSON-LD with `${BASE_URL}/${lang}/${path}` patterns. After `localePrefix: "as-needed"`:
- English canonicals break (would say `/en/foo` while the actual URL is `/foo`).
- `alternates.languages` map must be rebuilt to use `/foo` for English and `/{locale}/foo` for others.

---

## Risk of restructuring `[lang]` → `[locale]` in one session

| Concern | Risk |
|---------|------|
| Renaming the directory | 🟡 Manageable with `git mv` |
| Updating 14 page files to read `params.locale` instead of `params.lang` | 🟡 Mechanical |
| Updating 87 components that call `useLanguage()` | 🔴 **Each must learn `useLocale()` from next-intl OR keep using LanguageContext that now reads from `params.locale`** |
| Rewriting `LanguageSwitcher.tsx` for `localePrefix: "as-needed"` | 🟡 ~30 lines |
| Updating 264 hardcoded URLs in `translations.ts` | 🔴 **This breaks SEO if done in one shot** — needs gradual migration with redirects |
| Rebuilding `src/lib/seo.ts` URL helpers | 🟡 ~50 lines |
| Rebuilding the static sitemaps | 🟢 Easy, 4 files |
| Confirming no chat regression | 🔴 **No automated tests exist; manual verification required** |
| Confirming admin still works | 🟡 Admin is locale-independent today; should be OK |

**Total surface area: ~150–200 file touches.** This exceeds the safe scope of a single session.

---

## Conclusion

i18n routing migration is **partially possible** in this session:

✅ **Safe to do:**
- Add `next-intl` to `package.json` (no install in this sandbox)
- Create `src/i18n/routing.ts` and `src/i18n/request.ts` as scaffolding
- Document the planned restructure
- Update `next.config.ts` with the `next-intl` plugin

❌ **NOT safe in one session (must be a follow-up phase):**
- Renaming `src/app/[lang]/` → `src/app/[locale]/`
- Removing the `/ → /en/` redirect
- Creating `proxy.ts` with `next-intl` middleware
- Updating `LanguageContext` to consume `next-intl`'s locale
- Rewriting `LanguageSwitcher.tsx`
- Updating the 264 hardcoded URLs

These are documented in `BLOCKED_QUESTIONS.md` at the project root.

---

**End of report.**
