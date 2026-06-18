"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import SharedBreadcrumb from "@/components/shared/SharedBreadcrumb";
import SharedFAQ from "@/components/shared/SharedFAQ";
import SharedCrossSell from "@/components/shared/SharedCrossSell";
import SharedLeadForm from "@/components/shared/SharedLeadForm";
import type { CrossSellItem } from "@/components/shared/SharedCrossSell";
import type { FAQItem } from "@/components/shared/SharedFAQ";
import type { Lang } from "@/translations";
import { motion } from "framer-motion";
import Link from "next/link";
import { Fragment } from "react";
import {
  Scale,
  Landmark,
  IdCard,
  Home,
  Briefcase,
  Compass,
  Globe2,
  Award,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

type Accent = "navy" | "gold";

interface Row {
  label: string;
  uae: string;
  oman: string;
  turkey: string;
}

interface Group {
  category: string;
  icon: typeof Scale;
  rows: Row[];
}

interface CountryCard {
  flag: string;
  name: string;
  tagline: string;
  points: string[];
  cta: string;
  href: string;
  accent: Accent;
}

interface Verdict {
  profile: string;
  pick: string;
  flag: string;
}

interface Content {
  breadcrumb: string;
  hero_badge: string;
  hero_h1: string;
  hero_sub: string;
  hero_updated: string;
  table_eyebrow: string;
  table_title: string;
  headers: { feature: string; uae: string; oman: string; turkey: string };
  groups: Group[];
  table_note: string;
  best_eyebrow: string;
  best_title: string;
  best_sub: string;
  countries: CountryCard[];
  cta_label: string;
  verdict_eyebrow: string;
  verdict_title: string;
  verdicts: Verdict[];
  verdict_pick_label: string;
  faq_title: string;
  faq_items: FAQItem[];
  crosssell_title: string;
  lead_title: string;
  lead_sub: string;
}

const CONTENT: Record<Lang, Content> = {
  en: {
    breadcrumb: "Compare Countries",
    hero_badge: "UAE vs Oman vs Turkey · 2026",
    hero_h1: "UAE, Oman or Turkey — Which Is Right for You?",
    hero_sub:
      "A side-by-side comparison of taxes, residency, property and company setup across the three countries we cover — so you can choose with confidence.",
    hero_updated: "Updated January 2026",
    table_eyebrow: "Side by Side",
    table_title: "The Full Comparison",
    headers: { feature: "Feature", uae: "🇦🇪 UAE", oman: "🇴🇲 Oman", turkey: "🇹🇷 Turkey" },
    groups: [
      {
        category: "Taxation",
        icon: Scale,
        rows: [
          { label: "Personal income tax", uae: "0%", oman: "0%", turkey: "15–40%" },
          { label: "Corporate tax", uae: "9% (over AED 375K)", oman: "15%", turkey: "25%" },
          { label: "VAT", uae: "5%", oman: "5%", turkey: "20%" },
          { label: "Capital gains tax", uae: "0%", oman: "0%", turkey: "0% if held 5+ yrs" },
        ],
      },
      {
        category: "Residency & Citizenship",
        icon: IdCard,
        rows: [
          { label: "Main pathway", uae: "10-Year Golden Visa", oman: "Investor Residency", turkey: "Citizenship by Investment" },
          { label: "Residency term", uae: "2–10 years", oman: "5–10 years", turkey: "Permanent (citizen)" },
          { label: "Route to citizenship", uae: "Discretionary", oman: "After ~20 years", turkey: "3–6 months (direct)" },
          { label: "Family included", uae: "Yes", oman: "Yes", turkey: "Yes" },
        ],
      },
      {
        category: "Property Ownership",
        icon: Home,
        rows: [
          { label: "Foreign freehold ownership", uae: "100% (designated zones)", oman: "100% (ITC zones)", turkey: "100%" },
          { label: "Min for investor visa", uae: "AED 750,000", oman: "OMR 250,000", turkey: "$200,000" },
          { label: "Min for citizenship", uae: "—", oman: "—", turkey: "$400,000" },
          { label: "Avg. rental yield", uae: "6–8%", oman: "6–7%", turkey: "5–7%" },
        ],
      },
      {
        category: "Company Setup",
        icon: Briefcase,
        rows: [
          { label: "Foreign ownership", uae: "100%", oman: "100% (free zone)", turkey: "100%" },
          { label: "Setup time", uae: "7–10 days", oman: "2–4 weeks", turkey: "1–2 weeks" },
          { label: "Setup cost from", uae: "AED 11,900", oman: "Get Quote", turkey: "~$3,000" },
          { label: "Local sponsor needed", uae: "No", oman: "No", turkey: "No" },
        ],
      },
      {
        category: "Lifestyle & Mobility",
        icon: Compass,
        rows: [
          { label: "Passport visa-free", uae: "Residency only", oman: "Residency only", turkey: "110+ countries" },
          { label: "Currency", uae: "AED (USD-pegged)", oman: "OMR (USD-pegged)", turkey: "TRY (floating)" },
          { label: "Main language", uae: "Arabic / English", oman: "Arabic", turkey: "Turkish" },
          { label: "Processing time", uae: "7–10 days", oman: "2–4 weeks", turkey: "3–6 months" },
        ],
      },
    ],
    table_note: "Figures are indicative and based on 2026 regulations. Government fees and thresholds change — confirm with our advisors before deciding.",
    best_eyebrow: "At a Glance",
    best_title: "Who Each Country Is Best For",
    best_sub: "Different goals call for different destinations. Here's the short version.",
    countries: [
      {
        flag: "🇦🇪",
        name: "UAE",
        tagline: "International business & fast residency",
        points: [
          "0% personal income tax & world-class banking",
          "10-year Golden Visa, fully self-sponsored",
          "Company set up in 7–10 days, 100% owned",
          "Global hub with the world's busiest airport",
        ],
        cta: "Explore UAE services",
        href: "uae/",
        accent: "navy",
      },
      {
        flag: "🇴🇲",
        name: "Oman",
        tagline: "Lower cost & a calmer lifestyle",
        points: [
          "0% personal income tax",
          "Investor Residency from OMR 250,000",
          "Lower living & setup costs than Dubai",
          "Untouched nature, beaches & high safety",
        ],
        cta: "Explore Oman services",
        href: "oman/",
        accent: "gold",
      },
      {
        flag: "🇹🇷",
        name: "Turkey",
        tagline: "Second passport & citizenship",
        points: [
          "Citizenship in 3–6 months from $400,000",
          "Passport visa-free to 110+ countries",
          "A bridge between Europe & Asia",
          "Deep property market — Istanbul & Antalya",
        ],
        cta: "Explore Turkey services",
        href: "turkey/",
        accent: "gold",
      },
    ],
    cta_label: "Explore services",
    verdict_eyebrow: "Quick Verdict",
    verdict_title: "Which One Should You Choose?",
    verdicts: [
      { profile: "You want fast residency and to run a business tax-free", pick: "UAE", flag: "🇦🇪" },
      { profile: "You want lower costs and a quieter, slower lifestyle", pick: "Oman", flag: "🇴🇲" },
      { profile: "You want a second passport and visa-free travel", pick: "Turkey", flag: "🇹🇷" },
    ],
    verdict_pick_label: "Best choice",
    faq_title: "Comparison FAQ",
    faq_items: [
      {
        question: "Which country has the lowest taxes?",
        answer:
          "The UAE and Oman both levy 0% personal income tax, making them the clear winners for tax efficiency. Turkey taxes personal income at 15–40%, but it's the only one of the three that offers a second passport.",
      },
      {
        question: "Which is the only one offering a second passport?",
        answer:
          "Turkey. It's the sole country of the three with a direct citizenship-by-investment programme — typically a $400,000 property purchase leads to a passport in 3–6 months. The UAE and Oman offer long-term residency, not fast-track citizenship.",
      },
      {
        question: "Which country is the fastest to set up in?",
        answer:
          "The UAE — a company and Golden Visa can be processed in roughly 7–10 days. Turkey's company setup takes 1–2 weeks (citizenship 3–6 months), while Oman typically takes 2–4 weeks.",
      },
      {
        question: "Which is the cheapest option overall?",
        answer:
          "Oman generally has lower living and business-setup costs than Dubai, which makes it attractive for a calmer, budget-conscious move. The UAE is fastest and most globally connected; Turkey is the most affordable route to an actual passport.",
      },
      {
        question: "Can foreigners fully own property in all three?",
        answer:
          "Yes. Foreigners can own property freehold in all three countries — within Dubai's designated zones, Oman's Integrated Tourism Complex (ITC) zones, and across most of Turkey — with 100% ownership in their own name.",
      },
    ],
    crosssell_title: "Explore Each Country in Detail",
    lead_title: "Not Sure Which Country Fits You?",
    lead_sub: "Tell us your goal and budget — we'll send a tailored recommendation across all three countries within 24 hours.",
  },

  fa: {
    breadcrumb: "مقایسه کشورها",
    hero_badge: "امارات در برابر عمان و ترکیه · ۲۰۲۶",
    hero_h1: "امارات، عمان یا ترکیه — کدام برای شما مناسب است؟",
    hero_sub:
      "مقایسه‌ی نقطه‌به‌نقطه‌ی مالیات، اقامت، ملک و ثبت شرکت در سه کشوری که خدمات می‌دهیم — تا با اطمینان انتخاب کنید.",
    hero_updated: "به‌روزرسانی ژانویه ۲۰۲۶",
    table_eyebrow: "مقایسه‌ی مستقیم",
    table_title: "مقایسه‌ی کامل",
    headers: { feature: "ویژگی", uae: "🇦🇪 امارات", oman: "🇴🇲 عمان", turkey: "🇹🇷 ترکیه" },
    groups: [
      {
        category: "مالیات",
        icon: Scale,
        rows: [
          { label: "مالیات بر درآمد شخصی", uae: "۰٪", oman: "۰٪", turkey: "۱۵–۴۰٪" },
          { label: "مالیات شرکتی", uae: "۹٪ (بالای ۳۷۵K درهم)", oman: "۱۵٪", turkey: "۲۵٪" },
          { label: "مالیات بر ارزش افزوده", uae: "۵٪", oman: "۵٪", turkey: "۲۰٪" },
          { label: "مالیات بر عایدی سرمایه", uae: "۰٪", oman: "۰٪", turkey: "۰٪ با نگهداری ۵+ سال" },
        ],
      },
      {
        category: "اقامت و شهروندی",
        icon: IdCard,
        rows: [
          { label: "مسیر اصلی", uae: "گلدن ویزای ۱۰ ساله", oman: "اقامت سرمایه‌گذاری", turkey: "شهروندی با سرمایه‌گذاری" },
          { label: "مدت اقامت", uae: "۲–۱۰ سال", oman: "۵–۱۰ سال", turkey: "دائم (شهروند)" },
          { label: "مسیر شهروندی", uae: "موردی و نادر", oman: "پس از حدود ۲۰ سال", turkey: "۳–۶ ماه (مستقیم)" },
          { label: "شامل خانواده", uae: "بله", oman: "بله", turkey: "بله" },
        ],
      },
      {
        category: "مالکیت ملک",
        icon: Home,
        rows: [
          { label: "مالکیت کامل خارجی", uae: "۱۰۰٪ (مناطق مجاز)", oman: "۱۰۰٪ (مناطق ITC)", turkey: "۱۰۰٪" },
          { label: "حداقل برای ویزای سرمایه‌گذاری", uae: "۷۵۰,۰۰۰ درهم", oman: "۲۵۰,۰۰۰ ریال عمان", turkey: "۲۰۰,۰۰۰ دلار" },
          { label: "حداقل برای شهروندی", uae: "—", oman: "—", turkey: "۴۰۰,۰۰۰ دلار" },
          { label: "میانگین بازده اجاره", uae: "۶–۸٪", oman: "۶–۷٪", turkey: "۵–۷٪" },
        ],
      },
      {
        category: "ثبت شرکت",
        icon: Briefcase,
        rows: [
          { label: "مالکیت خارجی", uae: "۱۰۰٪", oman: "۱۰۰٪ (فری‌زون)", turkey: "۱۰۰٪" },
          { label: "زمان ثبت", uae: "۷–۱۰ روز", oman: "۲–۴ هفته", turkey: "۱–۲ هفته" },
          { label: "هزینه ثبت از", uae: "۱۱,۹۰۰ درهم", oman: "استعلام قیمت", turkey: "حدود ۳,۰۰۰ دلار" },
          { label: "نیاز به شریک محلی", uae: "خیر", oman: "خیر", turkey: "خیر" },
        ],
      },
      {
        category: "سبک زندگی و تحرک",
        icon: Compass,
        rows: [
          { label: "سفر بدون ویزا با پاسپورت", uae: "فقط اقامت", oman: "فقط اقامت", turkey: "+۱۱۰ کشور" },
          { label: "ارز", uae: "درهم (ثابت به دلار)", oman: "ریال عمان (ثابت به دلار)", turkey: "لیر (شناور)" },
          { label: "زبان اصلی", uae: "عربی / انگلیسی", oman: "عربی", turkey: "ترکی" },
          { label: "زمان پردازش", uae: "۷–۱۰ روز", oman: "۲–۴ هفته", turkey: "۳–۶ ماه" },
        ],
      },
    ],
    table_note: "ارقام تقریبی و بر اساس قوانین ۲۰۲۶ است. هزینه‌ها و آستانه‌های دولتی تغییر می‌کنند — پیش از تصمیم با مشاوران ما تأیید بگیرید.",
    best_eyebrow: "در یک نگاه",
    best_title: "هر کشور برای چه کسی مناسب است",
    best_sub: "هدف‌های متفاوت، مقصدهای متفاوت. این هم نسخه‌ی کوتاه.",
    countries: [
      {
        flag: "🇦🇪",
        name: "امارات",
        tagline: "کسب‌وکار بین‌المللی و اقامت سریع",
        points: [
          "مالیات ۰٪ بر درآمد شخصی و بانکداری در سطح جهانی",
          "گلدن ویزای ۱۰ ساله، کاملاً بدون کفیل",
          "ثبت شرکت در ۷–۱۰ روز با مالکیت ۱۰۰٪",
          "هاب جهانی با شلوغ‌ترین فرودگاه دنیا",
        ],
        cta: "خدمات امارات",
        href: "uae/",
        accent: "navy",
      },
      {
        flag: "🇴🇲",
        name: "عمان",
        tagline: "هزینه کمتر و زندگی آرام‌تر",
        points: [
          "مالیات ۰٪ بر درآمد شخصی",
          "اقامت سرمایه‌گذاری از ۲۵۰,۰۰۰ ریال عمان",
          "هزینه‌ی زندگی و ثبت کمتر از دبی",
          "طبیعت بکر، سواحل و امنیت بالا",
        ],
        cta: "خدمات عمان",
        href: "oman/",
        accent: "gold",
      },
      {
        flag: "🇹🇷",
        name: "ترکیه",
        tagline: "پاسپورت دوم و شهروندی",
        points: [
          "شهروندی در ۳–۶ ماه از ۴۰۰,۰۰۰ دلار",
          "سفر بدون ویزا به بیش از ۱۱۰ کشور",
          "پلی میان اروپا و آسیا",
          "بازار بزرگ ملک — استانبول و آنتالیا",
        ],
        cta: "خدمات ترکیه",
        href: "turkey/",
        accent: "gold",
      },
    ],
    cta_label: "مشاهده خدمات",
    verdict_eyebrow: "جمع‌بندی سریع",
    verdict_title: "کدام را انتخاب کنید؟",
    verdicts: [
      { profile: "اقامت سریع و کسب‌وکار بدون مالیات می‌خواهید", pick: "امارات", flag: "🇦🇪" },
      { profile: "هزینه کمتر و زندگی آرام‌تر می‌خواهید", pick: "عمان", flag: "🇴🇲" },
      { profile: "پاسپورت دوم و سفر بدون ویزا می‌خواهید", pick: "ترکیه", flag: "🇹🇷" },
    ],
    verdict_pick_label: "بهترین انتخاب",
    faq_title: "سوالات متداول مقایسه",
    faq_items: [
      {
        question: "کدام کشور کمترین مالیات را دارد؟",
        answer:
          "امارات و عمان هر دو مالیات ۰٪ بر درآمد شخصی دارند و از نظر مالیاتی برنده‌اند. ترکیه درآمد شخصی را ۱۵–۴۰٪ مالیات می‌گیرد، اما تنها کشوری است که پاسپورت دوم ارائه می‌دهد.",
      },
      {
        question: "کدام تنها گزینه برای پاسپورت دوم است؟",
        answer:
          "ترکیه. تنها کشور از این سه با برنامه‌ی مستقیم شهروندی از طریق سرمایه‌گذاری است — معمولاً خرید ملک ۴۰۰,۰۰۰ دلاری در ۳–۶ ماه به پاسپورت می‌رسد. امارات و عمان اقامت بلندمدت می‌دهند، نه شهروندی سریع.",
      },
      {
        question: "ثبت در کدام کشور سریع‌تر است؟",
        answer:
          "امارات — ثبت شرکت و گلدن ویزا تقریباً در ۷–۱۰ روز انجام می‌شود. ثبت شرکت در ترکیه ۱–۲ هفته (شهروندی ۳–۶ ماه) و در عمان معمولاً ۲–۴ هفته طول می‌کشد.",
      },
      {
        question: "ارزان‌ترین گزینه کدام است؟",
        answer:
          "عمان عموماً هزینه‌ی زندگی و ثبت کسب‌وکار کمتری نسبت به دبی دارد و برای مهاجرت آرام و کم‌هزینه جذاب است. امارات سریع‌ترین و متصل‌ترین است؛ ترکیه مقرون‌به‌صرفه‌ترین مسیر برای رسیدن به یک پاسپورت واقعی است.",
      },
      {
        question: "آیا خارجی‌ها در هر سه کشور مالکیت کامل ملک دارند؟",
        answer:
          "بله. خارجی‌ها می‌توانند در هر سه کشور مالکیت کامل ملک داشته باشند — در مناطق مجاز دبی، مناطق ITC عمان و بیشتر مناطق ترکیه — با مالکیت ۱۰۰٪ به نام خودشان.",
      },
    ],
    crosssell_title: "هر کشور را با جزئیات ببینید",
    lead_title: "مطمئن نیستید کدام کشور مناسب شماست؟",
    lead_sub: "هدف و بودجه‌تان را بگویید — ظرف ۲۴ ساعت پیشنهادی متناسب برای هر سه کشور می‌فرستیم.",
  },

  ar: {
    breadcrumb: "مقارنة الدول",
    hero_badge: "الإمارات مقابل عُمان وتركيا · ٢٠٢٦",
    hero_h1: "الإمارات أم عُمان أم تركيا — أيها الأنسب لك؟",
    hero_sub:
      "مقارنة مباشرة للضرائب والإقامة والعقارات وتأسيس الشركات في الدول الثلاث التي نخدمها — لتختار بثقة.",
    hero_updated: "محدّث يناير ٢٠٢٦",
    table_eyebrow: "مقارنة مباشرة",
    table_title: "المقارنة الكاملة",
    headers: { feature: "العنصر", uae: "🇦🇪 الإمارات", oman: "🇴🇲 عُمان", turkey: "🇹🇷 تركيا" },
    groups: [
      {
        category: "الضرائب",
        icon: Scale,
        rows: [
          { label: "ضريبة الدخل الشخصي", uae: "٠٪", oman: "٠٪", turkey: "١٥–٤٠٪" },
          { label: "ضريبة الشركات", uae: "٩٪ (فوق ٣٧٥ ألف درهم)", oman: "١٥٪", turkey: "٢٥٪" },
          { label: "ضريبة القيمة المضافة", uae: "٥٪", oman: "٥٪", turkey: "٢٠٪" },
          { label: "ضريبة الأرباح الرأسمالية", uae: "٠٪", oman: "٠٪", turkey: "٠٪ بحيازة ٥+ سنوات" },
        ],
      },
      {
        category: "الإقامة والجنسية",
        icon: IdCard,
        rows: [
          { label: "المسار الرئيسي", uae: "تأشيرة ذهبية ١٠ سنوات", oman: "إقامة مستثمر", turkey: "جنسية بالاستثمار" },
          { label: "مدة الإقامة", uae: "٢–١٠ سنوات", oman: "٥–١٠ سنوات", turkey: "دائمة (مواطن)" },
          { label: "مسار الجنسية", uae: "استثنائي ونادر", oman: "بعد نحو ٢٠ سنة", turkey: "٣–٦ أشهر (مباشر)" },
          { label: "تشمل العائلة", uae: "نعم", oman: "نعم", turkey: "نعم" },
        ],
      },
      {
        category: "ملكية العقارات",
        icon: Home,
        rows: [
          { label: "ملكية أجنبية كاملة", uae: "١٠٠٪ (المناطق المحددة)", oman: "١٠٠٪ (مناطق ITC)", turkey: "١٠٠٪" },
          { label: "الحد الأدنى لتأشيرة المستثمر", uae: "٧٥٠,٠٠٠ درهم", oman: "٢٥٠,٠٠٠ ريال عماني", turkey: "٢٠٠,٠٠٠ دولار" },
          { label: "الحد الأدنى للجنسية", uae: "—", oman: "—", turkey: "٤٠٠,٠٠٠ دولار" },
          { label: "متوسط العائد الإيجاري", uae: "٦–٨٪", oman: "٦–٧٪", turkey: "٥–٧٪" },
        ],
      },
      {
        category: "تأسيس الشركات",
        icon: Briefcase,
        rows: [
          { label: "الملكية الأجنبية", uae: "١٠٠٪", oman: "١٠٠٪ (منطقة حرة)", turkey: "١٠٠٪" },
          { label: "مدة التأسيس", uae: "٧–١٠ أيام", oman: "٢–٤ أسابيع", turkey: "١–٢ أسبوع" },
          { label: "تكلفة التأسيس من", uae: "١١,٩٠٠ درهم", oman: "اطلب عرض سعر", turkey: "نحو ٣,٠٠٠ دولار" },
          { label: "الحاجة لكفيل محلي", uae: "لا", oman: "لا", turkey: "لا" },
        ],
      },
      {
        category: "نمط الحياة والتنقل",
        icon: Compass,
        rows: [
          { label: "سفر بدون تأشيرة بالجواز", uae: "إقامة فقط", oman: "إقامة فقط", turkey: "+١١٠ دولة" },
          { label: "العملة", uae: "درهم (مربوط بالدولار)", oman: "ريال عماني (مربوط بالدولار)", turkey: "ليرة (متغيرة)" },
          { label: "اللغة الرئيسية", uae: "العربية / الإنجليزية", oman: "العربية", turkey: "التركية" },
          { label: "مدة المعالجة", uae: "٧–١٠ أيام", oman: "٢–٤ أسابيع", turkey: "٣–٦ أشهر" },
        ],
      },
    ],
    table_note: "الأرقام تقريبية وتستند إلى أنظمة ٢٠٢٦. تتغير الرسوم والحدود الحكومية — تأكد مع مستشارينا قبل اتخاذ القرار.",
    best_eyebrow: "لمحة سريعة",
    best_title: "لمن تناسب كل دولة",
    best_sub: "أهداف مختلفة تعني وجهات مختلفة. إليك النسخة المختصرة.",
    countries: [
      {
        flag: "🇦🇪",
        name: "الإمارات",
        tagline: "أعمال دولية وإقامة سريعة",
        points: [
          "ضريبة دخل شخصي ٠٪ وقطاع مصرفي عالمي",
          "تأشيرة ذهبية ١٠ سنوات بدون كفيل تماماً",
          "تأسيس شركة في ٧–١٠ أيام بملكية ١٠٠٪",
          "مركز عالمي يضم أكثر المطارات ازدحاماً",
        ],
        cta: "خدمات الإمارات",
        href: "uae/",
        accent: "navy",
      },
      {
        flag: "🇴🇲",
        name: "عُمان",
        tagline: "تكلفة أقل ونمط حياة أهدأ",
        points: [
          "ضريبة دخل شخصي ٠٪",
          "إقامة مستثمر من ٢٥٠,٠٠٠ ريال عماني",
          "تكاليف معيشة وتأسيس أقل من دبي",
          "طبيعة بكر وشواطئ وأمان مرتفع",
        ],
        cta: "خدمات عُمان",
        href: "oman/",
        accent: "gold",
      },
      {
        flag: "🇹🇷",
        name: "تركيا",
        tagline: "جواز سفر ثانٍ وجنسية",
        points: [
          "جنسية في ٣–٦ أشهر من ٤٠٠,٠٠٠ دولار",
          "سفر بدون تأشيرة لأكثر من ١١٠ دولة",
          "جسر بين أوروبا وآسيا",
          "سوق عقاري كبير — إسطنبول وأنطاليا",
        ],
        cta: "خدمات تركيا",
        href: "turkey/",
        accent: "gold",
      },
    ],
    cta_label: "عرض الخدمات",
    verdict_eyebrow: "الخلاصة السريعة",
    verdict_title: "أيها تختار؟",
    verdicts: [
      { profile: "تريد إقامة سريعة وإدارة أعمال بدون ضرائب", pick: "الإمارات", flag: "🇦🇪" },
      { profile: "تريد تكلفة أقل ونمط حياة أهدأ", pick: "عُمان", flag: "🇴🇲" },
      { profile: "تريد جواز سفر ثانياً وسفراً بدون تأشيرة", pick: "تركيا", flag: "🇹🇷" },
    ],
    verdict_pick_label: "الخيار الأفضل",
    faq_title: "أسئلة شائعة عن المقارنة",
    faq_items: [
      {
        question: "أي دولة لديها أقل الضرائب؟",
        answer:
          "الإمارات وعُمان تفرضان ضريبة دخل شخصي ٠٪، وهما الأفضل من حيث الكفاءة الضريبية. تركيا تفرض ضريبة دخل شخصي ١٥–٤٠٪، لكنها الوحيدة التي تمنح جواز سفر ثانياً.",
      },
      {
        question: "أي دولة تمنح جواز سفر ثانياً فقط؟",
        answer:
          "تركيا. هي الوحيدة من الثلاث التي لديها برنامج جنسية مباشر بالاستثمار — عادةً شراء عقار بـ ٤٠٠,٠٠٠ دولار يؤدي إلى جواز سفر خلال ٣–٦ أشهر. الإمارات وعُمان تمنحان إقامة طويلة لا جنسية سريعة.",
      },
      {
        question: "أي دولة أسرع في التأسيس؟",
        answer:
          "الإمارات — يمكن إنهاء الشركة والتأشيرة الذهبية في نحو ٧–١٠ أيام. تأسيس الشركة في تركيا يستغرق ١–٢ أسبوع (الجنسية ٣–٦ أشهر)، بينما عُمان عادةً ٢–٤ أسابيع.",
      },
      {
        question: "أي خيار هو الأرخص إجمالاً؟",
        answer:
          "عُمان عموماً تكاليف معيشتها وتأسيس أعمالها أقل من دبي، ما يجعلها جذابة للانتقال الهادئ والمدروس مالياً. الإمارات الأسرع والأكثر اتصالاً عالمياً؛ تركيا أكثر المسارات اقتصاداً للحصول على جواز سفر فعلي.",
      },
      {
        question: "هل يملك الأجانب العقارات بالكامل في الدول الثلاث؟",
        answer:
          "نعم. يمكن للأجانب تملّك العقارات بالكامل في الدول الثلاث — ضمن المناطق المحددة في دبي، ومناطق ITC في عُمان، ومعظم مناطق تركيا — بملكية ١٠٠٪ بأسمائهم.",
      },
    ],
    crosssell_title: "استكشف كل دولة بالتفصيل",
    lead_title: "لست متأكداً أي دولة تناسبك؟",
    lead_sub: "أخبرنا بهدفك وميزانيتك — وسنرسل توصية مخصصة عبر الدول الثلاث خلال ٢٤ ساعة.",
  },

  ru: {
    breadcrumb: "Сравнение стран",
    hero_badge: "ОАЭ против Омана и Турции · 2026",
    hero_h1: "ОАЭ, Оман или Турция — что подходит именно вам?",
    hero_sub:
      "Прямое сравнение налогов, ВНЖ, недвижимости и регистрации компаний в трёх странах, с которыми мы работаем — чтобы вы выбрали уверенно.",
    hero_updated: "Обновлено в январе 2026",
    table_eyebrow: "Прямое сравнение",
    table_title: "Полное сравнение",
    headers: { feature: "Параметр", uae: "🇦🇪 ОАЭ", oman: "🇴🇲 Оман", turkey: "🇹🇷 Турция" },
    groups: [
      {
        category: "Налоги",
        icon: Scale,
        rows: [
          { label: "Подоходный налог", uae: "0%", oman: "0%", turkey: "15–40%" },
          { label: "Налог на прибыль", uae: "9% (свыше 375K AED)", oman: "15%", turkey: "25%" },
          { label: "НДС", uae: "5%", oman: "5%", turkey: "20%" },
          { label: "Налог на прирост капитала", uae: "0%", oman: "0%", turkey: "0% при владении 5+ лет" },
        ],
      },
      {
        category: "ВНЖ и гражданство",
        icon: IdCard,
        rows: [
          { label: "Основной путь", uae: "Золотая виза на 10 лет", oman: "ВНЖ инвестора", turkey: "Гражданство за инвестиции" },
          { label: "Срок ВНЖ", uae: "2–10 лет", oman: "5–10 лет", turkey: "Бессрочно (гражданин)" },
          { label: "Путь к гражданству", uae: "На усмотрение", oman: "Через ~20 лет", turkey: "3–6 месяцев (напрямую)" },
          { label: "Семья включена", uae: "Да", oman: "Да", turkey: "Да" },
        ],
      },
      {
        category: "Недвижимость",
        icon: Home,
        rows: [
          { label: "Полное владение для иностранцев", uae: "100% (спец. зоны)", oman: "100% (зоны ITC)", turkey: "100%" },
          { label: "Минимум для визы инвестора", uae: "750 000 AED", oman: "250 000 OMR", turkey: "$200 000" },
          { label: "Минимум для гражданства", uae: "—", oman: "—", turkey: "$400 000" },
          { label: "Средняя доходность аренды", uae: "6–8%", oman: "6–7%", turkey: "5–7%" },
        ],
      },
      {
        category: "Регистрация компании",
        icon: Briefcase,
        rows: [
          { label: "Иностранное владение", uae: "100%", oman: "100% (СЭЗ)", turkey: "100%" },
          { label: "Срок регистрации", uae: "7–10 дней", oman: "2–4 недели", turkey: "1–2 недели" },
          { label: "Стоимость регистрации от", uae: "11 900 AED", oman: "По запросу", turkey: "~$3 000" },
          { label: "Нужен местный партнёр", uae: "Нет", oman: "Нет", turkey: "Нет" },
        ],
      },
      {
        category: "Образ жизни и мобильность",
        icon: Compass,
        rows: [
          { label: "Безвизовый паспорт", uae: "Только ВНЖ", oman: "Только ВНЖ", turkey: "110+ стран" },
          { label: "Валюта", uae: "AED (привязан к USD)", oman: "OMR (привязан к USD)", turkey: "TRY (плавающий)" },
          { label: "Основной язык", uae: "Арабский / английский", oman: "Арабский", turkey: "Турецкий" },
          { label: "Срок оформления", uae: "7–10 дней", oman: "2–4 недели", turkey: "3–6 месяцев" },
        ],
      },
    ],
    table_note: "Цифры ориентировочные и основаны на правилах 2026 года. Госпошлины и пороги меняются — уточняйте у наших консультантов перед решением.",
    best_eyebrow: "Кратко",
    best_title: "Кому подходит каждая страна",
    best_sub: "Разные цели — разные направления. Вот короткая версия.",
    countries: [
      {
        flag: "🇦🇪",
        name: "ОАЭ",
        tagline: "Международный бизнес и быстрый ВНЖ",
        points: [
          "0% подоходного налога и банкинг мирового уровня",
          "Золотая виза на 10 лет без спонсора",
          "Компания за 7–10 дней, 100% владение",
          "Глобальный хаб с самым загруженным аэропортом",
        ],
        cta: "Услуги в ОАЭ",
        href: "uae/",
        accent: "navy",
      },
      {
        flag: "🇴🇲",
        name: "Оман",
        tagline: "Ниже расходы и спокойный образ жизни",
        points: [
          "0% подоходного налога",
          "ВНЖ инвестора от 250 000 OMR",
          "Расходы на жизнь и бизнес ниже, чем в Дубае",
          "Нетронутая природа, пляжи и безопасность",
        ],
        cta: "Услуги в Омане",
        href: "oman/",
        accent: "gold",
      },
      {
        flag: "🇹🇷",
        name: "Турция",
        tagline: "Второй паспорт и гражданство",
        points: [
          "Гражданство за 3–6 месяцев от $400 000",
          "Безвизовый въезд в 110+ стран",
          "Мост между Европой и Азией",
          "Большой рынок недвижимости — Стамбул и Анталья",
        ],
        cta: "Услуги в Турции",
        href: "turkey/",
        accent: "gold",
      },
    ],
    cta_label: "Смотреть услуги",
    verdict_eyebrow: "Быстрый вывод",
    verdict_title: "Что выбрать?",
    verdicts: [
      { profile: "Нужен быстрый ВНЖ и бизнес без налогов", pick: "ОАЭ", flag: "🇦🇪" },
      { profile: "Нужны меньшие расходы и спокойная жизнь", pick: "Оман", flag: "🇴🇲" },
      { profile: "Нужен второй паспорт и безвизовые поездки", pick: "Турция", flag: "🇹🇷" },
    ],
    verdict_pick_label: "Лучший выбор",
    faq_title: "Частые вопросы о сравнении",
    faq_items: [
      {
        question: "В какой стране самые низкие налоги?",
        answer:
          "В ОАЭ и Омане подоходный налог 0% — это лучшие варианты по налоговой эффективности. В Турции подоходный налог 15–40%, но это единственная из трёх стран, дающая второй паспорт.",
      },
      {
        question: "Какая страна даёт второй паспорт?",
        answer:
          "Турция. Это единственная из трёх стран с прямой программой гражданства за инвестиции — обычно покупка недвижимости на $400 000 даёт паспорт за 3–6 месяцев. ОАЭ и Оман предлагают долгосрочный ВНЖ, а не быстрое гражданство.",
      },
      {
        question: "Где быстрее всего оформиться?",
        answer:
          "В ОАЭ — компанию и Золотую визу можно оформить примерно за 7–10 дней. Регистрация компании в Турции занимает 1–2 недели (гражданство 3–6 месяцев), в Омане обычно 2–4 недели.",
      },
      {
        question: "Какой вариант самый бюджетный?",
        answer:
          "У Омана обычно ниже расходы на жизнь и регистрацию бизнеса, чем в Дубае, что удобно для спокойного и экономного переезда. ОАЭ — самые быстрые и связанные с миром; Турция — самый доступный путь к реальному паспорту.",
      },
      {
        question: "Могут ли иностранцы полностью владеть недвижимостью во всех трёх?",
        answer:
          "Да. Иностранцы могут владеть недвижимостью на правах собственности во всех трёх странах — в специальных зонах Дубая, зонах ITC Омана и на большей части Турции — со 100% владением на своё имя.",
      },
    ],
    crosssell_title: "Изучите каждую страну подробнее",
    lead_title: "Не уверены, какая страна вам подходит?",
    lead_sub: "Расскажите о цели и бюджете — в течение 24 часов пришлём индивидуальную рекомендацию по всем трём странам.",
  },
};

export default function CompareCountriesClient() {
  const { lang, isRTL } = useLanguage();
  const c = CONTENT[lang];
  const lp = (path: string) => (lang === "en" ? `/${path}` : `/${lang}/${path}`);
  const homeHref = lang === "en" ? "/" : `/${lang}/`;
  const Arrow = ArrowRight;

  const breadcrumbItems = [
    { label: "Residency24", href: homeHref },
    { label: c.breadcrumb },
  ];

  const crossSellItems: CrossSellItem[] = [
    { title: c.countries[0].name, description: c.countries[0].tagline, icon: Landmark, href: lp("uae/"), isHighlighted: true },
    { title: c.countries[1].name, description: c.countries[1].tagline, icon: Globe2, href: lp("oman/") },
    { title: c.countries[2].name, description: c.countries[2].tagline, icon: Award, href: lp("turkey/") },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <SharedBreadcrumb items={breadcrumbItems} />

        {/* Hero */}
        <section className="relative overflow-hidden bg-navy text-white">
          <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(circle_at_top_right,_hsl(var(--gold))_0,_transparent_45%)]" />
          <div className="relative max-w-5xl mx-auto px-4 py-16 md:py-20 text-center">
            <span className="inline-block text-xs font-semibold text-gold tracking-[0.14em] uppercase mb-4">
              {c.hero_badge}
            </span>
            <h1 className="text-3xl md:text-[44px] leading-tight font-bold mb-4">{c.hero_h1}</h1>
            <p className="text-base md:text-lg text-white/75 max-w-3xl mx-auto mb-6">{c.hero_sub}</p>
            <div className="flex items-center justify-center gap-6 text-4xl md:text-5xl mb-5">
              <span>🇦🇪</span>
              <span className="text-white/30 text-2xl">·</span>
              <span>🇴🇲</span>
              <span className="text-white/30 text-2xl">·</span>
              <span>🇹🇷</span>
            </div>
            <p className="text-xs text-white/50">{c.hero_updated}</p>
          </div>
        </section>

        {/* Comparison table */}
        <section className="py-16 bg-surface">
          <div className="max-w-5xl mx-auto px-4">
            <div className="text-center mb-10">
              <p className="text-xs uppercase tracking-wider text-gold mb-2">{c.table_eyebrow}</p>
              <h2 className="text-2xl md:text-3xl font-bold text-navy">{c.table_title}</h2>
            </div>

            <div className="overflow-x-auto rounded-xl border border-border bg-white shadow-sm">
              <table className="w-full text-sm min-w-[640px]">
                <thead>
                  <tr className="bg-navy text-white">
                    <th className="text-start p-3.5 font-medium w-1/3">{c.headers.feature}</th>
                    <th className="text-center p-3.5 font-medium">{c.headers.uae}</th>
                    <th className="text-center p-3.5 font-medium">{c.headers.oman}</th>
                    <th className="text-center p-3.5 font-medium">{c.headers.turkey}</th>
                  </tr>
                </thead>
                <tbody>
                  {c.groups.map((group, gi) => {
                    const GroupIcon = group.icon;
                    return (
                      <Fragment key={`g-${gi}`}>
                        <tr className="bg-navy/5">
                          <td colSpan={4} className="p-3 ps-4">
                            <span className="flex items-center gap-2 text-navy font-semibold text-[13px] uppercase tracking-wide">
                              <GroupIcon className="w-4 h-4 text-gold" />
                              {group.category}
                            </span>
                          </td>
                        </tr>
                        {group.rows.map((row, ri) => (
                          <tr key={`r-${gi}-${ri}`} className={ri % 2 === 0 ? "bg-white" : "bg-surface/60"}>
                            <td className="p-3 ps-4 font-medium text-navy">{row.label}</td>
                            <td className="p-3 text-center text-ink border-s-2 border-gold/30 font-medium">{row.uae}</td>
                            <td className="p-3 text-center text-ink">{row.oman}</td>
                            <td className="p-3 text-center text-ink">{row.turkey}</td>
                          </tr>
                        ))}
                      </Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <p className="text-xs text-muted-foreground text-center mt-5 max-w-2xl mx-auto">{c.table_note}</p>
          </div>
        </section>

        {/* Best-for country cards */}
        <section className="py-16 bg-white">
          <div className="max-w-5xl mx-auto px-4">
            <div className="text-center mb-10">
              <p className="text-xs uppercase tracking-wider text-gold mb-2">{c.best_eyebrow}</p>
              <h2 className="text-2xl md:text-3xl font-bold text-navy mb-3">{c.best_title}</h2>
              <p className="text-sm text-muted-foreground max-w-2xl mx-auto">{c.best_sub}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {c.countries.map((country, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ delay: i * 0.08 }}
                  className="flex flex-col bg-surface border border-border rounded-2xl p-6 hover:shadow-md transition-shadow"
                >
                  <div
                    className={`h-1 w-12 rounded-full mb-5 ${country.accent === "navy" ? "bg-navy" : "bg-gold"}`}
                  />
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-3xl">{country.flag}</span>
                    <h3 className="text-xl font-bold text-navy">{country.name}</h3>
                  </div>
                  <p className="text-sm font-medium text-gold mb-4">{country.tagline}</p>
                  <ul className="space-y-2.5 mb-6 flex-1">
                    {country.points.map((p, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm text-ink">
                        <CheckCircle2 className="w-4 h-4 text-gold mt-0.5 shrink-0" />
                        <span className="leading-relaxed">{p}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={lp(country.href)}
                    className="mt-auto inline-flex items-center justify-center gap-1.5 bg-navy text-white rounded-lg px-4 py-2.5 text-sm font-semibold hover:bg-navy-lt transition-colors"
                  >
                    {country.cta}
                    <Arrow className={`w-4 h-4 ${isRTL ? "rotate-180" : ""}`} />
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Quick verdict */}
        <section className="py-16 bg-surface">
          <div className="max-w-4xl mx-auto px-4">
            <div className="text-center mb-10">
              <p className="text-xs uppercase tracking-wider text-gold mb-2">{c.verdict_eyebrow}</p>
              <h2 className="text-2xl md:text-3xl font-bold text-navy">{c.verdict_title}</h2>
            </div>

            <div className="space-y-3">
              {c.verdicts.map((v, i) => (
                <div
                  key={i}
                  className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5 bg-white border border-border rounded-xl p-4 md:p-5"
                >
                  <p className="flex-1 text-sm md:text-base text-ink leading-relaxed">{v.profile}</p>
                  <div className="flex items-center gap-2 shrink-0 bg-navy/5 rounded-lg px-3 py-2">
                    <span className="text-[11px] uppercase tracking-wide text-muted-foreground">{c.verdict_pick_label}</span>
                    <span className="text-lg">{v.flag}</span>
                    <span className="text-sm font-bold text-navy">{v.pick}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <SharedFAQ items={c.faq_items} title={c.faq_title} />

        <SharedCrossSell items={crossSellItems} title={c.crosssell_title} />

        <SharedLeadForm
          serviceContext="compare_countries"
          title={c.lead_title}
          subtitle={c.lead_sub}
        />
      </main>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
