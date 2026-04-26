# 10 — Migration Risk Assessment

**Status:** Discovery
**Last updated:** 2026-04-25
**Phase:** 1-A (read-only)

---

## How to read this report

Each risk is scored 🟢 LOW / 🟡 MEDIUM / 🔴 HIGH and paired with **one specific mitigation** to apply during Phase 1-B or 1-C.

The aggregate verdict is at the bottom.

---

## 1. Data preservation risk 🟡 **MEDIUM**

> *Source: `04_SQLITE_DATA_AUDIT.md`*

**Findings:**
- No `.db` file exists in this sandbox.
- `prisma/dev.db` is gitignored — could exist on the user's Windows laptop and/or production server.
- `node_modules` is absent in this sandbox; the project has never been built here.
- We cannot rule out that real chat sessions, leads, or admin records exist somewhere.

**Why MEDIUM, not LOW:**
- The user has admitted they don't know if data exists. "Don't know" is more dangerous than "know nothing exists".
- If production has been live for any period, leads especially are *business-critical* records (each lead = a potential client). Losing them would be unacceptable.

**Mitigation:**
> **Before Phase 1-B starts**, run the discovery commands in `04_SQLITE_DATA_AUDIT.md` on the user's Windows machine and (if applicable) the production server. Back up any `.db` files found. Block Phase 1-B until the verdict is unambiguous in *every* environment.

---

## 2. Schema migration risk 🟢 **LOW**

> *Source: `03_PRISMA_CURRENT_STATE.md`*

**Findings:**
- 7 simple models, no `Json` columns, no enums, only one cascading FK.
- Long-text fields (`Message.content`, `Prompt.content`, `PagePrompt.contextPrompt`) need `@db.Text` annotations to avoid MySQL VARCHAR limits.
- A handful of indexed unique fields (`User.email`, `Session.sessionKey`, `PagePrompt @@unique([language, pageSlug])`) need explicit `@db.VarChar(N)` to keep them under MySQL's 3072-byte key length.
- No `prisma/migrations/` history exists — we'll bootstrap with `prisma migrate dev --name init` after switching the provider.

**Mitigation:**
> Apply the previewed `@db.*` annotations from `03_PRISMA_CURRENT_STATE.md` in Phase 1-B. Then run `prisma migrate dev --name init` against an empty MySQL database to verify the generated SQL compiles cleanly before pointing it at any environment with real data.

---

## 3. Code breakage risk 🟢 **LOW**

> *Source: `07_SQLITE_COUPLING.md`*

