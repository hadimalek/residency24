import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const providers = await prisma.provider.findMany({
      orderBy: { createdAt: "desc" },
    });

    // Mask API keys - show only last 4 characters
    const masked = providers.map((p) => ({
      ...p,
      apiKey: p.apiKey ? `****${p.apiKey.slice(-4)}` : "",
    }));

    return NextResponse.json(masked);
  } catch (error) {
    console.error("Providers fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch providers" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    if (!data.name || !data.apiKey || !data.model) {
      return NextResponse.json(
        { error: "name, apiKey, and model are required" },
        { status: 400 }
      );
    }

    const provider = await prisma.provider.create({
      data: {
        name: data.name,
        apiKey: data.apiKey,
        model: data.model,
        baseUrl: data.baseUrl || null,
        temperature: data.temperature ?? 0.7,
        maxTokens: data.maxTokens ?? 1000,
        isActive: data.isActive ?? false,
      },
    });

    return NextResponse.json(
      { ...provider, apiKey: `****${provider.apiKey.slice(-4)}` },
      { status: 201 }
    );
  } catch (error) {
    console.error("Provider create error:", error);
    return NextResponse.json(
      { error: "Failed to create provider" },
      { status: 500 }
    );
  }
}
