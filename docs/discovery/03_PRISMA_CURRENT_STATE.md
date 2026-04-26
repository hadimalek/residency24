# 03 — Prisma Schema: Current State

**Status:** Discovery
**Last updated:** 2026-04-25
**Phase:** 1-A (read-only)

---

## Datasource & generator

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}
```

- **Provider:** `sqlite` — this is the line that will change to `mysql` in Phase 1-B.
- **URL env var:** `DATABASE_URL`.
- **Default value (from `.env.example`):** `"file:./dev.db"` (a relative SQLite file at the project root).
- **Docker value (from `docker-compose.yml`):** `file:/app/data/prod.db` (absolute path inside the container, persisted on `db-data` volume).

---

## Migration history

```
$ ls -la prisma/migrations/   →   does not exist
$ find prisma/migrations -type f -name "*.sql"  →  no results
```

➡️ **There are zero recorded migrations.** The schema has been managed with `prisma db push` (the SQLite-friendly "just sync" command), not `prisma migrate dev`. This is **explicitly visible in `deploy.sh`** at line 34:

```bash
npx prisma db push --schema=./prisma/schema.prisma
```

**Migration implication:** when we move to MySQL, we should bootstrap a proper migration history with `prisma migrate dev --name init`. The first migration will encode the *current* schema as the baseline. This is straightforward because there's no existing migration lineage to reconcile.

---

## Models (7 total)

### 1. `User` — admin authentication

```prisma
model User {
  id           Int      @id @default(autoincrement())
  email        String   @unique
  passwordHash String
  name         String
  role         String   @default("ADMIN")  // ADMIN | EDITOR
  createdAt    DateTime @default(now())
}
```

- **Indexes:** `@unique` on `email` (implies a UNIQUE INDEX).
- **Relations:** none.
- **MySQL gotchas:**
  - `String email @unique` → must be `@db.VarChar(255)` to fit a MySQL unique index under utf8mb4 (key length limit is 3072 bytes; default `TEXT` fields can't be uniquely indexed without a prefix length).
  - `String passwordHash` (bcrypt = 60 chars) → `@db.VarChar(60)` is enough; or `@db.VarChar(255)` for safety/argon2 future-proofing.
  - `String name` → `@db.VarChar(255)`.
  - `String role` → `@db.VarChar(20)` or convert to a Prisma `enum`.
  - `DateTime createdAt @default(now())` → MySQL `DATETIME(3)` with default `CURRENT_TIMESTAMP(3)` is what Prisma will emit. Fine.

### 2. `Session` — chat conversation thread (NOT auth session)

```prisma
model Session {
  id           Int       @id @default(autoincrement())
  sessionKey   String    @unique
  language     String    @default("fa")
  ipAddress    String?
  userAgent    String?
  startedAt    DateTime  @default(now())
  lastActivity DateTime  @default(now())
  status       String    @default("ACTIVE")   // ACTIVE | CLOSED
  messages     Message[]
  lead         Lead?
}
```

- **Indexes:** `@unique` on `sessionKey`. **No** index on `lastActivity` (used for sorting in `/api/sessions` and `/api/dashboard` — should add one).
- **Relations:** one-to-many to `Message` (via `Message.sessionId`); one-to-one optional to `Lead` (via `Lead.sessionId`).
- **MySQL gotchas:**
  - `sessionKey` is generated as `session_${Date.now()}_${random9chars}` (max ~30 chars in practice). `@db.VarChar(64)` covers it.
  - `userAgent` can be ~500 chars in the wild → use `@db.VarChar(512)` or `@db.Text` (no unique index needed).
  - `status` and `language` → `@db.VarChar(20)` or enum.
  - **Recommendation:** add `@@index([lastActivity])` and `@@index([status])` while we're modifying the schema.

### 3. `Message` — individual chat messages

```prisma
model Message {
  id         Int      @id @default(autoincrement())
  sessionId  Int
  role       String   // USER | ASSISTANT | SYSTEM
  content    String
  tokensUsed Int      @default(0)
  createdAt  DateTime @default(now())
  session    Session  @relation(fields: [sessionId], references: [id], onDelete: Cascade)
}
```

- **Indexes:** **none explicit.** Prisma will create an implicit index on the `sessionId` FK, but the `orderBy: createdAt asc` query in `/api/sessions/[id]` would benefit from `@@index([sessionId, createdAt])`.
- **Relations:** belongs-to `Session` with `onDelete: Cascade` — deleting a session deletes all its messages. **MySQL InnoDB enforces CASCADE the same way; no behavioral change.**
- **MySQL gotchas:**
  - `String content` (chat messages can be long) → use `@db.Text` (up to 64 KB) or `@db.LongText` to be safe. SQLite stored these as unbounded TEXT; MySQL will refuse messages > 65 535 bytes if you stay on `VARCHAR` or default `TEXT`.
  - `String role` → `@db.VarChar(20)` or enum.

### 4. `Lead` — leads captured from chat

```prisma
model Lead {
  id          Int      @id @default(autoincrement())
  sessionId   Int?     @unique
  name        String?
  email       String?
  phone       String?
  nationality String?
  status      String   @default("NEW")  // NEW | FOLLOWING | CONVERTED | ARCHIVED
  createdAt   DateTime @default(now())
  session     Session? @relation(fields: [sessionId], references: [id])
}
```

- **Indexes:** `@unique` on `sessionId` (optional FK with unique constraint = at most one Lead per Session).
- **Relations:** optional belongs-to `Session`. **No `onDelete` clause** — defaults to `SetNull` on the optional FK side. Verify with the user that this is intentional (deleting a chat session should leave its lead in the table with `sessionId = NULL`, which is what the current behavior implies).
- **MySQL gotchas:**
  - `email`, `name` → `@db.VarChar(255)`.
  - `phone` → `@db.VarChar(32)`.
  - `nationality` is short (country code or English name) → `@db.VarChar(64)`.
  - `status` → `@db.VarChar(20)` or enum.
  - **Recommendation:** add `@@index([status])` and `@@index([createdAt])` for the admin list view filters.

### 5. `Prompt` — system prompts and knowledge chunks

```prisma
model Prompt {
  id           Int      @id @default(autoincrement())
  name         String
  type         String   // SYSTEM | KNOWLEDGE
  content      String
  language     String   @default("fa")  // fa | en | ar | ru
  personaName  String?
  isActive     Boolean  @default(true)
  version      Int      @default(1)
  sortOrder    Int      @default(0)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}
