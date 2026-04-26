# 08 — Functionality Inventory

**Status:** Discovery
**Last updated:** 2026-04-25
**Phase:** 1-A (read-only)

---

## Why this report exists

After the MySQL migration, every feature on this list must continue to work exactly as it does today. Treat this as your **regression test list** for Phase 1-B and 1-C.

---

## Public site routes (under `src/app/[lang]/`)

`[lang]` ∈ `{fa, en, ar, ru}`. **English does NOT live at root** — there is currently a `next.config.ts` redirect from `/` → `/en/`. Every public route below is mounted under one of the four locales.

| Route | File | Methods | Auth | What it does |
|-------|------|---------|------|--------------|
| `/[lang]` (home) | `[lang]/page.tsx` → `HomePageClient.tsx` | GET (RSC) | — | Marketing home with hero chat, services grid, countries hub, testimonials, etc. |
| `/[lang]/about` | `[lang]/about/page.tsx` → `AboutPageClient.tsx` | GET (RSC) | — | About-the-firm page with team section |
| `/[lang]/uae` | `[lang]/uae/page.tsx` + `UAEHubClient.tsx` / `UAEPageClient.tsx` | GET (RSC) | — | UAE country hub |
| `/[lang]/uae/[service]` | `[lang]/uae/[service]/page.tsx` → `UAEServiceClient.tsx` | GET (RSC) | — | Generic UAE service template (catches `tourist-visa` slug) |
| `/[lang]/uae/golden-visa` | `[lang]/uae/golden-visa/page.tsx` (+ layout) | GET (RSC) | — | Dedicated Golden Visa page (P004 components) |
| `/[lang]/uae/company-registration` | `[lang]/uae/company-registration/page.tsx` | GET (RSC) | — | Dedicated Company Registration page (P003 components) |
| `/[lang]/uae/buy-property` | `[lang]/uae/buy-property/page.tsx` (+ layout) | GET (RSC) | — | Dedicated Buy-Property page (P005 components) |
| `/[lang]/uae/tourist-visa` | `[lang]/uae/tourist-visa/page.tsx` (+ layout) | GET (RSC) | — | Dedicated Tourist Visa page (P006 components) |

All public pages use `generateStaticParams` to pre-render the four locales and `generateMetadata` for per-locale `<title>`, OG, hreflang, and canonical tags.

**Top-level `/`** is currently *redirected* to `/en/` via `next.config.ts`. This contradicts the long-term spec ("English at root, no `/en` prefix"). Don't change this in Phase 1-B — it would break SEO mid-migration. Address it in a later phase together with the `next-intl` introduction.

---

## Admin routes (under `src/app/admin/`)

All admin pages are forced RTL with `<div dir="rtl" className="font-sans">` in `admin/layout.tsx`. UI labels are in Persian only.

| Route | File | Methods | Auth | What it does |
|-------|------|---------|------|--------------|
| `/admin/login` | `admin/login/page.tsx` | GET (page) + POST `/api/auth` | none (public login form) | Email + password login |
| `/admin` | `admin/page.tsx` | GET (page) | **NONE ENFORCED** ⚠️ | Dashboard with KPI cards |
| `/admin/sessions` | `admin/sessions/page.tsx` | GET (page) | **NONE ENFORCED** ⚠️ | List chat sessions |
| `/admin/sessions/[id]` | `admin/sessions/[id]/page.tsx` | GET (page) | **NONE ENFORCED** ⚠️ | View one session's transcript |
| `/admin/leads` | `admin/leads/page.tsx` | GET (page) | **NONE ENFORCED** ⚠️ | List leads, filter by status / nationality |
| `/admin/leads/[id]` | `admin/leads/[id]/page.tsx` | GET (page) | **NONE ENFORCED** ⚠️ | Lead detail + status update |
| `/admin/prompts` | `admin/prompts/page.tsx` | GET (page) | **NONE ENFORCED** ⚠️ | List prompts (system + knowledge) |
| `/admin/prompts/[id]` | `admin/prompts/[id]/page.tsx` | GET (page) | **NONE ENFORCED** ⚠️ | Edit prompt |
| `/admin/providers` | `admin/providers/page.tsx` | GET (page) | **NONE ENFORCED** ⚠️ | Manage AI providers (OpenAI etc.) |
| `/admin/settings` | `admin/settings/page.tsx` | GET (page) | **NONE ENFORCED** ⚠️ | Generic settings UI |

> 🚨 **Authentication finding:** there is **no middleware/proxy** in the project, and none of the admin pages or admin-only API endpoints check the auth cookie before rendering or executing. Anyone who knows or guesses an admin URL can access it directly. The login form sets a cookie but **nothing reads it for authorization**.
>
> This is a security issue *now* and remains a security issue *after* the MySQL migration. **Flagging it but NOT fixing it in Phase 1-A** (read-only). Adding a proper `proxy.ts` (Next.js 16) + signed JWT cookie is a Phase 2 task — not a Phase 1-B blocker, but the user should be aware.

---

## API Route Handlers (under `src/app/api/`)

