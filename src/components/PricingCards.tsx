"use client";

import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';

const PricingCards = () => {
  const { t } = useLanguage();
  const scrollToChat = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => document.querySelector('textarea')?.focus(), 500);
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      className="py-20 bg-white"
    >
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <span className="inline-block text-xs font-semibold text-gold tracking-[0.12em] uppercase mb-3">{t.pricing.badge}</span>
          <h2 className="text-[32px] font-bold text-navy mb-3">{t.pricing.h2}</h2>
          <p className="text-[15px] text-muted-foreground max-w-[640px] mx-auto">{t.pricing.sub}</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {t.pricing.cards.map((card: any, i: number) => (
            <div key={i} className={`bg-navy rounded-2xl p-7 flex flex-col relative ${card.highlight ? 'border-2 border-gold' : ''}`}>
              {card.highlight && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gold text-navy text-[11px] font-semibold px-3 py-1 rounded">{t.pricing.popular}</span>
              )}
              <p className="text-[11px] text-white/50 uppercase tracking-[0.1em] mb-4">{card.type}</p>
              <p className="text-[13px] text-white/55 mb-1">{t.pricing.from_label}</p>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-4xl font-bold text-white">{card.from}</span>
                <span className="text-sm text-white/60">{card.currency}</span>
              </div>
              {card.note && <p className="text-xs text-white/40 mb-4">{card.note}</p>}
              <p className="text-[13px] text-white/55 mb-3">{t.pricing.best_label}</p>
              <ul className="space-y-2 flex-1 mb-6">
                {card.best.map((item: string, j: number) => (
                  <li key={j} className="text-sm text-white leading-relaxed flex items-start gap-2">
                    <span className="text-gold mt-0.5">•</span> {item}
                  </li>
                ))}
              </ul>
              <button onClick={scrollToChat} className="w-full bg-gold text-navy rounded-lg py-3 text-sm font-semibold hover:bg-gold-dk transition-colors">
                {t.pricing.cta}
              </button>
            </div>
          ))}
        </div>
        {t.pricing.disclaimer && (
          <p className="text-xs text-muted-foreground text-center mt-6">{t.pricing.disclaimer}</p>
        )}
      </div>
    </motion.section>
  );
};

export default PricingCards;
