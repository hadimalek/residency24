import type { Lang } from "@/translations";
import { BREADCRUMB_HOME, getPageUrl } from "@/lib/seo";

/**
 * Schema for the Oman hub page itself.
 *
 * These lived in oman/layout.tsx, which also wraps the four service routes
 * below it, so every one of those pages emitted the hub's BreadcrumbList,
 * FAQPage and Service on top of its own — two of each type per page. A layout
 * can only carry schema that is true for its whole subtree; page-specific
 * schema belongs to the page, so it lives here and oman/page.tsx renders it.
 *
 * The layout still imports getOmanUrl for its metadata alternates.
 */
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

export function getOmanUrl(lang: Lang) {
  return getPageUrl(lang, "oman/");
}

export function getFaqSchema(lang: Lang) {
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

export function getBreadcrumbSchema(lang: Lang) {
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

export function getServiceSchema() {
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
