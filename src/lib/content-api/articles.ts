/**
 * Article domain service for the Content API. All business rules live here so
 * the route handlers stay thin (authenticate → validate → call service →
 * respond). Reuses the same slug/HTML helpers as the admin panel so API-created
 * and admin-created posts are indistinguishable downstream.
 */
import { z } from "zod";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { slugify } from "@/lib/cms/admin-queries";
import { normaliseContent } from "./content-format";
import { ContentApiError } from "./http";

export const ARTICLE_STATUSES = ["DRAFT", "REVIEW", "PUBLISHED", "ARCHIVED"] as const;

// ── Validation schemas ──────────────────────────────────────────────────────

const translationInputSchema = z
  .object({
    locale: z.string().min(2).max(8),
    title: z.string().min(1).max(255),
    excerpt: z.string().max(512).nullish(),
    contentHtml: z.string().nullish(),
    contentMarkdown: z.string().nullish(),
    contentJson: z.unknown().optional(),
    metaTitle: z.string().max(255).nullish(),
    metaDescription: z.string().max(512).nullish(),
    faqs: z
      .array(z.object({ question: z.string(), answer: z.string() }))
      .nullish(),
  })
  .strict();

export const createArticleSchema = z
  .object({
    slug: z.string().max(255).optional(),
    status: z.enum(ARTICLE_STATUSES).default("DRAFT"),
    isFeatured: z.boolean().optional(),
    featuredImageId: z.string().max(30).nullish(),
    countryId: z.string().nullish(),
    category: z.string().max(64).nullish(),
    robots: z.string().max(64).nullish(),
    publishedAt: z.string().datetime().nullish(),
    translations: z.array(translationInputSchema).min(1),
  })
  .strict();

export const updateArticleSchema = z
  .object({
    slug: z.string().max(255).optional(),
    status: z.enum(ARTICLE_STATUSES).optional(),
    isFeatured: z.boolean().optional(),
    featuredImageId: z.string().max(30).nullish(),
    countryId: z.string().nullish(),
    category: z.string().max(64).nullish(),
    robots: z.string().max(64).nullish(),
    publishedAt: z.string().datetime().nullish(),
    // Optional single-translation patch (locale required to target one).
    translation: translationInputSchema.partial({ title: true }).optional(),
  })
  .strict();

export const upsertTranslationSchema = translationInputSchema;

export type CreateArticleInput = z.infer<typeof createArticleSchema>;
export type UpdateArticleInput = z.infer<typeof updateArticleSchema>;
export type TranslationInput = z.infer<typeof translationInputSchema>;

// ── Helpers ───────────────────────────────────────────────────────────────

/** Public URL for an article translation (English lives at the root). */
export function articleUrl(locale: string, slug: string): string {
  return locale === "en" ? `/blog/${slug}` : `/${locale}/blog/${slug}`;
}

/**
 * Fail with a clean 422 (not a raw FK 500) when a referenced Media/Country id
 * does not exist. Only checks ids that were actually supplied.
 */
async function assertReferencesExist(refs: {
  featuredImageId?: string | null;
  countryId?: string | null;
}): Promise<void> {
  if (refs.featuredImageId) {
    const media = await prisma.media.findUnique({ where: { id: refs.featuredImageId } });
    if (!media) {
      throw new ContentApiError(
        "validation_error",
        `featuredImageId '${refs.featuredImageId}' does not exist. Upload it via POST /api/content/media first.`
      );
    }
  }
  if (refs.countryId) {
    const country = await prisma.country.findUnique({ where: { id: refs.countryId } });
    if (!country) {
      throw new ContentApiError("validation_error", `countryId '${refs.countryId}' does not exist.`);
    }
  }
}

async function uniqueSlug(base: string, excludeId?: string): Promise<string> {
  const root = slugify(base);
  for (let i = 1; i < 100; i++) {
    const candidate = i === 1 ? root : `${root}-${i}`;
    const existing = await prisma.article.findUnique({ where: { slug: candidate } });
    if (!existing || existing.id === excludeId) return candidate;
  }
  throw new Error("Could not allocate a unique slug");
}

