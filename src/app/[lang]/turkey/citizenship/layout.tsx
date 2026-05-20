import type { Metadata } from "next";
import type { Lang } from "@/translations";
import { LANGS, LANG_CONFIG, BREADCRUMB_HOME, getPageUrl } from "@/lib/seo";

const PAGE_SEO: Record<Lang, { title: string; description: string }> = {
  en: {
    title: "Turkish Citizenship by Investment 2026 | $400K Property Route — Residency24",
    description:
      "Turkish citizenship in 6–8 months from $400,000 in real estate. Family included (spouse + children under 18). Visa-free to 110+ countries. Full process, costs and 2026 updates explained.",
  },
  fa: {
    title: "شهروندی ترکیه با سرمایه‌گذاری ۲۰۲۶ | مسیر ملک ۴۰۰K — رزیدنسی۲۴",
    description:
      "شهروندی ترکیه در ۶ تا ۸ ماه از ۴۰۰,۰۰۰ دلار ملک. شامل خانواده (همسر + فرزندان زیر ۱۸). سفر بدون ویزا به ۱۱۰+ کشور. فرآیند کامل، هزینه‌ها و تغییرات ۲۰۲۶.",
  },
  ar: {
    title: "الجنسية التركية بالاستثمار 2026 | مسار العقار 400 ألف $ — Residency24",
    description:
      "الجنسية التركية خلال 6 إلى 8 أشهر من 400,000 دولار في العقار. العائلة مشمولة (الزوج + الأبناء دون 18). +110 دولة بدون تأشيرة. العملية الكاملة والتكاليف وتحديثات 2026.",
  },
  ru: {
    title: "Гражданство Турции по инвестициям 2026 | Маршрут $400K в недвижимости — Residency24",
    description:
      "Гражданство Турции за 6–8 месяцев от 400 000 $ в недвижимости. Семья включена (супруг + дети до 18). 110+ стран без визы. Полный процесс, расходы и обновления 2026.",
  },
};

const BREADCRUMB_NAMES: Record<Lang, { turkey: string; service: string }> = {
  en: { turkey: "Turkey", service: "Citizenship by Investment" },
  fa: { turkey: "ترکیه", service: "شهروندی با سرمایه‌گذاری" },
  ar: { turkey: "تركيا", service: "الجنسية بالاستثمار" },
  ru: { turkey: "Турция", service: "Гражданство по инвестициям" },
};

