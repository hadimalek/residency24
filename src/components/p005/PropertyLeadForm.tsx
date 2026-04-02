"use client";

import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import type { Lang } from "@/translations";

const AREA_NAMES: Record<string, Record<Lang, string>> = {
  downtown: { fa: "داون‌تاون دبی", en: "Downtown Dubai", ar: "وسط مدينة دبي", ru: "Даунтаун Дубай" },
  marina: { fa: "دبی مارینا", en: "Dubai Marina", ar: "دبي مارينا", ru: "Дубай Марина" },
  jvc: { fa: "JVC", en: "JVC", ar: "JVC", ru: "JVC" },
  businessbay: { fa: "بیزینس‌بی", en: "Business Bay", ar: "خليج الأعمال", ru: "Бизнес Бэй" },
  dubaiHills: { fa: "دبی هیلز", en: "Dubai Hills Estate", ar: "تلال دبي", ru: "Дубай Хиллс" },
  palm: { fa: "پالم جمیرا", en: "Palm Jumeirah", ar: "جزيرة النخلة", ru: "Пальма Джумейра" },
  dubaiSouth: { fa: "دبی ساوث", en: "Dubai South", ar: "دبي الجنوب", ru: "Дубай Саут" },
};

const PropertyLeadForm = () => {
  const { t, lang } = useLanguage();
  const bp = t.bp;
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [budget, setBudget] = useState("");
  const [area, setArea] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!name || !phone) return;
    setSubmitted(true);
  };

  const inputClass =
    "w-full bg-white/10 border border-white/20 text-white placeholder:text-white/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold transition-colors min-h-[48px]";
  const selectClass =
    "w-full bg-white/10 border border-white/20 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold transition-colors min-h-[48px] appearance-none";

  return (
    <section id="property-lead-form" className="py-16 bg-navy">
      <div className="max-w-5xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.15 }}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-8">
              {bp.form_title}
            </h2>

            {submitted ? (
              <div className="bg-white/10 rounded-2xl p-8 text-center">
                <p className="text-gold text-lg font-bold mb-2">&#10003;</p>
                <p className="text-white">{bp.form_trust}</p>
              </div>
            ) : (
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder={bp.form_name}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={inputClass}
                />
                <input
                  type="tel"
                  placeholder={bp.form_phone}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={inputClass}
                />
                <select
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className={selectClass}
                >
                  <option value="" disabled className="text-navy">
                    {bp.form_budget}
                  </option>
                  {(bp.form_budget_options as string[]).map((opt: string) => (
                    <option key={opt} value={opt} className="text-navy">
                      {opt}
                    </option>
                  ))}
                </select>
                <select
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  className={selectClass}
                >
                  <option value="" disabled className="text-navy">
                    {bp.form_area}
                  </option>
                  {Object.entries(AREA_NAMES).map(([key, names]) => (
                    <option key={key} value={key} className="text-navy">
                      {names[lang]}
                    </option>
                  ))}
                  <option value="not_sure" className="text-navy">
                    {bp.form_area_not_sure}
                  </option>
                </select>
                <button
                  onClick={handleSubmit}
                  className="w-full bg-gold text-navy font-bold py-3 rounded-xl text-base hover:bg-gold-dk transition-colors min-h-[48px]"
                >
                  {bp.form_submit}
                </button>
                <p className="text-white/60 text-sm text-center">{bp.form_trust}</p>
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            className="flex flex-col justify-center"
          >
            <p className="text-white/80 text-lg mb-6">{bp.form_or_contact}</p>
            <a
              href="https://wa.me/971562009131?text=P005-BuyProperty"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-whatsapp text-white font-bold w-full rounded-xl py-3 hover:opacity-90 transition-opacity min-h-[48px]"
            >
              <MessageCircle className="w-5 h-5" />
              {bp.form_whatsapp}
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default PropertyLeadForm;
