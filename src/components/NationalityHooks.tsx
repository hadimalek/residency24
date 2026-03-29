"use client";

import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { ChevronUp, ChevronDown, Check } from 'lucide-react';

const NationalityHooks = () => {
  const { t } = useLanguage();
  const [openIndex, setOpenIndex] = useState(0);

  const scrollToChat = (question: string) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => {
      const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
      if (textarea) {
        textarea.value = question;
        textarea.dispatchEvent(new Event('input', { bubbles: true }));
        textarea.focus();
      }
    }, 500);
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      className="py-20 bg-surface"
    >
      <div className="max-w-[860px] mx-auto px-4">
        <div className="text-center mb-10">
          <span className="inline-block text-xs font-semibold text-gold tracking-[0.12em] uppercase mb-3">{t.nationalities.badge}</span>
          <h2 className="text-[32px] font-bold text-navy">{t.nationalities.h2}</h2>
        </div>

        <div className="divide-y divide-border bg-white rounded-xl overflow-hidden">
          {t.nationalities.items.map((panel: any, i: number) => {
            const isOpen = openIndex === i;
            return (
              <div key={i}>
                <button
                  onClick={() => setOpenIndex(isOpen ? -1 : i)}
                  className="w-full flex items-center justify-between text-start p-5"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{panel.flag}</span>
                    <div>
                      <span className="text-base font-medium text-navy">{panel.title}</span>
                      {panel.stats && <p className="text-xs text-muted-foreground">{panel.stats}</p>}
                    </div>
                  </div>
                  {isOpen ? <ChevronUp size={20} className="text-gold" /> : <ChevronDown size={20} className="text-muted-foreground" />}
                </button>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    transition={{ duration: 0.25 }}
                    className="px-5 pb-5"
                  >
                    <p className="text-[15px] text-ink leading-[1.7] mb-4">{panel.desc}</p>
                    {panel.points && (
                      <ul className="space-y-2 mb-4">
                        {panel.points.map((p: string, j: number) => (
                          <li key={j} className="flex items-center gap-2 text-sm text-ink">
                            <Check size={14} className="text-gold flex-shrink-0" /> {p}
                          </li>
                        ))}
                      </ul>
                    )}
                    <button
                      onClick={() => scrollToChat(panel.ask)}
                      className="text-sm text-navy underline hover:opacity-80"
                    >
                      → {panel.ask}
                    </button>
                  </motion.div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </motion.section>
  );
};

export default NationalityHooks;
