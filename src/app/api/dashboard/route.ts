import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const now = new Date();
    const todayStart = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );

    const [
      totalSessions,
      activeSessions,
      totalLeads,
      newLeads,
      totalMessages,
    ] = await Promise.all([
      prisma.session.count(),
      prisma.session.count({
        where: { startedAt: { gte: todayStart } },
      }),
      prisma.lead.count(),
      prisma.lead.count({
        where: { createdAt: { gte: todayStart } },
      }),
      prisma.message.count(),
    ]);

    const recentSessions = await prisma.session.findMany({
      include: {
        _count: { select: { messages: true } },
        lead: true,
      },
      orderBy: { lastActivity: "desc" },
      take: 5,
    });

    const recentLeads = await prisma.lead.findMany({
      include: {
        session: { select: { sessionKey: true, language: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 5,
    });

    return NextResponse.json({
      totalSessions,
      activeSessions,
      totalLeads,
      newLeads,
      totalMessages,
      recentSessions,
      recentLeads,
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    return NextResponse.json(
      { error: "Failed to load dashboard data" },
      { status: 500 }
    );
  }
}
