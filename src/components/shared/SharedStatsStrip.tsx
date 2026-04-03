"use client";

import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";

export interface Stat {
  value: string;
  label: string;
  display: string;
  animateCount?: boolean;
}

interface SharedStatsStripProps {
  stats: Stat[];
  variant?: "dark" | "light";
}

const SharedStatsStrip = ({ stats, variant = "dark" }: SharedStatsStripProps) => {
  const { isRTL } = useLanguage();
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const isDark = variant === "dark";

  return (
    <section
      ref={ref}
      className={`py-8 ${isDark ? "bg-navy rounded-2xl" : "bg-white border border-border rounded-2xl"}`}
    >
      <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        {stats.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 16 }}
            animate={visible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className="relative"
          >
            <p className={`text-3xl font-bold font-sans ${isDark ? "text-gold" : "text-navy"}`}>
              {s.display}
            </p>
            <p className={`text-xs mt-1 ${isDark ? "text-white/60" : "text-muted-foreground"}`}>
              {s.label}
            </p>
            {i < stats.length - 1 && (
              <div className={`hidden md:block absolute ${isRTL ? "start-0" : "end-0"} top-1/2 -translate-y-1/2 w-px h-10 ${isDark ? "bg-gold/20" : "bg-border"}`} />
            )}
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default SharedStatsStrip;
