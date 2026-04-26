# 05 — Docker Setup Explained

**Status:** Discovery
**Last updated:** 2026-04-25
**Phase:** 1-A (read-only)

---

## What Docker actually does in this project (plain language)

Docker lets you package the whole app — Node.js, dependencies, the built Next.js code, the database file — into a single self-contained "container" that runs the same way on your laptop, on a server, or on a cloud platform. Instead of having to install Node 20, run `npm install`, build the app, and configure a process manager on every machine, you just say `docker compose up` and the container starts.

In this repo, Docker is **set up but not currently used by the active deploy script**. The deploy script (`deploy.sh`) uses **PM2** instead — a Node process manager that runs the built app directly on the host without containers. So the Dockerfile and docker-compose.yml are sitting in the repo as a leftover *option*, not as the running deploy.

That distinction matters for the MySQL migration, because the question is: do we make MySQL fit into the existing PM2 deploy, or do we use Docker for MySQL specifically?

---

## File-by-file walkthrough

### `Dockerfile`

Multi-stage Node 20 Alpine build. The intent is to produce a small final image with only what's needed to run the app.

```dockerfile
FROM node:20-alpine AS base
```
Base image: official Node.js 20 on Alpine Linux. Small (~50 MB).

```dockerfile
# --- Dependencies stage ---
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
COPY prisma ./prisma/
RUN npm ci
```
Stage 1: install all npm dependencies (production + dev) and copy in the Prisma schema (Prisma's postinstall needs the schema to generate the client).

```dockerfile
# --- Build stage ---
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build
```
Stage 2: copy the source, generate the Prisma client (idempotent), build the Next.js app. This produces `.next/standalone/` because of the (commented-out) `output: "standalone"` setting in `next.config.ts`.

> 🚨 **Mismatch detected:** `next.config.ts` line 2 currently has `// output: "standalone"` **commented out**. This means the build will NOT produce `.next/standalone/server.js`, but the Dockerfile copies from `.next/standalone/` on lines 34–35. **`docker compose up` would fail to start the container today.** The user would have to uncomment the standalone output to make Docker work — but that's a manual fix that would break `npm start` (per the commit `1b1a4f7 fix: disable standalone output so npm start works correctly`).
>
> **Verdict:** the Docker setup is currently broken. PM2 is the only working deploy path.

```dockerfile
# --- Production runtime stage ---
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
RUN mkdir -p /app/data && chown nextjs:nodejs /app/data
USER nextjs
EXPOSE 3000
CMD ["sh", "-c", "npx prisma migrate deploy && node server.js"]
```
Stage 3: only the artifacts needed at runtime — public assets, the Next.js standalone server, the Prisma client, and a writable `/app/data` directory for the SQLite file. The container starts by running `prisma migrate deploy` (which expects a populated `migrations/` folder — there isn't one!) and then the Next standalone server.

> 🚨 **Second issue:** the runtime command runs `npx prisma migrate deploy`, but `prisma/migrations/` doesn't exist in the repo. So even if the standalone build were fixed, the container would crash on first start because `migrate deploy` requires committed migrations.

### `docker-compose.yml`

```yaml
services:
  web:
    build: .
    ports:
      - "3000:3000"
    env_file:
      - .env
    environment:
      - DATABASE_URL=file:/app/data/prod.db
      - NODE_ENV=production
    volumes:
      - db-data:/app/data
    restart: unless-stopped

volumes:
  db-data:
```

Single service called `web`:
- Builds from the Dockerfile in the same directory.
- Maps host port 3000 to container port 3000.
- Loads env vars from `.env` (which doesn't exist in this sandbox — the user would need to create one).
- Overrides `DATABASE_URL` to `file:/app/data/prod.db` so the SQLite file lives in a Docker-managed volume rather than inside the container's writable layer (so it survives container rebuilds).
- The `db-data` named volume persists the SQLite DB across `docker compose down && docker compose up`.

### `.dockerignore`

```
node_modules
.next
.git
*.md
.env*.local
```

Standard exclusions plus Markdown files (so docs don't bloat the image). Note: `.env` itself is **not** excluded — it would be sent in the build context and could be read by anyone who pulls the image. Worth tightening, but not a Phase 1 blocker.

---

## Currently configured database path inside Docker

| Inside container | Outside container |
|------------------|-------------------|
| `/app/data/prod.db` (SQLite file) | Persisted in Docker named volume `db-data` |

To inspect from the host:

```bash
docker volume inspect residency24_db-data
docker run --rm -v residency24_db-data:/data alpine ls -la /data
```

(Volume name will be prefixed with the Compose project name, usually the directory name. Run `docker volume ls` to confirm.)

---

## Is Docker actually used today?

### Evidence it is NOT used

- `deploy.sh` does **not** mention Docker; it runs `npm ci`, `prisma db push`, `npm run build`, and `pm2 restart`.
- `next.config.ts` has `output: "standalone"` **disabled**, with a recent commit explicitly disabling it (`1b1a4f7 fix: disable standalone output so npm start works correctly`).
- `prisma/migrations/` does not exist, so the container's `prisma migrate deploy` would fail.
- No `docker-compose.override.yml`, no `compose.yml`, no GitHub Actions, no documentation mentioning a Docker workflow.

### Evidence it might once have been used

- The `Dockerfile` is fully written, multi-stage, with a non-root user — someone put real work into it.
- The compose file has a named volume for SQLite persistence — this is an active design decision.

### Verdict

> **🟡 Docker is currently DORMANT.** It was set up at some point but is broken in its current state and not part of the active deploy. PM2 is the live deploy path.

---

## Migration implications

When we move to MySQL, we have three sane options:

### Option 1: Keep PM2, run MySQL on the host (lightest)

Install MySQL 8 directly on the production server. PM2 keeps running Node. The DB is just a service like NGINX or sshd. **Lowest operational overhead, best fit for the existing deploy.** Recommended for a single-server setup.

### Option 2: Keep PM2 for the app, use Docker for MySQL only

A single `docker-compose.yml` with just a `mysql:8` service, persisted to a named volume. PM2 still runs the Node app on the host and connects to MySQL on `localhost:3306`. Useful if you don't want to deal with MySQL package management on the host.

### Option 3: Containerize the whole thing (heaviest)

Keep the existing Dockerfile, fix the standalone-output mismatch, generate proper migrations, and deploy via `docker compose up`. Adds a CI/CD layer but gives you parity between dev and prod. **Not recommended for Phase 1** — it doubles the surface area of the migration.

---

## Recommendation for the user (NOT a decision — for Phase 1-B discussion)

**For local development on Windows:** use Docker for MySQL only (Option 2). One `docker-compose.dev.yml` with a MySQL service makes "I want to spin up a clean DB to test against" trivial. Keep `npm run dev` for the app.

**For production:** install MySQL 8 directly on the existing server (Option 1). It matches the current PM2 mental model, and it spares us from adding container orchestration to a project that doesn't have it today.

This recommendation will be revisited in `11_RECOMMENDED_NEXT_STEPS.md`.

---

**End of report.**
