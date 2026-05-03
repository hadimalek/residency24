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
    title: "Релокация, резидентство и бизнес в ОАЭ и Омане | Residency24",
    description: "Residency24 помогает русскоязычным клиентам выбрать путь для релокации, резидентства, открытия компании, покупки недвижимости, Golden Visa и семейного переезда в ОАЭ и Оман.",
    h1: "Резидентство, бизнес и инвестиции за рубежом — с поддержкой на русском языке",
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
    { q: "Можно ли получить резидентство в ОАЭ через компанию?", a: "Да, регистрация компании в свободной зоне или на материке ОАЭ — один из распространённых маршрутов к резидентской визе. Конкретные условия и сроки зависят от типа лицензии, структуры компании и требований выбранного органа." },
    { q: "Что лучше для русскоязычных клиентов: ОАЭ или Оман?", a: "ОАЭ обычно подходят для бизнеса, недвижимости и Golden Visa, а Оман — для более спокойной региональной релокации и инвестиционной резиденции. Подходящий вариант зависит от цели, бюджета и состава семьи." },
    { q: "Можно ли открыть банковский счёт после регистрации компании?", a: "Открытие корпоративного банковского счёта возможно, но требует отдельной проверки compliance со стороны банка. Сроки и итоговое решение зависят от профиля бенефициара и деятельности компании." },
    { q: "Можно ли перевезти семью?", a: "Да, основной заявитель, как правило, может включить супругу/супруга и детей в семейную визу. Точный список dependents и документы зависят от выбранного маршрута и страны." },
    { q: "Даёт ли покупка недвижимости право на резидентство?", a: "В ОАЭ покупка недвижимости определённой стоимости может давать право на инвесторскую или Golden Visa, но это не происходит автоматически и зависит от объекта, документов и требований органов." },
    { q: "Сколько стоит Golden Visa в ОАЭ?", a: "Итоговая стоимость зависит от выбранной программы, профиля заявителя и состава семьи. Мы делаем индивидуальную оценку кейса перед началом процесса." },
    { q: "Можно ли начать процесс удалённо?", a: "Многие шаги — предварительная оценка, подбор маршрута и подготовка документов — можно начать удалённо. Часть этапов (биометрия, открытие счёта) обычно требует личного присутствия." },
    { q: "Какие документы нужны для первичной оценки?", a: "Для предварительной оценки достаточно общей информации о цели, бюджете, стране, составе семьи и текущем гражданстве. Полный список документов формируется после выбора маршрута." },
    { q: "Что Residency24 не гарантирует?", a: "Мы не гарантируем одобрение со стороны государственных органов и не обещаем конкретные сроки или 100% результат. Мы помогаем выбрать подходящий маршрут и сопровождаем подготовку документов." },
  ],
};

export const BREADCRUMB_HOME: Record<Lang, string> = {
  fa: "خانه",
  en: "Home",
  ar: "الرئيسية",
  ru: "Главная",
};

export const ABOUT_SEO: Record<Lang, { title: string; description: string; h1: string }> = {
  fa: {
    title: "درباره رزیدنسی۲۴ | ۲ دفتر، ۵۰۰۰+ پرونده موفق",
    description: "رزیدنسی۲۴ از ۲۰۱۸ به ایرانیان در اخذ اقامت، ثبت شرکت و خرید ملک در امارات، عمان و ترکیه کمک می‌کند. دفاتر در دبی و مشهد. مشاوره رایگان.",
    h1: "رزیدنسی۲۴ — همراه مطمئن شما در مهاجرت سرمایه‌گذاری",
  },
  en: {
    title: "About Residency24 | 2 Offices, 5,000+ Success Cases",
    description: "Residency24 is a legal, transparent investment immigration firm with offices in Dubai & Mashhad. Helping investors with UAE, Oman & Turkey residency since 2018.",
    h1: "About Residency24 — Your Trusted Partner for Investment Immigration",
  },
  ar: {
    title: "عن Residency24 | مكتبان، +5000 حالة ناجحة",
    description: "Residency24 شركة متخصصة في الإقامة الاستثمارية بمكتبين في دبي ومشهد. خدمات قانونية وشفافة في الإمارات وعُمان وتركيا منذ 2018.",
    h1: "Residency24 — شريكك الموثوق في الهجرة الاستثمارية",
  },
  ru: {
    title: "О компании Residency24 | 2 офиса, 5000+ успешных дел",
    description: "Residency24 — легальная иммиграционная компания с офисами в Дубае и Мешхеде. Помогаем инвесторам с резидентством в ОАЭ, Омане и Турции с 2018 года.",
    h1: "О компании Residency24 — Ваш надёжный партнёр по инвестиционной иммиграции",
  },
};

// English is served at root (no /en prefix). Other locales keep the prefix.
export function localizedPath(lang: Lang, path: string = "") {
  // path should NOT have a leading slash; pass "" for the locale homepage.
  const normalized = path.replace(/^\/+/, "");
  if (lang === "en") return `/${normalized}`;
  return `/${lang}/${normalized}`;
}

