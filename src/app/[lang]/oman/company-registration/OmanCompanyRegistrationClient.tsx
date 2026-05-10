"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import Navbar from "@/components/Navbar";
import HeroChat from "@/components/HeroChat";
import TrustBar from "@/components/TrustBar";
import SharedBreadcrumb from "@/components/shared/SharedBreadcrumb";
import SharedFAQ from "@/components/shared/SharedFAQ";
import SharedCrossSell from "@/components/shared/SharedCrossSell";
import SharedLeadForm from "@/components/shared/SharedLeadForm";
import HowItWorks from "@/components/HowItWorks";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import {
  Building2,
  Building,
  IdCard,
  Globe2,
  CheckCircle2,
} from "lucide-react";
import type { CrossSellItem } from "@/components/shared/SharedCrossSell";
import type { FAQItem } from "@/components/shared/SharedFAQ";
import type { Lang } from "@/translations";

interface OptionCard {
  title: string;
  tagline: string;
  bullets: string[];
  price: string;
  best_for: string;
  highlighted?: boolean;
}

interface Content {
  breadcrumb_oman: string;
  breadcrumb_self: string;
  hero_h1: string;
  hero_sub: string;
  hero_badge: string;
  hero_placeholder: string;
  stats: { num: string; label: string }[];
  options_eyebrow: string;
  options_title: string;
  options_sub: string;
  options: OptionCard[];
  options_best_for: string;
  steps_eyebrow: string;
  steps_title: string;
  steps: { title: string; desc: string; days: string }[];
  costs_title: string;
  costs_intro: string;
  costs_disclaimer: string;
  cost_groups: { title: string; items: { label: string; value: string }[] }[];
  faq_title: string;
  faq_items: FAQItem[];
  crosssell_title: string;
  crosssell_residency_title: string;
  crosssell_residency_desc: string;
  crosssell_property_title: string;
  crosssell_property_desc: string;
  crosssell_uae_title: string;
  crosssell_uae_desc: string;
  lead_title: string;
  lead_sub: string;
}

