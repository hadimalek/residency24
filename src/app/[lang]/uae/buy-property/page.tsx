import type { Lang } from "@/translations";
import { LANGS } from "@/lib/seo";
import translations from "@/translations";
import BuyPropertyClient from "@/components/p005/BuyPropertyClient";

export async function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

export default async function BuyPropertyPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: rawLang } = await params;
  const lang = (LANGS.includes(rawLang as Lang) ? rawLang : "en") as Lang;
  const h1 = translations[lang].bp.seo_h1;

  return <BuyPropertyClient h1={h1} />;
}
