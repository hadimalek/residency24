# 07 — SQLite Coupling: Code That Assumes SQLite

**Status:** Discovery
**Last updated:** 2026-04-25
**Phase:** 1-A (read-only)

---

## What I searched for

```bash
grep -rn "sqlite" --include="*.ts" --include="*.tsx" --include="*.js" \
                  --include="*.json" --include="*.prisma" .
grep -rn "queryRaw\|executeRaw\|\$queryRaw\|\$executeRaw" \
        --include="*.ts" --include="*.tsx" .
grep -rn "JSON.parse\|JSON.stringify" --include="*.ts" --include="*.tsx" src/
grep -rn "file:" --include="*.ts" --include="*.tsx" --include="*.js" \
                 --include="*.yml" --include="*.yaml" .
```

(Each grep excluded `node_modules` and `.next`.)

---

## Findings

### 1. Direct `sqlite` references

**Exactly one match:**

| File | Line | Match |
|------|------|-------|
| `prisma/schema.prisma` | 6 | `provider = "sqlite"` |

➡️ This is the only line that needs to change. **Code does not contain any SQLite-specific imports, drivers, or library calls.**

### 2. Raw SQL queries (`$queryRaw` / `$executeRaw`)

**Zero matches** in `src/` and `prisma/`. All database access goes through Prisma's typed query builder. This is a *huge* win for the migration: there is no SQLite-flavored SQL to translate to MySQL.

### 3. JSON column patterns (`JSON.parse` of DB fields)

22 hits for `JSON.parse` / `JSON.stringify`, but **none of them touch DB columns**. Categorization:

| Pattern | Count | Where |
|---------|-------|-------|
| `JSON.stringify(schema)` for JSON-LD `<script type="application/ld+json">` | 7 | `[lang]/layout.tsx`, several page layouts, `CompanyRegistrationClient.tsx`, `BuyPropertyClient.tsx`, `FAQ.tsx` |
| `body: JSON.stringify(...)` for `fetch()` requests | 13 | All admin pages (`prompts`, `providers`, `leads`, `settings`, `login`) and `ChatModal.tsx` |
| Schema generation in `FAQ.tsx` and similar | 2 | Just structured data |

**Zero columns are stored as JSON-encoded strings.** No `Json` type in the Prisma schema, no `JSON.parse(prisma.something.field)` patterns. This means MySQL's lack-of-or-presence-of native `JSON` type is irrelevant to us.

### 4. Hardcoded DB paths

| File | Line | Value |
|------|------|-------|
| `.env.example` | 1 | `DATABASE_URL="file:./dev.db"` |
| `docker-compose.yml` | 9 | `DATABASE_URL=file:/app/data/prod.db` |

Both will be replaced with a `mysql://...` URL in Phase 1-B. Other matches for `file:` (e.g. `cost_family_file:` in `translations.ts`, `file:border-0` in `input.tsx`) are unrelated.

---

## Files that touch the database

For completeness — every file that imports `@/lib/db` (the Prisma client singleton):

| File | Purpose |
|------|---------|
| `src/lib/ai.ts` | reads Prompts, PagePrompts, Providers; powers chat |
| `src/app/api/auth/route.ts` | reads/writes User |
| `src/app/api/chat/route.ts` | reads/writes Session, Message |
| `src/app/api/chat/lead/route.ts` | writes Lead |
| `src/app/api/chat/reset/route.ts` | updates Session.status |
| `src/app/api/dashboard/route.ts` | aggregates Sessions, Leads, Messages |
| `src/app/api/sessions/route.ts` | reads Sessions |
| `src/app/api/sessions/[id]/route.ts` | reads/deletes Session + Messages |
| `src/app/api/leads/route.ts` | reads/updates Leads |
| `src/app/api/leads/[id]/route.ts` | CRUD on Lead |
| `src/app/api/leads/export/route.ts` | reads all Leads → CSV |
| `src/app/api/prompts/route.ts` | reads/creates Prompts |
| `src/app/api/prompts/[id]/route.ts` | CRUD on Prompt |
| `src/app/api/providers/route.ts` | reads/creates Providers |
| `src/app/api/providers/[id]/route.ts` | updates/deletes Provider |
| `src/app/api/providers/test/route.ts` | reads Provider, test-calls AI |
| `src/app/api/pages/route.ts` | reads/creates PagePrompts |
| `src/app/api/pages/[id]/route.ts` | updates/deletes PagePrompt |

