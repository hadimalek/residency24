import type { Lang } from "@/translations";

const BASE_URL = "https://residency24.com";

export const LANGS: Lang[] = ["fa", "en", "ar", "ru"];

export const LANG_CONFIG: Record<Lang, { dir: "rtl" | "ltr"; locale: string; hreflang: string }> = {
  fa: { dir: "rtl", locale: "fa_IR", hreflang: "fa" },
  en: { dir: "ltr", locale: "en_US", hreflang: "en" },
  ar: { dir: "rtl", locale: "ar_AE", hreflang: "ar" },
  ru: { dir: "ltr", locale: "ru_RU", hreflang: "ru" },
};

export const SEO: Record<Lang, { title: string; description: string; h1: string; ogImage: string }> = {
  fa: {
    title: "رزیدنسی۲۴ | اقامت، ثبت شرکت و خرید ملک در دبی و امارات",
    description: "اقامت قانونی، ثبت شرکت ۱۰۰٪ و خرید ملک در امارات، عمان و ترکیه. مشاوره رایگان.",
    h1: "رزیدنسی۲۴ — همراه مطمئن شما در اخذ اقامت و سرمایه‌گذاری خارجی",
    ogImage: `${BASE_URL}/assets/og-image-fa.jpg`,
  },
  en: {
    title: "Residency24 | UAE Golden Visa, Company Setup & Property Investment",
    description: "Your trusted partner for UAE golden visa, company registration & property investment. 5000+ cases.",
    h1: "Open Your Global Future with Residency24",
    ogImage: `${BASE_URL}/assets/og-image-en.jpg`,
  },
  ar: {
    title: "Residency24 | تأسيس الشركات والإقامة الذهبية والعقارات في الإمارات",
    description: "شريكك الموثوق للحصول على الإقامة الذهبية وتأسيس الشركات والاستثمار العقاري في الإمارات وعُمان وتركيا.",
    h1: "افتح مستقبلك العالمي مع Residency24",
    ogImage: `${BASE_URL}/assets/og-image-ar.jpg`,
  },
  ru: {
    title: "Residency24 | Золотая виза ОАЭ, открытие компании и инвестиции в недвижимость",
    description: "Ваш надёжный партнёр для получения золотой визы, регистрации компании и инвестиций в недвижимость в ОАЭ, Омане и Турции.",
    h1: "Откройте своё глобальное будущее с Residency24",
    ogImage: `${BASE_URL}/assets/og-image-ru.jpg`,
  },
};

