"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { Quote, Star } from "lucide-react";
import { motion } from "framer-motion";

const TESTIMONIALS = [
  { nameKey: "t1_name", typeKey: "t1_type", quoteKey: "t1_quote" },
  { nameKey: "t2_name", typeKey: "t2_type", quoteKey: "t2_quote" },
  { nameKey: "t3_name", typeKey: "t3_type", quoteKey: "t3_quote" },
] as const;

export default function TestimonialsP003() {
  const { t } = useLanguage();
  const cr = t.cr;

  return (
    <motion.section
      id="cr-s12"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      className="py-16"
    >
      <div className="max-w-5xl mx-auto px-6">
        <h2 className="text-2xl font-bold text-navy text-center mb-10">
          {cr.testi_title}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {TESTIMONIALS.map(({ nameKey, typeKey, quoteKey }, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:-translate-y-1 hover:shadow-lg transition-all"
            >
              <div className="p-6">
                <Quote className="w-6 h-6 text-gold mb-3" />
                <div className="flex gap-0.5 mb-3">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className="w-4 h-4 text-gold"
                      fill="currentColor"
                    />
                  ))}
                </div>
                <p className="text-sm text-foreground leading-relaxed">
                  {cr[quoteKey]}
                </p>
              </div>
              <div className="bg-navy/5 px-6 py-3">
                <p className="font-bold text-navy text-sm">{cr[nameKey]}</p>
                <p className="text-xs text-muted-foreground">{cr[typeKey]}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
