import type { Lang } from "@/translations";
import type { Metadata } from "next";
import { LANGS, LANG_CONFIG } from "@/lib/seo";
import CompanyRegistrationClient from "../company-registration/CompanyRegistrationClient";
import RuRegisterCompanyClient from "./RuRegisterCompanyClient";

const BASE_URL = "https://residency24.com";

export async function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang: rawLang } = await params;
  const lang = (LANGS.includes(rawLang as Lang) ? rawLang : "en") as Lang;

  const titles: Record<Lang, string> = {
    fa: 'ثبت شرکت در دبی ۲۰۲۶ | مالکیت ۱۰۰٪، بدون کفیل | Residency24',
    en: 'Register a Company in the UAE | Free Zone & Mainland | Residency24',
    ar: 'تأسيس شركة في الإمارات | منطقة حرة وبر رئيسي | Residency24',
    ru: 'Открытие компании в ОАЭ для русскоязычных клиентов | Residency24',
  };

  const descriptions: Record<Lang, string> = {
    fa: 'ثبت شرکت در امارات: انتخاب فری‌زون یا مین‌لند، لایسنس، اقامت و حساب بانکی. مشاوره حرفه‌ای رزیدنسی۲۴.',
    en: 'Register a UAE company with full guidance: free zone vs mainland, license, residence visa, Emirates ID and corporate banking readiness.',
    ar: 'تأسيس شركة في الإمارات بدعم كامل: منطقة حرة أو بر رئيسي، رخصة، إقامة، إماراتية ID وتجهيز الحساب البنكي.',
    ru: 'Откройте компанию в ОАЭ с поддержкой на русском языке: free zone или mainland, лицензия, резидентская виза, Emirates ID, банковское сопровождение и подготовка документов.',
  };

  const pageUrl = `${BASE_URL}/${lang}/uae/register-company/`;
  const alternates: Record<string, string> = {};
  for (const l of LANGS) {
    alternates[LANG_CONFIG[l].hreflang] = `${BASE_URL}/${l}/uae/register-company/`;
  }
  alternates["x-default"] = `${BASE_URL}/en/uae/register-company/`;

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

export default async function RegisterCompanyPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: rawLang } = await params;
  const lang = (LANGS.includes(rawLang as Lang) ? rawLang : "en") as Lang;

  if (lang === "ru") return <RuRegisterCompanyClient />;
  return <CompanyRegistrationClient lang={lang} />;
}
