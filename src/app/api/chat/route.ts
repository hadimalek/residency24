import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAIResponse } from "@/lib/ai";

export async function POST(request: NextRequest) {
  try {
    const { message, sessionId } = await request.json();

    if (!message?.trim()) {
      return NextResponse.json(
        { error: "Message cannot be empty" },
        { status: 400 }
      );
    }

    const sessionKey =
      sessionId ||
      `session_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

    // Find or create session
    let session = await prisma.session.findUnique({
      where: { sessionKey },
    });

    if (!session) {
      session = await prisma.session.create({
        data: {
          sessionKey,
          language: "fa",
          ipAddress: request.headers.get("x-forwarded-for") || null,
          userAgent: request.headers.get("user-agent") || null,
        },
      });
    }

    // Save user message
    await prisma.message.create({
      data: { sessionId: session.id, role: "USER", content: message },
    });

    // Get conversation history
    const previousMessages = await prisma.message.findMany({
      where: { sessionId: session.id },
      orderBy: { createdAt: "asc" },
      take: 20,
    });

    const messages = previousMessages.map((m) => ({
      role: m.role.toLowerCase() as "user" | "assistant" | "system",
      content: m.content,
    }));

    // Call AI
    const { response, tokensUsed } = await getAIResponse(messages);

    // Save assistant message
    await prisma.message.create({
      data: {
        sessionId: session.id,
        role: "ASSISTANT",
        content: response,
        tokensUsed,
      },
    });

    // Update session last activity
    await prisma.session.update({
      where: { id: session.id },
      data: { lastActivity: new Date() },
    });

    return NextResponse.json({
      response,
      sessionId: sessionKey,
    });
  } catch (error) {
    console.error("Chat error:", error);
    return NextResponse.json(
      { error: "Failed to process message" },
      { status: 500 }
    );
  }
}
