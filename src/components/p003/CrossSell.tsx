"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { Trophy, Building2 } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function CrossSell() {
  const { t, lang } = useLanguage();
  const cr = t.cr;

  return (
    <motion.section
      id="cr-s11"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      className="py-16 bg-surface"
    >
      <div className="max-w-5xl mx-auto px-6">
        <h2 className="text-2xl font-bold text-navy text-center mb-10">
          {cr.cross_title}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Golden Visa Card */}
          <div className="bg-navy text-white rounded-2xl p-6 shadow-lg border border-gold/30">
            <Trophy className="w-12 h-12 text-gold mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">
              {cr.cross_gv_title}
            </h3>
            <p className="text-white/80 text-sm mb-6">{cr.cross_gv_desc}</p>
            <Link
              href={`/${lang}/uae/golden-visa/`}
              className="inline-block border-2 border-gold text-gold font-bold px-5 py-2.5 rounded-xl hover:bg-gold hover:text-navy transition"
            >
              {cr.cross_gv_cta}
            </Link>
          </div>

          {/* Property Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border-2 border-transparent hover:border-gold transition-all">
            <Building2 className="w-12 h-12 text-navy mb-4" />
            <h3 className="text-lg font-bold text-navy mb-2">
              {cr.cross_prop_title}
            </h3>
            <p className="text-muted-foreground text-sm mb-6">
              {cr.cross_prop_desc}
            </p>
            <Link
              href={`/${lang}/uae/buy-property/`}
              className="inline-block bg-navy text-gold font-bold px-5 py-2.5 rounded-xl hover:bg-navy-lt transition"
            >
              {cr.cross_prop_cta}
            </Link>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
