"use client";

import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

// FAQPage JSON-LD is emitted HERE, from the exact questions rendered below, so
// the structured data always matches the visible FAQ (Google's requirement).
// The global layout no longer injects a generic FAQ schema.

const FAQ = () => {
  const { t } = useLanguage();
  const [openIndex, setOpenIndex] = useState(0);

  const items = (t.faq.items as { q: string; a: string }[]) || [];
  const faqSchema = items.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  } : null;

  return (
    <section className="py-20 bg-surface">
      {faqSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      )}
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
                  <p className="text-[15px] text-ink leading-[1.7] pt-3">
                    {item.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
