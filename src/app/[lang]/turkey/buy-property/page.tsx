import { LANGS } from "@/lib/seo";
import TurkeyBuyPropertyClient from "./TurkeyBuyPropertyClient";

export async function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

export default function TurkeyBuyPropertyPage() {
  return <TurkeyBuyPropertyClient />;
}
