import type { Metadata } from "next";
import type { Lang } from "@/translations";
import { LANGS, LANG_CONFIG, BREADCRUMB_HOME, getOrganizationSchema, getPageUrl } from "@/lib/seo";

const HUB_SEO: Record<Lang, { title: string; description: string }> = {
  en: {
    title: "Oman Residency, Company & Property 2026 | Residency24",
    description:
      "Investor Residency in Oman from OMR 250,000 in property. 100% foreign-owned companies in Sohar, Salalah & Duqm Free Zones. 0% personal income tax. Free consultation.",
  },
  fa: {
    title: "اقامت، ثبت شرکت و خرید ملک عمان ۲۰۲۶ | رزیدنسی۲۴",
    description:
      "اقامت سرمایه‌گذار عمان از ۲۵۰,۰۰۰ ریال عمان در ملک. شرکت با مالکیت ۱۰۰٪ خارجی در فری‌زون‌های صحار، صلاله و الدقم. مالیات شخصی صفر. مشاوره رایگان.",
  },
  ar: {
    title: "إقامة عُمان وتأسيس شركة وعقار 2026 | Residency24",
    description:
      "إقامة المستثمر في عُمان من 250,000 ر.ع. في العقار. شركات بملكية أجنبية 100٪ في مناطق صحار وصلالة والدقم الحرة. 0٪ ضريبة دخل شخصي. استشارة مجانية.",
  },
  ru: {
    title: "ВНЖ, компания и недвижимость в Омане 2026 | Residency24",
    description:
      "Карта инвестора Омана от OMR 250 000 в недвижимости. Компании со 100% иностранным владением в свободных зонах Сохар, Салала и Дукм. 0% подоходного налога. Бесплатная консультация.",
  },
};

const FAQ: Record<Lang, { q: string; a: string }[]> = {
  en: [
    { q: "What is the minimum investment for Oman residency?", a: "OMR 250,000 in approved property gives a 5-year Investor Residency Card; OMR 500,000 gives 10 years." },
    { q: "Can foreigners own property in Oman?", a: "Yes, in designated Integrated Tourism Complexes such as The Wave, Muscat Hills, Jebel Sifah and Hawana Salalah." },
    { q: "Is income tax really zero in Oman?", a: "Yes — there is no personal income tax. Corporate tax is 15%, but Free Zones offer 25–30 year tax holidays." },
    { q: "How long does company registration take?", a: "A mainland LLC takes 2–4 weeks; Free Zone setups typically 3–6 weeks including bank account opening." },
  ],
  fa: [
    { q: "حداقل سرمایه برای اقامت عمان چقدر است؟", a: "۲۵۰,۰۰۰ ریال عمان در ملک تأییدشده، اقامت ۵ ساله می‌دهد. ۵۰۰,۰۰۰ ریال، اقامت ۱۰ ساله." },
    { q: "آیا خارجی‌ها می‌توانند در عمان ملک بخرند؟", a: "بله، در مجتمع‌های گردشگری مجاز مانند Wave Muscat، Muscat Hills، Jebel Sifah و Hawana Salalah." },
    { q: "آیا مالیات بر درآمد در عمان صفر است؟", a: "بله — مالیات بر درآمد شخصی وجود ندارد. مالیات شرکتی ۱۵٪ ولی فری‌زون‌ها ۲۵ تا ۳۰ سال معافیت دارند." },
    { q: "ثبت شرکت چقدر طول می‌کشد؟", a: "LLC مین‌لند ۲ تا ۴ هفته. فری‌زون‌ها ۳ تا ۶ هفته با احتساب افتتاح حساب." },
  ],
  ar: [
    { q: "ما الحد الأدنى للاستثمار للحصول على إقامة عُمان؟", a: "250,000 ر.ع. في عقار معتمد تمنح إقامة مستثمر 5 سنوات؛ 500,000 ر.ع. تمنح 10 سنوات." },
    { q: "هل يمكن للأجانب تملك العقار في عُمان؟", a: "نعم، في المجمعات السياحية المعتمدة مثل Wave Muscat وMuscat Hills وJebel Sifah وHawana Salalah." },
    { q: "هل ضريبة الدخل صفر في عُمان؟", a: "نعم — لا توجد ضريبة دخل شخصي. الضريبة على الشركات 15٪ لكن المناطق الحرة تتمتع بإعفاء 25 إلى 30 عاماً." },
    { q: "كم يستغرق تأسيس الشركة؟", a: "ش.م.م على البر الرئيسي 2 إلى 4 أسابيع؛ المناطق الحرة 3 إلى 6 أسابيع شاملاً فتح الحساب." },
  ],
  ru: [
    { q: "Какой минимум инвестиций для ВНЖ Омана?", a: "OMR 250 000 в одобренной недвижимости — карта инвестора на 5 лет; OMR 500 000 — на 10 лет." },
    { q: "Могут ли иностранцы покупать недвижимость в Омане?", a: "Да, в утверждённых туристических комплексах: The Wave, Muscat Hills, Jebel Sifah и Hawana Salalah." },
    { q: "Налог на доход в Омане действительно 0%?", a: "Да — личного подоходного налога нет. Корпоративный 15%, но в свободных зонах налоговые каникулы 25–30 лет." },
    { q: "Сколько занимает регистрация компании?", a: "LLC на материке 2–4 недели; в свободных зонах 3–6 недель с учётом открытия счёта." },
  ],
};

