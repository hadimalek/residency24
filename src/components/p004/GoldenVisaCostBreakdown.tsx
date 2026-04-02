"use client";

import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";

type Tab = "property" | "professional" | "investor";

const TABS: { key: Tab; labelKey: string }[] = [
  { key: "property", labelKey: "cost_tab_property" },
  { key: "professional", labelKey: "cost_tab_professional" },
  { key: "investor", labelKey: "cost_tab_investor" },
];

const GOV_FEES = [
  { key: "cost_medical", amount: "AED 700" },
  { key: "cost_eid", amount: "AED 1,153" },
  { key: "cost_permit", amount: "AED 2,856" },
  { key: "cost_dld", amount: "AED 4,020–5,000" },
  { key: "cost_insurance", amount: "AED 800–2,500" },
];

const FAMILY_FEES = [
  { key: "cost_family_per", amount: "AED 5,774" },
  { key: "cost_family_file", amount: "AED 318.75" },
  { key: "cost_family_4", amount: "≈ AED 30,000" },
];

export default function GoldenVisaCostBreakdown() {
  const { t } = useLanguage();
  const p = t.p004;
  const [activeTab, setActiveTab] = useState<Tab>("property");

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      className="bg-surface py-16 px-6"
    >
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold text-navy text-center mb-8">{p.cost_title}</h2>

        <div className="flex gap-2 justify-center mb-8 flex-wrap">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`rounded-full px-4 py-2 text-sm transition-colors ${
                activeTab === tab.key
                  ? "bg-navy text-gold font-bold"
                  : "bg-white text-navy border border-navy/20"
              }`}
            >
              {p[tab.labelKey]}
            </button>
          ))}
        </div>

        {activeTab === "property" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-5 border border-border">
              <h3 className="font-bold text-navy text-sm mb-4">{p.cost_gov_title}</h3>
              <div className="divide-y divide-border">
                {GOV_FEES.map((fee) => (
                  <div key={fee.key} className="flex justify-between py-2.5 text-xs">
                    <span className="text-text-secondary">{p[fee.key]}</span>
                    <span className="font-semibold text-navy">{fee.amount}</span>
                  </div>
                ))}
                <div className="flex justify-between py-2.5 text-xs bg-gold/10 rounded-lg px-2 mt-1">
                  <span className="font-bold text-navy">{p.cost_total}</span>
                  <span className="font-bold text-navy">≈ AED 9,648–12,000</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-5 border border-border">
              <h3 className="font-bold text-navy text-sm mb-4">{p.cost_family_title}</h3>
              <div className="divide-y divide-border">
                {FAMILY_FEES.map((fee) => (
                  <div key={fee.key} className="flex justify-between py-2.5 text-xs">
                    <span className="text-text-secondary">{p[fee.key]}</span>
                    <span className="font-semibold text-navy">{fee.amount}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-3 flex gap-2 items-start">
                <AlertTriangle size={16} className="text-amber-500 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-amber-800 leading-relaxed">{p.cost_update_note}</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "professional" && (
          <div className="bg-white rounded-xl p-5 border border-border max-w-lg mx-auto">
            <h3 className="font-bold text-navy text-sm mb-4">{p.cost_salary_title}</h3>
            <p className="text-xs text-text-secondary mb-4">{p.cost_salary_note}</p>
            <div className="divide-y divide-border">
              {GOV_FEES.filter((f) => f.key !== "cost_dld").map((fee) => (
                <div key={fee.key} className="flex justify-between py-2.5 text-xs">
                  <span className="text-text-secondary">{p[fee.key]}</span>
                  <span className="font-semibold text-navy">{fee.amount}</span>
                </div>
              ))}
              <div className="flex justify-between py-2.5 text-xs bg-gold/10 rounded-lg px-2 mt-1">
                <span className="font-bold text-navy">{p.cost_total}</span>
                <span className="font-bold text-navy">≈ AED 5,500–7,200</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === "investor" && (
          <div className="bg-white rounded-xl p-5 border border-border max-w-lg mx-auto">
            <h3 className="font-bold text-navy text-sm mb-4">{p.cost_investor_title}</h3>
            <p className="text-xs text-text-secondary mb-4">{p.cost_investor_note}</p>
            <div className="divide-y divide-border">
              {GOV_FEES.filter((f) => f.key !== "cost_dld").map((fee) => (
                <div key={fee.key} className="flex justify-between py-2.5 text-xs">
                  <span className="text-text-secondary">{p[fee.key]}</span>
                  <span className="font-semibold text-navy">{fee.amount}</span>
                </div>
              ))}
              <div className="flex justify-between py-2.5 text-xs bg-gold/10 rounded-lg px-2 mt-1">
                <span className="font-bold text-navy">{p.cost_total}</span>
                <span className="font-bold text-navy">≈ AED 5,500–7,200</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.section>
  );
}
