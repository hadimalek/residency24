import { LANGS } from "@/lib/seo";
import OmanResidencyVisaClient from "./OmanResidencyVisaClient";

export async function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

export default function OmanResidencyVisaPage() {
  return <OmanResidencyVisaClient />;
}