```

- **Indexes:** none explicit. `/api/prompts` filters by `type` + `language` + `isActive` and orders by `sortOrder`. Add `@@index([type, language, isActive, sortOrder])` for the chat-system-prompt query path (it's hit on every chat turn).
- **Relations:** none.
- **MySQL gotchas:**
  - `String content` (KNOWLEDGE entries can be long) → `@db.Text`.
  - `name` → `@db.VarChar(255)`.
  - `type`, `language` → `@db.VarChar(20)` or enums.
  - `personaName` → `@db.VarChar(120)`.
  - `updatedAt` with `@updatedAt` → MySQL `DATETIME(3) ON UPDATE CURRENT_TIMESTAMP(3)` (Prisma emits this).

### 6. `PagePrompt` — page-specific chat context

```prisma
model PagePrompt {
  id            Int      @id @default(autoincrement())
  language      String                            // fa | en | ar | ru
  pageSlug      String                            // e.g. uae/golden-visa
  pageName      String
  contextPrompt String
  focusKeywords String?
  ctaText       String?
  isActive      Boolean  @default(true)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  @@unique([language, pageSlug])
}
```

- **Indexes:** composite `@@unique([language, pageSlug])` — the chat code does `findUnique({ where: { language_pageSlug } })`, so this is on the hot path.
- **Relations:** none. (In a fully-built CMS, this would FK to a `Page` table; today it's freeform.)
- **MySQL gotchas:**
  - `pageSlug` ~ 80 chars max realistically → `@db.VarChar(120)`. **Both `language` and `pageSlug` together appear in a unique key — combined byte length under utf8mb4 must stay under 3072. Adding explicit `@db.VarChar(120)` resolves this.**
  - `contextPrompt` → `@db.Text`.
  - `focusKeywords`, `ctaText` → `@db.VarChar(500)` each.

### 7. `Provider` — AI provider configuration

```prisma
model Provider {
  id          Int      @id @default(autoincrement())
  name        String
  apiKey      String
  model       String
  baseUrl     String?
  temperature Float    @default(0.7)
  maxTokens   Int      @default(1000)
  isActive    Boolean  @default(false)
  createdAt   DateTime @default(now())
}
```

- **Indexes:** none. `/api/providers` orders by `createdAt desc`; the chat code does `findFirst({ where: { isActive: true } })`. Add `@@index([isActive])` (a partial index would be ideal but neither MySQL nor Prisma supports them on this schema).
- **Relations:** none.
- **MySQL gotchas:**
  - `apiKey` (OpenAI keys are ~51 chars) → `@db.VarChar(255)` for safety with future provider key formats.
  - `model` → `@db.VarChar(100)`.
  - `baseUrl` → `@db.VarChar(500)`.
  - `Float temperature` → MySQL `DOUBLE` (Prisma's default). Fine.
  - **Security note:** `apiKey` is stored in plaintext. Consider encrypting at rest in Phase 2+; not a Phase 1 blocker.

---

## Enum declarations

There are **zero** Prisma `enum` blocks. All discrete-value fields (`role`, `status`, `type`, `language`) are stored as `String`. This is fine but makes refactoring harder. For the MySQL migration, you can keep `String` (lowest-risk) or introduce `enum` blocks (medium-risk — Prisma enum changes require migrations and break old rows that contain unknown values).

**Recommendation:** keep them as `String` for the migration cut-over, then introduce enums in a follow-up PR after the MySQL move is stable.

---

## Foreign-key behavior summary

| Parent | Child | Behavior |
|--------|-------|----------|
| `Session` | `Message` | `onDelete: Cascade` (explicit) |
| `Session` | `Lead` | default = `SetNull` on optional FK |

**MySQL InnoDB note:** both behaviors are supported and Prisma emits the correct DDL. No surprises expected.

---

## Required field-by-field MySQL annotations (preview for Phase 1-B)

This is the *minimum* set of `@db.*` annotations the migration to MySQL will need. **DO NOT EDIT THE SCHEMA YET — this is a preview.**

```prisma
// Suggested annotations only — not applied in this discovery phase.

