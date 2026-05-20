import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { slugify } from "@/lib/cms/admin-queries";

export const dynamic = "force-dynamic";

// PATCH /api/admin/authors/[id]
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const body = await request.json();
    const existing = await prisma.blogAuthor.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ message: "Not found" }, { status: 404 });

    const data: any = {};
    if (typeof body.name === "string") data.name = body.name.trim().slice(0, 255);
    if (typeof body.bio === "string") data.bio = body.bio || null;
    if (typeof body.avatarUrl === "string") data.avatarUrl = body.avatarUrl || null;
    if (typeof body.slug === "string" && body.slug.trim()) {
      const newSlug = slugify(body.slug);
      if (newSlug !== existing.slug) {
        const conflict = await prisma.blogAuthor.findUnique({ where: { slug: newSlug } });
        if (conflict && conflict.id !== id) {
          return NextResponse.json({ message: "Slug already in use" }, { status: 409 });
        }
        data.slug = newSlug;
      }
    }
    const updated = await prisma.blogAuthor.update({ where: { id }, data });
    return NextResponse.json(updated);
  } catch (err: any) {
    console.error("[/api/admin/authors/[id]] PATCH error:", err);
    return NextResponse.json({ message: err?.message ?? "Server error" }, { status: 500 });
  }
}

// DELETE /api/admin/authors/[id]
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await prisma.article.updateMany({
      where: { authorId: id },
      data: { authorId: null },
    });
    await prisma.blogAuthor.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("[/api/admin/authors/[id]] DELETE error:", err);
    return NextResponse.json({ message: err?.message ?? "Server error" }, { status: 500 });
  }
}
