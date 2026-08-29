"use client";

import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

/** Names the landmark for screen readers, in the language of the page. */
const NAV_LABEL: Record<string, string> = {
  fa: "مسیر صفحه",
  en: "Breadcrumb",
  ar: "مسار التنقل",
  ru: "Навигационная цепочка",
};

/**
 * The trail on its own, with no background.
 *
 * It used to be a white strip wedged between the navbar and a navy hero —
 * a seam of the wrong colour, with gold-on-white links that were hard to
 * read. Now it sits inside the hero instead, so it is styled for a dark
 * ground and both callers share one implementation: HeroChat renders it over
 * the hero photo, and the band below covers the few pages with their own hero.
 */
export function BreadcrumbTrail({
  items,
  className = "",
}: {
  items: BreadcrumbItem[];
  className?: string;
}) {
  const { lang } = useLanguage();
  return (
    <nav aria-label={NAV_LABEL[lang] ?? NAV_LABEL.en} className={className}>
      <ol className="flex items-center gap-2 flex-wrap">
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-2">
            {i > 0 && (
              <span className="text-white/30 text-xs" aria-hidden="true">
                &rsaquo;
              </span>
            )}
            {item.href ? (
              <Link
                href={item.href}
                className="text-white/80 text-xs font-medium hover:text-gold transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-white/55 text-xs" aria-current="page">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/**
 * Standalone band, for the pages that build their own hero instead of using
 * HeroChat. Every one of them opens with `bg-navy`, so this reads as the top
 * of that hero rather than as a separate strip.
 */
const SharedBreadcrumb = ({ items }: { items: BreadcrumbItem[] }) => (
  <div className="bg-navy px-4 pt-4">
    <BreadcrumbTrail items={items} className="max-w-5xl mx-auto" />
  </div>
);

export default SharedBreadcrumb;
