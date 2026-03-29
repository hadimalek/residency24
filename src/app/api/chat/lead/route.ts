import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const { sessionId, name, email, phone, nationality } = await request.json();

    if (!sessionId || !name || !email) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Find session by sessionKey
    const session = await prisma.session.findUnique({
      where: { sessionKey: sessionId },
    });

    if (!session) {
      return NextResponse.json(
        { error: "Session not found" },
        { status: 404 }
      );
    }

    // Check if lead already exists for this session
    const existingLead = await prisma.lead.findUnique({
      where: { sessionId: session.id },
    });

    if (existingLead) {
      // Update existing lead
      const updated = await prisma.lead.update({
        where: { id: existingLead.id },
        data: { name, email, phone, nationality },
      });
      return NextResponse.json({ lead: updated });
    }

    // Create new lead
    const lead = await prisma.lead.create({
      data: {
        sessionId: session.id,
        name,
        email,
        phone,
        nationality,
        status: "NEW",
      },
    });

    return NextResponse.json({ lead });
  } catch (error) {
    console.error("Lead creation error:", error);
    return NextResponse.json(
      { error: "Failed to save lead" },
      { status: 500 }
    );
  }
}
