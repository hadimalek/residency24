# 05 — Seed Verification

**Status:** Plan (sandbox cannot run the seed)
**Last updated:** 2026-04-25
**Phase:** 1-B
**Sandbox limitation:** No running MySQL. The user must run the seed and
verify the row counts on their Windows machine.

---

## What the seed does

`prisma/seed.ts` populates four tables on first run:

| Table | Rows produced | Source |
|-------|---------------|--------|
| `User` | 1 (admin) | hard-coded `admin@residency24.com` / `admin123` |
| `Prompt` (type=SYSTEM) | 4 (one per language) | `SYSTEM_PROMPTS` array, lines 6–74 |
| `Prompt` (type=KNOWLEDGE) | 20 (5 per language × 4 languages) | `KNOWLEDGE` array, lines 76–97 |
| `PagePrompt` | 10 (3 fa, 3 en, 2 ar, 2 ru) | `PAGES` array, lines 99–110 |
| `Provider` | 1 (OpenAI placeholder) | reads `OPENAI_API_KEY` env var, falls back to `sk-CHANGE-ME` |

Total: **36 rows** across 4 tables.

`Session`, `Message`, and `Lead` start empty — they are populated by user
interactions with the chat.

---

## Sandbox check: does the seed have any column that would overflow our `@db.VarChar`/`@db.Text` limits?

Quick audit:

| Field in seed | Max length in seed data | Our schema limit | OK? |
|---------------|-------------------------|------------------|-----|
| `User.email` | `admin@residency24.com` (21 chars) | `VarChar(191)` | ✅ |
| `User.passwordHash` | bcrypt = 60 chars | `VarChar(255)` | ✅ |
| `User.name` | `مدیر سیستم` (~10 chars) | `VarChar(255)` | ✅ |
| `Prompt.content` (system) | ~600 chars in Persian | `Text` (64 KB) | ✅ |
| `Prompt.content` (knowledge) | ~400 chars in Persian | `Text` | ✅ |
| `Prompt.name` | `"تأسيس الشركات في الإمارات"` etc. (~30 chars) | `VarChar(255)` | ✅ |
| `Prompt.personaName` | `"مشاور رزیدنسی۲۴"` etc. (~25 chars) | `VarChar(120)` | ✅ |
| `PagePrompt.pageSlug` | `uae/golden-visa` (15 chars) | `VarChar(191)` | ✅ |
| `PagePrompt.contextPrompt` | ~150 chars | `Text` | ✅ |
| `PagePrompt.ctaText` | ~80 chars | `VarChar(500)` | ✅ |
| `Provider.apiKey` | env var or `sk-CHANGE-ME` (~12 chars) | `VarChar(255)` | ✅ |
| `Provider.model` | `gpt-4o-mini` (11 chars) | `VarChar(100)` | ✅ |
| `Provider.baseUrl` | `https://api.openai.com/v1` (25 chars) | `VarChar(500)` | ✅ |

**No length-overflow risk.** The seed should run cleanly against the new MySQL
schema.

---

## What the user runs on Windows

After `prisma migrate deploy` succeeds:

```bash
npx prisma db seed
```

Expected output (roughly):

```
> npx tsx prisma/seed.ts
Seeded 4 system prompts
Seeded 20 knowledge sections
Seeded 10 page prompts
Seeded default AI provider (update API key in admin panel)
Seed completed!
Admin: admin@residency24.com / admin123
```

If it fails with a length error like:

```
Error: ... Data too long for column 'X' at row 1
```

…then the schema's `@db.VarChar(N)` for that column is too small. Increase
it in `prisma/schema.prisma`, run `npx prisma migrate dev --name fix_length`,
then re-run `npx prisma db seed`. (Unlikely — the audit above says no field
overflows.)

---

## Verification SQL

After seeding, verify row counts:

```bash
docker compose exec mysql mysql -uresidency24 -p${MYSQL_PASSWORD} residency24 -e "
  SELECT 'User'       AS tbl, COUNT(*) AS rows FROM User
  UNION ALL
  SELECT 'Prompt',    COUNT(*) FROM Prompt
  UNION ALL
  SELECT 'PagePrompt', COUNT(*) FROM PagePrompt
  UNION ALL
  SELECT 'Provider',  COUNT(*) FROM Provider
  UNION ALL
  SELECT 'Session',   COUNT(*) FROM Session
  UNION ALL
  SELECT 'Message',   COUNT(*) FROM Message
  UNION ALL
  SELECT 'Lead',      COUNT(*) FROM Lead;
"
```

Expected output:

```
+------------+------+
| tbl        | rows |
+------------+------+
| User       |    1 |
| Prompt     |   24 |     ← 4 SYSTEM + 20 KNOWLEDGE
| PagePrompt |   10 |
| Provider   |    1 |
| Session    |    0 |
| Message    |    0 |
| Lead       |    0 |
+------------+------+
```

If all numbers match: **seed is verified** ✅. Continue to smoke test (`07_SMOKE_TEST_RESULTS.md`).

If any number is off:
- 0 rows in `User` / `Prompt` / `PagePrompt` / `Provider` → seed silently failed; check the seed's "Already seeded. Skipping." guard at line 128 (it only kicks in if there's already an `en` SYSTEM prompt, which on a fresh DB shouldn't happen).
- Different counts → someone modified `seed.ts` and didn't update this doc; cross-check.

---

## Was this executed in the sandbox?

❌ **No.** The seed needs a running database. Documentation only.

---

**End of report.**
