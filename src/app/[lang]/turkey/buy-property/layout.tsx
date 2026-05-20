import type { Metadata } from "next";
import type { Lang } from "@/translations";
import { LANGS, LANG_CONFIG, BREADCRUMB_HOME, getPageUrl } from "@/lib/seo";

const PAGE_SEO: Record<Lang, { title: string; description: string }> = {
  en: {
    title: "Buy Property in Turkey 2026 | Istanbul, Antalya, Bodrum — Residency24",
    description:
      "Foreigners can buy freehold property across Turkey from $80,000. $200K → Investor Residency, $400K → Citizenship. Strong capital appreciation and 5–8% rental yields. Full process and 2026 costs.",
  },
  fa: {
    title: "خرید ملک در ترکیه ۲۰۲۶ | استانبول، آنتالیا، بدروم — رزیدنسی۲۴",
    description:
      "خارجی‌ها می‌توانند ملک Freehold در سراسر ترکیه از ۸۰,۰۰۰ دلار بخرند. ۲۰۰K → اقامت سرمایه‌گذار، ۴۰۰K → شهروندی. رشد ارزش قوی و بازده اجاره ۵ تا ۸٪. فرآیند کامل و هزینه‌های ۲۰۲۶.",
  },
  ar: {
    title: "شراء عقار في تركيا 2026 | إسطنبول، أنطاليا، بودروم — Residency24",
    description:
      "يمكن للأجانب شراء عقار تملك حر في تركيا من 80,000 دولار. 200K → إقامة المستثمر، 400K → الجنسية. ارتفاع رأسمالي قوي وعوائد إيجار 5–8٪. العملية الكاملة وتكاليف 2026.",
  },
  ru: {
    title: "Покупка недвижимости в Турции 2026 | Стамбул, Анталья, Бодрум — Residency24",
    description:
      "Иностранцы могут покупать freehold-недвижимость по всей Турции от 80 000 $. $200K → ВНЖ инвестора, $400K → гражданство. Сильный рост капитала и 5–8% доходности аренды.",
  },
};

const BREADCRUMB_NAMES: Record<Lang, { turkey: string; service: string }> = {
  en: { turkey: "Turkey", service: "Buy Property" },
  fa: { turkey: "ترکیه", service: "خرید ملک" },
  ar: { turkey: "تركيا", service: "شراء عقار" },
  ru: { turkey: "Турция", service: "Покупка недвижимости" },
};

