#!/usr/bin/env node
/**
 * Restore honest modification dates on articles.
 *
 *   node scripts/fix-article-dates.mjs            report only, writes nothing
 *   node scripts/fix-article-dates.mjs --apply    back up, then write
 *
 * Why this exists
 * ---------------
 * `Article.updatedAt` is published twice to Google: as <lastmod> in the
 * per-language sitemaps and as `dateModified` in the article schema. Two bulk
 * operations in August 2026 (an author backfill, then a re-save pass) touched
 * every row, so all 514 articles ended up claiming they were modified on one of
 * two days. Google treats a sitemap whose lastmod is obviously synthetic as
 * having no lastmod at all — and worse, an article that claims a modification
 * that did not happen is making a promise the content does not keep.
 *
 * There is no real edit history to recover: the bulk writes overwrote it. The
 * honest value is therefore `publishedAt` — the last time the article verifiably
 * changed is when it was published. Drafts (no publishedAt) are left alone.
 *
 * This is a one-off repair. The recurrence is fixed in
 * src/app/api/admin/posts/[id]/route.ts, which now holds `updatedAt` steady when
 * a write changes nothing a reader would see. Any future script that writes
 * articles in bulk must pass `updatedAt` explicitly for the same reason.
 */
import { PrismaClient } from "@prisma/client";
import { writeFile } from "node:fs/promises";
import { join } from "node:path";

const prisma = new PrismaClient();
const apply = process.argv.includes("--apply");

const iso = (d) => (d ? new Date(d).toISOString() : null);

async function main() {
  const articles = await prisma.article.findMany({
    select: { id: true, slug: true, status: true, publishedAt: true, updatedAt: true },
    orderBy: { publishedAt: "asc" },
  });

  const drafts = articles.filter((a) => !a.publishedAt);
  const targets = articles.filter(
    (a) => a.publishedAt && iso(a.updatedAt) !== iso(a.publishedAt)
  );

  // How concentrated are the current values? A cluster of identical timestamps
  // is the signature of a bulk write, and the reason for this repair.
  const clusters = new Map();
  for (const a of articles) {
    const k = iso(a.updatedAt);
    clusters.set(k, (clusters.get(k) ?? 0) + 1);
  }
  const worst = [...clusters].sort((x, y) => y[1] - x[1]).slice(0, 3);

  console.log(`articles              ${articles.length}`);
  console.log(`drafts (untouched)    ${drafts.length}`);
  console.log(`to correct            ${targets.length}`);
  console.log(`distinct updatedAt    ${clusters.size}`);
  console.log(`largest clusters      ${worst.map(([k, n]) => `${n}x ${k}`).join("  |  ")}`);
  console.log(`\nafter this runs, updatedAt spreads across the real publish dates:`);
  const days = new Set(targets.map((a) => iso(a.publishedAt).slice(0, 10)));
  console.log(`distinct days         ${days.size}`);

  if (!targets.length) {
    console.log("\nNothing to do.");
    return;
  }

  console.log(`\nsample:`);
  for (const a of targets.slice(0, 5)) {
    console.log(`  ${a.slug.slice(0, 46).padEnd(48)} ${iso(a.updatedAt)} -> ${iso(a.publishedAt)}`);
  }

  if (!apply) {
    console.log(`\nReport only. Re-run with --apply to write.`);
    return;
  }

  const backup = join(process.cwd(), `article-dates-before-${Date.now()}.json`);
  await writeFile(
    backup,
    JSON.stringify(
      articles.map((a) => ({ id: a.id, slug: a.slug, publishedAt: iso(a.publishedAt), updatedAt: iso(a.updatedAt) })),
      null,
      2
    )
  );
  console.log(`\nbackup written to ${backup}`);

  // One statement per row: `updatedAt` is @updatedAt, so it has to be given a
  // value explicitly or Prisma would stamp "now" — the very bug being repaired.
  let done = 0;
  for (const a of targets) {
    await prisma.article.update({
      where: { id: a.id },
      data: { updatedAt: a.publishedAt },
    });
    done++;
  }
  console.log(`corrected ${done} articles`);

  const after = await prisma.article.findMany({
    where: { publishedAt: { not: null } },
    select: { publishedAt: true, updatedAt: true },
  });
  const stillWrong = after.filter((a) => iso(a.updatedAt) !== iso(a.publishedAt)).length;
  const spread = new Set(after.map((a) => iso(a.updatedAt).slice(0, 10))).size;
  console.log(`verify: ${stillWrong} still mismatched, updatedAt now spans ${spread} distinct days`);
}

main()
  .catch((e) => {
    console.error(e.message);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
