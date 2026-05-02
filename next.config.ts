import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  // output: "standalone", // فقط برای Docker — برای dev/npm start کامنت بشه

  // English is the default locale and lives on root paths (no /en prefix).
  // src/middleware.ts internally rewrites root URLs to /en/... and
  // 301-redirects /en/... to the root equivalents.
};

export default withNextIntl(nextConfig);
