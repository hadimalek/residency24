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
  Plane,
  BadgeDollarSign,
  Globe2,
  ShieldCheck,
  TrendingUp,
  Award,
  Trees,
  Anchor,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import type { CrossSellItem } from "@/components/shared/SharedCrossSell";
import type { FAQItem } from "@/components/shared/SharedFAQ";
import type { Lang } from "@/translations";
import Link from "next/link";

type Service = {
  icon: typeof Building2;
  title: string;
  desc: string;
  price: string;
  href: string;
  badge?: string;
};

type WhyItem = { icon: typeof BadgeDollarSign; title: string; desc: string };

type StatItem = { num: string; label: string };

interface Content {
  breadcrumb: string;
  hero_h1: string;
  hero_sub: string;
  hero_badge: string;
  hero_placeholder: string;
  stats_label: string;
  stats: StatItem[];
  services_eyebrow: string;
  services_title: string;
  services: Service[];
  services_view: string;
  why_eyebrow: string;
  why_title: string;
  why_items: WhyItem[];
  costs_eyebrow: string;
  costs_title: string;
  costs_intro: string;
  costs_disclaimer: string;
  cost_groups: { title: string; items: { label: string; value: string }[] }[];
  faq_title: string;
  faq_items: FAQItem[];
  crosssell_title: string;
  crosssell_uae_title: string;
  crosssell_uae_desc: string;
  crosssell_turkey_title: string;
  crosssell_turkey_desc: string;
  crosssell_company_title: string;
  crosssell_company_desc: string;
  crosssell_property_title: string;
  crosssell_property_desc: string;
  lead_title: string;
  lead_sub: string;
}

