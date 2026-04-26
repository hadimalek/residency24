# 00 — Phase 1-A Discovery: Master Summary  ⭐ START HERE

**Status:** Discovery — read-only audit complete
**Last updated:** 2026-04-25
**Phase:** 1-A
**Branch:** `phase-1a-discovery` (committed locally; not pushed)

---

## Executive summary (3 paragraphs)

The Residency24 codebase is a Next.js 16 + React 19 single-page app with a Prisma 6 / **SQLite** data layer, an OpenAI-powered chat advisor, and a small admin panel. The schema is intentionally simple — seven models, no raw SQL anywhere, no JSON-encoded columns, and no SQLite-specific code outside the one-line `provider = "sqlite"` declaration in `prisma/schema.prisma`. From a code perspective, **the SQLite → MySQL migration is mechanically straightforward**: change the provider, add `@db.*` annotations to long strings, generate migrations, and re-seed.

The risk in this migration is **not in the code**. It is in two places. First, **we do not yet know whether real data exists** in any SQLite file — the `.db` is gitignored and lives only on the user's Windows laptop and (possibly) the production server. We must verify before doing anything destructive. Second, **the deployment pipeline is currently broken**: `next.config.ts` has `output: "standalone"` commented out, while `deploy.sh` and `ecosystem.config.js` both depend on `.next/standalone/server.js` existing. Every `cp` in the deploy script silently swallows its failures, so PM2 restarts look successful while in fact the running process never gets updated. If we rush a MySQL deploy through this pipeline, the migration will *appear* to work and then mysteriously "fail" the next time something restarts the server.

The auth subsystem is also **not what it looks like**. `next-auth@4.24.13` is in `package.json` but never imported anywhere; real authentication is a hand-rolled, **unsigned** base64 cookie in `src/app/api/auth/route.ts`, and **no middleware enforces it on any admin route**. Anyone who knows the URL of `/admin` can use it. This is a pre-existing security hole that the MySQL migration neither causes nor fixes — flagged for a Phase 2 follow-up. None of these findings should block Phase 1-B, but each one needs an explicit decision from the user before we go further.

---

## 🚨 Critical facts to act on (sorted by urgency)

| # | Fact | Source | Action |
|---|------|--------|--------|
| 1 | We don't know if real data exists in any SQLite file. | `04_SQLITE_DATA_AUDIT.md` | **Run discovery commands on Windows + prod server BEFORE Phase 1-B.** |
| 2 | The deploy script silently fails to update the running PM2 process because of the standalone-output mismatch. | `06_DEPLOYMENT_REALITY.md` risk #4 | **Resolve `next.config.ts` standalone-output before any DB migration.** |
| 3 | Custom unsigned base64 auth + no middleware = open admin panel. | `08_FUNCTIONALITY_INVENTORY.md` Authentication section | Schedule for Phase 2; not a Phase 1-B blocker. |
| 4 | A 13 MB `ask-nav-guide-main (1).zip` is committed to git. | `01_REPOSITORY_INVENTORY.md` | Cleanup commit (Phase 1-B). |
| 5 | Seeded admin password is `admin123`. | `09_ENV_VARS.md` | Rotate immediately after MySQL is up. |

---

## SQLite data verdict (from Task 4)

> **In this sandbox: 🟢 SAFE TO REBUILD.** No `.db` file exists.
>
> **Outside this sandbox: 🟡 INCONCLUSIVE.** `.db` files are gitignored and may exist on your Windows laptop or the production server. **You must verify on each environment before Phase 1-B begins.** Discovery commands and backup steps are in `04_SQLITE_DATA_AUDIT.md`.

---

## Docker verdict (from Task 5)

