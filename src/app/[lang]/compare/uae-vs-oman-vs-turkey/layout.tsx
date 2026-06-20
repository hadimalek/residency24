import type { Metadata } from "next";
import type { Lang } from "@/translations";
import { LANGS, LANG_CONFIG } from "@/lib/seo";

const BASE_URL = "https://residency24.com";
const PATH = "compare/uae-vs-oman-vs-turkey/";

const PAGE_SEO: Record<Lang, { title: string; description: string }> = {
  fa: {
    title: "امارات یا عمان یا ترکیه؟ مقایسه کامل ۲۰۲۶ | رزیدنسی۲۴",
    description: "مقایسه‌ی امارات، عمان و ترکیه: مالیات، اقامت، شهروندی، خرید ملک و ثبت شرکت. جدول کامل و به‌روز ۲۰۲۶. مشاوره رایگان.",
  },
  en: {
    title: "UAE vs Oman vs Turkey: Full 2026 Comparison | Residency24",
    description: "Compare the UAE, Oman & Turkey on tax, residency, citizenship, property and company setup. Full side-by-side table, updated 2026. Free expert advice.",
  },
  ar: {
    title: "الإمارات أم عُمان أم تركيا؟ مقارنة شاملة ٢٠٢٦ | Residency24",
    description: "قارن بين الإمارات وعُمان وتركيا: الضرائب والإقامة والجنسية والعقارات وتأسيس الشركات. جدول مقارنة كامل محدّث ٢٠٢٦. استشارة مجانية.",
  },
  ru: {
    title: "ОАЭ, Оман или Турция? Полное сравнение 2026 | Residency24",
    description: "Сравните ОАЭ, Оман и Турцию: налоги, ВНЖ, гражданство, недвижимость и регистрация компаний. Полная таблица, обновлено в 2026. Бесплатная консультация.",
  },
};

function getPageUrl(lang: Lang) {
  return lang === "en" ? `${BASE_URL}/${PATH}` : `${BASE_URL}/${lang}/${PATH}`;
}

function langPathPrefix(lang: Lang) {
  return lang === "en" ? `${BASE_URL}` : `${BASE_URL}/${lang}`;
}

export async function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang: rawLang } = await params;
  const lang = (LANGS.includes(rawLang as Lang) ? rawLang : "en") as Lang;
  const seo = PAGE_SEO[lang];
  const config = LANG_CONFIG[lang];
  const pageUrl = getPageUrl(lang);

  const alternates: Record<string, string> = {};
  for (const l of LANGS) {
    alternates[LANG_CONFIG[l].hreflang] = getPageUrl(l);
  }
  alternates["x-default"] = getPageUrl("en");

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
      locale: config.locale,
      alternateLocale: LANGS.filter((l) => l !== lang).map((l) => LANG_CONFIG[l].locale),
      siteName: "Residency24",
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: seo.description,
    },
  };
}

function getBreadcrumbSchema(lang: Lang) {
  const names: Record<Lang, { home: string; compare: string }> = {
    fa: { home: "خانه", compare: "مقایسه کشورها" },
    en: { home: "Home", compare: "Compare Countries" },
    ar: { home: "الرئيسية", compare: "مقارنة الدول" },
    ru: { home: "Главная", compare: "Сравнение стран" },
  };
  const n = names[lang];
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: n.home, item: `${langPathPrefix(lang)}/` },
      { "@type": "ListItem", position: 2, name: n.compare, item: getPageUrl(lang) },
    ],
  };
}

