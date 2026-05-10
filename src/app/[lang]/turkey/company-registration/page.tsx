import { LANGS } from "@/lib/seo";
import TurkeyCompanyRegistrationClient from "./TurkeyCompanyRegistrationClient";

export async function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

export default function TurkeyCompanyRegistrationPage() {
  return <TurkeyCompanyRegistrationClient />;
}
