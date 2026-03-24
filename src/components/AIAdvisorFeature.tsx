"use client";

import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { Zap, Globe, Shield, Users } from 'lucide-react';

const featureIcons: Record<string, React.ReactNode> = {
  zap: <Zap size={20} className="text-gold" />,
  globe: <Globe size={20} className="text-gold" />,
  shield: <Shield size={20} className="text-gold" />,
  users: <Users size={20} className="text-gold" />,
};

const AIAdvisorFeature = () => {
  const { t, isRTL } = useLanguage();

  const scrollToChat = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => document.querySelector('textarea')?.focus(), 500);
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      className="py-20 bg-navy"
    >
      <div className="max-w-6xl mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center">
        {/* Left — Features */}
        <div>
          <span className="inline-block text-xs font-semibold text-gold tracking-[0.12em] uppercase mb-3">{t.ai_advisor.badge}</span>
          <h2 className="text-[32px] font-bold text-white leading-tight mb-3">{t.ai_advisor.h2}</h2>
          <p className="text-[15px] text-white/70 leading-relaxed mb-8">{t.ai_advisor.sub}</p>

          <div className="grid grid-cols-2 gap-4">
            {t.ai_advisor.features.map((f: any, i: number) => (
              <div key={i} className="bg-white/[0.07] rounded-xl p-4">
                <div className="mb-2">{featureIcons[f.icon]}</div>
                <h4 className="text-sm font-semibold text-white mb-1">{f.title}</h4>
                <p className="text-xs text-white/60 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right — Demo chat */}
        <div className="bg-white rounded-2xl p-5 max-w-md mx-auto w-full">
          {/* User message */}
          <div className={`flex ${isRTL ? 'justify-start' : 'justify-end'} mb-3`}>
            <div className="bg-navy text-white rounded-2xl rounded-br-sm px-4 py-3 text-sm max-w-[85%]">
              {t.ai_advisor.demo.user_msg}
            </div>
          </div>
          {/* AI message */}
          <div className={`flex ${isRTL ? 'justify-end' : 'justify-start'} gap-2 mb-4`}>
            <div className="w-7 h-7 rounded-full bg-navy flex items-center justify-center flex-shrink-0 mt-1">
              <span className="text-[10px] font-bold text-gold">R24</span>
            </div>
            <div className="bg-surface text-ink rounded-2xl rounded-bl-sm px-4 py-3 text-sm leading-relaxed max-w-[85%]">
              {t.ai_advisor.demo.ai_msg}
            </div>
          </div>

          <button
            onClick={scrollToChat}
            className="w-full bg-gold text-navy rounded-lg py-3 text-sm font-semibold hover:bg-gold-dk transition-colors"
          >
            {t.ai_advisor.cta}
          </button>
        </div>
      </div>
    </motion.section>
  );
};

export default AIAdvisorFeature;
