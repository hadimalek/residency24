# 01 — Repository Inventory

**Status:** Discovery
**Last updated:** 2026-04-25
**Phase:** 1-A (read-only)

---

## Git state

- **Current branch:** `phase-1a-discovery` (created from `claude/add-claude-code-prompt-8KuSZ`)
- **Working tree:** clean — no uncommitted changes when this session began
- **Remote:** `origin → http://local_proxy@127.0.0.1:25481/git/hadimalek/residency24` (this is a local proxy URL, not the public GitHub URL — the actual remote is `hadimalek/residency24` on GitHub)

### Branches

| Scope | Branch |
|-------|--------|
| Local | `claude/add-claude-code-prompt-8KuSZ` |
| Local | `main` |
| Local | `phase-1a-discovery` (this session) |
| Remote | `origin/claude/add-claude-code-prompt-8KuSZ` |
| Remote | `origin/main` |

### Last 20 commits

```
e6e8700 Merge remote, keep our hero_sub price update
87569c8 fix: update company registration hero price to AED 12,000 in all languages
3e14dc2 make HeroChat page-aware with per-page hero translations (#7)
9212c51 optimize hero translations for P001-P006 (#6)
bf96c84 fix: remove NationalityHooks from home page as requested
dd03764 Merge branch 'main' of http://127.0.0.1:33253/git/hadimalek/residency24
885cb88 remove NationalityHooks and PricingCards from home page
8f5aa52 feat(P006): UAE Tourist Visa page — full implementation
09630fd feat: standardize page layout across P001–P006
0bf7600 Add related services links to all service pages
1b1a4f7 fix: disable standalone output so npm start works correctly
3a44965 fix: restore HomePageClient to use original page-specific components
6700e4c Merge remote changes, keep our shared component API
e9d7a3d feat: add 8 shared components and integrate into P003/P004/P005
988dc39 Merge branch 'claude/unify-shared-components-4EjD2'
87b88a4 Add shared components for unified design across pages P001-P006
9c8ebc8 fix: remove dedicated service slugs from generic [service] route
8a999f6 fix: install missing react-markdown dependency
945b0f7 Merge P005 Buy Property Dubai (buy-property-dubai-page-ATx9X) into main
d4e723f Merge UAE service pages (add-uae-translations-XzGfV) into main
```

Recent activity is dominated by:
- Frontend page work (P001–P006 templates)
- Hero/translation tweaks
- Merges from feature branches

There are **no commits related to schema changes, migrations, MySQL, or database work** in the last 20 commits. The DB layer has been quiet for a while.

---

## Top-level directory tree

```
residency24/
├── .dockerignore                  Files excluded from Docker context
├── .env.example                   Example env vars (no secrets)
├── .gitignore
├── AGENTS.md                      Repo-wide note for AI agents
├── CLAUDE.md                      Imports AGENTS.md (Claude Code memory)
├── Dockerfile                     Multi-stage Node 20 alpine build
├── README.md                      Default create-next-app boilerplate (NOT customized)
├── ask-nav-guide-main (1).zip     ⚠️ 13MB binary committed to git — see findings below
├── deploy.sh                      PM2 deploy script
├── docker-compose.yml             Single-service compose file with SQLite volume
├── docs/
│   └── discovery/                 ← this directory (created in this session)
├── ecosystem.config.js            PM2 process config
├── eslint.config.mjs
├── next.config.ts                 Has /→/en/ redirect; standalone output commented out
├── package-lock.json              npm lockfile (~400KB)
├── package.json
├── postcss.config.mjs
├── prisma/
│   ├── schema.prisma              7 models, provider="sqlite"
│   └── seed.ts                    Seeds admin user + prompts + provider
├── public/
│   ├── favicon.svg
│   ├── residency24-logo-white.svg
│   ├── robots.txt                 Lists 5 sitemap URLs
│   ├── sitemap.xml                Sitemap index
│   ├── sitemap-{ar,en,fa,ru}.xml  Per-language sitemaps (each only has root URL)
│   ├── team/                      Team member portraits (8 files)
│   └── (Next.js stock SVGs)
├── src/
│   ├── app/
│   │   ├── [lang]/                Public site routes (lang ∈ {fa,en,ar,ru})
│   │   ├── admin/                 Admin panel pages (RTL-only, Persian UI)
│   │   ├── api/                   16 Route Handlers
│   │   ├── globals.css
│   │   ├── layout.tsx             Root layout (English LTR shell)
│   │   └── not-found.tsx
│   ├── components/
│   │   ├── ui/                    48 shadcn/ui primitives
│   │   ├── shared/                Cross-page shared sections (8 files)
│   │   ├── admin/                 AdminHeader + AdminSidebar
│   │   ├── providers/             QueryProvider (react-query + Toasters)
│   │   ├── site/                  SitePage wrapper
│   │   ├── uae/                   UAE-specific sections (10 files)
│   │   ├── p003/–p006/            Per-page-template component groups
│   │   └── (top-level page sections)
│   ├── contexts/
│   │   └── LanguageContext.tsx    Custom client-side i18n provider
│   ├── hooks/                     use-mobile, use-toast
│   ├── lib/
│   │   ├── ai.ts                  OpenAI chat call + system prompt builder
│   │   ├── db.ts                  PrismaClient singleton
│   │   ├── knowledge.ts           Hardcoded fallback system prompt
│   │   ├── seo.ts                 Per-language metadata & JSON-LD schemas
│   │   └── utils.ts               cn() helper
│   └── translations.ts            ~4,565 lines of inline translation data
├── tailwind.config.ts             Custom theme (navy/gold), Outfit + Vazirmatn fonts
└── tsconfig.json                  paths:{"@/*": ["./src/*"]}, target ES2017
```

---

## Folders that are absent (and that the spec mentions)

- ❌ No `prisma/migrations/` directory
- ❌ No `middleware.ts` or `proxy.ts` at the project root
- ❌ No `.github/workflows/` (no CI)
- ❌ No `tests/` or `__tests__/` directory anywhere
- ❌ No `messages/` directory for `next-intl`
- ❌ No `app/sitemap.ts` or `app/robots.ts` (sitemaps are static files in `public/`)
- ❌ No `node_modules/` in this sandbox (deps not installed here)
- ❌ No `.env` file in this sandbox

---

## Notable findings

1. **`ask-nav-guide-main (1).zip` (13 MB) is committed to git.** Likely an artifact from the original WordPress→Next.js handoff. It bloats the repo and should be removed in a cleanup commit (`git rm` + add `*.zip` to `.gitignore`). Flagging here, not removing now (read-only phase).
2. The remote URL points to a local proxy (`127.0.0.1:25481`). The actual remote is presumably `https://github.com/hadimalek/residency24` based on the system context. Confirm before pushing.
3. `node_modules` is not installed in this sandbox — the project has never been built or run here. This is consistent with the "discovery only" mode.
4. `main` and the previous claude branch both exist on the remote; the discovery branch will be a third lineage to push later.

---

**End of report.**
