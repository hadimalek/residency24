/**
 * CMS query helpers — read blog data from Prisma and shape it for the
 * existing CmsPost* contract consumed by /api/cms/* routes and ultimately
 * by the frontend Server Components in src/app/[lang]/blog.
 *
 * IMPORTANT: server-only — never import from a Client Component.
 */
import { prisma } from "@/lib/db";
import type { Prisma } from "@prisma/client";

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://new.residency24.com").replace(/\/$/, "");

const BREADCRUMB_LABELS: Record<string, { home: string; blog: string }> = {
  en: { home: "Residency24", blog: "Blog" },
  fa: { home: "رزیدنسی۲۴", blog: "بلاگ" },
  ar: { home: "رزیدنسی۲۴", blog: "المدونة" },
  ru: { home: "Residency24", blog: "Блог" },
};

function postUrl(lang: string, slug: string): string {
  return lang === "en" ? `/blog/${slug}` : `/${lang}/blog/${slug}`;
}

function blogIndexUrl(lang: string): string {
  return lang === "en" ? `/blog` : `/${lang}/blog`;
}

function authorUrl(lang: string, slug: string): string {
  const s = encodeURIComponent(slug);
  return lang === "en" ? `/blog/author/${s}` : `/${lang}/blog/author/${s}`;
}

function homeUrl(lang: string): string {
  return lang === "en" ? "/" : `/${lang}`;
}

/**
 * Stable 32-bit hash of a cuid → exposed as numeric id in the public API.
 */
function hashId(cuid: string): number {
  let h = 0;
  for (let i = 0; i < cuid.length; i++) h = ((h << 5) - h + cuid.charCodeAt(i)) | 0;
  return Math.abs(h);
}

type MediaWithTrans = Prisma.MediaGetPayload<{ include: { translations: true } }>;

function mediaToCms(media: MediaWithTrans | null | undefined) {
  if (!media) return null;
  const t = media.translations?.[0];
  const raw = media.filePath ?? "";
  // Strip any existing domain so DB entries with absolute URLs are re-prefixed
  // with the current SITE_URL (handles migration from new.residency24.com → residency24.com).
  const path = raw.replace(/^https?:\/\/[^/]+/, "");
  const url = path ? `${SITE_URL}${path.startsWith("/") ? "" : "/"}${path}` : "";
  return {
    url,
    alt: t?.altText ?? null,
    width: media.width,
    height: media.height,
    mime_type: media.mimeType,
  };
}

// ─────────────────────────────────────────────────────────────────────
// AUTHORS
// ─────────────────────────────────────────────────────────────────────

/** Include clause that gives an author its translations and avatar. */
const authorInclude = {
  translations: true,
  avatar: { include: { translations: true } },
} as const;

type AuthorRow = Prisma.AuthorGetPayload<{ include: typeof authorInclude }>;

/**
 * Pick the best translation for `lang`: the exact locale, else English, else
 * whatever exists. A byline is better shown in the wrong language than dropped —
 * an article with no author is indistinguishable from an unattributed one.
 */
function pickAuthorTranslation(author: AuthorRow, lang: string) {
  return (
    author.translations.find((t) => t.locale === lang) ??
    author.translations.find((t) => t.locale === "en") ??
    author.translations[0] ??
    null
  );
}

function authorToBrief(author: AuthorRow | null | undefined, lang: string) {
  if (!author || !author.isActive) return null;
  const t = pickAuthorTranslation(author, lang);
  if (!t) return null;
  return { name: t.name, slug: author.slug };
}

function authorToDetail(author: AuthorRow | null | undefined, lang: string) {
  if (!author || !author.isActive) return null;
  const t = pickAuthorTranslation(author, lang);
  if (!t) return null;
  return {
    name: t.name,
    slug: author.slug,
    title: t.title ?? null,
    bio: t.bio ?? null,
    avatar: mediaToCms(author.avatar),
  };
}

