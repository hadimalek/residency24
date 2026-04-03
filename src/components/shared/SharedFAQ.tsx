"use client";

import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";

export interface FAQItem {
  question: string;
  answer: string;
}

interface SharedFAQProps {
  items: FAQItem[];
  title?: string;
}

const SharedFAQ = ({ items, title }: SharedFAQProps) => {
  const { t } = useLanguage();
  const s = t.shared;
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      className="py-16 bg-surface"
    >
      <div className="max-w-[760px] mx-auto px-4">
        <h2 className="text-2xl md:text-[32px] font-bold text-navy text-center mb-10">
          {title || s.faq_title}
        </h2>

        <div className="divide-y divide-border">
          {items.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <div key={i} className="py-4">
                <button
                  onClick={() => setOpenIndex(isOpen ? -1 : i)}
                  className="w-full flex items-center justify-between text-start gap-3"
                >
                  <span className="text-sm font-semibold text-navy flex-1">{item.question}</span>
                  <span className="w-6 h-6 rounded-full bg-navy text-gold text-sm font-bold flex items-center justify-center shrink-0 transition-transform">
                    {isOpen ? "\u2212" : "+"}
                  </span>
                </button>
                {isOpen && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    transition={{ duration: 0.2 }}
                    className="text-sm text-muted-foreground leading-relaxed pt-3 pb-1"
                  >
                    {item.answer}
                  </motion.p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </motion.section>
  );
};

export default SharedFAQ;
