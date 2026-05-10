import type { Lang } from "@/translations";
import { LANGS } from "@/lib/seo";
import OmanCompanyRegistrationClient from "./OmanCompanyRegistrationClient";

export async function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

export default async function OmanCompanyRegistrationPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang: rawLang } = await params;
  const lang = (LANGS.includes(rawLang as Lang) ? rawLang : "en") as Lang;
  void lang;
  return <OmanCompanyRegistrationClient />;
}
