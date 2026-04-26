# Phase A Deployment Runbook

**Branch:** `phase-a-foundation`
**Last updated:** 2026-04-25
**Audience:** the user, deploying this branch to their MySQL server

---

## What this branch contains

| Layer | What's added | Status |
|-------|-------------|--------|
| **i18n** | `next-intl@^4.9.1` declared in `package.json`; `src/i18n/{routing,request}.ts`; `next.config.ts` wraps with the `next-intl` plugin | ✅ scaffolded |
| **i18n** | `[lang]` → `[locale]` restructure, `proxy.ts`, `localePrefix: "as-needed"` | ❌ deferred to Phase A.5 — see `BLOCKED_QUESTIONS.md` Q1 |
| **CMS schema** | 15 new Prisma models + indexes + (parent, locale) translation tables; 1 new migration SQL | ✅ done |
| **CMS lib** | `src/lib/cms/` — 11 typed query helpers, `src/lib/prisma.ts` re-export | ✅ done |
| **CMS seed** | 4 Languages, 3 Countries, 5 VisaTypes, 3 Services, 5 FAQs + their translations | ✅ done |
| **Auth.js v5** | `next-auth@5.0.0-beta.31` declared; `auth.ts` + `auth.d.ts` at root; `[...nextauth]` handler | ✅ scaffolded |
| **Auth.js v5** | Switching the login form / logout button / deleting old auth route | ❌ deferred — see `BLOCKED_QUESTIONS.md` Q3 |
| **Lead model extension** | `+source`, `+sourcePage`, `+assignedToId`, `status` widened to VarChar(32), new index on `source` | ✅ done |
| **Existing 7 models** | Preserved verbatim; only the cosmetic `User.role` length and `Provider.apiKey` length bumped per Phase A spec | ✅ |

---

## Production deployment steps

### 0. Pull and review the branch

```bash
git fetch
git checkout phase-a-foundation
```

Read `BLOCKED_QUESTIONS.md` first. Make the three decisions (Q1, Q2, Q3) before deploying. If you choose to defer the deferred items, the branch is safely deployable as-is — the scaffolding sits inert until you flip the switches in Phase A.5 / 1-D-finish.

### 1. Install dependencies

```bash
npm install
```

If you see peer-dep warnings about React 19 + `next-auth@5.0.0-beta.*`, that's expected — Auth.js v5 beta declares broad peer ranges. They're warnings, not errors.

If the install errors out (not warns), retry with:

```bash
npm install --legacy-peer-deps
```

This is the same command we'd use for `next-auth@4` against React 19 on the previous branch.

### 2. Set environment variables

Open `.env` (or create from `.env.example`) and set:

```ini
# DB — already MySQL from Phase 1-B
DATABASE_URL="mysql://r24user:STRONG_PASS@your-mysql-host:3306/residency24?connection_limit=10"

# Auth.js v5 — required for the Auth.js scaffolding to load (even if not yet active)
AUTH_SECRET="<generate via: npx auth secret>"
AUTH_URL="https://residency24.com"
AUTH_TRUST_HOST="true"

# Admin seed — used by `prisma db seed` to create the first admin user
ADMIN_EMAIL="admin@residency24.com"
ADMIN_PASSWORD="<strong, 16+ chars>"
ADMIN_NAME="System Admin"

# AI provider seed (optional — only the seed reads this; runtime reads from DB)
OPENAI_API_KEY="sk-..."
```

The legacy `NEXTAUTH_SECRET` and `NEXTAUTH_URL` from Phase 1-B can stay until the old `/api/auth/route.ts` is deleted (deferred — see Q3).

### 3. Apply the new migration

There are now **two migrations** in `prisma/migrations/`:

```
prisma/migrations/
├── migration_lock.toml                              ← provider = mysql
├── 20260425201310_init_mysql/                       ← Phase 1-B baseline (7 tables)
│   └── migration.sql
└── 20260426145724_add_cms_data_model/               ← Phase A: 15 new tables + Lead extension
    └── migration.sql
```

To apply on production:

```bash
npx prisma migrate deploy
```

This is **idempotent** — Prisma compares applied migrations against the `_prisma_migrations` bookkeeping table and only runs new ones. If you already ran the Phase 1-B migration on this DB, only the Phase A one runs now.

If `_prisma_migrations` doesn't exist yet (first time on this DB), both migrations run in order.

### 4. Generate the Prisma client

```bash
npx prisma generate
```

