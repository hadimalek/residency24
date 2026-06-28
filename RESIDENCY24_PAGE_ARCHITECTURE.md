# Residency24 — Page Architecture

> Note: the original golden-reference architecture document was not present in the
> repository. This is a minimal reconstruction capturing the conventions actually used
> in the codebase, plus the new T2 expansion. Treat as a living doc.

## Core conventions
- **Routing:** `src/app/[lang]/...` with `Lang = fa | en | ar | ru`. English at root,
  other locales prefixed. SEO helpers in `src/lib/seo.ts` (`LANGS`, `LANG_CONFIG`, `getPageUrl`).
- **Page shape:** server `page.tsx` (`generateStaticParams`) + `layout.tsx` (metadata + JSON-LD)
  + `*PageClient.tsx` (`"use client"`, reads `useLanguage()`).
- **Translations:** single `src/translations.ts`, one namespace per page (e.g. `p004`, `page_p037`).
- **Locked components (no internal edits):** `HeroChat`, `TrustBar`, `ContactBar`, `WhatsAppFloat`,
  `Navbar`, `Footer`. **Shared components** customized via props only.
- **Style rules:** Tailwind only (no inline CSS); Lucide icons only (no emoji in JSX);
  engagement via `HeroChat`/`ChatModal` + WhatsApp (no forms/email/booking on marketing pages).

## Section 9 — T2 Expansion
T2 service pages mirror the T1 template (P004 Golden Visa) but may diverge where a page
requires media the locked hero does not support.

- **P037 UAE Green Visa** (first T2 page): mandatory hero image. Because `HeroChat` is locked and
  has no image support (and its `pageKey` union excludes new pages), T2 pages may use a **custom
  Split/Background-Overlay hero** that embeds the live `ChatModal` instead of `HeroChat`.
- T2 image policy: images may be Unsplash hotlinks (rendered via `MediaImage`, which falls back to
  a branded box on load failure) until project-owned assets are committed to `public/images/`.
- T2 translation policy: author FA first; EN/AR/RU added as `[TRANSLATE: …]` placeholders with
  identical key structure, pending human translation.
