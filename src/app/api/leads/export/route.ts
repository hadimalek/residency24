import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-helpers";

export async function GET(request: NextRequest) {
  const auth = await requireAdmin(request);
  if (auth instanceof NextResponse) return auth;

  try {
    const leads = await prisma.lead.findMany({
      orderBy: { createdAt: "desc" },
    });

    const csvHeader = "Name,Email,Phone,Nationality,Status,Created At\n";
    const csvRows = leads
      .map(
        (l) =>
          `"${l.name || ""}","${l.email || ""}","${l.phone || ""}","${l.nationality || ""}","${l.status}","${l.createdAt.toISOString()}"`
      )
      .join("\n");

    return new NextResponse(csvHeader + csvRows, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": "attachment; filename=leads.csv",
      },
    });
  } catch (error) {
    console.error("Lead export error:", error);
    return NextResponse.json(
      { error: "Failed to export leads" },
      { status: 500 }
    );
  }
}
