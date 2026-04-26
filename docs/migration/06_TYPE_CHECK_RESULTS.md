# 06 — Type Check Results

**Status:** Plan (sandbox cannot run npm scripts)
**Last updated:** 2026-04-25
**Phase:** 1-B
**Sandbox limitation:** No `node_modules` and the prompt forbids `npm install`,
so `npx tsc --noEmit` and `npm run lint` cannot execute here. The user must
run these on their Windows machine after `npm install`.

---

## Why we expect zero new type errors

The Phase 1-A audit (`docs/discovery/07_SQLITE_COUPLING.md`) established:

- All 18 DB-touching files use Prisma's typed query builder.
- No raw SQL anywhere.
- No `Json` type in the schema (so no `Prisma.JsonValue` types in client code).

The Prisma 6 client generates the same TypeScript types regardless of whether
the underlying provider is SQLite or MySQL — the types are derived from the
`schema.prisma` model definitions, not from the datasource provider. The
**only** type-level changes that ever surface in user code from a SQLite→MySQL
move are:

1. **`Bytes` columns**: SQLite returns `Buffer`, MySQL returns `Buffer` too. No diff.
2. **`Decimal` columns**: not used in this schema.
3. **`Json` columns**: not used in this schema.
4. **Native-type-specific helpers** (e.g. `prisma.$queryRaw<MySQL...>`): not used in this codebase.

Therefore **we expect `tsc --noEmit` to pass with the same output as before
the migration** (i.e., zero new errors).

---

## What the user runs on Windows

```bash
# Prerequisites: MySQL is up, migration applied, seed run (see prior reports)

# Refresh node_modules in case anything changed
npm ci

# Generate fresh Prisma client (CRITICAL after schema change)
npx prisma generate

# Type check
npx tsc --noEmit
```

Then:

```bash
# Lint
npm run lint
```

---

## Expected outcomes

| Check | Expected result |
|-------|-----------------|
| `npx prisma generate` | "✔ Generated Prisma Client (vX.X.X) to ./node_modules/@prisma/client in N ms" |
| `npx tsc --noEmit` | **Zero new errors.** Pre-existing strict-mode warnings (if any) are fine. |
| `npm run lint` | **Zero new errors.** Pre-existing warnings are fine. |

---

## If new errors appear

- **Type error referencing a renamed Prisma type** → most often `Prompt`, `Session`, `Message`, `Lead`, `PagePrompt`, `Provider`, or `User`. Names are unchanged in this migration, so this would be unexpected. Restart your IDE's TypeScript server (in VS Code: `Cmd/Ctrl + Shift + P` → "TypeScript: Restart TS server").
- **Type error in `src/lib/ai.ts`** about `pagePrompt.ctaText` or similar → unlikely (we kept the same column types). If it appears, check that `prisma generate` ran successfully.
- **Lint error about unused imports** → not a migration-caused issue; pre-existing.

**Document any error verbatim in this file** (append below) and report back to
discuss before fixing source code (Phase 1-B forbids `src/` edits).

---

## Was this executed in the sandbox?

❌ **No.** Sandbox has no `node_modules` and the prompt forbids `npm install`.

---

**End of report.**
