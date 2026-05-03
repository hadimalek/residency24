import type { Metadata } from "next";
import type { Lang } from "@/translations";
import { LANGS, LANG_CONFIG, BREADCRUMB_HOME, getOrganizationSchema } from "@/lib/seo";
import UAEHubClient from "./UAEHubClient";
import RuUaeHubClient from "./RuUaeHubClient";

const BASE_URL = "https://residency24.com";

const UAE_SEO: Record<Lang, { title: string; description: string; h1: string }> = {
  fa: {
    title: "مهاجرت به امارات ۲۰۲۶ | اقامت، ثبت شرکت و خرید ملک دبی",
    description: "راهنمای کامل مهاجرت به امارات — گلدن ویزا از ۲ میلیون درهم، ثبت شرکت بدون کفیل، خرید ملک با اقامت. ۵۰۰۰+ پرونده موفق. مشاوره رایگان رزیدنسی۲۴.",
    h1: "مهاجرت به امارات — گلدن ویزا، ثبت شرکت و سرمایه‌گذاری در دبی ۲۰۲۶",
  },
  en: {
    title: "UAE Residency & Investment 2026 | Residency24 Dubai",
    description: "Golden Visa, company registration & property investment in Dubai. 5,000+ successful cases since 2018. Expert multilingual team. 100% foreign ownership. Free consultation.",
    h1: "Live, Invest & Build in Dubai — Your 10-Year Tax-Free Future",
  },
  ar: {
    title: "الإقامة في الإمارات 2026 | إقامة ذهبية وتأسيس شركة ودبي",
    description: "دليلك الشامل للإقامة في الإمارات — إقامة ذهبية من 2 مليون درهم، تأسيس شركة بملكية كاملة، شراء عقار بإقامة. رزيدنسي24، أكثر من 5000 حالة ناجحة.",
    h1: "الهجرة إلى الإمارات — الإقامة الذهبية وتأسيس شركة والاستثمار في دبي 2026",
  },
  ru: {
    title: "Релокация, резидентство и бизнес в ОАЭ | Residency24",
    description: "Residency24 помогает русскоязычным клиентам выбрать путь в ОАЭ: открытие компании, резидентская виза, недвижимость, Golden Visa, семейная релокация и банковское сопровождение.",
    h1: "Релокация, резидентство и бизнес в ОАЭ",
  },
};

const UAE_FAQ: Record<Lang, Array<{ q: string; a: string }>> = {
  fa: [
    { q: "حداقل سرمایه برای گلدن ویزا امارات چقدر است؟", a: "برای مسیر ملک: ۲ میلیون درهم. برای مسیر شرکت: از ۲۰,۰۰۰ درهم." },
    { q: "آیا برای ثبت شرکت در دبی حتماً باید به امارات بروم؟", a: "خیر. فرآیند ثبت شرکت کاملاً از راه دور انجام می‌شود." },
    { q: "آیا می‌توانم همزمان در ایران و امارات اقامت داشته باشم؟", a: "بله. گلدن ویزا امارات هیچ شرط حداقل اقامتی ندارد." },
    { q: "گلدن ویزای امارات چه کسانی را شامل می‌شود؟", a: "همسر، فرزندان زیر ۱۸ سال، پسران تا ۲۵ سال دانشجو، و کارگر خانگی." },
    { q: "هزینه واقعی ثبت شرکت در دبی چقدر است؟", a: "Free Zone از ۱۸,۰۰۰ درهم، Mainland LLC از ۲۱,۰۰۰ درهم." },
  ],
  en: [
    { q: "What is the minimum investment for a UAE Golden Visa?", a: "Property route: AED 2 million. Company route: from AED 20,000." },
    { q: "Can I register a company in Dubai without visiting?", a: "Yes. The entire process can be handled remotely." },
    { q: "Can I maintain residency in my home country while holding UAE residency?", a: "Yes. The UAE Golden Visa has no minimum stay requirement." },
    { q: "Who can be included in my UAE Golden Visa?", a: "Spouse, children under 18, sons up to 25 if in education, and one domestic worker." },
    { q: "What are the real costs of company registration in Dubai?", a: "Free Zone from AED 18,000, Mainland LLC from AED 21,000." },
  ],
  ar: [
    { q: "ما هو الحد الأدنى للاستثمار للإقامة الذهبية؟", a: "عبر العقار: 2 مليون درهم. عبر الشركة: من 20,000 درهم." },
    { q: "هل يمكنني تأسيس شركة في دبي دون زيارة؟", a: "نعم. كامل الإجراءات تتم عن بُعد." },
    { q: "هل يمكن الجمع بين الإقامة في الإمارات وبلدي؟", a: "نعم. لا تشترط الإقامة الذهبية حداً أدنى للإقامة." },
    { q: "من يمكن تضمينه في الإقامة الذهبية؟", a: "الزوج/الزوجة، الأبناء دون 18، الأبناء حتى 25 إن كانوا طلاباً، وعامل منزلي." },
    { q: "ما تكلفة تأسيس شركة في دبي؟", a: "المنطقة الحرة: من 18,000 درهم. البر الرئيسي: من 21,000 درهم." },
  ],
  ru: [
    { q: "Можно ли получить резидентство в ОАЭ через компанию?", a: "Да, регистрация компании в свободной зоне или на материке — один из распространённых маршрутов к резидентской визе. Условия зависят от типа лицензии и требований выбранного органа." },
    { q: "Что лучше: открыть компанию или купить недвижимость?", a: "Это зависит от цели. Компания подходит, когда основной приоритет — бизнес и операционная структура; недвижимость — когда важны инвестиция и возможная связь с резидентством." },
    { q: "Можно ли получить Golden Visa через недвижимость?", a: "В ряде случаев — да, при соответствии актуальным порогам стоимости и требованиям к объекту. Условия программы могут меняться, поэтому нужна индивидуальная оценка кейса." },
    { q: "Можно ли перевезти семью в ОАЭ?", a: "Да, основной заявитель, как правило, может включить супругу/супруга и детей в семейную визу. Список dependents и документы зависят от маршрута и спонсора." },
    { q: "Можно ли открыть банковский счёт после регистрации компании?", a: "Открытие счёта возможно, но проходит отдельную compliance-проверку банка. Сроки и решение зависят от профиля бенефициара и деятельности компании." },
    { q: "Сколько времени занимает процесс?", a: "Сроки зависят от маршрута, готовности документов и государственных процедур. Итоговый таймлайн формируется после оценки кейса." },
    { q: "Можно ли начать процесс удалённо?", a: "Многие шаги — оценка, подбор маршрута и подготовка документов — можно начать удалённо. Часть этапов требует личного присутствия." },
    { q: "Какие документы нужны для первичной оценки?", a: "Достаточно общей информации о цели, бюджете, стране, составе семьи и гражданстве. Полный список документов формируется после выбора маршрута." },
    { q: "Что Residency24 не гарантирует?", a: "Мы не гарантируем одобрение со стороны государственных органов и не обещаем точные сроки. Наша работа — подбор маршрута и сопровождение подготовки документов." },
  ],
};

