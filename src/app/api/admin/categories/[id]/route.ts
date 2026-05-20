import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// BlogCategory model has been removed. All mutations return 501.
export async function PATCH() {
  return NextResponse.json({ message: "Not implemented" }, { status: 501 });
}

export async function DELETE() {
  return NextResponse.json({ message: "Not implemented" }, { status: 501 });
}
