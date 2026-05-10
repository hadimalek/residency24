import { LANGS } from "@/lib/seo";
import TurkeyCitizenshipClient from "./TurkeyCitizenshipClient";

export async function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

export default function TurkeyCitizenshipPage() {
  return <TurkeyCitizenshipClient />;
}
