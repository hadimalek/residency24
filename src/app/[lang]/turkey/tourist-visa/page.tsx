import type { Lang } from "@/translations";
import { LANGS } from "@/lib/seo";
import LandingReading from "@/components/shared/LandingReading";
import TurkeyTouristVisaClient from "./TurkeyTouristVisaClient";

export async function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

export default async function TurkeyTouristVisaPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: rawLang } = await params;
  const lang = (LANGS.includes(rawLang as Lang) ? rawLang : "en") as Lang;

  return <TurkeyTouristVisaClient relatedReading={<LandingReading route="turkey/tourist-visa" lang={lang} />} />;
}
