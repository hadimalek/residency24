"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import { Info } from "lucide-react";

const CostTable = () => {
  const { t } = useLanguage();
  const bp = t.bp;
  const rows: { item: string; value: string }[] = bp.cost_rows;

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      className="py-16 bg-white"
    >
      <div className="max-w-3xl mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-navy text-center mb-10">
          {bp.cost_title}
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <tbody>
              {rows.map((row, i) => (
                <tr key={i} className="border-b border-border">
                  <td className="py-3 px-3 text-navy">{row.item}</td>
                  <td className="py-3 px-3 text-end font-medium">{row.value}</td>
                </tr>
              ))}
              <tr className="bg-gold-lt font-bold">
                <td className="py-3 px-3 text-navy">{bp.cost_total}</td>
                <td className="py-3 px-3 text-end text-navy">{bp.cost_total_value}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex gap-3 items-start bg-surface rounded-xl p-4">
          <Info className="w-5 h-5 text-gold shrink-0 mt-0.5" />
          <p className="text-sm text-muted-foreground leading-relaxed">{bp.cost_crypto_note}</p>
        </div>
      </div>
    </motion.section>
  );
};

export default CostTable;
