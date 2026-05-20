import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-helpers";
import bcrypt from "bcryptjs";

// PATCH /api/admin/users/[id] — update user fields (ADMIN only)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin(request);
  if (auth instanceof NextResponse) return auth;

  const { id } = await params;
  const userId = parseInt(id);
  if (isNaN(userId)) {
    return NextResponse.json({ error: "شناسه نامعتبر است" }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { id: userId } });
  if (!existing) {
    return NextResponse.json({ error: "کاربر یافت نشد" }, { status: 404 });
  }

  // Prevent demoting the last ADMIN
  const { name, email, password, role } = await request.json();

  if (role && role !== existing.role && existing.role === "ADMIN") {
    const adminCount = await prisma.user.count({ where: { role: "ADMIN" } });
    if (adminCount <= 1) {
      return NextResponse.json(
        { error: "نمی‌توانید آخرین مدیر را تغییر نقش دهید" },
        { status: 400 }
      );
    }
  }

  if (role && !["ADMIN", "EDITOR"].includes(role)) {
    return NextResponse.json({ error: "نقش نامعتبر است" }, { status: 400 });
  }

  if (email && email !== existing.email) {
    const taken = await prisma.user.findUnique({ where: { email } });
    if (taken) {
      return NextResponse.json(
        { error: "این ایمیل قبلاً ثبت شده است" },
        { status: 409 }
      );
    }
  }

  if (password && password.length < 8) {
    return NextResponse.json(
      { error: "رمز عبور باید حداقل ۸ کاراکتر باشد" },
      { status: 400 }
    );
  }

  const data: Record<string, unknown> = {};
  if (name?.trim()) data.name = name.trim();
  if (email?.trim()) data.email = email.trim();
  if (role) data.role = role;
  if (password) data.passwordHash = await bcrypt.hash(password, 12);

  const user = await prisma.user.update({
    where: { id: userId },
    data,
    select: { id: true, email: true, name: true, role: true, createdAt: true },
  });

  return NextResponse.json({ user });
}

// DELETE /api/admin/users/[id] — delete user (ADMIN only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin(request);
  if (auth instanceof NextResponse) return auth;

  const { id } = await params;
  const userId = parseInt(id);
  if (isNaN(userId)) {
    return NextResponse.json({ error: "شناسه نامعتبر است" }, { status: 400 });
  }

  // Prevent deleting self
  if (auth.user.id === userId) {
    return NextResponse.json(
      { error: "نمی‌توانید حساب خود را حذف کنید" },
      { status: 400 }
    );
  }

  const existing = await prisma.user.findUnique({ where: { id: userId } });
  if (!existing) {
    return NextResponse.json({ error: "کاربر یافت نشد" }, { status: 404 });
  }

  // Prevent deleting last ADMIN
  if (existing.role === "ADMIN") {
    const adminCount = await prisma.user.count({ where: { role: "ADMIN" } });
    if (adminCount <= 1) {
      return NextResponse.json(
        { error: "نمی‌توانید آخرین مدیر را حذف کنید" },
        { status: 400 }
      );
    }
  }

  await prisma.user.delete({ where: { id: userId } });
  return NextResponse.json({ ok: true });
}
