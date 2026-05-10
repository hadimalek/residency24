import { LANGS } from "@/lib/seo";
import OmanTouristVisaClient from "./OmanTouristVisaClient";

export async function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

export default function OmanTouristVisaPage() {
  return <OmanTouristVisaClient />;
}