const CONTENT: Record<Lang, Content> = {
  en: {
    breadcrumb_oman: "Oman",
    breadcrumb_self: "Company Registration",
    hero_h1: "Register Your Company in Oman — Mainland or Free Zone",
    hero_sub:
      "100% foreign ownership · 0% personal income tax · 25–30 year tax holidays in Sohar, Salalah and Duqm Free Zones. We handle license, MOA, address and bank account end-to-end.",
    hero_badge: "Oman Company 2026",
    hero_placeholder: "Ask about LLC vs Free Zone, license activities, bank account…",
    stats: [
      { num: "100%", label: "Foreign ownership" },
      { num: "2–6 wk", label: "Setup time" },
      { num: "0%", label: "Personal income tax" },
      { num: "25–30 yr", label: "Free Zone tax holiday" },
    ],
    options_eyebrow: "Your options",
    options_title: "Mainland LLC or Free Zone — what fits you?",
    options_sub: "Both allow 100% foreign ownership. The right choice depends on your activity, target market and need for an Omani address.",
    options: [
      {
        title: "Mainland LLC",
        tagline: "Trade locally across Oman",
        bullets: [
          "Sell directly to the Omani market and government",
          "100% foreign ownership for most activities",
          "Office address in Muscat, Sohar or anywhere in Oman",
          "Investor visa for founder and family",
        ],
        price: "From USD 2,500",
        best_for: "Local trading, professional services, retail",
        highlighted: true,
      },
      {
        title: "Free Zone (Sohar / Salalah / Duqm)",
        tagline: "Export-oriented, big tax holiday",
        bullets: [
          "25–30 year exemption on corporate tax",
          "100% repatriation of capital and profits",
          "Strategic for shipping, manufacturing, logistics",
          "Free Zone visa for staff and investors",
        ],
        price: "From USD 3,500",
        best_for: "Export, manufacturing, logistics, IT",
      },
    ],
    options_best_for: "Best for",
    steps_eyebrow: "Process",
    steps_title: "How company setup works in Oman",
    steps: [
      { title: "Discovery & activity selection", desc: "We map your business to the correct activity code and jurisdiction (mainland vs Free Zone).", days: "Day 1–3" },
      { title: "Documents & MOA", desc: "We prepare the Memorandum of Association, articles, and gather KYC for shareholders.", days: "Day 4–10" },
      { title: "License issuance", desc: "Submission to MOCIIP (mainland) or Free Zone authority. License + commercial registration issued.", days: "Day 10–25" },
      { title: "Bank account & visas", desc: "We open a corporate bank account and process investor / employee residency visas.", days: "Day 20–45" },
    ],
    costs_title: "Real costs in Oman",
    costs_intro:
      "Indicative all-in pricing for the most common Oman company structures.",
    costs_disclaimer: "Figures are 2026 indicative — final quote depends on activity, shareholders and visas. Contact us for an exact case quote.",
    cost_groups: [
      {
        title: "Mainland LLC",
        items: [
          { label: "Government fees", value: "From OMR 350" },
          { label: "Service fee", value: "From USD 2,000" },
          { label: "Annual renewal", value: "From USD 1,200" },
        ],
      },
      {
        title: "Free Zone (Sohar / Duqm / Salalah)",
        items: [
          { label: "License fee", value: "From USD 2,500" },
          { label: "Service fee", value: "From USD 1,500" },
          { label: "Office / flexi-desk", value: "From USD 1,000/yr" },
        ],
      },
      {
        title: "Visas & extras",
        items: [
          { label: "Investor visa", value: "From OMR 200" },
          { label: "Employee visa", value: "From OMR 250" },
          { label: "Bank account opening", value: "From USD 800" },
        ],
      },
    ],
    faq_title: "Company registration in Oman — FAQ",
    faq_items: [
      { question: "Can I own 100% of an Oman company as a foreigner?", answer: "Yes. Since 2020, foreign investors can own 100% of mainland LLCs in most activities. Free Zones have always allowed 100% foreign ownership." },
      { question: "What is the minimum capital?", answer: "Most activities have no fixed minimum capital today. Some specialized licenses (banking, insurance) have sector-specific requirements." },
      { question: "Mainland LLC vs Free Zone — which is cheaper?", answer: "Mainland is usually cheaper to start (~USD 2,500) but Free Zones win long-term thanks to the 25–30 year tax holiday on qualifying export activities." },
      { question: "Do I need a local Omani partner?", answer: "No, not for most activities. The 100% foreign ownership reform removed the local sponsor requirement for the majority of mainland activities." },
      { question: "How fast can I open a bank account?", answer: "After license issuance, corporate accounts in Oman typically take 2–4 weeks subject to compliance review of the beneficial owner." },
      { question: "Can the company sponsor my residency?", answer: "Yes. The company can sponsor an investor visa for the founder and labour visas for employees and dependents." },
    ],
    crosssell_title: "Other services in Oman",
    crosssell_residency_title: "Investor Residency",
    crosssell_residency_desc: "5 or 10-year card via property or business",
    crosssell_property_title: "Buy Property in Oman",
    crosssell_property_desc: "Freehold ITC zones — Muscat & Salalah",
    crosssell_uae_title: "UAE Free Zone Company",
    crosssell_uae_desc: "Compare with Dubai Free Zones",
    lead_title: "Get an exact Oman company quote",
    lead_sub: "Tell us your activity and we’ll send a tailored breakdown of costs and timeline within 24 hours.",
  },
  fa: {
    breadcrumb_oman: "عمان",
    breadcrumb_self: "ثبت شرکت",
    hero_h1: "ثبت شرکت در عمان — مین‌لند یا فری‌زون",
    hero_sub:
      "مالکیت ۱۰۰٪ خارجی · ۰٪ مالیات شخصی · معافیت ۲۵ تا ۳۰ ساله مالیاتی در فری‌زون‌های صحار، صلاله و الدقم. ما لایسنس، اساسنامه، آدرس و حساب بانکی را تا انتها مدیریت می‌کنیم.",
    hero_badge: "شرکت عمان ۲۰۲۶",
    hero_placeholder: "درباره LLC، فری‌زون، فعالیت‌های مجاز و حساب بانکی بپرسید…",
    stats: [
      { num: "۱۰۰٪", label: "مالکیت خارجی" },
      { num: "۲ تا ۶ هفته", label: "زمان ثبت" },
      { num: "۰٪", label: "مالیات شخصی" },
      { num: "۲۵ تا ۳۰ سال", label: "معافیت مالیاتی فری‌زون" },
    ],
    options_eyebrow: "گزینه‌های شما",
    options_title: "LLC مین‌لند یا فری‌زون — کدام برای شما؟",
    options_sub: "هر دو امکان مالکیت ۱۰۰٪ خارجی را می‌دهند. انتخاب درست به نوع فعالیت، بازار هدف و نیاز به آدرس داخلی بستگی دارد.",
    options: [
      {
        title: "LLC مین‌لند",
        tagline: "تجارت داخلی در سراسر عمان",
        bullets: [
          "فروش مستقیم به بازار و دولت عمان",
          "مالکیت ۱۰۰٪ خارجی برای اکثر فعالیت‌ها",
          "آدرس دفتر در مسقط، صحار یا هر نقطه از عمان",
          "ویزای سرمایه‌گذار برای مؤسس و خانواده",
        ],
        price: "از ۲,۵۰۰ دلار",
        best_for: "تجارت داخلی، خدمات تخصصی، خرده‌فروشی",
        highlighted: true,
      },
      {
        title: "فری‌زون (صحار / صلاله / الدقم)",
        tagline: "صادرات‌محور، معافیت بزرگ",
        bullets: [
          "معافیت ۲۵ تا ۳۰ ساله از مالیات شرکتی",
          "بازگردانی ۱۰۰٪ سرمایه و سود",
          "ایده‌آل برای کشتیرانی، تولید، لجستیک",
          "ویزای فری‌زون برای کارکنان و سرمایه‌گذاران",
        ],
        price: "از ۳,۵۰۰ دلار",
        best_for: "صادرات، تولید، لجستیک، IT",
      },
    ],
    options_best_for: "بهترین برای",
    steps_eyebrow: "فرآیند",
    steps_title: "ثبت شرکت در عمان چگونه انجام می‌شود",
    steps: [
      { title: "بررسی و انتخاب فعالیت", desc: "کسب‌وکار شما را به کد فعالیت و حوزه قضایی صحیح (مین‌لند یا فری‌زون) نگاشت می‌کنیم.", days: "روز ۱ تا ۳" },
      { title: "مدارک و اساسنامه", desc: "اساسنامه و مواد را آماده و KYC سهامداران را جمع‌آوری می‌کنیم.", days: "روز ۴ تا ۱۰" },
      { title: "صدور لایسنس", desc: "ارسال به MOCIIP (مین‌لند) یا اداره فری‌زون. لایسنس و ثبت تجاری صادر می‌شود.", days: "روز ۱۰ تا ۲۵" },
      { title: "حساب بانکی و ویزا", desc: "حساب شرکتی باز می‌کنیم و ویزای سرمایه‌گذار/کارمند را پردازش می‌کنیم.", days: "روز ۲۰ تا ۴۵" },
    ],
    costs_title: "هزینه‌های واقعی در عمان",
    costs_intro: "قیمت تقریبی end-to-end برای متداول‌ترین ساختارهای شرکت عمان.",
    costs_disclaimer: "ارقام تقریبی ۲۰۲۶ هستند — قیمت نهایی به فعالیت، تعداد سهامدار و ویزاها بستگی دارد. تماس بگیرید.",
    cost_groups: [
      {
        title: "LLC مین‌لند",
        items: [
          { label: "هزینه دولتی", value: "از ۳۵۰ ریال عمان" },
          { label: "هزینه خدمات", value: "از ۲,۰۰۰ دلار" },
          { label: "تمدید سالانه", value: "از ۱,۲۰۰ دلار" },
        ],
      },
      {
        title: "فری‌زون (صحار / الدقم / صلاله)",
        items: [
          { label: "هزینه لایسنس", value: "از ۲,۵۰۰ دلار" },
          { label: "هزینه خدمات", value: "از ۱,۵۰۰ دلار" },
          { label: "دفتر / فلکسی‌دسک", value: "از ۱,۰۰۰ دلار/سال" },
        ],
      },
      {
        title: "ویزا و موارد جانبی",
        items: [
          { label: "ویزای سرمایه‌گذار", value: "از ۲۰۰ ریال عمان" },
          { label: "ویزای کارمند", value: "از ۲۵۰ ریال عمان" },
          { label: "افتتاح حساب بانکی", value: "از ۸۰۰ دلار" },
        ],
      },
    ],
    faq_title: "ثبت شرکت در عمان — پرسش‌های رایج",
    faq_items: [
      { question: "آیا به‌عنوان خارجی می‌توانم ۱۰۰٪ مالک شرکت عمانی باشم؟", answer: "بله. از ۲۰۲۰ به بعد، سرمایه‌گذاران خارجی می‌توانند مالک ۱۰۰٪ LLC مین‌لند در اکثر فعالیت‌ها باشند. فری‌زون‌ها همیشه اجازه ۱۰۰٪ خارجی را می‌داده‌اند." },
      { question: "حداقل سرمایه چقدر است؟", answer: "اکثر فعالیت‌ها حداقل سرمایه ثابت ندارند. برخی لایسنس‌های تخصصی (بانک، بیمه) شرایط بخشی خاص خود را دارند." },
      { question: "مین‌لند یا فری‌زون — کدام ارزان‌تر است؟", answer: "مین‌لند معمولاً برای شروع ارزان‌تر است (~۲,۵۰۰ دلار) اما فری‌زون‌ها بلندمدت با معافیت ۲۵ تا ۳۰ ساله صرفه دارند." },
      { question: "آیا به شریک محلی عمانی نیاز دارم؟", answer: "خیر، برای اکثر فعالیت‌ها نه. اصلاح ۱۰۰٪ مالکیت خارجی، نیاز به اسپانسر محلی را برای اکثر فعالیت‌های مین‌لند حذف کرد." },
      { question: "چقدر زود حساب بانکی باز می‌شود؟", answer: "بعد از صدور لایسنس، حساب شرکتی در عمان معمولاً ۲ تا ۴ هفته زمان می‌برد بسته به بررسی compliance ذی‌نفع." },
      { question: "آیا شرکت می‌تواند اسپانسر اقامتم باشد؟", answer: "بله. شرکت می‌تواند ویزای سرمایه‌گذار برای مؤسس و ویزای کاری برای کارکنان و خانواده صادر کند." },
    ],
    crosssell_title: "سایر خدمات عمان",
    crosssell_residency_title: "اقامت سرمایه‌گذار",
    crosssell_residency_desc: "کارت ۵ یا ۱۰ ساله از طریق ملک یا کسب‌وکار",
    crosssell_property_title: "خرید ملک در عمان",
    crosssell_property_desc: "ITC مجاز — مسقط و صلاله",
    crosssell_uae_title: "شرکت فری‌زون امارات",
    crosssell_uae_desc: "مقایسه با فری‌زون‌های دبی",
    lead_title: "قیمت دقیق شرکت عمان را دریافت کنید",
    lead_sub: "نوع فعالیت خود را برای ما بنویسید تا ظرف ۲۴ ساعت تفکیک هزینه و زمان‌بندی اختصاصی را بفرستیم.",
  },
  ar: {
    breadcrumb_oman: "عُمان",
    breadcrumb_self: "تأسيس شركة",
    hero_h1: "تأسيس شركتك في سلطنة عُمان — البر الرئيسي أو منطقة حرة",
    hero_sub:
      "ملكية أجنبية 100٪ · 0٪ ضريبة دخل شخصي · إعفاء ضريبي 25 إلى 30 عاماً في مناطق صحار وصلالة والدقم الحرة. نتولى الترخيص والعقد التأسيسي والعنوان والحساب البنكي من البداية للنهاية.",
    hero_badge: "شركة عُمان 2026",
    hero_placeholder: "اسأل عن LLC أو منطقة حرة أو الأنشطة أو الحساب البنكي…",
    stats: [
      { num: "100٪", label: "ملكية أجنبية" },
      { num: "2 إلى 6 أسابيع", label: "زمن التأسيس" },
      { num: "0٪", label: "ضريبة شخصية" },
      { num: "25 إلى 30 سنة", label: "إعفاء المنطقة الحرة" },
    ],
    options_eyebrow: "خياراتك",
    options_title: "ش.م.م على البر الرئيسي أم منطقة حرة — أيهما يناسبك؟",
    options_sub: "كلاهما يسمح بملكية أجنبية 100٪. الخيار المناسب يعتمد على نشاطك وسوقك المستهدف والحاجة لعنوان داخل عُمان.",
    options: [
      {
        title: "ش.م.م على البر الرئيسي",
        tagline: "تجارة محلية في عُمان",
        bullets: [
          "البيع مباشرة للسوق العماني والحكومة",
          "ملكية أجنبية 100٪ لمعظم الأنشطة",
          "عنوان مكتب في مسقط أو صحار أو أي مكان",
          "تأشيرة مستثمر للمؤسس والعائلة",
        ],
        price: "من 2,500 دولار",
        best_for: "تجارة محلية، خدمات مهنية، تجزئة",
        highlighted: true,
      },
      {
        title: "منطقة حرة (صحار / صلالة / الدقم)",
        tagline: "موجهة للتصدير، إعفاء طويل",
        bullets: [
          "إعفاء 25 إلى 30 سنة من الضريبة",
          "إعادة 100٪ من رأس المال والأرباح",
          "مثالي للشحن والتصنيع واللوجستيات",
          "تأشيرة منطقة حرة للموظفين والمستثمرين",
        ],
        price: "من 3,500 دولار",
        best_for: "تصدير، تصنيع، لوجستيات، IT",
      },
    ],
    options_best_for: "الأنسب لـ",
    steps_eyebrow: "العملية",
    steps_title: "كيف يتم تأسيس الشركة في عُمان",
    steps: [
      { title: "الاستكشاف وتحديد النشاط", desc: "نطابق نشاطك مع رمز النشاط الصحيح والولاية القضائية (بر رئيسي أو منطقة حرة).", days: "اليوم 1 إلى 3" },
      { title: "الوثائق والعقد التأسيسي", desc: "نعد عقد التأسيس واللوائح ونجمع KYC المساهمين.", days: "اليوم 4 إلى 10" },
      { title: "إصدار الترخيص", desc: "تقديم إلى MOCIIP (بر رئيسي) أو هيئة المنطقة الحرة. إصدار الترخيص والسجل التجاري.", days: "اليوم 10 إلى 25" },
      { title: "الحساب البنكي والتأشيرات", desc: "نفتح حساباً مؤسسياً ونعالج تأشيرات الإقامة للمستثمرين والموظفين.", days: "اليوم 20 إلى 45" },
    ],
    costs_title: "تكاليف حقيقية في عُمان",
    costs_intro: "أسعار شاملة إرشادية لأكثر هياكل الشركات شيوعاً في عُمان.",
    costs_disclaimer: "الأرقام إرشادية لـ 2026 — السعر النهائي يعتمد على النشاط والمساهمين والتأشيرات. تواصل معنا لعرض دقيق.",
    cost_groups: [
      {
        title: "ش.م.م بر رئيسي",
        items: [
          { label: "رسوم حكومية", value: "من 350 ر.ع." },
          { label: "رسوم خدمات", value: "من 2,000 دولار" },
          { label: "تجديد سنوي", value: "من 1,200 دولار" },
        ],
      },
      {
        title: "منطقة حرة (صحار / الدقم / صلالة)",
        items: [
          { label: "رسوم الترخيص", value: "من 2,500 دولار" },
          { label: "رسوم خدمات", value: "من 1,500 دولار" },
          { label: "مكتب / فليكسي ديسك", value: "من 1,000 دولار/سنة" },
        ],
      },
      {
        title: "تأشيرات وإضافات",
        items: [
          { label: "تأشيرة المستثمر", value: "من 200 ر.ع." },
          { label: "تأشيرة الموظف", value: "من 250 ر.ع." },
          { label: "فتح حساب بنكي", value: "من 800 دولار" },
        ],
      },
    ],
    faq_title: "تأسيس شركة في عُمان — أسئلة شائعة",
    faq_items: [
      { question: "هل يمكنني تملك 100٪ من شركة عمانية كأجنبي؟", answer: "نعم. منذ 2020 يمكن للمستثمرين الأجانب تملك 100٪ من ش.م.م على البر الرئيسي في معظم الأنشطة. المناطق الحرة كانت دائماً تسمح بالملكية الكاملة." },
      { question: "ما الحد الأدنى لرأس المال؟", answer: "معظم الأنشطة لا تشترط حداً أدنى ثابتاً اليوم. بعض التراخيص المتخصصة (البنوك والتأمين) لها متطلبات قطاعية." },
      { question: "البر الرئيسي أم المنطقة الحرة — أيهما أرخص؟", answer: "البر الرئيسي عادة أرخص للبدء (~2,500 دولار) لكن المناطق الحرة تتفوق على المدى الطويل بفضل الإعفاء 25 إلى 30 عاماً." },
      { question: "هل أحتاج شريكاً عمانياً محلياً؟", answer: "لا، ليس لمعظم الأنشطة. إصلاح الملكية 100٪ ألغى متطلب الكفيل المحلي لمعظم أنشطة البر الرئيسي." },
      { question: "كم بسرعة يمكنني فتح حساب بنكي؟", answer: "بعد إصدار الترخيص، تستغرق الحسابات المؤسسية في عُمان عادة 2 إلى 4 أسابيع وفقاً لمراجعة الامتثال للمالك المنتفع." },
      { question: "هل يمكن للشركة كفالة إقامتي؟", answer: "نعم. يمكن للشركة كفالة تأشيرة مستثمر للمؤسس وتأشيرات عمل للموظفين والمعالين." },
    ],
    crosssell_title: "خدمات أخرى في عُمان",
    crosssell_residency_title: "إقامة المستثمر",
    crosssell_residency_desc: "بطاقة 5 أو 10 سنوات عبر العقار أو الشركة",
    crosssell_property_title: "شراء عقار في عُمان",
    crosssell_property_desc: "ITC معتمد — مسقط وصلالة",
    crosssell_uae_title: "شركة منطقة حرة الإمارات",
    crosssell_uae_desc: "مقارنة مع مناطق دبي الحرة",
    lead_title: "احصل على عرض دقيق لشركتك في عُمان",
    lead_sub: "أخبرنا بنشاطك وسنرسل تفصيلاً مخصصاً للتكاليف والمدة الزمنية خلال 24 ساعة.",
  },
  ru: {
    breadcrumb_oman: "Оман",
    breadcrumb_self: "Регистрация компании",
    hero_h1: "Регистрация компании в Омане — материк или свободная зона",
    hero_sub:
      "100% иностранное владение · 0% подоходного налога · налоговые каникулы 25–30 лет в свободных зонах Сохар, Салала и Дукм. Берём на себя лицензию, устав, адрес и банковский счёт от и до.",
    hero_badge: "Компания в Омане 2026",
    hero_placeholder: "Спросите про LLC, свободные зоны, виды деятельности, банк…",
    stats: [
      { num: "100%", label: "Иностранное владение" },
      { num: "2–6 нед", label: "Срок регистрации" },
      { num: "0%", label: "Личный налог" },
      { num: "25–30 лет", label: "Налоговые каникулы СЭЗ" },
    ],
    options_eyebrow: "Ваши варианты",
    options_title: "LLC на материке или свободная зона — что подходит?",
    options_sub: "Оба варианта дают 100% иностранное владение. Выбор зависит от деятельности, целевого рынка и потребности в адресе внутри Омана.",
    options: [
      {
        title: "LLC на материке",
        tagline: "Торговля внутри Омана",
        bullets: [
          "Прямые продажи на оманский рынок и государству",
          "100% иностранное владение для большинства видов",
          "Адрес офиса в Маскате, Сохаре или где угодно",
          "Виза инвестора для основателя и семьи",
        ],
        price: "От 2 500 $",
        best_for: "Локальная торговля, услуги, ритейл",
        highlighted: true,
      },
      {
        title: "Свободная зона (Сохар / Салала / Дукм)",
        tagline: "Экспорт + большие каникулы",
        bullets: [
          "Освобождение 25–30 лет от корпоративного налога",
          "100% репатриация капитала и прибыли",
          "Идеально для логистики, производства, IT",
          "Виза свободной зоны для сотрудников и инвесторов",
        ],
        price: "От 3 500 $",
        best_for: "Экспорт, производство, логистика, IT",
      },
    ],
    options_best_for: "Подходит для",
    steps_eyebrow: "Процесс",
    steps_title: "Как идёт регистрация компании в Омане",
    steps: [
      { title: "Discovery и выбор деятельности", desc: "Сопоставляем бизнес с правильным кодом деятельности и юрисдикцией (материк / СЭЗ).", days: "День 1–3" },
      { title: "Документы и устав", desc: "Готовим учредительный договор, устав и собираем KYC по бенефициарам.", days: "День 4–10" },
      { title: "Выпуск лицензии", desc: "Подача в MOCIIP (материк) или в орган свободной зоны. Лицензия + торговая регистрация.", days: "День 10–25" },
      { title: "Счёт и визы", desc: "Открываем корпоративный счёт и оформляем визу инвестора / сотрудников.", days: "День 20–45" },
    ],
    costs_title: "Реальные расходы в Омане",
    costs_intro: "Ориентировочные суммарные цены на самые частые структуры компаний в Омане.",
    costs_disclaimer: "Числа ориентировочные на 2026 — итог зависит от деятельности, акционеров и виз. Свяжитесь для точного расчёта.",
    cost_groups: [
      {
        title: "LLC на материке",
        items: [
          { label: "Госпошлины", value: "От OMR 350" },
          { label: "Сервисный тариф", value: "От 2 000 $" },
          { label: "Ежегодное продление", value: "От 1 200 $" },
        ],
      },
      {
        title: "СЭЗ (Сохар / Дукм / Салала)",
        items: [
          { label: "Лицензия", value: "От 2 500 $" },
          { label: "Сервисный тариф", value: "От 1 500 $" },
          { label: "Офис / флекси-стол", value: "От 1 000 $/год" },
        ],
      },
      {
        title: "Визы и доп. расходы",
        items: [
          { label: "Виза инвестора", value: "От OMR 200" },
          { label: "Виза сотрудника", value: "От OMR 250" },
          { label: "Открытие счёта", value: "От 800 $" },
        ],
      },
    ],
    faq_title: "Регистрация компании в Омане — FAQ",
    faq_items: [
      { question: "Можно ли иностранцу владеть 100% компании в Омане?", answer: "Да. С 2020 года иностранные инвесторы могут владеть 100% LLC на материке в большинстве видов деятельности. В свободных зонах 100% владение всегда было разрешено." },
      { question: "Какой минимум капитала?", answer: "Большинство видов деятельности сегодня не имеют фиксированного минимума. У отдельных лицензий (банк, страхование) есть свои отраслевые требования." },
      { question: "Материк или СЭЗ — что дешевле?", answer: "Материк обычно дешевле на старте (~2 500 $), но СЭЗ выигрывает в долгую благодаря налоговым каникулам 25–30 лет на квалифицированный экспорт." },
      { question: "Нужен ли местный оманский партнёр?", answer: "Нет, для большинства видов деятельности — нет. Реформа 100% иностранного владения отменила требование к местному спонсору для большей части материковых видов." },
      { question: "Как быстро открыть банковский счёт?", answer: "После выпуска лицензии корпоративный счёт обычно открывается за 2–4 недели в зависимости от compliance-проверки бенефициара." },
      { question: "Может ли компания спонсировать мою резиденцию?", answer: "Да. Компания может оформить визу инвестора для основателя и рабочие визы для сотрудников и иждивенцев." },
    ],
    crosssell_title: "Другие услуги в Омане",
    crosssell_residency_title: "Инвесторский ВНЖ",
    crosssell_residency_desc: "Карта на 5 или 10 лет через недвижимость или бизнес",
    crosssell_property_title: "Недвижимость в Омане",
    crosssell_property_desc: "Утверждённые ITC — Маскат и Салала",
    crosssell_uae_title: "Компания в свободной зоне ОАЭ",
    crosssell_uae_desc: "Сравните с зонами Дубая",
    lead_title: "Получите точный расчёт по компании в Омане",
    lead_sub: "Расскажите о деятельности — пришлём индивидуальную раскладку расходов и сроков в течение 24 часов.",
  },
};

