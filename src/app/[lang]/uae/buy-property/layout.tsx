import type { Metadata } from "next";
import type { Lang } from "@/translations";
import translations from "@/translations";
import { LANGS, LANG_CONFIG } from "@/lib/seo";

const BASE_URL = "https://residency24.com";

function getPageUrl(lang: Lang) {
  return lang === "en" ? `${BASE_URL}/uae/buy-property/` : `${BASE_URL}/${lang}/uae/buy-property/`;
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang: rawLang } = await params;
  const lang = (LANGS.includes(rawLang as Lang) ? rawLang : "en") as Lang;
  const bp = translations[lang].bp;
  const config = LANG_CONFIG[lang];
  const pageUrl = getPageUrl(lang);

  const alternates: Record<string, string> = {};
  for (const l of LANGS) {
    alternates[LANG_CONFIG[l].hreflang] = getPageUrl(l);
  }
  alternates["x-default"] = getPageUrl("en");

  return {
    title: bp.seo_title,
    description: bp.seo_desc,
    alternates: {
      canonical: pageUrl,
      languages: alternates,
    },
    openGraph: {
      type: "website",
      url: pageUrl,
      title: bp.seo_title,
      description: bp.seo_desc,
      locale: config.locale,
      alternateLocale: LANGS.filter((l) => l !== lang).map((l) => LANG_CONFIG[l].locale),
      siteName: "Residency24",
    },
    twitter: {
      card: "summary_large_image",
      title: bp.seo_title,
      description: bp.seo_desc,
    },
  };
}

export default async function BuyPropertyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
