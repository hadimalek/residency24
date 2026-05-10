import type { Metadata } from "next";
import type { Lang } from "@/translations";
import { LANGS, LANG_CONFIG, BREADCRUMB_HOME, getOrganizationSchema, getPageUrl } from "@/lib/seo";

const HUB_SEO: Record<Lang, { title: string; description: string }> = {
  en: {
    title: "Turkey Citizenship, Residency & Property 2026 | Residency24",
    description:
      "Turkish citizenship by investment from $400,000 in property — passport in 6–8 months. Investor residency from $200,000. Family included. 110+ visa-free countries. Free expert consultation.",
  },
  fa: {
    title: "شهروندی، اقامت و خرید ملک ترکیه ۲۰۲۶ | رزیدنسی۲۴",
    description:
      "شهروندی ترکیه با سرمایه‌گذاری از ۴۰۰,۰۰۰ دلار در ملک — پاسپورت در ۶ تا ۸ ماه. اقامت سرمایه‌گذار از ۲۰۰,۰۰۰ دلار. شامل خانواده. سفر بدون ویزا به ۱۱۰+ کشور. مشاوره رایگان.",
  },
  ar: {
    title: "الجنسية والإقامة وعقارات تركيا 2026 | Residency24",
    description:
      "الجنسية التركية بالاستثمار من 400,000 دولار في العقار — جواز سفر خلال 6 إلى 8 أشهر. إقامة مستثمر من 200,000 دولار. العائلة مشمولة. +110 دولة بدون تأشيرة. استشارة مجانية.",
  },
  ru: {
    title: "Гражданство, ВНЖ и недвижимость Турции 2026 | Residency24",
    description:
      "Гражданство Турции за инвестиции от 400 000 $ в недвижимости — паспорт за 6–8 месяцев. ВНЖ инвестора от 200 000 $. Семья включена. 110+ стран без визы. Бесплатная консультация.",
  },
};

