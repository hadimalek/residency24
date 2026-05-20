import { NextRequest, NextResponse } from "next/server";
import { getPostDetail } from "@/lib/cms/queries";

export const dynamic = "force-dynamic";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ lang: string; slug: string }> }
) {
  const { lang, slug } = await params;
  try {
    const result = await getPostDetail(lang, decodeURIComponent(slug));
    if (!result) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ data: result });
  } catch (err) {
    console.error("[/api/cms/posts/[lang]/[slug]] error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
