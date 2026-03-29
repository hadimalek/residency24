"use client";

import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import type { Lang } from "@/translations";

type Tab = "gv" | "company" | "property";

interface CostRow {
  item: string;
  amount: string;
  note?: boolean;
  highlight?: boolean;
}

const COSTS: Record<Tab, Record<Lang, CostRow[]>> = {
  gv: {
    fa: [
      { item: "هزینه حکومتی ویزا", amount: "~۴,۰۰۰ درهم" },
      { item: "هزینه پزشکی و بیومتریک", amount: "~۵۰۰ درهم" },
      { item: "تیکت‌ها و خدمات اداری", amount: "~۱,۵۰۰ درهم" },
      { item: "حق‌الزحمه رزیدنسی۲۴", amount: "از ۱۵,۰۰۰ درهم" },
      { item: "سرمایه‌گذاری ملک (مسیر ملک)", amount: "از ۲,۰۰۰,۰۰۰ درهم", note: true },
    ],
    en: [
      { item: "Government visa fee", amount: "~AED 4,000" },
      { item: "Medical & biometrics", amount: "~AED 500" },
      { item: "Admin & courier", amount: "~AED 1,500" },
      { item: "Residency24 service fee", amount: "From AED 15,000" },
      { item: "Property investment (property route)", amount: "From AED 2,000,000", note: true },
    ],
    ar: [
      { item: "رسوم التأشيرة الحكومية", amount: "~4,000 درهم" },
      { item: "الفحص الطبي والبيومترية", amount: "~500 درهم" },
      { item: "الرسوم الإدارية", amount: "~1,500 درهم" },
      { item: "أتعاب رزيدنسي24", amount: "من 15,000 درهم" },
      { item: "استثمار عقاري (مسار العقار)", amount: "من 2,000,000 درهم", note: true },
    ],
    ru: [
      { item: "Государственная пошлина за визу", amount: "~4 000 дирхам" },
      { item: "Медосмотр и биометрия", amount: "~500 дирхам" },
      { item: "Административные услуги", amount: "~1 500 дирхам" },
      { item: "Гонорар Residency24", amount: "От 15 000 дирхам" },
      { item: "Инвестиция в недвижимость (путь через недвижимость)", amount: "От 2 000 000 дирхам", note: true },
    ],
  },
  company: {
    fa: [
      { item: "Free Zone (IFZA / RAKEZ)", amount: "از ۱۸,۰۰۰ درهم" },
      { item: "Free Zone (DMCC)", amount: "از ۲۵,۰۰۰ درهم" },
      { item: "Mainland LLC", amount: "از ۲۱,۰۰۰ درهم" },
      { item: "ویزا صاحب شرکت (هر نفر)", amount: "~۵,۰۰۰ درهم" },
      { item: "افتتاح حساب بانکی", amount: "رایگان" },
      { item: "تمدید سالانه مجوز", amount: "از ۱۲,۰۰۰ درهم" },
    ],
    en: [
      { item: "Free Zone (IFZA / RAKEZ)", amount: "From AED 18,000" },
      { item: "Free Zone (DMCC)", amount: "From AED 25,000" },
      { item: "Mainland LLC", amount: "From AED 21,000" },
      { item: "Owner visa (per person)", amount: "~AED 5,000" },
      { item: "Bank account opening", amount: "Free" },
      { item: "Annual licence renewal", amount: "From AED 12,000" },
    ],
    ar: [
      { item: "منطقة حرة (IFZA / RAKEZ)", amount: "من 18,000 درهم" },
      { item: "منطقة حرة (DMCC)", amount: "من 25,000 درهم" },
      { item: "شركة البر الرئيسي", amount: "من 21,000 درهم" },
      { item: "تأشيرة المالك (لكل شخص)", amount: "~5,000 درهم" },
      { item: "فتح حساب بنكي", amount: "مجاناً" },
      { item: "التجديد السنوي للترخيص", amount: "من 12,000 درهم" },
    ],
    ru: [
      { item: "Свободная зона (IFZA / RAKEZ)", amount: "От 18 000 дирхам" },
      { item: "Свободная зона (DMCC)", amount: "От 25 000 дирхам" },
      { item: "ООО на материке", amount: "От 21 000 дирхам" },
      { item: "Виза владельца (на человека)", amount: "~5 000 дирхам" },
      { item: "Открытие банковского счёта", amount: "Бесплатно" },
      { item: "Ежегодное продление лицензии", amount: "От 12 000 дирхам" },
    ],
  },
  property: {
    fa: [
      { item: "ملک (ویزا ۲ ساله)", amount: "از ۷۵۰,۰۰۰ درهم" },
      { item: "ملک (گلدن ویزا ۱۰ ساله)", amount: "از ۲,۰۰۰,۰۰۰ درهم" },
      { item: "کارمزد DLD (حکومتی)", amount: "۴٪ ارزش ملک" },
      { item: "کارمزد عاملیت", amount: "۲٪ ارزش ملک" },
      { item: "هزینه ثبت سند", amount: "~۴,۰۰۰ درهم" },
      { item: "بازده اجاره انتظاری", amount: "۵-۸٪ سالانه", highlight: true },
    ],
    en: [
      { item: "Property (2-year visa)", amount: "From AED 750,000" },
      { item: "Property (10-year Golden Visa)", amount: "From AED 2,000,000" },
      { item: "DLD fee (government)", amount: "4% of property value" },
      { item: "Agency fee", amount: "2% of property value" },
      { item: "Title deed registration", amount: "~AED 4,000" },
      { item: "Expected rental yield", amount: "5-8% per year", highlight: true },
    ],
    ar: [
      { item: "عقار (تأشيرة سنتين)", amount: "من 750,000 درهم" },
      { item: "عقار (إقامة ذهبية 10 سنوات)", amount: "من 2,000,000 درهم" },
      { item: "رسوم دائرة الأراضي", amount: "4٪ من قيمة العقار" },
      { item: "رسوم الوكالة", amount: "2٪ من قيمة العقار" },
      { item: "تسجيل سند الملكية", amount: "~4,000 درهم" },
      { item: "العائد الإيجاري المتوقع", amount: "5-8٪ سنوياً", highlight: true },
    ],
    ru: [
      { item: "Недвижимость (виза на 2 года)", amount: "От 750 000 дирхам" },
      { item: "Недвижимость (золотая виза 10 лет)", amount: "От 2 000 000 дирхам" },
      { item: "Пошлина DLD (госпошлина)", amount: "4% от стоимости" },
      { item: "Агентская комиссия", amount: "2% от стоимости" },
      { item: "Регистрация права собственности", amount: "~4 000 дирхам" },
      { item: "Ожидаемая доходность аренды", amount: "5-8% в год", highlight: true },
    ],
  },
};

