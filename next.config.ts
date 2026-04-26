import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  // output: "standalone", // فقط برای Docker — برای dev/npm start کامنت بشه

  // NOTE (Phase A): the `/ → /en/` redirect is preserved because the App
  // Router still uses the `[lang]` segment (English at /en/, others at
  // /{locale}/). Removing this redirect must happen together with the
  // [lang] → [locale] restructure and proxy.ts creation in Phase A.5.
  // See BLOCKED_QUESTIONS.md (Q1) and docs/migration/20_I18N_CURRENT_STATE.md.
  async redirects() {
    return [
      {
        source: "/",
        destination: "/en/",
        permanent: false,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