> **🟡 Docker is currently DORMANT.**
>
> A Dockerfile and docker-compose.yml exist but are **broken** (the standalone-output line is commented out, and the runtime command depends on a `prisma/migrations/` folder that doesn't exist). PM2 is the only working deploy path today.
>
> Recommended for the migration: **use Docker for MySQL only** in local dev; **install MySQL natively** on the production server.

---

## Overall migration risk verdict (aggregate of Task 10)

> **🟡 PROCEED WITH CARE.**
>
> The code change itself is low-risk. The deploy pipeline and the unknown-data-exists question are the two things that can ruin the migration if not handled first.

| Risk | Score |
|------|-------|
| Data preservation | 🟡 MEDIUM |
| Schema migration | 🟢 LOW |
| Code breakage | 🟢 LOW |
| Deployment continuity | 🔴 **HIGH** |
| AI chat breakage | 🟡 MEDIUM |
| Admin panel breakage | 🟡 MEDIUM |
| Rollback | 🟡 MEDIUM |
| Auth (pre-existing) | 🔴 HIGH (not blocking the migration) |

---

## Sub-reports — read in this order

| # | File | What it tells you |
|---|------|-------------------|
| 01 | [`01_REPOSITORY_INVENTORY.md`](./01_REPOSITORY_INVENTORY.md) | Repo state, branches, full directory tree, last 20 commits, notable findings (zip in git, no `.github/workflows/`, etc.). |
| 02 | [`02_STACK_INVENTORY.md`](./02_STACK_INVENTORY.md) | Exact versions of every dep, Node version pinning status, npm scripts, unusual packages. |
| 03 | [`03_PRISMA_CURRENT_STATE.md`](./03_PRISMA_CURRENT_STATE.md) | All 7 models field-by-field with the **`@db.*` annotations needed for MySQL** previewed. |
| **04** | [**`04_SQLITE_DATA_AUDIT.md`**](./04_SQLITE_DATA_AUDIT.md) | **Most critical report.** Whether real data exists, where it would live, how to verify on each environment. |
| 05 | [`05_DOCKER_SETUP_EXPLAINED.md`](./05_DOCKER_SETUP_EXPLAINED.md) | Plain-English explanation of the Docker setup and why it's currently broken. |
| 06 | [`06_DEPLOYMENT_REALITY.md`](./06_DEPLOYMENT_REALITY.md) | The PM2 deploy flow line-by-line, including the silent-failure issue with standalone output. |
| 07 | [`07_SQLITE_COUPLING.md`](./07_SQLITE_COUPLING.md) | What in the code assumes SQLite (almost nothing) and what changes for MySQL (almost nothing). |
| 08 | [`08_FUNCTIONALITY_INVENTORY.md`](./08_FUNCTIONALITY_INVENTORY.md) | Every public route, admin route, API route, what auth they have (none), and the **regression checklist** for Phase 1-C. |
| 09 | [`09_ENV_VARS.md`](./09_ENV_VARS.md) | Every env var the project reads, where it's read, and what the new MySQL `.env.example` should look like. |
| 10 | [`10_MIGRATION_RISK_ASSESSMENT.md`](./10_MIGRATION_RISK_ASSESSMENT.md) | Eight risk categories with severity scores and one-sentence mitigations. |
| 11 | [`11_RECOMMENDED_NEXT_STEPS.md`](./11_RECOMMENDED_NEXT_STEPS.md) | Recommended Phase 1-B/1-C path, pre-flight checklist, open questions for the user. |

---

## Decision matrix: are we ready for Phase 1-B?

| State | Verdict |
|-------|---------|
| ✅ All pre-flight items in `11_RECOMMENDED_NEXT_STEPS.md` are checked **AND** standalone-output mismatch is resolved **AND** `.db` files (if any) are backed up | 🟢 **GREEN** — proceed to Phase 1-B |
| ⚠️ Open questions remain but no `.db` data is at risk and the deploy pipeline is being fixed | 🟡 **YELLOW** — answer the questions in this branch's PR, then proceed |
| 🚨 `.db` data exists on prod and isn't backed up, OR the deploy pipeline is still silently failing | 🔴 **RED** — do not start Phase 1-B until both are resolved |

Right now this audit puts the project in **🟡 YELLOW**: nothing has been broken, but the user must answer the open questions in `11_RECOMMENDED_NEXT_STEPS.md` section 3 and decide on the deploy-fix approach before we can move to GREEN.

---

## What I did NOT do (per the read-only constraint)

- Did not modify `prisma/schema.prisma`.
- Did not modify any source file.
- Did not run `prisma migrate`, `db push`, `generate`, or `seed`.
- Did not install or remove any npm packages.
- Did not start the dev server, Docker, or any other long-running process.
- Did not delete any files.
- Did not push the discovery branch to origin.
- Did not read any actual `.env` file (only `.env.example`).

---

## Suggested first message back from the user after reviewing this report

A concrete answer to each of these questions, in any order. The discovery branch can stay local until then.

1. Does production currently serve the new Next.js code or the old WordPress?
2. Have you ever used the chat or admin on your laptop?
3. Production server hostname / SSH access?
4. Has prod been updated since `1b1a4f7`?
5. Are there real Leads in the DB?
6. Local-MySQL approach: Docker or native install?
7. Production-MySQL approach: same VM, managed service, or Docker?

Once we have those answers we can scope Phase 1-B precisely.

---

**End of summary. Next file to read: `04_SQLITE_DATA_AUDIT.md`.**
