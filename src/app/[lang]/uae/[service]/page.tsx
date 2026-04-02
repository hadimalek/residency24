import type { Lang } from "@/translations";
import { LANGS } from "@/lib/seo";
import UAEServiceClient from "./UAEServiceClient";

const UAE_SERVICES = ["golden-visa", "company-registration", "buy-property", "tourist-visa"];

export async function generateStaticParams() {
  const params: { lang: string; service: string }[] = [];
  for (const lang of LANGS) {
    for (const service of UAE_SERVICES) {
      params.push({ lang, service });
    }
  }
  return params;
}

const SERVICE_META: Record<string, Record<Lang, { title: string; description: string }>> = {
  "golden-visa": {
    fa: { title: "گلدن ویزا امارات | رزیدنسی۲۴ — اقامت ۱۰ ساله بدون کفیل", description: "گلدن ویزا ۱۰ ساله امارات برای سرمایه‌گذاران و کارآفرینان. از ۹,۶۴۸ درهم. مشاوره رایگان." },
    en: { title: "UAE Golden Visa | Residency24 — 10-Year Residency No Sponsor", description: "10-year UAE Golden Visa for investors and entrepreneurs. From AED 9,648. Free consultation." },
    ar: { title: "الإقامة الذهبية الإمارات | Residency24 — إقامة ١٠ سنوات بدون كفيل", description: "الإقامة الذهبية ١٠ سنوات للمستثمرين ورواد الأعمال. من ٩,٦٤٨ درهم. استشارة مجانية." },
    ru: { title: "Золотая виза ОАЭ | Residency24 — ВНЖ на 10 лет без спонсора", description: "10-летняя Золотая виза ОАЭ для инвесторов и предпринимателей. От 9 648 AED. Бесплатная консультация." },
  },
  "company-registration": {
    fa: { title: "ثبت شرکت دبی | رزیدنسی۲۴ — فری‌زون و مین‌لند با مالکیت ۱۰۰٪", description: "ثبت شرکت در دبی با مالکیت ۱۰۰٪ خارجی. فری‌زون از ۱۱,۹۰۰ درهم. ۷-۱۰ روز کاری." },
    en: { title: "Dubai Company Registration | Residency24 — Free Zone & Mainland 100% Ownership", description: "Register a company in Dubai with 100% foreign ownership. Free zone from AED 11,900. 7-10 business days." },
    ar: { title: "تأسيس شركة دبي | Residency24 — منطقة حرة وبر رئيسي بملكية ١٠٠٪", description: "تأسيس شركة في دبي بملكية أجنبية ١٠٠٪. المنطقة الحرة من ١١,٩٠٠ درهم. ٧-١٠ أيام عمل." },
    ru: { title: "Регистрация компании Дубай | Residency24 — Свободная зона и материк, 100% владение", description: "Регистрация компании в Дубае с 100% иностранным владением. Свободная зона от 11 900 AED. 7-10 рабочих дней." },
  },
  "buy-property": {
    fa: { title: "خرید ملک دبی | رزیدنسی۲۴ — سرمایه‌گذاری و اقامت", description: "خرید ملک در دبی با امکان اخذ ویزای اقامت. از ۷۵۰,۰۰۰ درهم. مشاوره رایگان." },
    en: { title: "Buy Property Dubai | Residency24 — Investment & Residency", description: "Buy property in Dubai with residency visa eligibility. From AED 750,000. Free consultation." },
    ar: { title: "شراء عقار دبي | Residency24 — استثمار وإقامة", description: "شراء عقار في دبي مع إمكانية الحصول على تأشيرة إقامة. من ٧٥٠,٠٠٠ درهم. استشارة مجانية." },
    ru: { title: "Недвижимость Дубай | Residency24 — Инвестиции и ВНЖ", description: "Покупка недвижимости в Дубае с возможностью получения визы. От 750 000 AED. Бесплатная консультация." },
  },
  "tourist-visa": {
    fa: { title: "ویزای توریستی امارات | رزیدنسی۲۴ — ویزا ۳۰ تا ۹۰ روز", description: "ویزای توریستی امارات ۳۰ تا ۹۰ روزه. از ۵۰۰ درهم. مشاوره رایگان." },
    en: { title: "UAE Tourist Visa | Residency24 — 30 to 90 Days", description: "UAE tourist visa for 30 to 90 days. From AED 500. Free consultation." },
    ar: { title: "تأشيرة سياحية الإمارات | Residency24 — ٣٠ إلى ٩٠ يوماً", description: "تأشيرة سياحية للإمارات من ٣٠ إلى ٩٠ يوماً. من ٥٠٠ درهم. استشارة مجانية." },
    ru: { title: "Туристическая виза ОАЭ | Residency24 — 30-90 дней", description: "Туристическая виза ОАЭ на 30-90 дней. От 500 AED. Бесплатная консультация." },
  },
};

export async function generateMetadata({ params }: { params: Promise<{ lang: string; service: string }> }) {
  const { lang: rawLang, service } = await params;
  const lang = (LANGS.includes(rawLang as Lang) ? rawLang : "en") as Lang;
  const meta = SERVICE_META[service]?.[lang] || SERVICE_META["golden-visa"][lang];

  return {
    title: meta.title,
    description: meta.description,
  };
}

export default async function UAEServicePage({ params }: { params: Promise<{ lang: string; service: string }> }) {
  const { service } = await params;
  return <UAEServiceClient serviceId={service} />;
}
