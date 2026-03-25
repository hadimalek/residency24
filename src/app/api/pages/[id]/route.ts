import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await request.json();
    const page = await prisma.pagePrompt.update({
      where: { id: parseInt(id) },
      data,
    });
    return NextResponse.json(page);
  } catch (error) {
    console.error("Page update error:", error);
    return NextResponse.json({ error: "Failed to update page prompt" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.pagePrompt.delete({ where: { id: parseInt(id) } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Page delete error:", error);
    return NextResponse.json({ error: "Failed to delete page prompt" }, { status: 500 });
  }
}