function stripDomain(filePath?: string | null): string | null {
  if (!filePath) return null;
  return filePath.replace(/^https?:\/\/[^/]+/, "");
}

type ArticleWithRelations = Prisma.ArticleGetPayload<{
  include: { translations: true; featuredImage: true };
}>;

function serialize(a: ArticleWithRelations) {
  return {
    id: a.id,
    slug: a.slug,
    status: a.status,
    isFeatured: a.isFeatured,
    category: a.category,
    countryId: a.countryId,
    robots: a.robots,
    publishedAt: a.publishedAt,
    createdAt: a.createdAt,
    updatedAt: a.updatedAt,
    featuredImage: a.featuredImage
      ? { id: a.featuredImage.id, url: stripDomain(a.featuredImage.filePath) }
      : null,
    translations: a.translations.map((t) => ({
      locale: t.locale,
      title: t.title,
      excerpt: t.excerpt,
      content: t.content,
      metaTitle: t.metaTitle,
      metaDescription: t.metaDescription,
      faqs: t.faqs,
      url: articleUrl(t.locale, a.slug),
    })),
  };
}

function buildTranslationData(t: TranslationInput) {
  const normalised = normaliseContent({
    contentHtml: t.contentHtml,
    contentMarkdown: t.contentMarkdown,
    contentJson: t.contentJson,
  });
  return {
    locale: t.locale,
    title: t.title!.slice(0, 255),
    excerpt: t.excerpt ?? null,
    content: normalised?.html ?? "",
    contentJson: (normalised?.json ?? undefined) as Prisma.InputJsonValue | undefined,
    metaTitle: t.metaTitle ?? null,
    metaDescription: t.metaDescription ?? null,
    faqs: (t.faqs ?? undefined) as Prisma.InputJsonValue | undefined,
  };
}

function resolvePublishedAt(
  status: (typeof ARTICLE_STATUSES)[number],
  provided: string | null | undefined,
  existing: Date | null
): Date | null {
  if (provided) return new Date(provided);
  if (status === "PUBLISHED") return existing ?? new Date();
  return existing;
}

// ── Service operations ──────────────────────────────────────────────────────

export interface ListParams {
  locale?: string;
  status?: string;
  category?: string;
  q?: string;
  page: number;
  perPage: number;
}

export async function listArticles(params: ListParams) {
  const { locale, status, category, q, page, perPage } = params;
  const where: Prisma.ArticleWhereInput = {
    ...(locale ? { translations: { some: { locale } } } : {}),
    ...(status && (ARTICLE_STATUSES as readonly string[]).includes(status)
      ? { status: status as (typeof ARTICLE_STATUSES)[number] }
      : {}),
    ...(category ? { category } : {}),
    ...(q
      ? {
          OR: [
            { slug: { contains: q } },
            { translations: { some: { title: { contains: q } } } },
          ],
        }
      : {}),
  };

  const [total, rows] = await Promise.all([
    prisma.article.count({ where }),
    prisma.article.findMany({
      where,
      orderBy: [{ updatedAt: "desc" }],
      skip: (page - 1) * perPage,
      take: perPage,
      include: { translations: true, featuredImage: true },
    }),
  ]);

  return {
    items: rows.map(serialize),
    meta: { page, perPage, total, lastPage: Math.max(1, Math.ceil(total / perPage)) },
  };
}

export async function getArticle(id: string) {
  const a = await prisma.article.findUnique({
    where: { id },
    include: { translations: true, featuredImage: true },
  });
  return a ? serialize(a) : null;
}

