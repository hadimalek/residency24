"use client";

import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';

const CompareSection = () => {
  const { t } = useLanguage();

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      className="py-20 bg-surface"
    >
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-10">
          <span className="inline-block text-xs font-semibold text-gold tracking-[0.12em] uppercase mb-3">{t.compare.badge}</span>
          <h2 className="text-[32px] font-bold text-navy mb-2">{t.compare.h2}</h2>
          <p className="text-[15px] text-muted-foreground">{t.compare.sub}</p>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-xl border border-border bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-navy text-white">
                <th className="text-start p-3 font-medium">{t.compare.headers.feature}</th>
                <th className="text-center p-3 font-medium">{t.compare.headers.uae}</th>
                <th className="text-center p-3 font-medium">{t.compare.headers.oman}</th>
                <th className="text-center p-3 font-medium">{t.compare.headers.turkey}</th>
              </tr>
            </thead>
            <tbody>
              {t.compare.rows.map((row: any, i: number) => (
                <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-surface'}>
                  <td className="p-3 font-medium text-navy">{row.label}</td>
                  <td className="p-3 text-center text-ink border-s-2 border-gold/30">{row.uae}</td>
                  <td className="p-3 text-center text-ink">{row.oman}</td>
                  <td className="p-3 text-center text-ink">{row.turkey}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Best for badges */}
        <div className="grid md:grid-cols-3 gap-3 mt-6">
          {(['uae', 'oman', 'turkey'] as const).map((key) => (
            <div key={key} className="bg-white border border-border rounded-lg p-3 text-center text-sm text-navy font-medium">
              {t.compare.best_for[key]}
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <a href={t.compare.cta_href} className="inline-block bg-navy text-white rounded-lg px-8 py-3 text-sm font-semibold hover:bg-navy-lt transition-colors">
            {t.compare.cta_full}
          </a>
        </div>
      </div>
    </motion.section>
  );
};

export default CompareSection;