const FAQ: Record<Lang, { q: string; a: string }[]> = {
  en: [
    { q: "What is the minimum investment for Turkish citizenship in 2026?", a: "$400,000 in real estate held for 3 years is the most popular route. Bank deposit, government bonds and fixed capital routes also qualify at $500,000, or 50 employees." },
    { q: "Can foreigners buy freehold property in Turkey?", a: "Yes, in most areas of Turkey, except certain restricted military or border zones. The TAPU is registered in your name and is fully transferable." },
    { q: "What changes in Turkey on May 1, 2026?", a: "All real estate transactions must go through the Güvenli Ödeme Sistemi (Safe Payment System). Residence permit fees rise to $631/year or $1,857/3 years." },
    { q: "Does Turkey allow dual citizenship?", a: "Yes. You keep your original passport and gain Turkish citizenship in addition." },
    { q: "Are family members included?", a: "Yes — spouse and dependent children under 18 are included in the same investment with no extra minimum." },
  ],
  fa: [
    { q: "حداقل سرمایه برای شهروندی ترکیه در ۲۰۲۶ چقدر است؟", a: "۴۰۰,۰۰۰ دلار در ملک با نگهداری ۳ سال، محبوب‌ترین مسیر است. سپرده بانکی، اوراق دولتی و سرمایه ثابت هم با ۵۰۰,۰۰۰ دلار یا ۵۰ کارمند واجد شرایط‌اند." },
    { q: "آیا خارجی‌ها می‌توانند ملک Freehold در ترکیه بخرند؟", a: "بله، در بیشتر نقاط ترکیه به جز مناطق نظامی یا مرزی محدود. TAPU به نام شما ثبت می‌شود." },
    { q: "از ۱ مه ۲۰۲۶ چه چیزی تغییر می‌کند؟", a: "تمام معاملات ملک باید از طریق Güvenli Ödeme Sistemi (سیستم پرداخت امن) انجام شود. هزینه residence permit به ۶۳۱ دلار/سال یا ۱,۸۵۷ دلار/۳ سال افزایش می‌یابد." },
    { q: "آیا ترکیه تابعیت دوگانه را اجازه می‌دهد؟", a: "بله. پاسپورت اولیه‌تان حفظ می‌شود و علاوه بر آن شهروندی ترکیه را می‌گیرید." },
    { q: "آیا خانواده شامل می‌شود؟", a: "بله — همسر و فرزندان زیر ۱۸ سال در همان سرمایه‌گذاری بدون حداقل اضافی شامل می‌شوند." },
  ],
  ar: [
    { q: "ما الحد الأدنى لاستثمار الجنسية التركية في 2026؟", a: "400,000 دولار في العقار مع احتفاظ 3 سنوات هو الأكثر شعبية. الإيداع البنكي والسندات الحكومية ورأس المال الثابت مؤهلة بـ 500,000 دولار أو 50 موظف." },
    { q: "هل يمكن للأجانب شراء عقار تملك حر في تركيا؟", a: "نعم، في معظم أنحاء تركيا، باستثناء المناطق العسكرية أو الحدودية المقيدة. TAPU يُسجل باسمك." },
    { q: "ما الذي يتغير في 1 مايو 2026؟", a: "جميع معاملات العقار يجب أن تتم عبر Güvenli Ödeme Sistemi (نظام الدفع الآمن). رسوم الإقامة ترتفع إلى 631 دولار/سنة أو 1,857 دولار/3 سنوات." },
    { q: "هل تركيا تسمح بازدواجية الجنسية؟", a: "نعم. تحتفظ بجواز سفرك الأصلي وتحصل على الجنسية التركية إضافة." },
    { q: "هل أفراد العائلة مشمولون؟", a: "نعم — الزوج والأبناء المعالون دون 18 مشمولون بنفس الاستثمار بدون حد أدنى إضافي." },
  ],
  ru: [
    { q: "Какой минимум инвестиций для гражданства Турции в 2026?", a: "400 000 $ в недвижимости с удержанием 3 года — самый популярный путь. Депозит, гособлигации и основной капитал — от 500 000 $ или 50 сотрудников." },
    { q: "Могут ли иностранцы покупать freehold-недвижимость в Турции?", a: "Да, почти везде в Турции, кроме отдельных военных и приграничных зон. ТАПУ оформляется на ваше имя." },
    { q: "Что меняется с 1 мая 2026?", a: "Все сделки с недвижимостью должны проходить через Güvenli Ödeme Sistemi (Систему безопасных платежей). Сборы за ВНЖ растут до 631 $/год или 1 857 $/3 года." },
    { q: "Разрешает ли Турция двойное гражданство?", a: "Да. Сохраняете оригинальный паспорт и получаете турецкое гражданство дополнительно." },
    { q: "Включаются ли члены семьи?", a: "Да — супруг и дети-иждивенцы до 18 лет включены в ту же инвестицию без дополнительного минимума." },
  ],
};

const TURKEY_BREADCRUMB: Record<Lang, string> = {
  en: "Turkey",
  fa: "ترکیه",
  ar: "تركيا",
  ru: "Турция",
};

function getTurkeyUrl(lang: Lang) {
  return getPageUrl(lang, "turkey/");
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
      { "@type": "ListItem", position: 2, name: TURKEY_BREADCRUMB[lang], item: getTurkeyUrl(lang) },
    ],
  };
}

function getServiceSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Turkey Citizenship, Residency & Investment Services",
    serviceType: "Citizenship by Investment & Immigration Consulting",
    provider: { "@type": "Organization", name: "Residency24", url: "https://residency24.com" },
    areaServed: { "@type": "Country", name: "Turkey" },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Turkey Services",
      itemListElement: [
        { "@type": "Offer", name: "Turkish Citizenship by Investment", price: "400000", priceCurrency: "USD" },
        { "@type": "Offer", name: "Turkey Investor Residency", price: "200000", priceCurrency: "USD" },
        { "@type": "Offer", name: "Turkey Company Registration", price: "1500", priceCurrency: "USD" },
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
  const pageUrl = getTurkeyUrl(lang);

  const alternates: Record<string, string> = {};
  for (const l of LANGS) {
    alternates[LANG_CONFIG[l].hreflang] = getTurkeyUrl(l);
  }
  alternates["x-default"] = getTurkeyUrl("en");

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

export default async function TurkeyHubLayout({
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
          key={`turkey-hub-schema-${i}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      {children}
    </>
  );
}
