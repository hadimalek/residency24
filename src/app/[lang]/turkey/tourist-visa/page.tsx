import { LANGS } from "@/lib/seo";
import TurkeyTouristVisaClient from "./TurkeyTouristVisaClient";

export async function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

export default function TurkeyTouristVisaPage() {
  return <TurkeyTouristVisaClient />;
}
