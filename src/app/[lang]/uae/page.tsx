import type { Lang } from "@/translations";
import { LANGS } from "@/lib/seo";
import UAEPageClient from "./UAEPageClient";

export async function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: rawLang } = await params;
  const lang = (LANGS.includes(rawLang as Lang) ? rawLang : "en") as Lang;

  const titles: Record<Lang, string> = {
    fa: "خدمات امارات | رزیدنسی۲۴ — گلدن ویزا، ثبت شرکت و خرید ملک دبی",
    en: "UAE Services | Residency24 — Golden Visa, Company Setup & Property Dubai",
    ar: "خدمات الإمارات | Residency24 — الإقامة الذهبية وتأسيس الشركات والعقارات",
    ru: "Услуги ОАЭ | Residency24 — Золотая виза, компания и недвижимость Дубай",
  };

  const descriptions: Record<Lang, string> = {
    fa: "خدمات اقامت، ثبت شرکت و سرمایه‌گذاری در امارات. گلدن ویزا ۱۰ ساله، شرکت فری‌زون و خرید ملک دبی. مشاوره رایگان.",
    en: "UAE residency, company registration & investment services. 10-year Golden Visa, free zone company, Dubai property. Free consultation.",
    ar: "خدمات الإقامة وتأسيس الشركات والاستثمار في الإمارات. الإقامة الذهبية ١٠ سنوات وشركات المناطق الحرة وعقارات دبي. استشارة مجانية.",
    ru: "Услуги ВНЖ, регистрации компании и инвестиций в ОАЭ. 10-летняя Золотая виза, компания в свободной зоне, недвижимость Дубая. Бесплатная консультация.",
  };

  return {
    title: titles[lang],
    description: descriptions[lang],
  };
}

export default function UAEPage() {
  return <UAEPageClient />;
}
