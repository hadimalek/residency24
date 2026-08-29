"use client";

import { useLanguage } from "@/contexts/LanguageContext";

const PropertyStats = () => {
  const { t } = useLanguage();
  const bp = t.bp;
  const stats = [
    { num: bp.stats_yield_num, label: bp.stats_yield_label },
    { num: bp.stats_tax_num, label: bp.stats_tax_label },
    { num: bp.stats_entry_num, label: bp.stats_entry_label },
    { num: bp.stats_visa_num, label: bp.stats_visa_label },
  ];

  return (
    <section className="py-12 bg-navy">
      <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        {stats.map((s, i) => (
          <div key={i} className="relative">
            <p className="text-3xl md:text-4xl font-extrabold text-gold font-sans">{s.num}</p>
            <p className="text-sm text-white/70 mt-2">{s.label}</p>
            {i < stats.length - 1 && (
              <div className="hidden md:block absolute end-0 top-1/2 -translate-y-1/2 w-px h-10 bg-white/20" />
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default PropertyStats;