const FAQ: Record<Lang, { q: string; a: string }[]> = {
  en: [
    { q: "Can I keep my original citizenship?", a: "Yes. Turkey allows dual nationality. Some home countries restrict it — we check yours during onboarding." },
    { q: "Are there restricted nationalities?", a: "Citizens of Syria, Armenia, North Korea, Cuba and a few other countries cannot apply. Iranians, Russians, Saudis and most others are eligible." },
    { q: "Are children included?", a: "Yes. Children under 18 are included with no extra minimum. 18–25 may be included if unmarried students dependent on the main applicant." },
    { q: "Do I have to live in Turkey?", a: "No minimum stay requirement before or after citizenship is granted." },
    { q: "Can I sell after 3 years?", a: "Yes. After 3 years from TAPU registration, you can sell freely without affecting your citizenship." },
  ],
  fa: [
    { q: "آیا تابعیت اصلی‌ام را حفظ می‌کنم؟", a: "بله. ترکیه تابعیت دوگانه را می‌پذیرد. برخی کشورهای مبدأ آن را محدود می‌کنند — در onboarding بررسی می‌کنیم." },
    { q: "آیا ملیت‌های ممنوع وجود دارد؟", a: "شهروندان سوریه، ارمنستان، کره شمالی، کوبا و چند کشور دیگر نمی‌توانند اقدام کنند. ایرانی‌ها، روس‌ها، عربستانی‌ها و اکثر دیگر واجد شرایط‌اند." },
    { q: "آیا فرزندان شامل می‌شوند؟", a: "بله. فرزندان زیر ۱۸ بدون حداقل اضافی شامل می‌شوند. ۱۸ تا ۲۵ سال در صورت مجرد و دانشجو بودن وابسته." },
    { q: "آیا باید در ترکیه زندگی کنم؟", a: "هیچ حداقل اقامتی قبل یا بعد از شهروندی وجود ندارد." },
    { q: "آیا می‌توانم بعد از ۳ سال بفروشم؟", a: "بله. ۳ سال پس از ثبت TAPU، آزادانه قابل فروش بدون تأثیر بر شهروندی." },
  ],
  ar: [
    { q: "هل أحتفظ بجنسيتي الأصلية؟", a: "نعم. تركيا تسمح بازدواجية الجنسية. بعض دول الأصل تقيدها — نتحقق أثناء onboarding." },
    { q: "هل توجد جنسيات مقيدة؟", a: "مواطنو سوريا وأرمينيا وكوريا الشمالية وكوبا وقليل من البلدان الأخرى لا يمكنهم التقديم. الإيرانيون والروس والسعوديون ومعظم الجنسيات الأخرى مؤهلون." },
    { q: "هل الأبناء مشمولون؟", a: "نعم. الأبناء دون 18 مشمولون بدون حد أدنى إضافي. 18–25 إذا كانوا غير متزوجين وطلاب معالين." },
    { q: "هل يجب أن أعيش في تركيا؟", a: "لا يوجد حد أدنى للإقامة قبل أو بعد منح الجنسية." },
    { q: "هل يمكنني البيع بعد 3 سنوات؟", a: "نعم. بعد 3 سنوات من تسجيل TAPU، يمكنك البيع بحرية دون التأثير على الجنسية." },
  ],
  ru: [
    { q: "Сохраняю ли я оригинальное гражданство?", a: "Да. Турция допускает двойное гражданство. Некоторые страны происхождения ограничивают — проверяем при онбординге." },
    { q: "Есть ли ограничения по гражданству?", a: "Граждане Сирии, Армении, КНДР, Кубы и нескольких других не могут подать. Россияне, иранцы, саудиты и большинство других — могут." },
    { q: "Включаются ли дети?", a: "Да. Дети до 18 включены без увеличения минимума. 18–25 — если не в браке и студенты-иждивенцы." },
    { q: "Нужно ли жить в Турции?", a: "Нет требований к минимальному пребыванию ни до, ни после получения гражданства." },
    { q: "Можно ли продать через 3 года?", a: "Да. Через 3 года с регистрации ТАПУ — свободно, без влияния на гражданство." },
  ],
};

function getPageUrlForService(lang: Lang) {
  return getPageUrl(lang, "turkey/citizenship/");
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
    name: "Turkish Citizenship by Investment Application Assistance",
    serviceType: "Citizenship by Investment Consulting",
    provider: { "@type": "Organization", name: "Residency24", url: "https://residency24.com" },
    areaServed: { "@type": "Country", name: "Turkey" },
    offers: {
      "@type": "Offer",
      availability: "https://schema.org/InStock",
      priceCurrency: "USD",
      price: "400000",
    },
  };
}

