"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { Building2, Landmark, Plane, TrendingUp, Globe } from "lucide-react";
import { motion } from "framer-motion";

const ZONES = [
  { name: "DMCC", icon: Landmark, price: "AED 14,500", visas: "6", bestKey: "zone_dmcc_best", badgeKey: "zone_dmcc_badge" },
  { name: "IFZA", icon: Building2, price: "AED 12,500", visas: "3", bestKey: "zone_ifza_best", badgeKey: "zone_ifza_badge" },
  { name: "DIFC", icon: TrendingUp, price: "AED 50,000+", visas: null, bestKey: "zone_difc_best", badgeKey: "zone_difc_badge" },
  { name: "Dubai South", icon: Plane, price: "AED 13,500", visas: "5", bestKey: "zone_ds_best", badgeKey: "zone_ds_badge" },
  { name: "Meydan", icon: Globe, price: "AED 11,500", visas: "3", bestKey: "zone_mey_best", badgeKey: "zone_mey_badge" },
] as const;

export default function FreeZones() {
  const { t } = useLanguage();
  const cr = t.cr;

  return (
    <motion.section
      id="cr-s6"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      className="py-16 bg-surface"
    >
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-2xl font-bold text-navy text-center mb-3">
          {cr.zones_title}
        </h2>
        <p className="text-muted-foreground text-center mb-10">
          {cr.zones_sub}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {ZONES.map(({ name, icon: Icon, price, visas, bestKey, badgeKey }) => (
            <div
              key={name}
              className="bg-white rounded-2xl p-6 shadow-sm border-2 border-transparent hover:border-gold hover:shadow-lg transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <Icon className="w-8 h-8 text-navy" />
                <span className="bg-gold text-navy text-xs font-bold px-3 py-1 rounded-full">
                  {price}
                </span>
              </div>
              <h3 className="text-xl font-semibold text-navy mb-2">{name}</h3>
              <p className="text-sm text-foreground mb-4">{cr[bestKey]}</p>
              <div className="flex items-center justify-between pt-3 border-t border-border">
                <span className="text-xs text-muted-foreground">
                  {cr[badgeKey]}
                </span>
                {visas && (
                  <span className="bg-green-100 text-green-800 text-xs font-semibold px-3 py-1 rounded-full">
                    {visas} {cr.zones_visas}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
