"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";

const UPDATES = [
  { dateKey: "update1_date", titleKey: "update1_title", descKey: "update1_desc", impactKey: "update1_impact" },
  { dateKey: "update2_date", titleKey: "update2_title", descKey: "update2_desc", impactKey: "update2_impact" },
  { dateKey: "update3_date", titleKey: "update3_title", descKey: "update3_desc", impactKey: "update3_impact" },
  { dateKey: "update4_date", titleKey: "update4_title", descKey: "update4_desc", impactKey: "update4_impact" },
];

export default function GoldenVisaUpdates() {
  const { t } = useLanguage();
  const p = t.p004;

  return (
    <section className="bg-navy py-16 px-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-gold text-center mb-8">{p.updates_title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {UPDATES.map((update, i) => (
            <motion.div
              key={update.titleKey}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white/5 border border-white/10 rounded-xl p-5"
            >
              <span className="text-xs bg-gold/20 text-gold rounded-full px-3 py-1 inline-block mb-3 font-semibold">
                {p[update.dateKey]}
              </span>
              <h3 className="font-bold text-white text-sm mb-2">{p[update.titleKey]}</h3>
              <p className="text-white/70 text-xs leading-relaxed">{p[update.descKey]}</p>
              <span className="text-xs bg-green-500/20 text-green-400 rounded px-2 py-1 inline-block mt-2">
                {p[update.impactKey]}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
