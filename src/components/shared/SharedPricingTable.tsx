"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import { useState } from "react";

export interface PricingRow {
  labelKey: string;
  amount: string;
  noteKey?: string;
  isTotal?: boolean;
  isHighlighted?: boolean;
}

export interface PricingTab {
  id: string;
  labelKey: string;
  rows: PricingRow[];
  footerNoteKey?: string;
}

export interface SharedPricingTableProps {
  titleKey: string;
  subtitleKey?: string;
  tabs?: PricingTab[];
  rows?: PricingRow[];
  showConsultationCTA?: boolean;
  ctaTextKey?: string;
}

function getNestedValue(obj: any, path: string): string {
  return path.split(".").reduce((acc, key) => acc?.[key], obj) ?? path;
}

export default function SharedPricingTable({
  titleKey,
  subtitleKey,
  tabs,
  rows,
  showConsultationCTA = false,
  ctaTextKey,
}: SharedPricingTableProps) {
  const { t, isRTL } = useLanguage();
  const [activeTab, setActiveTab] = useState(tabs?.[0]?.id ?? "");

  const title = getNestedValue(t, titleKey);
  const subtitle = subtitleKey ? getNestedValue(t, subtitleKey) : undefined;

  const activeRows = tabs
    ? tabs.find((tab) => tab.id === activeTab)?.rows ?? []
    : rows ?? [];

  const activeFooter = tabs
    ? tabs.find((tab) => tab.id === activeTab)?.footerNoteKey
    : undefined;

  const scrollToChat = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(() => document.querySelector("textarea")?.focus(), 500);
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      className="py-20 bg-white"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-[#001E6E] font-bold text-2xl md:text-3xl mb-3">
            {title}
          </h2>
          {subtitle && (
            <p className="text-[#6E6E6E] text-[15px] max-w-[640px] mx-auto">
              {subtitle}
            </p>
          )}
        </div>

        {tabs && tabs.length > 1 && (
          <div className="flex flex-wrap gap-2 justify-center mb-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? "bg-[#001E6E] text-[#DCC896]"
                    : "border border-[#E5E7EB] text-[#6E6E6E] bg-white hover:bg-[#F8F8F8]"
                }`}
              >
                {getNestedValue(t, tab.labelKey)}
              </button>
            ))}
          </div>
        )}

        <div className="overflow-x-auto rounded-xl border border-[#E5E7EB]">
          <table className="w-full min-w-[400px]">
            <thead>
              <tr className="bg-[#001E6E]">
                <th
                  className={`text-[#DCC896] font-semibold text-sm py-3 px-5 ${
                    isRTL ? "text-right" : "text-left"
                  }`}
                >
                  {getNestedValue(t, "sharedPricing.itemLabel") || ""}
                </th>
                <th
                  className={`text-[#DCC896] font-semibold text-sm py-3 px-5 ${
                    isRTL ? "text-left" : "text-right"
                  }`}
                >
                  {getNestedValue(t, "sharedPricing.amountLabel") || ""}
                </th>
              </tr>
            </thead>
            <tbody>
              {activeRows.map((row, i) => (
                <tr
                  key={i}
                  className={`${
                    row.isTotal
                      ? "bg-[#001E6E]/5 font-bold text-[#001E6E]"
                      : row.isHighlighted
                        ? "bg-[#DCC896]/20 font-semibold"
                        : "text-[#323232]"
                  } ${
                    i < activeRows.length - 1
                      ? "border-b border-[#F3F4F6]"
                      : ""
                  }`}
                >
                  <td
                    className={`py-3 px-5 text-sm ${isRTL ? "text-right" : "text-left"}`}
                  >
                    {getNestedValue(t, row.labelKey)}
                    {row.noteKey && (
                      <span className="block text-xs text-[#6E6E6E] font-normal mt-0.5">
                        {getNestedValue(t, row.noteKey)}
                      </span>
                    )}
                  </td>
                  <td
                    className={`py-3 px-5 text-sm ${isRTL ? "text-left" : "text-right"}`}
                  >
                    {row.amount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {activeFooter && (
          <div className="text-xs text-[#6E6E6E] bg-[#FFFDF0] border-l-2 border-[#DCC896] p-3 mt-4 rounded-r">
            {getNestedValue(t, activeFooter)}
          </div>
        )}

        {showConsultationCTA && ctaTextKey && (
          <div className="text-center mt-8">
            <button
              onClick={scrollToChat}
              className="bg-[#001E6E] text-[#DCC896] px-8 py-3 rounded-lg text-sm font-semibold hover:bg-[#001E6E]/90 transition-colors"
            >
              {getNestedValue(t, ctaTextKey)}
            </button>
          </div>
        )}
      </div>
    </motion.section>
  );
}