/** Social links, in the order the profile page renders them. */
function authorLinks(author: AuthorRow) {
  return {
    website: author.websiteUrl ?? null,
    linkedin: author.linkedinUrl ?? null,
    instagram: author.instagramUrl ?? null,
    telegram: author.telegramUrl ?? null,
    x: author.xUrl ?? null,
  };
}

/**
 * One author's public profile, or null when the slug is unknown, the profile is
 * hidden, or it has no translation at all.
 */
export async function getAuthor(lang: string, slug: string) {
  const author = await prisma.author.findUnique({
    where: { slug },
    include: authorInclude,
  });
  if (!author || !author.isActive) return null;
  const detail = authorToDetail(author, lang);
  if (!detail) return null;

  // Which locales this author has actually published in. This — not which
  // locales their bio is translated into — decides whether a locale's profile
  // page is worth indexing: someone who writes only in English has nothing to
  // show on /fa/blog/author/…, and a page listing zero articles is thin content
  // Google should never have been offered.
  const postRows = await prisma.article.findMany({
    where: { authorId: author.id, status: "PUBLISHED" },
    select: { translations: { select: { locale: true } } },
  });
  const postLocales = new Set<string>();
  for (const r of postRows) for (const t of r.translations) postLocales.add(t.locale);

  const postCount = await prisma.article.count({
    where: {
      authorId: author.id,
      status: "PUBLISHED",
      translations: { some: { locale: lang } },
    },
  });

  return {
    ...detail,
    url: authorUrl(lang, author.slug),
    links: authorLinks(author),
    post_count: postCount,
    /** Locales this profile is written in. */
    locales: author.translations.map((t) => t.locale),
    /** Locales the author has published articles in — drives hreflang + indexing. */
    post_locales: [...postLocales],
  };
}

/** Active authors that have at least one published article in `lang`. */
export async function listAuthorsWithPosts(lang: string) {
  const authors = await prisma.author.findMany({
    where: {
      isActive: true,
      articles: { some: { status: "PUBLISHED", translations: { some: { locale: lang } } } },
    },
    include: authorInclude,
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });
  return authors
    .map((a) => {
      const t = pickAuthorTranslation(a, lang);
      return t ? { slug: a.slug, name: t.name, updatedAt: a.updatedAt } : null;
    })
    .filter((a): a is { slug: string; name: string; updatedAt: Date } => a !== null);
}

// ─────────────────────────────────────────────────────────────────────
// LIST POSTS
// ─────────────────────────────────────────────────────────────────────

export interface ListPostsOpts {
  lang: string;
  category?: string;
  tag?: string;
  q?: string;
  type?: string;
  page: number;
  perPage: number;
  slugs?: string[];
  /** Author slug — powers the article list on an author's profile page. */
  author?: string;
}

