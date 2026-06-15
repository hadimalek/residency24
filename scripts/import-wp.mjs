/**
 * WordPress → Prisma blog importer.
 *
 * Pulls posts/categories/authors/media from a WP REST API, converts them
 * to the Article / ArticleTranslation / BlogAuthor / BlogCategory / Media
 * shape used by the new Next.js app, downloads featured + inline images
 * to public/uploads/blog/, rewrites <img src> in body, and stores both
 * a rendered HTML cache and a Tiptap JSON tree (content + contentJson).
 *
 * Usage:
 *   node scripts/import-wp.mjs --site https://residency24.com/fa --lang fa
 *   node scripts/import-wp.mjs --site https://residency24.com/ru --lang ru --limit 5 --dry-run
 *
 * Idempotency: each Article is keyed by (source="wp", sourceId=<wp post id>);
 * re-running updates existing rows. Each Media is keyed by source URL hash.
 */

import { PrismaClient } from "@prisma/client";
import { generateJSON } from "@tiptap/html";
import StarterKit from "@tiptap/starter-kit";
import { Image } from "@tiptap/extension-image";
import { Link } from "@tiptap/extension-link";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableHeader } from "@tiptap/extension-table-header";
import { TableCell } from "@tiptap/extension-table-cell";
import { JSDOM } from "jsdom";
import { createHash } from "node:crypto";
import { writeFile, mkdir, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, "..");
const PUBLIC_UPLOADS_DIR = path.join(PROJECT_ROOT, "public", "uploads", "blog");
// Files inside .next/standalone are what the running PM2 process actually serves
// (the build copies public/ into standalone/public/). Mirror writes into both.
const STANDALONE_UPLOADS_DIR = path.join(
  PROJECT_ROOT,
  ".next",
  "standalone",
  "public",
  "uploads",
  "blog"
);

// ─── DOM polyfill so Tiptap (ProseMirror DOMParser) works under Node ───────
const dom = new JSDOM("");
globalThis.window = dom.window;
globalThis.document = dom.window.document;
globalThis.DOMParser = dom.window.DOMParser;
globalThis.Node = dom.window.Node;

const TIPTAP_EXTENSIONS = [StarterKit, Image, Link, Table, TableRow, TableHeader, TableCell];

// ─── CLI parsing ───────────────────────────────────────────────────────────
function parseArgs(argv) {
  const out = { dryRun: false, limit: null, resumeFromPage: 1 };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--dry-run") out.dryRun = true;
    else if (a === "--site") out.site = argv[++i];
    else if (a === "--lang") out.lang = argv[++i];
    else if (a === "--limit") out.limit = parseInt(argv[++i], 10);
    else if (a === "--resume-from-page") out.resumeFromPage = parseInt(argv[++i], 10);
    else if (a === "--help" || a === "-h") {
      console.log(
        "usage: node scripts/import-wp.mjs --site <wp-url> --lang <fa|ru|en|ar> [--limit N] [--dry-run] [--resume-from-page N]"
      );
      process.exit(0);
    }
  }
  if (!out.site || !out.lang) {
    console.error("ERROR: --site and --lang are required");
    process.exit(1);
  }
  return out;
}

// ─── Tiny logger with timing ───────────────────────────────────────────────
const startedAt = Date.now();
function log(...m) {
  const t = ((Date.now() - startedAt) / 1000).toFixed(1);
  console.log(`[+${t}s]`, ...m);
}

