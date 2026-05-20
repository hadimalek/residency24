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
  Building,
  Building2,
  Globe2,
  Home,
  Briefcase,
  Banknote,
  Users,
} from "lucide-react";
import type { CrossSellItem } from "@/components/shared/SharedCrossSell";
import type { FAQItem } from "@/components/shared/SharedFAQ";
import type { Lang } from "@/translations";

interface RouteCard {
  icon: typeof Home;
  title: string;
  duration: string;
  threshold: string;
  notes: string;
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
  routes_eyebrow: string;
  routes_title: string;
  routes_sub: string;
  routes: RouteCard[];
  routes_duration_label: string;
  routes_threshold_label: string;
  benefits_eyebrow: string;
  benefits_title: string;
  benefits: { title: string; desc: string }[];
  steps_title: string;
  steps: { title: string; desc: string; days: string }[];
  costs_title: string;
  costs_intro: string;
  costs_disclaimer: string;
  cost_groups: { title: string; items: { label: string; value: string }[] }[];
  faq_title: string;
  faq_items: FAQItem[];
  crosssell_title: string;
  crosssell_property_title: string;
  crosssell_property_desc: string;
  crosssell_company_title: string;
  crosssell_company_desc: string;
  crosssell_uae_title: string;
  crosssell_uae_desc: string;
  lead_title: string;
  lead_sub: string;
}

