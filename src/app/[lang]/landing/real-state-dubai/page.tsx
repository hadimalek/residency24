import type { Metadata } from "next";
import type { Lang } from "@/translations";
import translations from "@/translations";
import { LANGS, LANG_CONFIG, getPageUrl } from "@/lib/seo";
import RealEstateDubaiPageClient from "./RealEstateDubaiPageClient";

const PATH = "landing/real-state-dubai/";

export async function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang: rawLang } = await params;
  const lang = (LANGS.includes(rawLang as Lang) ? rawLang : "en") as Lang;
  const meta = translations[lang].realEstateDubai.meta;
  const config = LANG_CONFIG[lang];
  const pageUrl = getPageUrl(lang, PATH);

  const alternates: Record<string, string> = {};
  for (const l of LANGS) {
    alternates[LANG_CONFIG[l].hreflang] = getPageUrl(l, PATH);
  }
  alternates["x-default"] = getPageUrl("en", PATH);

  return {
    title: meta.title,
    description: meta.description,
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

export default function RealEstateDubaiPage() {
  return <RealEstateDubaiPageClient />;
}
