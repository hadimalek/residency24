"use client";

import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { Star, Building2, KeyRound, Laptop } from 'lucide-react';

const iconMap: Record<string, React.ReactNode> = {
  star: <Star size={20} className="text-gold" />,
  building: <Building2 size={20} className="text-gold" />,
  key: <KeyRound size={20} className="text-gold" />,
  laptop: <Laptop size={20} className="text-gold" />,
};

const Services = () => {
  const { t } = useLanguage();

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      className="py-20 bg-white"
    >
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-[32px] font-bold text-navy text-center mb-12">{t.services.h2}</h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {t.services.items.map((item: any, i: number) => (
            <div
              key={i}
              className="border-[1.5px] border-border rounded-xl p-7 hover:border-navy hover:-translate-y-1 transition-all duration-200 group"
            >
              <div className="w-10 h-10 rounded-full bg-navy flex items-center justify-center mb-4">
                {iconMap[item.icon]}
              </div>
              <h3 className="text-lg font-bold text-navy mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">{item.desc}</p>
              <span className="text-[13px] text-navy font-medium hover:underline cursor-pointer">{t.services.cta}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default Services;
