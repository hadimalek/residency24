import { NextResponse, type NextRequest } from "next/server";

const NON_EN = ["fa", "ru", "ar"] as const;

const SKIP_FILES = [
  "/favicon.png",
  "/favicon.ico",
  "/robots.txt",
  "/sitemap.xml",
  "/sitemap-en.xml",
  "/sitemap-fa.xml",
  "/sitemap-ar.xml",
  "/sitemap-ru.xml",
];

const ADMIN_API_PREFIXES = [
  "/api/admin",
  "/api/dashboard",
  "/api/leads",
  "/api/pages",
  "/api/prompts",
  "/api/providers",
  "/api/sessions",
];

const PUBLIC_API_PREFIXES = ["/api/auth", "/api/chat", "/api/cms"];

const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

function b64urlDecodeToBuffer(b64url: string): ArrayBuffer | null {
  try {
    const padded = b64url.replace(/-/g, "+").replace(/_/g, "/");
    const binary = atob(padded);
    const buf = new ArrayBuffer(binary.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i < binary.length; i++) view[i] = binary.charCodeAt(i);
    return buf;
  } catch {
    return null;
  }
}

function b64urlDecodeToString(b64url: string): string | null {
  try {
    const padded = b64url.replace(/-/g, "+").replace(/_/g, "/");
    return atob(padded);
  } catch {
    return null;
  }
}

let cryptoKeyPromise: Promise<CryptoKey> | null = null;
function getKey(secret: string): Promise<CryptoKey> {
  if (!cryptoKeyPromise) {
    cryptoKeyPromise = crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"]
    );
  }
  return cryptoKeyPromise;
}

async function verifyToken(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 16 || secret === "GENERATE_WITH_npx_auth_secret") {
    // Fail closed: if secret is unset, no token is valid.
    return false;
  }
  const dot = token.indexOf(".");
  if (dot <= 0) return false;
  const payloadB64 = token.slice(0, dot);
  const sigB64 = token.slice(dot + 1);

  const payload = b64urlDecodeToString(payloadB64);
  const sigBytes = b64urlDecodeToBuffer(sigB64);
  if (payload == null || sigBytes == null) return false;

  const parts = payload.split(":");
  if (parts.length < 3) return false;
  const userId = parseInt(parts[0], 10);
  const iat = parseInt(parts[parts.length - 1], 10);
  if (!Number.isFinite(userId) || userId <= 0) return false;
  if (!Number.isFinite(iat) || iat <= 0) return false;
  const age = Date.now() - iat;
  if (age < 0 || age > MAX_AGE_MS) return false;

  try {
    const key = await getKey(secret);
    const dataBuf = new TextEncoder().encode(payload);
    // Copy to a fresh ArrayBuffer so the type is ArrayBuffer (not SharedArrayBuffer)
    const dataAB = new ArrayBuffer(dataBuf.byteLength);
    new Uint8Array(dataAB).set(dataBuf);
    return await crypto.subtle.verify("HMAC", key, sigBytes, dataAB);
  } catch {
    return false;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Strip WordPress-style thumbnail suffixes: /uploads/…-768x481.webp → /uploads/….webp
  if (pathname.startsWith("/uploads/")) {
    const m = pathname.match(/^(.*)-\d+x\d+(\.[^./]+)$/);
    if (m) {
      const url = req.nextUrl.clone();
      url.pathname = m[1] + m[2];
      return NextResponse.redirect(url, 301);
    }
  }

  if (pathname.startsWith("/admin")) {
    const isLogin =
      pathname === "/admin/login" || pathname.startsWith("/admin/login/");
    if (isLogin) {
      return NextResponse.next();
    }
    const token = req.cookies.get("auth-token")?.value;
    const ok = await verifyToken(token);
    if (!ok) {
      const url = req.nextUrl.clone();
      url.pathname = "/admin/login";
      if (pathname !== "/admin") {
        url.searchParams.set("redirect", pathname);
      }
      const resp = NextResponse.redirect(url);
      // Clear caches so the redirect isn't served from CDN.
      resp.headers.set("Cache-Control", "no-store, must-revalidate");
      return resp;
    }
    const resp = NextResponse.next();
    resp.headers.set("Cache-Control", "no-store, must-revalidate");
    return resp;
  }

  if (pathname.startsWith("/api/")) {
    if (PUBLIC_API_PREFIXES.some((p) => pathname.startsWith(p))) {
      return NextResponse.next();
    }
    if (ADMIN_API_PREFIXES.some((p) => pathname.startsWith(p))) {
      const token = req.cookies.get("auth-token")?.value;
      const ok = await verifyToken(token);
      if (!ok) {
        return NextResponse.json(
          { error: "Unauthorized" },
          { status: 401, headers: { "Cache-Control": "no-store" } }
        );
      }
    }
    return NextResponse.next();
  }

  if (pathname === "/en" || pathname === "/en/" || pathname.startsWith("/en/")) {
    const url = req.nextUrl.clone();
    if (pathname === "/en" || pathname === "/en/") {
      url.pathname = "/";
    } else {
      url.pathname = pathname.slice(3);
    }
    return NextResponse.redirect(url, 301);
  }

  for (const l of NON_EN) {
    if (pathname === `/${l}` || pathname.startsWith(`/${l}/`)) {
      return NextResponse.next();
    }
  }

  if (pathname.startsWith("/_next") || pathname.startsWith("/assets")) {
    return NextResponse.next();
  }
  if (SKIP_FILES.includes(pathname)) {
    return NextResponse.next();
  }
  if (pathname.includes(".")) {
    return NextResponse.next();
  }

  const url = req.nextUrl.clone();
  url.pathname = pathname === "/" ? "/en" : `/en${pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ["/((?!_next|assets|.*\\..*).*)"],
};