const FAQ: Record<Lang, { q: string; a: string }[]> = {
  en: [
    { q: "Are there areas where foreigners cannot buy?", a: "Military, strategic security and some border zones are restricted. Standard residential areas in Istanbul, Antalya, Bodrum, Bursa, Izmir and Ankara are fully open." },
    { q: "What's the difference between $200K and $400K thresholds?", a: "$200K gives Investor Residency. $400K + 3-year hold gives full citizenship." },
    { q: "Can I take a Turkish mortgage as a foreigner?", a: "Yes, but typically up to 50% LTV with rates 4–6 points above base." },
    { q: "What is the Safe Payment System?", a: "From May 1, 2026, all property payments must go through bank-managed escrow that releases only after TAPU transfer." },
    { q: "Can I combine multiple properties to reach $400K?", a: "Yes, residential, commercial or land combined to $400K with 3-year no-sell annotation qualifies." },
  ],
  fa: [
    { q: "آیا مناطقی هست که خارجی‌ها نمی‌توانند بخرند؟", a: "مناطق نظامی، امنیتی و برخی نواحی مرزی محدود است. مناطق مسکونی استانبول، آنتالیا، بدروم، بورسا، ازمیر و آنکارا کاملاً باز است." },
    { q: "تفاوت آستانه ۲۰۰K و ۴۰۰K چیست؟", a: "۲۰۰K اقامت سرمایه‌گذار. ۴۰۰K + ۳ سال نگهداری شهروندی کامل." },
    { q: "آیا به‌عنوان خارجی می‌توانم وام مسکن ترکیه بگیرم؟", a: "بله، معمولاً تا ۵۰٪ LTV با نرخ ۴ تا ۶ درصد بالاتر از پایه." },
    { q: "سیستم پرداخت امن چیست؟", a: "از ۱ مه ۲۰۲۶ تمام پرداخت‌ها باید از escrow بانکی عبور کند که فقط بعد از انتقال TAPU آزاد می‌شود." },
    { q: "آیا می‌توانم چند ملک ترکیب کنم تا به ۴۰۰K برسم؟", a: "بله، مسکونی/تجاری/زمین با مجموع ۴۰۰K و annotation ۳ ساله عدم فروش." },
  ],
  ar: [
    { q: "هل توجد مناطق لا يمكن للأجانب الشراء فيها؟", a: "المناطق العسكرية والأمنية وبعض المناطق الحدودية مقيدة. المناطق السكنية في إسطنبول وأنطاليا وبودروم وبورصة وإزمير وأنقرة مفتوحة بالكامل." },
    { q: "ما الفرق بين 200K و 400K؟", a: "200K تمنح إقامة المستثمر. 400K + احتفاظ 3 سنوات تمنح الجنسية الكاملة." },
    { q: "هل يمكنني الحصول على رهن تركي كأجنبي؟", a: "نعم، عادة حتى 50٪ من القيمة بنسب 4 إلى 6 نقاط فوق القاعدة." },
    { q: "ما هو نظام الدفع الآمن؟", a: "من 1 مايو 2026 يجب أن تتم جميع المدفوعات عبر حساب ضمان بنكي يفرج عنها فقط بعد نقل TAPU." },
    { q: "هل يمكن دمج عدة عقارات للوصول إلى 400K؟", a: "نعم، سكني/تجاري/أرض بإجمالي 400K مع annotation عدم البيع لـ 3 سنوات." },
  ],
  ru: [
    { q: "Есть ли районы, где иностранцам нельзя покупать?", a: "Военные, стратегические и приграничные зоны ограничены. Стандартные жилые районы в Стамбуле, Анталье, Бодруме, Бурсе, Измире и Анкаре полностью открыты." },
    { q: "В чём разница порогов $200K и $400K?", a: "$200K — ВНЖ инвестора. $400K + 3 года удержания — полное гражданство." },
    { q: "Можно ли иностранцу взять турецкую ипотеку?", a: "Да, обычно до 50% LTV со ставкой на 4–6 п.п. выше базовой." },
    { q: "Что такое Система безопасных платежей?", a: "С 1 мая 2026 все платежи идут через банковский эскроу, который освобождает средства только после передачи ТАПУ." },
    { q: "Можно ли объединить несколько объектов до $400K?", a: "Да — жильё/коммерция/земля на $400K с 3-летней отметкой запрета продажи." },
  ],
};

function getPageUrlForService(lang: Lang) {
  return getPageUrl(lang, "turkey/buy-property/");
}

function getBreadcrumbSchema(lang: Lang) {
  const names = BREADCRUMB_NAMES[lang];
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: BREADCRUMB_HOME[lang], item: getPageUrl(lang) },
      { "@type": "ListItem", position: 2, name: names.turkey, item: getPageUrl(lang, "turkey/") },
      { "@type": "ListItem", position: 3, name: names.service, item: getPageUrlForService(lang) },
    ],
  };
}

function getServiceSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Turkey Property Purchase Assistance",
    serviceType: "Real Estate Advisory",
    provider: { "@type": "Organization", name: "Residency24", url: "https://residency24.com" },
    areaServed: { "@type": "Country", name: "Turkey" },
    offers: {
      "@type": "Offer",
      availability: "https://schema.org/InStock",
      priceCurrency: "USD",
      price: "80000",
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

export default async function TurkeyBuyPropertyLayout({
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
          key={`turkey-property-schema-${i}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      {children}
    </>
  );
}
