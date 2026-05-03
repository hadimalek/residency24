import type { Metadata } from "next";
import type { Lang } from "@/translations";
import { SEO, LANG_CONFIG, LANGS, getPageUrl, getOrganizationSchema, getLocalBusinessSchema, getFaqSchema, getBreadcrumbSchema } from "@/lib/seo";
import { LanguageProvider } from "@/contexts/LanguageContext";

export async function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang: rawLang } = await params;
  const lang = (LANGS.includes(rawLang as Lang) ? rawLang : "en") as Lang;
  const seo = SEO[lang];
  const config = LANG_CONFIG[lang];
  const pageUrl = getPageUrl(lang);

  const alternates: Record<string, string> = {};
  for (const l of LANGS) {
    alternates[LANG_CONFIG[l].hreflang] = getPageUrl(l);
  }
  alternates["x-default"] = getPageUrl("en");

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
      images: [{ url: seo.ogImage, width: 1200, height: 630 }],
      locale: config.locale,
      alternateLocale: LANGS.filter((l) => l !== lang).map((l) => LANG_CONFIG[l].locale),
      siteName: "Residency24",
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: seo.description,
      images: [seo.ogImage],
    },
    icons: { icon: "/favicon.png" },
  };
}

export default async function LangLayout({ children, params }: { children: React.ReactNode; params: Promise<{ lang: string }> }) {
  const { lang: rawLang } = await params;
  const lang = (LANGS.includes(rawLang as Lang) ? rawLang : "en") as Lang;

  const schemas = [
    getOrganizationSchema(),
    getLocalBusinessSchema(),
    getFaqSchema(lang),
    getBreadcrumbSchema(lang),
  ];

  return (
    <LanguageProvider initialLang={lang}>
      {schemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      {children}
    </LanguageProvider>
  );
}
