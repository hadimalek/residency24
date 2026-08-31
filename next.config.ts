import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  output: "standalone",

  // Next normalises the trailing slash before the proxy runs, so a legacy
  // WordPress URL (they all end in "/") was redirected twice: once to strip the
  // slash, then again by the legacy map. src/proxy.ts now does both in one hop.
  skipTrailingSlashRedirect: true,

  // English is the default locale and lives on root paths (no /en prefix).
  // src/middleware.ts internally rewrites root URLs to /en/... and
  // 301-redirects /en/... to the root equivalents.
};

export default withNextIntl(nextConfig);
