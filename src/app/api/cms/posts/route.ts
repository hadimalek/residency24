import { NextRequest, NextResponse } from "next/server";
import { listPosts } from "@/lib/cms/queries";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const lang = searchParams.get("lang") ?? "en";
  const category = searchParams.get("category") || undefined;
  const tag = searchParams.get("tag") || undefined;
  const q = searchParams.get("q") || undefined;
  const type = searchParams.get("type") || undefined;
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10) || 1);
  const perPage = Math.min(50, Math.max(1, parseInt(searchParams.get("per_page") ?? "12", 10) || 12));
  const slugsParam = searchParams.get("slugs");
  const slugs = slugsParam ? slugsParam.split(",").map((s) => s.trim()).filter(Boolean) : undefined;

  try {
    const result = await listPosts({ lang, category, tag, q, type, page, perPage, slugs });
    return NextResponse.json(result);
  } catch (err) {
    console.error("[/api/cms/posts] error:", err);
    return NextResponse.json(
      {
        data: [],
        meta: { current_page: page, last_page: 1, per_page: perPage, total: 0, from: null, to: null },
        links: { first: null, last: null, prev: null, next: null },
      },
      { status: 500 }
    );
  }
}
