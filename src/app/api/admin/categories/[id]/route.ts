import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

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

    const data: Record<string, unknown> = {};
    if (typeof body.name === "string") data.name = body.name.trim().slice(0, 255);
    if (typeof body.description === "string") data.description = body.description || null;
    if (typeof body.sortOrder === "number") data.sortOrder = body.sortOrder;

    // `slug` is intentionally NOT editable here. Articles join to a category by
    // the `Article.category` slug STRING, so renaming it on the overlay row
    // alone would silently orphan every post in that category — and break the
    // live /blog/category/<slug> URL along with it. Renaming a category means
    // rewriting Article.category too; that is a separate operation, not a field
    // edit. The UI shows the slug read-only when editing.

    const updated = await prisma.blogCategory.update({ where: { id }, data });
    return NextResponse.json(updated);
  } catch (err: unknown) {
    console.error("[/api/admin/categories/[id]] PATCH error:", err);
    return NextResponse.json({ message: err instanceof Error ? err.message : "Server error" }, { status: 500 });
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
