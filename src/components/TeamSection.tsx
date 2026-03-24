"use client";

import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { MapPin, Briefcase } from 'lucide-react';

const TeamSection = () => {
  const { t, isRTL, lang } = useLanguage();

  return (
    <motion.section
      id="team"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      className="py-24 bg-background"
      style={{ direction: isRTL ? 'rtl' : 'ltr' }}
    >
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block text-xs font-semibold text-gold tracking-[0.18em] uppercase mb-3">
            {t.team.badge}
          </span>
          <h2 className="text-[36px] font-bold text-navy mb-3">{t.team.h2}</h2>
          <p className="text-[15px] text-muted-foreground max-w-lg mx-auto">{t.team.sub}</p>
        </div>

        {/* Members grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-14">
          {t.team.members.map((m: any, i: number) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className="group relative bg-card rounded-2xl overflow-hidden border border-border hover:border-navy/40 hover:shadow-xl transition-all duration-300"
            >
              {/* Large photo area */}
              <div className="relative w-full aspect-[3/4] bg-navy overflow-hidden">
                {m.photo ? (
                  <img
                    src={m.photo}
                    alt={m.name}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-gold font-bold text-4xl">
                      {m.name.split(' ').map((w: string) => w[0]).join('').slice(0, 2)}
                    </span>
                  </div>
                )}
                {/* Gradient overlay at bottom */}
                <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-navy/80 to-transparent" />
              </div>

              {/* Info area */}
              <div className="p-5 text-center">
                <h4 className="text-lg font-bold text-navy leading-tight">{m.name}</h4>
                <p className="text-sm text-muted-foreground mt-1.5 flex items-center justify-center gap-1.5">
                  <Briefcase size={13} className="text-gold shrink-0" />
                  <span>{m.role}</span>
                </p>
                <p className="text-xs text-gold mt-2.5 flex items-center justify-center gap-1">
                  <MapPin size={12} /> {m.location}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Offices strip */}
        <div className="flex flex-wrap justify-center gap-3 mb-6">
          {t.team.offices.map((office: string, i: number) => (
            <div
              key={i}
              className="bg-navy text-white rounded-full px-5 py-2 text-sm"
            >
              {office}
            </div>
          ))}
        </div>

        {/* Meet more link */}
        {t.team.meet_more && (
          <div className="text-center">
            <a
              href={`/${lang}/team/`}
              className="text-sm text-gold hover:underline font-medium"
            >
              {t.team.meet_more} →
            </a>
          </div>
        )}
      </div>
    </motion.section>
  );
};

export default TeamSection;
