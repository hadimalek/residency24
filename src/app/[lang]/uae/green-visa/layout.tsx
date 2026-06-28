import type { Metadata } from "next";
import type { Lang } from "@/translations";
import translations from "@/translations";
import { LANGS, LANG_CONFIG } from "@/lib/seo";

const BASE_URL = "https://residency24.com";

function getPageUrl(lang: Lang) {
  return lang === "en" ? `${BASE_URL}/uae/green-visa/` : `${BASE_URL}/${lang}/uae/green-visa/`;
}

function langPathPrefix(lang: Lang) {
  return lang === "en" ? `${BASE_URL}` : `${BASE_URL}/${lang}`;
}

export async function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang: rawLang } = await params;
  const lang = (LANGS.includes(rawLang as Lang) ? rawLang : "en") as Lang;
  const meta = translations[lang].page_p037.meta;
  const heroImg = translations[lang].page_p037.images.hero;
  const config = LANG_CONFIG[lang];
  const pageUrl = getPageUrl(lang);

  const alternates: Record<string, string> = {};
  for (const l of LANGS) {
    alternates[LANG_CONFIG[l].hreflang] = getPageUrl(l);
  }
  alternates["x-default"] = getPageUrl("en");

  return {
    title: meta.title,
    description: meta.description,
    alternates: {
      canonical: pageUrl,
      languages: alternates,
    },
    openGraph: {
      type: "website",
      url: pageUrl,
      title: meta.title,
      description: meta.description,
      locale: config.locale,
      alternateLocale: LANGS.filter((l) => l !== lang).map((l) => LANG_CONFIG[l].locale),
      siteName: "Residency24",
      images: heroImg.src ? [{ url: heroImg.src, alt: heroImg.alt }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
      images: heroImg.src ? [heroImg.src] : undefined,
    },
  };
}

function getBreadcrumbSchema(lang: Lang) {
  const names: Record<Lang, { home: string; uae: string; gv: string }> = {
    fa: { home: "خانه", uae: "امارات", gv: "ویزای سبز" },
    en: { home: "Home", uae: "UAE", gv: "Green Visa" },
    ar: { home: "الرئيسية", uae: "الإمارات", gv: "التأشيرة الخضراء" },
    ru: { home: "Главная", uae: "ОАЭ", gv: "Зелёная виза" },
  };
  const n = names[lang];
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: n.home, item: `${langPathPrefix(lang)}/` },
      { "@type": "ListItem", position: 2, name: n.uae, item: `${langPathPrefix(lang)}/uae/` },
      { "@type": "ListItem", position: 3, name: n.gv, item: getPageUrl(lang) },
    ],
  };
}

function getServiceSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "UAE Green Visa Application Assistance",
    serviceType: "Immigration & Visa Consulting",
    provider: {
      "@type": "Organization",
      name: "Residency24",
      url: BASE_URL,
    },
    areaServed: { "@type": "Country", name: "United Arab Emirates" },
    audience: [
      { "@type": "Audience", audienceType: "Skilled professionals" },
      { "@type": "Audience", audienceType: "Freelancers and self-employed" },
      { "@type": "Audience", audienceType: "Investors and partners" },
    ],
    offers: {
      "@type": "AggregateOffer",
      availability: "https://schema.org/InStock",
      priceCurrency: "AED",
      lowPrice: "2280",
      highPrice: "5000",
    },
    description:
      "Professional assistance for the UAE Green Visa — skilled professional, freelancer, and investor routes (5-year self-sponsored residency).",
  };
}

function getFAQSchema(lang: Lang) {
  const items = translations[lang].page_p037.faq.items as Array<{ question: string; answer: string }>;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((it) => ({
      "@type": "Question",
      name: it.question,
      acceptedAnswer: { "@type": "Answer", text: it.answer },
    })),
  };
}

function getImageObjectSchema(lang: Lang) {
  const img = translations[lang].page_p037.images.hero;
  return {
    "@context": "https://schema.org",
    "@type": "ImageObject",
    contentUrl: img.src,
    url: img.src,
    caption: img.alt,
    width: 1600,
    height: 1067,
  };
}

export default async function GreenVisaLayout({ children, params }: { children: React.ReactNode; params: Promise<{ lang: string }> }) {
  const { lang: rawLang } = await params;
  const lang = (LANGS.includes(rawLang as Lang) ? rawLang : "en") as Lang;

  const schemas = [
    getBreadcrumbSchema(lang),
    getServiceSchema(),
    getFAQSchema(lang),
    getImageObjectSchema(lang),
  ];

  return (
    <>
      {schemas.map((schema, i) => (
        <script
          key={`p037-schema-${i}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      {children}
    </>
  );
}
