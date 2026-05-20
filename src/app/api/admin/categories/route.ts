import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// BlogCategory model has been removed. Return empty list for GET.
export async function GET() {
  return NextResponse.json({ data: [] });
}

// POST is no longer supported.
export async function POST() {
  return NextResponse.json({ message: "Not implemented" }, { status: 501 });
}
