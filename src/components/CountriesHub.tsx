"use client";

import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const CountriesHub = () => {
  const { t } = useLanguage();

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      className="py-20 bg-surface"
    >
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <span className="inline-block text-xs font-semibold text-gold tracking-[0.12em] uppercase mb-3">{t.countries.badge}</span>
          <h2 className="text-[32px] font-bold text-navy">{t.countries.h2}</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {t.countries.items.map((country: any, i: number) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-xl border border-border overflow-hidden hover:-translate-y-1 hover:shadow-lg transition-all duration-200 group"
            >
              {/* Image */}
              <div className="relative aspect-[3/2] overflow-hidden">
                <img src={country.img} alt={country.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-2xl mb-0.5">{country.flag}</p>
                  <h3 className="text-white font-bold text-lg">{country.name}</h3>
                  <p className="text-white/70 text-sm">{country.tagline}</p>
                </div>
                {country.badge_new && (
                  <span className="absolute top-3 end-3 bg-gold text-navy text-[11px] font-semibold px-2.5 py-1 rounded">{country.badge_new}</span>
                )}
              </div>

              {/* Body */}
              <div className="p-5">
                {/* Highlights */}
                <div className="space-y-2 mb-4">
                  {country.highlights.map((h: string, j: number) => (
                    <div key={j} className="flex items-center gap-2 text-sm text-ink">
                      <Check size={14} className="text-gold flex-shrink-0" />
                      {h}
                    </div>
                  ))}
                </div>

                {/* Service quick-links */}
                <div className="space-y-1.5 mb-5">
                  {country.services.map((s: any, j: number) => (
                    <a key={j} href={s.href} className="flex justify-between text-[13px] text-navy hover:underline">
                      <span>{s.name}</span>
                      <span className="text-muted-foreground">{s.price}</span>
                    </a>
                  ))}
                </div>

                {/* CTA */}
                <a href={country.href} className="block w-full text-center bg-navy text-white rounded-lg py-3 text-sm font-semibold hover:bg-navy-lt transition-colors">
                  {country.cta}
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default CountriesHub;
