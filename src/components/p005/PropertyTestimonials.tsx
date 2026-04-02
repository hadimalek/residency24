"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import type { Lang } from "@/translations";

interface Testimonial {
  flag: string;
  name: Record<Lang, string>;
  area: Record<Lang, string>;
  outcome: Record<Lang, string>;
  quote: Record<Lang, string>;
  stars: number;
}

const TESTIMONIALS: Testimonial[] = [
  {
    flag: "\u{1F1EE}\u{1F1F7}",
    name: { fa: "علیرضا م. — تهران", en: "Alireza M. — Tehran", ar: "عليرضا م. — طهران", ru: "Алиреза М. — Тегеран" },
    area: { fa: "آپارتمان JVC", en: "JVC Apartment", ar: "شقة JVC", ru: "Квартира в JVC" },
    outcome: { fa: "گلدن ویزا — ۶۰ روز", en: "Golden Visa — 60 days", ar: "إقامة ذهبية — 60 يوماً", ru: "Золотая виза — 60 дней" },
    quote: { fa: "با راهنمایی اقامت۲۴ ملک خریدم و در ۶۰ روز گلدن ویزا گرفتم. هیچ محدودیتی نبود.", en: "With Residency24's guidance I bought the apartment and got my Golden Visa in 60 days. No restrictions at all.", ar: "بتوجيه Residency24 اشتريت الشقة وحصلت على إقامة ذهبية خلال 60 يوماً.", ru: "С помощью Residency24 я купил квартиру и получил Золотую визу за 60 дней." },
    stars: 5,
  },
  {
    flag: "\u{1F1F7}\u{1F1FA}",
    name: { fa: "میخاییل ک. — مسکو", en: "Mikhail K. — Moscow", ar: "ميخائيل ك. — موسكو", ru: "Михаил К. — Москва" },
    area: { fa: "دبی مارینا", en: "Dubai Marina", ar: "دبي مارينا", ru: "Дубай Марина" },
    outcome: { fa: "سند ۳۰ روزه", en: "Title Deed in 30 days", ar: "سند الملكية في 30 يوماً", ru: "Свидетельство за 30 дней" },
    quote: { fa: "تیم همه کارها را از راه دور انجام داد. حرفه‌ای، سریع، شفاف.", en: "The team handled everything remotely. Professional, fast, transparent.", ar: "تولّى الفريق كل شيء عن بُعد. احترافية وشفافية تامة.", ru: "Команда всё сделала удалённо. Профессионально, быстро, прозрачно." },
    stars: 5,
  },
  {
    flag: "\u{1F1F0}\u{1F1FC}",
    name: { fa: "احمد ع. — کویت", en: "Ahmed A. — Kuwait", ar: "أحمد ع. — الكويت", ru: "Ахмед А. — Кувейт" },
    area: { fa: "ویلا دبی هیلز", en: "Dubai Hills Villa", ar: "فيلا تلال دبي", ru: "Вилла Дубай Хиллс" },
    outcome: { fa: "گلدن ویزا خانوادگی", en: "Family Golden Visa", ar: "إقامة ذهبية للعائلة", ru: "Семейная Золотая виза" },
    quote: { fa: "تیم عربی‌زبان حرفه‌ای. از اول تا آخر همه چیز کامل بود.", en: "Professional Arabic-speaking team. Everything was seamless from start to finish.", ar: "فريق عربي محترف، خدمة متكاملة من الاستفسار حتى صدور الإقامة الذهبية للعائلة.", ru: "Профессиональная арабоязычная команда. Весь процесс прошёл безупречно." },
    stars: 5,
  },
];

const PropertyTestimonials = () => {
  const { t, lang } = useLanguage();
  const bp = t.bp;

  return (
    <section className="py-16 bg-surface">
      <div className="max-w-5xl mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-navy text-center mb-10">
          {bp.testimonials_title}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.3, delay: i * 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-sm"
            >
              <div className="flex gap-0.5 mb-3">
                {Array.from({ length: item.stars }).map((_, s) => (
                  <Star key={s} className="w-4 h-4 fill-gold text-gold" />
                ))}
              </div>

              <p className="text-sm italic text-muted-foreground leading-relaxed mb-4">
                &ldquo;{item.quote[lang]}&rdquo;
              </p>

              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">{item.flag}</span>
                <span className="font-bold text-navy text-sm">{item.name[lang]}</span>
              </div>

              <div className="flex flex-wrap gap-2">
                <span className="bg-gold-lt text-navy text-xs px-2 py-0.5 rounded font-medium">
                  {item.area[lang]}
                </span>
                <span className="bg-gold-lt text-navy text-xs px-2 py-0.5 rounded font-medium">
                  {item.outcome[lang]}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PropertyTestimonials;
