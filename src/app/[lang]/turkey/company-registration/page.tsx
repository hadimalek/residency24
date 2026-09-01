import type { Lang } from "@/translations";
import { LANGS } from "@/lib/seo";
import LandingReading from "@/components/shared/LandingReading";
import TurkeyCompanyRegistrationClient from "./TurkeyCompanyRegistrationClient";

export async function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

export default async function TurkeyCompanyRegistrationPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: rawLang } = await params;
  const lang = (LANGS.includes(rawLang as Lang) ? rawLang : "en") as Lang;

  return <TurkeyCompanyRegistrationClient relatedReading={<LandingReading route="turkey/company-registration" lang={lang} />} />;
}
