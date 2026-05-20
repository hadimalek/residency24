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
  Award,
  Building2,
  Globe2,
  MapPin,
  TrendingUp,
} from "lucide-react";
import type { CrossSellItem } from "@/components/shared/SharedCrossSell";
import type { FAQItem } from "@/components/shared/SharedFAQ";
import type { Lang } from "@/translations";

interface City {
  name: string;
  type: string;
  highlights: string[];
  price_from: string;
  yield: string;
}

interface Content {
  breadcrumb_turkey: string;
  breadcrumb_self: string;
  hero_h1: string;
  hero_sub: string;
  hero_badge: string;
  hero_placeholder: string;
  stats: { num: string; label: string }[];
  cities_eyebrow: string;
  cities_title: string;
  cities_sub: string;
  cities: City[];
  cities_price_label: string;
  cities_yield_label: string;
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
  crosssell_citizenship_title: string;
  crosssell_citizenship_desc: string;
  crosssell_company_title: string;
  crosssell_company_desc: string;
  crosssell_uae_title: string;
  crosssell_uae_desc: string;
  lead_title: string;
  lead_sub: string;
}

const CONTENT: Record<Lang, Content> = {
  en: {
    breadcrumb_turkey: "Turkey",
    breadcrumb_self: "Buy Property",
    hero_h1: "Buy Property in Turkey 2026 — Istanbul, Antalya, Bodrum & More",
    hero_sub:
      "Foreigners can buy freehold property across Turkey from $80,000. Two key thresholds: $200,000 for investor residency, $400,000 for citizenship. Strong capital appreciation + 5–8% rental yields.",
    hero_badge: "Turkey Property 2026",
    hero_placeholder: "Ask about Istanbul districts, off-plan, branded residences, residency thresholds…",
    stats: [
      { num: "$80K", label: "Entry price" },
      { num: "$200K → ВНЖ", label: "Residency threshold" },
      { num: "$400K → CBI", label: "Citizenship threshold" },
      { num: "5–8%", label: "Typical rental yield" },
    ],
    cities_eyebrow: "Top cities",
    cities_title: "Where foreigners are buying in 2026",
    cities_sub: "Istanbul leads volume. Antalya leads tourism rentals. Bodrum leads luxury. Choose the city that matches your goal.",
    cities: [
      { name: "Istanbul", type: "Capital · Largest market", highlights: ["Bosphorus views", "Deepest resale liquidity", "European + Asian sides"], price_from: "From $140,000", yield: "5–6% yield" },
      { name: "Antalya", type: "Mediterranean · Tourist", highlights: ["Year-round tourism", "Branded resort units", "Popular with Russians"], price_from: "From $90,000", yield: "6–8% yield" },
      { name: "Bodrum", type: "Aegean · Luxury", highlights: ["Boutique villas", "Marina lifestyle", "Top summer rentals"], price_from: "From $200,000", yield: "5–7% yield" },
      { name: "Bursa", type: "Industrial · Family", highlights: ["Lower entry prices", "1.5 hr from Istanbul", "Family-friendly"], price_from: "From $80,000", yield: "5–6% yield" },
      { name: "Izmir", type: "Coastal · Growing", highlights: ["Aegean lifestyle", "Tech scene rising", "Undervalued vs Istanbul"], price_from: "From $90,000", yield: "5–7% yield" },
      { name: "Ankara", type: "Capital · Stable", highlights: ["Government hub", "Embassy district", "Stable rental demand"], price_from: "From $85,000", yield: "5–6% yield" },
    ],
    cities_price_label: "From",
    cities_yield_label: "Yield",
    why_eyebrow: "Why Turkey property",
    why_title: "Why buy property in Turkey in 2026",
    why_items: [
      { title: "Two-tier residency unlock", desc: "$200K opens an Investor Residency. $400K opens citizenship. Same property type, different upgrade path." },
      { title: "Strong capital appreciation", desc: "Istanbul and major coastal cities grew 20–40% YoY. Demand from tourism, locals and digital nomads." },
      { title: "Genuine freehold for foreigners", desc: "Foreigners can own residential, commercial and land. TAPU is fully transferable and inheritable." },
      { title: "Off-plan flexibility", desc: "Off-plan units can be 20–30% cheaper than ready stock with 60-month installment plans from major developers." },
      { title: "Capital gains exemption", desc: "Hold for 5 years and you pay zero capital gains tax on resale — one of the best CGT regimes globally." },
      { title: "Rental tax friendly", desc: "Rental income under TRY 13,000/year per landlord is tax-free. Standard expenses are deductible above that." },
    ],
    steps_title: "How buying property in Turkey works",
    steps: [
      { title: "Pre-screen + city selection", desc: "We confirm your goal — citizenship, residency or pure ROI — and shortlist cities and districts.", days: "Day 1–7" },
      { title: "Tax ID + bank account", desc: "We obtain your Turkish tax number and open a bank account so you can transfer funds legally.", days: "Day 7–14" },
      { title: "Property visits + reservation", desc: "Physical or virtual viewings. We negotiate price and place a reservation deposit (1–5%).", days: "Day 14–25" },
      { title: "SPK valuation + due diligence", desc: "Mandatory SPK appraisal report and lawyer-led title check (no liens, no debts, no encroachments).", days: "Day 21–35" },
      { title: "Sale contract + Safe Payment", desc: "Sign SPA. Pay through Güvenli Ödeme Sistemi (mandatory from May 2026) — escrow protects both sides.", days: "Day 30–45" },
      { title: "TAPU transfer + handover", desc: "Title deed transfer at the Land Registry. Keys handed over. Optional: residency or citizenship application starts.", days: "Day 45–60" },
    ],
    costs_title: "Real costs of buying in Turkey",
    costs_intro: "Indicative all-in cost on top of the property price. Same fees apply whether you go for ROI, residency or citizenship.",
    costs_disclaimer: "Figures are 2026 indicative on a $300,000 sample property. Final cost depends on city, property type and chosen route.",
    cost_groups: [
      {
        title: "One-off transaction",
        items: [
          { label: "TAPU transfer fee (4%)", value: "From $12,000" },
          { label: "Notary + sworn translation", value: "From $1,500" },
          { label: "SPK valuation report", value: "From $400" },
        ],
      },
      {
        title: "Annual ownership",
        items: [
          { label: "Property tax (urban)", value: "0.2–0.6% / yr" },
          { label: "Property tax (non-urban)", value: "0.1–0.3% / yr" },
          { label: "Building / DASK insurance", value: "From $80 / yr" },
        ],
      },
      {
        title: "Optional add-ons",
        items: [
          { label: "Lawyer / Power of Attorney", value: "From $1,500" },
          { label: "Property management", value: "8–12% of rent" },
          { label: "Furnishing pack", value: "From $8,000" },
        ],
      },
    ],
    faq_title: "Buying property in Turkey — FAQ",
    faq_items: [
      { question: "Are there areas where foreigners cannot buy?", answer: "Yes — military zones, strategic security zones and some border areas are restricted. Standard residential areas in Istanbul, Antalya, Bodrum, Bursa, Izmir and Ankara are fully open to foreigners." },
      { question: "What's the difference between $200K and $400K thresholds?", answer: "$200K in property gives you a Turkish Investor Residency Card (renewable). $400K + 3-year hold gives you full Turkish citizenship. Same purchase mechanics — different paperwork at the end." },
      { question: "Can I take a Turkish mortgage as a foreigner?", answer: "Yes, but with caveats — typically up to 50% LTV, 5–10 year terms, and rates 4–6 percentage points above Turkish base. Most CBI investors use cash or developer payment plans instead." },
      { question: "What is the Safe Payment System (Güvenli Ödeme)?", answer: "From May 1, 2026, all real estate payments must flow through a bank-managed escrow. Buyer transfers to the bank, bank releases to seller only after TAPU transfer. Protects both parties from fraud." },
      { question: "How does the SPK valuation work?", answer: "An SPK-licensed appraiser inspects the property and produces an independent report. From 2026 the appraised value must equal the actual sale price — both under and over-valuation can void your residency or citizenship application." },
      { question: "Can I buy off-plan and still qualify for citizenship?", answer: "Yes — but the property must be registered in your name with TAPU at the time of citizenship application. Off-plan units typically deliver 12–24 months after sale; you can still apply for citizenship after delivery." },
      { question: "What is the rental tax situation?", answer: "Rental income up to TRY 13,000 per year (~USD 380) per landlord is tax-exempt in 2026. Above that, 15–40% progressive tax applies, with standard deductions for maintenance, agent fees and depreciation." },
      { question: "Can I buy multiple properties to reach $400K?", answer: "Yes. You can combine 2 or more properties — residential, commercial or land — totaling $400,000 or more, all with the same 3-year no-sell annotation, to qualify for citizenship." },
    ],
    crosssell_title: "Other Turkey services",
    crosssell_citizenship_title: "Turkish Citizenship",
    crosssell_citizenship_desc: "Convert your $400K property into a passport",
    crosssell_company_title: "Turkey Company Registration",
    crosssell_company_desc: "Pair property with a Turkish business",
    crosssell_uae_title: "Buy Property in Dubai",
    crosssell_uae_desc: "Compare with UAE real estate market",
    lead_title: "Get a property shortlist tailored to your goal",
    lead_sub: "Tell us your budget, city and goal (ROI / residency / citizenship) — we'll send 5–7 matching properties + total cost within 24 hours.",
  },
  fa: {
    breadcrumb_turkey: "ترکیه",
    breadcrumb_self: "خرید ملک",
    hero_h1: "خرید ملک در ترکیه ۲۰۲۶ — استانبول، آنتالیا، بدروم و بیشتر",
    hero_sub:
      "خارجی‌ها می‌توانند ملک Freehold در سراسر ترکیه از ۸۰,۰۰۰ دلار بخرند. دو آستانه کلیدی: ۲۰۰,۰۰۰ دلار برای اقامت سرمایه‌گذار، ۴۰۰,۰۰۰ دلار برای شهروندی. رشد ارزش قوی + بازده اجاره ۵ تا ۸٪.",
    hero_badge: "ملک ترکیه ۲۰۲۶",
    hero_placeholder: "درباره مناطق استانبول، آف‌پلن، واحدهای برند، آستانه اقامت بپرسید…",
    stats: [
      { num: "۸۰K دلار", label: "قیمت ورود" },
      { num: "۲۰۰K → اقامت", label: "آستانه اقامت" },
      { num: "۴۰۰K → CBI", label: "آستانه شهروندی" },
      { num: "۵ تا ۸٪", label: "بازده اجاره" },
    ],
    cities_eyebrow: "بهترین شهرها",
    cities_title: "خارجی‌ها در ۲۰۲۶ کجا می‌خرند",
    cities_sub: "استانبول از نظر حجم پیشرو است. آنتالیا اجاره گردشگری. بدروم لاکچری. شهر متناسب با هدف خود را انتخاب کنید.",
    cities: [
      { name: "استانبول", type: "پایتخت تجاری · بزرگ‌ترین بازار", highlights: ["ویوی بسفر", "نقدشوندگی بالا", "سمت اروپا و آسیا"], price_from: "از ۱۴۰,۰۰۰ دلار", yield: "بازده ۵ تا ۶٪" },
      { name: "آنتالیا", type: "مدیترانه · توریستی", highlights: ["گردشگری ۱۲ ماهه", "واحدهای برند ریزورت", "محبوب روس‌ها"], price_from: "از ۹۰,۰۰۰ دلار", yield: "بازده ۶ تا ۸٪" },
      { name: "بدروم", type: "اژه · لاکچری", highlights: ["ویلاهای بوتیک", "زندگی مارینا", "بازده تابستانی بالا"], price_from: "از ۲۰۰,۰۰۰ دلار", yield: "بازده ۵ تا ۷٪" },
      { name: "بورسا", type: "صنعتی · خانوادگی", highlights: ["قیمت ورود پایین‌تر", "۱.۵ ساعت از استانبول", "مناسب خانواده"], price_from: "از ۸۰,۰۰۰ دلار", yield: "بازده ۵ تا ۶٪" },
      { name: "ازمیر", type: "ساحلی · در حال رشد", highlights: ["سبک زندگی اژه", "صحنه تک در حال رشد", "ارزان‌تر از استانبول"], price_from: "از ۹۰,۰۰۰ دلار", yield: "بازده ۵ تا ۷٪" },
      { name: "آنکارا", type: "پایتخت · باثبات", highlights: ["هاب دولتی", "منطقه سفارت‌خانه‌ها", "تقاضای اجاره پایدار"], price_from: "از ۸۵,۰۰۰ دلار", yield: "بازده ۵ تا ۶٪" },
    ],
    cities_price_label: "از",
    cities_yield_label: "بازدهی",
    why_eyebrow: "چرا ملک ترکیه",
    why_title: "چرا در ۲۰۲۶ ملک ترکیه بخریم",
    why_items: [
      { title: "آنلاک اقامت دو سطحی", desc: "۲۰۰K اقامت سرمایه‌گذار باز می‌کند. ۴۰۰K شهروندی باز می‌کند. همان نوع ملک، مسیر ارتقا متفاوت." },
      { title: "رشد ارزش قوی", desc: "استانبول و شهرهای ساحلی اصلی سالانه ۲۰ تا ۴۰٪ رشد. تقاضای توریست، محلی و نومادها." },
      { title: "Freehold واقعی برای خارجی‌ها", desc: "خارجی‌ها می‌توانند مسکونی، تجاری و زمین مالک شوند. TAPU کاملاً قابل انتقال و ارث." },
      { title: "انعطاف آف‌پلن", desc: "واحدهای آف‌پلن می‌توانند ۲۰ تا ۳۰٪ ارزان‌تر از آماده باشند با اقساط ۶۰ ماهه از سازنده‌های اصلی." },
      { title: "معافیت سود سرمایه", desc: "۵ سال نگه دارید و در فروش هیچ مالیات سود سرمایه نمی‌دهید — یکی از بهترین رژیم‌های CGT جهان." },
      { title: "مالیات اجاره منعطف", desc: "اجاره تا ۱۳,۰۰۰ لیر/سال در ۲۰۲۶ معاف است. بالاتر از آن مالیات تصاعدی ۱۵ تا ۴۰٪ با کسرهای استاندارد." },
    ],
    steps_title: "خرید ملک در ترکیه چگونه انجام می‌شود",
    steps: [
      { title: "ارزیابی + انتخاب شهر", desc: "هدف شما — شهروندی، اقامت یا ROI — را تأیید و شهرها و مناطق را short-list می‌کنیم.", days: "روز ۱ تا ۷" },
      { title: "کد مالیاتی + حساب بانکی", desc: "کد مالیاتی ترکیه را گرفته و حساب بانکی باز می‌کنیم تا انتقال قانونی پول ممکن شود.", days: "روز ۷ تا ۱۴" },
      { title: "بازدید ملک + رزرو", desc: "بازدید فیزیکی یا مجازی. قیمت را مذاکره و ودیعه رزرو (۱ تا ۵٪) می‌گذاریم.", days: "روز ۱۴ تا ۲۵" },
      { title: "ارزیابی SPK + due diligence", desc: "گزارش ارزیابی SPK اجباری و بررسی سند توسط وکیل (بدون رهن، بدهی، تجاوز).", days: "روز ۲۱ تا ۳۵" },
      { title: "قرارداد + پرداخت امن", desc: "SPA امضا. از طریق Güvenli Ödeme Sistemi پرداخت (اجباری از مه ۲۰۲۶) — escrow از هر دو طرف محافظت می‌کند.", days: "روز ۳۰ تا ۴۵" },
      { title: "انتقال TAPU + تحویل", desc: "انتقال سند در اداره ثبت. کلیدها تحویل. اختیاری: شروع درخواست اقامت یا شهروندی.", days: "روز ۴۵ تا ۶۰" },
    ],
    costs_title: "هزینه واقعی خرید در ترکیه",
    costs_intro: "هزینه تقریبی end-to-end علاوه بر قیمت ملک. هزینه‌ها مشابه‌اند چه برای ROI، اقامت یا شهروندی بروید.",
    costs_disclaimer: "ارقام تقریبی برای ۲۰۲۶ روی ملک نمونه ۳۰۰,۰۰۰ دلاری. هزینه نهایی به شهر، نوع ملک و مسیر بستگی دارد.",
    cost_groups: [
      {
        title: "معامله یک‌باره",
        items: [
          { label: "هزینه انتقال TAPU (۴٪)", value: "از ۱۲,۰۰۰ دلار" },
          { label: "نوتاری + ترجمه رسمی", value: "از ۱,۵۰۰ دلار" },
          { label: "گزارش ارزیابی SPK", value: "از ۴۰۰ دلار" },
        ],
      },
      {
        title: "هزینه سالانه مالکیت",
        items: [
          { label: "مالیات ملک (شهری)", value: "۰.۲ تا ۰.۶٪ / سال" },
          { label: "مالیات ملک (غیرشهری)", value: "۰.۱ تا ۰.۳٪ / سال" },
          { label: "بیمه ساختمان / DASK", value: "از ۸۰ دلار / سال" },
        ],
      },
      {
        title: "افزونه‌های اختیاری",
        items: [
          { label: "وکیل / وکالت‌نامه", value: "از ۱,۵۰۰ دلار" },
          { label: "مدیریت ملک", value: "۸ تا ۱۲٪ اجاره" },
          { label: "پکیج مبلمان", value: "از ۸,۰۰۰ دلار" },
        ],
      },
    ],
    faq_title: "خرید ملک در ترکیه — پرسش‌های رایج",
    faq_items: [
      { question: "آیا مناطقی هست که خارجی‌ها نمی‌توانند بخرند؟", answer: "بله — مناطق نظامی، امنیتی استراتژیک و برخی نواحی مرزی محدود است. مناطق مسکونی استاندارد در استانبول، آنتالیا، بدروم، بورسا، ازمیر و آنکارا کاملاً برای خارجی‌ها باز است." },
      { question: "تفاوت آستانه ۲۰۰K و ۴۰۰K چیست؟", answer: "۲۰۰K در ملک، کارت اقامت سرمایه‌گذار ترکیه (قابل تمدید) می‌دهد. ۴۰۰K + نگهداری ۳ سال، شهروندی کامل می‌دهد. مکانیک خرید یکی است — کاغذبازی پایانی متفاوت." },
      { question: "آیا می‌توانم به‌عنوان خارجی وام مسکن ترکیه بگیرم؟", answer: "بله، اما با محدودیت‌ها — معمولاً تا ۵۰٪ LTV، ۵ تا ۱۰ سال، نرخ ۴ تا ۶ درصد بالاتر از پایه ترکیه. اکثر سرمایه‌گذاران CBI به جای آن نقد یا طرح پرداخت سازنده استفاده می‌کنند." },
      { question: "سیستم پرداخت امن (Güvenli Ödeme) چیست؟", answer: "از ۱ مه ۲۰۲۶، تمام پرداخت‌های ملک باید از طریق escrow بانکی جریان یابند. خریدار به بانک منتقل می‌کند، بانک پس از انتقال TAPU به فروشنده آزاد می‌کند. از کلاهبرداری محافظت می‌کند." },
      { question: "ارزیابی SPK چگونه کار می‌کند؟", answer: "یک ارزیاب دارای مجوز SPK ملک را بازرسی و گزارش مستقل تولید می‌کند. از ۲۰۲۶ ارزش ارزیابی باید با قیمت واقعی فروش برابر باشد — هم کم‌ارزش‌گذاری و هم بیش‌ارزش‌گذاری می‌تواند درخواست را باطل کند." },
      { question: "آیا می‌توانم آف‌پلن بخرم و واجد شهروندی باشم؟", answer: "بله — اما ملک باید در زمان درخواست شهروندی با TAPU به نام شما ثبت شده باشد. واحدهای آف‌پلن معمولاً ۱۲ تا ۲۴ ماه پس از فروش تحویل می‌شوند؛ پس از تحویل می‌توانید درخواست شهروندی دهید." },
      { question: "وضعیت مالیات اجاره چگونه است؟", answer: "درآمد اجاره تا ۱۳,۰۰۰ لیر در سال (~۳۸۰ دلار) به ازای مالک در ۲۰۲۶ معاف است. بالاتر از آن مالیات تصاعدی ۱۵ تا ۴۰٪ با کسر استاندارد برای نگهداری، حق‌العمل و استهلاک." },
      { question: "آیا می‌توانم چند ملک بخرم تا به ۴۰۰K برسم؟", answer: "بله. می‌توانید ۲ یا چند ملک — مسکونی، تجاری یا زمین — با مجموع ۴۰۰,۰۰۰ دلار، همه با annotation ۳ ساله عدم فروش، برای واجد شهروندی ترکیب کنید." },
    ],
    crosssell_title: "سایر خدمات ترکیه",
    crosssell_citizenship_title: "شهروندی ترکیه",
    crosssell_citizenship_desc: "ملک ۴۰۰K را به پاسپورت تبدیل کنید",
    crosssell_company_title: "ثبت شرکت در ترکیه",
    crosssell_company_desc: "ملک + کسب‌وکار ترکی را ترکیب کنید",
    crosssell_uae_title: "خرید ملک در دبی",
    crosssell_uae_desc: "مقایسه با بازار املاک امارات",
    lead_title: "لیست کوتاه ملک متناسب با هدف",
    lead_sub: "بودجه، شهر و هدف (ROI / اقامت / شهروندی) را بنویسید — ۵ تا ۷ ملک منطبق + هزینه کل را در ۲۴ ساعت می‌فرستیم.",
  },
  ar: {
    breadcrumb_turkey: "تركيا",
    breadcrumb_self: "شراء عقار",
    hero_h1: "شراء عقار في تركيا 2026 — إسطنبول، أنطاليا، بودروم والمزيد",
    hero_sub:
      "يمكن للأجانب شراء عقار تملك حر في جميع أنحاء تركيا من 80,000 دولار. حدّان رئيسيان: 200,000 دولار لإقامة المستثمر، 400,000 دولار للجنسية. ارتفاع رأس المال + عوائد إيجار 5 إلى 8٪.",
    hero_badge: "عقار تركيا 2026",
    hero_placeholder: "اسأل عن مناطق إسطنبول، عقارات على الخارطة، الوحدات الفندقية، حدود الإقامة…",
    stats: [
      { num: "80 ألف $", label: "سعر البداية" },
      { num: "200K → الإقامة", label: "حد الإقامة" },
      { num: "400K → الجنسية", label: "حد الجنسية" },
      { num: "5–8٪", label: "عائد الإيجار" },
    ],
    cities_eyebrow: "أفضل المدن",
    cities_title: "أين يشتري الأجانب في 2026",
    cities_sub: "إسطنبول الأولى من حيث الحجم. أنطاليا للإيجار السياحي. بودروم للفخامة. اختر المدينة المناسبة لهدفك.",
    cities: [
      { name: "إسطنبول", type: "العاصمة التجارية · أكبر سوق", highlights: ["إطلالات البوسفور", "أعمق سيولة لإعادة البيع", "الجانبان الأوروبي والآسيوي"], price_from: "من 140,000 $", yield: "عائد 5 إلى 6٪" },
      { name: "أنطاليا", type: "البحر المتوسط · سياحي", highlights: ["سياحة طوال السنة", "وحدات بعلامات منتجعية", "شعبية بين الروس"], price_from: "من 90,000 $", yield: "عائد 6 إلى 8٪" },
      { name: "بودروم", type: "بحر إيجة · فاخر", highlights: ["فلل بوتيك", "أسلوب حياة المرسى", "أعلى عوائد صيفية"], price_from: "من 200,000 $", yield: "عائد 5 إلى 7٪" },
      { name: "بورصة", type: "صناعي · عائلي", highlights: ["أسعار دخول أقل", "1.5 ساعة من إسطنبول", "مناسب للعائلات"], price_from: "من 80,000 $", yield: "عائد 5 إلى 6٪" },
      { name: "إزمير", type: "ساحلي · في نمو", highlights: ["أسلوب حياة بحر إيجة", "مشهد تقني نامي", "أرخص من إسطنبول"], price_from: "من 90,000 $", yield: "عائد 5 إلى 7٪" },
      { name: "أنقرة", type: "العاصمة · مستقر", highlights: ["مركز الحكومة", "حي السفارات", "طلب إيجار مستقر"], price_from: "من 85,000 $", yield: "عائد 5 إلى 6٪" },
    ],
    cities_price_label: "من",
    cities_yield_label: "العائد",
    why_eyebrow: "لماذا عقار تركيا",
    why_title: "لماذا تشتري عقار تركيا في 2026",
    why_items: [
      { title: "فتح إقامة بمستويين", desc: "200K تفتح إقامة المستثمر. 400K تفتح الجنسية. نفس نوع العقار، مسار ترقية مختلف." },
      { title: "ارتفاع رأسمالي قوي", desc: "إسطنبول والمدن الساحلية الرئيسية ارتفعت 20–40٪ سنوياً. طلب من السياحة والمحليين والرحالة الرقميين." },
      { title: "تملك حر حقيقي للأجانب", desc: "يمكن للأجانب تملك سكني وتجاري وأرض. TAPU قابل للنقل والوراثة بالكامل." },
      { title: "مرونة العقارات على الخارطة", desc: "الوحدات على الخارطة قد تكون أرخص بـ 20–30٪ من الجاهزة مع خطط أقساط 60 شهراً من المطورين الكبار." },
      { title: "إعفاء من ضريبة الأرباح الرأسمالية", desc: "احتفظ 5 سنوات وستدفع 0٪ ضريبة على إعادة البيع — أحد أفضل أنظمة CGT عالمياً." },
      { title: "ضريبة إيجار مرنة", desc: "الإيجار حتى 13,000 ليرة/سنة لكل مالك معفى في 2026. فوقها ضريبة تصاعدية 15–40٪ مع خصومات قياسية." },
    ],
    steps_title: "كيف يتم شراء العقار في تركيا",
    steps: [
      { title: "تقييم + اختيار المدينة", desc: "نؤكد هدفك — جنسية أو إقامة أو ROI — ونحضر قائمة قصيرة من المدن والأحياء.", days: "اليوم 1 إلى 7" },
      { title: "الرقم الضريبي + الحساب البنكي", desc: "نحصل على رقمك الضريبي التركي ونفتح حساباً بنكياً لتحويل الأموال بشكل قانوني.", days: "اليوم 7 إلى 14" },
      { title: "زيارات العقار + الحجز", desc: "زيارات فعلية أو افتراضية. نتفاوض على السعر ونضع عربون حجز (1–5٪).", days: "اليوم 14 إلى 25" },
      { title: "تقييم SPK + التدقيق", desc: "تقرير تقييم SPK إلزامي وفحص السند بقيادة محامٍ (لا رهن، لا ديون، لا تعدي).", days: "اليوم 21 إلى 35" },
      { title: "العقد + الدفع الآمن", desc: "توقيع SPA. الدفع عبر Güvenli Ödeme Sistemi (إلزامي من مايو 2026) — حساب الضمان يحمي الطرفين.", days: "اليوم 30 إلى 45" },
      { title: "نقل TAPU + التسليم", desc: "نقل سند الملكية في السجل العقاري. تسليم المفاتيح. اختياري: بدء طلب الإقامة أو الجنسية.", days: "اليوم 45 إلى 60" },
    ],
    costs_title: "تكاليف حقيقية للشراء في تركيا",
    costs_intro: "تكلفة شاملة إرشادية فوق سعر العقار. الرسوم نفسها سواء كنت تذهب لـ ROI أو إقامة أو جنسية.",
    costs_disclaimer: "أرقام إرشادية لـ 2026 على عقار نموذجي 300,000 $. التكلفة النهائية تعتمد على المدينة ونوع العقار والمسار.",
    cost_groups: [
      {
        title: "معاملة لمرة واحدة",
        items: [
          { label: "رسوم نقل TAPU (4٪)", value: "من 12,000 $" },
          { label: "كاتب عدل + ترجمة محلفة", value: "من 1,500 $" },
          { label: "تقرير تقييم SPK", value: "من 400 $" },
        ],
      },
      {
        title: "تكلفة الملكية السنوية",
        items: [
          { label: "ضريبة عقار (حضري)", value: "0.2–0.6٪ / سنة" },
          { label: "ضريبة عقار (غير حضري)", value: "0.1–0.3٪ / سنة" },
          { label: "تأمين المبنى / DASK", value: "من 80 $ / سنة" },
        ],
      },
      {
        title: "إضافات اختيارية",
        items: [
          { label: "محامٍ / توكيل", value: "من 1,500 $" },
          { label: "إدارة العقار", value: "8–12٪ من الإيجار" },
          { label: "حزمة الأثاث", value: "من 8,000 $" },
        ],
      },
    ],
    faq_title: "شراء عقار في تركيا — أسئلة شائعة",
    faq_items: [
      { question: "هل توجد مناطق لا يمكن للأجانب الشراء فيها؟", answer: "نعم — مناطق عسكرية وأمنية استراتيجية وبعض المناطق الحدودية مقيدة. المناطق السكنية القياسية في إسطنبول وأنطاليا وبودروم وبورصة وإزمير وأنقرة مفتوحة بالكامل للأجانب." },
      { question: "ما الفرق بين حدّي 200K و 400K؟", answer: "200K في العقار يمنحك بطاقة إقامة المستثمر التركية (قابلة للتجديد). 400K + احتفاظ 3 سنوات يمنحك الجنسية التركية الكاملة. آلية الشراء واحدة — الأوراق النهائية مختلفة." },
      { question: "هل يمكنني الحصول على رهن تركي كأجنبي؟", answer: "نعم، لكن بقيود — عادة حتى 50٪ من قيمة العقار، 5–10 سنوات، ونسب 4–6 نقاط مئوية فوق القاعدة التركية. معظم مستثمري CBI يستخدمون النقد أو خطط دفع المطور." },
      { question: "ما هو نظام الدفع الآمن (Güvenli Ödeme)؟", answer: "من 1 مايو 2026، جميع مدفوعات العقار يجب أن تتدفق عبر حساب ضمان بنكي. المشتري يحول للبنك، البنك يفرج للبائع فقط بعد نقل TAPU. يحمي الطرفين من الاحتيال." },
      { question: "كيف يعمل تقييم SPK؟", answer: "مقيم مرخص من SPK يفحص العقار وينتج تقريراً مستقلاً. من 2026 يجب أن تساوي القيمة المقدرة سعر البيع الفعلي — التقدير الأقل أو الأعلى يمكن أن يبطل الطلب." },
      { question: "هل يمكنني شراء على الخارطة والتأهل للجنسية؟", answer: "نعم — لكن العقار يجب أن يكون مسجلاً باسمك بـ TAPU في وقت طلب الجنسية. الوحدات على الخارطة تُسلم عادة بعد 12–24 شهراً من البيع؛ يمكن التقديم على الجنسية بعد التسليم." },
      { question: "ما وضع ضريبة الإيجار؟", answer: "إيجار حتى 13,000 ليرة/سنة لكل مالك معفى في 2026. فوقها ضريبة تصاعدية 15–40٪ مع خصومات قياسية للصيانة والوكيل والإهلاك." },
      { question: "هل يمكنني شراء عدة عقارات للوصول إلى 400K؟", answer: "نعم. يمكنك دمج عقارين أو أكثر — سكني، تجاري أو أرض — بإجمالي 400,000 $ أو أكثر، كلها مع annotation عدم البيع لـ 3 سنوات، للتأهل للجنسية." },
    ],
    crosssell_title: "خدمات تركيا الأخرى",
    crosssell_citizenship_title: "الجنسية التركية",
    crosssell_citizenship_desc: "حول عقار 400K إلى جواز سفر",
    crosssell_company_title: "تأسيس شركة في تركيا",
    crosssell_company_desc: "اجمع العقار مع عمل تركي",
    crosssell_uae_title: "شراء عقار في دبي",
    crosssell_uae_desc: "قارن مع سوق العقارات الإماراتي",
    lead_title: "احصل على قائمة عقارات مخصصة لهدفك",
    lead_sub: "أخبرنا بميزانيتك ومدينتك وهدفك (ROI / إقامة / جنسية) — سنرسل 5 إلى 7 عقارات مطابقة + التكلفة الإجمالية خلال 24 ساعة.",
  },
  ru: {
    breadcrumb_turkey: "Турция",
    breadcrumb_self: "Покупка недвижимости",
    hero_h1: "Покупка недвижимости в Турции 2026 — Стамбул, Анталья, Бодрум и больше",
    hero_sub:
      "Иностранцы могут покупать freehold-недвижимость по всей Турции от 80 000 $. Два ключевых порога: 200 000 $ для ВНЖ инвестора, 400 000 $ для гражданства. Сильный рост капитала + 5–8% доходности аренды.",
    hero_badge: "Недвижимость Турции 2026",
    hero_placeholder: "Спросите про районы Стамбула, off-plan, брендированные резиденции, пороги ВНЖ…",
    stats: [
      { num: "$80K", label: "Цена входа" },
      { num: "$200K → ВНЖ", label: "Порог ВНЖ" },
      { num: "$400K → CBI", label: "Порог гражданства" },
      { num: "5–8%", label: "Доходность аренды" },
    ],
    cities_eyebrow: "Лучшие города",
    cities_title: "Где иностранцы покупают в 2026",
    cities_sub: "Стамбул лидирует по объёму. Анталья — по туристической аренде. Бодрум — по люксу. Выбирайте город под цель.",
    cities: [
      { name: "Стамбул", type: "Деловая столица · крупнейший рынок", highlights: ["Виды на Босфор", "Глубокая ликвидность для перепродажи", "Европейская и азиатская стороны"], price_from: "От $140 000", yield: "Доходность 5–6%" },
      { name: "Анталья", type: "Средиземное море · туристический", highlights: ["Круглогодичный туризм", "Юниты под брендом курортов", "Популярна у россиян"], price_from: "От $90 000", yield: "Доходность 6–8%" },
      { name: "Бодрум", type: "Эгейское · люкс", highlights: ["Бутиковые виллы", "Жизнь у марины", "Лучшая летняя доходность"], price_from: "От $200 000", yield: "Доходность 5–7%" },
      { name: "Бурса", type: "Промышленный · семейный", highlights: ["Низкий порог входа", "1.5 ч от Стамбула", "Удобно для семей"], price_from: "От $80 000", yield: "Доходность 5–6%" },
      { name: "Измир", type: "Прибрежный · растущий", highlights: ["Эгейский образ жизни", "Растущая ИТ-сцена", "Дешевле Стамбула"], price_from: "От $90 000", yield: "Доходность 5–7%" },
      { name: "Анкара", type: "Столица · стабильный", highlights: ["Госхаб", "Район посольств", "Стабильный спрос на аренду"], price_from: "От $85 000", yield: "Доходность 5–6%" },
    ],
    cities_price_label: "От",
    cities_yield_label: "Доходность",
    why_eyebrow: "Почему недвижимость Турции",
    why_title: "Почему покупать недвижимость Турции в 2026",
    why_items: [
      { title: "Двухуровневое открытие ВНЖ", desc: "$200K открывает ВНЖ инвестора. $400K открывает гражданство. Один тип объекта, разный путь апгрейда." },
      { title: "Сильный рост капитала", desc: "Стамбул и крупные прибрежные города выросли на 20–40% в год. Спрос от туризма, местных и цифровых кочевников." },
      { title: "Настоящий freehold для иностранцев", desc: "Иностранцы могут владеть жильём, коммерцией и землёй. ТАПУ полностью передаётся и наследуется." },
      { title: "Гибкость off-plan", desc: "Объекты на стадии строительства могут быть на 20–30% дешевле готовых, с рассрочкой 60 месяцев от крупных застройщиков." },
      { title: "Освобождение от налога на прирост капитала", desc: "Удерживайте 5 лет — и платите 0% налога на перепродажу — один из лучших режимов CGT в мире." },
      { title: "Налог на аренду гибкий", desc: "Аренда до 13 000 TRY/год на собственника не облагается в 2026. Выше — прогрессивный налог 15–40% со стандартными вычетами." },
    ],
    steps_title: "Как идёт покупка недвижимости в Турции",
    steps: [
      { title: "Скрининг + выбор города", desc: "Подтверждаем цель — гражданство, ВНЖ или ROI — и формируем shortlist городов и районов.", days: "День 1–7" },
      { title: "ИНН + банковский счёт", desc: "Получаем турецкий ИНН и открываем счёт для законного перевода средств.", days: "День 7–14" },
      { title: "Просмотры + бронь", desc: "Очные или виртуальные просмотры. Согласуем цену и вносим резервный депозит (1–5%).", days: "День 14–25" },
      { title: "Оценка SPK + due diligence", desc: "Обязательный отчёт оценки SPK и юридический check титула (без обременений, долгов, нарушений).", days: "День 21–35" },
      { title: "Договор + Безопасный платёж", desc: "Подписание SPA. Оплата через Güvenli Ödeme Sistemi (обязательно с мая 2026) — эскроу защищает обе стороны.", days: "День 30–45" },
      { title: "Передача ТАПУ + ключи", desc: "Передача права в Кадастре. Передача ключей. Опционально: запуск заявки на ВНЖ или гражданство.", days: "День 45–60" },
    ],
    costs_title: "Реальные расходы при покупке в Турции",
    costs_intro: "Ориентировочная полная стоимость поверх цены объекта. Сборы те же — для ROI, ВНЖ или гражданства.",
    costs_disclaimer: "Ориентировочные данные на 2026 для объекта в $300 000. Финал зависит от города, типа объекта и маршрута.",
    cost_groups: [
      {
        title: "Разовая сделка",
        items: [
          { label: "Сбор ТАПУ (4%)", value: "От $12 000" },
          { label: "Нотариус + присяжный перевод", value: "От $1 500" },
          { label: "Отчёт оценки SPK", value: "От $400" },
        ],
      },
      {
        title: "Ежегодное владение",
        items: [
          { label: "Налог на недвижимость (город)", value: "0.2–0.6% / год" },
          { label: "Налог на недвижимость (вне города)", value: "0.1–0.3% / год" },
          { label: "Страхование зданий / DASK", value: "От $80 / год" },
        ],
      },
      {
        title: "Опции",
        items: [
          { label: "Юрист / доверенность", value: "От $1 500" },
          { label: "Управление", value: "8–12% от аренды" },
          { label: "Меблировка", value: "От $8 000" },
        ],
      },
    ],
    faq_title: "Покупка недвижимости в Турции — FAQ",
    faq_items: [
      { question: "Есть ли районы, где иностранцам нельзя покупать?", answer: "Да — военные, стратегические и некоторые приграничные зоны. Стандартные жилые районы в Стамбуле, Анталье, Бодруме, Бурсе, Измире и Анкаре полностью открыты иностранцам." },
      { question: "В чём разница порогов $200K и $400K?", answer: "$200K даёт ВНЖ инвестора Турции (продлеваемый). $400K + 3 года удержания — полное гражданство Турции. Механика покупки одна — итоговые документы разные." },
      { question: "Можно ли иностранцу взять турецкую ипотеку?", answer: "Да, но с оговорками — обычно до 50% LTV, 5–10 лет, ставки на 4–6 п.п. выше базовой. Большинство CBI-инвесторов используют наличные или рассрочку застройщика." },
      { question: "Что такое Система безопасных платежей (Güvenli Ödeme)?", answer: "С 1 мая 2026 все платежи за недвижимость должны идти через банковский эскроу. Покупатель переводит в банк, банк отдаёт продавцу только после передачи ТАПУ. Защита обеих сторон от мошенничества." },
      { question: "Как работает оценка SPK?", answer: "Оценщик с лицензией SPK инспектирует объект и выдаёт независимый отчёт. С 2026 оценка должна равняться фактической цене сделки — заниженная или завышенная оценка может аннулировать заявку." },
      { question: "Можно ли купить off-plan и получить гражданство?", answer: "Да — но объект должен быть оформлен на вас с ТАПУ к моменту подачи на гражданство. Off-plan обычно сдают через 12–24 месяца после продажи; подавать на гражданство можно после сдачи." },
      { question: "Как с налогом на аренду?", answer: "Аренда до 13 000 TRY/год на собственника не облагается в 2026. Выше — прогрессивный налог 15–40% с вычетами на содержание, агента и амортизацию." },
      { question: "Можно ли купить несколько объектов до $400K?", answer: "Да. Можно объединить 2 и более объектов — жильё, коммерция или земля — на сумму от $400 000, все с 3-летней отметкой запрета продажи, для гражданства." },
    ],
    crosssell_title: "Другие услуги Турции",
    crosssell_citizenship_title: "Гражданство Турции",
    crosssell_citizenship_desc: "Превратите $400K в паспорт",
    crosssell_company_title: "Регистрация компании в Турции",
    crosssell_company_desc: "Совмещайте недвижимость с бизнесом",
    crosssell_uae_title: "Недвижимость Дубая",
    crosssell_uae_desc: "Сравните с рынком ОАЭ",
    lead_title: "Получите шортлист объектов под вашу цель",
    lead_sub: "Расскажите про бюджет, город и цель (ROI / ВНЖ / гражданство) — пришлём 5–7 подходящих объектов + полную стоимость в течение 24 часов.",
  },
};

