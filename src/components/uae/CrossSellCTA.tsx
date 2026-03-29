"use client";

import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const CrossSellCTA = () => {
  const { t, isRTL } = useLanguage();
  const data = t.uae_page.cross_sell;

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      className="py-20 bg-white"
    >
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-10">
          <span className="inline-block text-xs font-semibold text-gold tracking-[0.12em] uppercase mb-3">{data.badge}</span>
          <h2 className="text-[32px] font-bold text-navy mb-2">{data.h2}</h2>
          <p className="text-[15px] text-muted-foreground">{data.sub}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {data.items.map((item: any, i: number) => (
            <a
              key={i}
              href={item.href}
              className="bg-white rounded-xl border border-border p-7 hover:border-navy hover:-translate-y-1 transition-all duration-200 group flex items-center gap-5"
            >
              <span className="text-4xl">{item.flag}</span>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-navy mb-1">{item.country}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
              <span className="flex items-center gap-1 text-sm text-navy font-medium group-hover:text-gold transition-colors flex-shrink-0">
                {item.cta} <ArrowRight size={14} className={isRTL ? 'rotate-180' : ''} />
              </span>
            </a>
          ))}
        </div>

        <div className="text-center">
          <a href={data.compare_href} className="inline-block bg-navy text-white rounded-lg px-8 py-3 text-sm font-semibold hover:bg-navy-lt transition-colors">
            {data.compare_cta}
          </a>
        </div>
      </div>
    </motion.section>
  );
};

export default CrossSellCTA;
