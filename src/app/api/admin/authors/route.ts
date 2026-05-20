import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { slugify } from "@/lib/cms/admin-queries";

export const dynamic = "force-dynamic";

// GET /api/admin/authors
export async function GET() {
  try {
    const authors = await prisma.blogAuthor.findMany({
      orderBy: { name: "asc" },
    });
    const counts = await prisma.article.groupBy({
      by: ["authorId"],
      _count: { _all: true },
    });
    const countMap = new Map(counts.map((c) => [c.authorId, c._count._all]));
    return NextResponse.json({
      data: authors.map((a) => ({
        ...a,
        postCount: countMap.get(a.id) ?? 0,
      })),
    });
  } catch (err) {
    console.error("[/api/admin/authors] GET error:", err);
    return NextResponse.json({ data: [] }, { status: 500 });
  }
}

// POST /api/admin/authors
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const name: string = (body.name ?? "").trim();
    if (!name) return NextResponse.json({ message: "name is required" }, { status: 400 });

    let slug = slugify((body.slug ?? "").trim() || name);
    const conflict = await prisma.blogAuthor.findUnique({ where: { slug } });
    if (conflict) {
      // suffix
      for (let i = 2; i < 50; i++) {
        const candidate = `${slug}-${i}`;
        const ex = await prisma.blogAuthor.findUnique({ where: { slug: candidate } });
        if (!ex) {
          slug = candidate;
          break;
        }
      }
    }

    const author = await prisma.blogAuthor.create({
      data: {
        slug,
        name: name.slice(0, 255),
        bio: body.bio ?? null,
        avatarUrl: body.avatarUrl ?? null,
        source: "manual",
      },
    });
    return NextResponse.json(author, { status: 201 });
  } catch (err: any) {
    console.error("[/api/admin/authors] POST error:", err);
    return NextResponse.json({ message: err?.message ?? "Server error" }, { status: 500 });
  }
}
