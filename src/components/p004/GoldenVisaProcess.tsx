"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";

const STEPS = [
  { titleKey: "step1_title", descKey: "step1_desc", badgeKey: "step1_badge" },
  { titleKey: "step2_title", descKey: "step2_desc", badgeKey: "step2_badge" },
  { titleKey: "step3_title", descKey: "step3_desc", badgeKey: "step3_badge" },
  { titleKey: "step4_title", descKey: "step4_desc", badgeKey: "step4_badge" },
  { titleKey: "step5_title", descKey: "step5_desc", badgeKey: "step5_badge" },
];

export default function GoldenVisaProcess() {
  const { t, isRTL } = useLanguage();
  const p = t.p004;

  return (
    <section className="bg-white py-16 px-6">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-navy text-center mb-10">{p.process_title}</h2>
        <div className={`relative ${isRTL ? "border-r-2" : "border-l-2"} border-gold/30`}>
          {STEPS.map((step, i) => (
            <motion.div
              key={step.titleKey}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex gap-4 relative"
            >
              <div
                className={`w-8 h-8 bg-navy rounded-full flex items-center justify-center text-gold text-xs font-bold flex-shrink-0 ${
                  isRTL ? "-mr-[17px]" : "-ml-[17px]"
                }`}
              >
                {i + 1}
              </div>
              <div className="flex-1 pb-8">
                <h3 className="font-bold text-navy text-sm">{p[step.titleKey]}</h3>
                <p className="text-text-secondary text-xs mt-1 leading-relaxed">{p[step.descKey]}</p>
                <span className="inline-block text-xs bg-gold/15 text-navy rounded-full px-3 py-0.5 mt-2 font-semibold">
                  {p[step.badgeKey]}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
