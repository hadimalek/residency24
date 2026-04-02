"use client";

import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";

const PropertyStats = () => {
  const { t } = useLanguage();
  const bp = t.bp;
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const stats = [
    { num: bp.stats_yield_num, label: bp.stats_yield_label },
    { num: bp.stats_tax_num, label: bp.stats_tax_label },
    { num: bp.stats_entry_num, label: bp.stats_entry_label },
    { num: bp.stats_visa_num, label: bp.stats_visa_label },
  ];

  return (
    <section ref={ref} className="py-12 bg-navy">
      <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        {stats.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={visible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="relative"
          >
            <p className="text-3xl md:text-4xl font-extrabold text-gold font-sans">{s.num}</p>
            <p className="text-sm text-white/70 mt-2">{s.label}</p>
            {i < stats.length - 1 && (
              <div className="hidden md:block absolute end-0 top-1/2 -translate-y-1/2 w-px h-10 bg-white/20" />
            )}
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default PropertyStats;