const CONTENT: Record<Lang, Content> = {
  en: {
    breadcrumb: "Oman",
    hero_h1: "Live, Invest & Build in Oman — Your Gateway to GCC Growth",
    hero_sub:
      "0% personal income tax · 100% foreign ownership in free zones · 5–10 year Investor Residency from OMR 250,000 in property. A calmer, lower-cost alternative to Dubai.",
    hero_badge: "Oman 2026",
    hero_placeholder: "Ask about Oman company setup, residency or property…",
    stats_label: "Oman at a glance",
    stats: [
      { num: "0%", label: "Personal income tax" },
      { num: "OMR 250K", label: "Property → 5-yr residency" },
      { num: "10 years", label: "Investor Residency Card" },
      { num: "100%", label: "Foreign ownership (Free Zones)" },
    ],
    services_eyebrow: "Oman services",
    services_title: "What we do in Oman",
    services: [
      {
        icon: Building2,
        title: "Company Registration",
        desc: "Mainland LLC or Free Zone (Sohar, Salalah, Duqm) — 100% foreign ownership available.",
        price: "From USD 2,500",
        href: "/oman/company-registration/",
        badge: "Most popular",
      },
      {
        icon: Building,
        title: "Buy Property in Oman",
        desc: "Freehold in Integrated Tourism Complexes — The Wave, Muscat Hills, Hawana Salalah.",
        price: "From OMR 100,000",
        href: "/oman/buy-property/",
      },
      {
        icon: IdCard,
        title: "Investor Residency",
        desc: "5 or 10-year Investor Residency Card via property, business or deposit.",
        price: "From OMR 250,000",
        href: "/oman/residency-visa/",
      },
      {
        icon: Plane,
        title: "Tourist eVisa",
        desc: "10 to 30-day tourist eVisa — apply online before travel for most nationalities.",
        price: "From USD 20",
        href: "/oman/tourist-visa/",
      },
    ],
    services_view: "Learn more",
    why_eyebrow: "Why Oman",
    why_title: "Why choose Oman in 2026",
    why_items: [
      { icon: BadgeDollarSign, title: "0% personal income tax", desc: "No tax on salary, capital gains, dividends or inheritance." },
      { icon: ShieldCheck, title: "Stable & safe", desc: "Among the most peaceful countries in the Middle East. Strong rule of law." },
      { icon: TrendingUp, title: "Vision 2040 growth", desc: "Major investment in tourism, logistics, mining and renewable energy." },
      { icon: Globe2, title: "Strategic location", desc: "Direct access to Indian Ocean trade routes — gateway to Iran, India and East Africa." },
      { icon: Trees, title: "Quality of life", desc: "Cleaner air, less traffic, calmer pace than Dubai. Family-friendly cities." },
      { icon: Anchor, title: "Free Zones for global trade", desc: "Sohar, Salalah and Duqm — 25–30 year tax holidays for export-oriented businesses." },
    ],
    costs_eyebrow: "Costs",
    costs_title: "Real costs in Oman",
    costs_intro: "Indicative pricing for the most common Oman pathways. Final figures depend on activity, structure and family size.",
    costs_disclaimer: "Figures are indicative for 2026 and exclude personal expenses. Contact us for an exact case-based quote.",
    cost_groups: [
      {
        title: "Mainland LLC company",
        items: [
          { label: "Setup fees (gov + service)", value: "From USD 2,500" },
          { label: "Annual renewal", value: "From USD 1,200" },
          { label: "Investor visa per founder", value: "From OMR 200" },
        ],
      },
      {
        title: "Free Zone company",
        items: [
          { label: "Sohar / Salalah / Duqm license", value: "From USD 3,500" },
          { label: "Tax holiday", value: "25–30 years" },
          { label: "Foreign ownership", value: "100%" },
        ],
      },
      {
        title: "Investor Residency (property)",
        items: [
          { label: "Property minimum (5-yr)", value: "OMR 250,000" },
          { label: "Property minimum (10-yr)", value: "OMR 500,000" },
          { label: "Family included", value: "Spouse + children" },
        ],
      },
    ],
    faq_title: "Frequently asked questions about Oman",
    faq_items: [
      {
        question: "What is the minimum investment for Oman residency?",
        answer:
          "OMR 250,000 in approved property gives a 5-year Investor Residency Card. OMR 500,000 gives 10 years. Business and bank-deposit routes also exist with similar thresholds.",
      },
      {
        question: "Can foreigners own property in Oman?",
        answer:
          "Yes — in designated Integrated Tourism Complexes (ITCs) such as The Wave, Muscat Hills, Jebel Sifah and Hawana Salalah. Outside ITCs, foreign ownership is generally restricted.",
      },
      {
        question: "Is income tax really zero in Oman?",
        answer:
          "Yes — there is no personal income tax. Corporate tax is 15%, but Free Zone companies enjoy 25–30 year tax holidays on qualifying activities.",
      },
      {
        question: "How long does company registration take?",
        answer:
          "A mainland LLC typically takes 2–4 weeks. Free Zone setups (Sohar, Salalah, Duqm) usually finish within 3–6 weeks including bank account opening.",
      },
      {
        question: "Do I need to live in Oman to keep my residency?",
        answer:
          "You should not be absent for more than 6 consecutive months without a valid reason. Compared to other GCC countries, Oman’s presence rules are moderate.",
      },
      {
        question: "Is Oman a good alternative to the UAE?",
        answer:
          "If you want a calmer lifestyle, lower running costs and a long-term residency tied to property — yes. The UAE remains stronger for high-volume business and Golden Visa flexibility.",
      },
    ],
    crosssell_title: "Compare with UAE & Turkey",
    crosssell_uae_title: "UAE Residency",
    crosssell_uae_desc: "Golden Visa, Free Zone companies, Dubai property",
    crosssell_turkey_title: "Turkey Citizenship",
    crosssell_turkey_desc: "Citizenship by investment from USD 400,000",
    crosssell_company_title: "Oman Company Registration",
    crosssell_company_desc: "Mainland or Free Zone — 100% foreign ownership",
    crosssell_property_title: "Buy Property in Oman",
    crosssell_property_desc: "Freehold ITC zones — Muscat & Salalah",
    lead_title: "Get your Oman roadmap — free",
    lead_sub: "Tell us your goal and we’ll send back a tailored Oman plan within 24 hours.",
  },
  fa: {
    breadcrumb: "عمان",
    hero_h1: "زندگی، سرمایه‌گذاری و کسب‌وکار در عمان — درگاه آرام شما به خلیج فارس",
    hero_sub:
      "۰٪ مالیات بر درآمد شخصی · مالکیت ۱۰۰٪ خارجی در فری‌زون‌ها · اقامت ۵ تا ۱۰ ساله سرمایه‌گذار از ۲۵۰,۰۰۰ ریال عمان. جایگزینی آرام‌تر و کم‌هزینه‌تر از دبی.",
    hero_badge: "عمان ۲۰۲۶",
    hero_placeholder: "درباره ثبت شرکت، اقامت یا خرید ملک عمان بپرسید…",
    stats_label: "نگاه کوتاه به عمان",
    stats: [
      { num: "۰٪", label: "مالیات بر درآمد شخصی" },
      { num: "۲۵۰K ر.ع.", label: "ملک → اقامت ۵ ساله" },
      { num: "۱۰ سال", label: "اقامت سرمایه‌گذار" },
      { num: "۱۰۰٪", label: "مالکیت خارجی (فری‌زون)" },
    ],
    services_eyebrow: "خدمات عمان",
    services_title: "چه خدماتی در عمان ارائه می‌دهیم؟",
    services: [
      {
        icon: Building2,
        title: "ثبت شرکت در عمان",
        desc: "LLC مین‌لند یا فری‌زون (صحار، صلاله، الدقم) — مالکیت ۱۰۰٪ خارجی.",
        price: "از ۲,۵۰۰ دلار",
        href: "/fa/oman/company-registration/",
        badge: "پرطرفدار",
      },
      {
        icon: Building,
        title: "خرید ملک در عمان",
        desc: "مالکیت دائم در مجتمع‌های گردشگری (ITC) — Wave Muscat، Muscat Hills، Hawana Salalah.",
        price: "از ۱۰۰,۰۰۰ ریال عمان",
        href: "/fa/oman/buy-property/",
      },
      {
        icon: IdCard,
        title: "اقامت سرمایه‌گذار",
        desc: "اقامت سرمایه‌گذار ۵ یا ۱۰ ساله از طریق ملک، شرکت یا سپرده بانکی.",
        price: "از ۲۵۰,۰۰۰ ریال عمان",
        href: "/fa/oman/residency-visa/",
      },
      {
        icon: Plane,
        title: "ویزای توریستی",
        desc: "ویزای الکترونیکی ۱۰ تا ۳۰ روزه — درخواست آنلاین برای بیشتر کشورها.",
        price: "از ۲۰ دلار",
        href: "/fa/oman/tourist-visa/",
      },
    ],
    services_view: "اطلاعات بیشتر",
    why_eyebrow: "چرا عمان؟",
    why_title: "چرا عمان را برای ۲۰۲۶ انتخاب کنیم",
    why_items: [
      { icon: BadgeDollarSign, title: "۰٪ مالیات شخصی", desc: "نه بر حقوق، نه سود سرمایه، نه سود سهام، نه ارث." },
      { icon: ShieldCheck, title: "ثبات و امنیت", desc: "از امن‌ترین کشورهای خاورمیانه با حاکمیت قانون قوی." },
      { icon: TrendingUp, title: "چشم‌انداز ۲۰۴۰", desc: "سرمایه‌گذاری بزرگ در گردشگری، لجستیک، معدن و انرژی پاک." },
      { icon: Globe2, title: "موقعیت استراتژیک", desc: "دسترسی مستقیم به اقیانوس هند — درگاه ایران، هند و شرق آفریقا." },
      { icon: Trees, title: "کیفیت زندگی", desc: "هوای پاک‌تر، ترافیک کمتر، فضای آرام‌تر از دبی. مناسب خانواده." },
      { icon: Anchor, title: "فری‌زون‌های تجاری", desc: "صحار، صلاله و الدقم — معافیت ۲۵ تا ۳۰ ساله مالیاتی برای صادرات." },
    ],
    costs_eyebrow: "هزینه‌ها",
    costs_title: "هزینه‌های واقعی در عمان",
    costs_intro:
      "قیمت‌های تقریبی برای متداول‌ترین مسیرهای عمان. عدد نهایی به نوع فعالیت، ساختار و تعداد خانواده بستگی دارد.",
    costs_disclaimer:
      "ارقام تقریبی برای ۲۰۲۶ هستند و هزینه‌های شخصی را شامل نمی‌شوند. برای استعلام دقیق تماس بگیرید.",
    cost_groups: [
      {
        title: "شرکت LLC مین‌لند",
        items: [
          { label: "هزینه ثبت (دولتی + سرویس)", value: "از ۲,۵۰۰ دلار" },
          { label: "تمدید سالانه", value: "از ۱,۲۰۰ دلار" },
          { label: "ویزای سرمایه‌گذار", value: "از ۲۰۰ ریال عمان" },
        ],
      },
      {
        title: "شرکت فری‌زون",
        items: [
          { label: "لایسنس (صحار/صلاله/الدقم)", value: "از ۳,۵۰۰ دلار" },
          { label: "معافیت مالیاتی", value: "۲۵ تا ۳۰ سال" },
          { label: "مالکیت خارجی", value: "۱۰۰٪" },
        ],
      },
      {
        title: "اقامت سرمایه‌گذار (ملک)",
        items: [
          { label: "حداقل ملک (۵ ساله)", value: "۲۵۰,۰۰۰ ریال عمان" },
          { label: "حداقل ملک (۱۰ ساله)", value: "۵۰۰,۰۰۰ ریال عمان" },
          { label: "خانواده", value: "همسر + فرزندان" },
        ],
      },
    ],
    faq_title: "پرسش‌های رایج درباره عمان",
    faq_items: [
      {
        question: "حداقل سرمایه برای اقامت عمان چقدر است؟",
        answer:
          "۲۵۰,۰۰۰ ریال عمان در ملک تأییدشده، اقامت ۵ ساله می‌دهد. ۵۰۰,۰۰۰ ریال، اقامت ۱۰ ساله. مسیرهای کسب‌وکار و سپرده بانکی هم با آستانه‌های مشابه وجود دارند.",
      },
      {
        question: "آیا خارجی‌ها می‌توانند در عمان ملک بخرند؟",
        answer:
          "بله — در مجتمع‌های گردشگری مجاز (ITC) مانند Wave Muscat، Muscat Hills، Jebel Sifah و Hawana Salalah. خارج از این مناطق، مالکیت خارجی محدود است.",
      },
      {
        question: "آیا واقعاً مالیات بر درآمد در عمان صفر است؟",
        answer:
          "بله — مالیات بر درآمد شخصی وجود ندارد. مالیات شرکتی ۱۵٪ است ولی شرکت‌های فری‌زون از معافیت ۲۵ تا ۳۰ ساله بهره‌مند می‌شوند.",
      },
      {
        question: "ثبت شرکت در عمان چقدر طول می‌کشد؟",
        answer:
          "LLC مین‌لند معمولاً ۲ تا ۴ هفته. فری‌زون (صحار، صلاله، الدقم) با احتساب افتتاح حساب بانکی، ۳ تا ۶ هفته.",
      },
      {
        question: "آیا برای حفظ اقامت باید در عمان زندگی کنم؟",
        answer:
          "نباید بیش از ۶ ماه متوالی بدون دلیل موجه از عمان خارج باشید. در مقایسه با سایر کشورهای خلیج، شرایط حضور در عمان معتدل است.",
      },
      {
        question: "آیا عمان جایگزین خوبی برای امارات است؟",
        answer:
          "اگر سبک زندگی آرام، هزینه‌های جاری پایین‌تر و اقامت بلندمدت متصل به ملک می‌خواهید — بله. امارات همچنان برای کسب‌وکار حجیم و انعطاف گلدن ویزا قوی‌تر است.",
      },
    ],
    crosssell_title: "مقایسه با امارات و ترکیه",
    crosssell_uae_title: "اقامت امارات",
    crosssell_uae_desc: "گلدن ویزا، شرکت فری‌زون، ملک دبی",
    crosssell_turkey_title: "شهروندی ترکیه",
    crosssell_turkey_desc: "شهروندی از طریق سرمایه‌گذاری از ۴۰۰,۰۰۰ دلار",
    crosssell_company_title: "ثبت شرکت در عمان",
    crosssell_company_desc: "مین‌لند یا فری‌زون — مالکیت ۱۰۰٪ خارجی",
    crosssell_property_title: "خرید ملک در عمان",
    crosssell_property_desc: "ITC مجاز — مسقط و صلاله",
    lead_title: "نقشه راه شخصی عمان — رایگان",
    lead_sub: "هدف خود را برای ما بنویسید تا ظرف ۲۴ ساعت برنامه اختصاصی عمان را برایتان بفرستیم.",
  },
  ar: {
    breadcrumb: "عُمان",
    hero_h1: "العيش والاستثمار وبناء الأعمال في سلطنة عُمان — بوابتك إلى نمو الخليج",
    hero_sub:
      "0٪ ضريبة دخل شخصي · ملكية أجنبية 100٪ في المناطق الحرة · إقامة المستثمر 5 إلى 10 سنوات من 250,000 ر.ع. في العقار. بديل أهدأ وأقل تكلفة من دبي.",
    hero_badge: "عُمان 2026",
    hero_placeholder: "اسأل عن تأسيس شركة أو إقامة أو عقار في عُمان…",
    stats_label: "لمحة سريعة عن عُمان",
    stats: [
      { num: "0٪", label: "ضريبة الدخل الشخصي" },
      { num: "250 ألف ر.ع.", label: "عقار → إقامة 5 سنوات" },
      { num: "10 سنوات", label: "بطاقة إقامة المستثمر" },
      { num: "100٪", label: "ملكية أجنبية (مناطق حرة)" },
    ],
    services_eyebrow: "خدمات عُمان",
    services_title: "ماذا نقدم في عُمان",
    services: [
      {
        icon: Building2,
        title: "تأسيس شركة في عُمان",
        desc: "ش.م.م على البر الرئيسي أو منطقة حرة (صحار، صلالة، الدقم) — ملكية أجنبية 100٪.",
        price: "من 2,500 دولار",
        href: "/ar/oman/company-registration/",
        badge: "الأكثر طلباً",
      },
      {
        icon: Building,
        title: "شراء عقار في عُمان",
        desc: "تملك حر في المجمعات السياحية (ITC) — Wave Muscat، Muscat Hills، Hawana Salalah.",
        price: "من 100,000 ر.ع.",
        href: "/ar/oman/buy-property/",
      },
      {
        icon: IdCard,
        title: "إقامة المستثمر",
        desc: "إقامة مستثمر 5 أو 10 سنوات عبر العقار أو الشركة أو الإيداع البنكي.",
        price: "من 250,000 ر.ع.",
        href: "/ar/oman/residency-visa/",
      },
      {
        icon: Plane,
        title: "تأشيرة سياحية إلكترونية",
        desc: "تأشيرة سياحية 10 إلى 30 يوماً — تقديم إلكتروني لمعظم الجنسيات.",
        price: "من 20 دولار",
        href: "/ar/oman/tourist-visa/",
      },
    ],
    services_view: "اعرف المزيد",
    why_eyebrow: "لماذا عُمان؟",
    why_title: "لماذا تختار عُمان في 2026",
    why_items: [
      { icon: BadgeDollarSign, title: "0٪ ضريبة دخل شخصي", desc: "لا ضريبة على الراتب أو الأرباح الرأسمالية أو الأرباح الموزعة أو الإرث." },
      { icon: ShieldCheck, title: "استقرار وأمان", desc: "من أكثر دول الشرق الأوسط أماناً وسيادة قانون قوية." },
      { icon: TrendingUp, title: "رؤية 2040", desc: "استثمارات كبرى في السياحة واللوجستيات والتعدين والطاقة المتجددة." },
      { icon: Globe2, title: "موقع استراتيجي", desc: "وصول مباشر للمحيط الهندي — بوابة لإيران والهند وشرق أفريقيا." },
      { icon: Trees, title: "جودة حياة", desc: "هواء أنظف، حركة مرور أقل، أجواء أهدأ من دبي. مناسب للعائلات." },
      { icon: Anchor, title: "مناطق حرة للتجارة العالمية", desc: "صحار وصلالة والدقم — إعفاءات ضريبية 25 إلى 30 عاماً للمصدّرين." },
    ],
    costs_eyebrow: "التكاليف",
    costs_title: "تكاليف حقيقية في عُمان",
    costs_intro:
      "أسعار إرشادية لأكثر مسارات عُمان شيوعاً. الأرقام النهائية تعتمد على النشاط والهيكل وحجم العائلة.",
    costs_disclaimer:
      "الأرقام إرشادية لعام 2026 ولا تشمل المصاريف الشخصية. تواصل معنا للحصول على عرض دقيق حسب حالتك.",
    cost_groups: [
      {
        title: "شركة ش.م.م على البر الرئيسي",
        items: [
          { label: "رسوم التأسيس (حكومي + خدمات)", value: "من 2,500 دولار" },
          { label: "التجديد السنوي", value: "من 1,200 دولار" },
          { label: "تأشيرة المستثمر", value: "من 200 ر.ع." },
        ],
      },
      {
        title: "شركة في منطقة حرة",
        items: [
          { label: "رخصة (صحار / صلالة / الدقم)", value: "من 3,500 دولار" },
          { label: "إعفاء ضريبي", value: "25 إلى 30 سنة" },
          { label: "ملكية أجنبية", value: "100٪" },
        ],
      },
      {
        title: "إقامة المستثمر (عبر العقار)",
        items: [
          { label: "حد أدنى للعقار (5 سنوات)", value: "250,000 ر.ع." },
          { label: "حد أدنى للعقار (10 سنوات)", value: "500,000 ر.ع." },
          { label: "تشمل العائلة", value: "الزوج والأبناء" },
        ],
      },
    ],
    faq_title: "أسئلة شائعة عن عُمان",
    faq_items: [
      {
        question: "ما الحد الأدنى للاستثمار للحصول على إقامة عُمان؟",
        answer:
          "250,000 ر.ع. في عقار معتمد تمنح إقامة مستثمر لـ 5 سنوات. 500,000 ر.ع. تمنح 10 سنوات. تتوفر مسارات الأعمال والإيداع البنكي بشروط مماثلة.",
      },
      {
        question: "هل يمكن للأجانب تملك العقار في عُمان؟",
        answer:
          "نعم — في المجمعات السياحية المتكاملة (ITC) مثل Wave Muscat وMuscat Hills وJebel Sifah وHawana Salalah. خارج هذه المناطق، التملك الأجنبي مقيد عموماً.",
      },
      {
        question: "هل ضريبة الدخل صفر فعلاً في عُمان؟",
        answer:
          "نعم — لا توجد ضريبة دخل شخصي. الضريبة على الشركات 15٪، لكن شركات المناطق الحرة تتمتع بإعفاء ضريبي 25 إلى 30 عاماً على الأنشطة المؤهلة.",
      },
      {
        question: "كم يستغرق تأسيس الشركة؟",
        answer:
          "ش.م.م على البر الرئيسي 2 إلى 4 أسابيع عادة. المناطق الحرة (صحار، صلالة، الدقم) 3 إلى 6 أسابيع شاملاً فتح الحساب البنكي.",
      },
      {
        question: "هل يجب أن أعيش في عُمان للحفاظ على الإقامة؟",
        answer:
          "يجب ألا تغيب أكثر من 6 أشهر متواصلة بدون مبرر. مقارنة بدول الخليج الأخرى، قواعد الحضور في عُمان معتدلة.",
      },
      {
        question: "هل عُمان بديل جيد للإمارات؟",
        answer:
          "إذا أردت أسلوب حياة أهدأ وتكاليف تشغيل أقل وإقامة طويلة مرتبطة بالعقار — نعم. الإمارات تبقى أقوى للأعمال الكبيرة ومرونة الإقامة الذهبية.",
      },
    ],
    crosssell_title: "مقارنة مع الإمارات وتركيا",
    crosssell_uae_title: "إقامة الإمارات",
    crosssell_uae_desc: "إقامة ذهبية، شركات منطقة حرة، عقار دبي",
    crosssell_turkey_title: "جنسية تركيا",
    crosssell_turkey_desc: "جنسية بالاستثمار من 400,000 دولار",
    crosssell_company_title: "تأسيس شركة في عُمان",
    crosssell_company_desc: "بر رئيسي أو منطقة حرة — ملكية 100٪",
    crosssell_property_title: "شراء عقار في عُمان",
    crosssell_property_desc: "ITC معتمد — مسقط وصلالة",
    lead_title: "خارطة طريق عُمان — مجاناً",
    lead_sub: "أخبرنا بهدفك وسنرسل خطة عُمان مخصصة خلال 24 ساعة.",
  },
  ru: {
    breadcrumb: "Оман",
    hero_h1: "Резидентство, бизнес и инвестиции в Омане — спокойная альтернатива ОАЭ",
    hero_sub:
      "0% подоходного налога · 100% иностранное владение в свободных зонах · резидентская виза инвестора на 5–10 лет от OMR 250 000 в недвижимости. Спокойнее и дешевле Дубая.",
    hero_badge: "Оман 2026",
    hero_placeholder: "Спросите про компанию, ВНЖ или недвижимость в Омане…",
    stats_label: "Оман в цифрах",
    stats: [
      { num: "0%", label: "Подоходный налог" },
      { num: "OMR 250K", label: "Недвижимость → ВНЖ 5 лет" },
      { num: "10 лет", label: "Карта инвестора" },
      { num: "100%", label: "Иностранное владение (СЭЗ)" },
    ],
    services_eyebrow: "Услуги в Омане",
    services_title: "Что мы делаем в Омане",
    services: [
      {
        icon: Building2,
        title: "Регистрация компании",
        desc: "LLC на материке или в свободной зоне (Сохар, Салала, Дукм) — 100% иностранное владение.",
        price: "От 2 500 $",
        href: "/ru/oman/company-registration/",
        badge: "Популярно",
      },
      {
        icon: Building,
        title: "Покупка недвижимости",
        desc: "Полное владение в туристических комплексах (ITC) — The Wave, Muscat Hills, Hawana Salalah.",
        price: "От OMR 100 000",
        href: "/ru/oman/buy-property/",
      },
      {
        icon: IdCard,
        title: "Инвесторский ВНЖ",
        desc: "Карта инвестора на 5 или 10 лет через недвижимость, бизнес или депозит.",
        price: "От OMR 250 000",
        href: "/ru/oman/residency-visa/",
      },
      {
        icon: Plane,
        title: "Туристическая eVisa",
        desc: "Электронная виза на 10–30 дней — оформляется онлайн заранее.",
        price: "От 20 $",
        href: "/ru/oman/tourist-visa/",
      },
    ],
    services_view: "Подробнее",
    why_eyebrow: "Почему Оман",
    why_title: "Почему выбирают Оман в 2026 году",
    why_items: [
      { icon: BadgeDollarSign, title: "0% подоходного налога", desc: "Нет налога на зарплату, прирост капитала, дивиденды или наследство." },
      { icon: ShieldCheck, title: "Стабильность и безопасность", desc: "Одна из самых спокойных стран Ближнего Востока с сильной правовой системой." },
      { icon: TrendingUp, title: "Vision 2040", desc: "Большие инвестиции в туризм, логистику, добычу и зелёную энергетику." },
      { icon: Globe2, title: "Стратегическое положение", desc: "Прямой выход в Индийский океан — ворота к Ирану, Индии и Восточной Африке." },
      { icon: Trees, title: "Качество жизни", desc: "Чище воздух, меньше пробок, спокойнее ритм, чем в Дубае. Удобно для семьи." },
      { icon: Anchor, title: "Свободные зоны", desc: "Сохар, Салала и Дукм — налоговые каникулы 25–30 лет для экспортёров." },
    ],
    costs_eyebrow: "Стоимость",
    costs_title: "Реальные расходы в Омане",
    costs_intro:
      "Ориентировочные цены по самым частым маршрутам Омана. Финальные суммы зависят от деятельности, структуры и состава семьи.",
    costs_disclaimer:
      "Данные ориентировочны для 2026 года и не включают личные расходы. Свяжитесь с нами для точного расчёта.",
    cost_groups: [
      {
        title: "Компания LLC (материк)",
        items: [
          { label: "Регистрация (гос. + сервис)", value: "От 2 500 $" },
          { label: "Ежегодное продление", value: "От 1 200 $" },
          { label: "Виза инвестора", value: "От OMR 200" },
        ],
      },
      {
        title: "Компания в свободной зоне",
        items: [
          { label: "Лицензия (Сохар / Салала / Дукм)", value: "От 3 500 $" },
          { label: "Налоговые каникулы", value: "25–30 лет" },
          { label: "Иностранное владение", value: "100%" },
        ],
      },
      {
        title: "Инвесторский ВНЖ (через недвижимость)",
        items: [
          { label: "Минимум (5 лет)", value: "OMR 250 000" },
          { label: "Минимум (10 лет)", value: "OMR 500 000" },
          { label: "Семья", value: "Супруг + дети" },
        ],
      },
    ],
    faq_title: "Частые вопросы про Оман",
    faq_items: [
      {
        question: "Какой минимум инвестиций для ВНЖ Омана?",
        answer:
          "OMR 250 000 в одобренной недвижимости — карта инвестора на 5 лет. OMR 500 000 — на 10 лет. Существуют также маршруты через бизнес и банковский депозит со сходными порогами.",
      },
      {
        question: "Могут ли иностранцы покупать недвижимость в Омане?",
        answer:
          "Да — в утверждённых туристических комплексах (ITC): The Wave, Muscat Hills, Jebel Sifah и Hawana Salalah. За пределами ITC иностранное владение, как правило, ограничено.",
      },
      {
        question: "Налог на доход в Омане действительно 0%?",
        answer:
          "Да — личного подоходного налога нет. Корпоративный налог 15%, но компании в свободных зонах получают налоговые каникулы 25–30 лет на квалифицированные виды деятельности.",
      },
      {
        question: "Сколько занимает регистрация компании?",
        answer:
          "LLC на материке обычно 2–4 недели. В свободных зонах (Сохар, Салала, Дукм) — 3–6 недель с учётом открытия счёта.",
      },
      {
        question: "Нужно ли жить в Омане для сохранения ВНЖ?",
        answer:
          "Не следует отсутствовать дольше 6 месяцев подряд без уважительной причины. По сравнению с другими странами Залива требования к присутствию в Омане умеренные.",
      },
      {
        question: "Оман — хорошая альтернатива ОАЭ?",
        answer:
          "Если важны спокойный образ жизни, более низкие текущие расходы и долгий ВНЖ через недвижимость — да. ОАЭ остаются сильнее для большого бизнеса и гибкости Golden Visa.",
      },
    ],
    crosssell_title: "Сравните с ОАЭ и Турцией",
    crosssell_uae_title: "ВНЖ ОАЭ",
    crosssell_uae_desc: "Golden Visa, компании в СЭЗ, недвижимость в Дубае",
    crosssell_turkey_title: "Гражданство Турции",
    crosssell_turkey_desc: "Гражданство за инвестиции от 400 000 $",
    crosssell_company_title: "Регистрация компании в Омане",
    crosssell_company_desc: "Материк или СЭЗ — 100% иностранное владение",
    crosssell_property_title: "Недвижимость в Омане",
    crosssell_property_desc: "Утверждённые ITC — Маскат и Салала",
    lead_title: "Получите бесплатный план по Оману",
    lead_sub: "Расскажите о цели — пришлём индивидуальный план по Оману в течение 24 часов.",
  },
};

