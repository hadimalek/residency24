"use client";

import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { Star, Building2, Home, Plane, CreditCard, Globe } from 'lucide-react';

const iconMap: Record<string, React.ReactNode> = {
  star: <Star size={18} className="text-gold" />,
  building2: <Building2 size={18} className="text-gold" />,
  home: <Home size={18} className="text-gold" />,
  plane: <Plane size={18} className="text-gold" />,
  'id-card': <CreditCard size={18} className="text-gold" />,
  passport: <Globe size={18} className="text-gold" />,
};

const AllServicesGrid = () => {
  const { t } = useLanguage();

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      className="py-20 bg-white"
    >
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <span className="inline-block text-xs font-semibold text-gold tracking-[0.12em] uppercase mb-3">{t.all_services.badge}</span>
          <h2 className="text-[32px] font-bold text-navy mb-3">{t.all_services.h2}</h2>
          <p className="text-[15px] text-muted-foreground max-w-[640px] mx-auto">{t.all_services.sub}</p>
        </div>

        {t.all_services.groups.map((group: any, gi: number) => (
          <div key={gi} className="mb-10">
            <h3 className={`text-base font-semibold mb-4 pb-2 border-b-2 ${
              group.color === 'navy' ? 'text-navy border-navy' : group.color === 'teal' ? 'text-teal-600 border-teal-500' : 'text-gold-dk border-gold'
            }`}>
              {group.country}
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {group.services.map((s: any, si: number) => (
                <a
                  key={si}
                  href={s.href}
                  className="border border-border rounded-xl p-4 hover:border-navy hover:-translate-y-0.5 transition-all duration-200 block relative"
                >
                  {s.tag && (
                    <span className="absolute top-3 end-3 text-[10px] bg-gold/20 text-gold-dk font-semibold px-2 py-0.5 rounded">{s.tag}</span>
                  )}
                  <div className="w-9 h-9 rounded-full bg-navy flex items-center justify-center mb-3">
                    {iconMap[s.icon] || <Star size={18} className="text-gold" />}
                  </div>
                  <h4 className="text-[15px] font-medium text-navy">{s.name}</h4>
                  <p className="text-[13px] text-muted-foreground mt-1">{s.desc}</p>
                  <p className="text-xs text-gold font-semibold mt-2">{s.price}</p>
                </a>
              ))}
            </div>
          </div>
        ))}

        {/* Compare CTA */}
        <a
          href={t.all_services.compare_href}
          className="block w-full bg-navy text-center text-gold font-semibold py-4 rounded-xl hover:bg-navy-lt transition-colors"
        >
          ⚖️ {t.all_services.compare_cta}
        </a>
      </div>
    </motion.section>
  );
};

export default AllServicesGrid;
