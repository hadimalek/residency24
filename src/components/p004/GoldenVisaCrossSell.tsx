"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { Home, Building2, MapPin, BarChart3 } from "lucide-react";
import { motion } from "framer-motion";

const CARDS = [
  { icon: Home, titleKey: "cross_property_title", descKey: "cross_property_desc", href: "/uae/buy-property/", featured: true, gaKey: "buy_property" },
  { icon: Building2, titleKey: "cross_company_title", descKey: "cross_company_desc", href: "/uae/company-registration/", featured: false, gaKey: "company_reg" },
  { icon: MapPin, titleKey: "cross_oman_title", descKey: "cross_oman_desc", href: "/oman/", featured: false, gaKey: "oman" },
  { icon: BarChart3, titleKey: "cross_compare_title", descKey: "cross_compare_desc", href: "/compare/uae-vs-oman-vs-turkey/", featured: false, gaKey: "compare" },
];

export default function GoldenVisaCrossSell() {
  const { t, lang } = useLanguage();
  const p = t.p004;

  const handleClick = (gaKey: string) => {
    (window as any).gtag?.("event", "golden_visa_cross_sell_click", {
      destination: gaKey,
      language: lang,
    });
  };

  return (
    <section className="bg-navy py-16 px-6">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold text-gold text-center mb-8">{p.cross_sell_title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {CARDS.map((card, i) => {
            const Icon = card.icon;
            return (
              <motion.a
                key={card.titleKey}
                href={`/${lang}${card.href}`}
                onClick={() => handleClick(card.gaKey)}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`rounded-xl p-5 block transition-all hover:scale-[1.02] ${
                  card.featured
                    ? "bg-white/10 border-2 border-gold/40"
                    : "bg-white/5 border border-white/10"
                }`}
              >
                <Icon size={24} className="text-gold mb-3" />
                <h3 className="font-bold text-white text-sm mb-1">{p[card.titleKey]}</h3>
                <p className="text-white/60 text-xs mb-3">{p[card.descKey]}</p>
                <span
                  className={`inline-block text-xs rounded-lg px-4 py-2 font-bold ${
                    card.featured
                      ? "bg-gold text-navy"
                      : "border border-gold/50 text-gold"
                  }`}
                >
                  {p.cta_secondary}
                </span>
              </motion.a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
