import type { Lang } from "@/translations";
import { LANGS } from "@/lib/seo";
import { getBreadcrumbSchema, getFaqSchema, getServiceSchema } from "./hub-schema";
import TurkeyHubClient from "./TurkeyHubClient";

export async function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

export default async function TurkeyHubPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: rawLang } = await params;
  const lang = (LANGS.includes(rawLang as Lang) ? rawLang : "en") as Lang;
  const schemas = [getBreadcrumbSchema(lang), getFaqSchema(lang), getServiceSchema()];

  return (
    <>
      {schemas.map((schema, i) => (
        <script
          key={`turkey-hub-schema-${i}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <TurkeyHubClient />
    </>
  );
}