export default function OmanCompanyRegistrationClient() {
  const { lang } = useLanguage();
  const c = CONTENT[lang];
  const homeHref = lang === "en" ? "/" : `/${lang}/`;
  const omanHref = lang === "en" ? "/oman/" : `/${lang}/oman/`;
  const linkPath = (path: string) => (lang === "en" ? `/${path}` : `/${lang}/${path}`);

  const breadcrumbItems = [
    { label: "Residency24", href: homeHref },
    { label: c.breadcrumb_oman, href: omanHref },
    { label: c.breadcrumb_self },
  ];

  const crossSellItems: CrossSellItem[] = [
    {
      title: c.crosssell_residency_title,
      description: c.crosssell_residency_desc,
      icon: IdCard,
      href: linkPath("oman/residency-visa/"),
      isHighlighted: true,
    },
    {
      title: c.crosssell_property_title,
      description: c.crosssell_property_desc,
      icon: Building,
      href: linkPath("oman/buy-property/"),
    },
    {
      title: c.crosssell_uae_title,
      description: c.crosssell_uae_desc,
      icon: Globe2,
      href: linkPath("uae/company-registration/"),
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <SharedBreadcrumb items={breadcrumbItems} />

        <HeroChat
          h1={c.hero_h1}
          sub={c.hero_sub}
          badge={c.hero_badge}
          placeholder={c.hero_placeholder}
        />

        <TrustBar />

        <section className="py-10 bg-white border-b border-border">
          <div className="max-w-5xl mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {c.stats.map((s, i) => (
                <div key={i} className="text-center">
                  <p className="text-3xl md:text-4xl font-bold text-navy mb-1">{s.num}</p>
                  <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Options grid */}
        <section className="py-16 bg-surface">
          <div className="max-w-5xl mx-auto px-4">
            <div className="text-center mb-10">
              <p className="text-xs uppercase tracking-wider text-gold mb-2">{c.options_eyebrow}</p>
              <h2 className="text-2xl md:text-3xl font-bold text-navy mb-3">{c.options_title}</h2>
              <p className="text-sm text-muted-foreground max-w-2xl mx-auto">{c.options_sub}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {c.options.map((o, i) => (
                <div
                  key={i}
                  className={`bg-white rounded-2xl p-6 border ${
                    o.highlighted ? "border-2 border-gold shadow-md" : "border-border"
                  }`}
                >
                  <div className="mb-4">
                    <h3 className="text-lg font-bold text-navy mb-1">{o.title}</h3>
                    <p className="text-sm text-gold/80">{o.tagline}</p>
                  </div>
                  <ul className="space-y-2 mb-4">
                    {o.bullets.map((b, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm text-ink">
                        <CheckCircle2 className="w-4 h-4 text-gold mt-0.5 shrink-0" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="border-t border-border pt-3">
                    <p className="text-base font-bold text-navy">{o.price}</p>
                    <p className="text-xs text-muted-foreground">
                      {c.options_best_for}: {o.best_for}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Process */}
        <section className="py-16 bg-white">
          <div className="max-w-5xl mx-auto px-4">
            <div className="text-center mb-10">
              <p className="text-xs uppercase tracking-wider text-gold mb-2">{c.steps_eyebrow}</p>
              <h2 className="text-2xl md:text-3xl font-bold text-navy">{c.steps_title}</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {c.steps.map((s, i) => (
                <div key={i} className="bg-surface border border-border rounded-xl p-5">
                  <div className="w-9 h-9 rounded-full bg-navy text-gold flex items-center justify-center text-sm font-bold mb-3">
                    {i + 1}
                  </div>
                  <p className="text-xs text-gold/80 mb-1">{s.days}</p>
                  <h3 className="text-sm font-semibold text-navy mb-1">{s.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Costs */}
        <section className="py-16 bg-surface">
          <div className="max-w-5xl mx-auto px-4">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-navy mb-3">{c.costs_title}</h2>
              <p className="text-sm text-muted-foreground max-w-2xl mx-auto">{c.costs_intro}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {c.cost_groups.map((g, i) => (
                <div key={i} className="bg-white border border-border rounded-xl p-5">
                  <h3 className="text-base font-bold text-navy mb-4">{g.title}</h3>
                  <ul className="space-y-3">
                    {g.items.map((it, j) => (
                      <li key={j} className="flex items-start justify-between gap-3 border-b border-border/40 pb-2 last:border-0">
                        <span className="text-sm text-muted-foreground">{it.label}</span>
                        <span className="text-sm font-semibold text-navy text-end">{it.value}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground text-center mt-6 max-w-2xl mx-auto">{c.costs_disclaimer}</p>
          </div>
        </section>

        <HowItWorks />

        <SharedFAQ items={c.faq_items} title={c.faq_title} />

        <SharedCrossSell items={crossSellItems} title={c.crosssell_title} />

        <SharedLeadForm
          serviceContext="oman_company_registration"
          title={c.lead_title}
          subtitle={c.lead_sub}
        />
      </main>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
