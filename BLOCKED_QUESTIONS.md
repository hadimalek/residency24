# BLOCKED QUESTIONS — Phase A Foundation

**Date:** 2026-04-25
**Branch:** `phase-a-foundation`
**Reason:** Phase A's three-layer scope is bigger than what is safely deliverable in a single session given the existing codebase.

---

## What was asked

Phase A asks for three things in one branch:

1. **i18n routing** — `next-intl` with `localePrefix: "as-needed"` (English at `/`, others at `/{locale}/`)
2. **CMS schema** — 15 new Prisma models + migration
3. **Real auth** — Auth.js v5 replacing the current fake base64 cookie auth

---

## What is being delivered in this session

| Layer | Deliverable | Status |
|-------|-------------|--------|
| 1. i18n | `package.json` declares `next-intl` (no install in sandbox), `src/i18n/routing.ts` + `request.ts` scaffolding, `next.config.ts` plugin wiring | ✅ scaffold only |
| 1. i18n | App Router restructure (`[lang]` → `[locale]`) | ❌ **deferred** — see Q1 |
| 1. i18n | `proxy.ts` with combined i18n + auth middleware | ❌ **deferred** — see Q2 |
| 2. CMS | 15 new Prisma models + indexes + translation pattern | ✅ done |
| 2. CMS | Migration SQL via `prisma migrate diff` (no DB applied here) | ✅ done |
| 2. CMS | `src/lib/cms/` typed query helpers | ✅ done |
| 2. CMS | Seed extension with 3 countries / 5 visa types / 3 services | ✅ done |
| 3. Auth | `package.json` declares `next-auth@beta` (no install in sandbox) | ✅ done |
| 3. Auth | `auth.ts` + `auth.d.ts` + `[...nextauth]` handler files | ✅ done |
| 3. Auth | `.env.example` with `AUTH_SECRET`, `ADMIN_*` | ✅ done |
| 3. Auth | Login form swap to `signIn()`, logout to `signOut()`, delete fake auth route | ❌ **deferred** — see Q3 |

---

## Why three things are deferred

The work was decomposed against the existing codebase quantitatively:

- **87 components** import `useLanguage` / `LanguageContext` / `LanguageProvider` (today)
- **264 hardcoded `/fa/`, `/en/`, `/ar/`, `/ru/` URLs** in `src/translations.ts`
- **14 pages** in `src/app/` read `params.lang`
- **5 static XML/TXT files** in `public/` reference per-locale URLs
- The AI chat (`ChatModal.tsx`) calls `useLanguage()` to send the locale to `/api/chat` — silently regressing this would lose chat functionality

(Source: `docs/migration/20_I18N_CURRENT_STATE.md`.)

Doing the App Router restructure cleanly in one session would require ~150–200 file touches across:
- All 87 `useLanguage()` consumers
- The hardcoded URL strings
- The static sitemaps
- `src/lib/seo.ts` URL helpers
- `LanguageSwitcher.tsx` (its regex assumes every URL has a locale prefix)

The Phase A prompt's hard rules say:

> ❌ DO NOT modify AI chat source code
> ❌ DO NOT delete `src/translations.ts`
> ❌ DO NOT rewrite admin pages or chat components beyond what's strictly needed for auth

…and:

> If anything fails at any task, stop, document, and ask. Do not improvise architectural decisions.

The cleanest path is to deliver the safe pieces here and ask three pointed questions before doing the invasive ones.

---

## Open questions for the user

### Q1 — App Router restructure: do it now or as a separate phase?

**Choices:**

(a) **Do it now in this branch** — accept ~150–200 file touches, breaking changes to `LanguageContext` and `LanguageSwitcher`, gradual replacement of hardcoded URLs. **Risk:** very high. No tests exist to catch regressions. Manual smoke test of all 4 locales × all pages × chat × admin = ~50 manual checks.