export async function listPosts(opts: ListPostsOpts) {
  const { lang, category, q, page, perPage, slugs, author } = opts;

  const where: Prisma.ArticleWhereInput = {
    status: "PUBLISHED",
    translations: { some: { locale: lang } },
    ...(category ? { category } : {}),
    ...(author ? { author: { slug: author, isActive: true } } : {}),
    ...(slugs && slugs.length > 0 ? { slug: { in: slugs } } : {}),
    ...(q
      ? {
          translations: {
            some: {
              locale: lang,
              OR: [
                { title: { contains: q } },
                { excerpt: { contains: q } },
              ],
            },
          },
        }
      : {}),
  };

  const [total, articles] = await Promise.all([
    prisma.article.count({ where }),
    prisma.article.findMany({
      where,
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
      skip: (page - 1) * perPage,
      take: perPage,
      include: {
        translations: { where: { locale: lang } },
        featuredImage: { include: { translations: { where: { locale: lang } } } },
        author: { include: authorInclude },
      },
    }),
  ]);

  // One extra query for the whole page of posts, so each chip can carry the
  // name in the page's own language instead of the raw slug.
  const labels = await categoryLabels(lang);

  const data = articles.map((a) => {
    const t = a.translations[0];
    return {
      id: hashId(a.id),
      lang,
      type: "post",
      title: t?.title ?? "",
      slug: a.slug,
      url: postUrl(lang, a.slug),
      excerpt: t?.excerpt ?? null,
      reading_time_minutes: null as number | null,
      published_at: a.publishedAt?.toISOString() ?? null,
      updated_at: a.updatedAt.toISOString(),
      author: authorToBrief(a.author, lang),
      category: categoryRef(a.category, labels),
      tags: [] as { name: string; slug: string }[],
      featured_image: mediaToCms(a.featuredImage),
      has_translations: false,
      translation_count: a.translations.length,
    };
  });

  const lastPage = Math.max(1, Math.ceil(total / perPage));
  return {
    data,
    meta: {
      current_page: page,
      last_page: lastPage,
      per_page: perPage,
      total,
      from: total > 0 ? (page - 1) * perPage + 1 : null,
      to: total > 0 ? Math.min(page * perPage, total) : null,
    },
    links: {
      first: total > 0 ? `?page=1` : null,
      last: total > 0 ? `?page=${lastPage}` : null,
      prev: page > 1 ? `?page=${page - 1}` : null,
      next: page < lastPage ? `?page=${page + 1}` : null,
    },
  };
}

// ─────────────────────────────────────────────────────────────────────
// LIST CATEGORIES
// ─────────────────────────────────────────────────────────────────────

// Slugs that exist in the data but are not hubs worth linking or indexing:
// WordPress's "uncategorized" bucket (in the several spellings the import
// produced, with and without ZWNJ) and the commercial "company registration"
// taxonomy that belongs on the money page. src/proxy.ts 301s all of these, so
// returning one here would render a category chip — and emit a sitemap entry —
// pointing at a URL that redirects. Keep this in agreement with OLD_CATS /
// CAT_TO_PAGE in src/proxy.ts.
const NON_HUB_CATEGORIES = new Set([
  "دسته-بندی-نشده",
  "دستهبندی-نشده",
  "ثبت-شرکت",
]);

/** Mirrors normCat() in src/proxy.ts: ZWNJ, spaces and runs of hyphens all fold
 *  to a single hyphen so the inconsistent WP exports compare equal. */
function normCategory(s: string): string {
  return s.replace(/[‌\s]+/g, "-").replace(/-+/g, "-");
}

/** Is this slug a real, linkable category hub? Narrows away null/empty. */
export function isHubCategory(slug: string | null | undefined): slug is string {
  const s = slug?.trim();
  if (!s) return false;
  return !NON_HUB_CATEGORIES.has(normCategory(s));
}

/** "work-immigration-guide" → "Work Immigration Guide" */
/**
 * Localised display names for category slugs, for one locale.
 *
 * `Article.category` stores a slug — "immigration" — and both listPosts and
 * getPostDetail used to hand that slug straight out as the category *name*, so
 * every category chip on an article and on the related-post cards read
 * "immigration" regardless of the page's language, while the category hub two
 * clicks away said «مهاجرت». BlogCategory has had the translated names all
 * along; nothing was reading them on the article side.
 *
 * Resolved on the server so the localised name is in the HTML — the chip is a
 * link with visible text, and Google should see it in the page's language.
 *
 * prettifySlug is the fallback for a slug with no managed row, which is the
 * same fallback listCategories uses, so a chip and its hub always agree.
 */
export async function categoryLabels(locale: string): Promise<Map<string, string>> {
  const rows = await prisma.blogCategory.findMany({
    where: { locale },
    select: { slug: true, name: true },
  });
  return new Map(rows.map((r) => [r.slug, r.name]));
}

/** One slug -> its localised name, using the map from categoryLabels(). */
export function categoryRef(
  slug: string | null | undefined,
  labels: Map<string, string>
): { name: string; slug: string } | null {
  if (!slug) return null;
  return { name: labels.get(slug) ?? prettifySlug(slug), slug };
}

