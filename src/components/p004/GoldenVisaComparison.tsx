"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";

export default function GoldenVisaComparison() {
  const { t } = useLanguage();
  const p = t.p004;

  const headers = [p.comp_feature, p.comp_golden, p.comp_employment, p.comp_investor_visa, p.comp_partner];

  const rows = [
    { label: p.comp_duration, golden: p.comp_dur_golden, emp: p.comp_dur_emp, inv: p.comp_dur_inv, partner: p.comp_dur_partner, goldenBold: true },
    { label: p.comp_sponsor, golden: p.comp_spon_golden, emp: p.comp_spon_emp, inv: p.comp_spon_inv, partner: p.comp_spon_partner, goldenBold: true },
    { label: p.comp_exit, golden: p.comp_exit_golden, emp: p.comp_exit_other, inv: p.comp_exit_other, partner: p.comp_exit_other, goldenGreen: true },
    { label: p.comp_job_loss, golden: p.comp_job_golden, emp: p.comp_job_emp, inv: p.comp_job_inv, partner: p.comp_job_partner, goldenGreen: true },
    { label: p.comp_family, golden: p.comp_fam_golden, emp: p.comp_fam_emp, inv: p.comp_fam_inv, partner: p.comp_fam_partner, goldenBold: true },
    { label: p.comp_renewal, golden: p.comp_renew_golden, emp: p.comp_renew_emp, inv: p.comp_renew_inv, partner: p.comp_renew_partner, goldenGreen: true },
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      className="bg-white py-16 px-6"
    >
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold text-navy text-center mb-8">{p.comparison_title}</h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] text-xs">
            <thead>
              <tr className="bg-navy text-white">
                {headers.map((h, i) => (
                  <th key={i} className={`px-4 py-3 text-start font-semibold ${i === 1 ? "bg-navy/90" : ""}`}>
                    {i === 1 ? `⭐ ${h}` : h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i} className={i % 2 === 1 ? "bg-gray-50" : ""}>
                  <td className="px-4 py-3 font-medium text-navy">{row.label}</td>
                  <td className={`px-4 py-3 bg-gold/5 ${row.goldenGreen ? "text-green-600 font-bold" : ""} ${row.goldenBold ? "font-bold text-navy" : ""}`}>
                    {row.golden}
                  </td>
                  <td className="px-4 py-3 text-text-secondary">{row.emp}</td>
                  <td className="px-4 py-3 text-text-secondary">{row.inv}</td>
                  <td className="px-4 py-3 text-text-secondary">{row.partner}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.section>
  );
}
