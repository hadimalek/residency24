"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";

export interface CrossSellItem {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  isHighlighted?: boolean;
  badge?: string;
}

interface SharedCrossSellProps {
  items: CrossSellItem[];
  title?: string;
  variant?: "light" | "dark";
}

const SharedCrossSell = ({ items, title, variant = "light" }: SharedCrossSellProps) => {
  const { t, isRTL } = useLanguage();
  const s = t.shared;
  const Arrow = isRTL ? ChevronLeft : ChevronRight;
  const isDark = variant === "dark";

  return (
    <section className={`py-12 ${isDark ? "bg-navy" : "bg-surface"}`}>
      <div className="max-w-5xl mx-auto px-4">
        {title && (
          <h2 className={`text-xl font-bold mb-6 ${isDark ? "text-gold text-center" : "text-navy"}`}>{title}</h2>
        )}

        <div className={`grid gap-4 ${items.length <= 2 ? "grid-cols-1 md:grid-cols-2" : "grid-cols-2 md:grid-cols-4"}`}>
          {items.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
              >
                <Link
                  href={item.href}
                  className={`block border rounded-xl p-4 flex flex-col hover:-translate-y-0.5 transition-all h-full ${
                    isDark
                      ? item.isHighlighted
                        ? "bg-white/10 border-2 border-gold/40 hover:bg-white/15"
                        : "bg-white/5 border-white/10 hover:bg-white/10"
                      : item.isHighlighted
                        ? "bg-white border-2 border-gold hover:shadow-md"
                        : "bg-white border-border hover:shadow-md"
                  }`}
                >
                  {item.badge && (
                    <span className="bg-gold text-navy text-xs font-bold px-2 py-0.5 rounded-full inline-block mb-2 self-start">
                      {item.badge}
                    </span>
                  )}
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${isDark ? "bg-white/10" : "bg-navy/5"}`}>
                    <Icon className={`w-5 h-5 ${isDark ? "text-gold" : "text-navy"}`} />
                  </div>
                  <h3 className={`text-sm font-semibold mb-1 ${isDark ? "text-white" : "text-navy"}`}>{item.title}</h3>
                  <p className={`text-xs leading-relaxed mb-3 flex-1 ${isDark ? "text-white/60" : "text-muted-foreground"}`}>
                    {item.description}
                  </p>
                  <span className="flex items-center gap-1 text-xs font-semibold text-gold">
                    {s.crosssell_view} <Arrow className="w-4 h-4" />
                  </span>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SharedCrossSell;
