import type { Metadata } from "next";
import type { Lang } from "@/translations";
import { LANGS, LANG_CONFIG, BREADCRUMB_HOME, getPageUrl } from "@/lib/seo";

const PAGE_SEO: Record<Lang, { title: string; description: string }> = {
  en: {
    title: "Register a Company in Turkey 2026 | LLC, JSC & Free Zone — Residency24",
    description:
      "Open a Turkish LLC with 100% foreign ownership in 5–10 days. Capital from $1,400. Or set up in Turkish Free Zones for a 30-year tax holiday. Full process, costs and bank account included.",
  },
  fa: {
    title: "ثبت شرکت در ترکیه ۲۰۲۶ | LLC، JSC و فری‌زون — رزیدنسی۲۴",
    description:
      "ثبت شرکت LLC ترکی با مالکیت ۱۰۰٪ خارجی در ۵ تا ۱۰ روز. سرمایه از ۱,۴۰۰ دلار. یا فری‌زون ترکیه با معافیت مالیاتی ۳۰ ساله. فرآیند کامل، هزینه‌ها و حساب بانکی.",
  },
  ar: {
    title: "تأسيس شركة في تركيا 2026 | ش.م.م، ش.م.ع ومنطقة حرة — Residency24",
    description:
      "افتح ش.م.م تركية بملكية أجنبية 100٪ خلال 5 إلى 10 أيام. رأس مال من 1,400 دولار. أو منطقة حرة تركية بإعفاء ضريبي 30 سنة. العملية الكاملة والتكاليف والحساب البنكي.",
  },
  ru: {
    title: "Регистрация компании в Турции 2026 | LLC, JSC и СЭЗ — Residency24",
    description:
      "Открытие турецкой LLC со 100% иностранным владением за 5–10 дней. Капитал от 1 400 $. Или свободная зона Турции с налоговыми каникулами 30 лет. Полный процесс и счёт.",
  },
};

const BREADCRUMB_NAMES: Record<Lang, { turkey: string; service: string }> = {
  en: { turkey: "Turkey", service: "Company Registration" },
  fa: { turkey: "ترکیه", service: "ثبت شرکت" },
  ar: { turkey: "تركيا", service: "تأسيس شركة" },
  ru: { turkey: "Турция", service: "Регистрация компании" },
};

const FAQ: Record<Lang, { q: string; a: string }[]> = {
  en: [
    { q: "Can I own 100% of a Turkish company as a foreigner?", a: "Yes, in most sectors. A few regulated sectors have ownership restrictions." },
    { q: "What is the minimum capital?", a: "TRY 50,000 (~$1,400) for LLC; TRY 250,000 (~$7,000) for JSC." },
    { q: "Do I need to live in Turkey?", a: "No. Non-resident directors are allowed." },
    { q: "What is the corporate tax rate?", a: "25% in 2026. Free Zones offer up to 30-year exemption on qualifying export." },
    { q: "Can the company sponsor my residence permit?", a: "Yes — Investor / Independent Worker permit, renewable annually." },
  ],
  fa: [
    { q: "آیا به‌عنوان خارجی می‌توانم ۱۰۰٪ مالک شرکت ترکی باشم؟", a: "بله، در اکثر بخش‌ها. تعداد محدودی بخش تنظیمی محدودیت دارد." },
    { q: "حداقل سرمایه چقدر است؟", a: "۵۰,۰۰۰ لیر (~۱,۴۰۰ دلار) برای LLC؛ ۲۵۰,۰۰۰ لیر (~۷,۰۰۰ دلار) برای JSC." },
    { q: "آیا باید در ترکیه زندگی کنم؟", a: "خیر. مدیر غیر مقیم مجاز است." },
    { q: "نرخ مالیات شرکتی چقدر است؟", a: "۲۵٪ در ۲۰۲۶. فری‌زون‌ها معافیت تا ۳۰ ساله برای صادرات." },
    { q: "آیا شرکت می‌تواند اسپانسر اقامتم باشد؟", a: "بله — اقامت سرمایه‌گذار / کارگر مستقل، سالانه قابل تمدید." },
  ],
  ar: [
    { q: "هل يمكنني تملك 100٪ من شركة تركية كأجنبي؟", a: "نعم، في معظم القطاعات. عدد قليل من القطاعات المنظمة لها قيود." },
    { q: "ما الحد الأدنى لرأس المال؟", a: "50,000 ليرة (~1,400 $) لـ ش.م.م؛ 250,000 ليرة (~7,000 $) لـ ش.م.ع." },
    { q: "هل يجب أن أعيش في تركيا؟", a: "لا. يُسمح بمدير غير مقيم." },
    { q: "ما نسبة الضريبة على الشركات؟", a: "25٪ في 2026. المناطق الحرة تعفي حتى 30 سنة على التصدير المؤهل." },
    { q: "هل يمكن للشركة كفالة إقامتي؟", a: "نعم — تصريح المستثمر / العامل المستقل، قابل للتجديد سنوياً." },
  ],
  ru: [
    { q: "Можно ли иностранцу владеть 100% турецкой компании?", a: "Да, в большинстве секторов. У нескольких регулируемых есть ограничения." },
    { q: "Какой минимум капитала?", a: "50 000 TRY (~1 400 $) для LLC; 250 000 TRY (~7 000 $) для JSC." },
    { q: "Нужно ли жить в Турции?", a: "Нет. Нерезидентные директора разрешены." },
    { q: "Какова ставка корпоративного налога?", a: "25% в 2026. СЭЗ предлагают до 30 лет освобождения на квалифицированный экспорт." },
    { q: "Может ли компания спонсировать мой ВНЖ?", a: "Да — ВНЖ инвестора / независимого работника, ежегодно продлеваемый." },
  ],
};

function getPageUrlForService(lang: Lang) {
  return getPageUrl(lang, "turkey/company-registration/");
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
    name: "Turkey Company Registration Services",
    serviceType: "Business Setup & Company Formation",
    provider: { "@type": "Organization", name: "Residency24", url: "https://residency24.com" },
    areaServed: { "@type": "Country", name: "Turkey" },
    offers: {
      "@type": "Offer",
      availability: "https://schema.org/InStock",
      priceCurrency: "USD",
      price: "1500",
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

export default async function TurkeyCompanyRegistrationLayout({
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
          key={`turkey-company-schema-${i}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      {children}
    </>
  );
}
