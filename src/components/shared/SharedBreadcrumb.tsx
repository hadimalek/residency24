"use client";

import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface SharedBreadcrumbProps {
  items: BreadcrumbItem[];
}

/** Names the landmark for screen readers, in the language of the page. */
const NAV_LABEL: Record<string, string> = {
  fa: "مسیر صفحه",
  en: "Breadcrumb",
  ar: "مسار التنقل",
  ru: "Навигационная цепочка",
};

const SharedBreadcrumb = ({ items }: SharedBreadcrumbProps) => {
  const { lang } = useLanguage();
  return (
    <nav
      aria-label={NAV_LABEL[lang] ?? NAV_LABEL.en}
      className="bg-white py-2 px-4 border-b border-border"
    >
      <div className="max-w-5xl mx-auto flex items-center gap-2 flex-wrap">
        {items.map((item, i) => (
          <span key={i} className="flex items-center gap-2">
            {i > 0 && <span className="text-muted-foreground/40 text-xs">&rsaquo;</span>}
            {item.href ? (
              <Link href={item.href} className="text-gold/70 text-xs font-medium hover:text-gold transition-colors">
                {item.label}
              </Link>
            ) : (
              <span className="text-muted-foreground text-xs">{item.label}</span>
            )}
          </span>
        ))}
      </div>
    </nav>
  );
};

export default SharedBreadcrumb;
