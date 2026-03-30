import type { Metadata } from "next";
import type { Lang } from "@/translations";
import translations from "@/translations";
import { LANGS, LANG_CONFIG, getPageUrl } from "@/lib/seo";
import CompanyRegistrationUAE from "./CompanyRegistrationUAE";

const BASE = "https://residency24.com";

export async function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang: rawLang } = await params;
  const lang = (LANGS.includes(rawLang as Lang) ? rawLang : "en") as Lang;
  const cr = translations[lang].companyRegistrationUAE;
  const pageUrl = `${BASE}/${lang}/uae/company-registration/`;

  const alternates: Record<string, string> = {};
  for (const l of LANGS) {
    alternates[LANG_CONFIG[l].hreflang] = `${BASE}/${l}/uae/company-registration/`;
  }
  alternates["x-default"] = `${BASE}/en/uae/company-registration/`;

  return {
    title: cr.seo.title,
    description: cr.seo.description,
    alternates: {
      canonical: pageUrl,
      languages: alternates,
    },
    openGraph: {
      type: "website",
      url: pageUrl,
      title: cr.seo.title,
      description: cr.seo.description,
      locale: LANG_CONFIG[lang].locale,
      siteName: "Residency24",
    },
  };
}

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: rawLang } = await params;
  const lang = (LANGS.includes(rawLang as Lang) ? rawLang : "en") as Lang;

  return <CompanyRegistrationUAE />;
}
