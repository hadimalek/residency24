"use client";

import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Building2, Factory, Globe, Check } from "lucide-react";
import { motion } from "framer-motion";

const TYPES = [
  {
    id: "mainland",
    iconComp: Building2,
    nameKey: "ml_name",
    tagKey: "ml_tag",
    priceKey: "ml_price",
    daysKey: "ml_days",
    prosKey: "ml_pros",
    bestKey: "ml_best",
  },
  {
    id: "freezone",
    iconComp: Factory,
    nameKey: "fz_name",
    tagKey: "fz_tag",
    priceKey: "fz_price",
    daysKey: "fz_days",
    prosKey: "fz_pros",
    bestKey: "fz_best",
  },
  {
    id: "offshore",
    iconComp: Globe,
    nameKey: "of_name",
    tagKey: "of_tag",
    priceKey: "of_price",
    daysKey: "of_days",
    prosKey: "of_pros",
    bestKey: "of_best",
  },
] as const;

export default function CompanyTypeSelector() {
  const { t } = useLanguage();
  const cr = t.cr;
  const [active, setActive] = useState("mainland");

  return (
    <motion.section
      id="cr-s5"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      className="py-16"
    >
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-2xl font-bold text-navy text-center mb-10">
          {cr.types_title}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {TYPES.map(
            ({ id, iconComp: Icon, nameKey, tagKey, priceKey, daysKey, prosKey, bestKey }) => {
              const isActive = active === id;
              const pros = cr[prosKey]?.split("|") ?? [];
              return (
                <div
                  key={id}
                  onClick={() => setActive(id)}
                  className={[
                    "bg-white rounded-2xl p-6 cursor-pointer transition-all",
                    isActive
                      ? "border-2 border-gold shadow-lg"
                      : "border-2 border-transparent shadow-sm hover:border-gold hover:shadow-lg",
                  ].join(" ")}
                >
                  <div className="flex items-start justify-between mb-4">
                    <Icon className="w-10 h-10 text-navy" />
                    <span className="bg-navy text-gold text-xs font-bold px-3 py-1 rounded-full">
                      {cr[tagKey]}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-navy mb-1">
                    {cr[nameKey]}
                  </h3>
                  <p className="text-sm text-gold font-bold mb-4">
                    {cr[priceKey]} — {cr[daysKey]}
                  </p>
                  <ul className="space-y-2 mb-4">
                    {pros.map((p: string, i: number) => (
                      <li
                        key={i}
                        className="flex items-center gap-2 text-sm text-foreground"
                      >
                        <Check className="w-4 h-4 text-green-600 shrink-0" />
                        {p}
                      </li>
                    ))}
                  </ul>
                  <p className="text-xs text-muted-foreground border-t border-border pt-3 mt-3">
                    {cr[bestKey]}
                  </p>
                </div>
              );
            }
          )}
        </div>
      </div>
    </motion.section>
  );
}
