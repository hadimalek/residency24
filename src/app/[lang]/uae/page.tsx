import type { Lang } from "@/translations";
import type { Metadata } from "next";
import { LANGS, LANG_CONFIG } from "@/lib/seo";
import UAEPageClient from "./UAEPageClient";

const BASE_URL = "https://residency24.com";

const SEO_UAE: Record<Lang, { title: string; description: string }> = {
  fa: {
    title: "خدمات امارات | گلدن ویزا، ثبت شرکت و خرید ملک دبی — رزیدنسی۲۴",
    description: "خدمات کامل اقامت امارات: گلدن ویزا ۱۰ ساله، ثبت شرکت دبی از ۱۱,۹۰۰ درهم، خرید ملک و ویزای توریستی. مشاوره رایگان.",
  },
  en: {
    title: "UAE Services | Golden Visa, Company Setup & Property — Residency24",
    description: "Complete UAE residency services: 10-year Golden Visa, Dubai company registration from AED 11,900, property investment & tourist visa. Free consultation.",
  },
  ar: {
    title: "خدمات الإمارات | الإقامة الذهبية وتأسيس الشركات والعقارات — Residency24",
    description: "خدمات إقامة شاملة في الإمارات: إقامة ذهبية ١٠ سنوات، تأسيس شركات دبي من ١١,٩٠٠ درهم، استثمار عقاري وتأشيرة سياحية. استشارة مجانية.",
  },
  ru: {
    title: "Услуги ОАЭ | Золотая виза, регистрация компании и недвижимость — Residency24",
    description: "Полный спектр услуг по резидентству в ОАЭ: Золотая виза на 10 лет, регистрация компании от 11 900 AED, инвестиции в недвижимость и туристическая виза.",
  },
};

export async function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang: rawLang } = await params;
  const lang = (LANGS.includes(rawLang as Lang) ? rawLang : "en") as Lang;
  const seo = SEO_UAE[lang];
  const pageUrl = `${BASE_URL}/${lang}/uae/`;

  const alternates: Record<string, string> = {};
  for (const l of LANGS) {
    alternates[LANG_CONFIG[l].hreflang] = `${BASE_URL}/${l}/uae/`;
  }
  alternates["x-default"] = `${BASE_URL}/en/uae/`;

  return {
    title: seo.title,
    description: seo.description,
    alternates: {
      canonical: pageUrl,
      languages: alternates,
    },
    openGraph: {
      type: "website",
      url: pageUrl,
      title: seo.title,
      description: seo.description,
      images: [{ url: `${BASE_URL}/assets/og-image-${lang}.jpg`, width: 1200, height: 630 }],
      locale: LANG_CONFIG[lang].locale,
      siteName: "Residency24",
    },
  };
}

export default async function UAEPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: rawLang } = await params;
  const lang = (LANGS.includes(rawLang as Lang) ? rawLang : "en") as Lang;

  return <UAEPageClient lang={lang} />;
}
