import type { Metadata } from "next";
import type { Lang } from "@/translations";
import { LANGS, LANG_CONFIG } from "@/lib/seo";
import { getTurkeyUrl } from "./hub-schema";

const HUB_SEO: Record<Lang, { title: string; description: string }> = {
  en: {
    title: "Turkey Citizenship, Residency & Property 2026 | Residency24",
    description:
      "Turkish citizenship by investment from $400,000 in property — passport in 6–8 months. Investor residency from $200,000. Family included. 110+ visa-free countries. Free expert consultation.",
  },
  fa: {
    title: "شهروندی، اقامت و خرید ملک ترکیه ۲۰۲۶ | رزیدنسی۲۴",
    description:
      "شهروندی ترکیه با سرمایه‌گذاری از ۴۰۰,۰۰۰ دلار در ملک — پاسپورت در ۶ تا ۸ ماه. اقامت سرمایه‌گذار از ۲۰۰,۰۰۰ دلار. شامل خانواده. سفر بدون ویزا به ۱۱۰+ کشور. مشاوره رایگان.",
  },
  ar: {
    title: "الجنسية والإقامة وعقارات تركيا 2026 | Residency24",
    description:
      "الجنسية التركية بالاستثمار من 400,000 دولار في العقار — جواز سفر خلال 6 إلى 8 أشهر. إقامة مستثمر من 200,000 دولار. العائلة مشمولة. +110 دولة بدون تأشيرة. استشارة مجانية.",
  },
  ru: {
    title: "Гражданство, ВНЖ и недвижимость Турции 2026 | Residency24",
    description:
      "Гражданство Турции за инвестиции от 400 000 $ в недвижимости — паспорт за 6–8 месяцев. ВНЖ инвестора от 200 000 $. Семья включена. 110+ стран без визы. Бесплатная консультация.",
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
  const pageUrl = getTurkeyUrl(lang);

  const alternates: Record<string, string> = {};
  for (const l of LANGS) {
    alternates[LANG_CONFIG[l].hreflang] = getTurkeyUrl(l);
  }
  alternates["x-default"] = getTurkeyUrl("en");

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

export default async function TurkeyHubLayout({
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
