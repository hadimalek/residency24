import type { Metadata } from "next";
import type { Lang } from "@/translations";
import { LANGS, LANG_CONFIG, BREADCRUMB_HOME, getPageUrl } from "@/lib/seo";

const PAGE_SEO: Record<Lang, { title: string; description: string }> = {
  en: {
    title: "Buy Property in Oman 2026 | Freehold ITC Zones — Residency24",
    description:
      "Foreigner-friendly freehold property in Oman ITC zones — The Wave, Muscat Hills, Jebel Sifah, Hawana Salalah. From OMR 100,000. OMR 250,000+ unlocks 5-year Investor Residency.",
  },
  fa: {
    title: "خرید ملک در عمان ۲۰۲۶ | مناطق Freehold ITC — رزیدنسی۲۴",
    description:
      "ملک Freehold برای خارجی‌ها در مناطق ITC عمان — Wave، Muscat Hills، Jebel Sifah، Hawana Salalah. از ۱۰۰,۰۰۰ ریال عمان. ملک ۲۵۰,۰۰۰+ ریال، اقامت ۵ ساله می‌دهد.",
  },
  ar: {
    title: "شراء عقار في عُمان 2026 | مناطق تملك حر ITC — Residency24",
    description:
      "عقار تملك حر للأجانب في مناطق ITC العمانية — Wave وMuscat Hills وJebel Sifah وHawana Salalah. من 100,000 ر.ع. عقار 250,000+ ر.ع. يفتح إقامة 5 سنوات.",
  },
  ru: {
    title: "Покупка недвижимости в Омане 2026 | Зоны freehold ITC — Residency24",
    description:
      "Freehold-недвижимость для иностранцев в зонах ITC Омана — The Wave, Muscat Hills, Jebel Sifah, Hawana Salalah. От OMR 100 000. Объект от OMR 250 000 открывает ВНЖ на 5 лет.",
  },
};

const BREADCRUMB_NAMES: Record<Lang, { oman: string; service: string }> = {
  en: { oman: "Oman", service: "Buy Property" },
  fa: { oman: "عمان", service: "خرید ملک" },
  ar: { oman: "عُمان", service: "شراء عقار" },
  ru: { oman: "Оман", service: "Покупка недвижимости" },
};

