import type { Lang } from "@/translations";
import type { Metadata } from "next";
import { LANGS, LANG_CONFIG } from "@/lib/seo";
import translations from "@/translations";
import BuyPropertyClient from "@/components/p005/BuyPropertyClient";
import RuPropertyPurchaseClient from "./RuPropertyPurchaseClient";

const BASE_URL = "https://residency24.com";

export async function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang: rawLang } = await params;
  const lang = (LANGS.includes(rawLang as Lang) ? rawLang : "en") as Lang;

  const titles: Record<Lang, string> = {
    fa: 'خرید ملک در دبی و امارات با اقامت | Residency24',
    en: 'Buy Property in Dubai & UAE — Investment, Residency, Golden Visa | Residency24',
    ar: 'شراء عقار في دبي والإمارات للإقامة والاستثمار | Residency24',
    ru: 'Покупка недвижимости в Дубае и ОАЭ для резидентства | Residency24',
  };

  const descriptions: Record<Lang, string> = {
    fa: 'خرید ملک در دبی و امارات با ارزیابی سرمایه‌گذاری، اجاره، اقامت و گلدن ویزا. مشاوره رزیدنسی۲۴.',
    en: 'Buy property in Dubai & UAE with investment, rental, residency and Golden Visa review. Multilingual advisory by Residency24.',
    ar: 'شراء عقار في دبي والإمارات مع تقييم الاستثمار، الإيجار، الإقامة والإقامة الذهبية.',
    ru: 'Помогаем русскоязычным клиентам купить недвижимость в Дубае и ОАЭ с учётом инвестиций, резидентской визы, Golden Visa, семьи, расходов и проверки документов.',
  };

  const localized = (l: Lang) => l === "en" ? `${BASE_URL}/uae/property-purchase/` : `${BASE_URL}/${l}/uae/property-purchase/`;
  const pageUrl = localized(lang);
  const alternates: Record<string, string> = {};
  for (const l of LANGS) {
    alternates[LANG_CONFIG[l].hreflang] = localized(l);
  }
  alternates["x-default"] = localized("en");

  return {
    title: titles[lang],
    description: descriptions[lang],
    alternates: { canonical: pageUrl, languages: alternates },
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

export default async function PropertyPurchasePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: rawLang } = await params;
  const lang = (LANGS.includes(rawLang as Lang) ? rawLang : "en") as Lang;

  if (lang === "ru") return <RuPropertyPurchaseClient />;
  const h1 = translations[lang].bp.seo_h1;
  return <BuyPropertyClient h1={h1} />;
}