const UAE_BREADCRUMB: Record<Lang, string> = {
  fa: "امارات",
  en: "UAE",
  ar: "الإمارات",
  ru: "ОАЭ",
};

function getUaePageUrl(lang: Lang) {
  return lang === "en" ? `${BASE_URL}/uae/` : `${BASE_URL}/${lang}/uae/`;
}

function getFaqSchema(lang: Lang) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: UAE_FAQ[lang].map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}

function getBreadcrumbSchema(lang: Lang) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: BREADCRUMB_HOME[lang], item: lang === "en" ? `${BASE_URL}/` : `${BASE_URL}/${lang}/` },
      { "@type": "ListItem", position: 2, name: UAE_BREADCRUMB[lang], item: getUaePageUrl(lang) },
    ],
  };
}

function getServiceSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "UAE Immigration & Investment Services",
    serviceType: "Immigration Consulting",
    provider: { "@type": "Organization", name: "Residency24", url: "https://residency24.com" },
    areaServed: { "@type": "Country", name: "United Arab Emirates" },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "UAE Services",
      itemListElement: [
        { "@type": "Offer", name: "UAE Golden Visa", price: "20000", priceCurrency: "AED" },
        { "@type": "Offer", name: "Company Registration Dubai", price: "18000", priceCurrency: "AED" },
      ],
    },
  };
}

function getItemListSchema(lang: Lang) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Dubai Investment Districts",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Downtown Dubai", url: `${getUaePageUrl(lang).replace(/\/$/, "")}/buy-property/#downtown` },
      { "@type": "ListItem", position: 2, name: "Dubai Marina", url: `${getUaePageUrl(lang).replace(/\/$/, "")}/buy-property/#marina` },
      { "@type": "ListItem", position: 3, name: "Palm Jumeirah", url: `${getUaePageUrl(lang).replace(/\/$/, "")}/buy-property/#palm` },
      { "@type": "ListItem", position: 4, name: "JVC", url: `${getUaePageUrl(lang).replace(/\/$/, "")}/buy-property/#jvc` },
      { "@type": "ListItem", position: 5, name: "Business Bay", url: `${getUaePageUrl(lang).replace(/\/$/, "")}/buy-property/#business-bay` },
      { "@type": "ListItem", position: 6, name: "Creek Harbour", url: `${getUaePageUrl(lang).replace(/\/$/, "")}/buy-property/#creek` },
    ],
  };
}

export async function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang: rawLang } = await params;
  const lang = (LANGS.includes(rawLang as Lang) ? rawLang : "en") as Lang;
  const seo = UAE_SEO[lang];
  const config = LANG_CONFIG[lang];
  const pageUrl = getUaePageUrl(lang);

  const alternates: Record<string, string> = {};
  for (const l of LANGS) {
    alternates[LANG_CONFIG[l].hreflang] = getUaePageUrl(l);
  }
  alternates["x-default"] = getUaePageUrl("en");

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
      images: [{ url: `${BASE_URL}/assets/og-image-${lang}.jpg`, width: 1200, height: 630 }],
      locale: config.locale,
      alternateLocale: LANGS.filter((l) => l !== lang).map((l) => LANG_CONFIG[l].locale),
      siteName: "Residency24",
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: seo.description,
      images: [`${BASE_URL}/assets/og-image-${lang}.jpg`],
    },
    icons: { icon: "/favicon.png" },
  };
}

export default async function UAEHubPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: rawLang } = await params;
  const lang = (LANGS.includes(rawLang as Lang) ? rawLang : "en") as Lang;
  const h1 = UAE_SEO[lang].h1;

  const schemas = [
    getOrganizationSchema(),
    getFaqSchema(lang),
    getBreadcrumbSchema(lang),
    getServiceSchema(),
    getItemListSchema(lang),
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
      {lang === "ru" ? <RuUaeHubClient h1={h1} /> : <UAEHubClient h1={h1} />}
    </>
  );
}
