import { LANGS } from "@/lib/seo";
import TurkeyHubClient from "./TurkeyHubClient";

export async function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

export default function TurkeyHubPage() {
  return <TurkeyHubClient />;
}
