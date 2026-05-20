import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Comments are not enabled yet — return an empty list so the PDP renders
// without errors. Wire up when the comments table is introduced.
export async function GET() {
  return NextResponse.json({ data: [] });
}
