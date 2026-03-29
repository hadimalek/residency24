"use client";

import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const Testimonials = () => {
  const { t } = useLanguage();

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      className="py-20 bg-navy"
    >
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-4">
          <span className="inline-block text-xs font-semibold text-gold tracking-[0.12em] uppercase mb-3">{t.testimonials.badge}</span>
          <h2 className="text-[32px] font-bold text-white mb-4">{t.testimonials.h2}</h2>
          {t.testimonials.google && (
            <div className="flex items-center justify-center gap-2 mb-8">
              <div className="flex gap-0.5">
                {[1,2,3,4,5].map(i => <Star key={i} size={16} className="text-gold" fill="currentColor" />)}
              </div>
              <span className="text-white font-bold">{t.testimonials.google.rating}</span>
              <span className="text-white/50 text-sm">— {t.testimonials.google.reviews}</span>
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {t.testimonials.items.map((item: any, i: number) => (
            <div key={i} className="bg-white/[0.07] border border-white/[0.12] rounded-xl p-7 relative">
              <span className="text-5xl text-gold/50 absolute -top-1 left-5 leading-none select-none font-bold">"</span>
              <p className="text-[15px] text-white/[0.88] leading-[1.7] italic pt-6">{item.text}</p>
              <p className="text-sm text-white font-semibold mt-5">{item.name}</p>
              <p className="text-xs text-white/50">{item.route}</p>
              <span className="inline-block mt-2 text-[11px] bg-gold/20 text-gold px-2 py-0.5 rounded">{item.tag}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default Testimonials;
