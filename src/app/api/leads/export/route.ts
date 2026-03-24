import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
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
