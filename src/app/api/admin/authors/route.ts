import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-helpers";
import { slugify } from "@/lib/cms/admin-queries";

export const dynamic = "force-dynamic";

const LOCALES = ["fa", "en", "ar", "ru"] as const;

const authorInclude = {
  translations: true,
  avatar: true,
  user: { select: { id: true, name: true, email: true, role: true } },
} as const;

function shape(a: {
  id: string;
  slug: string;
  userId: number | null;
  avatarId: string | null;
  websiteUrl: string | null;
  instagramUrl: string | null;
  linkedinUrl: string | null;
  telegramUrl: string | null;
  xUrl: string | null;
  isActive: boolean;
  sortOrder: number;
  avatar: { id: string; filePath: string | null } | null;
  user: { id: number; name: string; email: string; role: string } | null;
  translations: Array<{ locale: string; name: string; title: string | null; bio: string | null }>;
  _count?: { articles: number };
}) {
  return {
    id: a.id,
    slug: a.slug,
    userId: a.userId,
    user: a.user,
    isActive: a.isActive,
    sortOrder: a.sortOrder,
    links: {
      website: a.websiteUrl,
      linkedin: a.linkedinUrl,
      instagram: a.instagramUrl,
      telegram: a.telegramUrl,
      x: a.xUrl,
    },
    avatar: a.avatar
      ? {
          id: a.avatar.id,
          // Strip any legacy absolute host so the client always gets a path.
          filePath: a.avatar.filePath?.replace(/^https?:\/\/[^/]+/, "") ?? null,
        }
      : null,
    translations: a.translations.map((t) => ({
      locale: t.locale,
      name: t.name,
      title: t.title,
      bio: t.bio,
    })),
    articleCount: a._count?.articles ?? 0,
  };
}

/** Normalises the per-locale translation payload from the form. */
function readTranslations(body: Record<string, unknown>) {
  const raw = body.translations;
  if (!Array.isArray(raw)) return [];
  const out: Array<{ locale: string; name: string; title: string | null; bio: string | null }> = [];
  for (const t of raw) {
    if (!t || typeof t !== "object") continue;
    const r = t as Record<string, unknown>;
    const locale = typeof r.locale === "string" ? r.locale : "";
    const name = typeof r.name === "string" ? r.name.trim() : "";
    // A translation with no name is not a translation — drop it rather than
    // storing a row that would render an empty byline.
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
  const l = (body.links ?? {}) as Record<string, unknown>;
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

// GET /api/admin/authors — author profiles + the admin users available to bind
export async function GET(request: NextRequest) {
  const auth = await requireAdmin(request);
  if (auth instanceof NextResponse) return auth;

  try {
    const [authors, users] = await Promise.all([
      prisma.author.findMany({
        include: { ...authorInclude, _count: { select: { articles: true } } },
        orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
      }),
      prisma.user.findMany({
        select: { id: true, name: true, email: true, role: true },
        orderBy: { id: "asc" },
      }),
    ]);

    const taken = new Set(authors.map((a) => a.userId).filter((v): v is number => v != null));
    return NextResponse.json({
      data: authors.map(shape),
      // Every account, flagged so the form can show who already has a profile.
      users: users.map((u) => ({ ...u, hasProfile: taken.has(u.id) })),
    });
  } catch (err) {
    console.error("[/api/admin/authors] GET error:", err);
    return NextResponse.json({ data: [], users: [] }, { status: 500 });
  }
}

// POST /api/admin/authors — create a profile
export async function POST(request: NextRequest) {
  const auth = await requireAdmin(request);
  if (auth instanceof NextResponse) return auth;

  try {
    const body = (await request.json()) as Record<string, unknown>;
    const translations = readTranslations(body);
    if (translations.length === 0) {
      return NextResponse.json(
        { error: "حداقل نام نویسنده در یک زبان الزامی است" },
        { status: 400 }
      );
    }

    // Slug from the request, else from the English name if there is one, else
    // from the first name given. Latin slugs keep the public URL clean.
    const rawSlug = typeof body.slug === "string" ? body.slug.trim() : "";
    const basis =
      rawSlug ||
      translations.find((t) => t.locale === "en")?.name ||
      translations[0].name;
    const slug = slugify(basis).slice(0, 128);
    if (!slug) {
      return NextResponse.json(
        { error: "slug قابل تولید نیست — یک slug لاتین وارد کنید" },
        { status: 400 }
      );
    }

    const clash = await prisma.author.findUnique({ where: { slug } });
    if (clash) {
      return NextResponse.json({ error: "این slug قبلاً استفاده شده است" }, { status: 409 });
    }

    const userId = typeof body.userId === "number" ? body.userId : null;
    if (userId != null) {
      const bound = await prisma.author.findUnique({ where: { userId } });
      if (bound) {
        return NextResponse.json(
          { error: "این کاربر قبلاً پروفایل نویسنده دارد" },
          { status: 409 }
        );
      }
    }

    const created = await prisma.author.create({
      data: {
        slug,
        userId,
        avatarId: typeof body.avatarId === "string" ? body.avatarId : null,
        isActive: body.isActive === false ? false : true,
        sortOrder: typeof body.sortOrder === "number" ? body.sortOrder : 0,
        ...readLinks(body),
        translations: { create: translations },
      },
      include: { ...authorInclude, _count: { select: { articles: true } } },
    });

    return NextResponse.json(shape(created), { status: 201 });
  } catch (err) {
    console.error("[/api/admin/authors] POST error:", err);
    const message = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
