import type { Lang } from "@/translations";
import { LANGS } from "@/lib/seo";
import OmanHubClient from "./OmanHubClient";

export async function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

const HUB_H1: Record<Lang, string> = {
  en: "Live, Invest & Build in Oman — Your Gateway to GCC Growth",
  fa: "زندگی، سرمایه‌گذاری و کسب‌وکار در عمان — درگاه آرام شما به خلیج فارس",
  ar: "العيش والاستثمار وبناء الأعمال في سلطنة عُمان — بوابتك إلى نمو الخليج",
  ru: "Резидентство, бизнес и инвестиции в Омане — спокойная альтернатива ОАЭ",
};

export default async function OmanHubPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: rawLang } = await params;
  const lang = (LANGS.includes(rawLang as Lang) ? rawLang : "en") as Lang;

  return <OmanHubClient h1={HUB_H1[lang]} />;
}
