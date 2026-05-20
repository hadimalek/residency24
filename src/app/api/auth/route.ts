import { NextRequest, NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";

const COOKIE = "auth-token";
const MAX_AGE_DAYS = 7;
const MAX_AGE_MS = MAX_AGE_DAYS * 24 * 60 * 60 * 1000;

function getSecret(): string {
  const s = process.env.AUTH_SECRET;
  if (!s || s.length < 16 || s === "GENERATE_WITH_npx_auth_secret") {
    throw new Error("AUTH_SECRET env var is missing or placeholder");
  }
  return s;
}

function b64urlEncode(str: string): string {
  return Buffer.from(str, "utf-8")
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function b64urlDecode(str: string): string {
  const padded = str.replace(/-/g, "+").replace(/_/g, "/");
  return Buffer.from(padded, "base64").toString("utf-8");
}

function signPayload(payload: string): string {
  const sigBuf = createHmac("sha256", getSecret()).update(payload).digest();
  return sigBuf
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function makeToken(userId: number, email: string): string {
  const payload = `${userId}:${email}:${Date.now()}`;
  const sig = signPayload(payload);
  return `${b64urlEncode(payload)}.${sig}`;
}

function verifyToken(
  token: string | undefined
): { userId: number; email: string; iat: number } | null {
  if (!token) return null;
  const dot = token.indexOf(".");
  if (dot <= 0) return null;
  const payloadB64 = token.slice(0, dot);
  const sigGiven = token.slice(dot + 1);
  let payload: string;
  try {
    payload = b64urlDecode(payloadB64);
  } catch {
    return null;
  }
  const sigExpected = signPayload(payload);
  const a = Buffer.from(sigGiven);
  const b = Buffer.from(sigExpected);
  if (a.length !== b.length) return null;
  if (!timingSafeEqual(a, b)) return null;

  const parts = payload.split(":");
  if (parts.length < 3) return null;
  const userId = parseInt(parts[0], 10);
  const iat = parseInt(parts[parts.length - 1], 10);
  const email = parts.slice(1, -1).join(":");
  if (!Number.isFinite(userId) || userId <= 0) return null;
  if (!Number.isFinite(iat) || iat <= 0) return null;
  const age = Date.now() - iat;
  if (age < 0 || age > MAX_AGE_MS) return null;
  return { userId, email, iat };
}

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const token = makeToken(user.id, user.email);

    const response = NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

    response.cookies.set(COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: MAX_AGE_DAYS * 24 * 60 * 60,
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Failed to authenticate" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get(COOKIE)?.value;
    const claims = verifyToken(token);
    if (!claims) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({ where: { id: claims.userId } });
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Auth check error:", error);
    return NextResponse.json(
      { error: "Failed to authenticate" },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return response;
}
