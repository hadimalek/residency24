// Permanent redirect from the legacy static path to the new dynamic per-lang
// sitemap. Keeps any backlinks / Search Console entries pointing at the old
// URL valid without serving stale XML.
export function GET() {
  return Response.redirect("https://residency24.com/sitemap/en.xml", 301);
}
