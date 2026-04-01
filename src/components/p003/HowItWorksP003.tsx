"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import {
  MessageCircle,
  FileText,
  CreditCard,
  Building2,
  Landmark,
  ShieldCheck,
} from "lucide-react";
import { motion } from "framer-motion";

const STEPS = [
  { icon: MessageCircle, titleKey: "step1_t", descKey: "step1_d", dayKey: "step1_day" },
  { icon: FileText, titleKey: "step2_t", descKey: "step2_d", dayKey: "step2_day" },
  { icon: CreditCard, titleKey: "step3_t", descKey: "step3_d", dayKey: "step3_day" },
  { icon: Building2, titleKey: "step4_t", descKey: "step4_d", dayKey: "step4_day" },
  { icon: Landmark, titleKey: "step5_t", descKey: "step5_d", dayKey: "step5_day" },
  { icon: ShieldCheck, titleKey: "step6_t", descKey: "step6_d", dayKey: "step6_day" },
] as const;

export default function HowItWorksP003() {
  const { t, isRTL } = useLanguage();
  const cr = t.cr;

  return (
    <motion.section
      id="cr-s7"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      className="py-16 bg-background"
    >
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="text-2xl font-bold text-navy text-center mb-12">
          {cr.how_title}
        </h2>

        <div className="relative">
          {/* Connector line */}
          <div
            className={[
              "absolute top-0 bottom-0 w-0.5 bg-gold/30",
              isRTL ? "right-5" : "left-5",
            ].join(" ")}
          />

          <div className="space-y-8">
            {STEPS.map(({ icon: Icon, titleKey, descKey, dayKey }, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={[
                  "flex gap-4 items-start",
                  isRTL ? "flex-row-reverse text-right" : "",
                ].join(" ")}
              >
                <div className="w-10 h-10 rounded-full bg-navy text-gold text-sm font-bold flex items-center justify-center shrink-0 relative z-10">
                  {i + 1}
                </div>
                <div className="flex-1 bg-white rounded-xl p-4 shadow-sm">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <Icon className="w-5 h-5 text-gold shrink-0" />
                    <h3 className="font-semibold text-navy">{cr[titleKey]}</h3>
                    <span className="text-xs text-gold font-bold bg-gold/10 px-2 py-0.5 rounded-full">
                      {cr[dayKey]}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{cr[descKey]}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  );
}
