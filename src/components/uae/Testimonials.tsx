"use client";

import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

// PLACEHOLDER DATA — replace with real client testimonials before publishing
const TESTIMONIALS = [
  {
    lang: "fa",
    name: "محمد رضا ک.",
    country: "\u{1F1EE}\u{1F1F7} تهران",
    service: "ثبت شرکت دبی",
    rating: 5,
    text: "فرآیند ثبت شرکت در دبی با راهنمایی رزیدنسی۲۴ خیلی راحت‌تر از آنچه فکر می‌کردم بود. در ۹ روز شرکت ثبت شد.",
  },
  {
    lang: "fa",
    name: "سارا م.",
    country: "\u{1F1EE}\u{1F1F7} مشهد",
    service: "گلدن ویزا",
    rating: 5,
    text: "گلدن ویزای امارات را در کمتر از ۶ هفته دریافت کردیم. تیم رزیدنسی۲۴ در هر مرحله همراه ما بود.",
  },
  {
    lang: "en",
    name: "James T.",
    country: "\u{1F1EC}\u{1F1E7} London",
    service: "UAE Golden Visa",
    rating: 5,
    text: "Residency24 made the Golden Visa process completely painless. Professional, responsive, and delivered exactly what they promised.",
  },
  {
    lang: "ar",
    name: "أحمد م. العراقي",
    country: "\u{1F1EE}\u{1F1F6} بغداد",
    service: "الإقامة الذهبية",
    rating: 5,
    text: "حصلت على إقامتي الذهبية في الإمارات خلال 5 أسابيع بمساعدة فريق رزيدنسي24. خدمة احترافية ومتابعة ممتازة.",
  },
  {
    lang: "ar",
    name: "ليلى ح.",
    country: "\u{1F1F1}\u{1F1E7} بيروت",
    service: "تأسيس شركة دبي",
    rating: 5,
    text: "أسست شركتي في دبي بسهولة تامة مع رزيدنسي24. الفريق متعدد اللغات وفهم احتياجاتي تماماً.",
  },
  {
    lang: "ru",
    name: "Наталья К.",
    country: "\u{1F1F7}\u{1F1FA} Москва",
    service: "Регистрация компании",
    rating: 5,
    text: "Зарегистрировали компанию в Дубае за 10 дней. Команда Residency24 ответила на все вопросы и провела через весь процесс.",
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="text-gold text-base">
      {"\u2605".repeat(rating)}{"\u2606".repeat(5 - rating)}
    </div>
  );
}

export default function Testimonials() {
  const { lang, t, isRTL } = useLanguage();

  const filtered = TESTIMONIALS.filter((tm) => tm.lang === lang || tm.lang === "en");
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent((c) => (c - 1 + filtered.length) % filtered.length);
  const next = () => setCurrent((c) => (c + 1) % filtered.length);

  const tm = filtered[current] || filtered[0];
  if (!tm) return null;

  return (
    <section dir={isRTL ? "rtl" : "ltr"} className="py-16 px-4 bg-navy">
      <div className="max-w-[720px] mx-auto text-center">
        <h2 className="text-2xl font-bold text-gold mb-8">
          {t.testi_section_title}
        </h2>

        {/* Card */}
        <div className="bg-white rounded-2xl p-8 sm:p-10 relative">
          <StarRating rating={tm.rating} />
          <p className="text-base text-foreground leading-relaxed my-4 italic">
            &ldquo;{tm.text}&rdquo;
          </p>
          <div className={`flex items-center justify-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
            <div className="w-11 h-11 rounded-full bg-navy flex items-center justify-center text-gold font-bold text-lg">
              {tm.name.charAt(0)}
            </div>
            <div className={isRTL ? "text-right" : "text-left"}>
              <div className="font-bold text-navy text-sm">{tm.name}</div>
              <div className="text-xs text-muted-foreground">{tm.country} · {tm.service}</div>
            </div>
            <span className="ms-auto text-[0.7rem] bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full">
              &#10003; {t.testi_verified}
            </span>
          </div>
        </div>

        {/* Navigation */}
        {filtered.length > 1 && (
          <div className="flex items-center justify-center gap-4 mt-6">
            <button
              onClick={isRTL ? next : prev}
              className="w-9 h-9 rounded-full bg-white/10 text-gold text-lg hover:bg-white/20 transition-colors"
            >
              &#8249;
            </button>
            <div className="flex gap-1.5">
              {filtered.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`w-2 h-2 rounded-full transition-colors ${i === current ? "bg-gold" : "bg-white/30"}`}
                />
              ))}
            </div>
            <button
              onClick={isRTL ? prev : next}
              className="w-9 h-9 rounded-full bg-white/10 text-gold text-lg hover:bg-white/20 transition-colors"
            >
              &#8250;
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