const TABS: { id: Tab; labelKey: string }[] = [
  { id: "gv", labelKey: "costs_tab_gv" },
  { id: "company", labelKey: "costs_tab_company" },
  { id: "property", labelKey: "costs_tab_property" },
];

export default function CostBreakdown() {
  const { lang, t, isRTL } = useLanguage();
  const [activeTab, setActiveTab] = useState<Tab>("gv");

  const rows = COSTS[activeTab][lang as Lang] || COSTS[activeTab].en;

  return (
    <section dir={isRTL ? "rtl" : "ltr"} className="py-16 px-4 bg-white">
      <div className="max-w-[800px] mx-auto">
        <h2 className="text-center text-2xl font-bold text-navy mb-6">
          {t.costs_section_title}
        </h2>

        {/* Tabs */}
        <div className="flex gap-2 justify-center mb-6 flex-wrap">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-navy text-gold font-bold"
                  : "bg-muted/50 text-muted-foreground hover:bg-muted"
              }`}
            >
              {t[tab.labelKey]}
            </button>
          ))}
        </div>

        {/* Cost rows */}
        <div className="rounded-xl overflow-hidden border border-border">
          {rows.map((row, i) => (
            <div
              key={i}
              className={`flex items-center justify-between px-5 py-3.5 ${
                row.highlight
                  ? "bg-amber-50"
                  : i % 2 === 0
                    ? "bg-white"
                    : "bg-muted/30"
              } ${i < rows.length - 1 ? "border-b border-border" : ""}`}
            >
              <span className={`text-sm ${row.note ? "text-muted-foreground" : "text-foreground"}`}>
                {row.note && "* "}{row.item}
              </span>
              <span className={`text-sm font-bold whitespace-nowrap ${
                row.highlight ? "text-amber-700" : "text-navy"
              }`}>
                {row.amount}
              </span>
            </div>
          ))}
        </div>

        <p className="text-xs text-muted-foreground mt-4 text-center">
          {t.costs_note}
        </p>
      </div>
    </section>
  );
}
