# 09 — Environment Variables

**Status:** Discovery
**Last updated:** 2026-04-25
**Phase:** 1-A (read-only)

---

## Files inspected

| File | Exists in this sandbox? | Read? |
|------|--------------------------|-------|
| `.env.example` | ✅ yes | ✅ |
| `.env` | ❌ no | n/a |
| `.env.local` | ❌ no | n/a |
| `.env.production` | ❌ no | n/a |

---

## Contents of `.env.example`

```ini
DATABASE_URL="file:./dev.db"
OPENAI_API_KEY="your-openai-api-key"
NEXTAUTH_SECRET="change-this-to-a-random-string"
NEXTAUTH_URL="http://localhost:3000"
```

> **`NEXTAUTH_SECRET` and `NEXTAUTH_URL` are listed but currently unused** — the project does not actually mount NextAuth (see `08_FUNCTIONALITY_INVENTORY.md` Authentication section). They can stay declared for future-proofing but they don't affect anything today.

---

## Every `process.env.X` reference in the code

```bash
$ grep -rn "process.env\." src/ prisma/
src/lib/db.ts:7:                if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
src/app/api/auth/route.ts:49:   secure: process.env.NODE_ENV === "production",
prisma/seed.ts:185:             apiKey: process.env.OPENAI_API_KEY || "sk-CHANGE-ME",
```

Plus implicit reads via Prisma:

| Var | Used by | Required? |
|-----|---------|-----------|
| `DATABASE_URL` | Prisma (declared in `schema.prisma` as `env("DATABASE_URL")`) | **YES** — server will not start without it |
| `NODE_ENV` | Prisma client singleton + auth cookie `secure` flag | Set automatically by `next dev` / `next start` / PM2 / Docker |
| `OPENAI_API_KEY` | Only consumed by `prisma/seed.ts` to populate the initial `Provider` row. The runtime chat reads `apiKey` from the `Provider` table, not from env. | **OPTIONAL** — only needed at first seed. After that it lives in the DB. |

So the *runtime* requirement is just `DATABASE_URL`. Everything else is either inferred from the runtime, only needed during seeding, or declared-but-unused.

---

## Variables declared in `docker-compose.yml`

```yaml
environment:
  - DATABASE_URL=file:/app/data/prod.db
  - NODE_ENV=production
env_file:
  - .env
```

So inside the Docker container:
- `DATABASE_URL` is **explicitly overridden** to point at the volume-mounted SQLite path.
- `NODE_ENV` is **explicitly set** to `production`.
- Everything else is loaded from a host-side `.env` file.

---

## Variables set in `ecosystem.config.js`

```js
env: {
  NODE_ENV: "production",
  PORT: 3000,
  HOSTNAME: "0.0.0.0",
}
```

PM2 only sets these three. **`DATABASE_URL` and any other secrets come from `.env`**, which `deploy.sh` copies into `.next/standalone/.env` after building. The Next.js standalone server picks them up from its own working directory.

---

## Required env vars before / after MySQL migration

### Before (today, SQLite)

| Var | Required? | Example |
|-----|-----------|---------|
| `DATABASE_URL` | Required | `file:./dev.db` (dev) / `file:/app/data/prod.db` (Docker) |
| `OPENAI_API_KEY` | Optional (seed only) | `sk-...` |
| `NEXTAUTH_SECRET` | Listed but unused | any |
| `NEXTAUTH_URL` | Listed but unused | `http://localhost:3000` |
| `NODE_ENV` | Set by harness | `development` / `production` |
| `PORT` | Optional, default 3000 | `3000` |
| `HOSTNAME` | Optional | `0.0.0.0` |

### After (Phase 1-B, MySQL)

| Var | Required? | Example |
|-----|-----------|---------|
| `DATABASE_URL` | **Required, format changes** | `mysql://r24user:STRONG_PASSWORD@localhost:3306/residency24?connection_limit=10` |
| `SHADOW_DATABASE_URL` | Recommended for `prisma migrate dev` | `mysql://r24user:STRONG_PASSWORD@localhost:3306/residency24_shadow?connection_limit=5` |
| `OPENAI_API_KEY` | Optional (seed only) | `sk-...` |
| (others unchanged) | | |

The full new `DATABASE_URL` format depends on:
- Whether MySQL listens on the default 3306 or a different port.
- Whether you run MySQL on the host or in Docker (host = `localhost`; Docker = the container name on the same Docker network, e.g. `mysql://r24user:pwd@mysql:3306/residency24`).
- Whether you want a connection pool limit (recommended: `?connection_limit=10` for a single-instance PM2 deploy).

`SHADOW_DATABASE_URL` is needed in development so `prisma migrate dev` can stage migrations without touching your real DB. Production never uses it.

---

## Recommended `.env.example` rewrite (preview, NOT applying now)

```ini
# ─── Database ─────────────────────────────────────────────────────────────────
# Local dev (MySQL via Docker): mysql://r24user:devpass@localhost:3306/residency24
# Production:                   mysql://r24user:STRONG_PASS@db-host:3306/residency24?connection_limit=10
DATABASE_URL="mysql://r24user:devpass@localhost:3306/residency24?connection_limit=10"

# Required only for `prisma migrate dev`. Production deploys do NOT set this.
SHADOW_DATABASE_URL="mysql://r24user:devpass@localhost:3306/residency24_shadow?connection_limit=5"

# ─── AI ───────────────────────────────────────────────────────────────────────
# Used by `prisma db seed` to populate the initial Provider row.
# Runtime chat reads keys from the Provider table, not from env.
OPENAI_API_KEY="sk-..."

# ─── Auth (currently unused — will be wired in a later phase) ────────────────
NEXTAUTH_SECRET="generate with: openssl rand -base64 32"
NEXTAUTH_URL="http://localhost:3000"

# ─── Runtime ──────────────────────────────────────────────────────────────────
# Set automatically by `next dev` / `next start` / PM2 / Docker.
# NODE_ENV=production
# PORT=3000
# HOSTNAME=0.0.0.0
```

(I am NOT writing this file in Phase 1-A.)

---

## Secret hygiene observations

- ✅ `.env` is in `.gitignore`.
- ✅ `.env.local` is in `.gitignore`.
- ⚠️ **`.dockerignore` does NOT exclude `.env`.** If you ever build a Docker image that includes a populated `.env`, the secret ends up in the image layer and any layer-leaking distribution (registry pull, image export) exposes it. Add `.env` to `.dockerignore` in a cleanup commit.
- ✅ The seed file uses `process.env.OPENAI_API_KEY || "sk-CHANGE-ME"` so the placeholder is obvious and harmless.
- ⚠️ The seeded admin password is hard-coded as `admin123` in `prisma/seed.ts` line 114. **Migration plan should include rotating this password the moment MySQL is up** — or, better, parameterizing the seed: `process.env.SEED_ADMIN_PASSWORD ?? throw new Error("SEED_ADMIN_PASSWORD required")`.

---

**End of report.**
