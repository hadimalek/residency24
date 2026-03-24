import OpenAI from "openai";
import { prisma } from "./db";
import { SYSTEM_PROMPT } from "./knowledge";

export async function getAIResponse(
  messages: { role: "user" | "assistant" | "system"; content: string }[],
  providerOverride?: { apiKey: string; model: string; temperature: number; maxTokens: number }
) {
  // Get active provider from DB or use override
  const provider = providerOverride || await prisma.provider.findFirst({ where: { isActive: true } });
  if (!provider) throw new Error("No active AI provider configured");

  // Get active system prompt from DB, fallback to default
  const activePrompt = await prisma.prompt.findFirst({ where: { isActive: true, type: "SYSTEM" } });
  const knowledgePrompts = await prisma.prompt.findMany({ where: { isActive: true, type: "KNOWLEDGE" } });

  let systemContent = activePrompt?.content || SYSTEM_PROMPT;
  if (knowledgePrompts.length > 0) {
    systemContent += "\n\n" + knowledgePrompts.map(k => k.content).join("\n\n");
  }

  const fullMessages = [
    { role: "system" as const, content: systemContent },
    ...messages.slice(-20), // Keep last 20 messages
  ];

  const openai = new OpenAI({ apiKey: provider.apiKey });

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
