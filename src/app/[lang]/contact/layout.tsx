import type { Metadata } from "next";
import type { Lang } from "@/translations";
import { LANGS, LANG_CONFIG } from "@/lib/seo";

const BASE_URL = "https://residency24.com";
const PATH = "contact/";

const PAGE_SEO: Record<Lang, { title: string; description: string }> = {
  fa: {
    title: "تماس با ما | رزیدنسی۲۴ — مشاوره اقامت و سرمایه‌گذاری در دبی",
    description: "با تیم رزیدنسی۲۴ در دبی تماس بگیرید: فرم تماس، واتساپ، تلگرام، تلفن و آدرس دفاتر. پاسخ معمولاً ظرف ۲ ساعت.",
  },
  en: {
    title: "Contact Us | Residency24 — Dubai Residency & Investment Advisors",
    description: "Contact the Residency24 team in Dubai: contact form, WhatsApp, Telegram, phone, email and office address with map. We usually reply within 2 hours.",
  },
  ar: {
    title: "اتصل بنا | Residency24 — مستشارو الإقامة والاستثمار في دبي",
    description: "تواصل مع فريق Residency24 في دبي: نموذج تواصل، واتساب، تيليجرام، هاتف وعنوان المكتب مع الخريطة. عادةً نرد خلال ساعتين.",
  },
  ru: {
    title: "Контакты | Residency24 — Консультанты по ВНЖ и инвестициям в Дубае",
    description: "Свяжитесь с командой Residency24 в Дубае: форма, WhatsApp, Telegram, телефон, email и адрес офиса на карте. Обычно отвечаем в течение 2 часов.",
  },
};

function getPageUrl(lang: Lang) {
  return lang === "en" ? `${BASE_URL}/${PATH}` : `${BASE_URL}/${lang}/${PATH}`;
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
  const seo = PAGE_SEO[lang];
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
      locale: config.locale,
      alternateLocale: LANGS.filter((l) => l !== lang).map((l) => LANG_CONFIG[l].locale),
      siteName: "Residency24",
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: seo.description,
    },
  };
}

function getBreadcrumbSchema(lang: Lang) {
  const names: Record<Lang, { home: string; contact: string }> = {
    fa: { home: "خانه", contact: "تماس با ما" },
    en: { home: "Home", contact: "Contact" },
    ar: { home: "الرئيسية", contact: "اتصل بنا" },
    ru: { home: "Главная", contact: "Контакты" },
  };
  const n = names[lang];
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: n.home, item: `${langPathPrefix(lang)}/` },
      { "@type": "ListItem", position: 2, name: n.contact, item: getPageUrl(lang) },
    ],
  };
}

function getContactSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Residency24",
    url: BASE_URL,
    email: "info@residency24.com",
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: "+971-56-200-9131",
        contactType: "customer service",
        availableLanguage: ["English", "Persian", "Arabic", "Russian"],
        areaServed: ["AE", "OM", "TR"],
      },
    ],
    address: {
      "@type": "PostalAddress",
      streetAddress: "Al Khail Heights Apartment Building, RB 03A, No. 218",
      addressLocality: "Dubai",
      addressCountry: "AE",
    },
  };
}

export default async function ContactLayout({ children, params }: { children: React.ReactNode; params: Promise<{ lang: string }> }) {
  const { lang: rawLang } = await params;
  const lang = (LANGS.includes(rawLang as Lang) ? rawLang : "en") as Lang;

  const schemas = [getBreadcrumbSchema(lang), getContactSchema()];

  return (
    <>
      {schemas.map((schema, i) => (
        <script
          key={`contact-schema-${i}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      {children}
    </>
  );
}
