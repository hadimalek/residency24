import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const language = request.nextUrl.searchParams.get("language");
    const where = language ? { language } : {};
    const pages = await prisma.pagePrompt.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(pages);
  } catch (error) {
    console.error("Pages fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch pages" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    if (!data.language || !data.pageSlug || !data.pageName) {
      return NextResponse.json({ error: "language, pageSlug, and pageName are required" }, { status: 400 });
    }
    const page = await prisma.pagePrompt.create({
      data: {
        language: data.language,
        pageSlug: data.pageSlug,
        pageName: data.pageName,
        contextPrompt: data.contextPrompt || "",
        focusKeywords: data.focusKeywords || null,
        ctaText: data.ctaText || null,
        isActive: data.isActive ?? true,
      },
    });
    return NextResponse.json(page, { status: 201 });
  } catch (error) {
    console.error("Page create error:", error);
    return NextResponse.json({ error: "Failed to create page prompt" }, { status: 500 });
  }
}
