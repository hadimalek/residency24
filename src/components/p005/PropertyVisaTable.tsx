"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import Link from "next/link";

const PropertyVisaTable = () => {
  const { t, lang } = useLanguage();
  const bp = t.bp;

  const rows = [
    {
      type: bp.visa_taskeen_type,
      value: bp.visa_taskeen_value,
      duration: bp.visa_taskeen_duration,
      condition: bp.visa_taskeen_condition,
      cta: bp.visa_taskeen_cta,
      href: `/${lang}/uae/golden-visa/?ref=p005-visa-table`,
      highlight: false,
    },
    {
      type: bp.visa_golden_type,
      value: bp.visa_golden_value,
      duration: bp.visa_golden_duration,
      condition: bp.visa_golden_condition,
      cta: bp.visa_golden_cta,
      href: `/${lang}/uae/golden-visa/?ref=p005-visa-table`,
      highlight: true,
    },
    {
      type: bp.visa_retirement_type,
      value: bp.visa_retirement_value,
      duration: bp.visa_retirement_duration,
      condition: bp.visa_retirement_condition,
      cta: bp.visa_retirement_cta,
      href: `/${lang}/uae/golden-visa/?ref=p005-visa-table`,
      highlight: false,
    },
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      className="py-16 bg-white"
    >
      <div className="max-w-5xl mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-navy text-center mb-10">
          {bp.visa_table_title}
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-sm">
            <thead>
              <tr className="border-b-2 border-navy/10">
                <th className="text-start py-3 px-3 font-semibold text-navy">{bp.visa_col_type}</th>
                <th className="text-start py-3 px-3 font-semibold text-navy">{bp.visa_col_value}</th>
                <th className="text-start py-3 px-3 font-semibold text-navy">{bp.visa_col_duration}</th>
                <th className="text-start py-3 px-3 font-semibold text-navy">{bp.visa_col_condition}</th>
                <th className="text-start py-3 px-3 font-semibold text-navy">{bp.visa_col_cta}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr
                  key={i}
                  className={`border-b border-border ${
                    row.highlight ? "bg-gold-lt border-l-4 border-l-gold" : ""
                  }`}
                >
                  <td className="py-4 px-3 font-medium text-navy">{row.type}</td>
                  <td className="py-4 px-3">{row.value}</td>
                  <td className="py-4 px-3">{row.duration}</td>
                  <td className="py-4 px-3 text-muted-foreground">{row.condition}</td>
                  <td className="py-4 px-3">
                    <Link
                      href={row.href}
                      className="text-navy font-semibold hover:text-gold transition-colors whitespace-nowrap"
                    >
                      {row.cta}
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.section>
  );
};

export default PropertyVisaTable;
