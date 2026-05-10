import { LANGS } from "@/lib/seo";
import OmanCompanyRegistrationClient from "./OmanCompanyRegistrationClient";

export async function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

export default function OmanCompanyRegistrationPage() {
  return <OmanCompanyRegistrationClient />;
}
