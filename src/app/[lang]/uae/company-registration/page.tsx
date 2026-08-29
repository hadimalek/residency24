import type { Lang } from "@/translations";
import type { Metadata } from "next";
import { LANGS, LANG_CONFIG } from "@/lib/seo";
import CompanyRegistrationClient from "./CompanyRegistrationClient";
import FaCompanyRegistrationClient from "./FaCompanyRegistrationClient";
import { IMG } from "./fa-content";

const BASE_URL = "https://residency24.com";

export async function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang: rawLang } = await params;
  const lang = (LANGS.includes(rawLang as Lang) ? rawLang : "en") as Lang;

  // Persian gets its own long-form page (see FaCompanyRegistrationClient), so it
  // also gets a title/description written for that content. Kept under 60 and
  // 160 characters so neither is truncated in results.
  const titles: Record<Lang, string> = {
    fa: 'ثبت شرکت در دبی و امارات ۲۰۲۶ | هزینه، مراحل و اقامت',
    en: 'Company Registration in Dubai 2026 | Mainland & Free Zone | Residency24',
    ar: 'تأسيس شركة في دبي 2026 | ملكية 100%، بدون كفيل، من 21,000 درهم',
    ru: 'Регистрация компании в Дубае 2026 | 100% владение | Residency24',
  };

  const descriptions: Record<Lang, string> = {
    fa: 'راهنمای کامل ثبت شرکت در دبی و امارات: هزینه از ۱۲٬۵۰۰ درهم، انواع لایسنس، ۱۲ مرحلهٔ ثبت، اقامت، مالیات و افتتاح حساب بانکی — ویژهٔ متقاضیان ایرانی.',
    en: 'Register in Dubai in 7-10 days. 100% foreign ownership, no sponsor. From AED 21,000. Free consult.',
    ar: 'تأسيس شركة في دبي خلال 7-10 أيام. ملكية أجنبية 100%، بدون كفيل. من 21,000 درهم.',
    ru: 'Зарегистрируйте компанию в Дубае за 7-10 дней. 100% иностранное владение. От AED 21,000.',
  };

  const localized = (l: Lang) => l === "en" ? `${BASE_URL}/uae/company-registration` : `${BASE_URL}/${l}/uae/company-registration`;
  const pageUrl = localized(lang);
  const alternates: Record<string, string> = {};
  for (const l of LANGS) {
    alternates[LANG_CONFIG[l].hreflang] = localized(l);
  }
  alternates["x-default"] = localized("en");

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
      // The Persian page leads with a real photograph; giving OG an image makes
      // the share card match what the page actually looks like.
      ...(lang === "fa" ? { images: [{ url: `${BASE_URL}${IMG.hero}` }] } : {}),
    },
    twitter: {
      card: lang === "fa" ? "summary_large_image" : "summary",
      title: titles[lang],
      description: descriptions[lang],
    },
  };
}

export default async function CompanyRegistrationPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: rawLang } = await params;
  const lang = (LANGS.includes(rawLang as Lang) ? rawLang : "en") as Lang;

  // Persian only: the long-form rebuild. The other three locales keep the
  // original short page until they get the same treatment.
  if (lang === "fa") return <FaCompanyRegistrationClient />;

  return <CompanyRegistrationClient lang={lang} />;
}
