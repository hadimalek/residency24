import type { Metadata } from "next";
import type { Lang } from "@/translations";
import { LANGS, LANG_CONFIG } from "@/lib/seo";
import { getOmanUrl } from "./hub-schema";

const HUB_SEO: Record<Lang, { title: string; description: string }> = {
  en: {
    title: "Oman Residency, Company & Property 2026 | Residency24",
    description:
      "Investor Residency in Oman from OMR 250,000 in property. 100% foreign-owned companies in Sohar, Salalah & Duqm Free Zones. 0% personal income tax. Free consultation.",
  },
  fa: {
    title: "اقامت، ثبت شرکت و خرید ملک عمان ۲۰۲۶ | رزیدنسی۲۴",
    description:
      "اقامت سرمایه‌گذار عمان از ۲۵۰,۰۰۰ ریال عمان در ملک. شرکت با مالکیت ۱۰۰٪ خارجی در فری‌زون‌های صحار، صلاله و الدقم. مالیات شخصی صفر. مشاوره رایگان.",
  },
  ar: {
    title: "إقامة عُمان وتأسيس شركة وعقار 2026 | Residency24",
    description:
      "إقامة المستثمر في عُمان من 250,000 ر.ع. في العقار. شركات بملكية أجنبية 100٪ في مناطق صحار وصلالة والدقم الحرة. 0٪ ضريبة دخل شخصي. استشارة مجانية.",
  },
  ru: {
    title: "ВНЖ, компания и недвижимость в Омане 2026 | Residency24",
    description:
      "Карта инвестора Омана от OMR 250 000 в недвижимости. Компании со 100% иностранным владением в свободных зонах Сохар, Салала и Дукм. 0% подоходного налога. Бесплатная консультация.",
  },
};













export async function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang: rawLang } = await params;
  const lang = (LANGS.includes(rawLang as Lang) ? rawLang : "en") as Lang;
  const seo = HUB_SEO[lang];
  const config = LANG_CONFIG[lang];
  const pageUrl = getOmanUrl(lang);

  const alternates: Record<string, string> = {};
  for (const l of LANGS) {
    alternates[LANG_CONFIG[l].hreflang] = getOmanUrl(l);
  }
  alternates["x-default"] = getOmanUrl("en");

  return {
    title: seo.title,
    description: seo.description,
    alternates: { canonical: pageUrl, languages: alternates },
    openGraph: {
      type: "website",
      url: pageUrl,
      title: seo.title,
      description: seo.description,
      locale: config.locale,
      alternateLocale: LANGS.filter((l) => l !== lang).map((l) => LANG_CONFIG[l].locale),
      siteName: "Residency24",
    },
    twitter: { card: "summary_large_image", title: seo.title, description: seo.description },
  };
}

export default async function OmanHubLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  // Nothing per-language to do here any more: the hub's schema moved to
  // page.tsx so it stops leaking onto the service routes underneath.
  await params;
  return <>{children}</>;
}
