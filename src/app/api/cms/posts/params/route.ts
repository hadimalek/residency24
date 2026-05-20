import { NextResponse } from "next/server";
import { getAllPostParams } from "@/lib/cms/queries";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await getAllPostParams();
    return NextResponse.json({ data });
  } catch (err) {
    console.error("[/api/cms/posts/params] error:", err);
    return NextResponse.json({ data: [] }, { status: 500 });
  }
}
