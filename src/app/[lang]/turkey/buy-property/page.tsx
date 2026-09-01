import type { Lang } from "@/translations";
import { LANGS } from "@/lib/seo";
import LandingReading from "@/components/shared/LandingReading";
import TurkeyBuyPropertyClient from "./TurkeyBuyPropertyClient";

export async function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

export default async function TurkeyBuyPropertyPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: rawLang } = await params;
  const lang = (LANGS.includes(rawLang as Lang) ? rawLang : "en") as Lang;

  return <TurkeyBuyPropertyClient relatedReading={<LandingReading route="turkey/buy-property" lang={lang} />} />;
}
