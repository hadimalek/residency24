import OpenAI from "openai";
import { prisma } from "./db";
import { SYSTEM_PROMPT } from "./knowledge";

/**
 * Build system prompt from DB:
 * 1. Language-specific system prompt (with persona)
 * 2. Knowledge base sections for that language
 * 3. Page-specific context (optional)
 */
async function buildSystemPrompt(language: string, pageSlug?: string): Promise<string> {
  // 1. Get language-specific system prompt
  const langPrompt = await prisma.prompt.findFirst({
    where: { isActive: true, type: "SYSTEM", language },
  });

  // Fallback: try any active SYSTEM prompt, then hardcoded default
  let systemContent = langPrompt?.content
    || (await prisma.prompt.findFirst({ where: { isActive: true, type: "SYSTEM" } }))?.content
    || SYSTEM_PROMPT;

  const personaName = langPrompt?.personaName || "Residency24 Advisor";

  // 2. Get knowledge base sections for this language
  const knowledgeSections = await prisma.prompt.findMany({
    where: { isActive: true, type: "KNOWLEDGE", language },
    orderBy: { sortOrder: "asc" },
  });

  // Fallback: if no language-specific knowledge, get all active knowledge
  const sections = knowledgeSections.length > 0
    ? knowledgeSections
    : await prisma.prompt.findMany({
        where: { isActive: true, type: "KNOWLEDGE" },
        orderBy: { sortOrder: "asc" },
      });

  if (sections.length > 0) {
    const kbText = sections.map(s => `## ${s.name}\n${s.content}`).join("\n\n");
    systemContent += `\n\n---\n## Knowledge Base\n${kbText}`;
  }

  // 3. Get page-specific context
  if (pageSlug) {
    const pagePrompt = await prisma.pagePrompt.findUnique({
      where: { language_pageSlug: { language, pageSlug } },
    });
    if (pagePrompt?.isActive) {
      systemContent += `\n\n## Page Context\n${pagePrompt.contextPrompt}`;
      if (pagePrompt.ctaText) {
        systemContent += `\n\nPrimary CTA for this page: ${pagePrompt.ctaText}`;
      }
    }
  }

  // Language map (used in multiple sections below)
  const langMap: Record<string, string> = {
    fa: "فارسی (Persian)",
    en: "English",
    ar: "العربية (Arabic)",
    ru: "Русский (Russian)",
  };

  // 4. Lead generation instructions
  const leadTriggerText: Record<string, string> = {
    fa: "برای بررسی رایگان شرایط شما توسط متخصصین ما، فرم زیر را تکمیل کنید",
    en: "To get a free eligibility assessment from our experts, please fill in the form below",
    ar: "للحصول على تقييم مجاني من خبرائنا، يرجى ملء النموذج أدناه",
    ru: "Для бесплатной оценки вашей ситуации нашими экспертами, заполните форму ниже",
  };

  systemContent += `\n\n---\n## Lead Generation Instructions (CRITICAL)`;
  systemContent += `\nYour PRIMARY goal is to provide value AND guide users toward a free consultation.`;
  systemContent += `\n\n### When to trigger the lead form:`;
  systemContent += `\nAfter 2-3 exchanges where the user shows genuine interest (asks about cost, process, eligibility, timeline, documents), respond with your helpful answer AND end with a special signal.`;
  systemContent += `\n\n### How to trigger the lead form:`;
  systemContent += `\nAt the end of your response, when the user is ready, include this EXACT JSON on a NEW line:`;
  systemContent += `\n{"action":"open_lead_form","service":"<detected service interest>"}`;
  systemContent += `\n\n### Trigger conditions - trigger when user:`;
  systemContent += `\n- Asks "how much does it cost?" or similar cost questions`;
  systemContent += `\n- Asks "am I eligible?" or "do I qualify?"`;
  systemContent += `\n- Asks about timeline or required documents`;
  systemContent += `\n- Says they want to start or get started`;
  systemContent += `\n- Asks for consultation or meeting`;
  systemContent += `\n- Shows readiness: "I'm interested", "I want to apply"`;
  systemContent += `\n\n### Lead trigger phrase in ${langMap[language] || "this language"}:`;
  systemContent += `\n${leadTriggerText[language] || leadTriggerText.en}`;
  systemContent += `\n\n### IMPORTANT:`;
  systemContent += `\n- NEVER trigger the form on the very first message`;
  systemContent += `\n- Always give a useful answer BEFORE the trigger JSON`;
  systemContent += `\n- The "service" field should be the most relevant service from conversation`;
  systemContent += `\n- Valid services: Company Formation, Golden Visa, Property Investment, Oman Residency, Turkey Citizenship, Freelance Visa`;

  // 5. Add persona and instructions
  systemContent += `\n\n---\n## Important Instructions`;
  systemContent += `\n- Your name is: ${personaName}`;
  systemContent += `\n- If unsure about something, say so honestly and suggest consulting a specialist`;
  systemContent += `\n- Never make guarantees about legal/immigration outcomes`;
  systemContent += `\n- Every response should naturally build trust and move toward a consultation`;

  // 6. Language enforcement
  if (langMap[language]) {
    systemContent += `\n\n**CRITICAL: You MUST respond in ${langMap[language]} only.**`;
  }

  return systemContent;
}

export async function getAIResponse(
  messages: { role: "user" | "assistant" | "system"; content: string }[],
  providerOverride?: { apiKey: string; model: string; baseUrl?: string; temperature: number; maxTokens: number },
  language?: string,
  pageSlug?: string
) {
  // Get active provider from DB or use override
  const provider = providerOverride || await prisma.provider.findFirst({ where: { isActive: true } });
  if (!provider) throw new Error("No active AI provider configured");

  // Build system prompt from DB
  const systemContent = await buildSystemPrompt(language || "fa", pageSlug);

  const fullMessages = [
    { role: "system" as const, content: systemContent },
    ...messages.slice(-20),
  ];

  const openaiConfig: { apiKey: string; baseURL?: string } = { apiKey: provider.apiKey };
  if ("baseUrl" in provider && provider.baseUrl) {
    openaiConfig.baseURL = provider.baseUrl as string;
  }
  const openai = new OpenAI(openaiConfig);

  const completion = await openai.chat.completions.create({
    model: provider.model,
    messages: fullMessages,
    temperature: provider.temperature,
    max_tokens: provider.maxTokens,
  });

  const response = completion.choices[0]?.message?.content || "متاسفانه پاسخی دریافت نشد.";
  const tokensUsed = completion.usage?.total_tokens || 0;

  return { response, tokensUsed };
}
