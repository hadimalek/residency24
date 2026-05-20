import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Stub: accepts the payload shape but does nothing yet. Wire to a Comment
// model when the comments feature ships.
export async function POST(_request: NextRequest) {
  return NextResponse.json(
    { message: "Comments are not enabled yet" },
    { status: 503 }
  );
}
