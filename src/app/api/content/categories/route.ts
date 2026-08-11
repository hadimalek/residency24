import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { slugify } from "@/lib/cms/admin-queries";
import { authenticateContentRequest } from "@/lib/content-api/auth";
import { ok, created, apiError, validationError, guard } from "@/lib/content-api/http";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// Articles link to a category by its slug string, so the agent needs to read
// the managed list and create new ones. This endpoint is intentionally limited
// to BLOG categories only.

const createCategorySchema = z
  .object({
    locale: z.string().min(2).max(8),
    name: z.string().min(1).max(255),
    slug: z.string().max(128).optional(),
    description: z.string().nullish(),
    sortOrder: z.number().int().optional(),
  })
  .strict();

// GET /api/content/categories?locale=fa
export async function GET(request: NextRequest) {
  const denied = authenticateContentRequest(request);
  if (denied) return denied;

  return guard(async () => {
    const locale = request.nextUrl.searchParams.get("locale") ?? undefined;
    const rows = await prisma.blogCategory.findMany({
      where: locale ? { locale } : undefined,
      orderBy: [{ locale: "asc" }, { sortOrder: "asc" }, { name: "asc" }],
    });
    return ok(
      rows.map((c) => ({
        id: c.id,
        locale: c.locale,
        slug: c.slug,
        name: c.name,
        description: c.description,
        sortOrder: c.sortOrder,
      }))
    );
  }, "GET /categories");
}

// POST /api/content/categories
export async function POST(request: NextRequest) {
  const denied = authenticateContentRequest(request);
  if (denied) return denied;

  return guard(async () => {
    const body = await request.json().catch(() => null);
    const parsed = createCategorySchema.safeParse(body);
    if (!parsed.success) return validationError(parsed.error.issues);

    const { locale, name, description, sortOrder } = parsed.data;
    const slug = slugify(parsed.data.slug || name);

    const existing = await prisma.blogCategory.findUnique({
      where: { locale_slug: { locale, slug } },
    });
    if (existing) return apiError("conflict", `Category '${slug}' already exists for '${locale}'.`);

    const cat = await prisma.blogCategory.create({
      data: { locale, slug, name, description: description ?? null, sortOrder: sortOrder ?? 0 },
    });
    return created({
      id: cat.id,
      locale: cat.locale,
      slug: cat.slug,
      name: cat.name,
      description: cat.description,
      sortOrder: cat.sortOrder,
    });
  }, "POST /categories");
}
