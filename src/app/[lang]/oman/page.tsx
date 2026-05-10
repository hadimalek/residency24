import { LANGS } from "@/lib/seo";
import OmanHubClient from "./OmanHubClient";

export async function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

export default function OmanHubPage() {
  return <OmanHubClient />;
}