function getHowToSchema(lang: Lang) {
  const titles: Record<Lang, string> = {
    en: "How to Apply for Turkish Citizenship by Investment",
    fa: "نحوه درخواست شهروندی ترکیه با سرمایه‌گذاری",
    ar: "كيف تتقدم بطلب الجنسية التركية بالاستثمار",
    ru: "Как подать на гражданство Турции по инвестициям",
  };
  const stepsByLang: Record<Lang, { name: string; text: string }[]> = {
    en: [
      { name: "Tax ID + bank account", text: "Get a Turkish tax number and open a Turkish bank account in your name." },
      { name: "Property selection + SPK valuation", text: "Pick a property worth USD 400,000+ and get an SPK-certified valuation report." },
      { name: "Sale contract + Safe Payment", text: "Sign the SPA and pay through Güvenli Ödeme Sistemi (mandatory escrow from May 2026)." },
      { name: "TAPU + 3-year annotation", text: "Transfer the title at the Land Registry with the 3-year no-sell annotation." },
      { name: "Residence permit", text: "Obtain health insurance, biometrics and a temporary residence permit." },
      { name: "Citizenship application + passport", text: "Submit the citizenship application; receive Turkish passport in 6–8 months." },
    ],
    fa: [
      { name: "کد مالیاتی + حساب بانکی", text: "کد مالیاتی ترکیه را گرفته و حساب بانکی به نام خود باز کنید." },
      { name: "انتخاب ملک + ارزیابی SPK", text: "ملکی به ارزش ۴۰۰,۰۰۰ دلار+ انتخاب کنید و گزارش ارزیابی SPK بگیرید." },
      { name: "قرارداد فروش + پرداخت امن", text: "SPA امضا کنید و از طریق Güvenli Ödeme Sistemi پرداخت کنید (اجباری از مه ۲۰۲۶)." },
      { name: "TAPU + annotation ۳ ساله", text: "سند را در اداره ثبت با annotation ۳ ساله عدم فروش انتقال دهید." },
      { name: "مجوز اقامت", text: "بیمه سلامت، بیومتریک و اقامت موقت بگیرید." },
      { name: "درخواست شهروندی + پاسپورت", text: "درخواست شهروندی را ارسال کنید؛ پاسپورت ترکیه در ۶ تا ۸ ماه." },
    ],
    ar: [
      { name: "الرقم الضريبي + الحساب البنكي", text: "احصل على الرقم الضريبي التركي وافتح حساباً بنكياً باسمك." },
      { name: "اختيار العقار + تقييم SPK", text: "اختر عقاراً بقيمة 400,000 $+ واحصل على تقرير تقييم SPK معتمد." },
      { name: "عقد البيع + الدفع الآمن", text: "وقع SPA وادفع عبر Güvenli Ödeme Sistemi (إلزامي من مايو 2026)." },
      { name: "TAPU + annotation 3 سنوات", text: "انقل سند الملكية في السجل العقاري مع annotation عدم البيع لـ 3 سنوات." },
      { name: "تصريح الإقامة", text: "احصل على تأمين صحي، بصمات وإقامة مؤقتة." },
      { name: "طلب الجنسية + جواز السفر", text: "قدم طلب الجنسية؛ جواز السفر التركي خلال 6 إلى 8 أشهر." },
    ],
    ru: [
      { name: "ИНН + банковский счёт", text: "Получите турецкий ИНН и откройте банковский счёт на ваше имя." },
      { name: "Подбор объекта + оценка SPK", text: "Выберите объект от $400 000 и получите сертифицированный отчёт SPK." },
      { name: "Договор + Безопасный платёж", text: "Подпишите SPA и оплатите через Güvenli Ödeme Sistemi (обязательно с мая 2026)." },
      { name: "ТАПУ + 3-летняя отметка", text: "Передайте право в Кадастре с отметкой о запрете продажи на 3 года." },
      { name: "ВНЖ", text: "Получите медстраховку, биометрию и временный ВНЖ." },
      { name: "Заявление на гражданство + паспорт", text: "Подайте заявление на гражданство; турецкий паспорт за 6–8 месяцев." },
    ],
  };

  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: titles[lang],
    totalTime: "P8M",
    step: stepsByLang[lang].map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.name,
      text: s.text,
    })),
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

export default async function TurkeyCitizenshipLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang: rawLang } = await params;
  const lang = (LANGS.includes(rawLang as Lang) ? rawLang : "en") as Lang;

  const schemas = [
    getBreadcrumbSchema(lang),
    getServiceSchema(),
    getHowToSchema(lang),
    getFaqSchema(lang),
  ];

  return (
    <>
      {schemas.map((schema, i) => (
        <script
          key={`turkey-citizenship-schema-${i}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      {children}
    </>
  );
}
