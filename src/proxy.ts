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

// `/api/content` is the programmatic, article-scoped Content API. It does NOT
// use the admin cookie — it authenticates per-request with a bearer API key
// (see src/lib/content-api/auth.ts). Listed here so the cookie gate lets it
// through to enforce its own auth.
const PUBLIC_API_PREFIXES = ["/api/auth", "/api/chat", "/api/cms", "/api/content"];

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
    const dataAB = new ArrayBuffer(dataBuf.byteLength);
    new Uint8Array(dataAB).set(dataBuf);
    return await crypto.subtle.verify("HMAC", key, sigBytes, dataAB);
  } catch {
    return false;
  }
}

// ── Legacy WordPress → new-site 301 map ─────────────────────────────────────
// The June migration left ~197 old WordPress URLs 404-ing (GSC "Not found"),
// which drags crawl budget and lost link equity. Redirect the ones with a real
// equivalent; genuinely-removed pages (wp-* internals, deleted posts) stay 404.

// Exact suffix (path after the locale prefix) → new suffix. "" = locale home.
const SUFFIX_REDIRECTS: Record<string, string> = {
  "oman/residency": "oman/residency-visa",
  "oman/register-company": "oman/company-registration",
  "oman/property-purchase": "oman/buy-property",
  "oman/golden-visa": "oman/residency-visa",
  "oman/investor-visa": "oman/residency-visa",
  "services/oman/residency": "oman/residency-visa",
  "visa/oman": "oman",
  "compare/uae-vs-oman": "compare/uae-vs-oman-vs-turkey",
  "international-company-registration": "uae/company-registration",
  "property-purchase": "uae/buy-property",
  "residence": "uae",
  "team": "about",
  "trust": "about",
  "ai-advisor": "",
  "tools/visa-eligibility-checker": "contact",
  "tools/cost-calculator": "contact",
  "tools/document-checklist-generator": "contact",
};

// Old WP taxonomy/landing slugs that now 404 → send to the blog index.
const OLD_CATS = new Set([
  "study-immigration-guide", "migration-destinations", "country-guides", "immigration",
  "investment-guide", "property-buying-guide", "travel-and-entertainment",
  "work-immigration-guide", "immigration-documents",
]);
const CAT_LANDINGS = new Set([
  "immigration", "immigration-documents", "migration-destinations", "country-guides",
  "work-immigration-guide", "travel-and-entertainment", "investment-guide",
  "property-buying-guide", "top-banks-in-uae",
]);
// Renamed blog posts (old slug → live slug). Keep only high-confidence mappings.
const BLOG_SLUG_REDIRECTS: Record<string, string> = {
  "dubai-stock-shoes": "dubai-stock-shoes-market",
};

function withLocale(locale: string, suffix: string): string {
  if (!suffix) return locale ? `/${locale}` : "/";
  return locale ? `/${locale}/${suffix}` : `/${suffix}`;
}

/** Returns the 301 destination path for a legacy URL, or null to pass through. */
function legacyRedirect(pathname: string): string | null {
  const p = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
  const segs = p.split("/").filter(Boolean);
  const hasLocale = segs.length > 0 && (segs[0] === "fa" || segs[0] === "ar" || segs[0] === "ru");
  const locale = hasLocale ? segs[0] : "";
  const rest = hasLocale ? segs.slice(1) : segs;
  const suffix = rest.join("/");

  // WP RSS feeds → the post/page itself
  if (rest.length >= 3 && rest[0] === "blog" && rest[rest.length - 1] === "feed") {
    return withLocale(locale, `blog/${rest.slice(1, -1).join("/")}`);
  }
  if (rest.length === 1 && rest[0] === "feed") return withLocale(locale, "");
  // Blog pagination → blog index
  if (rest.length === 3 && rest[0] === "blog" && rest[1] === "page" && /^\d+$/.test(rest[2])) {
    return withLocale(locale, "blog");
  }
  // Category pagination → category base (or blog for old cats)
  if (rest.length === 5 && rest[0] === "blog" && rest[1] === "category" && rest[3] === "page" && /^\d+$/.test(rest[4])) {
    return OLD_CATS.has(rest[2]) ? withLocale(locale, "blog") : withLocale(locale, `blog/category/${rest[2]}`);
  }
  // Old WP blog categories → blog index
  if (rest.length === 3 && rest[0] === "blog" && rest[1] === "category" && OLD_CATS.has(rest[2])) {
    return withLocale(locale, "blog");
  }
  // Author archives → blog index
  if (rest[0] === "author") return withLocale(locale, "blog");
  // Old WP landing pages (single segment, and their pagination) → blog index
  if (rest.length === 1 && CAT_LANDINGS.has(rest[0])) return withLocale(locale, "blog");
  if (rest.length === 3 && rest[1] === "page" && /^\d+$/.test(rest[2]) && CAT_LANDINGS.has(rest[0])) {
    return withLocale(locale, "blog");
  }
  // Renamed blog posts
  if (rest.length === 2 && rest[0] === "blog" && BLOG_SLUG_REDIRECTS[rest[1]]) {
    return withLocale(locale, `blog/${BLOG_SLUG_REDIRECTS[rest[1]]}`);
  }
  // Exact service/page moves
  if (suffix in SUFFIX_REDIRECTS) return withLocale(locale, SUFFIX_REDIRECTS[suffix]);
  return null;
}

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Serve uploads via API route — Next.js standalone doesn't serve files
  // added to public/ after build time.
  if (pathname.startsWith("/uploads/")) {
    const m = pathname.match(/^(.*)-\d+x\d+(\.[^./]+)$/);
    if (m) {
      const url = req.nextUrl.clone();
      url.pathname = m[1] + m[2];
      return NextResponse.redirect(url, 301);
    }
    const url = req.nextUrl.clone();
    url.pathname = `/api/serve${pathname}`;
    return NextResponse.rewrite(url);
  }

  // Legacy WordPress URLs → 301 to the new-site equivalent (before /en handling
  // and the catch-all rewrite so root-level legacy paths are caught too).
  const legacy = legacyRedirect(pathname);
  if (legacy && legacy !== pathname) {
    const url = req.nextUrl.clone();
    url.pathname = legacy;
    url.search = "";
    return NextResponse.redirect(url, 301);
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
  matcher: [
    "/uploads/:path*",
    "/((?!_next|assets|.*\\..*).*)"],
};
