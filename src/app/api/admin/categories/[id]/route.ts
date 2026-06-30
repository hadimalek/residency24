import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { slugify } from "@/lib/cms/admin-queries";

export const dynamic = "force-dynamic";

// PATCH /api/admin/categories/[id]
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const body = await request.json();
    const existing = await prisma.blogCategory.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ message: "Not found" }, { status: 404 });

    const data: any = {};
    if (typeof body.name === "string") data.name = body.name.trim().slice(0, 255);
    if (typeof body.description === "string") data.description = body.description || null;
    if (typeof body.sortOrder === "number") data.sortOrder = body.sortOrder;

    if (typeof body.slug === "string" && body.slug.trim()) {
      const newSlug = slugify(body.slug);
      if (newSlug !== existing.slug) {
        const conflict = await prisma.blogCategory.findUnique({
          where: { locale_slug: { locale: existing.locale, slug: newSlug } },
        });
        if (conflict && conflict.id !== id) {
          return NextResponse.json({ message: "Slug already exists in this locale" }, { status: 409 });
        }
        data.slug = newSlug;
      }
    }

    const updated = await prisma.blogCategory.update({ where: { id }, data });
    return NextResponse.json(updated);
  } catch (err: any) {
    console.error("[/api/admin/categories/[id]] PATCH error:", err);
    return NextResponse.json({ message: err?.message ?? "Server error" }, { status: 500 });
  }
}

// DELETE /api/admin/categories/[id]
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    // Articles link by the `category` slug string and are left untouched, so
    // their posts simply no longer match a managed category.
    await prisma.blogCategory.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("[/api/admin/categories/[id]] DELETE error:", err);
    return NextResponse.json({ message: err?.message ?? "Server error" }, { status: 500 });
  }
}
