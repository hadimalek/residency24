"use client";

import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';

const UAEFAQAccordion = () => {
  const { t } = useLanguage();
  const data = t.uae_page.faq;
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      className="py-20 bg-surface"
    >
      <div className="max-w-[760px] mx-auto px-4">
        <div className="text-center mb-10">
          <span className="inline-block text-xs font-semibold text-gold tracking-[0.12em] uppercase mb-3">{data.badge}</span>
          <h2 className="text-[32px] font-bold text-navy">{data.h2}</h2>
        </div>
        <div className="divide-y divide-border">
          {data.items.map((item: any, i: number) => {
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

export default UAEFAQAccordion;
