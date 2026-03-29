"use client";

import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';

const CostBreakdown = () => {
  const { t } = useLanguage();
  const data = t.uae_page.cost_breakdown;

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      className="py-20 bg-white"
    >
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-12">
          <span className="inline-block text-xs font-semibold text-gold tracking-[0.12em] uppercase mb-3">{data.badge}</span>
          <h2 className="text-[32px] font-bold text-navy mb-3">{data.h2}</h2>
          <p className="text-[15px] text-muted-foreground">{data.sub}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {data.categories.map((cat: any, i: number) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-xl border border-border overflow-hidden"
            >
              <div className="bg-navy px-5 py-4">
                <h3 className="text-white font-bold">{cat.title}</h3>
              </div>
              <div className="p-5 space-y-3">
                {cat.items.map((item: any, j: number) => (
                  <div key={j} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{item.label}</span>
                    <span className="font-semibold text-navy">{item.value}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {data.disclaimer && (
          <p className="text-xs text-muted-foreground text-center mt-6">{data.disclaimer}</p>
        )}
      </div>
    </motion.section>
  );
};

export default CostBreakdown;
