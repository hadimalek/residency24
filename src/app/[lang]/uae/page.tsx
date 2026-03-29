import type { Metadata } from "next";
import type { Lang } from "@/translations";
import { LANGS, LANG_CONFIG } from "@/lib/seo";
import UAEHubClient from "./UAEHubClient";

const BASE_URL = "https://residency24.com";

const UAE_SEO: Record<Lang, { title: string; description: string; h1: string }> = {
  fa: {
    title: "مهاجرت به امارات ۲۰۲۶ | اقامت، ثبت شرکت و خرید ملک دبی",
    description: "راهنمای کامل مهاجرت به امارات — گلدن ویزا از ۲ میلیون درهم، ثبت شرکت بدون کفیل، خرید ملک با اقامت. ۵۰۰۰+ پرونده موفق. مشاوره رایگان رزیدنسی۲۴.",
    h1: "مهاجرت به امارات — گلدن ویزا، ثبت شرکت و سرمایه‌گذاری در دبی ۲۰۲۶",
  },
  en: {
    title: "UAE Residency & Investment 2026 | Residency24 Dubai",
    description: "Golden Visa, company registration & property investment in Dubai. 5,000+ successful cases since 2018. Expert multilingual team. 100% foreign ownership. Free consultation.",
    h1: "Live, Invest & Build in Dubai — Your 10-Year Tax-Free Future",
  },
  ar: {
    title: "الإقامة في الإمارات 2026 | إقامة ذهبية وتأسيس شركة ودبي",
    description: "دليلك الشامل للإقامة في الإمارات — إقامة ذهبية من 2 مليون درهم، تأسيس شركة بملكية كاملة، شراء عقار بإقامة. رزيدنسي24، أكثر من 5000 حالة ناجحة.",
    h1: "الهجرة إلى الإمارات — الإقامة الذهبية وتأسيس شركة والاستثمار في دبي 2026",
  },
  ru: {
    title: "ВНЖ в ОАЭ 2026 | Золотая виза, регистрация компании, недвижимость",
    description: "Полное руководство по ВНЖ в ОАЭ — золотая виза от 2 млн дирхам, регистрация компании без спонсора, покупка недвижимости с ВНЖ. 5000+ успешных кейсов.",
    h1: "ВНЖ в ОАЭ — Золотая виза, регистрация компании и инвестиции в Дубае 2026",
  },
};

function getUaePageUrl(lang: Lang) {
  return `${BASE_URL}/${lang}/uae/`;
}

export async function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang: rawLang } = await params;
  const lang = (LANGS.includes(rawLang as Lang) ? rawLang : "en") as Lang;
  const seo = UAE_SEO[lang];
  const config = LANG_CONFIG[lang];
  const pageUrl = getUaePageUrl(lang);

  const alternates: Record<string, string> = {};
  for (const l of LANGS) {
    alternates[LANG_CONFIG[l].hreflang] = getUaePageUrl(l);
  }
  alternates["x-default"] = getUaePageUrl("en");

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
      locale: config.locale,
      alternateLocale: LANGS.filter((l) => l !== lang).map((l) => LANG_CONFIG[l].locale),
      siteName: "Residency24",
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: seo.description,
      images: [`${BASE_URL}/assets/og-image-${lang}.jpg`],
    },
    icons: { icon: "/favicon.svg" },
  };
}

export default async function UAEHubPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: rawLang } = await params;
  const lang = (LANGS.includes(rawLang as Lang) ? rawLang : "en") as Lang;
  const h1 = UAE_SEO[lang].h1;

  return <UAEHubClient h1={h1} />;
}
