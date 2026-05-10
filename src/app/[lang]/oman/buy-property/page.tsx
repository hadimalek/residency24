import { LANGS } from "@/lib/seo";
import OmanBuyPropertyClient from "./OmanBuyPropertyClient";

export async function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

export default function OmanBuyPropertyPage() {
  return <OmanBuyPropertyClient />;
}
