import type { Lang } from "@/translations";
import type { Metadata } from "next";
import translations from "@/translations";
import { LANGS } from "@/lib/seo";
import UAEServicePageClient from "../UAEServicePageClient";

export async function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang: rawLang } = await params;
  const lang = (LANGS.includes(rawLang as Lang) ? rawLang : "en") as Lang;
  const p = translations[lang].uae_pages?.tourist_visa;
  return { title: p?.seo_title, description: p?.seo_desc };
}

export default function TouristVisaPage() {
  return <UAEServicePageClient service="tourist_visa" />;
}
