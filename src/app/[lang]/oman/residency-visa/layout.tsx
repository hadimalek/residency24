import type { Metadata } from "next";
import type { Lang } from "@/translations";
import { LANGS, LANG_CONFIG, BREADCRUMB_HOME, getPageUrl } from "@/lib/seo";

const PAGE_SEO: Record<Lang, { title: string; description: string }> = {
  en: {
    title: "Oman Investor Residency Card 2026 | 5 & 10-Year — Residency24",
    description:
      "Oman Investor Residency Card from OMR 250,000 in property, business or bank deposit. 5 or 10-year residency including spouse and children. 0% personal income tax. Free consultation.",
  },
  fa: {
    title: "اقامت سرمایه‌گذار عمان ۲۰۲۶ | ۵ و ۱۰ ساله — رزیدنسی۲۴",
    description:
      "کارت اقامت سرمایه‌گذار عمان از ۲۵۰,۰۰۰ ریال در ملک، کسب‌وکار یا سپرده بانکی. اقامت ۵ یا ۱۰ ساله شامل همسر و فرزندان. مالیات شخصی صفر. مشاوره رایگان.",
  },
  ar: {
    title: "بطاقة إقامة المستثمر العماني 2026 | 5 و10 سنوات — Residency24",
    description:
      "بطاقة إقامة المستثمر العماني من 250,000 ر.ع. عبر العقار أو الشركة أو الإيداع. إقامة 5 أو 10 سنوات تشمل الزوج والأبناء. 0٪ ضريبة دخل شخصي.",
  },
  ru: {
    title: "Карта инвестора Омана 2026 | ВНЖ 5 и 10 лет — Residency24",
    description:
      "Карта инвестора Омана от OMR 250 000 в недвижимости, бизнесе или банковском депозите. ВНЖ 5 или 10 лет с супругом и детьми. 0% подоходного налога. Бесплатная консультация.",
  },
};

const BREADCRUMB_NAMES: Record<Lang, { oman: string; service: string }> = {
  en: { oman: "Oman", service: "Investor Residency" },
  fa: { oman: "عمان", service: "اقامت سرمایه‌گذار" },
  ar: { oman: "عُمان", service: "إقامة المستثمر" },
  ru: { oman: "Оман", service: "Инвесторский ВНЖ" },
};

const FAQ: Record<Lang, { q: string; a: string }[]> = {
  en: [
    { q: "How long is the Investor Residency valid?", a: "5 years for the OMR 250,000 route; 10 years for OMR 500,000+. Both renewable as long as the qualifying asset is held." },
    { q: "Does this give Omani citizenship?", a: "No. IRC is long-term residency, not citizenship." },
    { q: "Do I need to live in Oman?", a: "No strict minimum-stay rule today. Avoid being absent for more than 6 consecutive months." },
    { q: "Can I include parents on my residency?", a: "Generally no — only spouse and dependent children." },
    { q: "What happens if I sell the property?", a: "If the qualifying asset falls below the threshold, residency is not auto-renewed. You can switch routes before renewal." },
  ],
  fa: [
    { q: "اقامت سرمایه‌گذار چقدر اعتبار دارد؟", a: "۵ ساله برای ۲۵۰,۰۰۰ ریال؛ ۱۰ ساله برای ۵۰۰,۰۰۰+. هر دو تا زمانی که دارایی واجد شرایط حفظ شود، قابل تمدید." },
    { q: "آیا این، تابعیت عمانی می‌دهد؟", a: "خیر. IRC اقامت بلندمدت است نه تابعیت." },
    { q: "آیا باید در عمان زندگی کنم؟", a: "قانون سختگیرانه حداقل اقامت امروز اجرا نمی‌شود. بیش از ۶ ماه پیاپی غایب نباشید." },
    { q: "آیا می‌توانم والدین را شامل کنم؟", a: "معمولاً خیر — فقط همسر و فرزندان وابسته." },
    { q: "اگر ملک را بفروشم چه می‌شود؟", a: "اگر دارایی زیر آستانه برود، تمدید خودکار نیست. می‌توان قبل از تمدید به مسیر دیگر سوییچ کرد." },
  ],
  ar: [
    { q: "ما مدة صلاحية إقامة المستثمر؟", a: "5 سنوات لمسار 250 ألف ر.ع.؛ 10 سنوات لمسار 500 ألف+. كلاهما قابل للتجديد." },
    { q: "هل تمنح الجنسية العمانية؟", a: "لا. IRC إقامة طويلة وليست جنسية." },
    { q: "هل يجب أن أعيش في عُمان؟", a: "لا توجد قاعدة حد أدنى صارمة. تجنب الغياب لأكثر من 6 أشهر متواصلة." },
    { q: "هل يمكنني شمول الوالدين؟", a: "عادة لا — فقط الزوج والأبناء المعالون." },
    { q: "ماذا لو بعت العقار؟", a: "لو نزل الأصل عن الحد، لا تُجدد تلقائياً. يمكن التحول لمسار آخر قبل التجديد." },
  ],
  ru: [
    { q: "На какой срок выдают ВНЖ?", a: "5 лет — при OMR 250 000; 10 лет — при OMR 500 000+. Оба продлеваются, пока сохраняется актив." },
    { q: "Это даёт гражданство Омана?", a: "Нет. IRC — долгосрочный ВНЖ, не гражданство." },
    { q: "Нужно ли жить в Омане?", a: "Жёсткого минимума нет. Не отсутствовать дольше 6 месяцев подряд." },
    { q: "Можно ли включить родителей?", a: "Обычно нет — только супруг и дети." },
    { q: "Что если я продам недвижимость?", a: "Если актив ниже порога — продление не происходит автоматически. Можно сменить маршрут до продления." },
  ],
};

function getPageUrlForService(lang: Lang) {
  return getPageUrl(lang, "oman/residency-visa/");
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
    name: "Oman Investor Residency Application Assistance",
    serviceType: "Immigration & Visa Consulting",
    provider: { "@type": "Organization", name: "Residency24", url: "https://residency24.com" },
    areaServed: { "@type": "Country", name: "Oman" },
    offers: {
      "@type": "Offer",
      availability: "https://schema.org/InStock",
      priceCurrency: "OMR",
      price: "250000",
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

export default async function OmanResidencyVisaLayout({
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
          key={`oman-residency-schema-${i}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      {children}
    </>
  );
}
