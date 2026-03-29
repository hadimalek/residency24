"use client";

import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

const FACTS = [
  { number: "0%",     labelKey: "uae_fact_income_tax" },
  { number: "100%",   labelKey: "uae_fact_ownership" },
  { number: "10",     labelKey: "uae_fact_golden_visa" },
  { number: "7-10",   labelKey: "uae_fact_setup_time" },
  { number: "192+",   labelKey: "uae_fact_nationalities" },
  { number: "5,000+", labelKey: "uae_fact_cases" },
] as const;

export default function UAEFactsStrip() {
  const { t, isRTL } = useLanguage();
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.3 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      dir={isRTL ? "rtl" : "ltr"}
      className="bg-navy overflow-x-auto py-8 px-4"
    >
      <div className="flex gap-8 justify-center flex-wrap min-w-max mx-auto max-w-[1200px]">
        {FACTS.map((fact, i) => (
          <div
            key={fact.labelKey}
            className="text-center min-w-[120px]"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(16px)",
              transition: `opacity 0.5s ease ${i * 0.1}s, transform 0.5s ease ${i * 0.1}s`,
            }}
          >
            <div className="text-[2rem] font-bold text-gold leading-tight">
              {fact.number}
            </div>
            <div className="text-xs text-white/75 mt-1">
              {t[fact.labelKey]}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
