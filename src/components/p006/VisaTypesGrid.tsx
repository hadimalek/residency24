"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import { Calendar, CalendarDays, CalendarRange, RefreshCw, Plane, Clock } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface VisaType {
  Icon: LucideIcon;
  name: string;
  duration: string;
  durationUnit: string;
  entry: string;
  price: string;
  bestFor: string;
  popular: boolean;
}

const VisaTypesGrid = () => {
  const { lang, isRTL } = useLanguage();

  const l = (fa: string, en: string, ar: string, ru: string): string =>
    ({ fa, en, ar, ru } as Record<string, string>)[lang] || en;

  const visaTypes: VisaType[] = [
    {
      Icon: Calendar,
      name: l("ویزای ۳۰ روزه", "30-Day Visa", "تأشيرة ٣٠ يوماً", "Виза 30 дней"),
      duration: "30",
      durationUnit: l("روز", "Days", "يوماً", "дней"),
      entry: l("تک / چند ورودی", "Single / Multiple", "فردي / متعدد", "Одно/многократный"),
      price: l("از ۳۵۰ AED", "From AED 350", "من ٣٥٠ درهم", "От AED 350"),
      bestFor: l("توریست، خانواده", "Tourism, Family", "السياحة، العائلة", "Туризм, семья"),
      popular: true,
    },
    {
      Icon: CalendarDays,
      name: l("ویزای ��۰ روزه", "60-Day Visa", "تأشيرة ٦٠ يوماً", "Виза 60 дней"),
      duration: "60",
      durationUnit: l("روز", "Days", "يوماً", "дней"),
      entry: l("تک ورودی", "Single Entry", "دخول فردي", "Однократный"),
      price: l("از ۵۵۰ AED", "From AED 550", "من ٥٥٠ درهم", "От AED 550"),
      bestFor: l("سفر کاری", "Business Scouting", "رحلات الأعمال", "Деловые поездки"),
      popular: false,
    },
    {
      Icon: CalendarRange,
      name: l("ویزای ۹۰ روزه", "90-Day Visa", "تأشيرة ٩٠ يوماً", "Виза 90 дней"),
      duration: "90",
      durationUnit: l("روز", "Days", "يوماً", "дней"),
      entry: l("تک / قابل تمدید", "Single / Extendable", "فردي / قابل للتمديد", "Однократный / Продлеваемый"),
      price: l("از ۷۵۰ AED", "From AED 750", "من ٧٥٠ درهم", "От AED 750"),
      bestFor: l("سرمایه‌گذار", "Investors, Long Stay", "المستثمرون", "Инвесторы"),
      popular: false,
    },
    {
      Icon: RefreshCw,
      name: l("چند ورودی", "Multi-Entry", "متعددة الدخول", "Мультивиза"),
      duration: "6/12",
      durationUnit: l("ماه", "Mo.", "أشهر", "мес."),
      entry: l("نامحدود", "Unlimited Entries", "دخول غير محدودة", "Неограниченно"),
      price: l("از ۱٬۲۰۰ AED", "From AED 1,200", "من ١٢٠٠ درهم", "От AED 1,200"),
      bestFor: l("مسافر مکرر", "Frequent Visitor", "كثير التنقل", "Частый пос��титель"),
      popular: false,
    },
    {
      Icon: Plane,
      name: l("ترانزیت", "Transit Visa", "تأشيرة العبور", "Транзитная виза"),
      duration: "48–96",
      durationUnit: l("ساعت", "Hrs", "ساعة", "ч."),
      entry: l("فرودگاه / شهر", "Airport / City", "مطار / مدينة", "Аэропорт / ��ород"),
      price: l("از ۱۵۰ AED", "From AED 150", "من ١٥٠ درهم", "От AED 150"),
      bestFor: l("ترانزیت", "Layover & Transit", "العبور", "Транзит"),
      popular: false,
    },
    {
      Icon: Clock,
      name: l("تمدید ویزا", "Visa Extension", "تمديد التأشيرة", "Продление визы"),
      duration: "+30",
      durationUnit: l("روز", "Days", "يوماً", "дней"),
      entry: l("داخل امارات", "In-Country", "داخل الدولة", "Внутри страны"),
      price: l("AED ۶۰۰ + %۵ VAT", "AED 600 + 5% VAT", "٦٠٠ درهم + ٥٪", "AED 600 + 5% НДС"),
      bestFor: l("تمدید اقامت", "Extending Stay", "تمديد الإقامة", "Продление"),
      popular: false,
    },
  ];

  const popularLabel = l("پرطرفدار", "Popular", "الأكثر طلباً", "Популярно");
  const applyLabel = l("درخواست ویزا", "Apply Now", "قدّم طلبك", "Подать заявку");

  return (
    <section className="py-16 px-4 bg-surface">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-navy text-center mb-10">
          {l("نوع ویزای خود را انتخاب کنید", "Choose Your UAE Tourist Visa Type", "اختر نوع تأشيرتك السياحية", "Виды туристических виз О��Э")}
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {visaTypes.map((visa, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className="bg-navy rounded-xl p-5 text-center flex flex-col items-center gap-2 relative"
            >
              {visa.popular && (
                <span className="absolute top-3 start-3 bg-gold text-navy text-xs font-bold px-2 py-1 rounded-full">
                  {popularLabel}
                </span>
              )}

              <visa.Icon className="w-8 h-8 text-gold" />
              <span className="text-gold font-bold text-sm">{visa.name}</span>
              <div className="text-white text-2xl font-bold leading-none">
                {visa.duration}
                <span className="text-xs text-white/60 ms-1">{visa.durationUnit}</span>
              </div>
              <span className="text-white/60 text-xs">{visa.entry}</span>
              <span className="text-white font-semibold text-sm">{visa.price}</span>
              <span className="bg-white/10 text-white/80 text-xs px-3 py-1 rounded-full">
                {visa.bestFor}
              </span>

              <a
                href="#consultation-form"
                className="mt-2 bg-navy text-gold font-bold text-xs px-4 py-2 rounded-xl border border-gold/30 hover:bg-navy/90 transition w-full"
              >
                {applyLabel}
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default VisaTypesGrid;
