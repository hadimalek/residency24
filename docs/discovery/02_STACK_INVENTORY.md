# 02 — Stack & Dependency Inventory

**Status:** Discovery
**Last updated:** 2026-04-25
**Phase:** 1-A (read-only)

---

## Headline versions (from `package.json`)

| Tool | Version declared | Notes |
|------|------------------|-------|
| **Next.js** | `16.2.1` | Major version 16 — App Router, RSC, **`middleware.ts` is renamed to `proxy.ts` in this release** |
| **React** | `19.2.4` | React 19 — peer-dep risk with `next-auth@4` (see below) |
| **React DOM** | `19.2.4` | matches React |
| **TypeScript** | `^5` (devDep) | strict mode on (see `tsconfig.json`) |
| **Prisma client** | `^6.19.2` | runtime |
| **Prisma CLI** | `^6.19.2` (devDep) | matches client |
| **NextAuth** | `^4.24.13` | **NOT actually used** — see Functionality Inventory; v4 has React 19 peer-dep issues |
| **OpenAI SDK** | `^6.32.0` | new major; provider config in `src/lib/ai.ts` |
| **Tailwind CSS** | `^3.4.17` | v3, NOT v4 |
| **tailwindcss-animate** | `^1.0.7` | shadcn dependency |
| **@tailwindcss/typography** | `^0.5.19` (devDep) | not currently `@apply`'d anywhere I see |
| **PostCSS** | `^8.5.8` | |
| **Autoprefixer** | `^10.4.27` | |
| **shadcn/ui** | (no `components.json` found) | components were copy-pasted into `src/components/ui/` (48 files); `shadcn` CLI is not configured |
| **Radix UI** | many `@radix-ui/react-*` ~v1.1.x–v2.2.x | underlying primitives for shadcn |
| **lucide-react** | `^1.0.1` | iconography (note: 1.0.1 is unusually low — most projects are on 0.4xx; verify this is real and not a typo) |
| **framer-motion** | `^12.38.0` | **STILL `framer-motion`, not yet renamed to `motion`** |
| **react-hook-form** | `^7.72.0` | |
| **@hookform/resolvers** | `^5.2.2` | |
| **zod** | `^4.3.6` | **declared as a dep but not used in any API route** (no `z.object(...)` calls anywhere in `src/`) |
| **@tanstack/react-query** | `^5.95.2` | only the `<QueryClientProvider>` is wired; no `useQuery`/`useMutation` calls found in `src/` |
| **react-markdown** | `^10.1.0` | used in chat output |
| **bcryptjs** | `^3.0.3` | used by custom auth route |
| **@types/bcryptjs** | `^2.4.6` (devDep) | |
| **date-fns** | `^4.1.0` | major v4 |
| **react-day-picker** | `^9.14.0` | |
| **recharts** | `^3.8.0` | major v3 |
| **embla-carousel-react** | `^8.6.0` | |
| **react-resizable-panels** | `^4.7.5` | |
| **vaul** | `^1.1.2` | drawer primitive |
| **sonner** | `^2.0.7` | toaster |
| **next-themes** | `^0.4.6` | dark-mode hook (no `<ThemeProvider>` wired in layout) |
| **cmdk** | `^1.1.1` | command palette |
| **input-otp** | `^1.4.2` | |
| **class-variance-authority** | `^0.7.1` | shadcn variant helper |
| **clsx** | `^2.1.1` | |
| **tailwind-merge** | `^3.5.0` | major v3 |
| **tsx** | `^4.19.0` (devDep) | runs `prisma/seed.ts` |
| **ESLint** | `^9` | |
| **eslint-config-next** | `16.2.1` | matches Next.js |
| **@types/node** | `^20` | indicates Node 20 target |
| **@types/react** / **@types/react-dom** | `^19` | matches React |

**Total deps:** 57 runtime, 11 dev = 68 packages.

---

## Package manager

