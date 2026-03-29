"use client";

import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';

const DubaiAreas = () => {
  const { t } = useLanguage();
  const data = t.uae_page.dubai_areas;

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      className="py-20 bg-surface"
    >
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <span className="inline-block text-xs font-semibold text-gold tracking-[0.12em] uppercase mb-3">{data.badge}</span>
          <h2 className="text-[32px] font-bold text-navy mb-2">{data.h2}</h2>
          <p className="text-[15px] text-muted-foreground">{data.sub}</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.areas.map((area: any, i: number) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="bg-white rounded-xl border border-border p-7 hover:-translate-y-1 hover:shadow-lg transition-all duration-200"
            >
              <div className="flex items-center gap-2 mb-3">
                <MapPin size={16} className="text-gold flex-shrink-0" />
                <h3 className="text-lg font-bold text-navy">{area.name}</h3>
              </div>
              <p className="text-[11px] text-muted-foreground uppercase tracking-[0.1em] mb-2">{area.type}</p>
              <p className="text-sm text-ink leading-relaxed mb-3">{area.desc}</p>
              <span className="inline-block text-[13px] bg-gold/20 text-navy font-semibold px-3 py-1 rounded">{area.roi}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default DubaiAreas;
