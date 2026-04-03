"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export interface Stat {
  value: string;
  labelKey: string;
  prefix?: string;
}

export interface SharedStatsStripProps {
  stats: Stat[];
  variant?: "dark" | "light";
}

function getNestedValue(obj: any, path: string): string {
  return path.split(".").reduce((acc, key) => acc?.[key], obj) ?? path;
}

function AnimatedValue({ value, prefix }: { value: string; prefix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [displayed, setDisplayed] = useState(value);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const numeric = parseInt(value.replace(/[^0-9]/g, ""), 10);
    if (isNaN(numeric) || numeric === 0) {
      setDisplayed(value);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const suffix = value.replace(/[0-9,.\s]/g, "");
          const duration = 1200;
          const start = performance.now();

          const animate = (now: number) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(numeric * eased);
            setDisplayed(
              `${prefix ?? ""}${current.toLocaleString()}${suffix}`
            );
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [value, prefix]);

  return <span ref={ref}>{displayed}</span>;
}

export default function SharedStatsStrip({
  stats,
  variant = "dark",
}: SharedStatsStripProps) {
  const { t, isRTL } = useLanguage();
  const isDark = variant === "dark";

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      className={`py-10 ${
        isDark
          ? "bg-[#001E6E]"
          : "bg-white border-y border-[#E5E7EB]"
      }`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="max-w-5xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 overflow-x-auto">
          {stats.map((stat, i) => (
            <div
              key={i}
              className={`text-center relative min-w-[120px] ${
                i < stats.length - 1
                  ? isDark
                    ? "md:border-r md:border-[#DCC896]/20"
                    : "md:border-r md:border-[#E5E7EB]"
                  : ""
              }`}
            >
              <p
                className={`font-bold text-3xl ${
                  isDark ? "text-[#DCC896]" : "text-[#001E6E]"
                }`}
              >
                <AnimatedValue value={stat.value} prefix={stat.prefix} />
              </p>
              <p
                className={`text-sm mt-1 ${
                  isDark ? "text-white/60" : "text-[#6E6E6E]"
                }`}
              >
                {getNestedValue(t, stat.labelKey)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
