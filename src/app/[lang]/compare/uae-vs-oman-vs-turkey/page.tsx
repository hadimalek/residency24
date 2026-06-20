import type { Lang } from "@/translations";
import { LANGS } from "@/lib/seo";
import CompareCountriesClient from "./CompareCountriesClient";

export async function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

export default async function CompareCountriesPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: rawLang } = await params;
  const lang = (LANGS.includes(rawLang as Lang) ? rawLang : "en") as Lang;

  return <CompareCountriesClient key={lang} />;
}
