import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

/**
 * Lead capture endpoint for standalone Google Ads landing pages.
 * Persists a Lead without requiring a chat session. Language is encoded in
 * `sourcePage` (the Lead model has no `lang` column).
 */
export async function POST(req: NextRequest) {
  try {
    const { name, phone, sourcePage, website } = await req.json();

    // Honeypot: bots fill the hidden `website` field. Pretend success, skip DB.
    if (website) return NextResponse.json({ ok: true });

    if (typeof name !== "string" || typeof phone !== "string") {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const cleanName = name.trim().slice(0, 255);
    const cleanPhone = phone.trim().slice(0, 32);

    if (cleanName.length < 2 || cleanPhone.replace(/\D/g, "").length < 6) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const lead = await prisma.lead.create({
      data: {
        name: cleanName,
        phone: cleanPhone,
        status: "NEW",
        source: "ads_landing",
        sourcePage:
          typeof sourcePage === "string" && sourcePage ? sourcePage.slice(0, 512) : "/uae-life",
      },
    });

    return NextResponse.json({ ok: true, id: lead.id });
  } catch (error) {
    console.error("landing-lead error:", error);
    return NextResponse.json({ error: "Failed to save lead" }, { status: 500 });
  }
}
