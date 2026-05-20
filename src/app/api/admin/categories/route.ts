import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { slugify } from "@/lib/cms/admin-queries";

export const dynamic = "force-dynamic";

// GET /api/admin/categories — list (optionally filtered by lang)
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const lang = searchParams.get("lang") || undefined;
  try {
    const cats = await prisma.blogCategory.findMany({
      where: lang ? { locale: lang } : undefined,
      orderBy: [{ locale: "asc" }, { sortOrder: "asc" }, { name: "asc" }],
    });
    // Annotate with article count
    const counts = await prisma.article.groupBy({
      by: ["blogCategoryId"],
      _count: { _all: true },
    });
    const countMap = new Map(counts.map((c) => [c.blogCategoryId, c._count._all]));
    return NextResponse.json({
      data: cats.map((c) => ({
        ...c,
        postCount: countMap.get(c.id) ?? 0,
      })),
    });
  } catch (err) {
    console.error("[/api/admin/categories] GET error:", err);
    return NextResponse.json({ data: [] }, { status: 500 });
  }
}

// POST /api/admin/categories — create
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const locale: string = body.locale;
    const name: string = (body.name ?? "").trim();
    if (!locale || !name) {
      return NextResponse.json({ message: "locale and name are required" }, { status: 400 });
    }
    const slug = slugify((body.slug ?? "").trim() || name);
    // (locale, slug) must be unique
    const conflict = await prisma.blogCategory.findUnique({
      where: { locale_slug: { locale, slug } },
    });
    if (conflict) {
      return NextResponse.json({ message: "Slug already exists in this locale" }, { status: 409 });
    }
    const cat = await prisma.blogCategory.create({
      data: {
        locale,
        slug,
        name: name.slice(0, 255),
        description: body.description ?? null,
        sortOrder: body.sortOrder ?? 0,
        source: "manual",
      },
    });
    return NextResponse.json(cat, { status: 201 });
  } catch (err: any) {
    console.error("[/api/admin/categories] POST error:", err);
    return NextResponse.json({ message: err?.message ?? "Server error" }, { status: 500 });
  }
}
