"use client";

import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import type { Lang } from "@/translations";

type Segment = "Luxury" | "Mid-Range" | "Affordable";

interface Area {
  key: string;
  segment: Segment;
  yield: string;
  from: string;
  name: Record<Lang, string>;
  bestFor: Record<Lang, string>;
}

const AREAS: Area[] = [
  { key: "downtown", segment: "Luxury", yield: "5–6%", from: "AED 1,500,000", name: { fa: "داون‌تاون دبی", en: "Downtown Dubai", ar: "وسط مدينة دبي", ru: "Даунтаун Дубай" }, bestFor: { fa: "رشد سرمایه · خانواده", en: "Capital appreciation · Families", ar: "تقدير رأس المال · العائلات", ru: "Прирост капитала · Семьи" } },
  { key: "marina", segment: "Luxury", yield: "6–7%", from: "AED 800,000", name: { fa: "دبی مارینا", en: "Dubai Marina", ar: "دبي مارينا", ru: "Дубай Марина" }, bestFor: { fa: "اجاره کوتاه‌مدت · جوانان", en: "Short-term rental · Young investors", ar: "إيجار قصير · شباب المستثمرين", ru: "Краткосрочная аренда · Молодые инвесторы" } },
  { key: "jvc", segment: "Mid-Range", yield: "7–8%", from: "AED 500,000", name: { fa: "JVC", en: "JVC", ar: "JVC", ru: "JVC" }, bestFor: { fa: "بالاترین بازدهی اجاره", en: "Highest buy-to-let yield", ar: "أعلى عائد إيجار", ru: "Максимальная доходность аренды" } },
  { key: "businessbay", segment: "Mid-Range", yield: "6–7%", from: "AED 700,000", name: { fa: "بیزینس‌بی", en: "Business Bay", ar: "خليج الأعمال", ru: "Бизнес Бэй" }, bestFor: { fa: "دسترسی + رشد قیمت", en: "Access + appreciation", ar: "موقع مميز + تقدير", ru: "Доступность + рост стоимости" } },
  { key: "dubaiHills", segment: "Luxury", yield: "5–6%", from: "AED 1,200,000", name: { fa: "دبی هیلز", en: "Dubai Hills Estate", ar: "تلال دبي", ru: "Дубай Хиллс" }, bestFor: { fa: "خانواده · فضای سبز", en: "Family lifestyle · Green spaces", ar: "عائلات · مساحات خضراء", ru: "Семьи · Зелёные пространства" } },
  { key: "palm", segment: "Luxury", yield: "5–6%", from: "AED 2,000,000", name: { fa: "پالم جمیرا", en: "Palm Jumeirah", ar: "جزيرة النخلة", ru: "Пальма Джумейра" }, bestFor: { fa: "پرستیژ · اجاره تعطیلات", en: "Prestige · Holiday rental", ar: "رقي ومكانة · إيجار موسمي", ru: "Престиж · Отдых" } },
  { key: "dubaiSouth", segment: "Affordable", yield: "6–8%", from: "AED 450,000", name: { fa: "دبی ساوث", en: "Dubai South", ar: "دبي الجنوب", ru: "Дубай Саут" }, bestFor: { fa: "رشد بلندمدت · نزدیک اکسپو", en: "Long-term growth · Near Expo", ar: "نمو طويل الأمد · قرب الإكسبو", ru: "Долгосрочный рост · Рядом с Экспо" } },
];

const FILTERS: { key: string; segment: Segment | "All" }[] = [
  { key: "areas_filter_all", segment: "All" },
  { key: "areas_filter_luxury", segment: "Luxury" },
  { key: "areas_filter_mid", segment: "Mid-Range" },
  { key: "areas_filter_affordable", segment: "Affordable" },
];

const DubaiAreasGrid = () => {
  const { t, lang } = useLanguage();
  const bp = t.bp;
  const [activeFilter, setActiveFilter] = useState<Segment | "All">("All");

  const filtered = activeFilter === "All" ? AREAS : AREAS.filter((a) => a.segment === activeFilter);

  const scrollToForm = (areaName: string) => {
    const el = document.getElementById("property-lead-form");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="py-16 bg-surface">
      <div className="max-w-5xl mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-navy text-center mb-8">
          {bp.areas_title}
        </h2>

        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {FILTERS.map((f) => (
            <button
              key={f.segment}
              onClick={() => setActiveFilter(f.segment)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeFilter === f.segment
                  ? "bg-navy text-gold"
                  : "bg-white text-muted-foreground hover:bg-navy/5"
              }`}
            >
              {bp[f.key as keyof typeof bp] as string}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((area, i) => (
            <motion.div
              key={area.key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className="bg-white rounded-2xl p-6 border-2 border-transparent hover:border-gold hover:-translate-y-1 transition-all duration-200"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-bold text-navy">{area.name[lang]}</h3>
                <span className="bg-gold text-navy text-xs font-medium rounded-full px-2 py-0.5">
                  {area.segment}
                </span>
              </div>

              <div className="flex items-center gap-4 text-sm mb-3">
                <span>
                  <span className="text-muted-foreground">{bp.areas_yield}: </span>
                  <span className="text-green-700 font-bold">{area.yield}</span>
                </span>
              </div>

              <p className="text-sm mb-2">
                <span className="text-muted-foreground">{bp.areas_from} </span>
                <span className="font-semibold">{area.from}</span>
              </p>

              <p className="text-sm italic text-muted-foreground mb-4">
                {bp.areas_best_for}: {area.bestFor[lang]}
              </p>

              <button
                onClick={() => scrollToForm(area.name[lang])}
                className="w-full bg-navy text-gold font-semibold py-2.5 rounded-xl text-sm hover:bg-navy-lt transition-colors min-h-[44px]"
              >
                {bp.areas_inquire}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DubaiAreasGrid;
