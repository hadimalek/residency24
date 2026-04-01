"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { ChevronRight, ChevronLeft } from "lucide-react";

export default function GoldenVisaBreadcrumb() {
  const { t, lang, isRTL } = useLanguage();
  const Chevron = isRTL ? ChevronLeft : ChevronRight;

  const crumbs = [
    { label: lang === "fa" ? "خانه" : lang === "ar" ? "الرئيسية" : lang === "ru" ? "Главная" : "Home", href: `/${lang}/` },
    { label: t.p004.breadcrumb_uae, href: `/${lang}/uae/` },
    { label: t.p004.breadcrumb_gv },
  ];

  return (
    <nav className="bg-white border-b border-border" aria-label="Breadcrumb">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-1 text-xs text-text-secondary">
        {crumbs.map((crumb, i) => (
          <span key={i} className="flex items-center gap-1">
            {i > 0 && <Chevron size={12} className="text-text-secondary/50" />}
            {crumb.href ? (
              <a href={crumb.href} className="hover:text-navy transition-colors">
                {crumb.label}
              </a>
            ) : (
              <span className="text-navy font-medium">{crumb.label}</span>
            )}
          </span>
        ))}
      </div>
    </nav>
  );
}
