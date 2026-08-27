import { NextResponse } from "next/server";
import { getAuthor } from "@/lib/cms/queries";

export const dynamic = "force-dynamic";

// GET /api/cms/authors/[lang]/[slug] — public author profile
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ lang: string; slug: string }> }
) {
  const { lang, slug } = await params;
  try {
    const author = await getAuthor(lang, decodeURIComponent(slug));
    if (!author) return NextResponse.json({ message: "Not found" }, { status: 404 });
    return NextResponse.json({ data: author });
  } catch (err) {
    console.error("[/api/cms/authors/[lang]/[slug]] error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
