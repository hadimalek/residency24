import type { Metadata } from "next";
import type { Lang } from "@/translations";
import { LANGS, LANG_CONFIG } from "@/lib/seo";

const BASE_URL = "https://residency24.com";

const PAGE_SEO: Record<Lang, { title: string; description: string }> = {
  fa: {
    title: "گلدن ویزای امارات ۲۰۲۶ — اقامت ۱۰ ساله | رزیدنسی۲۴",
    description: "راهنمای کامل گلدن ویزای امارات ۲۰۲۶: شرایط، هزینه، مدارک و فرآیند. به‌روز ۲۰۲۶. مشاوره رایگان با متخصصان دبی.",
  },
  en: {
    title: "UAE Golden Visa 2026: 10-Year Residency Guide | Residency24",
    description: "Complete UAE Golden Visa guide 2026: eligibility, costs, documents & process. Updated Jan 2026. Free expert consultation in 4 languages.",
  },
  ar: {
    title: "التأشيرة الذهبية الإمارات 2026 — إقامة 10 سنوات | Residency24",
    description: "دليل شامل للتأشيرة الذهبية الإماراتية 2026: الشروط والتكاليف والوثائق. محدّث 2026. استشارة مجانية.",
  },
  ru: {
    title: "Золотая виза ОАЭ 2026 — ВНЖ на 10 лет | Residency24",
    description: "Полное руководство по золотой визе ОАЭ 2026: условия, стоимость, документы. Обновлено в 2026 г. Бесплатная консультация.",
  },
};

function getPageUrl(lang: Lang) {
  return lang === "en" ? `${BASE_URL}/uae/golden-visa/` : `${BASE_URL}/${lang}/uae/golden-visa/`;
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
  const names: Record<Lang, { home: string; uae: string; gv: string }> = {
    fa: { home: "خانه", uae: "امارات", gv: "گلدن ویزا" },
    en: { home: "Home", uae: "UAE", gv: "Golden Visa" },
    ar: { home: "الرئيسية", uae: "الإمارات", gv: "التأشيرة الذهبية" },
    ru: { home: "Главная", uae: "ОАЭ", gv: "Золотая виза" },
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
    name: "UAE Golden Visa Application Assistance",
    serviceType: "Immigration & Visa Consulting",
    provider: {
      "@type": "Organization",
      name: "Residency24",
      url: "https://residency24.com",
    },
    areaServed: { "@type": "Country", name: "United Arab Emirates" },
    offers: {
      "@type": "Offer",
      availability: "https://schema.org/InStock",
      priceCurrency: "AED",
    },
    description: "Professional assistance for UAE Golden Visa applications — property, professional, and investor routes",
  };
}

function getHowToSchema(lang: Lang) {
  const titles: Record<Lang, string> = {
    fa: "فرآیند گام به گام گلدن ویزا",
    en: "Apply for UAE Golden Visa",
    ar: "إجراءات التأشيرة الذهبية خطوة بخطوة",
    ru: "Пошаговый процесс получения Золотой визы",
  };
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: titles[lang],
    totalTime: "P8W",
    step: [
      { "@type": "HowToStep", position: 1, name: "Determine eligibility path", text: "Choose between property (AED 2M+), professional salary (AED 30K+/mo), business investment (AED 2M+), or talent category." },
      { "@type": "HowToStep", position: 2, name: "Gather required documents", text: "Collect passport, photos, health insurance, and route-specific documents (title deed/Oqood for property, salary certificate for professionals)." },
      { "@type": "HowToStep", position: 3, name: "Submit via ICP or GDRFA portal", text: "Apply online through icp.gov.ae or the GDRFA Dubai portal. Pay government fees online." },
      { "@type": "HowToStep", position: 4, name: "Complete medical examination", text: "Blood test and chest X-ray at an ICP-approved medical center. Fingerprints and photo at ICP center." },
      { "@type": "HowToStep", position: 5, name: "Receive Golden Visa", text: "Residence permit and Emirates ID delivered. Processing time: 2–8 weeks depending on nationality and route." },
    ],
  };
}

