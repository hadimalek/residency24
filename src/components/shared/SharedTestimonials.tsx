"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { useRef, useState, useEffect } from "react";

export interface Testimonial {
  id: string;
  nameKey: string;
  nationalityFlag: string;
  nationalityKey: string;
  outcomeKey: string;
  quoteKey: string;
  serviceKey: string;
  rating: 4 | 5;
  avatarInitials: string;
}

export interface SharedTestimonialsProps {
  testimonials: Testimonial[];
  titleKey: string;
  subtitleKey: string;
  variant?: "grid" | "carousel";
}

function getNestedValue(obj: any, path: string): string {
  return path.split(".").reduce((acc, key) => acc?.[key], obj) ?? path;
}

export default function SharedTestimonials({
  testimonials,
  titleKey,
  subtitleKey,
  variant = "grid",
}: SharedTestimonialsProps) {
  const { t, lang, isRTL } = useLanguage();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const title = getNestedValue(t, titleKey);
  const subtitle = getNestedValue(t, subtitleKey);
  const useCarousel = variant === "carousel" || isMobile;

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      className="py-20 bg-[#F8F8F8]"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-[#001E6E] font-bold text-2xl md:text-3xl mb-3">
            {title}
          </h2>
          <p className="text-[#6E6E6E] text-[15px] max-w-[640px] mx-auto">
            {subtitle}
          </p>
        </div>

        {useCarousel ? (
          <div
            ref={scrollRef}
            className="overflow-x-auto flex gap-4 snap-x snap-mandatory pb-4 -mx-4 px-4 scrollbar-hide"
          >
            {testimonials.map((item) => (
              <TestimonialCard key={item.id} item={item} t={t} isCarousel />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((item) => (
              <TestimonialCard key={item.id} item={item} t={t} />
            ))}
          </div>
        )}
      </div>
    </motion.section>
  );
}

function TestimonialCard({
  item,
  t,
  isCarousel,
}: {
  item: Testimonial;
  t: any;
  isCarousel?: boolean;
}) {
  const name = getNestedValue(t, item.nameKey);
  const nationality = getNestedValue(t, item.nationalityKey);
  const outcome = getNestedValue(t, item.outcomeKey);
  const quote = getNestedValue(t, item.quoteKey);
  const service = getNestedValue(t, item.serviceKey);

  return (
    <div
      className={`bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-sm border-t-4 border-t-[#DCC896] flex flex-col ${
        isCarousel ? "min-w-[300px] snap-center flex-shrink-0" : ""
      }`}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-[#001E6E] flex items-center justify-center text-[#DCC896] text-sm font-semibold flex-shrink-0">
          {item.avatarInitials}
        </div>
        <div className="min-w-0">
          <p className="text-[#001E6E] font-semibold text-sm truncate">
            {name}
          </p>
          <p className="text-[#6E6E6E] text-xs">
            {item.nationalityFlag} {nationality}
          </p>
        </div>
      </div>

      <div className="flex gap-0.5 mb-3">
        {Array.from({ length: item.rating }).map((_, i) => (
          <Star
            key={i}
            size={14}
            className="text-[#DCC896]"
            fill="currentColor"
          />
        ))}
      </div>

      <p className="text-[#6E6E6E] italic text-sm leading-relaxed flex-1 mb-4">
        &ldquo;{quote}&rdquo;
      </p>

      <div className="flex flex-wrap gap-2 mt-auto">
        <span className="bg-[#001E6E] text-[#DCC896] text-xs px-3 py-1 rounded-full">
          {outcome}
        </span>
        <span className="text-[#6E6E6E] text-xs px-2 py-1">{service}</span>
      </div>
    </div>
  );
}
