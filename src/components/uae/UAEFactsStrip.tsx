"use client";

import { useLanguage } from '@/contexts/LanguageContext';

const UAEFactsStrip = () => {
  const { t } = useLanguage();

  return (
    <section className="py-10 border-b border-border bg-white">
      <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        {t.uae_page.facts_strip.items.map((s: { num: string; label: string }, i: number) => (
          <div key={i} className="relative">
            <p className="text-[30px] font-bold text-navy">{s.num}</p>
            <p className="text-[13px] text-muted-foreground mt-1">{s.label}</p>
            {i < t.uae_page.facts_strip.items.length - 1 && (
              <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 w-px h-10 bg-border" />
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default UAEFactsStrip;