// ─── HTTP helpers ──────────────────────────────────────────────────────────
async function fetchJson(url, attempts = 3) {
  let last;
  for (let i = 0; i < attempts; i++) {
    try {
      const res = await fetch(url, {
        headers: { "User-Agent": "ResidencyImporter/1.0" },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
      return await res.json();
    } catch (e) {
      last = e;
      await new Promise((r) => setTimeout(r, 500 * (i + 1)));
    }
  }
  throw last;
}

async function fetchHeadersForCount(url) {
  const res = await fetch(url, {
    method: "HEAD",
    headers: { "User-Agent": "ResidencyImporter/1.0" },
  });
  return {
    total: parseInt(res.headers.get("x-wp-total") || "0", 10),
    pages: parseInt(res.headers.get("x-wp-totalpages") || "0", 10),
  };
}

// ─── Image download ────────────────────────────────────────────────────────
const fileExistsCache = new Map();
async function fileExists(p) {
  if (fileExistsCache.has(p)) return fileExistsCache.get(p);
  try {
    await stat(p);
    fileExistsCache.set(p, true);
    return true;
  } catch {
    fileExistsCache.set(p, false);
    return false;
  }
}

function urlToLocalRelativePath(srcUrl) {
  // Maps:
  //   https://residency24.com/fa/wp-content/uploads/2026/02/foo.webp
  //   → /uploads/blog/2026/02/foo.webp
  // Falls back to a content hash if structure looks unfamiliar.
  try {
    const u = new URL(srcUrl);
    const m = u.pathname.match(/\/wp-content\/uploads\/(.+)$/);
    if (m) return `/uploads/blog/${m[1]}`;
    // Unknown layout: hash the URL into an opaque path
    const h = createHash("sha1").update(srcUrl).digest("hex").slice(0, 16);
    const ext = path.extname(u.pathname) || ".bin";
    return `/uploads/blog/_misc/${h}${ext}`;
  } catch {
    const h = createHash("sha1").update(srcUrl).digest("hex").slice(0, 16);
    return `/uploads/blog/_misc/${h}.bin`;
  }
}

async function downloadImage(srcUrl, opts = {}) {
  const relativePath = urlToLocalRelativePath(srcUrl);
  const sourceTarget = path.join(PROJECT_ROOT, "public", relativePath.replace(/^\//, ""));
  const standaloneTarget = path.join(
    PROJECT_ROOT,
    ".next/standalone/public",
    relativePath.replace(/^\//, "")
  );
  if (await fileExists(sourceTarget)) {
    return relativePath;
  }
  if (opts.dryRun) {
    log(`  (dry-run) would download ${srcUrl} -> ${relativePath}`);
    return relativePath;
  }
  await mkdir(path.dirname(sourceTarget), { recursive: true });
  const res = await fetch(srcUrl, {
    headers: { "User-Agent": "ResidencyImporter/1.0" },
  });
  if (!res.ok) {
    log(`  ! failed to download ${srcUrl}: HTTP ${res.status}`);
    return null;
  }
  const buf = Buffer.from(await res.arrayBuffer());
  await writeFile(sourceTarget, buf);
  // Mirror into standalone so the running PM2 server sees it without a rebuild.
  try {
    await mkdir(path.dirname(standaloneTarget), { recursive: true });
    await writeFile(standaloneTarget, buf);
  } catch (e) {
    log(`  ! standalone mirror failed: ${e.message}`);
  }
  fileExistsCache.set(sourceTarget, true);
  return relativePath;
}

// ─── Tiptap conversion ─────────────────────────────────────────────────────
function htmlToTiptapJson(html) {
  if (!html) return null;
  try {
    return generateJSON(html, TIPTAP_EXTENSIONS);
  } catch (e) {
    log(`  ! tiptap conversion failed: ${e.message}`);
    return null;
  }
}

// ─── HTML rewriting + reading time ─────────────────────────────────────────
async function rewriteImagesAndDownload(html, opts) {
  if (!html) return { html, count: 0 };
  const regex = /<img\b[^>]*\bsrc=["']([^"']+)["'][^>]*>/gi;
  let count = 0;
  const tasks = [];
  const replacements = new Map();
  let m;
  while ((m = regex.exec(html)) !== null) {
    const src = m[1];
    if (!src.startsWith("http")) continue;
    if (replacements.has(src)) continue;
    replacements.set(src, null); // placeholder
    tasks.push(
      downloadImage(src, opts).then((newPath) => {
        if (newPath) replacements.set(src, newPath);
      })
    );
  }
  await Promise.all(tasks);
  let rewritten = html;
  for (const [oldSrc, newPath] of replacements) {
    if (!newPath) continue;
    rewritten = rewritten.split(oldSrc).join(newPath);
    count++;
  }
  return { html: rewritten, count };
}

/** Rewrite cross-links inside post HTML so they point at the new domain
 *  (relative paths). The published English version has no /en prefix on
 *  the new site, so /en/X collapses to /X. */
function rewriteWpUrls(html) {
  if (!html) return html;
  return html.replace(
    /https?:\/\/(?:www\.)?residency24\.com(\/[^\s"'<>]*)?/gi,
    (_match, path) => {
      if (!path) return "/";
      if (path === "/en" || path === "/en/") return "/";
      if (path.startsWith("/en/")) return path.slice(3);
      return path;
    }
  );
}

/** Fetch a published blog post URL, parse JSON-LD scripts in its <head>,
 *  and return any FAQPage Q&A pairs found. */
async function extractFaqsFromRenderedPage(pageUrl) {
  try {
    const res = await fetch(pageUrl, {
      headers: { "User-Agent": "ResidencyImporter/1.0" },
    });
    if (!res.ok) return [];
    const html = await res.text();
    const ldRe = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
    const out = [];
    let m;
    while ((m = ldRe.exec(html)) !== null) {
      const raw = m[1].trim();
      let parsed;
      try {
        parsed = JSON.parse(raw);
      } catch {
        continue;
      }
      const candidates = Array.isArray(parsed) ? parsed : [parsed];
      for (const obj of candidates) {
        if (!obj || typeof obj !== "object") continue;
        if (obj["@type"] === "FAQPage" && Array.isArray(obj.mainEntity)) {
          for (const q of obj.mainEntity) {
            const question = (q?.name || "").trim();
            const answer = (q?.acceptedAnswer?.text || "").trim();
            if (question && answer) out.push({ question, answer });
          }
        }
      }
    }
    return out;
  } catch (e) {
    log(`  ! faq fetch failed: ${e.message}`);
    return [];
  }
}

function stripHtml(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function readingTimeMinutes(html) {
  const text = stripHtml(html);
  const words = text.split(/\s+/).filter(Boolean).length;
  // 200 words/minute is a reasonable cross-language average; minimum 1.
  return Math.max(1, Math.round(words / 200));
}

function decodeHtmlEntities(s) {
  if (!s) return s;
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&#8217;/g, "’")
    .replace(/&#8211;/g, "–")
    .replace(/&#8212;/g, "—")
    .replace(/&hellip;/g, "…")
    .replace(/&nbsp;/g, " ");
}

/** WP returns non-ASCII slugs percent-encoded (e.g. "%D8%AB%D8%A8%D8%AA-...").
 *  We always store/compare slugs in their decoded UTF-8 form because that's
 *  what URLSearchParams.get returns to our API after the browser decodes the
 *  query string. */
function decodeSlug(s) {
  if (!s) return s;
  try {
    return decodeURIComponent(s);
  } catch {
    return s;
  }
}

function slugifyFallback(name) {
  return (
    name
      .toLowerCase()
      .replace(/[^a-z0-9؀-ۿЀ-ӿ\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-")
      .slice(0, 120) || "untitled"
  );
}

// ─── Importers ─────────────────────────────────────────────────────────────
const prisma = new PrismaClient();

async function importAuthors(site, lang, opts) {
  const out = new Map(); // wp_id (string) -> BlogAuthor.id
  let page = 1;
  while (true) {
    const url = `${site}/wp-json/wp/v2/users?per_page=100&page=${page}`;
    let users;
    try {
      users = await fetchJson(url);
    } catch (e) {
      log(`  ! authors page ${page} failed: ${e.message}`);
      break;
    }
    if (!Array.isArray(users) || users.length === 0) break;
    for (const u of users) {
      const sourceId = String(u.id);
      const slug = decodeSlug(u.slug) || slugifyFallback(u.name || `author-${u.id}`);
      const data = {
        slug: slug,
        name: u.name || slug,
        bio: u.description ? u.description.trim() || null : null,
        avatarUrl: u.avatar_urls
          ? u.avatar_urls["96"] || u.avatar_urls["48"] || null
          : null,
        source: "wp",
        sourceId,
      };
      if (opts.dryRun) {
        log(`  (dry) author: ${u.name} (slug=${slug})`);
        continue;
      }
      const existing = await prisma.blogAuthor.findFirst({
        where: { OR: [{ source: "wp", sourceId }, { slug }] },
      });
      let row;
      if (existing) {
        row = await prisma.blogAuthor.update({
          where: { id: existing.id },
          data: { ...data, slug: existing.slug }, // never rename slug for an existing author
        });
      } else {
        row = await prisma.blogAuthor.create({ data });
      }
      out.set(sourceId, row.id);
    }
    if (users.length < 100) break;
    page++;
  }
  log(`  ${out.size} authors imported`);
  return out;
}

async function importCategories(site, lang, opts) {
  const out = new Map(); // wp_id (string) -> BlogCategory.id
  let page = 1;
  while (true) {
    const url = `${site}/wp-json/wp/v2/categories?per_page=100&page=${page}&hide_empty=false`;
    let cats;
    try {
      cats = await fetchJson(url);
    } catch (e) {
      log(`  ! categories page ${page} failed: ${e.message}`);
      break;
    }
    if (!Array.isArray(cats) || cats.length === 0) break;
    for (const c of cats) {
      if (c.slug === "uncategorized" && c.count === 0) continue;
      const sourceId = String(c.id);
      const slug = decodeSlug(c.slug) || slugifyFallback(c.name);
      const data = {
        locale: lang,
        slug,
        name: decodeHtmlEntities(c.name) || slug,
        description: c.description ? decodeHtmlEntities(c.description).trim() || null : null,
        sortOrder: 0,
        source: "wp",
        sourceId,
      };
      if (opts.dryRun) {
        log(`  (dry) category[${lang}]: ${data.name} (slug=${slug})`);
        continue;
      }
      const existing = await prisma.blogCategory.findFirst({
        where: {
          OR: [
            { source: "wp", sourceId, locale: lang },
            { locale: lang, slug },
          ],
        },
      });
      let row;
      if (existing) {
        row = await prisma.blogCategory.update({
          where: { id: existing.id },
          data: { ...data, slug: existing.slug },
        });
      } else {
        row = await prisma.blogCategory.create({ data });
      }
      out.set(sourceId, row.id);
    }
    if (cats.length < 100) break;
    page++;
  }
  log(`  ${out.size} categories imported for ${lang}`);
  return out;
}

async function ensureMediaForUrl(srcUrl, alt, opts) {
  if (!srcUrl) return null;
  const localPath = await downloadImage(srcUrl, opts);
  if (!localPath) return null;
  if (opts.dryRun) return null;
  // Idempotent on filePath
  const existing = await prisma.media.findFirst({ where: { filePath: localPath } });
  if (existing) return existing.id;
  const ext = path.extname(localPath).toLowerCase();
  const mime =
    ext === ".webp" ? "image/webp" :
    ext === ".png" ? "image/png" :
    ext === ".gif" ? "image/gif" :
    ext === ".svg" ? "image/svg+xml" :
    "image/jpeg";
  const m = await prisma.media.create({
    data: {
      filePath: localPath,
      fileName: path.basename(localPath),
      mimeType: mime,
    },
  });
  if (alt) {
    await prisma.mediaTranslation.create({
      data: { mediaId: m.id, locale: opts.lang, altText: alt.slice(0, 500) },
    });
  }
  return m.id;
}

async function importPost(post, ctx) {
  const { site, lang, dryRun, authorMap, categoryMap } = ctx;
  const sourceId = String(post.id);
  const slug = decodeSlug(post.slug);
  const title = decodeHtmlEntities(post.title?.rendered || "");
  const excerptHtml = post.excerpt?.rendered || "";
  const excerptText = stripHtml(decodeHtmlEntities(excerptHtml)).slice(0, 1000) || null;
  const contentHtmlSrc = post.content?.rendered || "";

  // Pull the featured image URL via the embedded payload (set by our caller).
  const featuredUrl = post._embedded_featured_url || null;
  const featuredAlt = post._embedded_featured_alt || title;

  const wpAuthorId = String(post.author);
  const wpCatIds = (post.categories || []).map(String);

  const oldUrl = post.link || null;
  const publishedAt = post.date_gmt ? new Date(post.date_gmt + "Z") : null;
  const updatedAt = post.modified_gmt ? new Date(post.modified_gmt + "Z") : null;

  // Download featured + media
  const featuredMediaId = await ensureMediaForUrl(featuredUrl, featuredAlt, ctx);

  // Rewrite inline images (downloads + URL replacement)
  const { html: imgRewritten, count: imgCount } = await rewriteImagesAndDownload(
    contentHtmlSrc,
    ctx
  );
  // Rewrite cross-domain links (residency24.com/... → relative)
  const rewrittenHtml = rewriteWpUrls(imgRewritten);

  // HTML → Tiptap JSON (links + images + headings + lists are preserved)
  const contentJson = htmlToTiptapJson(rewrittenHtml);

  const rt = readingTimeMinutes(rewrittenHtml);

  // Scrape FAQs from the rendered page (JSON-LD FAQPage)
  const faqs = oldUrl ? await extractFaqsFromRenderedPage(oldUrl) : [];

  if (dryRun) {
    log(
      `  (dry) post #${sourceId} slug=${slug} title="${title.slice(0, 60)}" ` +
        `featured=${featuredUrl ? "yes" : "no"} inline_imgs=${imgCount} reading=${rt}min faqs=${faqs.length}`
    );
    return;
  }

  // Resolve relations
  const authorId = authorMap.get(wpAuthorId) || null;
  const categoryId = wpCatIds.length > 0 ? categoryMap.get(wpCatIds[0]) || null : null;

  // Upsert Article (key: source+sourceId)
  const existing = await prisma.article.findFirst({
    where: { source: "wp", sourceId },
  });

  // Slug collision: if a different article already owns this slug, suffix it.
  let finalSlug = slug;
  if (!existing) {
    const conflict = await prisma.article.findUnique({ where: { slug } });
    if (conflict) {
      finalSlug = `${slug}-${lang}`;
      const conflict2 = await prisma.article.findUnique({ where: { slug: finalSlug } });
      if (conflict2) finalSlug = `${slug}-${lang}-${sourceId}`;
    }
  }

  const articleData = {
    slug: existing ? existing.slug : finalSlug,
    status: "PUBLISHED",
    publishedAt,
    isFeatured: false,
    featuredImageId: featuredMediaId,
    authorId,
    blogCategoryId: categoryId,
    primaryLocale: lang,
    source: "wp",
    sourceId,
    oldUrl,
    readingTimeMinutes: rt,
    // legacy `category` String — keep slug for backwards compat if anything else reads it
    category: categoryId
      ? (await prisma.blogCategory.findUnique({ where: { id: categoryId } }))?.slug ?? null
      : null,
  };

  let article;
  if (existing) {
    article = await prisma.article.update({
      where: { id: existing.id },
      data: articleData,
    });
  } else {
    article = await prisma.article.create({ data: articleData });
  }

  // Upsert ArticleTranslation
  const transData = {
    locale: lang,
    title: title.slice(0, 255),
    excerpt: excerptText,
    content: rewrittenHtml,
    contentJson: contentJson ?? undefined,
    metaTitle: null,
    metaDescription: excerptText?.slice(0, 320) ?? null,
  };
  await prisma.articleTranslation.upsert({
    where: { articleId_locale: { articleId: article.id, locale: lang } },
    create: { ...transData, articleId: article.id },
    update: transData,
  });

  // Replace FAQs for this article+locale (clean slate so re-runs converge).
  await prisma.articleFaq.deleteMany({
    where: { articleId: article.id, locale: lang },
  });
  if (faqs.length > 0) {
    await prisma.articleFaq.createMany({
      data: faqs.map((f, i) => ({
        articleId: article.id,
        locale: lang,
        question: f.question.slice(0, 1000),
        answer: f.answer.slice(0, 5000),
        sortOrder: i,
      })),
    });
  }

  log(`  ✓ post #${sourceId} slug=${article.slug} imgs=${imgCount} faqs=${faqs.length} (${rt}min)`);
}

// ─── Main flow ─────────────────────────────────────────────────────────────
async function main() {
  const opts = parseArgs(process.argv);
  const ctx = { ...opts };
  log(`importer starting: site=${opts.site} lang=${opts.lang} dryRun=${opts.dryRun} limit=${opts.limit ?? "all"}`);

  // 1. Authors
  log("=== authors ===");
  ctx.authorMap = await importAuthors(opts.site, opts.lang, opts);

  // 2. Categories
  log("=== categories ===");
  ctx.categoryMap = await importCategories(opts.site, opts.lang, opts);

  // 3. Posts (paginated)
  log("=== posts ===");
  const meta = await fetchHeadersForCount(`${opts.site}/wp-json/wp/v2/posts?per_page=1`);
  log(`  total posts on source: ${meta.total} (${meta.pages} pages @ 1/page; we use 50/page)`);
  const PER_PAGE = 50;
  const totalPages = Math.ceil(meta.total / PER_PAGE);
  let imported = 0;

  for (let page = opts.resumeFromPage; page <= totalPages; page++) {
    if (opts.limit && imported >= opts.limit) break;
    const url = `${opts.site}/wp-json/wp/v2/posts?per_page=${PER_PAGE}&page=${page}&_embed=1`;
    log(`-- page ${page}/${totalPages} --`);
    let posts;
    try {
      posts = await fetchJson(url);
    } catch (e) {
      log(`  ! page ${page} failed: ${e.message}; skipping`);
      continue;
    }
    if (!Array.isArray(posts)) {
      log(`  ! unexpected response on page ${page}; skipping`);
      continue;
    }
    for (const post of posts) {
      // Extract featured image from _embedded
      const fm = post._embedded?.["wp:featuredmedia"]?.[0];
      if (fm && fm.source_url) {
        post._embedded_featured_url = fm.source_url;
        post._embedded_featured_alt = fm.alt_text || null;
      }
      try {
        await importPost(post, ctx);
        imported++;
        if (opts.limit && imported >= opts.limit) break;
      } catch (e) {
        log(`  ! post #${post.id} failed: ${e.message}`);
      }
    }
  }

  log(`done. imported=${imported}`);
  await prisma.$disconnect();
}

main().catch(async (e) => {
  console.error("FATAL:", e);
  await prisma.$disconnect();
  process.exit(1);
});
