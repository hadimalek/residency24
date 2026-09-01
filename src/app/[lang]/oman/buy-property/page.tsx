import type { Lang } from "@/translations";
import { LANGS } from "@/lib/seo";
import LandingReading from "@/components/shared/LandingReading";
import OmanBuyPropertyClient from "./OmanBuyPropertyClient";

export async function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

export default async function OmanBuyPropertyPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: rawLang } = await params;
  const lang = (LANGS.includes(rawLang as Lang) ? rawLang : "en") as Lang;

  return <OmanBuyPropertyClient relatedReading={<LandingReading route="oman/buy-property" lang={lang} />} />;
}
