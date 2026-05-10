import type { Metadata } from "next";
import type { Lang } from "@/translations";
import { LANGS, LANG_CONFIG, BREADCRUMB_HOME, getPageUrl } from "@/lib/seo";

const PAGE_SEO: Record<Lang, { title: string; description: string }> = {
  en: {
    title: "Turkey Tourist eVisa 2026 | 30 & 90-Day Online — Residency24",
    description:
      "Turkey tourist eVisa from $20. 30 or 90-day, single or multi-entry. Online application via official Turkey eVisa portal — eVisa by email in minutes to 24 hours. Most nationalities eligible.",
  },
  fa: {
    title: "ویزای توریستی ترکیه ۲۰۲۶ | ۳۰ و ۹۰ روزه آنلاین — رزیدنسی۲۴",
    description:
      "eVisa توریستی ترکیه از ۲۰ دلار. ۳۰ یا ۹۰ روزه، ورود تکی یا چندبار. درخواست آنلاین از پورتال رسمی — eVisa در ایمیل ظرف چند دقیقه تا ۲۴ ساعت. اکثر ملیت‌ها واجد شرایط.",
  },
  ar: {
    title: "تأشيرة تركيا السياحية 2026 | 30 و 90 يوماً أونلاين — Residency24",
    description:
      "تأشيرة تركيا السياحية الإلكترونية من 20 دولار. 30 أو 90 يوماً، دخول واحد أو متعدد. تقديم أونلاين عبر البوابة الرسمية — eVisa بالبريد خلال دقائق إلى 24 ساعة.",
  },
  ru: {
    title: "Туристическая eVisa Турции 2026 | 30 и 90 дней онлайн — Residency24",
    description:
      "Туристическая eVisa Турции от 20 $. 30 или 90 дней, разовая или мультивиза. Подача онлайн через официальный портал — eVisa на e-mail за минуты до 24 часов.",
  },
};

const BREADCRUMB_NAMES: Record<Lang, { turkey: string; service: string }> = {
  en: { turkey: "Turkey", service: "Tourist Visa" },
  fa: { turkey: "ترکیه", service: "ویزای توریستی" },
  ar: { turkey: "تركيا", service: "تأشيرة سياحية" },
  ru: { turkey: "Турция", service: "Туристическая виза" },
};

const FAQ: Record<Lang, { q: string; a: string }[]> = {
  en: [
    { q: "Who can apply for the Turkey eVisa?", a: "Most nationalities. Some can enter visa-free for 30–90 days; others need a sticker visa." },
    { q: "How long is the eVisa valid?", a: "180 days from issuance to enter. Stay duration starts on entry." },
    { q: "Can I extend my tourist visa in Turkey?", a: "No — must exit and re-enter, or apply for residence permit." },
    { q: "Do I need a sponsor?", a: "Not for the standard tourist eVisa." },
    { q: "Can the tourist visa be converted to residency?", a: "Not directly. Apply for Ikamet separately with valid grounds." },
  ],
  fa: [
    { q: "چه کسانی می‌توانند eVisa ترکیه بگیرند؟", a: "اکثر ملیت‌ها. برخی ۳۰ تا ۹۰ روز بدون ویزا وارد می‌شوند؛ برخی نیاز به استیکر دارند." },
    { q: "eVisa چقدر اعتبار دارد؟", a: "۱۸۰ روز برای ورود. مدت اقامت از تاریخ ورود شروع می‌شود." },
    { q: "آیا می‌توانم در ترکیه ویزا را تمدید کنم؟", a: "خیر — باید خارج و دوباره وارد شوید، یا برای residence permit اقدام کنید." },
    { q: "آیا به اسپانسر نیاز دارم؟", a: "برای eVisa توریستی استاندارد خیر." },
    { q: "آیا ویزای توریستی به اقامت تبدیل می‌شود؟", a: "مستقیم خیر. جداگانه برای Ikamet با دلیل معتبر اقدام کنید." },
  ],
  ar: [
    { q: "من يمكنه التقديم على eVisa تركيا؟", a: "معظم الجنسيات. بعضها يدخل بدون تأشيرة 30 إلى 90 يوماً؛ غيرها تحتاج تأشيرة لاصقة." },
    { q: "ما مدة صلاحية eVisa؟", a: "180 يوماً للدخول. مدة الإقامة تبدأ عند الدخول." },
    { q: "هل يمكن تمديد التأشيرة السياحية؟", a: "لا — يجب الخروج وإعادة الدخول، أو التقديم على إقامة." },
    { q: "هل أحتاج كفيلاً؟", a: "ليس للتأشيرة السياحية القياسية." },
    { q: "هل تتحول التأشيرة لإقامة؟", a: "لا مباشرة. التقدم على Ikamet منفصلاً بأسباب صحيحة." },
  ],
  ru: [
    { q: "Кому доступна eVisa Турции?", a: "Большинство гражданств. Некоторые без визы 30–90 дней; другим — стикер-виза." },
    { q: "Сколько действует eVisa?", a: "180 дней для въезда. Срок пребывания начинается с въезда." },
    { q: "Можно ли продлить туристическую визу?", a: "Нет — выезд и въезд снова, либо подача на ВНЖ." },
    { q: "Нужен ли спонсор?", a: "Для стандартной туристической eVisa — нет." },
    { q: "Можно ли превратить в ВНЖ?", a: "Напрямую нет. Подача на Ikamet отдельно при наличии оснований." },
  ],
};

function getPageUrlForService(lang: Lang) {
  return getPageUrl(lang, "turkey/tourist-visa/");
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
    name: "Turkey Tourist eVisa Application Assistance",
    serviceType: "Visa Consulting",
    provider: { "@type": "Organization", name: "Residency24", url: "https://residency24.com" },
    areaServed: { "@type": "Country", name: "Turkey" },
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

export default async function TurkeyTouristVisaLayout({
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
          key={`turkey-tourist-schema-${i}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      {children}
    </>
  );
}
