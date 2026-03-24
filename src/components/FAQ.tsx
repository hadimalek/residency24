"use client";

import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import translations from '@/translations';

const FAQ = () => {
  const { t } = useLanguage();
  const [openIndex, setOpenIndex] = useState(0);

  useEffect(() => {
    const enFaq = translations.en.faq.items;
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: enFaq.map((item: any) => ({
        '@type': 'Question',
        name: item.q,
        acceptedAnswer: { '@type': 'Answer', text: item.a },
      })),
    });
    document.head.appendChild(script);
    return () => { document.head.removeChild(script); };
  }, []);

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      className="py-20 bg-surface"
    >
      <div className="max-w-[760px] mx-auto px-4">
        <div className="text-center mb-10">
          <span className="inline-block text-xs font-semibold text-gold tracking-[0.12em] uppercase mb-3">{t.faq.badge}</span>
          <h2 className="text-[32px] font-bold text-navy">{t.faq.h2}</h2>
        </div>
        <div className="divide-y divide-border">
          {t.faq.items.map((item: any, i: number) => {
            const isOpen = openIndex === i;
            return (
              <div key={i} className="py-5">
                <button onClick={() => setOpenIndex(isOpen ? -1 : i)} className="w-full flex items-center justify-between text-start">
                  <span className="text-base font-medium text-navy pe-4">{item.q}</span>
                  <span className="text-[22px] text-gold flex-shrink-0">{isOpen ? '−' : '+'}</span>
                </button>
                {isOpen && (
                  <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} transition={{ duration: 0.25 }} className="text-[15px] text-ink leading-[1.7] pt-3">
                    {item.a}
                  </motion.p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </motion.section>
  );
};

export default FAQ;