| Lockfile | Found? | Implication |
|----------|--------|-------------|
| `package-lock.json` | ✅ Yes (~400 KB) | npm is the package manager |
| `pnpm-lock.yaml` | ❌ |  |
| `yarn.lock` | ❌ |  |
| `bun.lockb` | ❌ |  |

➡️ **Use `npm ci` for reproducible installs.** `deploy.sh` already does this correctly.

---

## Node version

| Source | Pinned? |
|--------|---------|
| `package.json` `engines.node` | ❌ Not set |
| `.nvmrc` | ❌ Not present |
| `Dockerfile` | ✅ Implicitly Node 20 (`FROM node:20-alpine`) |
| `@types/node` | `^20` (build-time only) |

➡️ **Recommendation for cleanup:** add `"engines": { "node": ">=20.9.0" }` to `package.json` and create `.nvmrc` with `20.9.0`. (Will be a Phase 1-B cleanup task.)

---

## npm scripts

```json
{
  "dev":   "next dev",
  "build": "next build",
  "start": "next start",
  "lint":  "eslint"
}
```

Notable absences:
- ❌ No `db:push`, `db:migrate`, `db:seed`, `db:studio` shortcuts
- ❌ No `format` (prettier) script
- ❌ No `typecheck` script
- ❌ No `test` script
- ❌ No `postinstall` script (so `prisma generate` is not auto-run after `npm install` — can break first-time clones)

The `prisma.seed` block at the bottom of `package.json` correctly wires `npx tsx prisma/seed.ts` for `npx prisma db seed`.

---

## Compatibility flags & caveats for the migration

1. **Next.js 16 + NextAuth v4** — NextAuth v4 declares peer deps for React 18 and Next.js ≤14. With React 19 + Next 16 you will likely need `npm install --legacy-peer-deps` (or upgrade to Auth.js v5, where the peer deps are React 19-friendly). However, since NextAuth is **not actually used** in the codebase right now, this risk is theoretical until either (a) NextAuth is wired up or (b) the package is removed.
2. **Tailwind v3 → v4 migration is NOT in scope.** All config still uses Tailwind 3 conventions (`tailwind.config.ts` + `postcss.config.mjs`). Stay on v3 for now.
3. **`framer-motion` rename to `motion` is NOT in scope** for the MySQL migration. Leave it.
4. **`lucide-react@^1.0.1`** is suspicious — confirm with the user. The npm registry's lucide-react versions go ~0.300+, with 1.0.1 being uncommon. Could be a typo for `0.x.y` that npm tolerated, or could be intentional. Either way, no impact on the DB migration.
5. **`zod` is installed but not used.** No risk for migration — but flagged because a Prisma migration is a great moment to introduce zod-validated route handlers.

---

## Dependencies that look unusual or potentially out of place

| Package | Why I'm flagging it |
|---------|---------------------|
| `lucide-react@^1.0.1` | Unusual version number (see above) — verify it isn't a typo |
| `next-auth@^4.24.13` | Installed but **never imported anywhere** in `src/`. Either remove it or actually wire it. |
| `zod@^4.3.6` | Installed but **never imported anywhere** in `src/`. Tree-shaking will remove it from the runtime bundle, but it bloats `node_modules`. |
| `next-themes@^0.4.6` | Installed but no `ThemeProvider` is mounted; dark mode is enabled in Tailwind config but unused. |
| `recharts@^3.8.0` | Charting library; no chart usage was found in admin or public components. May be dead code. |
| `react-day-picker@^9.14.0` | DatePicker library; no usage found in `src/`. Likely dead. |
| `embla-carousel-react`, `react-resizable-panels`, `vaul`, `cmdk`, `input-otp` | All shadcn auxiliaries, may or may not be in use depending on which shadcn primitives have been pasted in `src/components/ui/`. |

**None of these affect the MySQL migration.** They are inventoried so the user knows what's in their dep graph; cleanup of unused deps is a separate exercise.

---

**End of report.**