(Usually `npm install` already triggered this via the `postinstall` hook, but explicit doesn't hurt.)

### 5. Seed the database

```bash
npx prisma db seed
```

Expected output (rough):

```
Seeded 4 system prompts
Seeded 20 knowledge sections
Seeded 10 page prompts
Seeded default AI provider (update API key in admin panel)
Seeded 3 countries with translations.
Seeded 5 visa types with translations.
Seeded 3 services with translations.
Seeded 5 FAQs with translations.
Chat prompts already seeded. Skipping prompt block.   ← if you re-run, this is normal
```

The seed is **idempotent**: re-running won't duplicate rows. The Languages table uses `upsert`; CMS content is gated by `await prisma.country.count() > 0`.

### 6. Build and restart

```bash
npm run build
pm2 restart residency24    # or whatever deploy mechanism you use
```

### 7. Verify on production

| URL | Expected | Why |
|-----|----------|-----|
| `https://residency24.com/` | 307 → `/en/` | Existing redirect (kept for now — see Q1) |
| `https://residency24.com/en/` | 200 | Existing English page renders |
| `https://residency24.com/fa/` | 200 | Persian page renders RTL |
| `https://residency24.com/admin/login` | 200 | Login page renders |
| Admin login with `ADMIN_EMAIL`/`ADMIN_PASSWORD` | redirects to `/admin` | Old `/api/auth` route still active |
| AI chat round-trip on home page | reply within 5s | Chat module is untouched |

If anything 500s, check `pm2 logs residency24 --lines 100`. The most likely culprit is a missed env var (`DATABASE_URL`, `AUTH_SECRET`).

---

## What you can now query (CMS data layer is live)

Even though no public page templates have been built yet, you can verify the CMS data is reachable from your code or from `prisma studio`:

```bash
npx prisma studio
# Opens http://localhost:5555 — browse Country, VisaType, Service, etc.
```

Or programmatically (e.g. in an admin route or a temp script):

```ts
import { listFeaturedCountries } from "@/lib/cms";

const countries = await listFeaturedCountries("en");
console.log(countries.map((c) => c.translations[0].name));
// → [ "United Arab Emirates", "Oman", "Turkey" ]
```

---

## Rollback procedure

If anything goes wrong after deploying this branch:

```bash
# 1. Roll PM2 back to the prior commit
git checkout phase-1b-mysql-migration
npm install
npm run build
pm2 restart residency24

# 2. Optionally undo the CMS migration (DESTROYS the new CMS tables — only do this if you absolutely must)
npx prisma migrate resolve --rolled-back 20260426145724_add_cms_data_model
mysql -u r24user -p residency24 -e "
  DROP TABLE IF EXISTS MenuItemTranslation, MenuItem, Menu,
                       MediaTranslation, Media,
                       SeoMeta, Redirect,
                       RequirementTranslation, Requirement,
                       CostItemTranslation, CostItem,
                       CostTableTranslation, CostTable,
                       FaqTranslation, Faq,
                       ArticleTranslation, Article,
                       PageBlockTranslation, PageBlock,
                       PageTranslation, Page,
                       CountryService, CountryVisaType,
                       ServiceTranslation, Service,
                       VisaTypeTranslation, VisaType,
                       CountryTranslation, Country,
                       Language;
"
mysql -u r24user -p residency24 -e "
  ALTER TABLE Lead DROP COLUMN assignedToId, DROP COLUMN sourcePage, DROP COLUMN source;
  ALTER TABLE Lead MODIFY status VARCHAR(20) NOT NULL DEFAULT 'NEW';
  ALTER TABLE User MODIFY role VARCHAR(20) NOT NULL DEFAULT 'ADMIN';
  ALTER TABLE Provider MODIFY apiKey VARCHAR(255) NOT NULL;
"
```

The CMS tables hold no chat or admin data, so dropping them does **not** affect existing functionality. The Lead column reverts also leave existing Lead rows intact (the new columns are nullable).

---

## Open follow-up items

1. **Phase A.5 — App Router restructure.** `[lang]` → `[locale]`, remove `/ → /en/` redirect, create `proxy.ts` with `next-intl` middleware, rewire `LanguageContext`, `LanguageSwitcher`, and the 264 hardcoded URLs in `src/translations.ts`. ~150-200 file touches; needs its own focused branch.

2. **Phase 1-D-finish — Auth.js v5 swap.** Update login form to call `signIn("credentials", ...)`, update logout to `signOut()`, delete `src/app/api/auth/route.ts`, add auth-only `proxy.ts` if Phase A.5 isn't done first.

3. **Production secret rotation.** The seeded `admin123` password is still active until you set `ADMIN_PASSWORD` in `.env` and re-run the seed (or update the user manually in `prisma studio`).

4. **WordPress leads import.** Out of scope here — separate phase.

---

**End of runbook.**