export default function OmanHubClient() {
  const { lang, isRTL } = useLanguage();
  const c = CONTENT[lang];
  const Arrow = isRTL ? ChevronLeft : ChevronRight;
  const homeHref = lang === "en" ? "/" : `/${lang}/`;

  const breadcrumbItems = [
    { label: "Residency24", href: homeHref },
    { label: c.breadcrumb },
  ];

  const otherServiceLink = (path: string) => (lang === "en" ? `/${path}` : `/${lang}/${path}`);

  const crossSellItems: CrossSellItem[] = [
    {
      title: c.crosssell_company_title,
      description: c.crosssell_company_desc,
      icon: Building2,
      href: otherServiceLink("oman/company-registration/"),
      isHighlighted: true,
    },
    {
      title: c.crosssell_property_title,
      description: c.crosssell_property_desc,
      icon: Building,
      href: otherServiceLink("oman/buy-property/"),
    },
    {
      title: c.crosssell_uae_title,
      description: c.crosssell_uae_desc,
      icon: Globe2,
      href: otherServiceLink("uae/"),
    },
    {
      title: c.crosssell_turkey_title,
      description: c.crosssell_turkey_desc,
      icon: Award,
      href: otherServiceLink("turkey/"),
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

        {/* Stats strip */}
        <section className="py-10 bg-white border-b border-border">
          <div className="max-w-5xl mx-auto px-4">
            <p className="text-xs uppercase tracking-wider text-gold/80 text-center mb-4">{c.stats_label}</p>
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

        {/* Services grid */}
        <section className="py-16 bg-surface">
          <div className="max-w-5xl mx-auto px-4">
            <div className="text-center mb-10">
              <p className="text-xs uppercase tracking-wider text-gold mb-2">{c.services_eyebrow}</p>
              <h2 className="text-2xl md:text-3xl font-bold text-navy">{c.services_title}</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {c.services.map((svc, i) => {
                const Icon = svc.icon;
                return (
                  <Link
                    key={i}
                    href={svc.href}
                    className="group bg-white border border-border rounded-xl p-5 hover:shadow-md hover:-translate-y-0.5 transition-all flex flex-col"
                  >
                    {svc.badge && (
                      <span className="bg-gold text-navy text-xs font-bold px-2 py-0.5 rounded-full inline-block mb-2 self-start">
                        {svc.badge}
                      </span>
                    )}
                    <div className="w-10 h-10 rounded-lg bg-navy/5 flex items-center justify-center mb-3">
                      <Icon className="w-5 h-5 text-navy" />
                    </div>
                    <h3 className="text-base font-semibold text-navy mb-1">{svc.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-3 flex-1">{svc.desc}</p>
                    <p className="text-sm font-bold text-gold mb-2">{svc.price}</p>
                    <span className="flex items-center gap-1 text-xs font-semibold text-gold">
                      {c.services_view} <Arrow className="w-4 h-4" />
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* Why Oman */}
        <section className="py-16 bg-white">
          <div className="max-w-5xl mx-auto px-4">
            <div className="text-center mb-10">
              <p className="text-xs uppercase tracking-wider text-gold mb-2">{c.why_eyebrow}</p>
              <h2 className="text-2xl md:text-3xl font-bold text-navy">{c.why_title}</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {c.why_items.map((w, i) => {
                const Icon = w.icon;
                return (
                  <div key={i} className="bg-surface border border-border rounded-xl p-5">
                    <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center mb-3">
                      <Icon className="w-5 h-5 text-gold" />
                    </div>
                    <h3 className="text-base font-semibold text-navy mb-1">{w.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{w.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Cost breakdown */}
        <section className="py-16 bg-surface">
          <div className="max-w-5xl mx-auto px-4">
            <div className="text-center mb-10">
              <p className="text-xs uppercase tracking-wider text-gold mb-2">{c.costs_eyebrow}</p>
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
          serviceContext="oman_general"
          title={c.lead_title}
          subtitle={c.lead_sub}
        />
      </main>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