export const FAQ_SCHEMA: Record<Lang, { q: string; a: string }[]> = {
  fa: [
    { q: "ویزای طلایی امارات چیست؟", a: "ویزای طلایی امارات یک ویزای اقامت بلندمدت (۵ یا ۱۰ ساله) است که به سرمایه‌گذاران، کارآفرینان و متخصصان اعطا می‌شود. هزینه از ۲۰,۰۰۰ درهم شروع می‌شود و نیاز به حداقل اقامت ندارد." },
    { q: "هزینه ثبت شرکت در دبی چقدر است؟", a: "هزینه ثبت شرکت در دبی از ۲۱,۰۰۰ درهم برای شرکت فری‌زون با مالکیت ۱۰۰٪ خارجی و بدون نیاز به شریک محلی شروع می‌شود." },
    { q: "آیا با خرید ملک در دبی می‌توان اقامت گرفت؟", a: "بله. خرید ملک از ۷۵۰,۰۰۰ درهم ویزای ۲ ساله سرمایه‌گذار اعطا می‌کند. ملک ۲ میلیون درهم به بالا واجد شرایط ویزای طلایی است." },
    { q: "آیا Residency24 به مشتریان ایرانی، روسی و عربی خدمات می‌دهد؟", a: "بله. Residency24 خدمات کامل را به زبان‌های فارسی، عربی، روسی و انگلیسی با دفاتر در دبی، مشهد و مسقط ارائه می‌دهد." },
  ],
  en: [
    { q: "What is the UAE Golden Visa?", a: "The UAE Golden Visa is a long-term residency visa (5 or 10 years) granted to investors, entrepreneurs, and skilled professionals. It starts from AED 20,000 and requires no minimum stay." },
    { q: "How much does company registration in Dubai cost?", a: "Company registration in Dubai starts from AED 21,000 for a Free Zone company with 100% foreign ownership and no local sponsor required." },
    { q: "Can I get residency by buying property in Dubai?", a: "Yes. Purchasing property from AED 750,000 grants a 2-year investor visa. Properties worth AED 2 million or more qualify for the Golden Visa." },
    { q: "Does Residency24 serve Iranian, Russian, and Arabic clients?", a: "Yes. Residency24 provides full services in Persian, Arabic, Russian, and English with offices in Dubai, Mashhad, and Muscat." },
  ],
  ar: [
    { q: "ما هي الإقامة الذهبية في الإمارات؟", a: "الإقامة الذهبية هي تأشيرة إقامة طويلة الأجل (5 أو 10 سنوات) تُمنح للمستثمرين ورواد الأعمال والمتخصصين. تبدأ من 20,000 درهم ولا تتطلب حد أدنى للإقامة." },
    { q: "كم تكلفة تأسيس شركة في دبي؟", a: "يبدأ تأسيس الشركات في دبي من 21,000 درهم لشركة منطقة حرة بملكية أجنبية 100% وبدون كفيل محلي." },
    { q: "هل يمكنني الحصول على إقامة بشراء عقار في دبي؟", a: "نعم. شراء عقار من 750,000 درهم يمنح تأشيرة مستثمر لمدة عامين. العقارات بقيمة 2 مليون درهم أو أكثر تؤهل للإقامة الذهبية." },
    { q: "هل تخدم Residency24 العملاء الإيرانيين والروس والعرب؟", a: "نعم. تقدم Residency24 خدمات كاملة بالفارسية والعربية والروسية والإنجليزية مع مكاتب في دبي ومشهد ومسقط." },
  ],
  ru: [
    { q: "Что такое Золотая виза ОАЭ?", a: "Золотая виза ОАЭ — это долгосрочная резидентская виза (5 или 10 лет), выдаваемая инвесторам, предпринимателям и квалифицированным специалистам. Стоимость от 20 000 дирхамов, минимальный срок пребывания не требуется." },
    { q: "Сколько стоит регистрация компании в Дубае?", a: "Регистрация компании в Дубае начинается от 21 000 дирхамов для компании в свободной зоне с 100% иностранной собственностью без местного спонсора." },
    { q: "Можно ли получить ВНЖ при покупке недвижимости в Дубае?", a: "Да. Покупка недвижимости от 750 000 дирхамов даёт инвесторскую визу на 2 года. Недвижимость от 2 млн дирхамов даёт право на Золотую визу." },
    { q: "Обслуживает ли Residency24 иранских, российских и арабских клиентов?", a: "Да. Residency24 предоставляет полный спектр услуг на персидском, арабском, русском и английском языках с офисами в Дубае, Мешхеде и Маскате." },
  ],
};

export const BREADCRUMB_HOME: Record<Lang, string> = {
  fa: "خانه",
  en: "Home",
  ar: "الرئيسية",
  ru: "Главная",
};

export function getPageUrl(lang: Lang) {
  return `${BASE_URL}/${lang}/`;
}

export function getOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Residency24",
    url: `${BASE_URL}/en/`,
    logo: { "@type": "ImageObject", url: `${BASE_URL}/assets/residency24logo512.png`, width: 512, height: 512 },
    telephone: "+971562009131",
    email: "info@residency24.com",
    sameAs: [
      "https://www.instagram.com/residency24",
      "https://t.me/residency24",
      "https://www.linkedin.com/company/residency24",
    ],
    address: { "@type": "PostalAddress", streetAddress: "Sheikh Zayed Road", addressLocality: "Dubai", addressCountry: "AE" },
  };
}

export function getLocalBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Residency24",
    telephone: "+971562009131",
    email: "info@residency24.com",
    url: `${BASE_URL}/en/`,
    address: { "@type": "PostalAddress", streetAddress: "Sheikh Zayed Road", addressLocality: "Dubai", addressRegion: "Dubai", addressCountry: "AE" },
    geo: { "@type": "GeoCoordinates", latitude: "25.2048", longitude: "55.2708" },
    openingHoursSpecification: [
      { "@type": "OpeningHoursSpecification", dayOfWeek: ["Monday", "Tuesday", "Wednesday"], opens: "09:00", closes: "18:00" },
      { "@type": "OpeningHoursSpecification", dayOfWeek: ["Thursday"], opens: "09:00", closes: "14:00" },
    ],
  };
}

export function getFaqSchema(lang: Lang) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_SCHEMA[lang].map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}

export function getBreadcrumbSchema(lang: Lang) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: BREADCRUMB_HOME[lang], item: getPageUrl(lang) },
    ],
  };
}
