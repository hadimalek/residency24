"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

export interface Testimonial {
  id: string;
  name: string;
  flag: string;
  nationality: string;
  outcome: string;
  quote: string;
  service: string;
  rating: 4 | 5;
  initials: string;
}

interface SharedTestimonialsProps {
  testimonials: Testimonial[];
  title?: string;
  subtitle?: string;
}

const SharedTestimonials = ({ testimonials, title, subtitle }: SharedTestimonialsProps) => {
  const { t } = useLanguage();
  const s = t.shared;

  return (
    <section className="py-16 bg-surface">
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-navy">
            {title || s.testimonials_title}
          </h2>
          <p className="text-muted-foreground mt-2">
            {subtitle || s.testimonials_subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.3, delay: i * 0.1 }}
              className="bg-white border border-border border-t-4 border-t-gold rounded-2xl p-6 shadow-sm flex flex-col"
            >
              <div className="flex gap-0.5 mb-3">
                {Array.from({ length: item.rating }).map((_, s) => (
                  <Star key={s} className="w-4 h-4 fill-gold text-gold" />
                ))}
              </div>

              <p className="text-sm italic text-muted-foreground leading-relaxed mb-4 flex-1">
                &ldquo;{item.quote}&rdquo;
              </p>

              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-navy text-gold text-xs font-bold flex items-center justify-center shrink-0">
                  {item.initials}
                </div>
                <div>
                  <p className="text-sm font-semibold text-navy">{item.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.flag} {item.nationality}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <span className="inline-block bg-navy text-gold text-xs font-bold px-3 py-1 rounded-full">
                  {item.outcome}
                </span>
                <span className="inline-block bg-gold-lt text-navy text-xs px-2 py-0.5 rounded">
                  {item.service}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SharedTestimonials;
