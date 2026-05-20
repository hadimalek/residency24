import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export interface AuthUser {
  id: number;
  email: string;
  name: string;
  role: string;
}

export async function getCurrentUser(request: NextRequest): Promise<AuthUser | null> {
  const token = request.cookies.get("auth-token")?.value;
  if (!token) return null;

  try {
    const decoded = Buffer.from(token, "base64").toString("utf-8");
    const [userIdStr] = decoded.split(":");
    const userId = parseInt(userIdStr);
    if (isNaN(userId)) return null;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return null;

    return { id: user.id, email: user.email, name: user.name, role: user.role };
  } catch {
    return null;
  }
}

export async function requireAdmin(
  request: NextRequest
): Promise<{ user: AuthUser } | NextResponse> {
  const user = await getCurrentUser(request);
  if (!user) {
    return NextResponse.json({ error: "احراز هویت نشده" }, { status: 401 });
  }
  if (user.role !== "ADMIN") {
    return NextResponse.json({ error: "دسترسی مجاز نیست" }, { status: 403 });
  }
  return { user };
}

export async function requireAuth(
  request: NextRequest
): Promise<{ user: AuthUser } | NextResponse> {
  const user = await getCurrentUser(request);
  if (!user) {
    return NextResponse.json({ error: "احراز هویت نشده" }, { status: 401 });
  }
  return { user };
}
