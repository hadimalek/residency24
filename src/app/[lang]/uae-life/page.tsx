import type { Metadata } from "next";
import type { Lang } from "@/translations";
import translations from "@/translations";
import { LANGS, LANG_CONFIG, getPageUrl } from "@/lib/seo";
import UaeLifeClient from "./UaeLifeClient";

export async function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang: rawLang } = await params;
  const lang = (LANGS.includes(rawLang as Lang) ? rawLang : "en") as Lang;
  const meta = translations[lang].uaeLife.meta;
  const config = LANG_CONFIG[lang];
  const pageUrl = getPageUrl(lang, "uae-life/");

  const alternates: Record<string, string> = {};
  for (const l of LANGS) {
    alternates[LANG_CONFIG[l].hreflang] = getPageUrl(l, "uae-life/");
  }
  alternates["x-default"] = getPageUrl("en", "uae-life/");

  return {
    title: meta.title,
    description: meta.description,
    // Ads landing page: keep it out of the index but let link equity flow.
    robots: { index: false, follow: true },
    alternates: {
      canonical: pageUrl,
      languages: alternates,
    },
    openGraph: {
      type: "website",
      url: pageUrl,
      title: meta.title,
      description: meta.description,
      locale: config.locale,
      alternateLocale: LANGS.filter((l) => l !== lang).map((l) => LANG_CONFIG[l].locale),
      siteName: "Residency24",
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
    },
    icons: { icon: "/favicon.png" },
  };
}

export default function UaeLifePage() {
  return <UaeLifeClient />;
}