model User {
  email        String   @unique          @db.VarChar(255)
  passwordHash String                     @db.VarChar(255)
  name         String                     @db.VarChar(255)
  role         String   @default("ADMIN") @db.VarChar(20)
}

model Session {
  sessionKey   String   @unique           @db.VarChar(64)
  language     String   @default("fa")    @db.VarChar(8)
  ipAddress    String?                    @db.VarChar(64)
  userAgent    String?                    @db.VarChar(512)
  status       String   @default("ACTIVE") @db.VarChar(20)
}

model Message {
  role         String                     @db.VarChar(20)
  content      String                     @db.Text
}

model Lead {
  name         String?                    @db.VarChar(255)
  email        String?                    @db.VarChar(255)
  phone        String?                    @db.VarChar(32)
  nationality  String?                    @db.VarChar(64)
  status       String   @default("NEW")   @db.VarChar(20)
}

model Prompt {
  name         String                     @db.VarChar(255)
  type         String                     @db.VarChar(20)
  content      String                     @db.Text
  language     String   @default("fa")    @db.VarChar(8)
  personaName  String?                    @db.VarChar(120)
}

model PagePrompt {
  language      String                    @db.VarChar(8)
  pageSlug      String                    @db.VarChar(120)
  pageName      String                    @db.VarChar(255)
  contextPrompt String                    @db.Text
  focusKeywords String?                   @db.VarChar(500)
  ctaText       String?                   @db.VarChar(500)
}

model Provider {
  name         String                     @db.VarChar(120)
  apiKey       String                     @db.VarChar(255)
  model        String                     @db.VarChar(100)
  baseUrl      String?                    @db.VarChar(500)
}
```

---

## DateTime precision

Every `DateTime` field uses Prisma's default mapping. On MySQL this becomes `DATETIME(3)` (millisecond precision) and `@default(now())` becomes `CURRENT_TIMESTAMP(3)`. There are no `@updatedAt` collisions to worry about.

⚠️ **Time zone note:** MySQL stores `DATETIME` as a wall-clock value (no timezone). The application currently uses `new Date()` everywhere, which serializes to UTC ISO when JSON-encoded but is interpreted as local time when written. Confirm with the user that the production MySQL server's session time zone will be set to UTC (`SET time_zone = '+00:00'`) — otherwise existing UTC-assuming code may shift dates by hours after migration.

---

**End of report.**
