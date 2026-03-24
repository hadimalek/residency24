"use client";

import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { Shield, CheckCircle, Users, Clock, Lock, Award } from 'lucide-react';

const trustIcons: Record<string, React.ReactNode> = {
  shield: <Shield size={20} className="text-gold" />,
  'check-circle': <CheckCircle size={20} className="text-gold" />,
  users: <Users size={20} className="text-gold" />,
  clock: <Clock size={20} className="text-gold" />,
  lock: <Lock size={20} className="text-gold" />,
  award: <Award size={20} className="text-gold" />,
};

const TrustCompliance = () => {
  const { t } = useLanguage();

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      className="py-16 bg-surface"
    >
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-10">
          <span className="inline-block text-xs font-semibold text-gold tracking-[0.12em] uppercase mb-3">{t.trust.badge}</span>
          <h2 className="text-[32px] font-bold text-navy">{t.trust.h2}</h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
          {t.trust.items.map((item: any, i: number) => (
            <div key={i} className="flex gap-3 items-start">
              <div className="w-10 h-10 rounded-full bg-navy flex items-center justify-center flex-shrink-0">
                {trustIcons[item.icon]}
              </div>
              <div>
                <h4 className="text-sm font-semibold text-navy">{item.title}</h4>
                <p className="text-[13px] text-muted-foreground mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Disclaimer */}
        <div className="bg-[#FFFBF0] border-s-[3px] border-amber-400 rounded-lg p-4 text-sm text-ink leading-relaxed">
          {t.trust.disclaimer}
        </div>

        <div className="text-center mt-6">
          <a href={t.trust.href} className="text-sm text-navy font-medium hover:underline">{t.trust.cta} →</a>
        </div>
      </div>
    </motion.section>
  );
};

export default TrustCompliance;
