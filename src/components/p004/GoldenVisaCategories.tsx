"use client";

import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Home, Briefcase, Building2, Rocket, FlaskConical, Stethoscope, Palette, Smartphone, GraduationCap } from "lucide-react";
import { motion } from "framer-motion";

const CATEGORIES = [
  { icon: Home, titleKey: "cat_property", reqKey: "cat_property_req", durationKey: "cat_duration" },
  { icon: Briefcase, titleKey: "cat_professional", reqKey: "cat_professional_req", durationKey: "cat_duration" },
  { icon: Building2, titleKey: "cat_investor", reqKey: "cat_investor_req", durationKey: "cat_duration" },
  { icon: Rocket, titleKey: "cat_entrepreneur", reqKey: "cat_entrepreneur_req", durationKey: "cat_duration_5" },
  { icon: FlaskConical, titleKey: "cat_scientist", reqKey: "cat_scientist_req", durationKey: "cat_duration" },
  { icon: Stethoscope, titleKey: "cat_doctor", reqKey: "cat_doctor_req", durationKey: "cat_duration" },
  { icon: Palette, titleKey: "cat_artist", reqKey: "cat_artist_req", durationKey: "cat_duration" },
  { icon: Smartphone, titleKey: "cat_creator", reqKey: "cat_creator_req", durationKey: "cat_duration" },
  { icon: GraduationCap, titleKey: "cat_student", reqKey: "cat_student_req", durationKey: "cat_duration" },
];

export default function GoldenVisaCategories() {
  const { t } = useLanguage();
  const p = t.p004;
  const [showAll, setShowAll] = useState(false);

  const visible = showAll ? CATEGORIES : CATEGORIES.slice(0, 6);

  return (
    <section className="bg-navy py-16 px-6">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold text-gold text-center mb-8">{p.categories_title}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {visible.map((cat, i) => {
            const Icon = cat.icon;
            return (
              <motion.div
                key={cat.titleKey}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="bg-white/5 border border-white/10 rounded-xl p-4 text-center hover:bg-white/10 hover:border-gold/50 transition-all cursor-pointer"
              >
                <Icon size={24} className="text-gold mb-2 mx-auto" />
                <h3 className="font-bold text-gold text-sm mb-1">{p[cat.titleKey]}</h3>
                <p className="text-white/60 text-xs">{p[cat.reqKey]}</p>
                <span className="text-xs bg-gold/20 text-gold rounded-full px-2 py-0.5 mt-2 inline-block">
                  {p[cat.durationKey]}
                </span>
              </motion.div>
            );
          })}
        </div>
        {!showAll && (
          <div className="text-center mt-6">
            <button
              onClick={() => setShowAll(true)}
              className="text-gold text-sm font-semibold hover:underline"
            >
              {p.cat_see_all}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