**18 files touch the database.** All use Prisma idiomatic queries (`findUnique`, `findMany`, `create`, `update`, `delete`, `count`, `aggregate`). **None should require code changes for the MySQL migration.**

---

## Prisma query features in use (and their MySQL compatibility)

| Feature | Used in this codebase | MySQL behavior | Risk |
|---------|----------------------|----------------|------|
| `findUnique({ where: { id } })` | Everywhere | identical | 🟢 |
| `findFirst({ where: ... })` | `ai.ts`, several routes | identical | 🟢 |
| `findMany({ where, orderBy, take, skip, include })` | Pagination in admin lists | identical | 🟢 |
| `create({ data })` | Everywhere | identical | 🟢 |
| `update({ where, data })` | Everywhere | identical | 🟢 |
| `delete({ where })` | Several routes | identical | 🟢 |
| `count({ where })` | Pagination + dashboard | identical | 🟢 |
| `Promise.all([...prisma calls])` | Dashboard, paginated lists | identical | 🟢 |
| `prisma.$transaction()` | **NOT USED** anywhere | — | n/a |
| `upsert({ where, update, create })` | Used once in `seed.ts` | identical | 🟢 |
| `include`/`select` projections | Several | identical | 🟢 |
| Composite unique key (`language_pageSlug`) | `ai.ts` line 46 | identical (Prisma generates the same `WHERE language=? AND pageSlug=?`) | 🟢 |
| `_count` aggregate | `dashboard`, `sessions` | identical | 🟢 |
| Raw SQL `$queryRaw` / `$executeRaw` | **NONE** | — | 🟢 |

---

## Subtle MySQL-vs-SQLite behavioral differences worth knowing

These are NOT bugs in the current code, just things to be aware of after the migration:

1. **String comparisons are case-sensitive on MySQL by default; SQLite was case-sensitive too unless `COLLATE NOCASE` was used.** Default Prisma + MySQL uses `utf8mb4_unicode_ci` which is **case-insensitive**. That means `findFirst({ where: { email: "USER@example.com" } })` will now match a row with `user@example.com`. **For the `User.email` field this is actually a bug fix** (login was case-sensitive before; users typing different cases would get rejected). Worth telling the user explicitly.

2. **String length defaults differ.** SQLite stores strings as variable-length blobs with no enforced limit. MySQL `VARCHAR` requires a length (`VARCHAR(N)`) and data exceeding it errors out. The `@db.VarChar(N)` annotations in `03_PRISMA_CURRENT_STATE.md` address this.

3. **Boolean storage differs.** SQLite stores booleans as 0/1 integers. MySQL has a real `TINYINT(1)` mapped to bool by Prisma. The current `Boolean isActive` fields work identically — but if anyone has been treating `isActive` as a number anywhere (`if (provider.isActive === 1)`), that breaks. **Quick grep:** I found no such patterns.

4. **Integer auto-increment is identical** (`AUTOINCREMENT` in SQLite, `AUTO_INCREMENT` in MySQL — Prisma generates the right DDL).

5. **`DateTime` defaults work identically** when using `@default(now())`. (See `03_PRISMA_CURRENT_STATE.md` for the timezone caveat.)

---

## Risk score for the migration (code-coupling lens)

> 🟢 **LOW.**
>
> No raw SQL, no JSON columns, no SQLite-only Prisma features, no driver imports outside the Prisma layer. The migration touches exactly **one line of code** (`provider = "sqlite"` → `provider = "mysql"`) plus per-field `@db.*` annotations. Everything else is operational (Docker-or-not, MySQL provisioning, env-var update).
>
> The biggest risks are NOT in the code — they are in:
> 1. The deployment pipeline (see `06_DEPLOYMENT_REALITY.md`).
> 2. Pre-existing data in unknown SQLite files (see `04_SQLITE_DATA_AUDIT.md`).

---

**End of report.**
