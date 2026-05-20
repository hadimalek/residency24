import { NextRequest, NextResponse } from "next/server";
import { listCategories } from "@/lib/cms/queries";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const lang = searchParams.get("lang") ?? "en";
  try {
    const data = await listCategories(lang);
    return NextResponse.json({ data });
  } catch (err) {
    console.error("[/api/cms/categories] error:", err);
    return NextResponse.json({ data: [] }, { status: 500 });
  }
}
