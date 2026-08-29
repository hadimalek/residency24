"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { TrendingUp, ShieldOff, Key } from "lucide-react";

const ValueProps = () => {
  const { t } = useLanguage();
  const bp = t.bp;

  const cards = [
    { icon: TrendingUp, title: bp.value_yield_title, desc: bp.value_yield_desc },
    { icon: ShieldOff, title: bp.value_tax_title, desc: bp.value_tax_desc },
    { icon: Key, title: bp.value_visa_title, desc: bp.value_visa_desc },
  ];

  return (
    <section className="py-16 bg-surface">
      <div className="max-w-5xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl p-6 shadow-sm border-2 border-transparent hover:border-gold transition-colors"
          >
            <card.icon className="w-8 h-8 text-gold mb-4" />
            <h3 className="text-lg font-bold text-navy mb-2">{card.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{card.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ValueProps;
