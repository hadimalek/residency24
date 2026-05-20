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
  IdCard,
  Globe2,
  MapPin,
  TrendingUp,
} from "lucide-react";
import type { CrossSellItem } from "@/components/shared/SharedCrossSell";
import type { FAQItem } from "@/components/shared/SharedFAQ";
import type { Lang } from "@/translations";

interface AreaCard {
  name: string;
  type: string;
  highlights: string[];
  price_from: string;
}

interface Content {
  breadcrumb_oman: string;
  breadcrumb_self: string;
  hero_h1: string;
  hero_sub: string;
  hero_badge: string;
  hero_placeholder: string;
  stats: { num: string; label: string }[];
  itc_eyebrow: string;
  itc_title: string;
  itc_sub: string;
  itc_areas: AreaCard[];
  itc_price_label: string;
  why_eyebrow: string;
  why_title: string;
  why_items: { title: string; desc: string }[];
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
    breadcrumb_self: "Buy Property",
    hero_h1: "Buy Freehold Property in Oman — Live or Earn Rental in ITC Zones",
    hero_sub:
      "Foreigners can own property in designated Integrated Tourism Complexes (ITC). From OMR 100,000. Property worth OMR 250,000+ unlocks a 5-year Investor Residency.",
    hero_badge: "Oman Property 2026",
    hero_placeholder: "Ask about ITC zones, off-plan, residency thresholds…",
    stats: [
      { num: "OMR 100K", label: "Entry price" },
      { num: "OMR 250K", label: "→ 5-yr residency" },
      { num: "100%", label: "Freehold for foreigners" },
      { num: "5–7%", label: "Typical rental yield" },
    ],
    itc_eyebrow: "Where to buy",
    itc_title: "Top ITC zones for foreign buyers",
    itc_sub: "Foreign ownership is restricted to designated Integrated Tourism Complexes. These are the most active markets.",
    itc_areas: [
      {
        name: "The Wave Muscat (Al Mouj)",
        type: "Coastal · Established",
        highlights: ["Marina, golf, beach", "Strong rental demand", "Apartments + villas"],
        price_from: "OMR 120,000",
      },
      {
        name: "Muscat Hills",
        type: "Hills · Quiet",
        highlights: ["Golf course community", "Family villas", "Close to airport"],
        price_from: "OMR 100,000",
      },
      {
        name: "Jebel Sifah",
        type: "Beachfront · Resort",
        highlights: ["Marina apartments", "Beach + mountain", "Holiday rental potential"],
        price_from: "OMR 90,000",
      },
      {
        name: "Hawana Salalah",
        type: "Resort · South",
        highlights: ["Khareef monsoon season", "Hotel-branded units", "Strong tourism rental"],
        price_from: "OMR 80,000",
      },
    ],
    itc_price_label: "From",
    why_eyebrow: "Why Oman property",
    why_title: "Why Oman property in 2026",
    why_items: [
      { title: "Genuine freehold", desc: "Full ownership, transferable and inheritable — not a long lease." },
      { title: "Residency unlock", desc: "OMR 250K threshold gives 5-year Investor Residency for the family." },
      { title: "Lower cost than Dubai", desc: "Comparable units cost 30–50% less than Dubai for similar quality." },
      { title: "Tourism-driven yield", desc: "Salalah Khareef and Muscat MICE drive holiday rental demand." },
    ],
    steps_title: "How buying property in Oman works",
    steps: [
      { title: "Pre-screen & ITC selection", desc: "We confirm your residency goal and shortlist eligible ITC properties.", days: "Day 1–7" },
      { title: "Reservation & due diligence", desc: "Reservation deposit, lawyer review of title and developer escrow.", days: "Day 7–14" },
      { title: "Sale agreement & payment", desc: "Sign SPA. Payment via bank transfer to escrow. Title transfer at MOH.", days: "Day 14–30" },
      { title: "Residency application", desc: "If above OMR 250K, apply for the 5-year (or 10-year above OMR 500K) Investor Residency.", days: "Day 30–60" },
    ],
    costs_title: "Costs of buying in Oman",
    costs_intro: "All-in costs of acquiring an OMR 250,000 ITC apartment, eligible for 5-year Investor Residency.",
    costs_disclaimer: "Figures are 2026 indicative. Off-plan, ready-built, branded and individual unit pricing vary.",
    cost_groups: [
      {
        title: "Property purchase",
        items: [
          { label: "Property price (sample)", value: "OMR 250,000" },
          { label: "Property registration fee", value: "3% of price" },
          { label: "Lawyer review", value: "From OMR 600" },
        ],
      },
      {
        title: "Annual ownership",
        items: [
          { label: "Service charges", value: "From OMR 6/sqm/yr" },
          { label: "Property tax", value: "0%" },
          { label: "Property management (optional)", value: "8–12% rent" },
        ],
      },
      {
        title: "Residency add-on",
        items: [
          { label: "Investor Residency fee", value: "From OMR 200" },
          { label: "Family inclusion", value: "Spouse + kids" },
          { label: "Issuance time", value: "2–4 weeks" },
        ],
      },
    ],
    faq_title: "Buying property in Oman — FAQ",
    faq_items: [
      { question: "Can foreigners really buy freehold property in Oman?", answer: "Yes — but only inside designated Integrated Tourism Complexes such as The Wave, Muscat Hills, Jebel Sifah and Hawana Salalah. Outside ITCs, foreign ownership is generally restricted." },
      { question: "Does buying property give automatic residency?", answer: "No. Property purchases at OMR 250,000+ qualify the buyer to apply for the 5-year Investor Residency Card; OMR 500,000+ qualifies for 10 years. The application is a separate step." },
      { question: "Can I rent the property out?", answer: "Yes. ITCs typically allow short-term and long-term rentals subject to community rules. Resort-branded units often have managed rental programs." },
      { question: "Can I take a mortgage as a foreigner?", answer: "Some Omani banks offer mortgages to foreigners with residency, typically up to 50–60% LTV. Off-plan units usually require cash or a developer payment plan." },
      { question: "Are there any property taxes?", answer: "There is no annual property tax. There is a one-off 3% transfer fee at the Ministry of Housing and small service-charge contributions to the community." },
      { question: "Can I sell later to another foreigner?", answer: "Yes. ITC units can be sold to other foreign buyers without restriction. Resale liquidity is best in mature zones like The Wave and Muscat Hills." },
    ],
    crosssell_title: "Other Oman services",
    crosssell_residency_title: "Investor Residency",
    crosssell_residency_desc: "Convert your property into a 5/10-year residency",
    crosssell_company_title: "Oman Company Registration",
    crosssell_company_desc: "Set up an LLC or Free Zone entity",
    crosssell_uae_title: "Dubai Property",
    crosssell_uae_desc: "Compare with UAE real estate market",
    lead_title: "Get matched with the right Oman property",
    lead_sub: "Tell us your budget and goal — we’ll send a shortlist of ITC properties and exact total cost.",
  },
  fa: {
    breadcrumb_oman: "عمان",
    breadcrumb_self: "خرید ملک",
    hero_h1: "خرید ملک Freehold در عمان — زندگی یا اجاره در مناطق ITC",
    hero_sub:
      "خارجی‌ها فقط در مجتمع‌های گردشگری مجاز (ITC) می‌توانند ملک بخرند. از ۱۰۰,۰۰۰ ریال عمان. ملک ۲۵۰,۰۰۰+ ریال، اقامت ۵ ساله سرمایه‌گذار می‌دهد.",
    hero_badge: "ملک عمان ۲۰۲۶",
    hero_placeholder: "درباره مناطق ITC، آف‌پلن، آستانه اقامت بپرسید…",
    stats: [
      { num: "۱۰۰K ر.ع.", label: "قیمت ورود" },
      { num: "۲۵۰K ر.ع.", label: "→ اقامت ۵ ساله" },
      { num: "۱۰۰٪", label: "Freehold برای خارجی" },
      { num: "۵-۷٪", label: "بازده اجاره معمول" },
    ],
    itc_eyebrow: "کجا بخریم",
    itc_title: "بهترین مناطق ITC برای خریدار خارجی",
    itc_sub: "مالکیت خارجی محدود به مجتمع‌های گردشگری مجاز است. این‌ها فعال‌ترین بازارها هستند.",
    itc_areas: [
      {
        name: "The Wave Muscat (Al Mouj)",
        type: "ساحلی · جاافتاده",
        highlights: ["مارینا، گلف، ساحل", "تقاضای اجاره قوی", "آپارتمان + ویلا"],
        price_from: "۱۲۰,۰۰۰ ر.ع.",
      },
      {
        name: "Muscat Hills",
        type: "تپه‌ها · آرام",
        highlights: ["کامیونیتی گلف", "ویلاهای خانوادگی", "نزدیک فرودگاه"],
        price_from: "۱۰۰,۰۰۰ ر.ع.",
      },
      {
        name: "Jebel Sifah",
        type: "ساحلی · ریزورت",
        highlights: ["آپارتمان مارینا", "ساحل + کوه", "پتانسیل اجاره تعطیلات"],
        price_from: "۹۰,۰۰۰ ر.ع.",
      },
      {
        name: "Hawana Salalah",
        type: "ریزورت · جنوب",
        highlights: ["فصل خریف (مونسون)", "واحدهای برند هتلی", "اجاره گردشگری قوی"],
        price_from: "۸۰,۰۰۰ ر.ع.",
      },
    ],
    itc_price_label: "از",
    why_eyebrow: "چرا ملک عمان",
    why_title: "چرا ملک عمان در ۲۰۲۶",
    why_items: [
      { title: "Freehold واقعی", desc: "مالکیت کامل، قابل انتقال و ارث — نه اجاره بلندمدت." },
      { title: "آنلاک اقامت", desc: "آستانه ۲۵۰K ریال عمان، اقامت ۵ ساله برای کل خانواده می‌دهد." },
      { title: "ارزان‌تر از دبی", desc: "واحد مشابه ۳۰ تا ۵۰٪ ارزان‌تر از دبی با کیفیت مشابه." },
      { title: "بازدهی گردشگری", desc: "خریف صلاله و رویدادهای مسقط، تقاضای اجاره را بالا می‌برد." },
    ],
    steps_title: "خرید ملک در عمان چگونه انجام می‌شود",
    steps: [
      { title: "ارزیابی و انتخاب ITC", desc: "هدف اقامت را تأیید و املاک ITC واجد شرایط را short-list می‌کنیم.", days: "روز ۱ تا ۷" },
      { title: "رزرو و due diligence", desc: "ودیعه رزرو، بررسی سند توسط وکیل، escrow توسعه‌دهنده.", days: "روز ۷ تا ۱۴" },
      { title: "قرارداد و پرداخت", desc: "امضای SPA. پرداخت از طریق بانک به escrow. انتقال سند در MOH.", days: "روز ۱۴ تا ۳۰" },
      { title: "درخواست اقامت", desc: "اگر بالای ۲۵۰K ریال بود، اقامت ۵ ساله (یا ۱۰ ساله بالای ۵۰۰K) را اقدام می‌کنیم.", days: "روز ۳۰ تا ۶۰" },
    ],
    costs_title: "هزینه خرید در عمان",
    costs_intro: "هزینه کل خرید آپارتمان ITC به ارزش ۲۵۰,۰۰۰ ریال عمان، واجد شرایط اقامت ۵ ساله.",
    costs_disclaimer: "ارقام تقریبی ۲۰۲۶. قیمت آف‌پلن، آماده، برند و جداگانه متفاوت است.",
    cost_groups: [
      {
        title: "خرید ملک",
        items: [
          { label: "قیمت ملک (نمونه)", value: "۲۵۰,۰۰۰ ر.ع." },
          { label: "هزینه ثبت ملک", value: "۳٪ قیمت" },
          { label: "بررسی وکیل", value: "از ۶۰۰ ر.ع." },
        ],
      },
      {
        title: "هزینه سالانه مالکیت",
        items: [
          { label: "هزینه خدمات", value: "از ۶ ر.ع./متر/سال" },
          { label: "مالیات ملک", value: "۰٪" },
          { label: "مدیریت ملک (اختیاری)", value: "۸ تا ۱۲٪ اجاره" },
        ],
      },
      {
        title: "افزونه اقامت",
        items: [
          { label: "هزینه اقامت سرمایه‌گذار", value: "از ۲۰۰ ر.ع." },
          { label: "خانواده", value: "همسر + فرزندان" },
          { label: "زمان صدور", value: "۲ تا ۴ هفته" },
        ],
      },
    ],
    faq_title: "خرید ملک در عمان — پرسش‌های رایج",
    faq_items: [
      { question: "آیا واقعاً خارجی‌ها می‌توانند ملک Freehold در عمان بخرند؟", answer: "بله — ولی فقط در مجتمع‌های گردشگری مجاز (ITC) مانند The Wave، Muscat Hills، Jebel Sifah و Hawana Salalah. خارج از ITC، مالکیت خارجی محدود است." },
      { question: "آیا خرید ملک، اقامت خودکار می‌دهد؟", answer: "خیر. خرید ملک ۲۵۰,۰۰۰+ ریال عمان شما را واجد شرایط درخواست اقامت ۵ ساله می‌کند؛ ۵۰۰,۰۰۰+ برای ۱۰ ساله. درخواست یک مرحله جداست." },
      { question: "آیا می‌توانم ملک را اجاره دهم؟", answer: "بله. ITCها معمولاً اجاره کوتاه‌مدت و بلندمدت را با رعایت قوانین کامیونیتی اجازه می‌دهند. واحدهای برند ریزورت اغلب برنامه اجاره مدیریت‌شده دارند." },
      { question: "آیا به‌عنوان خارجی می‌توانم وام مسکن بگیرم؟", answer: "برخی بانک‌های عمانی به خارجی‌های دارای اقامت تا ۵۰ تا ۶۰٪ LTV وام می‌دهند. واحد آف‌پلن معمولاً نقد یا با طرح پرداخت توسعه‌دهنده است." },
      { question: "آیا مالیات ملک وجود دارد؟", answer: "مالیات سالانه ملک وجود ندارد. هزینه ۳٪ یک‌باره انتقال در MOH و هزینه‌های خدمات کامیونیتی پرداخت می‌شود." },
      { question: "آیا می‌توانم بعداً به خارجی دیگر بفروشم؟", answer: "بله. واحدهای ITC را بدون محدودیت می‌توان به خریدار خارجی دیگر فروخت. نقدشوندگی در مناطق پخته مثل The Wave و Muscat Hills بهتر است." },
    ],
    crosssell_title: "سایر خدمات عمان",
    crosssell_residency_title: "اقامت سرمایه‌گذار",
    crosssell_residency_desc: "ملک خود را به اقامت ۵ یا ۱۰ ساله تبدیل کنید",
    crosssell_company_title: "ثبت شرکت در عمان",
    crosssell_company_desc: "LLC یا فری‌زون راه‌اندازی کنید",
    crosssell_uae_title: "ملک دبی",
    crosssell_uae_desc: "مقایسه با بازار املاک امارات",
    lead_title: "ملک مناسب عمان را پیدا کنید",
    lead_sub: "بودجه و هدف خود را بنویسید — لیست کوتاه ITC و هزینه دقیق کل برایتان می‌فرستیم.",
  },
  ar: {
    breadcrumb_oman: "عُمان",
    breadcrumb_self: "شراء عقار",
    hero_h1: "شراء عقار تملك حر في عُمان — السكن أو التأجير في مناطق ITC",
    hero_sub:
      "يمكن للأجانب التملك في المجمعات السياحية المعتمدة (ITC). من 100,000 ر.ع. والعقار بقيمة 250,000+ ر.ع. يفتح إقامة مستثمر 5 سنوات.",
    hero_badge: "عقار عُمان 2026",
    hero_placeholder: "اسأل عن مناطق ITC، عقارات على الخارطة، حدود الإقامة…",
    stats: [
      { num: "100 ألف ر.ع.", label: "سعر البداية" },
      { num: "250 ألف ر.ع.", label: "→ إقامة 5 سنوات" },
      { num: "100٪", label: "تملك حر للأجانب" },
      { num: "5–7٪", label: "عائد إيجار نموذجي" },
    ],
    itc_eyebrow: "أين تشتري",
    itc_title: "أفضل مناطق ITC للأجانب",
    itc_sub: "التملك الأجنبي مقتصر على المجمعات السياحية المعتمدة. هذه أكثر الأسواق نشاطاً.",
    itc_areas: [
      {
        name: "The Wave Muscat (Al Mouj)",
        type: "ساحلي · ناضج",
        highlights: ["مرسى، جولف، شاطئ", "طلب إيجار قوي", "شقق + فلل"],
        price_from: "120,000 ر.ع.",
      },
      {
        name: "Muscat Hills",
        type: "تلال · هادئ",
        highlights: ["مجتمع ملعب جولف", "فلل عائلية", "قريب من المطار"],
        price_from: "100,000 ر.ع.",
      },
      {
        name: "Jebel Sifah",
        type: "شاطئ · منتجع",
        highlights: ["شقق مرسى", "شاطئ + جبال", "إيجار عطلات"],
        price_from: "90,000 ر.ع.",
      },
      {
        name: "Hawana Salalah",
        type: "منتجع · جنوب",
        highlights: ["موسم الخريف", "وحدات بعلامات فندقية", "إيجار سياحي قوي"],
        price_from: "80,000 ر.ع.",
      },
    ],
    itc_price_label: "من",
    why_eyebrow: "لماذا عقار عُمان",
    why_title: "لماذا الاستثمار العقاري في عُمان 2026",
    why_items: [
      { title: "تملك حر حقيقي", desc: "ملكية كاملة قابلة للنقل والوراثة — وليست إيجاراً طويلاً." },
      { title: "فتح الإقامة", desc: "حد 250 ألف ر.ع. يمنح إقامة مستثمر 5 سنوات لكامل العائلة." },
      { title: "أرخص من دبي", desc: "وحدة مشابهة أرخص بـ 30 إلى 50٪ من دبي بنفس الجودة." },
      { title: "عائد سياحي", desc: "خريف صلالة وفعاليات مسقط ترفع الطلب على الإيجار." },
    ],
    steps_title: "كيف يتم شراء العقار في عُمان",
    steps: [
      { title: "تقييم واختيار ITC", desc: "نؤكد هدف الإقامة ونقدم قائمة عقارات مؤهلة.", days: "اليوم 1 إلى 7" },
      { title: "الحجز والتدقيق", desc: "عربون حجز، فحص الوثيقة من المحامي، حساب escrow.", days: "اليوم 7 إلى 14" },
      { title: "العقد والدفع", desc: "توقيع SPA. الدفع للحساب الضامن. نقل الملكية في وزارة الإسكان.", days: "اليوم 14 إلى 30" },
      { title: "تقديم الإقامة", desc: "لو تجاوز 250 ألف، نطبق على الإقامة 5 سنوات (10 سنوات فوق 500 ألف).", days: "اليوم 30 إلى 60" },
    ],
    costs_title: "تكاليف الشراء في عُمان",
    costs_intro: "إجمالي تكلفة شراء شقة ITC بقيمة 250,000 ر.ع. مؤهلة لإقامة 5 سنوات.",
    costs_disclaimer: "أرقام إرشادية لـ 2026. الأسعار تختلف بين الجاهز والمخططات والوحدات بعلامات فندقية.",
    cost_groups: [
      {
        title: "شراء العقار",
        items: [
          { label: "سعر العقار (مثال)", value: "250,000 ر.ع." },
          { label: "رسوم تسجيل العقار", value: "3٪ من السعر" },
          { label: "مراجعة المحامي", value: "من 600 ر.ع." },
        ],
      },
      {
        title: "تكلفة الملكية السنوية",
        items: [
          { label: "رسوم الخدمات", value: "من 6 ر.ع./م²/سنة" },
          { label: "ضريبة عقارية", value: "0٪" },
          { label: "إدارة العقار (اختياري)", value: "8 إلى 12٪ من الإيجار" },
        ],
      },
      {
        title: "إضافة الإقامة",
        items: [
          { label: "رسوم إقامة المستثمر", value: "من 200 ر.ع." },
          { label: "العائلة", value: "الزوج والأبناء" },
          { label: "وقت الإصدار", value: "2 إلى 4 أسابيع" },
        ],
      },
    ],
    faq_title: "شراء عقار في عُمان — أسئلة شائعة",
    faq_items: [
      { question: "هل يمكن للأجانب فعلاً شراء عقار تملك حر في عُمان؟", answer: "نعم — لكن فقط داخل المجمعات السياحية المعتمدة (ITC) مثل The Wave وMuscat Hills وJebel Sifah وHawana Salalah." },
      { question: "هل شراء العقار يمنح إقامة تلقائياً؟", answer: "لا. عقار 250,000+ ر.ع. يؤهلك للتقديم على إقامة المستثمر 5 سنوات؛ 500,000+ يؤهل لـ 10 سنوات. التقديم خطوة منفصلة." },
      { question: "هل يمكنني تأجير العقار؟", answer: "نعم. تسمح ITCs عادة بالإيجار قصير وطويل المدى وفق قواعد المجتمع." },
      { question: "هل يمكنني الحصول على رهن كأجنبي؟", answer: "بعض البنوك العمانية تمنح رهناً للأجانب المقيمين حتى 50 إلى 60٪ من قيمة العقار." },
      { question: "هل توجد ضرائب عقارية؟", answer: "لا توجد ضريبة عقار سنوية. هناك رسم نقل ملكية 3٪ مرة واحدة." },
      { question: "هل يمكنني البيع لاحقاً لأجنبي آخر؟", answer: "نعم. وحدات ITC قابلة للبيع لمشترين أجانب آخرين بدون قيود." },
    ],
    crosssell_title: "خدمات عُمان أخرى",
    crosssell_residency_title: "إقامة المستثمر",
    crosssell_residency_desc: "حول عقارك إلى إقامة 5 أو 10 سنوات",
    crosssell_company_title: "تأسيس شركة في عُمان",
    crosssell_company_desc: "ش.م.م أو منطقة حرة",
    crosssell_uae_title: "عقار دبي",
    crosssell_uae_desc: "قارن مع سوق العقارات الإماراتي",
    lead_title: "احصل على عقار عُمان المناسب",
    lead_sub: "أخبرنا بميزانيتك وهدفك — سنرسل قائمة قصيرة من ITC والتكلفة الكاملة الدقيقة.",
  },
  ru: {
    breadcrumb_oman: "Оман",
    breadcrumb_self: "Покупка недвижимости",
    hero_h1: "Покупка freehold-недвижимости в Омане — жильё или арендный доход в зонах ITC",
    hero_sub:
      "Иностранцы могут владеть недвижимостью только в утверждённых туристических комплексах (ITC). От OMR 100 000. Объект от OMR 250 000 открывает 5-летний инвесторский ВНЖ.",
    hero_badge: "Недвижимость Оман 2026",
    hero_placeholder: "Спросите про зоны ITC, off-plan, пороги для ВНЖ…",
    stats: [
      { num: "OMR 100K", label: "Цена входа" },
      { num: "OMR 250K", label: "→ ВНЖ 5 лет" },
      { num: "100%", label: "Freehold для иностранцев" },
      { num: "5–7%", label: "Типичная доходность" },
    ],
    itc_eyebrow: "Где покупать",
    itc_title: "Главные зоны ITC для иностранных покупателей",
    itc_sub: "Иностранное владение разрешено только в утверждённых туристических комплексах. Самые активные рынки.",
    itc_areas: [
      {
        name: "The Wave Muscat (Al Mouj)",
        type: "Прибрежная · зрелая",
        highlights: ["Марина, гольф, пляж", "Сильный спрос на аренду", "Квартиры и виллы"],
        price_from: "OMR 120 000",
      },
      {
        name: "Muscat Hills",
        type: "Холмы · спокойная",
        highlights: ["Гольф-комьюнити", "Семейные виллы", "Близко к аэропорту"],
        price_from: "OMR 100 000",
      },
      {
        name: "Jebel Sifah",
        type: "Пляж · курорт",
        highlights: ["Квартиры у марины", "Пляж и горы", "Краткосрочная аренда"],
        price_from: "OMR 90 000",
      },
      {
        name: "Hawana Salalah",
        type: "Курорт · юг",
        highlights: ["Сезон Хариф (муссон)", "Юниты под брендом отелей", "Сильный туристический спрос"],
        price_from: "OMR 80 000",
      },
    ],
    itc_price_label: "От",
    why_eyebrow: "Почему недвижимость Омана",
    why_title: "Почему недвижимость Омана в 2026",
    why_items: [
      { title: "Настоящий freehold", desc: "Полное владение, передаётся и наследуется — не долгосрочная аренда." },
      { title: "Открытие ВНЖ", desc: "Порог OMR 250K даёт 5-летний ВНЖ инвестора всей семье." },
      { title: "Дешевле Дубая", desc: "Аналогичные юниты на 30–50% дешевле Дубая при сопоставимом качестве." },
      { title: "Туристическая доходность", desc: "Хариф в Салале и события в Маскате создают спрос на аренду." },
    ],
    steps_title: "Как идёт покупка недвижимости в Омане",
    steps: [
      { title: "Скрининг и подбор ITC", desc: "Подтверждаем цель ВНЖ и формируем shortlist подходящих ITC-объектов.", days: "День 1–7" },
      { title: "Бронь и due diligence", desc: "Депозит на бронирование, юридическая проверка титула и escrow застройщика.", days: "День 7–14" },
      { title: "Договор и оплата", desc: "Подписание SPA. Оплата на escrow. Перевод права в Министерстве жилья.", days: "День 14–30" },
      { title: "Подача на ВНЖ", desc: "При сумме > OMR 250K подаём на 5-летний ВНЖ (или 10-летний при > OMR 500K).", days: "День 30–60" },
    ],
    costs_title: "Стоимость покупки в Омане",
    costs_intro: "Полная стоимость покупки квартиры ITC за OMR 250 000 с правом на 5-летний инвесторский ВНЖ.",
    costs_disclaimer: "Цифры ориентировочные на 2026. Off-plan, готовые и брендированные юниты различаются.",
    cost_groups: [
      {
        title: "Покупка",
        items: [
          { label: "Цена объекта (пример)", value: "OMR 250 000" },
          { label: "Госпошлина регистрации", value: "3% цены" },
          { label: "Юридическая проверка", value: "От OMR 600" },
        ],
      },
      {
        title: "Ежегодное владение",
        items: [
          { label: "Сервисный сбор", value: "От OMR 6/м²/год" },
          { label: "Налог на недвижимость", value: "0%" },
          { label: "Управление (опционально)", value: "8–12% от аренды" },
        ],
      },
      {
        title: "ВНЖ-надстройка",
        items: [
          { label: "Сбор за ВНЖ инвестора", value: "От OMR 200" },
          { label: "Семья", value: "Супруг + дети" },
          { label: "Срок выпуска", value: "2–4 недели" },
        ],
      },
    ],
    faq_title: "Покупка недвижимости в Омане — FAQ",
    faq_items: [
      { question: "Иностранцы действительно могут купить freehold-недвижимость в Омане?", answer: "Да — но только внутри утверждённых туристических комплексов (ITC): The Wave, Muscat Hills, Jebel Sifah и Hawana Salalah. Вне ITC иностранное владение, как правило, ограничено." },
      { question: "Покупка автоматически даёт ВНЖ?", answer: "Нет. Объект от OMR 250 000 даёт право подать на 5-летний инвесторский ВНЖ; от OMR 500 000 — на 10 лет. Подача — отдельный шаг." },
      { question: "Можно ли сдавать объект?", answer: "Да. ITC обычно разрешают краткосрочную и долгосрочную аренду по правилам сообщества." },
      { question: "Можно ли иностранцу взять ипотеку?", answer: "Некоторые оманские банки предлагают ипотеку иностранцам с ВНЖ до 50–60% LTV." },
      { question: "Есть ли налоги на недвижимость?", answer: "Ежегодного налога нет. Есть разовый сбор 3% при регистрации." },
      { question: "Можно ли потом продать другому иностранцу?", answer: "Да. Юниты ITC можно продавать другим иностранным покупателям без ограничений." },
    ],
    crosssell_title: "Другие услуги в Омане",
    crosssell_residency_title: "Инвесторский ВНЖ",
    crosssell_residency_desc: "Превратите недвижимость в ВНЖ на 5/10 лет",
    crosssell_company_title: "Регистрация компании в Омане",
    crosssell_company_desc: "LLC или свободная зона",
    crosssell_uae_title: "Недвижимость Дубая",
    crosssell_uae_desc: "Сравните с рынком ОАЭ",
    lead_title: "Подберём правильный объект в Омане",
    lead_sub: "Расскажите о бюджете и цели — пришлём shortlist ITC и точную полную стоимость.",
  },
};

