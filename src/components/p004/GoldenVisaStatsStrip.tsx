"use client";

import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

const STATS = [
  { value: 10, display: "10", key: "stat_years" },
  { value: 0, display: "0%", key: "stat_tax" },
  { value: 2, display: "2M", key: "stat_min_aed" },
  { value: 10, display: "7-10", key: "stat_days", noAnimate: true },
  { value: 15, display: "15+", key: "stat_categories" },
  { value: 5000, display: "5K+", key: "stat_cases" },
];

function useCountUp(target: number, duration: number, trigger: boolean, noAnimate?: boolean) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!trigger) return;
    if (noAnimate) {
      setCount(target);
      return;
    }
    let start = 0;
    const startTime = performance.now();
    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      start = Math.floor(eased * target);
      setCount(start);
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [trigger, target, duration, noAnimate]);

  return count;
}

function StatCell({ stat, isVisible, isLast }: { stat: typeof STATS[number]; isVisible: boolean; isLast: boolean }) {
  const { t } = useLanguage();
  const count = useCountUp(stat.value, 1500, isVisible, stat.noAnimate);

  const displayValue = stat.noAnimate
    ? stat.display
    : stat.display.replace(/\d+/, String(count));

  return (
    <div className={`py-5 px-4 text-center ${!isLast ? "border-r border-white/10" : ""}`}>
      <p className="text-2xl font-bold text-gold">{displayValue}</p>
      <p className="text-xs text-white/60 mt-1 leading-snug">{t.p004[stat.key]}</p>
    </div>
  );
}

export default function GoldenVisaStatsStrip() {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="bg-navy overflow-x-auto">
      <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
        {STATS.map((stat, i) => (
          <StatCell key={stat.key} stat={stat} isVisible={isVisible} isLast={i === STATS.length - 1} />
        ))}
      </div>
    </section>
  );
}
