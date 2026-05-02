import type { Metadata } from "next";
import type { Lang } from "@/translations";
import { LANGS, LANG_CONFIG } from "@/lib/seo";

const BASE_URL = "https://residency24.com";

const PAGE_SEO: Record<Lang, { title: string; description: string }> = {
  fa: {
    title: "ویزای توریستی امارات ۲۰۲۶ | رزیدنسی۲۴ دبی",
    description: "اخذ ویزای توریستی امارات برای ایرانی‌ها و سایر ملیت‌ها. ۳۰، ۶۰ و ۹۰ روزه. از ۳۵۰ درهم. مشاوره رایگان.",
  },
  en: {
    title: "UAE Tourist Visa 2026 | Fast Processing | Residency24",
    description: "Expert UAE tourist visa — 30, 60, 90-day and multi-entry. Iranian, Arabic & English team in Dubai. From AED 350. Free consultation.",
  },
  ar: {
    title: "تأشيرة الإمارات السياحية 2026 | رزيدنسي24 دبي",
    description: "تأشيرة سياحية إماراتية للعراقيين والمصريين وجميع الجنسيات. خدمة بالعربية في دبي. من 350 درهم. استشارة مجانية.",
  },
  ru: {
    title: "Туристическая виза ОАЭ 2026 | Residency24 Дубай",
    description: "Туристическая виза ОАЭ: 30, 60, 90 дней и мультивиза. Русскоязычная команда в Дубае. Или сразу ВНЖ — от 5 лет.",
  },
};

function getPageUrl(lang: Lang) {
  return lang === "en" ? `${BASE_URL}/uae/tourist-visa/` : `${BASE_URL}/${lang}/uae/tourist-visa/`;
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
  // x-default → fa per architecture spec
  alternates["x-default"] = getPageUrl("fa");

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
  const names: Record<Lang, { home: string; uae: string; tv: string }> = {
    fa: { home: "خانه", uae: "امارات", tv: "ویزای توریستی" },
    en: { home: "Home", uae: "UAE", tv: "Tourist Visa" },
    ar: { home: "الرئيسية", uae: "الإمارات", tv: "تأشيرة سياحية" },
    ru: { home: "Главная", uae: "ОАЭ", tv: "Туристическая виза" },
  };
  const n = names[lang];
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: n.home, item: `${langPathPrefix(lang)}/` },
      { "@type": "ListItem", position: 2, name: n.uae, item: `${langPathPrefix(lang)}/uae/` },
      { "@type": "ListItem", position: 3, name: n.tv, item: getPageUrl(lang) },
    ],
  };
}

function getServiceSchema(lang: Lang) {
  const serviceNames: Record<Lang, string> = {
    fa: "ویزای توریستی امارات",
    en: "UAE Tourist Visa Processing",
    ar: "تأشيرة الإمارات السياحية",
    ru: "Туристическая виза ОАЭ",
  };
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: serviceNames[lang],
    provider: {
      "@type": "ProfessionalService",
      name: "Residency24",
      url: "https://residency24.com",
    },
    description: "Expert UAE tourist visa processing for all nationalities. 30, 60, 90-day and multi-entry visas.",
    areaServed: { "@type": "Country", name: "United Arab Emirates" },
    serviceType: "Visa Processing",
    priceRange: "AED 350 - AED 1,500",
  };
}

