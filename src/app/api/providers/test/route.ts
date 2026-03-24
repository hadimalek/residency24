import { NextRequest, NextResponse } from "next/server";
import { getAIResponse } from "@/lib/ai";

export async function POST(request: NextRequest) {
  try {
    const { apiKey, model } = await request.json();

    if (!apiKey || !model) {
      return NextResponse.json(
        { error: "apiKey and model are required" },
        { status: 400 }
      );
    }

    await getAIResponse(
      [{ role: "user", content: "Hello" }],
      {
        apiKey,
        model,
        temperature: 0.7,
        maxTokens: 50,
      }
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