const CONTENT: Record<Lang, Content> = {
  en: {
    breadcrumb_oman: "Oman",
    breadcrumb_self: "Investor Residency",
    hero_h1: "Oman Investor Residency — 5 or 10-Year Card via Property, Business or Deposit",
    hero_sub:
      "Oman's Investor Residency Card grants long-term residency with family inclusion. Three qualifying routes: real estate from OMR 250,000, business investment, or a bank deposit.",
    hero_badge: "Oman IRC 2026",
    hero_placeholder: "Ask about Oman Investor Residency thresholds and routes…",
    stats: [
      { num: "5–10 yr", label: "Residency length" },
      { num: "OMR 250K", label: "Property minimum" },
      { num: "Spouse + kids", label: "Family included" },
      { num: "0%", label: "Personal income tax" },
    ],
    routes_eyebrow: "Qualifying routes",
    routes_title: "Three ways to qualify for Oman Investor Residency",
    routes_sub: "Choose the route that matches your goals and capital. All routes lead to the same Investor Residency Card.",
    routes: [
      {
        icon: Home,
        title: "Property investment",
        duration: "5 or 10 years",
        threshold: "OMR 250K (5-yr) / OMR 500K (10-yr)",
        notes: "Most popular route. Property must be in approved ITC zones (The Wave, Muscat Hills, etc.).",
        highlighted: true,
      },
      {
        icon: Briefcase,
        title: "Business investment",
        duration: "5 or 10 years",
        threshold: "OMR 250K (5-yr) / OMR 500K (10-yr)",
        notes: "Investment in an Omani company. Best paired with our Oman company setup service.",
      },
      {
        icon: Banknote,
        title: "Bank deposit",
        duration: "5 or 10 years",
        threshold: "OMR 250K (5-yr) / OMR 500K (10-yr)",
        notes: "Fixed deposit in a local Omani bank for the residency duration. Simplest paperwork.",
      },
    ],
    routes_duration_label: "Duration",
    routes_threshold_label: "Threshold",
    benefits_eyebrow: "Benefits",
    benefits_title: "What the Oman Investor Residency unlocks",
    benefits: [
      { title: "Long-term residency", desc: "5 or 10-year multi-entry residency for you and your family." },
      { title: "Family inclusion", desc: "Spouse and dependent children included on the same investment." },
      { title: "0% personal tax", desc: "No tax on income, capital gains, dividends or inheritance." },
      { title: "Bank accounts & schooling", desc: "Open Omani bank accounts, enrol children in international schools, get an Omani driving licence." },
      { title: "Property freehold", desc: "Buy and hold freehold property in approved ITC zones, eligible for resale." },
      { title: "Easy renewals", desc: "Renewable as long as the qualifying asset is held. No minimum stay enforced today." },
    ],
    steps_title: "How the Investor Residency process works",
    steps: [
      { title: "Eligibility check", desc: "We review your profile, target route (property/business/deposit) and family.", days: "Day 1–3" },
      { title: "Investment placement", desc: "Property purchase, company funding or bank deposit set up with the correct documents.", days: "Day 7–30" },
      { title: "Application", desc: "Application filed with the Ministry of Commerce, Industry & Investment Promotion (MOCIIP).", days: "Day 30–45" },
      { title: "Card issuance", desc: "5 or 10-year Investor Residency Card issued for principal + family.", days: "Day 45–60" },
    ],
    costs_title: "Investor Residency — real costs",
    costs_intro: "Indicative total cost for a single applicant via the property route. Bank deposit and business routes have similar fee structures.",
    costs_disclaimer: "Indicative 2026 figures. Final fees depend on number of dependents, route and chosen jurisdiction.",
    cost_groups: [
      {
        title: "5-year route (property)",
        items: [
          { label: "Property minimum", value: "OMR 250,000" },
          { label: "Government fee", value: "From OMR 1,000" },
          { label: "Service fee", value: "From USD 3,500" },
        ],
      },
      {
        title: "10-year route (property)",
        items: [
          { label: "Property minimum", value: "OMR 500,000" },
          { label: "Government fee", value: "From OMR 1,500" },
          { label: "Service fee", value: "From USD 4,500" },
        ],
      },
      {
        title: "Family add-ons",
        items: [
          { label: "Spouse", value: "From OMR 200" },
          { label: "Each child", value: "From OMR 200" },
          { label: "Medical & insurance", value: "From OMR 100/person" },
        ],
      },
    ],
    faq_title: "Oman Investor Residency — FAQ",
    faq_items: [
      { question: "How long is the Investor Residency valid?", answer: "5 years for the OMR 250,000 route; 10 years for OMR 500,000+. Both are renewable as long as you keep the qualifying asset (property, business or deposit)." },
      { question: "Does this give Omani citizenship?", answer: "No. The Investor Residency Card grants long-term residency, not citizenship. Omani citizenship requires a separate, longer process with very strict criteria." },
      { question: "Do I need to live in Oman?", answer: "There is no strict minimum-stay rule today. As a guideline, avoid being absent for more than 6 consecutive months without notice." },
      { question: "Can I include parents on my residency?", answer: "Generally no — only spouse and dependent children. Parents can sometimes be brought on visitor or family visit visas, not on the Investor Residency itself." },
      { question: "Can I work in Oman with this residency?", answer: "Yes, you can be self-employed via your invested company or hold directorship roles. Local employment usually requires a labour visa from the employer." },
      { question: "What happens if I sell the property?", answer: "If the qualifying asset falls below the threshold, the residency is not automatically renewed. You can switch to another qualifying route (business / deposit) before renewal." },
    ],
    crosssell_title: "Pair it with…",
    crosssell_property_title: "Buy Property in Oman",
    crosssell_property_desc: "Find an ITC property that qualifies for residency",
    crosssell_company_title: "Oman Company Registration",
    crosssell_company_desc: "Business route — combine company + residency",
    crosssell_uae_title: "UAE Golden Visa",
    crosssell_uae_desc: "Compare 10-year UAE residency",
    lead_title: "Get an Investor Residency feasibility check",
    lead_sub: "Tell us your route preference and budget — we’ll send eligibility and total cost within 24 hours.",
  },
  fa: {
    breadcrumb_oman: "عمان",
    breadcrumb_self: "اقامت سرمایه‌گذار",
    hero_h1: "اقامت سرمایه‌گذار عمان — کارت ۵ یا ۱۰ ساله از طریق ملک، کسب‌وکار یا سپرده",
    hero_sub:
      "کارت اقامت سرمایه‌گذار عمان (IRC) اقامت بلندمدت با خانواده می‌دهد. سه مسیر: ملک از ۲۵۰,۰۰۰ ریال عمان، سرمایه‌گذاری در شرکت، یا سپرده بانکی.",
    hero_badge: "IRC عمان ۲۰۲۶",
    hero_placeholder: "درباره آستانه و مسیرهای اقامت سرمایه‌گذار عمان بپرسید…",
    stats: [
      { num: "۵ تا ۱۰ سال", label: "مدت اقامت" },
      { num: "۲۵۰K ر.ع.", label: "حداقل ملک" },
      { num: "همسر + فرزند", label: "خانواده شامل" },
      { num: "۰٪", label: "مالیات شخصی" },
    ],
    routes_eyebrow: "مسیرهای واجد شرایط",
    routes_title: "سه راه برای واجد شرایط شدن",
    routes_sub: "مسیری متناسب با هدف و سرمایه خود انتخاب کنید. هر سه به همان کارت IRC منتهی می‌شوند.",
    routes: [
      {
        icon: Home,
        title: "سرمایه‌گذاری ملکی",
        duration: "۵ یا ۱۰ سال",
        threshold: "۲۵۰K (۵ ساله) / ۵۰۰K (۱۰ ساله) ر.ع.",
        notes: "محبوب‌ترین مسیر. ملک باید در مناطق ITC مجاز باشد (Wave، Muscat Hills و…).",
        highlighted: true,
      },
      {
        icon: Briefcase,
        title: "سرمایه‌گذاری در کسب‌وکار",
        duration: "۵ یا ۱۰ سال",
        threshold: "۲۵۰K / ۵۰۰K ر.ع.",
        notes: "سرمایه‌گذاری در شرکت عمانی. ترکیب با خدمات ثبت شرکت ما.",
      },
      {
        icon: Banknote,
        title: "سپرده بانکی",
        duration: "۵ یا ۱۰ سال",
        threshold: "۲۵۰K / ۵۰۰K ر.ع.",
        notes: "سپرده ثابت در بانک عمانی برای مدت اقامت. ساده‌ترین مدارک.",
      },
    ],
    routes_duration_label: "مدت",
    routes_threshold_label: "حداقل",
    benefits_eyebrow: "مزایا",
    benefits_title: "اقامت سرمایه‌گذار عمان چه چیزی باز می‌کند",
    benefits: [
      { title: "اقامت بلندمدت", desc: "اقامت ۵ یا ۱۰ ساله multi-entry برای شما و خانواده." },
      { title: "خانواده شامل", desc: "همسر و فرزندان وابسته در همان سرمایه‌گذاری." },
      { title: "۰٪ مالیات شخصی", desc: "نه بر درآمد، نه سود سرمایه، نه سود سهام، نه ارث." },
      { title: "بانک و مدرسه", desc: "افتتاح حساب، ثبت‌نام مدرسه بین‌المللی، گواهینامه عمانی." },
      { title: "Freehold ملک", desc: "خرید و نگهداری ملک Freehold در ITCهای مجاز، با امکان فروش." },
      { title: "تمدید آسان", desc: "تا زمانی که دارایی واجد شرایط دارید قابل تمدید. حداقل اقامت سختی اجرا نمی‌شود." },
    ],
    steps_title: "فرآیند اقامت سرمایه‌گذار چگونه است",
    steps: [
      { title: "بررسی واجد شرایط بودن", desc: "پروفایل، مسیر (ملک/کسب‌وکار/سپرده) و خانواده شما را بررسی می‌کنیم.", days: "روز ۱ تا ۳" },
      { title: "قرار دادن سرمایه", desc: "خرید ملک، تأمین مالی شرکت یا سپرده بانکی با مدارک صحیح.", days: "روز ۷ تا ۳۰" },
      { title: "درخواست", desc: "درخواست به وزارت بازرگانی و سرمایه‌گذاری (MOCIIP) ارسال می‌شود.", days: "روز ۳۰ تا ۴۵" },
      { title: "صدور کارت", desc: "کارت اقامت ۵ یا ۱۰ ساله برای اصلی + خانواده صادر می‌شود.", days: "روز ۴۵ تا ۶۰" },
    ],
    costs_title: "هزینه واقعی اقامت سرمایه‌گذار",
    costs_intro: "هزینه کل تقریبی برای یک متقاضی از مسیر ملکی. مسیر سپرده و کسب‌وکار ساختار مشابه دارند.",
    costs_disclaimer: "ارقام ۲۰۲۶ تقریبی. هزینه نهایی به تعداد همراهان، مسیر و حوزه قضایی بستگی دارد.",
    cost_groups: [
      {
        title: "مسیر ۵ ساله (ملکی)",
        items: [
          { label: "حداقل ملک", value: "۲۵۰,۰۰۰ ر.ع." },
          { label: "هزینه دولتی", value: "از ۱,۰۰۰ ر.ع." },
          { label: "هزینه خدمات", value: "از ۳,۵۰۰ دلار" },
        ],
      },
      {
        title: "مسیر ۱۰ ساله (ملکی)",
        items: [
          { label: "حداقل ملک", value: "۵۰۰,۰۰۰ ر.ع." },
          { label: "هزینه دولتی", value: "از ۱,۵۰۰ ر.ع." },
          { label: "هزینه خدمات", value: "از ۴,۵۰۰ دلار" },
        ],
      },
      {
        title: "افزونه خانواده",
        items: [
          { label: "همسر", value: "از ۲۰۰ ر.ع." },
          { label: "هر فرزند", value: "از ۲۰۰ ر.ع." },
          { label: "پزشکی و بیمه", value: "از ۱۰۰ ر.ع./نفر" },
        ],
      },
    ],
    faq_title: "اقامت سرمایه‌گذار عمان — پرسش‌های رایج",
    faq_items: [
      { question: "اقامت سرمایه‌گذار چقدر اعتبار دارد؟", answer: "۵ ساله برای ۲۵۰,۰۰۰ ریال؛ ۱۰ ساله برای ۵۰۰,۰۰۰+. هر دو قابل تمدید تا زمانی که دارایی واجد شرایط حفظ شود." },
      { question: "آیا این، تابعیت عمانی می‌دهد؟", answer: "خیر. IRC اقامت بلندمدت است نه تابعیت. تابعیت عمانی فرآیند جدا و سخت‌گیرانه دارد." },
      { question: "آیا باید در عمان زندگی کنم؟", answer: "قانون سختگیرانه حداقل اقامت امروز اجرا نمی‌شود. به‌عنوان رهنمود، بیش از ۶ ماه پیاپی غایب نباشید." },
      { question: "آیا می‌توانم والدین را شامل کنم؟", answer: "معمولاً خیر — فقط همسر و فرزندان وابسته. والدین گاهی با ویزای فامیلی می‌آیند نه روی IRC." },
      { question: "آیا با این اقامت می‌توانم در عمان کار کنم؟", answer: "بله، در شرکت سرمایه‌گذاری‌شده یا با نقش هیئت مدیره. کار محلی نیاز به ویزای کاری از کارفرما دارد." },
      { question: "اگر ملک را بفروشم چه می‌شود؟", answer: "اگر دارایی واجد شرایط زیر آستانه برود، اقامت خودکار تمدید نمی‌شود. می‌توانید قبل از تمدید به مسیر دیگر (کسب‌وکار/سپرده) سوییچ کنید." },
    ],
    crosssell_title: "ترکیب کنید با…",
    crosssell_property_title: "خرید ملک در عمان",
    crosssell_property_desc: "ملک ITC واجد شرایط اقامت پیدا کنید",
    crosssell_company_title: "ثبت شرکت در عمان",
    crosssell_company_desc: "مسیر کسب‌وکار — شرکت + اقامت ترکیب کنید",
    crosssell_uae_title: "گلدن ویزای امارات",
    crosssell_uae_desc: "اقامت ۱۰ ساله امارات را مقایسه کنید",
    lead_title: "ارزیابی امکان‌سنجی اقامت سرمایه‌گذار",
    lead_sub: "مسیر دلخواه و بودجه را بنویسید — ارزیابی و هزینه کل در ۲۴ ساعت می‌رسد.",
  },
  ar: {
    breadcrumb_oman: "عُمان",
    breadcrumb_self: "إقامة المستثمر",
    hero_h1: "إقامة مستثمر عُمان — بطاقة 5 أو 10 سنوات عبر العقار أو الشركة أو الإيداع",
    hero_sub:
      "بطاقة إقامة المستثمر العمانية (IRC) تمنح إقامة طويلة الأمد مع شمول العائلة. ثلاثة مسارات: عقار من 250,000 ر.ع.، أو استثمار في شركة، أو إيداع بنكي.",
    hero_badge: "IRC عُمان 2026",
    hero_placeholder: "اسأل عن حدود ومسارات إقامة المستثمر العمانية…",
    stats: [
      { num: "5 إلى 10 سنوات", label: "مدة الإقامة" },
      { num: "250 ألف ر.ع.", label: "حد العقار" },
      { num: "الزوج والأطفال", label: "تشمل العائلة" },
      { num: "0٪", label: "ضريبة دخل شخصي" },
    ],
    routes_eyebrow: "المسارات المؤهلة",
    routes_title: "ثلاث طرق للحصول على إقامة المستثمر",
    routes_sub: "اختر المسار المناسب لأهدافك ورأسمالك. كل المسارات تؤدي إلى نفس البطاقة.",
    routes: [
      {
        icon: Home,
        title: "استثمار عقاري",
        duration: "5 أو 10 سنوات",
        threshold: "250K (5 سنوات) / 500K (10 سنوات) ر.ع.",
        notes: "الأكثر شعبية. يجب أن يكون العقار في مناطق ITC معتمدة (Wave، Muscat Hills…).",
        highlighted: true,
      },
      {
        icon: Briefcase,
        title: "استثمار في شركة",
        duration: "5 أو 10 سنوات",
        threshold: "250K / 500K ر.ع.",
        notes: "استثمار في شركة عمانية. الأفضل مع خدمة تأسيس شركتنا.",
      },
      {
        icon: Banknote,
        title: "إيداع بنكي",
        duration: "5 أو 10 سنوات",
        threshold: "250K / 500K ر.ع.",
        notes: "إيداع ثابت في بنك عماني طوال مدة الإقامة. أبسط الأوراق.",
      },
    ],
    routes_duration_label: "المدة",
    routes_threshold_label: "الحد الأدنى",
    benefits_eyebrow: "المزايا",
    benefits_title: "ما تفتحه إقامة المستثمر",
    benefits: [
      { title: "إقامة طويلة", desc: "إقامة 5 أو 10 سنوات متعددة الدخول لك ولعائلتك." },
      { title: "شمول العائلة", desc: "الزوج والأبناء المعالون ضمن نفس الاستثمار." },
      { title: "0٪ ضريبة شخصية", desc: "لا ضريبة على الدخل أو الأرباح الرأسمالية أو الموزعة." },
      { title: "حسابات بنكية ومدارس", desc: "افتح حسابات عمانية وسجل الأبناء في المدارس الدولية." },
      { title: "تملك حر للعقار", desc: "تملك عقاراً في ITC معتمد، قابل لإعادة البيع." },
      { title: "تجديد سهل", desc: "قابل للتجديد طالما الأصل المؤهل قائم. لا يوجد حد إقامة صارم اليوم." },
    ],
    steps_title: "كيف تتم عملية إقامة المستثمر",
    steps: [
      { title: "فحص الأهلية", desc: "نراجع ملفك والمسار (عقار/شركة/إيداع) والعائلة.", days: "اليوم 1 إلى 3" },
      { title: "وضع الاستثمار", desc: "شراء العقار، تمويل الشركة أو الإيداع البنكي بالوثائق الصحيحة.", days: "اليوم 7 إلى 30" },
      { title: "التقديم", desc: "تقديم الطلب إلى وزارة التجارة والاستثمار (MOCIIP).", days: "اليوم 30 إلى 45" },
      { title: "إصدار البطاقة", desc: "إصدار البطاقة لـ 5 أو 10 سنوات للمتقدم والعائلة.", days: "اليوم 45 إلى 60" },
    ],
    costs_title: "تكاليف حقيقية لإقامة المستثمر",
    costs_intro: "إجمالي إرشادي لمتقدم واحد عبر العقار. الإيداع والشركة مشابهان في الهيكل.",
    costs_disclaimer: "أرقام إرشادية لـ 2026. الرسوم النهائية حسب عدد المعالين والمسار والولاية.",
    cost_groups: [
      {
        title: "5 سنوات (عقار)",
        items: [
          { label: "حد العقار", value: "250,000 ر.ع." },
          { label: "رسوم حكومية", value: "من 1,000 ر.ع." },
          { label: "رسوم خدمات", value: "من 3,500 دولار" },
        ],
      },
      {
        title: "10 سنوات (عقار)",
        items: [
          { label: "حد العقار", value: "500,000 ر.ع." },
          { label: "رسوم حكومية", value: "من 1,500 ر.ع." },
          { label: "رسوم خدمات", value: "من 4,500 دولار" },
        ],
      },
      {
        title: "إضافات العائلة",
        items: [
          { label: "الزوج", value: "من 200 ر.ع." },
          { label: "كل طفل", value: "من 200 ر.ع." },
          { label: "طبي وتأمين", value: "من 100 ر.ع./شخص" },
        ],
      },
    ],
    faq_title: "إقامة مستثمر عُمان — أسئلة شائعة",
    faq_items: [
      { question: "ما مدة صلاحية الإقامة؟", answer: "5 سنوات لمسار 250 ألف ر.ع.؛ 10 سنوات لمسار 500 ألف+. كلاهما قابل للتجديد طالما الأصل المؤهل قائم." },
      { question: "هل تمنح الجنسية العمانية؟", answer: "لا. الإقامة طويلة وليست جنسية. الجنسية لها إجراءات منفصلة وصارمة." },
      { question: "هل يجب أن أعيش في عُمان؟", answer: "لا توجد قاعدة حد أدنى صارمة. كإرشاد، تجنب الغياب لأكثر من 6 أشهر متواصلة." },
      { question: "هل يمكنني شمول الوالدين؟", answer: "عادة لا — فقط الزوج والأبناء المعالون. الوالدان عبر تأشيرة زيارة عائلية." },
      { question: "هل يمكنني العمل في عُمان بهذه الإقامة؟", answer: "نعم في شركتك المستثمر فيها أو بأدوار إدارية. التوظيف المحلي يتطلب تأشيرة عمل من رب العمل." },
      { question: "ماذا لو بعت العقار؟", answer: "لو نزل الأصل عن الحد، لا يُجدد تلقائياً. يمكن التحول لمسار آخر قبل التجديد." },
    ],
    crosssell_title: "اجمعها مع…",
    crosssell_property_title: "شراء عقار في عُمان",
    crosssell_property_desc: "ابحث عن عقار ITC مؤهل للإقامة",
    crosssell_company_title: "تأسيس شركة في عُمان",
    crosssell_company_desc: "مسار الشركة — اجمع الشركة والإقامة",
    crosssell_uae_title: "الإقامة الذهبية الإمارات",
    crosssell_uae_desc: "قارن مع إقامة 10 سنوات في الإمارات",
    lead_title: "احصل على فحص جدوى لإقامة المستثمر",
    lead_sub: "أخبرنا بمسارك المفضل وميزانيتك — سنرسل الأهلية والتكلفة الإجمالية خلال 24 ساعة.",
  },
  ru: {
    breadcrumb_oman: "Оман",
    breadcrumb_self: "Инвесторский ВНЖ",
    hero_h1: "Инвесторский ВНЖ Омана — карта на 5 или 10 лет через недвижимость, бизнес или депозит",
    hero_sub:
      "Карта инвестора Омана (IRC) даёт долгосрочный ВНЖ с включением семьи. Три маршрута: недвижимость от OMR 250 000, инвестиции в бизнес или банковский депозит.",
    hero_badge: "IRC Оман 2026",
    hero_placeholder: "Спросите про пороги и маршруты инвесторского ВНЖ Омана…",
    stats: [
      { num: "5–10 лет", label: "Срок ВНЖ" },
      { num: "OMR 250K", label: "Минимум недвижимости" },
      { num: "Супруг + дети", label: "Семья включена" },
      { num: "0%", label: "Подоходный налог" },
    ],
    routes_eyebrow: "Подходящие маршруты",
    routes_title: "Три пути к инвесторскому ВНЖ Омана",
    routes_sub: "Выбирайте маршрут под цель и капитал. Все три приводят к одной карте IRC.",
    routes: [
      {
        icon: Home,
        title: "Через недвижимость",
        duration: "5 или 10 лет",
        threshold: "OMR 250K (5 лет) / 500K (10 лет)",
        notes: "Самый популярный путь. Недвижимость должна быть в одобренных ITC (The Wave, Muscat Hills и др.).",
        highlighted: true,
      },
      {
        icon: Briefcase,
        title: "Через бизнес",
        duration: "5 или 10 лет",
        threshold: "OMR 250K / 500K",
        notes: "Инвестиция в оманскую компанию. Лучше всего комбинировать с нашим открытием компании.",
      },
      {
        icon: Banknote,
        title: "Через банковский депозит",
        duration: "5 или 10 лет",
        threshold: "OMR 250K / 500K",
        notes: "Срочный депозит в оманском банке на срок ВНЖ. Самая простая документация.",
      },
    ],
    routes_duration_label: "Срок",
    routes_threshold_label: "Порог",
    benefits_eyebrow: "Преимущества",
    benefits_title: "Что даёт инвесторский ВНЖ Омана",
    benefits: [
      { title: "Долгосрочный ВНЖ", desc: "ВНЖ на 5 или 10 лет с многократным въездом для вас и семьи." },
      { title: "Семья включена", desc: "Супруг и дети-иждивенцы по той же инвестиции." },
      { title: "0% личного налога", desc: "Нет налога на доход, прирост капитала, дивиденды и наследство." },
      { title: "Банк и школа", desc: "Открытие счетов, международные школы, оманские права." },
      { title: "Freehold-недвижимость", desc: "Покупка и владение в одобренных ITC, с правом перепродажи." },
      { title: "Простое продление", desc: "Продлевается пока сохраняется квалифицирующий актив." },
    ],
    steps_title: "Как идёт процесс получения IRC",
    steps: [
      { title: "Проверка приемлемости", desc: "Анализируем профиль, маршрут (недвижимость/бизнес/депозит) и семью.", days: "День 1–3" },
      { title: "Размещение инвестиции", desc: "Покупка недвижимости, финансирование компании или депозит — с правильными документами.", days: "День 7–30" },
      { title: "Подача", desc: "Подача в Министерство торговли и инвестиций (MOCIIP).", days: "День 30–45" },
      { title: "Выдача карты", desc: "Карта IRC на 5 или 10 лет для основного заявителя и семьи.", days: "День 45–60" },
    ],
    costs_title: "Инвесторский ВНЖ — реальные расходы",
    costs_intro: "Ориентировочные суммарные затраты на одного заявителя по маршруту недвижимости. Депозит и бизнес — схожая структура.",
    costs_disclaimer: "Ориентировочные данные на 2026. Финал зависит от числа иждивенцев, маршрута и юрисдикции.",
    cost_groups: [
      {
        title: "5 лет (через недвижимость)",
        items: [
          { label: "Минимум недвижимости", value: "OMR 250 000" },
          { label: "Госпошлина", value: "От OMR 1 000" },
          { label: "Сервисный тариф", value: "От 3 500 $" },
        ],
      },
      {
        title: "10 лет (через недвижимость)",
        items: [
          { label: "Минимум недвижимости", value: "OMR 500 000" },
          { label: "Госпошлина", value: "От OMR 1 500" },
          { label: "Сервисный тариф", value: "От 4 500 $" },
        ],
      },
      {
        title: "Доп. за семью",
        items: [
          { label: "Супруг", value: "От OMR 200" },
          { label: "Каждый ребёнок", value: "От OMR 200" },
          { label: "Мед. + страховка", value: "От OMR 100/чел" },
        ],
      },
    ],
    faq_title: "Инвесторский ВНЖ Омана — FAQ",
    faq_items: [
      { question: "На какой срок действует ВНЖ?", answer: "5 лет — при OMR 250 000; 10 лет — при OMR 500 000+. Оба продлеваются, пока сохраняется квалифицирующий актив." },
      { question: "Это даёт гражданство Омана?", answer: "Нет. IRC — долгосрочный ВНЖ, не гражданство. Гражданство — отдельный долгий процесс с жёсткими критериями." },
      { question: "Нужно ли жить в Омане?", answer: "Жёсткого требования к минимальному пребыванию сегодня нет. Как ориентир — не более 6 месяцев подряд без уведомления." },
      { question: "Можно ли включить родителей?", answer: "Как правило, нет — только супруг и дети-иждивенцы. Родители — по визитовой / семейной визе." },
      { question: "Можно ли работать в Омане с этим ВНЖ?", answer: "Да, в собственной компании или на директорских позициях. Локальное трудоустройство — через рабочую визу от работодателя." },
      { question: "Что если я продам недвижимость?", answer: "Если актив уйдёт ниже порога — продление не происходит автоматически. Можно перейти на другой маршрут до продления." },
    ],
    crosssell_title: "Сочетайте с…",
    crosssell_property_title: "Недвижимость в Омане",
    crosssell_property_desc: "Найдите подходящий объект в ITC",
    crosssell_company_title: "Регистрация компании в Омане",
    crosssell_company_desc: "Бизнес-маршрут — компания + ВНЖ",
    crosssell_uae_title: "Golden Visa ОАЭ",
    crosssell_uae_desc: "Сравните с 10-летним ВНЖ ОАЭ",
    lead_title: "Получите проверку приемлемости IRC",
    lead_sub: "Расскажите про маршрут и бюджет — пришлём оценку и итоговую стоимость в течение 24 часов.",
  },
};

