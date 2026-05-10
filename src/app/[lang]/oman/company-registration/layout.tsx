import type { Metadata } from "next";
import type { Lang } from "@/translations";
import { LANGS, LANG_CONFIG, BREADCRUMB_HOME, getPageUrl } from "@/lib/seo";

const PAGE_SEO: Record<Lang, { title: string; description: string }> = {
  en: {
    title: "Register a Company in Oman 2026 | Mainland & Free Zone — Residency24",
    description:
      "Set up an Omani company with 100% foreign ownership. Mainland LLC from USD 2,500 or Free Zone in Sohar/Salalah/Duqm with 25–30 year tax holiday. License + bank account included.",
  },
  fa: {
    title: "ثبت شرکت در عمان ۲۰۲۶ | مین‌لند و فری‌زون — رزیدنسی۲۴",
    description:
      "ثبت شرکت عمانی با مالکیت ۱۰۰٪ خارجی. LLC مین‌لند از ۲,۵۰۰ دلار یا فری‌زون صحار/صلاله/الدقم با معافیت مالیاتی ۲۵ تا ۳۰ ساله. لایسنس و حساب بانکی شامل.",
  },
  ar: {
    title: "تأسيس شركة في عُمان 2026 | بر رئيسي ومنطقة حرة — Residency24",
    description:
      "تأسيس شركة عمانية بملكية أجنبية 100٪. ش.م.م على البر الرئيسي من 2,500 دولار أو منطقة حرة في صحار/صلالة/الدقم بإعفاء 25 إلى 30 سنة. الترخيص والحساب البنكي مشمولان.",
  },
  ru: {
    title: "Регистрация компании в Омане 2026 | Материк и свободные зоны — Residency24",
    description:
      "Открытие компании в Омане со 100% иностранным владением. LLC на материке от 2 500 $ или свободная зона Сохар/Салала/Дукм с налоговыми каникулами 25–30 лет. Лицензия и счёт включены.",
  },
};

const BREADCRUMB_NAMES: Record<Lang, { oman: string; service: string }> = {
  en: { oman: "Oman", service: "Company Registration" },
  fa: { oman: "عمان", service: "ثبت شرکت" },
  ar: { oman: "عُمان", service: "تأسيس شركة" },
  ru: { oman: "Оман", service: "Регистрация компании" },
};

const FAQ: Record<Lang, { q: string; a: string }[]> = {
  en: [
    { q: "Can I own 100% of an Oman company as a foreigner?", a: "Yes. Since 2020, foreign investors can own 100% of mainland LLCs in most activities. Free Zones have always allowed 100% foreign ownership." },
    { q: "What is the minimum capital?", a: "Most activities have no fixed minimum capital today. Some specialized licenses (banking, insurance) have sector-specific requirements." },
    { q: "Mainland LLC vs Free Zone — which is cheaper?", a: "Mainland is usually cheaper to start (~USD 2,500) but Free Zones win long-term thanks to the 25–30 year tax holiday on qualifying export activities." },
    { q: "Do I need a local Omani partner?", a: "No, not for most activities. The 100% foreign ownership reform removed the local sponsor requirement for the majority of mainland activities." },
    { q: "How fast can I open a bank account?", a: "After license issuance, corporate accounts in Oman typically take 2–4 weeks subject to compliance review." },
  ],
  fa: [
    { q: "آیا به‌عنوان خارجی می‌توانم ۱۰۰٪ مالک شرکت عمانی باشم؟", a: "بله. از ۲۰۲۰ به بعد، سرمایه‌گذاران خارجی می‌توانند مالک ۱۰۰٪ LLC مین‌لند در اکثر فعالیت‌ها باشند." },
    { q: "حداقل سرمایه چقدر است؟", a: "اکثر فعالیت‌ها حداقل سرمایه ثابت ندارند." },
    { q: "مین‌لند یا فری‌زون — کدام ارزان‌تر است؟", a: "مین‌لند برای شروع ارزان‌تر، فری‌زون بلندمدت با معافیت ۲۵ تا ۳۰ ساله صرفه دارد." },
    { q: "آیا به شریک محلی عمانی نیاز دارم؟", a: "خیر، برای اکثر فعالیت‌ها نه. اصلاح ۱۰۰٪ مالکیت خارجی نیاز به اسپانسر محلی را حذف کرد." },
    { q: "چقدر زود حساب بانکی باز می‌شود؟", a: "بعد از صدور لایسنس، حساب شرکتی معمولاً ۲ تا ۴ هفته زمان می‌برد." },
  ],
  ar: [
    { q: "هل يمكنني تملك 100٪ من شركة عمانية كأجنبي؟", a: "نعم. منذ 2020 يمكن للمستثمرين الأجانب تملك 100٪ من ش.م.م على البر الرئيسي." },
    { q: "ما الحد الأدنى لرأس المال؟", a: "معظم الأنشطة لا تشترط حداً أدنى ثابتاً اليوم." },
    { q: "البر الرئيسي أم المنطقة الحرة — أيهما أرخص؟", a: "البر الرئيسي أرخص للبدء، لكن المناطق الحرة تتفوق على المدى الطويل." },
    { q: "هل أحتاج شريكاً عمانياً؟", a: "لا، ليس لمعظم الأنشطة." },
    { q: "كم بسرعة يمكنني فتح حساب بنكي؟", a: "عادة 2 إلى 4 أسابيع بعد إصدار الترخيص." },
  ],
  ru: [
    { q: "Можно ли иностранцу владеть 100% компании в Омане?", a: "Да. С 2020 года иностранцы могут владеть 100% LLC на материке в большинстве видов деятельности." },
    { q: "Какой минимум капитала?", a: "Большинство видов деятельности сегодня не имеют фиксированного минимума." },
    { q: "Материк или СЭЗ — что дешевле?", a: "Материк дешевле на старте, СЭЗ выигрывает в долгую благодаря каникулам 25–30 лет." },
    { q: "Нужен ли местный оманский партнёр?", a: "Нет, для большинства видов деятельности." },
    { q: "Как быстро открыть банковский счёт?", a: "Обычно 2–4 недели после получения лицензии." },
  ],
};

function getPageUrlForService(lang: Lang) {
  return getPageUrl(lang, "oman/company-registration/");
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
    name: "Oman Company Registration Services",
    serviceType: "Business Setup & Company Formation",
    provider: { "@type": "Organization", name: "Residency24", url: "https://residency24.com" },
    areaServed: { "@type": "Country", name: "Oman" },
    offers: {
      "@type": "Offer",
      availability: "https://schema.org/InStock",
      priceCurrency: "USD",
      price: "2500",
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

export default async function OmanCompanyRegistrationLayout({
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
          key={`oman-company-schema-${i}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      {children}
    </>
  );
}
