"use client";

import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { Star, Building2, Home, Plane } from 'lucide-react';

const iconMap: Record<string, React.ReactNode> = {
  star: <Star size={20} className="text-gold" />,
  building2: <Building2 size={20} className="text-gold" />,
  home: <Home size={20} className="text-gold" />,
  plane: <Plane size={20} className="text-gold" />,
};

const UAEServicesGrid = () => {
  const { t } = useLanguage();
  const data = t.uae_page.services_grid;

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      className="py-20 bg-white"
    >
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <span className="inline-block text-xs font-semibold text-gold tracking-[0.12em] uppercase mb-3">{data.badge}</span>
          <h2 className="text-[32px] font-bold text-navy">{data.h2}</h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {data.items.map((item: any, i: number) => (
            <a
              key={i}
              href={item.href}
              className="border-[1.5px] border-border rounded-xl p-7 hover:border-navy hover:-translate-y-1 transition-all duration-200 group relative block"
            >
              {item.tag && (
                <span className="absolute -top-3 end-4 bg-gold text-navy text-[11px] font-semibold px-2.5 py-1 rounded">{item.tag}</span>
              )}
              <div className="w-10 h-10 rounded-full bg-navy flex items-center justify-center mb-4">
                {iconMap[item.icon]}
              </div>
              <h3 className="text-lg font-bold text-navy mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-3">{item.desc}</p>
              <p className="text-[13px] font-semibold text-navy">{item.price}</p>
              <span className="text-[13px] text-navy font-medium hover:underline mt-2 inline-block">{data.cta}</span>
            </a>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default UAEServicesGrid;
