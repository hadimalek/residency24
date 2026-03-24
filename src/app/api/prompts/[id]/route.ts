import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const prompt = await prisma.prompt.findUnique({
      where: { id: parseInt(id) },
    });

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(prompt);
  } catch (error) {
    console.error("Prompt fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch prompt" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await request.json();

    const updateData: Record<string, unknown> = { ...data };

    // Increment version if content is changing
    if (data.content !== undefined) {
      const current = await prisma.prompt.findUnique({
        where: { id: parseInt(id) },
      });

      if (current && data.content !== current.content) {
        updateData.version = current.version + 1;
      }
    }

    const prompt = await prisma.prompt.update({
      where: { id: parseInt(id) },
      data: updateData,
    });

    return NextResponse.json(prompt);
  } catch (error) {
    console.error("Prompt update error:", error);
    return NextResponse.json(
      { error: "Failed to update prompt" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.prompt.delete({ where: { id: parseInt(id) } });

    return NextResponse.json({ success: true, message: "Prompt deleted" });
  } catch (error) {
    console.error("Prompt delete error:", error);
    return NextResponse.json(
      { error: "Failed to delete prompt" },
      { status: 500 }
    );
  }
}