All routes are unauthenticated (no middleware checks the auth cookie). Methods are listed exactly as declared in each `route.ts`.

### Public-facing (used by visitors)

| Path | Methods | What it does |
|------|---------|--------------|
| `/api/chat` | `POST` | Sends a user message to OpenAI, persists session+messages, returns the assistant reply. Uses `getAIResponse` in `src/lib/ai.ts`. Detects a special JSON marker in the assistant reply to trigger the lead-form modal client-side. |
| `/api/chat/lead` | `POST` | Saves/updates a Lead row attached to a chat Session. |
| `/api/chat/reset` | `POST` | Marks a Session as `CLOSED`. |

### Admin / management endpoints (NO auth currently, see warning above)

| Path | Methods | What it does |
|------|---------|--------------|
| `/api/auth` | `POST`, `GET` | Login (email+password) sets a base64 cookie; GET returns the user from the cookie. Custom auth, NOT NextAuth. |
| `/api/dashboard` | `GET` | KPI counters + recent sessions/leads for the admin dashboard. |
| `/api/sessions` | `GET` | List chat sessions with pagination. |
| `/api/sessions/[id]` | `GET`, `DELETE` | Read full session with messages; cascading delete. |
| `/api/leads` | `GET`, `PATCH` | List leads (paginated, filterable); patch status. |
| `/api/leads/[id]` | `GET`, `PATCH`, `DELETE` | Single-lead CRUD. |
| `/api/leads/export` | `GET` | CSV export of all leads. |
| `/api/prompts` | `GET`, `POST` | List + create prompts. |
| `/api/prompts/[id]` | `GET`, `PATCH`, `DELETE` | Single-prompt CRUD with version bump. |
| `/api/providers` | `GET`, `POST` | List + create AI providers (apiKey is masked in responses). |
| `/api/providers/[id]` | `PATCH`, `DELETE` | Update / delete provider; activating one deactivates all others. |
| `/api/providers/test` | `POST` | Issues a test "Hello" call to validate provider config. |
| `/api/pages` | `GET`, `POST` | List + create page-context prompts. |
| `/api/pages/[id]` | `PATCH`, `DELETE` | Single PagePrompt CRUD. |

**Total:** 16 route files.

### Conventions / observations

- **Validation:** `zod` is in `package.json` but **never imported by any route**. Inputs are validated by hand-rolled `if (!field)` checks. Inconsistent.
- **Error responses:** all return JSON `{ "error": "..." }` with HTTP 4xx/5xx. Persian and English error strings mixed. No structured error code.
- **Auth guard:** none. Every admin endpoint is callable by anyone who can reach the server.
- **Rate limiting:** none.

---

## Authentication implementation (CRITICAL DETAIL)

Documented separately because it's both load-bearing for the admin and *not what you'd expect*:

- The package `next-auth@4.24.13` is installed but **never imported anywhere**.
- Real auth is in `src/app/api/auth/route.ts`:
  - `POST /api/auth` validates email+password against the `User` table (bcrypt compare), then sets a cookie `auth-token` whose value is `Buffer.from(\`${user.id}:${user.email}:${Date.now()}\`).toString('base64')`.
  - `GET /api/auth` decodes the cookie and looks up the user by ID.
  - **The cookie is NOT signed.** Anyone who base64-encodes `1:admin@residency24.com:0` can forge an admin token. Combined with the lack of route guards, this means admin access is effectively open to anyone who knows the URL pattern.
- The login UI in `src/app/admin/login/page.tsx` posts to `/api/auth` and redirects to `/admin` on 200. The "logout" button in `AdminSidebar` just navigates to `/admin/login` — **it never clears the cookie**.

> 🚨 **Security finding:** auth is not a blocker for the MySQL migration (the data layer is unchanged), but it is a glaring hole that should be addressed in a follow-up phase. Recommend introducing Auth.js v5 or replacing the custom token with a signed JWT (using `jose`).

---

## AI chat implementation

| Concern | File |
|---------|------|
| Frontend chat widget (the modal) | `src/components/ChatModal.tsx` |
| Hero chat input on home page | `src/components/HeroChat.tsx` |
| Floating-action chat trigger | `src/components/AIAdvisorFeature.tsx` |
| API entry point | `src/app/api/chat/route.ts` |
| Lead-capture endpoint | `src/app/api/chat/lead/route.ts` |
| Session reset | `src/app/api/chat/reset/route.ts` |
| OpenAI call + system-prompt assembly | `src/lib/ai.ts` |
| Hardcoded fallback system prompt | `src/lib/knowledge.ts` |
| DB models supporting chat | `Session`, `Message`, `Lead`, `Prompt`, `PagePrompt`, `Provider` (all 6 models other than `User`) |

The chat:

1. Front-end POSTs `{ message, sessionId, language, pageSlug }` to `/api/chat`.
2. Server creates a `Session` if `sessionId` doesn't yet exist.
3. Server saves the user `Message`.
4. Server loads conversation history (last 20 messages) and assembles a system prompt that combines:
   - the language-specific `Prompt(type=SYSTEM)`
   - all language-specific `Prompt(type=KNOWLEDGE)` entries (sorted by `sortOrder`)
   - the optional `PagePrompt(language, pageSlug)` context + CTA
   - hard-coded "lead generation" instructions including a JSON marker the client looks for