(b) **Defer to Phase A.5** — keep `[lang]` segment intact, `LanguageContext` unchanged, the existing `/en/` redirect stays. The `next-intl` config files I'm creating in this branch sit unused until Phase A.5 actually wires them up. **Recommended.**

(c) **Hybrid** — rename `[lang]` → `[locale]` (purely cosmetic, mechanical change) and update the 14 page files + `LanguageContext` to read `params.locale`. Keep `LanguageSwitcher` and translations.ts URLs unchanged for now. Don't yet enable `localePrefix: "as-needed"`. **Middle ground but still ~30 file edits.**

➡️ **Need from user:** pick (a), (b), or (c).

### Q2 — `proxy.ts` creation

`proxy.ts` only makes sense if either:
- `next-intl` middleware is needed (depends on Q1)
- Auth.js middleware is needed for `/admin/*` protection

If we **defer Q1** but still want auth protection on `/admin/*`, then `proxy.ts` exists only for auth — not i18n. That's a simpler middleware:

```ts
import { auth } from "./auth";
import { NextResponse } from "next/server";

export default auth((request) => {
  const { pathname } = request.nextUrl;
  if (pathname.startsWith("/admin") && !request.auth) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }
  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
```

Doable. But it requires Auth.js v5 to be **fully wired** (Q3), which has its own risks.

➡️ **Need from user:** OK to add an auth-only `proxy.ts` once Auth.js is wired (i.e. after Q3 is yes)?

### Q3 — Auth.js v5 swap: do it now or as Phase 1-D?

The current `src/app/api/auth/route.ts` is the *only* thing that authenticates the admin login form. If I:
1. Add Auth.js v5 config files (auth.ts, [...nextauth] handler)
2. Update the login page to call `signIn("credentials", ...)`
3. Delete the old auth route

…then the admin login flow either fully works on Auth.js, or it doesn't work at all. There is no graceful degradation. The existing seeded admin (`admin@residency24.com` / `admin123`) needs to be re-validated against bcrypt through the Credentials provider.

**This is doable**, but needs the user to:
- Set `AUTH_SECRET` in `.env`
- Run `npm install` to actually pull `next-auth@beta`
- Test the login round-trip

If any of those is fragile right now (no `.env` set, sandbox has no working Docker for MySQL, etc.), the user is left with a broken admin until they finish setup.

**Choices:**

(a) **Full swap now** — everything wired, the old route deleted. User must set `AUTH_SECRET` and `npm install` before login works.

(b) **Scaffold only** — add `auth.ts`, `[...nextauth]` handler, and `auth.d.ts` files but leave the login form pointing at the old route, leave the old route in place. User explicitly switches over in a follow-up. **Recommended.**

➡️ **Need from user:** pick (a) or (b).

---

## My recommendation

| Question | Recommended answer | Why |
|----------|--------------------|-----|
| Q1 | **(b) defer App Router restructure** | 150+ file touches with no tests is not a single-session scope. |
| Q2 | **add auth-only `proxy.ts` only after Q3 is "yes (full)"** | Otherwise it has nothing to do. |
| Q3 | **(b) scaffold only** | Lets the user pick the moment to flip over and to set env vars first. |

This gives a Phase A branch that:

- ✅ Adds the entire CMS data layer (15 new models + migration + queries + seed)
- ✅ Adds the i18n config files (so Phase A.5 just flips the switch)
- ✅ Adds the Auth.js v5 config files (so Phase 1-D-finish just flips the switch)
- ❌ Does NOT touch the existing 87 components, 264 hardcoded URLs, or the live admin login

Resulting branch is **mergeable safely** without breaking anything. The "real" i18n switchover and "real" auth switchover become two more focused branches with clearer testing scopes.

---

## How to respond

Send back one of:

```
A1: a    (or b, or c)
A2: yes  (or no)
A3: a    (or b)
```

I'll pick up from there.

If you want my recommendation: just say **"go with your recommendation"** and I'll proceed with b/no/b.

---

**End of blocked questions.**
