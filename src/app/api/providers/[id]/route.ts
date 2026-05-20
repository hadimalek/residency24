import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-helpers";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin(request);
  if (auth instanceof NextResponse) return auth;

  try {
    const { id } = await params;
    const data = await request.json();

    // If activating this provider, deactivate all others
    if (data.isActive === true) {
      await prisma.provider.updateMany({
        where: { id: { not: parseInt(id) } },
        data: { isActive: false },
      });
    }

    const provider = await prisma.provider.update({
      where: { id: parseInt(id) },
      data,
    });

    return NextResponse.json({
      ...provider,
      apiKey: `****${provider.apiKey.slice(-4)}`,
    });
  } catch (error) {
    console.error("Provider update error:", error);
    return NextResponse.json(
      { error: "Failed to update provider" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin(request);
  if (auth instanceof NextResponse) return auth;

  try {
    const { id } = await params;
    await prisma.provider.delete({ where: { id: parseInt(id) } });

    return NextResponse.json({ success: true, message: "Provider deleted" });
  } catch (error) {
    console.error("Provider delete error:", error);
    return NextResponse.json(
      { error: "Failed to delete provider" },
      { status: 500 }
    );
  }
}
