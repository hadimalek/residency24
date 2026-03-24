"use client";

import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';

const VideoSection = () => {
  const { t } = useLanguage();

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      className="py-20 bg-navy"
    >
      <div className="max-w-6xl mx-auto px-4 grid lg:grid-cols-5 gap-12 items-center">
        <div className="lg:col-span-3 relative rounded-2xl overflow-hidden aspect-video">
          <img src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=900&q=80" alt="Dubai skyline" className="w-full h-full object-cover" loading="lazy" />
          <div className="absolute inset-0 bg-black/30" />
          <button className="absolute inset-0 flex items-center justify-center group">
            <div className="w-[72px] h-[72px] rounded-full bg-gold/90 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Play size={28} className="text-navy ms-1" fill="currentColor" />
            </div>
          </button>
        </div>
        <div className="lg:col-span-2">
          <div className="inline-flex items-center gap-2 bg-gold/15 border border-gold/40 rounded-full px-4 py-1.5 mb-5">
            <span className="text-xs text-gold tracking-wide font-medium">{t.video.badge}</span>
          </div>
          <h2 className="text-[32px] font-bold text-white leading-tight mb-3">{t.video.h2}</h2>
          <p className="text-[15px] text-white/70 leading-relaxed mb-8">{t.video.sub}</p>
          <div className="grid grid-cols-2 gap-6">
            {t.video.facts.map((fact: any, i: number) => (
              <div key={i}>
                <p className="text-[28px] font-bold text-gold">{fact.num}</p>
                <p className="text-[13px] text-white/60">{fact.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default VideoSection;