export function getPageUrl(lang: Lang, path: string = "") {
  return `${BASE_URL}${localizedPath(lang, path)}`;
}

export function getAboutPageUrl(lang: Lang) {
  return getPageUrl(lang, "about/");
}

export function getBlogPageUrl(lang: Lang) {
  return getPageUrl(lang, "blog/");
}

export const BLOG_SEO: Record<Lang, {
  title: string;
  description: string;
  h1: string;
  eyebrow: string;
  sub: string;
  searchPlaceholder: string;
  allLabel: string;
  readMore: string;
  readingTimeUnit: string;
  noResults: string;
  noResultsSub: string;
}> = {
  fa: {
    title: "بلاگ | راهنماها و آموزش‌های تخصصی — Residency24",
    description: "راهنماها و آموزش‌های تخصصی درباره اقامت، سرمایه‌گذاری و کسب‌وکار در امارات، عمان و ترکیه.",
    h1: "راهنماها و آموزش‌های تخصصی",
    eyebrow: "آخرین مقالات",
    sub: "محتوای تخصصی درباره اقامت، سرمایه‌گذاری و کسب‌وکار در منطقه",
    searchPlaceholder: "جستجو در مقالات...",
    allLabel: "همه",
    readMore: "ادامه مطلب",
    readingTimeUnit: "دقیقه",
    noResults: "مقاله‌ای یافت نشد",
    noResultsSub: "فیلترها را تغییر دهید یا عبارت جستجو را بررسی کنید.",
  },
  en: {
    title: "Blog | Expert Guides & Resources — Residency24",
    description: "Expert guides and resources on residency, investment and company formation in UAE, Oman and Turkey.",
    h1: "Expert Guides & Tutorials",
    eyebrow: "Latest Articles",
    sub: "Specialist content on residency, investment and business in the region",
    searchPlaceholder: "Search articles...",
    allLabel: "All",
    readMore: "Read more",
    readingTimeUnit: "min",
    noResults: "No articles found",
    noResultsSub: "Try adjusting your filters or search term.",
  },
  ar: {
    title: "المدونة | أدلة ومحتوى متخصص — Residency24",
    description: "أدلة ومحتوى متخصص حول الإقامة والاستثمار وتأسيس الشركات في الإمارات وعُمان وتركيا.",
    h1: "الأدلة والدروس المتخصصة",
    eyebrow: "أحدث المقالات",
    sub: "محتوى متخصص حول الإقامة والاستثمار والأعمال في المنطقة",
    searchPlaceholder: "البحث في المقالات...",
    allLabel: "الكل",
    readMore: "اقرأ المزيد",
    readingTimeUnit: "دقيقة",
    noResults: "لم يتم العثور على مقالات",
    noResultsSub: "حاول تعديل الفلاتر أو مصطلح البحث.",
  },
  ru: {
    title: "Блог | Экспертные руководства — Residency24",
    description: "Экспертные руководства о резидентстве, инвестициях и ведении бизнеса в ОАЭ, Омане и Турции.",
    h1: "Экспертные руководства",
    eyebrow: "Последние статьи",
    sub: "Специализированный контент о резидентстве, инвестициях и бизнесе в регионе",
    searchPlaceholder: "Поиск статей...",
    allLabel: "Все",
    readMore: "Читать далее",
    readingTimeUnit: "мин",
    noResults: "Статьи не найдены",
    noResultsSub: "Попробуйте изменить фильтры или поисковый запрос.",
  },
};

export function getAboutOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": "https://residency24.com/#organization",
    "name": "Residency24",
    "url": "https://residency24.com",
    "logo": "https://residency24.com/logo512.png",
    "foundingDate": "2018",
    "numberOfEmployees": {
      "@type": "QuantitativeValue",
      "value": 15,
    },
    "areaServed": ["AE", "OM", "TR", "IR"],
    "location": [
      {
        "@type": "Place",
        "name": "Residency24 Dubai",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Al Khail Heights Apartment Building, RB 03A, No. 218",
          "addressLocality": "Dubai",
          "addressCountry": "AE",
        },
        "telephone": "+971562009131",
      },
      {
        "@type": "Place",
        "name": "رزیدنسی۲۴ مشهد",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "نبش فرهاد ۱۴",
          "addressLocality": "مشهد",
          "addressCountry": "IR",
        },
      },
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "availableLanguage": ["Persian", "English", "Arabic", "Russian"],
    },
  };
}

export function getAboutBreadcrumbSchema(lang: Lang) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: BREADCRUMB_HOME[lang], item: getPageUrl(lang) },
      { "@type": "ListItem", position: 2, name: ABOUT_SEO[lang].title.split("|")[0].trim(), item: getAboutPageUrl(lang) },
    ],
  };
}

export function getOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Residency24",
    url: `${BASE_URL}/`,
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
    url: `${BASE_URL}/`,
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