export async function createArticle(input: CreateArticleInput) {
  await assertReferencesExist({
    featuredImageId: input.featuredImageId,
    countryId: input.countryId,
  });

  const baseSlug = input.slug?.trim() || input.translations[0].title;
  const slug = await uniqueSlug(baseSlug);
  const publishedAt = resolvePublishedAt(input.status, input.publishedAt, null);
  // Build translation data (may throw a clean ContentApiError) before opening
  // the DB write.
  const translations = input.translations.map(buildTranslationData);

  try {
    const created = await prisma.article.create({
      data: {
        slug,
        status: input.status,
        publishedAt,
        isFeatured: input.isFeatured ?? false,
        featuredImageId: input.featuredImageId ?? null,
        countryId: input.countryId ?? null,
        category: input.category ? input.category.slice(0, 64) : null,
        robots: input.robots ?? null,
        translations: { create: translations },
      },
      include: { translations: true, featuredImage: true },
    });
    return serialize(created);
  } catch (err) {
    // Rare slug race between uniqueSlug() and create() → surface as a conflict.
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      throw new ContentApiError("conflict", `Slug '${slug}' was just taken — retry the request.`);
    }
    throw err;
  }
}

export type UpdateResult =
  | { ok: true; article: Awaited<ReturnType<typeof getArticle>> }
  | { ok: false; reason: "not_found" | "slug_conflict" };

export async function updateArticle(id: string, input: UpdateArticleInput): Promise<UpdateResult> {
  const existing = await prisma.article.findUnique({
    where: { id },
    include: { translations: true },
  });
  if (!existing) return { ok: false, reason: "not_found" };

  await assertReferencesExist({
    featuredImageId: input.featuredImageId,
    countryId: input.countryId,
  });

  let nextSlug = existing.slug;
  if (input.slug && slugify(input.slug) !== existing.slug) {
    const candidate = slugify(input.slug);
    const conflict = await prisma.article.findUnique({ where: { slug: candidate } });
    if (conflict && conflict.id !== id) return { ok: false, reason: "slug_conflict" };
    nextSlug = candidate;
  }

  const status = input.status ?? existing.status;
  const publishedAt = resolvePublishedAt(status, input.publishedAt, existing.publishedAt);

  await prisma.$transaction(async (tx) => {
    await tx.article.update({
      where: { id },
      data: {
        slug: nextSlug,
        status,
        publishedAt,
        isFeatured: input.isFeatured ?? existing.isFeatured,
        featuredImageId:
          input.featuredImageId === undefined ? existing.featuredImageId : input.featuredImageId,
        countryId: input.countryId === undefined ? existing.countryId : input.countryId,
        category:
          input.category === undefined
            ? existing.category
            : input.category
              ? input.category.slice(0, 64)
              : null,
        robots: input.robots === undefined ? existing.robots : input.robots,
      },
    });

    if (input.translation) {
      const locale =
        input.translation.locale ?? existing.translations[0]?.locale ?? "en";
      const prev = existing.translations.find((t) => t.locale === locale);
      const data = buildTranslationData({
        ...input.translation,
        locale,
        title: input.translation.title ?? prev?.title ?? "",
      } as TranslationInput);
      // Never blank existing body when the patch omits content.
      if (!data.content && prev?.content) {
        data.content = prev.content;
        data.contentJson = (prev.contentJson ?? undefined) as Prisma.InputJsonValue | undefined;
      }
      await tx.articleTranslation.upsert({
        where: { articleId_locale: { articleId: id, locale } },
        create: { ...data, articleId: id },
        update: data,
      });
    }
  });

  return { ok: true, article: await getArticle(id) };
}

export async function upsertTranslation(id: string, input: TranslationInput) {
  const article = await prisma.article.findUnique({ where: { id } });
  if (!article) return { ok: false as const, reason: "not_found" as const };
  const data = buildTranslationData(input);
  await prisma.articleTranslation.upsert({
    where: { articleId_locale: { articleId: id, locale: input.locale } },
    create: { ...data, articleId: id },
    update: data,
  });
  return { ok: true as const, article: await getArticle(id) };
}

export async function deleteArticle(id: string): Promise<boolean> {
  const existing = await prisma.article.findUnique({ where: { id } });
  if (!existing) return false;
  await prisma.$transaction([
    prisma.articleTranslation.deleteMany({ where: { articleId: id } }),
    prisma.article.delete({ where: { id } }),
  ]);
  return true;
}
