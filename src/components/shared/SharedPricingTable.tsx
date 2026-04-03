"use client";

import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";

export interface PricingRow {
  label: string;
  amount: string;
  note?: string;
  isTotal?: boolean;
  isHighlighted?: boolean;
}

export interface PricingTab {
  id: string;
  label: string;
  rows: PricingRow[];
  footerNote?: string;
}

interface SharedPricingTableProps {
  title?: string;
  tabs?: PricingTab[];
  rows?: PricingRow[];
  showCTA?: boolean;
  ctaText?: string;
  ctaHref?: string;
}

const SharedPricingTable = ({ title, tabs, rows, showCTA, ctaText, ctaHref }: SharedPricingTableProps) => {
  const { t, isRTL } = useLanguage();
  const s = t.shared;
  const [activeTab, setActiveTab] = useState(tabs?.[0]?.id || "");

  const activeRows = tabs ? tabs.find((tab) => tab.id === activeTab)?.rows || [] : rows || [];
  const activeFooter = tabs ? tabs.find((tab) => tab.id === activeTab)?.footerNote : undefined;

  const scrollToCTA = () => {
    const el = document.getElementById("consultation-form") || document.getElementById("property-lead-form");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      className="py-16 bg-white"
    >
      <div className="max-w-3xl mx-auto px-4">
        <h2 className="text-2xl font-bold text-navy text-center mb-6">
          {title || s.pricing_title}
        </h2>

        {tabs && tabs.length > 1 && (
          <div className="flex gap-2 mb-6 flex-wrap justify-center">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`text-xs font-semibold px-4 py-2 rounded-full transition-colors ${
                  activeTab === tab.id
                    ? "bg-navy text-gold"
                    : "border border-border text-muted-foreground bg-white hover:border-navy hover:text-navy"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full min-w-[500px] text-sm">
            <thead>
              <tr className="bg-navy text-gold">
                <th className="text-start px-4 py-3 font-semibold">{s.pricing_col_item}</th>
                <th className="text-start px-4 py-3 font-semibold">{s.pricing_col_amount}</th>
              </tr>
            </thead>
            <tbody>
              {activeRows.map((row, i) => (
                <tr
                  key={i}
                  className={`border-b border-border/50 ${
                    row.isTotal ? "bg-navy/5 font-bold text-navy" : ""
                  } ${row.isHighlighted ? "bg-[#FFFDF0] font-semibold" : ""} hover:bg-surface/50`}
                >
                  <td className="px-4 py-3 text-ink">{row.label}</td>
                  <td className="px-4 py-3 text-end font-medium">{row.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {activeFooter && (
          <div className={`mt-4 text-xs text-muted-foreground bg-[#FFFDF0] px-3 py-2 rounded ${isRTL ? "border-r-2 border-gold rounded-l" : "border-l-2 border-gold rounded-r"}`}>
            {activeFooter}
          </div>
        )}

        <p className="text-xs text-muted-foreground text-center mt-4">{s.pricing_note}</p>

        {showCTA && (
          <div className="text-center mt-4">
            <button
              onClick={ctaHref ? undefined : scrollToCTA}
              className="bg-navy text-gold font-bold px-6 py-3 rounded-xl hover:bg-navy-lt transition-colors inline-block"
            >
              {ctaText || s.pricing_cta}
            </button>
          </div>
        )}
      </div>
    </motion.section>
  );
};

export default SharedPricingTable;