function getFAQSchema(lang: Lang) {
  const faqs = [
    {
      q: { fa: "آیا رزیدنسی۲۴ ویزا برای ایرانی‌ها می‌گیرد؟", en: "Can Iranian nationals get UAE tourist visa through Residency24?", ar: "هل يمكن للإيرانيين الحصول على تأشيرة الإمارات؟", ru: "Residency24 оформляет визы для иранцев?" },
      a: { fa: "بله. تخصص ما. پردازش ۵–۱۰ روز کاری. نرخ تأیید ۹۵٪+", en: "Yes. Our speciality. Processing 5–10 days. 95%+ approval rate.", ar: "نعم. تخصصنا. ٥-١٠ أيام. +٩٥٪ قبول.", ru: "Да. Наша специализация. 5–10 дней. 95%+ одобрение." },
    },
    {
      q: { fa: "تفاوت ۳۰ روزه و ۹۰ روزه چیست؟", en: "Difference between 30-day and 90-day visa?", ar: "الفرق بين تأشيرة ٣٠ و٩٠ يوماً؟", ru: "Разница между визой на 30 и 90 дней?" },
      a: { fa: "ویزای ۳۰ روزه ارزان‌تر است. ویزای ۹۰ روزه برای سفرهای کاری مناسب‌تر و قابل تمدید است.", en: "30-day is more affordable. 90-day suits business trips and is extendable for 30 more days.", ar: "تأشيرة ٣٠ يوماً أرخص. تأشيرة ٩٠ للأعمال وقابلة للتمديد.", ru: "Виза 30 дней дешевле. Виза 90 дней для деловых поездок и продлеваемая." },
    },
    {
      q: { fa: "آیا می‌توان ویزا را داخل امارات تمدید کرد؟", en: "Can I extend my UAE visa inside the country?", ar: "هل يمكن تمديد التأشيرة داخل الإمارات؟", ru: "Можно ли продлить визу внутри ОАЭ?" },
      a: { fa: "بله. یک بار ۳۰ روز اضافه. هزینه: ۶۰۰ درهم + ۵٪ VAT.", en: "Yes. Once for 30 extra days. Fee: AED 600 + 5% VAT.", ar: "نعم. مرة واحدة لمدة ٣٠ يوماً. رسوم: ٦٠٠ درهم + ٥٪.", ru: "Да. Один раз на 30 дней. Стоимость: AED 600 + 5% НДС." },
    },
    {
      q: { fa: "آیا روسی‌ها به ویزا نیاز دارند؟", en: "Do Russian nationals need UAE tourist visa?", ar: "هل يحتاج الروس إلى تأشيرة؟", ru: "Нужна ли гражданам России виза в ОАЭ?" },
      a: { fa: "نه. روسی‌ها تا ۹۰ روز بدون ویزا. برای اقامت بیشتر: گرین ویزا یا گلدن ویزا.", en: "No. Russians enter visa-free up to 90 days. For longer stays: Green or Golden Visa.", ar: "لا. الروس بدون تأشيرة ٩٠ يوماً. للإقامة الأطول: الخضراء أو الذهبية.", ru: "Нет. Россияне без визы 90 дней. Для долгосрочного: Green или Golden Visa." },
    },
    {
      q: { fa: "با ویزای توریستی حساب بانکی باز می‌شود؟", en: "Can I open a UAE bank account on tourist visa?", ar: "هل أفتح حساباً مصرفياً بالتأشيرة السياحية؟", ru: "Можно открыть счёт в банке ОАЭ по туристической визе?" },
      a: { fa: "معمولاً نه — بانک‌ها نیاز به اقامت دارند. اما بازدید توریستی فرصت ملاقات با بانک‌ها و شروع اقامت است.", en: "Typically no — banks require residency. But your visit is ideal to meet banks and start the residency process.", ar: "عادةً لا. البنوك تشترط الإقامة. لكن زيارتك للقاء البنوك والبدء في الإقامة.", ru: "Как правило, нет. Но визит — идеальное время встретиться с банками и начать оформление ВНЖ." },
    },
    {
      q: { fa: "ویزای توریستی چطور به اقامت تبدیل می‌شود؟", en: "How can tourist visa lead to UAE residency?", ar: "كيف تتحول التأشيرة السياحية إلى إقامة؟", ru: "Как туристическая виза может стать резидентством?" },
      a: { fa: "بیش از ۴۰٪ مشتریان اقامتی ما با ویزای توریستی شروع کردند. در طول بازدید می‌توان ملک خرید، شرکت ثبت کرد یا گلدن ویزا گرفت.", en: "40%+ of our residency clients started with tourist visa. During your visit: buy property, register company, or qualify for Golden Visa.", ar: "أكثر من ٤٠٪ من عملائنا بدأوا بتأشيرة سياحية. يمكنك شراء عقار أو تأسيس شركة أو الحصول على إقامة ذهبية.", ru: "40%+ наших клиентов начали с туристической визы. Во время визита: купить недвижимость, открыть компанию или Golden Visa." },
    },
    {
      q: { fa: "هزینه ویزای توریستی چقدر است؟", en: "What is the total cost of UAE tourist visa?", ar: "ما التكلفة الإجمالية للتأشيرة السياحية؟", ru: "Сколько стоит туристическая виза ОАЭ?" },
      a: { fa: "ویزای ۳۰ روزه: از ۳۵۰ درهم. ویزای ۶۰ روزه: از ۵۵۰ درهم. ویزای ۹۰ روزه: از ۷۵۰ درهم.", en: "30-day from AED 350. 60-day from AED 550. 90-day from AED 750.", ar: "تأشيرة ٣٠ من ٣٥٠ درهم. ٦٠ يوماً من ٥٥٠. ٩٠ يوماً من ٧٥٠.", ru: "Виза 30 дней от AED 350. 60 дней от AED 550. 90 дней от AED 750." },
    },
    {
      q: { fa: "چرا رزیدنسی۲۴ بهتر از اقدام مستقل است؟", en: "Why use Residency24 instead of applying directly?", ar: "لماذا رزيدنسي24 أفضل من التقديم المباشر؟", ru: "Зачем Residency24, если можно самостоятельно?" },
      a: { fa: "تیم ما مدارک را بررسی، خطاها را رفع و وضعیت را پیگیری می‌کند. نرخ موفقیت: ۹۵٪+ در مقابل ۷۰–۸۰٪ اقدام مستقل.", en: "Our team reviews documents, fixes errors, tracks status, appeals rejections. Success: 95%+ vs 70–80% self-applied.", ar: "فريقنا يراجع الوثائق ويصحح الأخطاء ويتابع الحالة. +٩٥٪ نجاح مقابل ٧٠-٨٠٪ للتقديم الشخصي.", ru: "Наша команда проверяет документы, исправляет ошибки, отслеживает статус. 95%+ успех против 70–80% самостоятельно." },
    },
  ];

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q[lang],
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a[lang],
      },
    })),
  };
}

export default async function TouristVisaLayout({ children, params }: { children: React.ReactNode; params: Promise<{ lang: string }> }) {
  const { lang: rawLang } = await params;
  const lang = (LANGS.includes(rawLang as Lang) ? rawLang : "en") as Lang;

  const schemas = [
    getBreadcrumbSchema(lang),
    getServiceSchema(lang),
    getFAQSchema(lang),
  ];

  return (
    <>
      {schemas.map((schema, i) => (
        <script
          key={`p006-schema-${i}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      {children}
    </>
  );
}
