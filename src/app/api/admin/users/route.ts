import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-helpers";
import bcrypt from "bcryptjs";

// GET /api/admin/users — list all users (ADMIN only)
export async function GET(request: NextRequest) {
  const auth = await requireAdmin(request);
  if (auth instanceof NextResponse) return auth;

  const users = await prisma.user.findMany({
    select: { id: true, email: true, name: true, role: true, createdAt: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ users });
}

// POST /api/admin/users — create new user (ADMIN only)
export async function POST(request: NextRequest) {
  const auth = await requireAdmin(request);
  if (auth instanceof NextResponse) return auth;

  const { name, email, password, role } = await request.json();

  if (!name?.trim() || !email?.trim() || !password?.trim()) {
    return NextResponse.json(
      { error: "نام، ایمیل و رمز عبور الزامی است" },
      { status: 400 }
    );
  }

  if (!["ADMIN", "EDITOR"].includes(role)) {
    return NextResponse.json({ error: "نقش نامعتبر است" }, { status: 400 });
  }

  if (password.length < 8) {
    return NextResponse.json(
      { error: "رمز عبور باید حداقل ۸ کاراکتر باشد" },
      { status: 400 }
    );
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json(
      { error: "این ایمیل قبلاً ثبت شده است" },
      { status: 409 }
    );
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({
    data: { name, email, passwordHash, role },
    select: { id: true, email: true, name: true, role: true, createdAt: true },
  });

  return NextResponse.json({ user }, { status: 201 });
}
