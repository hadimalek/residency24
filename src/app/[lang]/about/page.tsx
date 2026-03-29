import type { Metadata } from "next";
import type { Lang } from "@/translations";
import { LANGS, LANG_CONFIG, ABOUT_SEO, getAboutPageUrl, getAboutOrganizationSchema, getAboutBreadcrumbSchema } from "@/lib/seo";
import AboutPageClient from "./AboutPageClient";

export async function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang: rawLang } = await params;
  const lang = (LANGS.includes(rawLang as Lang) ? rawLang : "en") as Lang;
  const seo = ABOUT_SEO[lang];
  const config = LANG_CONFIG[lang];
  const pageUrl = getAboutPageUrl(lang);

  const alternates: Record<string, string> = {};
  for (const l of LANGS) {
    alternates[LANG_CONFIG[l].hreflang] = getAboutPageUrl(l);
  }
  alternates["x-default"] = getAboutPageUrl("en");

  return {
    title: seo.title,
    description: seo.description,
    alternates: {
      canonical: pageUrl,
      languages: alternates,
    },
    openGraph: {
      type: "website",
      url: pageUrl,
      title: seo.title,
      description: seo.description,
      locale: config.locale,
      alternateLocale: LANGS.filter((l) => l !== lang).map((l) => LANG_CONFIG[l].locale),
      siteName: "Residency24",
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: seo.description,
    },
    icons: { icon: "/favicon.svg" },
  };
}

export default async function AboutPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: rawLang } = await params;
  const lang = (LANGS.includes(rawLang as Lang) ? rawLang : "en") as Lang;

  const schemas = [
    getAboutOrganizationSchema(),
    getAboutBreadcrumbSchema(lang),
  ];

  return (
    <>
      {schemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <AboutPageClient />
    </>
  );
}
