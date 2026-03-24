"use client";

import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';

const HowItWorks = () => {
  const { t, isRTL } = useLanguage();

  return (
    <section className="py-20 bg-background" style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-14">
          <span className="inline-block text-xs font-semibold tracking-wide text-primary bg-accent/15 border border-accent rounded-full px-4 py-1.5 mb-3">
            {t.how.badge}
          </span>
          <h2 className="text-[clamp(1.5rem,3vw,2.25rem)] font-bold text-primary mb-2">{t.how.h2}</h2>
          <p className="text-muted-foreground text-[15px]">{t.how.sub}</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 relative">
          {/* Connector line (desktop) */}
          <div className="hidden md:block absolute top-6 inset-x-[12%] border-t-2 border-dashed border-accent" />

          {t.how.steps.map((step: any, i: number) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.4, delay: i * 0.12 }}
              className="text-center relative flex flex-col items-center"
            >
              <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold mb-4 relative z-10">
                {step.num}
              </div>
              <h3 className="text-base font-bold text-primary mb-1">{step.title}</h3>
              <p className="text-[13px] text-muted-foreground leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
