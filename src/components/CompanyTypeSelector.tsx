"use client";

import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";

export default function CompanyTypeSelector() {
  const { t } = useLanguage();
  const cr = t.companyRegistrationUAE;
  const [active, setActive] = useState("mainland");

  return (
    <motion.section
      id="section-1"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      className="py-16 bg-surface"
    >
      <div className="max-w-[960px] mx-auto px-4">
        <h2 className="text-[32px] font-bold text-navy text-center mb-8">
          {cr.companyType.title}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {cr.types.map((tp: any) => (
            <div
              key={tp.id}
              onClick={() => setActive(tp.id)}
              className={`p-6 rounded-xl cursor-pointer transition-all duration-200 ${
                tp.id === active
                  ? "border-2 border-gold bg-white shadow-[0_4px_16px_rgba(220,200,150,0.2)]"
                  : "border border-border bg-surface"
              }`}
            >
              <div className="flex justify-between items-start mb-3">
                <span className="text-[32px]">{tp.icon}</span>
                <span className="text-[11px] px-2.5 py-1 rounded-full bg-navy text-gold">
                  {tp.tag}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-navy mb-1">{tp.name}</h3>
              <p className="text-[13px] text-muted-foreground mb-4">
                {tp.price} — {tp.days}
              </p>
              <ul className="list-disc ps-4 text-[13px] space-y-1">
                {tp.pros.map((p: string, i: number) => (
                  <li key={i}>{p}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
