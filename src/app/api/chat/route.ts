import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAIResponse } from "@/lib/ai";

type ErrKind = "generic" | "noProvider" | "badKey" | "model" | "quota";

// Localized, user-safe error messages. The chat runs in fa/en/ar/ru, so its
// errors must surface in the same language as the page the user is on.
const CHAT_ERRORS: Record<string, Record<ErrKind, string>> = {
  fa: {
    generic: "خطا در پردازش پیام. لطفاً دوباره تلاش کنید.",
    noProvider: "هیچ تأمین‌کننده هوش مصنوعی فعالی تنظیم نشده است.",
    badKey: "کلید API نامعتبر است. لطفاً با مدیر سایت تماس بگیرید.",
    model: "مدل هوش مصنوعی در دسترس نیست. لطفاً با مدیر سایت تماس بگیرید.",
    quota: "دستیار هوشمند موقتاً در دسترس نیست. لطفاً کمی بعد دوباره تلاش کنید یا از طریق واتساپ با ما در ارتباط باشید.",
  },
  en: {
    generic: "Something went wrong. Please try again.",
    noProvider: "No active AI provider is configured.",
    badKey: "The API key is invalid. Please contact the site administrator.",
    model: "The AI model is unavailable. Please contact the site administrator.",
    quota: "The AI assistant is temporarily unavailable. Please try again later or reach us on WhatsApp.",
  },
  ar: {
    generic: "حدث خطأ أثناء معالجة رسالتك. يرجى المحاولة مرة أخرى.",
    noProvider: "لا يوجد مزوّد ذكاء اصطناعي مفعّل.",
    badKey: "مفتاح API غير صالح. يرجى التواصل مع مسؤول الموقع.",
    model: "نموذج الذكاء الاصطناعي غير متاح. يرجى التواصل مع مسؤول الموقع.",
    quota: "المساعد الذكي غير متاح مؤقتاً. يرجى المحاولة لاحقاً أو التواصل معنا عبر واتساب.",
  },
  ru: {
    generic: "Не удалось обработать сообщение. Пожалуйста, попробуйте ещё раз.",
    noProvider: "Активный AI-провайдер не настроен.",
    badKey: "Неверный API-ключ. Пожалуйста, свяжитесь с администратором сайта.",
    model: "AI-модель недоступна. Пожалуйста, свяжитесь с администратором сайта.",
    quota: "AI-консультант временно недоступен. Пожалуйста, попробуйте позже или напишите нам в WhatsApp.",
  },
};

function classifyError(message: string): ErrKind {
  if (message.includes("No active AI provider")) return "noProvider";
  if (/incorrect api key|invalid api key|\b401\b|unauthorized/i.test(message)) return "badKey";
  if (/\b429\b|quota|insufficient|no credits|billing|rate limit|exceeded/i.test(message)) return "quota";
  if (/\bmodel\b/i.test(message)) return "model";
  return "generic";
}

export async function POST(request: NextRequest) {
  let language = "en";
  try {
    const body = await request.json();
    const { message, sessionId, pageSlug } = body;
    language = typeof body.language === "string" && body.language ? body.language : "en";

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
          language: language || "fa",
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

    // Call AI with the user's language and page context
    const { response, tokensUsed } = await getAIResponse(messages, undefined, language, pageSlug);

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
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Chat error:", message);

    // Show a user-friendly error in the caller's language — never leak API
    // keys or internal details.
    const bundle = CHAT_ERRORS[language] || CHAT_ERRORS.en;
    const userError = bundle[classifyError(message)];

    return NextResponse.json(
      { error: userError },
      { status: 500 }
    );
  }
}
