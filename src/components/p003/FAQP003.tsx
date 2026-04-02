"use client";

import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { ChevronDown, ChevronUp } from "lucide-react";
import { motion } from "framer-motion";

export default function FAQP003() {
  const { t } = useLanguage();
  const cr = t.cr;
  const items: { q: string; a: string }[] = cr.faq_items ?? [];
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <motion.section
      id="cr-s13"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      className="py-16 bg-surface"
    >
      <div className="max-w-[760px] mx-auto px-6">
        <h2 className="text-2xl font-bold text-navy text-center mb-10">
          {cr.faq_title}
        </h2>
        <div className="divide-y divide-border">
          {items.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <div key={i} className="py-4">
                <button
                  onClick={() => setOpenIndex(isOpen ? -1 : i)}
                  className="w-full flex items-center justify-between text-start gap-4"
                >
                  <span className="text-base font-medium text-navy">
                    {item.q}
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-gold shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gold shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    transition={{ duration: 0.25 }}
                    className="text-sm text-muted-foreground leading-relaxed pt-3"
                  >
                    {item.a}
                  </motion.p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </motion.section>
  );
}
