"use client";

import { useLanguage } from "@/contexts/LanguageContext";

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
  const isDark = variant === "dark";

  return (
    <section
      className={`py-8 ${isDark ? "bg-navy rounded-2xl" : "bg-white border border-border rounded-2xl"}`}
    >
      <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        {stats.map((s, i) => (
          <div key={i} className="relative">
            <p className={`text-3xl font-bold font-sans ${isDark ? "text-gold" : "text-navy"}`}>
              {s.display}
            </p>
            <p className={`text-xs mt-1 ${isDark ? "text-white/60" : "text-muted-foreground"}`}>
              {s.label}
            </p>
            {i < stats.length - 1 && (
              <div className={`hidden md:block absolute ${isRTL ? "start-0" : "end-0"} top-1/2 -translate-y-1/2 w-px h-10 ${isDark ? "bg-gold/20" : "bg-border"}`} />
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default SharedStatsStrip;