export function prettifySlug(slug: string): string {
  return slug
    .split(/[-_]+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

/**
 * Categories that published posts in `lang` actually use.
 *
 * Derived from `Article.category` rather than read straight out of the
 * `BlogCategory` table: that table is an OPTIONAL editorial overlay (managed via
 * /admin/categories) and it is normally empty, while `Article.category` carries
 * the real slugs inherited from the WordPress import. Reading only the overlay
 * meant this returned [] for every locale — so the blog index rendered no
 * category chips and /blog/category/<slug> 404'd through notFound(), removing an
 * entire discovery path for hundreds of posts.
 *
 * A BlogCategory row for the same (locale, slug) still wins for display name,
 * description and ordering, which is how you give a Persian category a Persian
 * label instead of the prettified latin slug.
 */
/**
 * Every category slug that published articles in `lang` actually use, with post
 * counts — including non-hub ones. This is the single source of truth for "which
 * categories exist"; `BlogCategory` is only a naming overlay on top of it.
 * Shared by the public listCategories() and by /api/admin/categories.
 *
 * Deliberately findMany + count in JS rather than a SQL groupBy: this is the
 * exact query shape listSitemapArticles() already uses (same relation filter,
 * one selected column), and a single column over a few hundred published rows
 * is nothing.
 */
export async function articleCategoryCounts(lang: string): Promise<Map<string, number>> {
  const rows = await prisma.article.findMany({
    where: {
      status: "PUBLISHED",
      category: { not: null },
      translations: { some: { locale: lang } },
    },
    select: { category: true },
  });

  const counts = new Map<string, number>();
  for (const r of rows) {
    const slug = r.category?.trim();
    if (slug) counts.set(slug, (counts.get(slug) ?? 0) + 1);
  }
  return counts;
}

export async function listCategories(lang: string) {
  const all = await articleCategoryCounts(lang);
  const counts = new Map([...all].filter(([slug]) => isHubCategory(slug)));
  if (counts.size === 0) return [];

  const managed = await prisma.blogCategory.findMany({
    where: { locale: lang, slug: { in: [...counts.keys()] } },
  });
  const overrides = new Map(managed.map((c) => [c.slug, c]));

  return [...counts.entries()]
    .map(([slug, count]) => {
      const o = overrides.get(slug);
      return {
        name: o?.name ?? prettifySlug(slug),
        slug,
        description: o?.description ?? null,
        sortOrder: o?.sortOrder ?? 0,
        count,
      };
    })
    .sort(
      (a, b) =>
        a.sortOrder - b.sortOrder ||
        b.count - a.count ||
        a.name.localeCompare(b.name)
    )
    .map(({ name, slug, description }) => ({ name, slug, description }));
}

// ─────────────────────────────────────────────────────────────────────
// POST DETAIL
// ─────────────────────────────────────────────────────────────────────

export async function getPostDetail(lang: string, slug: string) {
  const article = await prisma.article.findFirst({
    where: {
      slug,
      status: "PUBLISHED",
      translations: { some: { locale: lang } },
    },
    include: {
      translations: { where: { locale: lang } },
      featuredImage: { include: { translations: { where: { locale: lang } } } },
      author: { include: authorInclude },
    },
  });
  if (!article) return null;
  const t = article.translations[0];
  const detailLabels = await categoryLabels(lang);
  if (!t) return null;

  const canonical = `${SITE_URL}${postUrl(lang, article.slug)}`;
  const featured = mediaToCms(article.featuredImage);

  const post = {
    id: hashId(article.id),
    lang,
    type: "post",
    title: t.title,
    slug: article.slug,
    url: postUrl(lang, article.slug),
    canonical_url: canonical,
    excerpt: t.excerpt ?? null,
    content_html: t.content,
    reading_time_minutes: null as number | null,
    published_at: article.publishedAt?.toISOString() ?? null,
    updated_at: article.updatedAt.toISOString(),
    author: authorToDetail(article.author, lang),
    // Only expose a category the reader can actually follow — PostMeta renders
    // this as a link to /blog/category/<slug>, and a non-hub slug 301s.
    category: isHubCategory(article.category)
      ? categoryRef(article.category, detailLabels)
      : null,
    tags: [] as { name: string; slug: string }[],
    featured_image: featured,
  };

  const seo = {
    meta_title: t.metaTitle ?? null,
    meta_description: t.metaDescription ?? t.excerpt?.slice(0, 300) ?? null,
    robots: "index,follow",
    canonical_url: canonical,
    og_title: t.metaTitle ?? t.title,
    og_description: t.metaDescription ?? t.excerpt ?? null,
    og_image_url: featured?.url ?? null,
    og_type: "article",
    twitter_card: "summary_large_image",
    twitter_title: t.metaTitle ?? t.title,
    twitter_description: t.metaDescription ?? t.excerpt ?? null,
    twitter_image_url: featured?.url ?? null,
  };

  // Each WP-import post is mono-locale; expose just its own URL.
  const hreflang = [{ lang, url: canonical }];

  // FAQs stored as JSON in the translation row.
  const rawFaqs = (t as any).faqs;
  const faqs: Array<{ question: string; answer: string; sort_order: number }> = Array.isArray(rawFaqs)
    ? rawFaqs
        .filter((f: any) => f && typeof f.question === "string" && typeof f.answer === "string")
        .map((f: any, i: number) => ({ question: f.question, answer: f.answer, sort_order: i }))
    : [];

  // Same-category related posts (most recent 6, excluding self).
  let related: { entity_type: string; entity_key: string; relation: string }[] = [];
  if (article.category) {
    const sameCat = await prisma.article.findMany({
      where: {
        category: article.category,
        translations: { some: { locale: lang } },
        status: "PUBLISHED",
        id: { not: article.id },
      },
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
      take: 6,
      select: { slug: true },
    });
    related = sameCat.map((r) => ({
      entity_type: "post",
      entity_key: r.slug,
      relation: "category",
    }));
  }
  // If still short on related (uncategorized post), fall back to most-recent in lang.
  if (related.length === 0) {
    const recent = await prisma.article.findMany({
      where: {
        translations: { some: { locale: lang } },
        status: "PUBLISHED",
        id: { not: article.id },
      },
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
      take: 6,
      select: { slug: true },
    });
    related = recent.map((r) => ({
      entity_type: "post",
      entity_key: r.slug,
      relation: "recent",
    }));
  }

  const labels = BREADCRUMB_LABELS[lang] ?? BREADCRUMB_LABELS.en;
  const breadcrumbs = [
    { label: labels.home, href: `${SITE_URL}${homeUrl(lang)}` },
    { label: labels.blog, href: `${SITE_URL}${blogIndexUrl(lang)}` },
    { label: t.title, href: canonical },
  ];

  return {
    post,
    seo,
    hreflang,
    faqs,
    ctas: [] as Array<{
      type: string;
      title: string | null;
      body: string | null;
      button_label: string | null;
      target_url: string | null;
      service_context: string | null;
      placement: string | null;
    }>,
    related,
    breadcrumbs,
  };
}

// ─────────────────────────────────────────────────────────────────────
// ALL POST PARAMS (for generateStaticParams)
// ─────────────────────────────────────────────────────────────────────

export async function getAllPostParams() {
  const articles = await prisma.article.findMany({
    where: { status: "PUBLISHED" },
    include: {
      translations: { select: { locale: true } },
    },
  });
  const params: { lang: string; slug: string }[] = [];
  for (const a of articles) {
    for (const t of a.translations) {
      params.push({ lang: t.locale, slug: a.slug });
    }
  }
  return params;
}
