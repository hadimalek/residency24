import type { Metadata } from "next";
import type { Lang } from "@/translations";
import translations from "@/translations";
import { LANGS, LANG_CONFIG, getPageUrl } from "@/lib/seo";

export async function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang: rawLang } = await params;
  const lang = (LANGS.includes(rawLang as Lang) ? rawLang : "en") as Lang;
  const t = translations[lang].uae_page;
  const config = LANG_CONFIG[lang];
  const pageUrl = `${getPageUrl(lang).replace(/\/$/, "")}/uae/`;

  const alternates: Record<string, string> = {};
  for (const l of LANGS) {
    alternates[LANG_CONFIG[l].hreflang] = `${getPageUrl(l).replace(/\/$/, "")}/uae/`;
  }
  alternates["x-default"] = `${getPageUrl("en").replace(/\/$/, "")}/uae/`;

  return {
    title: t.meta_title,
    description: t.meta_desc,
    alternates: {
      canonical: pageUrl,
      languages: alternates,
    },
    openGraph: {
      type: "website",
      url: pageUrl,
      title: t.meta_title,
      description: t.meta_desc,
      locale: config.locale,
      siteName: "Residency24",
    },
  };
}

export default function UAELayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