const OMAN_BREADCRUMB: Record<Lang, string> = {
  en: "Oman",
  fa: "عمان",
  ar: "عُمان",
  ru: "Оман",
};

function getOmanUrl(lang: Lang) {
  return getPageUrl(lang, "oman/");
}

function getFaqSchema(lang: Lang) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ[lang].map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}

function getBreadcrumbSchema(lang: Lang) {
  const homeUrl = getPageUrl(lang);
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: BREADCRUMB_HOME[lang], item: homeUrl },
      { "@type": "ListItem", position: 2, name: OMAN_BREADCRUMB[lang], item: getOmanUrl(lang) },
    ],
  };
}

function getServiceSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Oman Immigration & Investment Services",
    serviceType: "Immigration Consulting",
    provider: { "@type": "Organization", name: "Residency24", url: "https://residency24.com" },
    areaServed: { "@type": "Country", name: "Oman" },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Oman Services",
      itemListElement: [
        { "@type": "Offer", name: "Oman Investor Residency", price: "250000", priceCurrency: "OMR" },
        { "@type": "Offer", name: "Oman Company Registration", price: "2500", priceCurrency: "USD" },
      ],
    },
  };
}

export async function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang: rawLang } = await params;
  const lang = (LANGS.includes(rawLang as Lang) ? rawLang : "en") as Lang;
  const seo = HUB_SEO[lang];
  const config = LANG_CONFIG[lang];
  const pageUrl = getOmanUrl(lang);

  const alternates: Record<string, string> = {};
  for (const l of LANGS) {
    alternates[LANG_CONFIG[l].hreflang] = getOmanUrl(l);
  }
  alternates["x-default"] = getOmanUrl("en");

  return {
    title: seo.title,
    description: seo.description,
    alternates: { canonical: pageUrl, languages: alternates },
    openGraph: {
      type: "website",
      url: pageUrl,
      title: seo.title,
      description: seo.description,
      locale: config.locale,
      alternateLocale: LANGS.filter((l) => l !== lang).map((l) => LANG_CONFIG[l].locale),
      siteName: "Residency24",
    },
    twitter: { card: "summary_large_image", title: seo.title, description: seo.description },
  };
}

export default async function OmanHubLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang: rawLang } = await params;
  const lang = (LANGS.includes(rawLang as Lang) ? rawLang : "en") as Lang;

  const schemas = [
    getOrganizationSchema(),
    getBreadcrumbSchema(lang),
    getFaqSchema(lang),
    getServiceSchema(),
  ];

  return (
    <>
      {schemas.map((schema, i) => (
        <script
          key={`oman-hub-schema-${i}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      {children}
    </>
  );
}