export default function OmanResidencyVisaClient() {
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
      title: c.crosssell_property_title,
      description: c.crosssell_property_desc,
      icon: Building,
      href: linkPath("oman/buy-property/"),
      isHighlighted: true,
    },
    {
      title: c.crosssell_company_title,
      description: c.crosssell_company_desc,
      icon: Building2,
      href: linkPath("oman/company-registration/"),
    },
    {
      title: c.crosssell_uae_title,
      description: c.crosssell_uae_desc,
      icon: Globe2,
      href: linkPath("uae/golden-visa/"),
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <SharedBreadcrumb items={breadcrumbItems} />
        <HeroChat h1={c.hero_h1} sub={c.hero_sub} badge={c.hero_badge} placeholder={c.hero_placeholder} />
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

        {/* Routes */}
        <section className="py-16 bg-surface">
          <div className="max-w-5xl mx-auto px-4">
            <div className="text-center mb-10">
              <p className="text-xs uppercase tracking-wider text-gold mb-2">{c.routes_eyebrow}</p>
              <h2 className="text-2xl md:text-3xl font-bold text-navy mb-3">{c.routes_title}</h2>
              <p className="text-sm text-muted-foreground max-w-2xl mx-auto">{c.routes_sub}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {c.routes.map((r, i) => {
                const Icon = r.icon;
                return (
                  <div
                    key={i}
                    className={`bg-white rounded-2xl p-6 border ${
                      r.highlighted ? "border-2 border-gold shadow-md" : "border-border"
                    }`}
                  >
                    <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center mb-3">
                      <Icon className="w-5 h-5 text-gold" />
                    </div>
                    <h3 className="text-base font-bold text-navy mb-3">{r.title}</h3>
                    <p className="text-xs text-muted-foreground mb-1">
                      <span className="font-semibold text-navy">{c.routes_duration_label}:</span> {r.duration}
                    </p>
                    <p className="text-xs text-muted-foreground mb-3">
                      <span className="font-semibold text-navy">{c.routes_threshold_label}:</span> {r.threshold}
                    </p>
                    <p className="text-xs text-ink leading-relaxed border-t border-border pt-3">{r.notes}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-16 bg-white">
          <div className="max-w-5xl mx-auto px-4">
            <div className="text-center mb-10">
              <p className="text-xs uppercase tracking-wider text-gold mb-2">{c.benefits_eyebrow}</p>
              <h2 className="text-2xl md:text-3xl font-bold text-navy">{c.benefits_title}</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {c.benefits.map((b, i) => (
                <div key={i} className="bg-surface border border-border rounded-xl p-5">
                  <div className="w-10 h-10 rounded-lg bg-navy/5 flex items-center justify-center mb-3">
                    <Users className="w-5 h-5 text-navy" />
                  </div>
                  <h3 className="text-base font-semibold text-navy mb-1">{b.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{b.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Steps */}
        <section className="py-16 bg-surface">
          <div className="max-w-5xl mx-auto px-4">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-navy">{c.steps_title}</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {c.steps.map((s, i) => (
                <div key={i} className="bg-white border border-border rounded-xl p-5">
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
        <section className="py-16 bg-white">
          <div className="max-w-5xl mx-auto px-4">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-navy mb-3">{c.costs_title}</h2>
              <p className="text-sm text-muted-foreground max-w-2xl mx-auto">{c.costs_intro}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {c.cost_groups.map((g, i) => (
                <div key={i} className="bg-surface border border-border rounded-xl p-5">
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
          serviceContext="oman_residency"
          title={c.lead_title}
          subtitle={c.lead_sub}
        />
      </main>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}

