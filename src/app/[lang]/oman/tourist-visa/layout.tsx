import type { Metadata } from "next";
import type { Lang } from "@/translations";
import { LANGS, LANG_CONFIG, BREADCRUMB_HOME, getPageUrl } from "@/lib/seo";

const PAGE_SEO: Record<Lang, { title: string; description: string }> = {
  en: {
    title: "Oman Tourist eVisa 2026 | 10, 30 & 1-Year Multi-Entry — Residency24",
    description:
      "Oman tourist eVisa from USD 20. 10 or 30-day single entry, or 1-year multi-entry. Online application via Royal Oman Police portal. We handle the entire process — eVisa by email in 3–5 days.",
  },
  fa: {
    title: "ویزای توریستی عمان ۲۰۲۶ | ۱۰، ۳۰ روزه و چندبار — رزیدنسی۲۴",
    description:
      "eVisa توریستی عمان از ۲۰ دلار. ۱۰ یا ۳۰ روزه ورود تکی، یا یک‌سال چندبار ورود. درخواست آنلاین از طریق پورتال ROP. ما کل فرآیند را انجام می‌دهیم — eVisa در ۳ تا ۵ روز ایمیل می‌شود.",
  },
  ar: {
    title: "تأشيرة عُمان السياحية 2026 | 10، 30 يوماً وسنة متعددة الدخول — Residency24",
    description:
      "تأشيرة عُمان السياحية الإلكترونية من 20 دولار. 10 أو 30 يوماً دخول واحد، أو سنة متعددة الدخول. تقديم أونلاين عبر بوابة شرطة عُمان السلطانية.",
  },
  ru: {
    title: "Туристическая eVisa Омана 2026 | 10, 30 дней и мультивиза — Residency24",
    description:
      "Туристическая eVisa Омана от 20 $. 10 или 30 дней разовая, или мультивиза на 1 год. Подача онлайн через портал Royal Oman Police. Ведём процесс — eVisa на e-mail за 3–5 дней.",
  },
};

const BREADCRUMB_NAMES: Record<Lang, { oman: string; service: string }> = {
  en: { oman: "Oman", service: "Tourist Visa" },
  fa: { oman: "عمان", service: "ویزای توریستی" },
  ar: { oman: "عُمان", service: "تأشيرة سياحية" },
  ru: { oman: "Оман", service: "Туристическая виза" },
};

const FAQ: Record<Lang, { q: string; a: string }[]> = {
  en: [
    { q: "Who can apply for the Oman eVisa?", a: "Most nationalities are eligible to apply online via the Royal Oman Police (ROP) portal." },
    { q: "How long is the eVisa valid?", a: "Typically 30 days from issuance to enter Oman; stay duration starts on entry." },
    { q: "Can I extend my tourist visa in Oman?", a: "Most tourist visas can be extended once for 10 or 30 days at ROP offices before expiry." },
    { q: "Do I need a sponsor or invitation letter?", a: "Not for standard tourist eVisas." },
    { q: "Can the tourist visa be converted to residency?", a: "Not directly. Apply for an Investor Residency Card separately with qualifying investment." },
  ],
  fa: [
    { q: "چه کسانی می‌توانند eVisa عمان بگیرند؟", a: "اکثر ملیت‌ها از طریق پورتال ROP واجد درخواست آنلاین هستند." },
    { q: "eVisa چقدر اعتبار دارد؟", a: "معمولاً ۳۰ روز از تاریخ صدور برای ورود. مدت اقامت از ورود شروع می‌شود." },
    { q: "آیا می‌توانم در عمان ویزا را تمدید کنم؟", a: "بیشتر ویزاهای توریستی قابل یک‌بار تمدید ۱۰ یا ۳۰ روزه‌اند." },
    { q: "آیا به اسپانسر یا دعوت‌نامه نیاز دارم؟", a: "برای eVisa توریستی استاندارد خیر." },
    { q: "آیا ویزای توریستی به اقامت تبدیل می‌شود؟", a: "مستقیم خیر. باید جداگانه برای IRC اقدام کنید." },
  ],
  ar: [
    { q: "من يمكنه التقديم على eVisa عُمان؟", a: "معظم الجنسيات مؤهلة عبر بوابة شرطة عُمان السلطانية." },
    { q: "ما مدة صلاحية eVisa؟", a: "عادة 30 يوماً للدخول؛ مدة الإقامة تبدأ عند الدخول." },
    { q: "هل يمكن تمديد التأشيرة؟", a: "معظم التأشيرات السياحية تُمدد مرة لـ 10 أو 30 يوماً قبل الانتهاء." },
    { q: "هل أحتاج كفيلاً؟", a: "ليس للتأشيرة السياحية الإلكترونية القياسية." },
    { q: "هل يمكن تحويلها لإقامة؟", a: "لا مباشرة. التقدم على إقامة مستثمر منفصلاً." },
  ],
  ru: [
    { q: "Кому доступна eVisa Омана?", a: "Большинство гражданств может подать через портал ROP." },
    { q: "Сколько действует eVisa?", a: "Обычно 30 дней с даты выдачи для въезда; срок пребывания начинается с въезда." },
    { q: "Можно ли продлить туристическую визу?", a: "Большинство туристических виз можно продлить один раз на 10 или 30 дней до истечения." },
    { q: "Нужны спонсор или приглашение?", a: "Для стандартной туристической eVisa — нет." },
    { q: "Можно ли превратить в ВНЖ?", a: "Напрямую нет. Нужно отдельно подавать на инвесторский ВНЖ с инвестицией." },
  ],
};

function getPageUrlForService(lang: Lang) {
  return getPageUrl(lang, "oman/tourist-visa/");
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
    name: "Oman Tourist eVisa Application Assistance",
    serviceType: "Visa Consulting",
    provider: { "@type": "Organization", name: "Residency24", url: "https://residency24.com" },
    areaServed: { "@type": "Country", name: "Oman" },
    offers: {
      "@type": "Offer",
      availability: "https://schema.org/InStock",
      priceCurrency: "USD",
      price: "20",
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

export default async function OmanTouristVisaLayout({
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
          key={`oman-tourist-schema-${i}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      {children}
    </>
  );
}