const FAQ: Record<Lang, { q: string; a: string }[]> = {
  en: [
    { q: "Can foreigners buy freehold property in Oman?", a: "Yes — but only inside designated Integrated Tourism Complexes such as The Wave, Muscat Hills, Jebel Sifah and Hawana Salalah." },
    { q: "Does buying property give automatic residency?", a: "No. Property purchases at OMR 250,000+ qualify for the 5-year Investor Residency; OMR 500,000+ for 10 years. The application is a separate step." },
    { q: "Can I rent the property out?", a: "Yes. ITCs typically allow short-term and long-term rentals." },
    { q: "Can I take a mortgage as a foreigner?", a: "Some Omani banks offer mortgages to resident foreigners, typically up to 50–60% LTV." },
    { q: "Are there property taxes?", a: "No annual property tax. A one-off 3% transfer fee at the Ministry of Housing." },
  ],
  fa: [
    { q: "آیا خارجی‌ها می‌توانند ملک Freehold در عمان بخرند؟", a: "بله — ولی فقط در مجتمع‌های گردشگری مجاز (ITC) مانند Wave، Muscat Hills، Jebel Sifah و Hawana Salalah." },
    { q: "آیا خرید ملک، اقامت خودکار می‌دهد؟", a: "خیر. ملک ۲۵۰,۰۰۰+ ریال عمان واجد شرایط اقامت ۵ ساله است؛ ۵۰۰,۰۰۰+ برای ۱۰ ساله. درخواست جداگانه است." },
    { q: "آیا می‌توانم ملک را اجاره دهم؟", a: "بله. ITCها اجاره کوتاه‌مدت و بلندمدت را اجازه می‌دهند." },
    { q: "آیا به‌عنوان خارجی می‌توانم وام مسکن بگیرم؟", a: "برخی بانک‌های عمانی به خارجی دارای اقامت، تا ۵۰ تا ۶۰٪ LTV وام می‌دهند." },
    { q: "آیا مالیات ملک وجود دارد؟", a: "مالیات سالانه ندارد. ۳٪ هزینه یک‌باره انتقال در MOH." },
  ],
  ar: [
    { q: "هل يمكن للأجانب شراء عقار تملك حر في عُمان؟", a: "نعم — لكن فقط داخل المجمعات السياحية المعتمدة (ITC) مثل Wave وMuscat Hills وJebel Sifah وHawana Salalah." },
    { q: "هل شراء العقار يمنح إقامة تلقائياً؟", a: "لا. عقار 250 ألف+ يؤهل لإقامة 5 سنوات؛ 500 ألف+ لـ 10 سنوات. التقديم منفصل." },
    { q: "هل يمكنني تأجير العقار؟", a: "نعم. تسمح ITCs بالإيجار قصير وطويل المدى." },
    { q: "هل يمكنني الحصول على رهن كأجنبي؟", a: "بعض البنوك تمنح رهناً للأجانب المقيمين حتى 50 إلى 60٪ LTV." },
    { q: "هل توجد ضرائب عقارية؟", a: "لا توجد ضريبة سنوية. رسم نقل ملكية 3٪ مرة واحدة." },
  ],
  ru: [
    { q: "Иностранцы могут купить freehold-недвижимость в Омане?", a: "Да — но только в утверждённых ITC: The Wave, Muscat Hills, Jebel Sifah, Hawana Salalah." },
    { q: "Покупка автоматически даёт ВНЖ?", a: "Нет. От OMR 250 000 — 5 лет ВНЖ инвестора; от OMR 500 000 — 10 лет. Подача отдельным шагом." },
    { q: "Можно ли сдавать объект?", a: "Да. ITC обычно разрешают краткосрочную и долгосрочную аренду." },
    { q: "Может ли иностранец взять ипотеку?", a: "Некоторые банки предлагают ипотеку резидентам-иностранцам до 50–60% LTV." },
    { q: "Есть ли налог на недвижимость?", a: "Ежегодного налога нет. Единоразовый сбор 3% при регистрации." },
  ],
};

function getPageUrlForService(lang: Lang) {
  return getPageUrl(lang, "oman/buy-property/");
}

function getBreadcrumbSchema(lang: Lang) {
  const names = BREADCRUMB_NAMES[lang];
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: BREADCRUMB_HOME[lang], item: getPageUrl(lang) },
      { "@type": "ListItem", position: 2, name: names.oman, item: getPageUrl(lang, "oman/") },
      { "@type": "ListItem", position: 3, name: names.service, item: getPageUrlForService(lang) },
    ],
  };
}

function getServiceSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Oman Property Purchase Assistance",
    serviceType: "Real Estate Advisory",
    provider: { "@type": "Organization", name: "Residency24", url: "https://residency24.com" },
    areaServed: { "@type": "Country", name: "Oman" },
    offers: {
      "@type": "Offer",
      availability: "https://schema.org/InStock",
      priceCurrency: "OMR",
      price: "100000",
    },
  };
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

export async function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang: rawLang } = await params;
  const lang = (LANGS.includes(rawLang as Lang) ? rawLang : "en") as Lang;
  const seo = PAGE_SEO[lang];
  const config = LANG_CONFIG[lang];
  const pageUrl = getPageUrlForService(lang);

  const alternates: Record<string, string> = {};
  for (const l of LANGS) {
    alternates[LANG_CONFIG[l].hreflang] = getPageUrlForService(l);
  }
  alternates["x-default"] = getPageUrlForService("en");

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

export default async function OmanBuyPropertyLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang: rawLang } = await params;
  const lang = (LANGS.includes(rawLang as Lang) ? rawLang : "en") as Lang;

  const schemas = [getBreadcrumbSchema(lang), getServiceSchema(), getFaqSchema(lang)];

  return (
    <>
      {schemas.map((schema, i) => (
        <script
          key={`oman-property-schema-${i}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      {children}
    </>
  );
}
