"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import {
  Shield,
  Briefcase,
  Sun,
  HeartPulse,
  Check,
  type LucideIcon,
} from "lucide-react";
import LandingLeadForm from "@/components/landing/LandingLeadForm";

interface InfoSection {
  title: string;
  body: string;
  points: string[];
}

export default function UaeLifeClient() {
  const { t, isRTL } = useLanguage();
  const u = t.uaeLife;

  const sections: { key: string; data: InfoSection; icon: LucideIcon }[] = [
    { key: "lifestyle", data: u.sections.lifestyle, icon: Shield },
    { key: "economy", data: u.sections.economy, icon: Briefcase },
    { key: "leisure", data: u.sections.leisure, icon: Sun },
    { key: "health", data: u.sections.health, icon: HeartPulse },
  ];

  const dir = isRTL ? "rtl" : "ltr";
  const year = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-background" style={{ direction: dir }}>
      {/* Hero + form */}
      <section className="bg-navy text-white">
        <div className="max-w-6xl mx-auto px-4 py-16 md:py-24 grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className={isRTL ? "text-right" : "text-left"}>
            <h1 className="text-3xl md:text-[44px] font-bold leading-tight text-white">
              {u.hero.headline}
            </h1>
            <p className="text-base md:text-lg text-white/75 mt-5 max-w-xl">{u.hero.sub}</p>
          </div>
          <div className="bg-white/5 rounded-3xl p-6 md:p-8 border border-gold/20">
            <LandingLeadForm variant="hero" sourceSlug="uae-life" />
          </div>
        </div>
      </section>

      {/* Info sections */}
      {sections.map(({ key, data, icon: Icon }, i) => (
        <motion.section
          key={key}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          className={i % 2 === 0 ? "py-16 md:py-20 bg-white" : "py-16 md:py-20 bg-surface"}
          style={{ direction: dir }}
        >
          <div className="max-w-5xl mx-auto px-4">
            <div className="flex items-center gap-3 mb-4">
              <span className="flex items-center justify-center w-12 h-12 rounded-2xl bg-navy/5 text-navy shrink-0">
                <Icon className="w-6 h-6" />
              </span>
              <h2 className="text-2xl md:text-3xl font-bold text-navy">{data.title}</h2>
            </div>
            <p className="text-[15px] md:text-base text-muted-foreground leading-relaxed max-w-3xl mb-6">
              {data.body}
            </p>
            <ul className="grid sm:grid-cols-2 gap-3">
              {data.points.map((point, j) => (
                <li key={j} className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-gold-dk shrink-0 mt-0.5" />
                  <span className="text-sm text-ink">{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </motion.section>
      ))}

      {/* Trust strip */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        className="py-12 bg-navy"
        style={{ direction: dir }}
      >
        <div className="max-w-5xl mx-auto px-4 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          {u.trust.items.map((item: string, i: number) => (
            <span key={i} className="flex items-center gap-2 text-sm text-white/80">
              <Check className="w-4 h-4 text-gold" />
              {item}
            </span>
          ))}
        </div>
      </motion.section>

      {/* Final CTA + form */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        className="py-16 md:py-20 bg-gradient-to-b from-navy to-navy-lt"
        style={{ direction: dir }}
      >
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gold mb-3">{u.finalCta.title}</h2>
          <p className="text-white/75 mb-8 max-w-xl mx-auto">{u.finalCta.sub}</p>
          <div className="bg-white/5 rounded-3xl p-6 md:p-8 border border-gold/20">
            <LandingLeadForm variant="cta" sourceSlug="uae-life" />
          </div>
        </div>
      </motion.section>

      {/* Minimal bottom line (no nav) */}
      <div className="py-6 text-center text-xs text-muted-foreground border-t border-border bg-white">
        © {year} Residency24
      </div>
    </div>
  );
}
