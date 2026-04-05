"use client";

import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import { FileText, AlertCircle } from "lucide-react";

interface DocItem {
  name: string;
  required: boolean;
}

interface DocTab {
  id: string;
  label: string;
  docs: DocItem[];
  showIranNote?: boolean;
}

const DocumentsSection = () => {
  const { lang, isRTL } = useLanguage();

  const l = (fa: string, en: string, ar: string, ru: string): string =>
    ({ fa, en, ar, ru } as Record<string, string>)[lang] || en;

  const tabs: DocTab[] = [
    {
      id: "standard",
      label: l("استاندارد", "Standard", "قياسي", "Стандартный"),
      docs: [
        { name: l("پاسپورت معتبر (حداقل ۶ ماه اعتبار)", "Valid passport (min 6 months validity)", "جواز سفر صالح (٦ أشهر على الأقل)", "Действующий паспорт (мин. 6 мес.)"), required: true },
        { name: l("عکس پرسنلی رنگی (پس‌زمینه سفید)", "Color passport photo (white background)", "صورة شخصية ملونة (خلفية بيضاء)", "Цветное фото (белый фон)"), required: true },
        { name: l("اسکن صفحه اول پاسپورت", "Passport first page scan", "مسح الصفحة الأولى من الجواز", "Скан первой страницы паспорта"), required: true },
        { name: l("رزرو هتل یا آدرس اقامت", "Hotel reservation or accommodation address", "حجز فندق أو عنوان إقامة", "Бронь отеля или адрес проживания"), required: false },
        { name: l("بلیط برگشت", "Return flight ticket", "تذكرة طيران عودة", "Обратный авиаби��ет"), required: false },
      ],
    },
    {
      id: "iranian",
      label: l("ایرانی‌ها", "Iranian Nationals", "الإيرانيون", "Иранцы"),
      showIranNote: true,
      docs: [
        { name: l("پاسپورت معتبر (حداقل ۶ ماه)", "Valid passport (min 6 months)", "جواز سفر صالح (٦ أشهر)", "Действующий паспорт (мин. 6 мес.)"), required: true },
        { name: l("عکس پرسنلی رنگی (پس‌زمینه سفید)", "Color passport photo (white background)", "صورة شخصية ملونة (خلفية بيضاء)", "Цветное фото (белый фон)"), required: true },
        { name: l("اسکن کامل پاسپورت (همه صفحات مُهردار)", "Full passport scan (all stamped pages)", "مسح كامل للجواز (كل الصفحات المختومة)", "Полный скан паспорта (все страницы с печатями)"), required: true },
        { name: l("گواهی بانکی ۳ ماه اخیر", "3-month bank statement", "كشف حساب ٣ أشهر", "Выписка из банка за 3 мес."), required: true },
        { name: l("رزرو هتل", "Hotel reservation", "حجز فندق", "Бронь отеля"), required: true },
        { name: l("بلیط رفت و برگشت", "Round-trip flight ticket", "تذكرة ذهاب وعودة", "Авиабилет туда-обратно"), required: true },
      ],
    },
    {
      id: "arab",
      label: l("اتباع عرب", "Arab Nationals", "المواطنون العرب", "Арабские граждане"),
      docs: [
        { name: l("پاسپورت معتبر", "Valid passport", "جواز سفر صالح", "Действующий паспорт"), required: true },
        { name: l("عکس پرسنلی", "Passport photo", "صورة شخصية", "Фото на паспорт"), required: true },
        { name: l("اسکن صفحه اول پاسپورت", "Passport first page scan", "مسح الصفحة الأولى", "Скан первой страницы"), required: true },
        { name: l("رزرو هتل", "Hotel reservation", "حجز فندق", "Бронь отеля"), required: false },
      ],
    },
    {
      id: "other",
      label: l("سایر ملیت‌ها", "Other Nationalities", "جنسيات أخرى", "Другие"),
      docs: [
        { name: l("پاسپورت معتبر (حداقل ۶ ماه)", "Valid passport (min 6 months)", "جواز سفر صالح (٦ أشهر)", "Действующий паспорт (мин. 6 мес.)"), required: true },
        { name: l("عکس پرسنلی رنگی", "Color passport photo", "صورة شخصية ملونة", "Цветное фото"), required: true },
        { name: l("اسکن پاسپورت", "Passport scan", "مسح الجواز", "Скан паспорта"), required: true },
        { name: l("رزرو هتل یا دعوتنامه", "Hotel reservation or invitation letter", "حجز فندق أو خطاب دعوة", "Бронь отеля или приглашение"), required: false },
        { name: l("بلیط برگشت", "Return ticket", "تذكرة عودة", "Обратный билет"), required: false },
      ],
    },
  ];

  const [activeTab, setActiveTab] = useState(tabs[0].id);
  const activeTabData = tabs.find((t) => t.id === activeTab)!;

  const requiredLabel = l("اجباری", "Required", "إلزامي", "Обязательно");
  const optionalLabel = l("اختیاری", "Optional", "اختياري", "Необязательно");

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      className="py-16 px-4 bg-surface"
    >
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-navy text-center mb-8">
          {l("مدارک لازم برای ویزای توریستی امارات", "Required Documents for UAE Tourist Visa", "الوثائق المطلوبة للتأشيرة السياحية", "Необходимые документы для визы ОАЭ")}
        </h2>

        <div className="flex gap-2 mb-6 flex-wrap justify-center">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`text-xs font-semibold px-4 py-2 rounded-full transition-colors ${
                activeTab === tab.id
                  ? "bg-navy text-gold"
                  : "border border-border text-muted-foreground bg-white hover:border-navy hover:text-navy"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {activeTabData.docs.map((doc, i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-3 bg-white rounded-lg border border-border"
            >
              <FileText className="w-5 h-5 text-navy flex-shrink-0" />
              <span className="flex-1 text-sm text-ink">{doc.name}</span>
              <span
                className={`text-xs font-bold px-2 py-1 rounded-full ${
                  doc.required
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-muted-foreground"
                }`}
              >
                {doc.required ? requiredLabel : optionalLabel}
              </span>
            </div>
          ))}
        </div>

        {activeTabData.showIranNote && (
          <div
            className={`flex items-start gap-3 bg-gold-lt p-4 rounded-xl mt-4 ${
              isRTL ? "border-r-4 border-r-gold" : "border-l-4 border-l-gold"
            }`}
          >
            <AlertCircle className="w-5 h-5 text-navy flex-shrink-0 mt-0.5" />
            <p className="text-sm text-muted-foreground">
              <strong className="text-navy block mb-1">
                {l(
                  "پردازش ۵–۱۰ روز کاری",
                  "Processing 5–10 Working Days",
                  "المعالجة ٥-١٠ أيام عمل",
                  "Обработка 5–10 рабочих дней"
                )}
              </strong>
              {l(
                "به دلیل ICP security clearance، پردازش ایرانی‌ها ۵–۱۰ روز طول می‌کشد. تیم ما همه مکاتبات را انجام می‌دهد. نرخ تأیید: ۹۵٪+",
                "Due to ICP security clearance, Iranian national visa processing takes 5–10 working days. Our team handles all correspondence. Approval rate: 95%+",
                "بسبب إجراءات ICP، معالجة الإيرانيين ٥-١٠ أيام. فريقنا يتولى المراسلات. معدل القبول: +٩٥٪",
                "Из-за проверки безопасности ICP обработка занимает 5–10 дней. Наша команда всё организует. Одобрение: 95%+"
              )}
            </p>
          </div>
        )}
      </div>
    </motion.section>
  );
};

export default DocumentsSection;