export default function OmanBuyPropertyClient() {
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
      title: c.crosssell_company_title,
      description: c.crosssell_company_desc,
      icon: Building2,
      href: linkPath("oman/company-registration/"),
    },
    {
      title: c.crosssell_uae_title,
      description: c.crosssell_uae_desc,
      icon: Globe2,
      href: linkPath("uae/buy-property/"),
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

        {/* ITC areas */}
        <section className="py-16 bg-surface">
          <div className="max-w-5xl mx-auto px-4">
            <div className="text-center mb-10">
              <p className="text-xs uppercase tracking-wider text-gold mb-2">{c.itc_eyebrow}</p>
              <h2 className="text-2xl md:text-3xl font-bold text-navy mb-3">{c.itc_title}</h2>
              <p className="text-sm text-muted-foreground max-w-2xl mx-auto">{c.itc_sub}</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {c.itc_areas.map((a, i) => (
                <div key={i} className="bg-white border border-border rounded-xl p-5">
                  <div className="w-9 h-9 rounded-lg bg-gold/10 flex items-center justify-center mb-3">
                    <MapPin className="w-5 h-5 text-gold" />
                  </div>
                  <h3 className="text-base font-bold text-navy mb-1">{a.name}</h3>
                  <p className="text-xs text-gold/80 mb-3">{a.type}</p>
                  <ul className="space-y-1 mb-3">
                    {a.highlights.map((h, j) => (
                      <li key={j} className="text-xs text-muted-foreground">• {h}</li>
                    ))}
                  </ul>
                  <p className="text-sm font-bold text-navy">
                    {c.itc_price_label}: <span className="text-gold">{a.price_from}</span>
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why */}
        <section className="py-16 bg-white">
          <div className="max-w-5xl mx-auto px-4">
            <div className="text-center mb-10">
              <p className="text-xs uppercase tracking-wider text-gold mb-2">{c.why_eyebrow}</p>
              <h2 className="text-2xl md:text-3xl font-bold text-navy">{c.why_title}</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {c.why_items.map((w, i) => (
                <div key={i} className="bg-surface border border-border rounded-xl p-5">
                  <div className="w-10 h-10 rounded-lg bg-navy/5 flex items-center justify-center mb-3">
                    <TrendingUp className="w-5 h-5 text-navy" />
                  </div>
                  <h3 className="text-base font-semibold text-navy mb-1">{w.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{w.desc}</p>
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
          serviceContext="oman_buy_property"
          title={c.lead_title}
          subtitle={c.lead_sub}
        />
      </main>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}