export default function TurkeyBuyPropertyClient() {
  const { lang } = useLanguage();
  const c = CONTENT[lang];
  const homeHref = lang === "en" ? "/" : `/${lang}/`;
  const turkeyHref = lang === "en" ? "/turkey/" : `/${lang}/turkey/`;
  const linkPath = (path: string) => (lang === "en" ? `/${path}` : `/${lang}/${path}`);

  const breadcrumbItems = [
    { label: "Residency24", href: homeHref },
    { label: c.breadcrumb_turkey, href: turkeyHref },
    { label: c.breadcrumb_self },
  ];

  const crossSellItems: CrossSellItem[] = [
    {
      title: c.crosssell_citizenship_title,
      description: c.crosssell_citizenship_desc,
      icon: Award,
      href: linkPath("turkey/citizenship/"),
      isHighlighted: true,
    },
    {
      title: c.crosssell_company_title,
      description: c.crosssell_company_desc,
      icon: Building2,
      href: linkPath("turkey/company-registration/"),
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

        {/* Top cities */}
        <section className="py-16 bg-surface">
          <div className="max-w-5xl mx-auto px-4">
            <div className="text-center mb-10">
              <p className="text-xs uppercase tracking-wider text-gold mb-2">{c.cities_eyebrow}</p>
              <h2 className="text-2xl md:text-3xl font-bold text-navy mb-3">{c.cities_title}</h2>
              <p className="text-sm text-muted-foreground max-w-2xl mx-auto">{c.cities_sub}</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {c.cities.map((city, i) => (
                <div key={i} className="bg-white border border-border rounded-xl p-5">
                  <div className="w-9 h-9 rounded-lg bg-gold/10 flex items-center justify-center mb-3">
                    <MapPin className="w-5 h-5 text-gold" />
                  </div>
                  <h3 className="text-base font-bold text-navy mb-1">{city.name}</h3>
                  <p className="text-xs text-gold/80 mb-3">{city.type}</p>
                  <ul className="space-y-1 mb-3">
                    {city.highlights.map((h, j) => (
                      <li key={j} className="text-xs text-muted-foreground">• {h}</li>
                    ))}
                  </ul>
                  <div className="flex items-center justify-between text-xs pt-2 border-t border-border">
                    <span className="font-bold text-navy">
                      {c.cities_price_label}: <span className="text-gold">{city.price_from}</span>
                    </span>
                    <span className="text-muted-foreground">{city.yield}</span>
                  </div>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
          serviceContext="turkey_buy_property"
          title={c.lead_title}
          subtitle={c.lead_sub}
        />
      </main>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}

