/**
 * Services sidebar config — promoted services shown next to a blog post.
 * Each language has the same six entries; the order is reshuffled per
 * post-category so the most-relevant service comes first.
 */

export interface ServiceCard {
  /** Stable id used by the category-relevance map. */
  id: string;
  title: string;
  subtitle: string;
  /** Href is the same for every language; we keep absolute paths to the
   *  localized versions of each landing page. */
  href: string;
}

const FA_SERVICES: ServiceCard[] = [
  { id: "uae-company",    title: "ثبت شرکت در دبی",     subtitle: "۵ روزه و غیرحضوری",        href: "/fa/uae/company-registration/" },
  { id: "uae-property",   title: "خرید ملک در امارات",  subtitle: "اقساط بدون بهره!",          href: "/fa/uae/buy-property/" },
  { id: "uae-residency",  title: "اقامت امارات",         subtitle: "۱ تا ۱۰ ساله!",             href: "/fa/uae/golden-visa/" },
  { id: "oman-company",   title: "ثبت شرکت در عمان",     subtitle: "فرصت حضور در بازار بین‌الملل", href: "/fa/oman/company-registration/" },
  { id: "oman-property",  title: "خرید ملک در عمان",     subtitle: "مالکیت ۱۰۰٪",                href: "/fa/oman/buy-property/" },
  { id: "oman-residency", title: "اقامت عمان",            subtitle: "زندگی آرام و امن",          href: "/fa/oman/residency-visa/" },
];

const EN_SERVICES: ServiceCard[] = [
  { id: "uae-company",    title: "UAE Company Setup",      subtitle: "5 days, fully remote",      href: "/uae/company-registration/" },
  { id: "uae-property",   title: "Property in UAE",         subtitle: "Interest-free instalments", href: "/uae/buy-property/" },
  { id: "uae-residency",  title: "UAE Residency",           subtitle: "2 to 10 years",             href: "/uae/golden-visa/" },
  { id: "oman-company",   title: "Oman Company Setup",      subtitle: "Access to GCC markets",     href: "/oman/company-registration/" },
  { id: "oman-property",  title: "Property in Oman",        subtitle: "100% ownership",            href: "/oman/buy-property/" },
  { id: "oman-residency", title: "Oman Residency",          subtitle: "Calm, family-friendly",     href: "/oman/residency-visa/" },
];

const RU_SERVICES: ServiceCard[] = [
  { id: "uae-company",    title: "Регистрация компании в Дубае", subtitle: "5 дней, удалённо",           href: "/ru/uae/company-registration/" },
  { id: "uae-property",   title: "Недвижимость в ОАЭ",            subtitle: "Беспроцентная рассрочка",     href: "/ru/uae/buy-property/" },
  { id: "uae-residency",  title: "Резидентство ОАЭ",               subtitle: "От 2 до 10 лет",              href: "/ru/uae/golden-visa/" },
  { id: "oman-company",   title: "Регистрация компании в Омане",   subtitle: "Выход на рынки Залива",       href: "/ru/oman/company-registration/" },
  { id: "oman-property",  title: "Недвижимость в Омане",           subtitle: "100 % собственность",         href: "/ru/oman/buy-property/" },
  { id: "oman-residency", title: "Резидентство Омана",              subtitle: "Спокойная жизнь",             href: "/ru/oman/residency-visa/" },
];

const AR_SERVICES: ServiceCard[] = [
  { id: "uae-company",    title: "تأسيس شركة في دبي",     subtitle: "خلال ٥ أيام عن بُعد",         href: "/ar/uae/company-registration/" },
  { id: "uae-property",   title: "شراء عقار في الإمارات", subtitle: "تقسيط بدون فوائد",            href: "/ar/uae/buy-property/" },
  { id: "uae-residency",  title: "إقامة الإمارات",          subtitle: "من سنتين إلى عشر سنوات",     href: "/ar/uae/golden-visa/" },
  { id: "oman-company",   title: "تأسيس شركة في عُمان",   subtitle: "بوابة لأسواق الخليج",         href: "/ar/oman/company-registration/" },
  { id: "oman-property",  title: "شراء عقار في عُمان",     subtitle: "ملكية 100٪",                  href: "/ar/oman/buy-property/" },
  { id: "oman-residency", title: "إقامة عُمان",              subtitle: "حياة هادئة وآمنة",            href: "/ar/oman/residency-visa/" },
];

const ALL_SERVICES: Record<string, ServiceCard[]> = {
  fa: FA_SERVICES,
  en: EN_SERVICES,
  ru: RU_SERVICES,
  ar: AR_SERVICES,
};

/** Mapping from category slug → service ids in priority order.
 *  Multiple slugs may map to the same priority order. The mapping is
 *  best-effort; categories not in the map fall back to the default order. */
const CATEGORY_PRIORITY: Record<string, string[]> = {
  // Persian slugs
  "ثبت-شرکت":                ["uae-company", "oman-company", "uae-residency"],
  "property-buying-guide":   ["uae-property", "oman-property", "uae-residency"],
  "investment-guide":        ["uae-property", "oman-property", "uae-company"],
  "migration-destinations":  ["uae-residency", "oman-residency", "uae-property"],
  "country-guides":          ["uae-residency", "oman-residency", "uae-company"],
  "study-immigration-guide": ["uae-residency", "uae-company"],
  "work-immigration-guide":  ["uae-residency", "uae-company", "oman-residency"],
  "immigration-documents":   ["uae-residency", "oman-residency"],
  "immigration":             ["uae-residency", "oman-residency", "uae-company"],
  "travel-and-entertainment":["uae-residency", "uae-property"],
};

/**
 * Reorder services so the highest-priority for the post category come first.
 * Unmatched IDs preserve original order behind the prioritized prefix.
 */
function prioritize(services: ServiceCard[], priorityIds: string[]): ServiceCard[] {
  if (!priorityIds || priorityIds.length === 0) return services;
  const byId = new Map(services.map((s) => [s.id, s]));
  const seen = new Set<string>();
  const head: ServiceCard[] = [];
  for (const id of priorityIds) {
    const s = byId.get(id);
    if (s && !seen.has(id)) {
      head.push(s);
      seen.add(id);
    }
  }
  const tail = services.filter((s) => !seen.has(s.id));
  return [...head, ...tail];
}

export function getServicesForPost(lang: string, categorySlug: string | null): ServiceCard[] {
  const base = ALL_SERVICES[lang] ?? ALL_SERVICES.en;
  if (!categorySlug) return base;
  return prioritize(base, CATEGORY_PRIORITY[categorySlug] ?? []);
}
