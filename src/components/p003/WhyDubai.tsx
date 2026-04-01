"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { BadgeDollarSign, Globe, Building2, Zap, Check } from "lucide-react";
import { motion } from "framer-motion";

const STATS = [
  { icon: BadgeDollarSign, num: "0%", keyLabel: "stat_tax" },
  { icon: Globe, num: "100%", keyLabel: "stat_own" },
  { icon: Building2, num: "42+", keyLabel: "stat_zones" },
  { icon: Zap, num: "7-10", keyLabel: "stat_days" },
] as const;

export default function WhyDubai() {
  const { t } = useLanguage();
  const cr = t.cr;
  const bullets = cr.why_bullets?.split("|") ?? [];

  return (
    <motion.section
      id="cr-s4"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      className="py-16 bg-surface"
    >
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-2xl font-bold text-navy text-center mb-3">
          {cr.why_title}
        </h2>
        <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-12">
          {cr.why_body}
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {STATS.map(({ icon: Icon, num, keyLabel }) => (
            <div key={num} className="bg-navy/5 rounded-xl p-4 text-center">
              <Icon className="w-8 h-8 text-gold mx-auto mb-2" />
              <div className="text-3xl font-bold text-navy">{num}</div>
              <div className="text-sm text-muted-foreground mt-1">
                {cr[keyLabel]}
              </div>
            </div>
          ))}
        </div>

        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl mx-auto">
          {bullets.map((b: string, i: number) => (
            <li key={i} className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-600 shrink-0" />
              <span className="text-base text-foreground">{b}</span>
            </li>
          ))}
        </ul>
      </div>
    </motion.section>
  );
}
