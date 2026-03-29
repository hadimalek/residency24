"use client";

import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const PathFinder = () => {
  const { t, isRTL } = useLanguage();
  const data = t.uae_page.pathfinder;

  const scrollToChat = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => document.querySelector('textarea')?.focus(), 500);
  };

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
          <h2 className="text-[32px] font-bold text-navy mb-3">{data.h2}</h2>
          <p className="text-[15px] text-muted-foreground">{data.sub}</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {data.paths.map((path: any, i: number) => (
            <motion.a
              key={i}
              href={path.href}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="bg-navy rounded-2xl p-7 flex flex-col hover:-translate-y-1 transition-all duration-200 group"
            >
              <p className="text-[11px] text-white/50 uppercase tracking-[0.1em] mb-4">{path.best_for}</p>
              <h3 className="text-lg font-bold text-white mb-3">{path.title}</h3>
              <p className="text-sm text-white/70 mb-2">{path.budget}</p>
              <p className="text-[13px] text-gold mb-4">{path.visa}</p>
              <span className="mt-auto flex items-center gap-1 text-sm text-white font-medium group-hover:text-gold transition-colors">
                {data.cta} <ArrowRight size={14} className={isRTL ? 'rotate-180' : ''} />
              </span>
            </motion.a>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default PathFinder;
