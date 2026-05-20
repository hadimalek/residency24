import { NextResponse, type NextRequest } from "next/server";

const NON_EN = ["fa", "ru", "ar"] as const;

const SKIP_PREFIXES = ["/_next", "/api", "/admin", "/assets"];
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

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 301 /en and /en/... -> / and /...
  if (pathname === "/en" || pathname === "/en/" || pathname.startsWith("/en/")) {
    const url = req.nextUrl.clone();
    if (pathname === "/en" || pathname === "/en/") {
      url.pathname = "/";
    } else {
      url.pathname = pathname.slice(3); // strip "/en"
    }
    return NextResponse.redirect(url, 301);
  }

  // Pass through non-English locale-prefixed paths unchanged
  for (const l of NON_EN) {
    if (pathname === `/${l}` || pathname.startsWith(`/${l}/`)) {
      return NextResponse.next();
    }
  }

  // Pass through framework, API, admin, files
  if (SKIP_PREFIXES.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }
  if (SKIP_FILES.includes(pathname)) {
    return NextResponse.next();
  }
  if (pathname.includes(".")) {
    return NextResponse.next();
  }

  // Internally rewrite root-style English URLs to the [lang]/en routes
  const url = req.nextUrl.clone();
  url.pathname = pathname === "/" ? "/en" : `/en${pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ["/((?!_next|api|admin|assets|.*\\..*).*)"],
};