5. Server calls OpenAI Chat Completions with the active `Provider`'s config.
6. Server saves the assistant `Message` and updates `Session.lastActivity`.
7. Front-end renders the response with `react-markdown`. If the response contains `{"action":"open_lead_form","service":"..."}`, it pops up the lead form modal.
8. Lead form posts to `/api/chat/lead` to create/update the `Lead`.

**This entire flow must keep working after the MySQL migration.** It uses only Prisma idioms — see `07_SQLITE_COUPLING.md` — so the risk is low.

---

## Components inventory

Categorized:

| Category | Folder | Count |
|----------|--------|-------|
| shadcn/ui primitives | `src/components/ui/` | 48 |
| shared cross-page sections | `src/components/shared/` | 8 |
| admin chrome (sidebar, header) | `src/components/admin/` | 2 |
| providers (react-query, toaster) | `src/components/providers/` | 1 |
| site-wrapper | `src/components/site/` | 1 |
| UAE-specific sections | `src/components/uae/` | 10 |
| P003 (Company Registration) | `src/components/p003/` | 10 |
| P004 (Golden Visa) | `src/components/p004/` | 13 |
| P005 (Buy Property) | `src/components/p005/` | 11 |
| P006 (Tourist Visa) | `src/components/p006/` | 2 |
| top-level public sections | `src/components/` (root) | 22 |
| **Total** | | **128 files** |

Every page-section component is a Client Component (`"use client"`). The shadcn primitives are NOT marked `"use client"`, even the interactive ones (Accordion, Dialog, etc.) — they rely on being imported into already-client trees. This works today because every consumer is a client component.

---

## Internationalization implementation

- Locales: `fa`, `en`, `ar`, `ru` (defined in `src/lib/seo.ts` LANGS).
- Translations live in **one file**: `src/translations.ts` (4565 lines). One nested object per language. No `next-intl`, no `messages/` folder, no extraction tooling.
- The active locale is held in React Context (`src/contexts/LanguageContext.tsx`), `useLanguage()` returns `{ lang, setLang, t, isRTL }`.
- Direction is set imperatively in a `useEffect`: `document.documentElement.dir = t.dir`.
- Switching language causes a **full page reload** to `/${newLang}/...` (no client-side route change).
- The route segment is `[lang]` (NOT `[locale]`) — relevant for any future `next-intl` migration.

**This is preserved as-is for the MySQL migration.**

---

## SEO implementation

- Per-route `generateMetadata` produces `<title>`, `<meta>`, OG, Twitter, canonical, and `alternates.languages` (hreflang) tags.
- JSON-LD: Organization, LocalBusiness, FAQPage, BreadcrumbList — all built in `src/lib/seo.ts` and inlined as `<script type="application/ld+json">` in the layout.
- Sitemap: **static XML files** in `public/` (`sitemap.xml` + `sitemap-{ar,en,fa,ru}.xml`). Each per-locale file currently lists only the homepage (`/{lang}/`). No tools to keep them in sync with code.
- Robots: `public/robots.txt`. Disallows `/admin/`, `/api/`, `?s=*`, `?replytocom*`. Lists all five sitemaps.

**Migration impact:** none. SEO is independent of the database.

---

## Things that MUST keep working after migration (your regression checklist)

Use this as a smoke test in Phase 1-C, in this order:

1. ✅ `npm run dev` starts without errors.
2. ✅ Navigating to `http://localhost:3000` redirects to `http://localhost:3000/en/`.
3. ✅ All four locales render the home page (`/en`, `/fa`, `/ar`, `/ru`).
4. ✅ Switching language with the floating switcher hard-navigates to the new locale.
5. ✅ RTL layout activates for `fa` and `ar`.
6. ✅ Opening the chat modal and sending a message hits `/api/chat`, gets a reply, and persists `Session` + `Message` rows in MySQL.
7. ✅ After 2–3 chat exchanges that mention cost/eligibility, the assistant returns the JSON marker and the lead form opens.
8. ✅ Submitting the lead form persists a `Lead` row in MySQL.
9. ✅ `/admin/login` accepts the seeded credentials (`admin@residency24.com` / `admin123` — to be rotated immediately) and sets the auth cookie.
10. ✅ `/admin` dashboard shows non-zero counters after step 6/8.
11. ✅ `/admin/sessions` lists the new session; clicking it shows the transcript.
12. ✅ `/admin/leads` lists the new lead; the CSV export works.
13. ✅ `/admin/prompts` shows the seeded prompts; editing one persists.
14. ✅ `/admin/providers` shows the seeded OpenAI provider; the "test" button returns success.
15. ✅ `/admin/pages` (via the API only — no UI exists for this yet) returns the seeded PagePrompts.

If any of these fails after migration, the migration is not complete.

---

**End of report.**
