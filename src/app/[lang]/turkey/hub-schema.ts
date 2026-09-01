import type { Lang } from "@/translations";
import { BREADCRUMB_HOME, getPageUrl } from "@/lib/seo";

/**
 * Schema for the Turkey hub page itself.
 *
 * These lived in turkey/layout.tsx, which also wraps the four service routes
 * below it, so every one of those pages emitted the hub's BreadcrumbList,
 * FAQPage and Service on top of its own — two of each type per page. A layout
 * can only carry schema that is true for its whole subtree; page-specific
 * schema belongs to the page, so it lives here and turkey/page.tsx renders it.
 *
 * The layout still imports getTurkeyUrl for its metadata alternates.
 */
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

export function getTurkeyUrl(lang: Lang) {
  return getPageUrl(lang, "turkey/");
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
      { "@type": "ListItem", position: 2, name: TURKEY_BREADCRUMB[lang], item: getTurkeyUrl(lang) },
    ],
  };
}

export function getServiceSchema() {
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
