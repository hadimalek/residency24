import type { Lang } from "@/translations";
import type { Metadata } from "next";
import { LANGS, LANG_CONFIG } from "@/lib/seo";
import CompanyRegistrationClient from "./CompanyRegistrationClient";

const BASE_URL = "https://residency24.com";

export async function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang: rawLang } = await params;
  const lang = (LANGS.includes(rawLang as Lang) ? rawLang : "en") as Lang;

  const titles: Record<Lang, string> = {
    fa: 'ثبت شرکت در دبی ۲۰۲۶ | مالکیت ۱۰۰٪، بدون کفیل، از ۲۱,۰۰۰ درهم',
    en: 'Company Registration in Dubai 2026 | Mainland & Free Zone | Residency24',
    ar: 'تأسيس شركة في دبي 2026 | ملكية 100%، بدون كفيل، من 21,000 درهم',
    ru: 'Регистрация компании в Дубае 2026 | 100% владение | Residency24',
  };

  const descriptions: Record<Lang, string> = {
    fa: 'ثبت شرکت دبی در ۷-۱۰ روز. مالکیت ۱۰۰٪، بدون کفیل. Mainland و Free Zone از ۲۱,۰۰۰ درهم.',
    en: 'Register in Dubai in 7-10 days. 100% foreign ownership, no sponsor. From AED 21,000. Free consult.',
    ar: 'تأسيس شركة في دبي خلال 7-10 أيام. ملكية أجنبية 100%، بدون كفيل. من 21,000 درهم.',
    ru: 'Зарегистрируйте компанию в Дубае за 7-10 дней. 100% иностранное владение. От AED 21,000.',
  };

  const pageUrl = `${BASE_URL}/${lang}/uae/company-registration/`;
  const alternates: Record<string, string> = {};
  for (const l of LANGS) {
    alternates[LANG_CONFIG[l].hreflang] = `${BASE_URL}/${l}/uae/company-registration/`;
  }
  alternates["x-default"] = `${BASE_URL}/en/uae/company-registration/`;

  return {
    title: titles[lang],
    description: descriptions[lang],
    alternates: {
      canonical: pageUrl,
      languages: alternates,
    },
    openGraph: {
      type: "website",
      url: pageUrl,
      title: titles[lang],
      description: descriptions[lang],
      locale: LANG_CONFIG[lang].locale,
      siteName: "Residency24",
    },
  };
}

export default async function CompanyRegistrationPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: rawLang } = await params;
  const lang = (LANGS.includes(rawLang as Lang) ? rawLang : "en") as Lang;

  return <CompanyRegistrationClient lang={lang} />;
}
