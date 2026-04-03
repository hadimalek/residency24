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
}

const SharedCrossSell = ({ items, title }: SharedCrossSellProps) => {
  const { t, isRTL } = useLanguage();
  const s = t.shared;
  const Arrow = isRTL ? ChevronLeft : ChevronRight;

  return (
    <section className="py-12 bg-surface">
      <div className="max-w-5xl mx-auto px-4">
        {title && (
          <h2 className="text-xl font-bold text-navy mb-6">{title}</h2>
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
                  className={`block bg-white border rounded-xl p-4 flex flex-col hover:shadow-md hover:-translate-y-0.5 transition-all h-full ${
                    item.isHighlighted ? "border-2 border-gold" : "border-border"
                  }`}
                >
                  {item.badge && (
                    <span className="bg-gold text-navy text-xs font-bold px-2 py-0.5 rounded-full inline-block mb-2 self-start">
                      {item.badge}
                    </span>
                  )}
                  <div className="w-9 h-9 rounded-lg bg-navy/5 flex items-center justify-center mb-3">
                    <Icon className="w-5 h-5 text-navy" />
                  </div>
                  <h3 className="text-sm font-semibold text-navy mb-1">{item.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-3 flex-1">
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