**Findings:**
- Zero raw SQL queries (no `$queryRaw` / `$executeRaw`).
- Zero JSON-encoded columns.
- One literal `sqlite` reference (the schema's `provider` line).
- All 18 DB-touching files use Prisma's typed query builder.
- Boolean handling is consistent (no `=== 1` patterns).
- Email comparisons may now be case-insensitive on MySQL — a behavioral *improvement* but worth noting.

**Mitigation:**
> No code changes required for the migration itself. After Phase 1-B is live, monitor for one week for any case-sensitivity-related issues with `User.email` (low likelihood — bcrypt comparison is what matters, and case-insensitive matching of email addresses is the desired behavior).

---

## 4. Deployment continuity risk 🔴 **HIGH**

> *Source: `06_DEPLOYMENT_REALITY.md`*

**Findings (this is the most important risk in the audit):**
- `next.config.ts` has `output: "standalone"` **commented out** (commit `1b1a4f7`).
- `deploy.sh` and `ecosystem.config.js` still depend on `.next/standalone/server.js` existing.
- Every `cp` step in `deploy.sh` is wrapped in `2>/dev/null || true`, which **silently swallows the failures** when standalone output isn't generated.
- `pm2 restart residency24` will then succeed even though the underlying file hasn't been updated. The site keeps running the old code.
- Nobody seems to have noticed because the diff between code revisions is small and the visible behavior of an unrestarted-but-restarted-looking PM2 process is the same as a successful restart.

**Why this matters for the migration:**
- If you push `provider = "mysql"` and run `bash deploy.sh` on the server, **the live PM2 process will not actually pick up the new code.** It will keep talking to whatever DB the running standalone bundle was built with — possibly the SQLite file. You will believe the migration succeeded; in fact only the new code on disk has changed.
- This will make the migration look like it works, then mysteriously *appear* to fail later when something restarts the server (`reboot`, `pm2 reset`, OOM kill) and the now-correct standalone bundle either doesn't exist or has been rebuilt against MySQL with no live data.

**Mitigation:**
> **Resolve the standalone-output mismatch BEFORE attempting the MySQL migration on production.** Two options, pick one in Phase 1-B's first commit:
>
> **Option A (preferred for this codebase):** uncomment `output: "standalone"` in `next.config.ts` and accept that `npm start` will not work locally (use `npm run dev` instead, or run `node .next/standalone/server.js` after build).
>
> **Option B:** rewrite `deploy.sh` and `ecosystem.config.js` to use `next start` (i.e. the regular non-standalone runtime), via `pm2 start npm --name residency24 -- start`. Drop the `cp .next/standalone/...` lines.
>
> Verify on a staging environment (or a non-production VM) that `bash deploy.sh` actually replaces the running code before doing anything to production. The verification is: change a string somewhere visible, deploy, refresh the page, see the new string.

---

## 5. AI chat breakage risk 🟡 **MEDIUM**

> *Source: `08_FUNCTIONALITY_INVENTORY.md`*

**Findings:**
- The chat depends on six tables: `Session`, `Message`, `Lead`, `Prompt`, `PagePrompt`, `Provider`.
- All chat queries use idiomatic Prisma; none should break.
- However, *seeded data* must be present in MySQL before the chat works. If you create an empty MySQL database and forget to run `prisma db seed`, the chat will:
  - throw "No active AI provider configured" on the first request.
  - return the hard-coded fallback `SYSTEM_PROMPT` from `src/lib/knowledge.ts` (with no Knowledge sections, no Page context, no provider).
- Visitors may also have in-flight `sessionId`s in their browser localStorage; those `sessionKey` values will not exist in the new MySQL DB and the server will create new sessions — which is fine, just a one-time invisible "your conversation reset" event.

**Mitigation:**
> Phase 1-C deployment runbook must include `npx prisma db seed` immediately after the first `prisma migrate deploy`. Verify the chat works in all four locales as part of the smoke test (regression checklist item #6 in `08_FUNCTIONALITY_INVENTORY.md`).

---

## 6. Admin panel breakage risk 🟡 **MEDIUM**

> *Source: `08_FUNCTIONALITY_INVENTORY.md`*

**Findings:**
- Admin login depends on the `User` row seeded with `admin@residency24.com / admin123`.
- The "logout" button doesn't clear the cookie, but pre-existing cookies will fail validation against the new MySQL `User` table only if user IDs differ from the previous SQLite IDs (likely — `AUTOINCREMENT` resets at 1).
- Existing admin users with cookies in their browsers will see a "User not found" 401 from `GET /api/auth` after migration. Effect: they must log in again. **This is minor and expected** — but tell admins in advance.

**Mitigation:**
> After seeding MySQL, manually log in to the admin panel and verify all six admin pages render (`/admin`, `/admin/sessions`, `/admin/leads`, `/admin/prompts`, `/admin/providers`, `/admin/settings`). Notify any existing admins to expect a single re-login.

---

## 7. Rollback risk 🟡 **MEDIUM**

> *Source: synthesized*

**Findings:**
- No migrations folder means there's no `prisma migrate resolve --rolled-back` path back to SQLite if MySQL goes wrong.
- The current SQLite file (if any) on the production server is the only ground-truth backup.
- `git revert` of the schema change would revert the *code* to SQLite, but Prisma's generated client and any in-memory state would need to be regenerated/restarted.

**Mitigation:**
> **Before Phase 1-B touches production, take a tagged checkpoint of the current state:**
> ```bash
> # On dev machine:
> git tag -a pre-mysql-migration-$(date +%Y%m%d) -m "Last commit on SQLite"
> git push origin pre-mysql-migration-$(date +%Y%m%d)
>
> # On the production server:
> cp /var/www/residency24/prisma/dev.db /var/www/residency24/prisma/dev.db.pre-mysql-$(date +%Y%m%d)
> ```
> Document a rollback procedure: "If the MySQL deploy fails, do the following: (a) `git checkout pre-mysql-migration-...`, (b) `npm ci && npx prisma generate && npm run build`, (c) restore the SQLite backup with `cp dev.db.pre-mysql-... dev.db`, (d) `pm2 restart residency24`." Keep this in the runbook for at least 30 days after migration.

---

## 8. Auth security risk (pre-existing, NOT migration-caused) 🔴 **HIGH**

> *Source: `08_FUNCTIONALITY_INVENTORY.md`*

**Findings:**
- The custom base64 auth cookie is not signed; it can be forged.
- No `proxy.ts` / middleware enforces auth on admin routes.
- The default seeded admin password `admin123` is well-known.

**This is NOT a migration risk** — it exists today and will exist after migration. Listing it here so the user is fully informed.

**Mitigation:**
> Schedule a Phase 2 task: "Replace custom auth with Auth.js v5 + signed cookies, add `proxy.ts` to gate `/admin/*` and `/api/admin/*`, rotate the seeded admin password to a strong env-var-driven value, add a logout route that clears the cookie." Do not delay Phase 1-B for this.

---

## Aggregate verdict

| Risk | Score |
|------|-------|
| 1. Data preservation | 🟡 MEDIUM |
| 2. Schema migration | 🟢 LOW |
| 3. Code breakage | 🟢 LOW |
| 4. Deployment continuity | 🔴 **HIGH** |
| 5. AI chat breakage | 🟡 MEDIUM |
| 6. Admin panel breakage | 🟡 MEDIUM |
| 7. Rollback | 🟡 MEDIUM |
| 8. Auth (pre-existing) | 🔴 HIGH (not blocking the migration) |

> **Overall: 🟡 PROCEED WITH CARE.**
>
> The single migration-blocking risk is **#4 (Deployment continuity)** — the broken standalone-output / deploy.sh chain. Resolve that *first*, then the SQLite → MySQL change itself is mechanically straightforward.
>
> The single open question that must be answered before any other work is **risk #1 (Data preservation)**: confirm whether real data exists on your laptop or production server.

---

**End of report.**
