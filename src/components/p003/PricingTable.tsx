"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { Check } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function PricingTable() {
  const { t, lang } = useLanguage();
  const cr = t.cr;

  const rows = [
    { label: cr.pt_row1, fz: "AED 12,500–15,000", ml: "AED 21,000–25,000", full: "inc" },
    { label: cr.pt_row2, fz: "AED 3,500–4,500", ml: "AED 3,500–4,500", full: "inc" },
    { label: cr.pt_row3, fz: "inc", ml: "AED 5,000–15,000", full: "inc" },
    { label: cr.pt_row4, fz: "sep", ml: "sep", full: "inc" },
    { label: cr.pt_row5, fz: "AED 8,000–12,000", ml: "AED 15,000–20,000", full: "consult" },
    { label: cr.pt_row6, fz: "AED 17,000–22,000", ml: "AED 28,000–45,000", full: "quote", highlight: true },
  ];

  const renderCell = (val: string) => {
    if (val === "inc")
      return (
        <span className="flex items-center justify-center gap-1 text-green-600 font-bold">
          <Check className="w-4 h-4" /> {cr.pt_inc}
        </span>
      );
    if (val === "sep") return <span className="text-muted-foreground">{cr.pt_sep}</span>;
    if (val === "consult") return <span className="text-gold font-semibold">{cr.pt_consult}</span>;
    if (val === "quote") return <span className="text-gold font-bold">{cr.pt_quote}</span>;
    return <span>{val}</span>;
  };

  return (
    <motion.section
      id="cr-s8"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      className="py-16"
    >
      <div className="max-w-5xl mx-auto px-6">
        <h2 className="text-2xl font-bold text-navy text-center mb-3">
          {cr.price_title}
        </h2>
        <p className="text-muted-foreground text-center mb-10">
          {cr.price_note}
        </p>

        <div className="overflow-x-auto rounded-xl">
          <table className="w-full min-w-[600px] text-sm" dir="ltr">
            <thead>
              <tr>
                <th className="bg-navy text-white text-start p-3 rounded-tl-xl" />
                <th className="bg-navy text-white text-center p-3 font-bold">
                  {cr.pt_fz}
                </th>
                <th className="bg-navy text-white text-center p-3 font-bold">
                  {cr.pt_ml}
                </th>
                <th className="bg-gold text-navy text-center p-3 font-bold rounded-tr-xl">
                  {cr.pt_full}
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr
                  key={i}
                  className={
                    row.highlight
                      ? "bg-navy/5 font-bold"
                      : i % 2 === 0
                      ? "bg-white"
                      : "bg-surface"
                  }
                >
                  <td className="p-3 text-foreground text-start">{row.label}</td>
                  <td className="p-3 text-center">{renderCell(row.fz)}</td>
                  <td className="p-3 text-center">{renderCell(row.ml)}</td>
                  <td className="p-3 text-center">{renderCell(row.full)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="text-center mt-8">
          <Link
            href={`/${lang}/uae/company-registration/#cr-s14`}
            className="inline-block bg-navy text-gold font-bold px-8 py-3 rounded-xl hover:bg-navy-lt transition"
          >
            {cr.price_cta}
          </Link>
        </div>
      </div>
    </motion.section>
  );
}