function getFAQSchema(lang: Lang) {
  const faqs: { q: Record<Lang, string>; a: Record<Lang, string> }[] = [
    {
      q: {
        en: "Which country has the lowest taxes?",
        fa: "کدام کشور کمترین مالیات را دارد؟",
        ar: "أي دولة لديها أقل الضرائب؟",
        ru: "В какой стране самые низкие налоги?",
      },
      a: {
        en: "The UAE and Oman both levy 0% personal income tax. Turkey taxes personal income at 15–40% but is the only one of the three offering a second passport.",
        fa: "امارات و عمان هر دو مالیات ۰٪ بر درآمد شخصی دارند. ترکیه درآمد شخصی را ۱۵–۴۰٪ مالیات می‌گیرد اما تنها کشوری است که پاسپورت دوم ارائه می‌دهد.",
        ar: "الإمارات وعُمان تفرضان ضريبة دخل شخصي ٠٪. تركيا تفرض ١٥–٤٠٪ لكنها الوحيدة التي تمنح جواز سفر ثانياً.",
        ru: "В ОАЭ и Омане подоходный налог 0%. В Турции он 15–40%, но это единственная из трёх стран со вторым паспортом.",
      },
    },
    {
      q: {
        en: "Which is the only one offering a second passport?",
        fa: "کدام تنها گزینه برای پاسپورت دوم است؟",
        ar: "أي دولة تمنح جواز سفر ثانياً فقط؟",
        ru: "Какая страна даёт второй паспорт?",
      },
      a: {
        en: "Turkey — the only one with a direct citizenship-by-investment programme, typically a $400,000 property purchase leading to a passport in 3–6 months.",
        fa: "ترکیه — تنها کشور با برنامه‌ی مستقیم شهروندی از طریق سرمایه‌گذاری؛ معمولاً خرید ملک ۴۰۰,۰۰۰ دلاری در ۳–۶ ماه به پاسپورت می‌رسد.",
        ar: "تركيا — الوحيدة ببرنامج جنسية مباشر بالاستثمار، عادةً شراء عقار بـ ٤٠٠,٠٠٠ دولار يؤدي إلى جواز سفر خلال ٣–٦ أشهر.",
        ru: "Турция — единственная с прямой программой гражданства за инвестиции: обычно покупка недвижимости на $400 000 даёт паспорт за 3–6 месяцев.",
      },
    },
    {
      q: {
        en: "Which country is the fastest to set up in?",
        fa: "ثبت در کدام کشور سریع‌تر است؟",
        ar: "أي دولة أسرع في التأسيس؟",
        ru: "Где быстрее всего оформиться?",
      },
      a: {
        en: "The UAE — a company and Golden Visa can be processed in roughly 7–10 days. Turkey takes 1–2 weeks for a company, Oman typically 2–4 weeks.",
        fa: "امارات — ثبت شرکت و گلدن ویزا تقریباً در ۷–۱۰ روز انجام می‌شود. ترکیه برای شرکت ۱–۲ هفته و عمان معمولاً ۲–۴ هفته.",
        ar: "الإمارات — الشركة والتأشيرة الذهبية في نحو ٧–١٠ أيام. تركيا ١–٢ أسبوع للشركة، وعُمان عادةً ٢–٤ أسابيع.",
        ru: "ОАЭ — компанию и Золотую визу можно оформить за 7–10 дней. В Турции компания 1–2 недели, в Омане обычно 2–4 недели.",
      },
    },
    {
      q: {
        en: "Can foreigners fully own property in all three?",
        fa: "آیا خارجی‌ها در هر سه کشور مالکیت کامل ملک دارند؟",
        ar: "هل يملك الأجانب العقارات بالكامل في الدول الثلاث؟",
        ru: "Могут ли иностранцы полностью владеть недвижимостью во всех трёх?",
      },
      a: {
        en: "Yes. Foreigners can own property freehold in all three — Dubai's designated zones, Oman's ITC zones and most of Turkey — with 100% ownership.",
        fa: "بله. خارجی‌ها در هر سه کشور مالکیت کامل دارند — مناطق مجاز دبی، مناطق ITC عمان و بیشتر مناطق ترکیه — با مالکیت ۱۰۰٪.",
        ar: "نعم. يمكن للأجانب التملّك الكامل في الدول الثلاث — مناطق دبي المحددة، ومناطق ITC في عُمان، ومعظم تركيا — بملكية ١٠٠٪.",
        ru: "Да. Иностранцы могут владеть недвижимостью во всех трёх — в зонах Дубая, зонах ITC Омана и большей части Турции — со 100% владением.",
      },
    },
  ];

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q[lang],
      acceptedAnswer: { "@type": "Answer", text: faq.a[lang] },
    })),
  };
}

export default async function CompareCountriesLayout({ children, params }: { children: React.ReactNode; params: Promise<{ lang: string }> }) {
  const { lang: rawLang } = await params;
  const lang = (LANGS.includes(rawLang as Lang) ? rawLang : "en") as Lang;

  const schemas = [getBreadcrumbSchema(lang), getFAQSchema(lang)];

  return (
    <>
      {schemas.map((schema, i) => (
        <script
          key={`compare-schema-${i}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      {children}
    </>
  );
}