function getFAQSchema(lang: Lang) {
  const faqs = [
    {
      q: { fa: "آیا ملک off-plan واجد شرایط گلدن ویزاست؟", en: "Can off-plan property qualify for the Golden Visa?", ar: "هل يمكن للعقار على الخارطة الحصول على التأشيرة الذهبية؟", ru: "Подходит ли строящаяся недвижимость для Золотой визы?" },
      a: { fa: "بله — از ژانویه ۲۰۲۴. ملک off-plan در هر مرحله ساخت واجد شرایط است به شرط ارزش ≥۲M AED.", en: "Yes — since January 2024. Any off-plan property at any construction stage qualifies, provided total value ≥ AED 2M.", ar: "نعم — منذ يناير 2024. أي عقار على الخارطة في أي مرحلة بناء مؤهل، شريطة أن تكون القيمة ≥ 2 مليون درهم.", ru: "Да — с января 2024 года. Любая строящаяся недвижимость на любом этапе строительства подходит при стоимости ≥ 2M AED." },
    },
    {
      q: { fa: "آیا می‌توانم چند ملک را ترکیب کنم؟", en: "Can I combine multiple properties to reach AED 2M?", ar: "هل يمكنني دمج عقارات متعددة للوصول إلى 2 مليون درهم؟", ru: "Могу ли я объединить несколько объектов недвижимости?" },
      a: { fa: "بله. چند ملک که مجموعاً ≥۲M AED ارزش داشته باشند، کافی است.", en: "Yes. Multiple properties totaling AED 2M+ qualify, provided all are in your name and located in Dubai freehold zones.", ar: "نعم. عدة عقارات بإجمالي ≥ 2 مليون درهم تؤهلك.", ru: "Да. Несколько объектов суммарной стоимостью ≥ 2M AED подходят." },
    },
    {
      q: { fa: "اگر کارم را از دست بدهم، گلدن ویزایم چه می‌شود؟", en: "What happens to my Golden Visa if I lose my job?", ar: "ماذا يحدث لتأشيرتي الذهبية إذا فقدت وظيفتي؟", ru: "Что произойдет с моей Золотой визой, если я потеряю работу?" },
      a: { fa: "هیچ تأثیری ندارد. گلدن ویزا به کارفرما وابسته نیست.", en: "No impact. The Golden Visa is not tied to an employer — you are self-sponsored.", ar: "لا يوجد أي تأثير. التأشيرة الذهبية غير مرتبطة بصاحب العمل.", ru: "Никакого влияния. Золотая виза не привязана к работодателю." },
    },
    {
      q: { fa: "آیا گلدن ویزا والدین را هم شامل می‌شود؟", en: "Does the Golden Visa cover parents?", ar: "هل تشمل التأشيرة الذهبية الوالدين؟", ru: "Распространяется ли Золотая виза на родителей?" },
      a: { fa: "بله — از ۲۰۲۵. والدین با ویزای ۱۰ ساله.", en: "Yes — since 2025. Golden Visa holders can sponsor parents on 10-year dependent visas.", ar: "نعم — منذ 2025. يمكن كفالة الوالدين بتأشيرة 10 سنوات.", ru: "Да — с 2025 года. Родители на 10-летнюю визу." },
    },
    {
      q: { fa: "چقدر باید در امارات باشم؟", en: "How long do I need to stay in UAE to keep my Golden Visa?", ar: "كم يجب أن أبقى في الإمارات؟", ru: "Сколько нужно находиться в ОАЭ?" },
      a: { fa: "هیچ حداقل اقامتی وجود ندارد.", en: "No minimum stay requirement. You can live outside UAE for any duration.", ar: "لا يوجد حد أدنى للإقامة.", ru: "Нет минимального требования к проживанию." },
    },
    {
      q: { fa: "حقوق متخصص چقدر باید باشد؟", en: "What salary qualifies for a professional Golden Visa?", ar: "ما الراتب المطلوب؟", ru: "Какая зарплата нужна?" },
      a: { fa: "حداقل ۳۰,۰۰۰ AED حقوق پایه.", en: "Minimum AED 30,000 per month basic salary (excluding allowances).", ar: "الحد الأدنى 30,000 درهم شهرياً.", ru: "Минимум 30 000 AED в месяц (базовая зарплата)." },
    },
  ];

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q[lang],
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a[lang],
      },
    })),
  };
}

export default async function GoldenVisaLayout({ children, params }: { children: React.ReactNode; params: Promise<{ lang: string }> }) {
  const { lang: rawLang } = await params;
  const lang = (LANGS.includes(rawLang as Lang) ? rawLang : "en") as Lang;

  const schemas = [
    getBreadcrumbSchema(lang),
    getServiceSchema(),
    getHowToSchema(lang),
    getFAQSchema(lang),
  ];

  return (
    <>
      {schemas.map((schema, i) => (
        <script
          key={`p004-schema-${i}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      {children}
    </>
  );
}
