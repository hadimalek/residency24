"use client";

import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Home, Briefcase, Building2, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type PathKey = "property" | "professional" | "investor" | "talent";

const PATHS: { key: PathKey; icon: typeof Home; titleKey: string; reqKey: string }[] = [
  { key: "property", icon: Home, titleKey: "path_property", reqKey: "path_property_req" },
  { key: "professional", icon: Briefcase, titleKey: "path_professional", reqKey: "path_professional_req" },
  { key: "investor", icon: Building2, titleKey: "path_investor", reqKey: "path_investor_req" },
  { key: "talent", icon: Star, titleKey: "path_talent", reqKey: "path_talent_req" },
];

const DOCS: Record<PathKey, Record<string, string[]>> = {
  property: {
    fa: ["سند ملک (Title Deed) یا Oqood", "پاسپورت معتبر", "عکس پاسپورتی", "بیمه درمانی", "گواهی ارزیابی DLD"],
    en: ["Title Deed or Oqood registration", "Valid passport", "Passport-size photo", "Health insurance", "DLD valuation certificate"],
    ar: ["سند الملكية أو Oqood", "جواز سفر ساري", "صورة بحجم جواز السفر", "تأمين صحي", "شهادة تقييم DLD"],
    ru: ["Документ о праве собственности или Oqood", "Действующий паспорт", "Фото паспортного размера", "Медицинская страховка", "Сертификат оценки DLD"],
  },
  professional: {
    fa: ["گواهی حقوق (≥30K AED پایه)", "قرارداد کار", "مدرک دانشگاهی تأییدشده", "پاسپورت معتبر", "۵ سال سابقه کار"],
    en: ["Salary certificate (≥AED 30K base)", "Employment contract", "Attested university degree", "Valid passport", "5 years work experience"],
    ar: ["شهادة راتب (≥30K درهم أساسي)", "عقد عمل", "درجة جامعية مصدقة", "جواز سفر ساري", "5 سنوات خبرة"],
    ru: ["Справка о зарплате (≥30K AED базовая)", "Трудовой контракт", "Заверенный диплом", "Действующий паспорт", "5 лет опыта работы"],
  },
  investor: {
    fa: ["لایسنس شرکت", "گواهی سرمایه (≥2M AED)", "پاسپورت معتبر", "صورت‌های مالی حسابرسی‌شده", "گواهی مالیاتی"],
    en: ["Company trade license", "Capital certificate (≥AED 2M)", "Valid passport", "Audited financial statements", "Tax certificate"],
    ar: ["رخصة تجارية", "شهادة رأس مال (≥2M درهم)", "جواز سفر ساري", "بيانات مالية مدققة", "شهادة ضريبية"],
    ru: ["Торговая лицензия компании", "Сертификат капитала (≥2M AED)", "Действующий паспорт", "Аудированная финансовая отчётность", "Налоговый сертификат"],
  },
  talent: {
    fa: ["نامه توصیه از مرجع ذیصلاح امارات", "رزومه و سوابق حرفه‌ای", "پاسپورت معتبر", "مدارک تحصیلی و جوایز", "نامه تأیید از وزارت مربوطه"],
    en: ["Recommendation from UAE authority", "CV and professional portfolio", "Valid passport", "Academic credentials and awards", "Ministry approval letter"],
    ar: ["توصية من جهة إماراتية مختصة", "سيرة ذاتية وملف مهني", "جواز سفر ساري", "أوراق أكاديمية وجوائز", "خطاب موافقة وزارية"],
    ru: ["Рекомендация от органа ОАЭ", "Резюме и портфолио", "Действующий паспорт", "Дипломы и награды", "Письмо одобрения министерства"],
  },
};

export default function EligibilityChecker() {
  const { t, lang } = useLanguage();
  const [selected, setSelected] = useState<PathKey | null>(null);

  const handleSelect = (key: PathKey) => {
    setSelected(selected === key ? null : key);
    (window as any).gtag?.("event", "golden_visa_eligibility_selected", {
      path_type: key,
      language: lang,
    });
  };

  return (
    <section id="eligibility" className="py-16 px-6 bg-surface">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold text-navy text-center mb-8">
          {t.p004.eligibility_title}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {PATHS.map((path) => {
            const Icon = path.icon;
            const isSelected = selected === path.key;
            return (
              <button
                key={path.key}
                onClick={() => handleSelect(path.key)}
                className={`bg-white rounded-xl p-5 border-2 text-start cursor-pointer transition-transform hover:scale-[1.02] ${
                  isSelected ? "border-gold shadow-md" : "border-transparent"
                }`}
              >
                <Icon size={28} className="text-gold mb-3" />
                <h3 className="font-bold text-navy text-sm mb-1">
                  {t.p004[path.titleKey]}
                </h3>
                <p className="text-text-secondary text-xs leading-relaxed mb-2">
                  {t.p004[path.reqKey]}
                </p>
                <span className="inline-block text-xs bg-gold/15 text-gold rounded-full px-3 py-0.5 font-semibold">
                  {t.p004.path_badge}
                </span>
              </button>
            );
          })}
        </div>

        <AnimatePresence>
          {selected && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="mt-6 bg-white rounded-xl p-6 border border-border">
                <h4 className="font-bold text-navy text-sm mb-4">
                  {t.p004[PATHS.find((p) => p.key === selected)!.titleKey]} — {lang === "fa" ? "مدارک مورد نیاز" : lang === "ar" ? "الوثائق المطلوبة" : lang === "ru" ? "Необходимые документы" : "Required Documents"}
                </h4>
                <ul className="space-y-2">
                  {(DOCS[selected][lang] || DOCS[selected].en).map((doc, i) => (
                    <li key={i} className="flex items-start gap-2 text-text-secondary text-xs">
                      <span className="text-gold mt-0.5 flex-shrink-0">&#10003;</span>
                      {doc}
                    </li>
                  ))}
                </ul>
                <a
                  href="#consultation-form"
                  className="inline-block mt-5 bg-gold text-navy font-bold rounded-lg px-6 py-3 text-sm hover:bg-gold/90 transition-colors"
                >
                  {t.p004.cta_primary}
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
