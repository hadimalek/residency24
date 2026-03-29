"use client";

import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { BadgeDollarSign, Globe, ShieldCheck, Zap, Users, TrendingUp } from 'lucide-react';

const iconMap: Record<string, React.ReactNode> = {
  'badge-dollar-sign': <BadgeDollarSign size={20} className="text-gold" />,
  'globe': <Globe size={20} className="text-gold" />,
  'shield-check': <ShieldCheck size={20} className="text-gold" />,
  'zap': <Zap size={20} className="text-gold" />,
  'users': <Users size={20} className="text-gold" />,
  'trending-up': <TrendingUp size={20} className="text-gold" />,
};

const WhyUAE = () => {
  const { t } = useLanguage();
  const data = t.uae_page.why_uae;

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
          <h2 className="text-[32px] font-bold text-navy">{data.h2}</h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.items.map((item: any, i: number) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="bg-white rounded-xl border border-border p-7 hover:-translate-y-1 hover:shadow-lg transition-all duration-200"
            >
              <div className="w-10 h-10 rounded-full bg-navy flex items-center justify-center mb-4">
                {iconMap[item.icon]}
              </div>
              <h3 className="text-lg font-bold text-navy mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default WhyUAE;
