import type { Lang } from "@/translations";
import { LANGS } from "@/lib/seo";
import LandingReading from "@/components/shared/LandingReading";
import TurkeyCitizenshipClient from "./TurkeyCitizenshipClient";

export async function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

export default async function TurkeyCitizenshipPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: rawLang } = await params;
  const lang = (LANGS.includes(rawLang as Lang) ? rawLang : "en") as Lang;

  return <TurkeyCitizenshipClient relatedReading={<LandingReading route="turkey/citizenship" lang={lang} />} />;
}
