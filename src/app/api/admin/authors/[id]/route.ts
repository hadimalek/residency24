import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-helpers";

export const dynamic = "force-dynamic";

const LOCALES = ["fa", "en", "ar", "ru"] as const;

function readTranslations(body: Record<string, unknown>) {
  const raw = body.translations;
  if (!Array.isArray(raw)) return null; // absent = leave translations alone
  const out: Array<{ locale: string; name: string; title: string | null; bio: string | null }> = [];
  for (const t of raw) {
    if (!t || typeof t !== "object") continue;
    const r = t as Record<string, unknown>;
    const locale = typeof r.locale === "string" ? r.locale : "";
    const name = typeof r.name === "string" ? r.name.trim() : "";
    if (!LOCALES.includes(locale as (typeof LOCALES)[number]) || !name) continue;
    out.push({
      locale,
      name: name.slice(0, 255),
      title: typeof r.title === "string" && r.title.trim() ? r.title.trim().slice(0, 255) : null,
      bio: typeof r.bio === "string" && r.bio.trim() ? r.bio.trim() : null,
    });
  }
  return out;
}

function readLinks(body: Record<string, unknown>) {
  if (!body.links || typeof body.links !== "object") return {};
  const l = body.links as Record<string, unknown>;
  const pick = (k: string) => {
    const v = l[k];
    if (typeof v !== "string" || !v.trim()) return null;
    return v.trim().slice(0, 512);
  };
  return {
    websiteUrl: pick("website"),
    linkedinUrl: pick("linkedin"),
    instagramUrl: pick("instagram"),
    telegramUrl: pick("telegram"),
    xUrl: pick("x"),
  };
}

// PATCH /api/admin/authors/[id]
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin(request);
  if (auth instanceof NextResponse) return auth;

  const { id } = await params;
  try {
    const existing = await prisma.author.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const body = (await request.json()) as Record<string, unknown>;

    // `slug` is deliberately NOT editable: /{locale}/blog/author/{slug} is a
    // live indexed URL and articles' bylines link to it. Renaming means adding a
    // redirect, which is a separate decision, not a field edit.

    const data: Record<string, unknown> = { ...readLinks(body) };
    if (typeof body.isActive === "boolean") data.isActive = body.isActive;
    if (typeof body.sortOrder === "number") data.sortOrder = body.sortOrder;
    if (body.avatarId !== undefined) {
      data.avatarId = typeof body.avatarId === "string" ? body.avatarId : null;
    }

    if (body.userId !== undefined) {
      const userId = typeof body.userId === "number" ? body.userId : null;
      if (userId != null) {
        const bound = await prisma.author.findUnique({ where: { userId } });
        if (bound && bound.id !== id) {
          return NextResponse.json(
            { error: "این کاربر قبلاً پروفایل نویسنده دارد" },
            { status: 409 }
          );
        }
      }
      data.userId = userId;
    }

    const translations = readTranslations(body);

    await prisma.$transaction(async (tx) => {
      await tx.author.update({ where: { id }, data });
      if (translations) {
        // Replace the set: a locale the form no longer sends has been cleared,
        // and leaving the old row behind would keep serving a stale byline.
        await tx.authorTranslation.deleteMany({ where: { authorId: id } });
        if (translations.length > 0) {
          await tx.authorTranslation.createMany({
            data: translations.map((t) => ({ ...t, authorId: id })),
          });
        }
      }
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[/api/admin/authors/[id]] PATCH error:", err);
    const message = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// DELETE /api/admin/authors/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin(request);
  if (auth instanceof NextResponse) return auth;

  const { id } = await params;
  try {
    const count = await prisma.article.count({ where: { authorId: id } });
    // Article.authorId is ON DELETE SET NULL, so deleting would silently strip
    // the byline off published articles. Make that a deliberate act: hide the
    // profile instead (isActive), or unassign the articles first.
    if (count > 0) {
      return NextResponse.json(
        {
          error: `این نویسنده ${count} مقاله دارد. اول نویسنده مقالات را عوض کنید یا پروفایل را غیرفعال کنید.`,
        },
        { status: 409 }
      );
    }
    await prisma.author.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[/api/admin/authors/[id]] DELETE error:", err);
    const message = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
