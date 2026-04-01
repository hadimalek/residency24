"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

const CARDS = [
  {
    flag: "🇮🇷",
    titleKey: "nat_fa_title",
    itemsKey: "nat_fa_items",
    bg: "bg-blue-50 border-blue-200",
    iconColor: "text-navy",
    highlightLang: "fa",
  },
  {
    flag: "🇸🇦🇮🇶🇯🇴",
    titleKey: "nat_ar_title",
    itemsKey: "nat_ar_items",
    bg: "bg-green-50 border-green-200",
    iconColor: "text-green-700",
    highlightLang: "ar",
  },
  {
    flag: "🇷🇺",
    titleKey: "nat_ru_title",
    itemsKey: "nat_ru_items",
    bg: "bg-red-50 border-red-200",
    iconColor: "text-red-700",
    highlightLang: "ru",
  },
];

export default function GoldenVisaNationalityNotes() {
  const { t, lang } = useLanguage();
  const p = t.p004;

  // Sort cards so the one matching the current language is first
  const sorted = [...CARDS].sort((a, b) => {
    if (a.highlightLang === lang) return -1;
    if (b.highlightLang === lang) return 1;
    return 0;
  });

  return (
    <section className="bg-surface py-16 px-6">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold text-navy text-center mb-8">{p.nat_section_title}</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {sorted.map((card, i) => {
            const isHighlighted = card.highlightLang === lang;
            return (
              <motion.div
                key={card.titleKey}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`${card.bg} border rounded-xl p-5 ${isHighlighted ? "ring-2 ring-navy" : ""}`}
              >
                <h3 className="font-bold text-navy text-sm mb-3">
                  {card.flag} {p[card.titleKey]}
                </h3>
                <ul className="space-y-2">
                  {(p[card.itemsKey] as string[]).map((item: string, j: number) => (
                    <li key={j} className="flex items-start gap-2 text-xs text-navy/80">
                      <CheckCircle2 size={14} className={`${card.iconColor} flex-shrink-0 mt-0.5`} />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
