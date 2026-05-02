import type { Lang } from "@/translations";
import { LANGS, SEO } from "@/lib/seo";
import HomePageClient from "./HomePageClient";
import RuHomePageClient from "./RuHomePageClient";

export async function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

export default async function LangHomePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: rawLang } = await params;
  const lang = (LANGS.includes(rawLang as Lang) ? rawLang : "en") as Lang;
  const h1 = SEO[lang].h1;

  if (lang === "ru") return <RuHomePageClient h1={h1} />;
  return <HomePageClient h1={h1} />;
}
