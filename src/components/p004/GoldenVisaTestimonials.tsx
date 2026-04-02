"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";

const TESTIMONIALS = [
  { avatarKey: "testimonial1_name", quoteKey: "testimonial1_quote", nameKey: "testimonial1_name", typeKey: "testimonial1_type" },
  { avatarKey: "testimonial2_name", quoteKey: "testimonial2_quote", nameKey: "testimonial2_name", typeKey: "testimonial2_type" },
  { avatarKey: "testimonial3_name", quoteKey: "testimonial3_quote", nameKey: "testimonial3_name", typeKey: "testimonial3_type" },
];

export default function GoldenVisaTestimonials() {
  const { t } = useLanguage();
  const p = t.p004;

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      className="bg-white py-16 px-6"
    >
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold text-navy text-center mb-8">{p.testimonials_title}</h2>
        <div className="flex lg:grid lg:grid-cols-3 gap-4 overflow-x-auto snap-x snap-mandatory pb-2">
          {TESTIMONIALS.map((item, i) => {
            const name = p[item.nameKey] as string;
            const initial = name.charAt(0);
            return (
              <div
                key={i}
                className="min-w-[280px] lg:min-w-0 snap-start bg-surface rounded-xl p-5 border border-transparent hover:border-gold/30 transition-all flex-shrink-0"
              >
                <div className="text-amber-400 text-sm mb-3">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
                <p className="text-text-primary text-sm italic leading-relaxed mb-4">
                  &ldquo;{p[item.quoteKey]}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-navy rounded-full flex items-center justify-center text-gold font-bold text-sm">
                    {initial}
                  </div>
                  <div>
                    <p className="font-bold text-navy text-sm">{name}</p>
                    <p className="text-text-secondary text-xs">{p[item.typeKey]}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </motion.section>
  );
}
