"use client";

import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function GoldenVisaFAQ() {
  const { t } = useLanguage();
  const p = t.p004;
  const [openIndex, setOpenIndex] = useState(0);

  const items = p.faq_items as { q: string; a: string }[];

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      className="bg-surface py-16 px-6"
    >
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-navy text-center mb-8">{p.faq_title}</h2>
        <div className="space-y-3">
          {items.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <div key={i} className="border border-border rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenIndex(isOpen ? -1 : i)}
                  className="w-full bg-gold/10 px-4 py-3 font-semibold text-navy text-sm flex justify-between items-center cursor-pointer text-start"
                >
                  <span className="pe-4">{item.q}</span>
                  {isOpen ? <ChevronUp size={16} className="flex-shrink-0" /> : <ChevronDown size={16} className="flex-shrink-0" />}
                </button>
                {isOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    transition={{ duration: 0.25 }}
                  >
                    <p className="px-4 py-3 text-text-secondary text-xs leading-relaxed">
                      {item.a}
                    </p>
                  </motion.div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </motion.section>
  );
}
