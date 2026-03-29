"use client";

import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';

const ResidencyRoutes = () => {
  const { t } = useLanguage();
  const data = t.uae_page.residency_routes;

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      className="py-20 bg-surface"
    >
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-10">
          <span className="inline-block text-xs font-semibold text-gold tracking-[0.12em] uppercase mb-3">{data.badge}</span>
          <h2 className="text-[32px] font-bold text-navy mb-2">{data.h2}</h2>
          <p className="text-[15px] text-muted-foreground">{data.sub}</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {data.routes.map((route: any, i: number) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="bg-white rounded-xl border border-border p-7 hover:-translate-y-1 hover:shadow-lg transition-all duration-200"
            >
              <p className="text-[30px] font-bold text-navy mb-1">{route.duration}</p>
              <h3 className="text-lg font-bold text-navy mb-3">{route.title}</h3>
              <p className="text-[13px] text-gold font-medium mb-3">{route.requirement}</p>
              <p className="text-sm text-muted-foreground leading-relaxed">{route.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default ResidencyRoutes;
