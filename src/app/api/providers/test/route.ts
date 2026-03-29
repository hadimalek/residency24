import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAIResponse } from "@/lib/ai";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    let apiKey: string;
    let model: string;
    let baseUrl: string | undefined;
    let temperature = 0.7;
    let maxTokens = 50;

    if (body.id) {
      // Test by provider ID — fetch real apiKey from DB
      const provider = await prisma.provider.findUnique({
        where: { id: Number(body.id) },
      });
      if (!provider) {
        return NextResponse.json(
          { success: false, error: "تامین‌کننده پیدا نشد" },
          { status: 404 }
        );
      }
      apiKey = provider.apiKey;
      model = provider.model;
      baseUrl = provider.baseUrl || undefined;
      temperature = provider.temperature;
    } else if (body.apiKey && body.model) {
      apiKey = body.apiKey;
      model = body.model;
      baseUrl = body.baseUrl || undefined;
    } else {
      return NextResponse.json(
        { success: false, error: "id یا apiKey و model الزامی است" },
        { status: 400 }
      );
    }

    await getAIResponse(
      [{ role: "user", content: "Hello" }],
      { apiKey, model, baseUrl, temperature, maxTokens }
    );

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Unknown error";
    console.error("Provider test error:", message);
    return NextResponse.json(
      { success: false, error: message },
      { status: 400 }
    );
  }
}
