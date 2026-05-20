"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import Navbar from "@/components/Navbar";
import HeroChat from "@/components/HeroChat";
import TrustBar from "@/components/TrustBar";
import SharedBreadcrumb from "@/components/shared/SharedBreadcrumb";
import SharedFAQ from "@/components/shared/SharedFAQ";
import SharedCrossSell from "@/components/shared/SharedCrossSell";
import SharedLeadForm from "@/components/shared/SharedLeadForm";
import NationalityHooks from "@/components/NationalityHooks";
import HowItWorks from "@/components/HowItWorks";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import {
  Award,
  Building,
  Building2,
  Globe2,
  IdCard,
  MapPin,
  Plane,
  ShieldCheck,
  TrendingUp,
  Users,
  Zap,
  Bell,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
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

type Route = {
  type: string;
  amount: string;
  hold: string;
  result: string;
  best: string;
  highlighted?: boolean;
};

type City = {
  name: string;
  type: string;
  highlights: string;
  price_from: string;
};

interface Content {
  breadcrumb: string;
  hero_h1: string;
  hero_sub: string;
  hero_badge: string;
  hero_placeholder: string;
  stats: { num: string; label: string }[];
  services_eyebrow: string;
  services_title: string;
  services: Service[];
  services_view: string;
  why_eyebrow: string;
  why_title: string;
  why_items: { icon: typeof Award; title: string; desc: string }[];
  routes_eyebrow: string;
  routes_title: string;
  routes_sub: string;
  routes: Route[];
  routes_amount_label: string;
  routes_hold_label: string;
  routes_result_label: string;
  routes_best_label: string;
  alert_eyebrow: string;
  alert_title: string;
  alert_items: string[];
  costs_eyebrow: string;
  costs_title: string;
  costs_intro: string;
  costs_disclaimer: string;
  cost_groups: { title: string; items: { label: string; value: string }[] }[];
  cities_eyebrow: string;
  cities_title: string;
  cities_sub: string;
  cities: City[];
  cities_price_label: string;
  faq_title: string;
  faq_items: FAQItem[];
  crosssell_title: string;
  crosssell_citizenship_title: string;
  crosssell_citizenship_desc: string;
  crosssell_property_title: string;
  crosssell_property_desc: string;
  crosssell_uae_title: string;
  crosssell_uae_desc: string;
  crosssell_oman_title: string;
  crosssell_oman_desc: string;
  lead_title: string;
  lead_sub: string;
}

const CONTENT: Record<Lang, Content> = {
  en: {
    breadcrumb: "Turkey",
    hero_h1: "Turkey 2026: Citizenship, Residency & Real Estate — Your Bridge Between Europe and Asia",
    hero_sub:
      "Turkish passport via property from $400,000 (110+ visa-free countries) · Investor residency from $200,000 · Family included. Citizenship in 6–8 months — one of the fastest CBI programs in the world.",
    hero_badge: "Turkey 2026",
    hero_placeholder: "Ask about Turkish citizenship, property in Istanbul, residence permit…",
    stats: [
      { num: "$400K", label: "Citizenship via real estate" },
      { num: "6–8 mo", label: "Passport timeline" },
      { num: "110+", label: "Visa-free countries" },
      { num: "$200K", label: "Residency via property" },
    ],
    services_eyebrow: "Turkey services",
    services_title: "What we do in Turkey",
    services: [
      {
        icon: Award,
        title: "Turkish Citizenship by Investment",
        desc: "Turkish passport in 6–8 months via $400,000 in real estate. Family included. Dual citizenship allowed.",
        price: "From $400,000",
        href: "/turkey/citizenship/",
        badge: "Most popular",
      },
      {
        icon: Building,
        title: "Buy Property in Turkey",
        desc: "Istanbul, Antalya, Bodrum, Bursa. Freehold for foreigners. Strong rental yield + capital appreciation.",
        price: "From $80,000",
        href: "/turkey/buy-property/",
      },
      {
        icon: Building2,
        title: "Company Registration",
        desc: "Turkish LLC (Limited Şirket) or JSC. 100% foreign ownership. Bridge Europe-Asia. EU customs union access.",
        price: "From $1,500",
        href: "/turkey/company-registration/",
      },
      {
        icon: Plane,
        title: "Tourist eVisa",
        desc: "Online tourist eVisa for 30 to 90 days — apply online for property scouting trips or family visits.",
        price: "From $50",
        href: "/turkey/tourist-visa/",
      },
    ],
    services_view: "Learn more",
    why_eyebrow: "Why Turkey",
    why_title: "Why choose Turkey in 2026",
    why_items: [
      { icon: Award, title: "Fastest CBI in the world", desc: "Turkish passport in 6–8 months — among the fastest citizenship-by-investment programs globally." },
      { icon: Globe2, title: "110+ visa-free countries", desc: "Visa-free or visa-on-arrival to 110+ countries including Japan, Singapore, Hong Kong, South Korea." },
      { icon: TrendingUp, title: "Strong real estate ROI", desc: "Istanbul property up 20-40% YoY. Strong rental demand from tourism, locals and digital nomads." },
      { icon: Users, title: "Whole family in one go", desc: "Spouse and dependent children under 18 receive citizenship on the same investment — single payment." },
      { icon: Globe2, title: "Bridge Europe + Asia", desc: "Strategic location with direct flights to Europe, MENA, Central Asia. EU Customs Union member." },
      { icon: ShieldCheck, title: "Dual citizenship allowed", desc: "Keep your original passport. Turkish nationality is granted in addition, not as a replacement." },
    ],
    routes_eyebrow: "Investment routes",
    routes_title: "Five qualifying routes to Turkish citizenship",
    routes_sub: "Real estate is by far the most popular path. Choose the route that matches your capital, business plan and timeline.",
    routes: [
      { type: "Real estate", amount: "$400,000+", hold: "3 years", result: "Citizenship", best: "Property investors, families", highlighted: true },
      { type: "Bank deposit", amount: "$500,000+", hold: "3 years", result: "Citizenship", best: "Liquid capital, low effort" },
      { type: "Government bonds", amount: "$500,000+", hold: "3 years", result: "Citizenship", best: "Conservative investors" },
      { type: "Fixed capital", amount: "$500,000+", hold: "3 years", result: "Citizenship", best: "Active business owners" },
      { type: "Job creation", amount: "50 employees", hold: "3 years", result: "Citizenship", best: "Established operators" },
    ],
    routes_amount_label: "Min amount",
    routes_hold_label: "Hold period",
    routes_result_label: "Result",
    routes_best_label: "Best for",
    alert_eyebrow: "2026 updates",
    alert_title: "What changes in Turkey on May 1, 2026",
    alert_items: [
      "All real estate payments must go through Güvenli Ödeme Sistemi (Safe Payment System) — a new mandatory escrow protecting both buyer and seller.",
      "Residence permit fees rise to $631/year (1-yr) and $1,857/3-year — applies to renewals after May 1.",
      "Investor residency threshold via property remains at $200,000 — same as 2025.",
      "Citizenship via property remains at $400,000 — same as 2025. Processing time has dropped to 4–6 months in 2026 with full documentation.",
      "Property valuations must equal the contract price — under-valuation can void your residency or citizenship application.",
    ],
    costs_eyebrow: "Costs",
    costs_title: "Real costs in Turkey 2026",
    costs_intro: "Indicative all-in pricing for the most common Turkey pathways. Final figures depend on the property, family size and route.",
    costs_disclaimer: "Figures are indicative for 2026 and exclude personal expenses (school, lifestyle). Contact us for an exact quote.",
    cost_groups: [
      {
        title: "Citizenship via real estate ($400K)",
        items: [
          { label: "Property minimum", value: "$400,000" },
          { label: "Government & legal fees", value: "From $8,000" },
          { label: "Service fee (turnkey)", value: "From $7,000" },
        ],
      },
      {
        title: "Investor residency via property",
        items: [
          { label: "Property minimum", value: "$200,000" },
          { label: "Residence permit fee (1-yr)", value: "$631" },
          { label: "Residence permit fee (3-yr)", value: "$1,857" },
        ],
      },
      {
        title: "Company registration",
        items: [
          { label: "LLC setup (one shareholder)", value: "From $1,500" },
          { label: "Bank account opening", value: "From $300" },
          { label: "Annual accounting", value: "From $1,200/yr" },
        ],
      },
    ],
    cities_eyebrow: "Where to invest",
    cities_title: "Top cities for foreign buyers in 2026",
    cities_sub: "Istanbul still dominates volume, but secondary cities offer better rental yields and lower entry prices.",
    cities: [
      { name: "Istanbul", type: "Capital · Largest market", highlights: "Bosphorus views, EU side and Asian side, deep liquidity for resale", price_from: "From $140,000" },
      { name: "Antalya", type: "Mediterranean · Tourist", highlights: "Year-round tourism, branded resort units, popular with Russians", price_from: "From $90,000" },
      { name: "Bodrum", type: "Aegean · Luxury", highlights: "Boutique villas, marina, top-tier rental yields in summer", price_from: "From $200,000" },
      { name: "Bursa", type: "Industrial · Family", highlights: "Lower entry prices, good for families, near Istanbul (1.5 hr)", price_from: "From $80,000" },
      { name: "Izmir", type: "Coastal · Growing", highlights: "Aegean lifestyle, growing tech scene, undervalued vs Istanbul", price_from: "From $90,000" },
      { name: "Ankara", type: "Capital · Stable", highlights: "Government and embassy hub, stable rental demand", price_from: "From $85,000" },
    ],
    cities_price_label: "From",
    faq_title: "Frequently asked questions about Turkey",
    faq_items: [
      {
        question: "What is the minimum investment for Turkish citizenship in 2026?",
        answer:
          "$400,000 in real estate, held for at least 3 years, is the most popular route. Bank deposit, government bonds, fixed capital and job creation routes also exist at $500,000 (or 50 employees). Citizenship is typically granted in 6–8 months.",
      },
      {
        question: "Can foreigners buy property freely in Turkey?",
        answer:
          "Yes. Foreigners can buy freehold property in most parts of Turkey, except certain restricted military or border zones. The TAPU (title deed) is registered in your name and is fully transferable and inheritable.",
      },
      {
        question: "What changes on May 1, 2026?",
        answer:
          "All real estate transactions must go through Güvenli Ödeme Sistemi (Safe Payment System) — a mandatory bank-managed escrow. Residence permit renewal fees also increase to $631 for 1 year or $1,857 for 3 years.",
      },
      {
        question: "Does Turkey allow dual citizenship?",
        answer:
          "Yes. Turkey allows dual nationality. You keep your original passport while gaining Turkish citizenship. Some home countries restrict this — we help you check yours during onboarding.",
      },
      {
        question: "Are family members included in the citizenship?",
        answer:
          "Yes. Your spouse and dependent children under 18 are included in the same investment with no additional minimum. Children over 18 require their own application.",
      },
      {
        question: "How long do I need to live in Turkey to keep citizenship?",
        answer:
          "There is no minimum stay requirement for the citizenship-by-investment route. Once granted, citizenship is permanent and not tied to physical presence.",
      },
      {
        question: "Can I sell the property after 3 years?",
        answer:
          "Yes. The 3-year hold period is a strict legal restriction. After 3 years, you can sell the property freely without affecting your citizenship — citizenship, once granted, is permanent.",
      },
      {
        question: "How are payments made under the new Safe Payment System?",
        answer:
          "From May 1, 2026, the buyer transfers funds to a Turkish bank account, the bank holds the money in escrow, and releases it to the seller only after the TAPU transfer is complete. This protects both parties from fraud.",
      },
      {
        question: "What's the difference between residency and citizenship in Turkey?",
        answer:
          "Residency (Ikamet) gives you the right to live in Turkey from $200,000 in property — renewed every 1 or 2 years. Citizenship from $400,000 gives you a Turkish passport, permanent and inheritable, with no minimum stay.",
      },
      {
        question: "Can I apply remotely without visiting Turkey?",
        answer:
          "Most steps can be handled remotely via Power of Attorney (PoA). A short visit (3–5 days) is recommended to view properties and complete the TAPU signing, but is not strictly required.",
      },
    ],
    crosssell_title: "Other paths to consider",
    crosssell_citizenship_title: "Turkish Citizenship",
    crosssell_citizenship_desc: "Passport via property — full guide",
    crosssell_property_title: "Buy Property in Turkey",
    crosssell_property_desc: "Istanbul, Antalya, Bodrum & more",
    crosssell_uae_title: "UAE Golden Visa",
    crosssell_uae_desc: "Compare with 10-year UAE residency",
    crosssell_oman_title: "Oman Investor Residency",
    crosssell_oman_desc: "Calmer alternative — 5/10-year card",
    lead_title: "Get your free Turkey roadmap",
    lead_sub: "Tell us your goal and budget — we'll send a tailored Turkey plan with eligibility, cities and total cost within 24 hours.",
  },
  fa: {
    breadcrumb: "ترکیه",
    hero_h1: "ترکیه ۲۰۲۶: شهروندی، اقامت و خرید ملک — پل اروپا و آسیا",
    hero_sub:
      "پاسپورت ترکیه از طریق ملک ۴۰۰,۰۰۰ دلار (سفر بدون ویزا به ۱۱۰+ کشور) · اقامت سرمایه‌گذار از ۲۰۰,۰۰۰ دلار · شامل خانواده. شهروندی در ۶ تا ۸ ماه — یکی از سریع‌ترین برنامه‌های CBI جهان.",
    hero_badge: "ترکیه ۲۰۲۶",
    hero_placeholder: "درباره شهروندی ترکیه، خرید ملک استانبول، اقامت ترکیه بپرسید…",
    stats: [
      { num: "۴۰۰K دلار", label: "شهروندی از طریق ملک" },
      { num: "۶ تا ۸ ماه", label: "زمان دریافت پاسپورت" },
      { num: "۱۱۰+", label: "کشور بدون ویزا" },
      { num: "۲۰۰K دلار", label: "اقامت از طریق ملک" },
    ],
    services_eyebrow: "خدمات ترکیه",
    services_title: "چه خدماتی در ترکیه ارائه می‌دهیم؟",
    services: [
      {
        icon: Award,
        title: "شهروندی ترکیه با سرمایه‌گذاری",
        desc: "پاسپورت ترکیه در ۶ تا ۸ ماه با ۴۰۰,۰۰۰ دلار ملک. شامل خانواده. تابعیت دوگانه مجاز.",
        price: "از ۴۰۰,۰۰۰ دلار",
        href: "/fa/turkey/citizenship/",
        badge: "پرطرفدار",
      },
      {
        icon: Building,
        title: "خرید ملک در ترکیه",
        desc: "استانبول، آنتالیا، بدروم، بورسا. مالکیت دائم برای خارجی‌ها. بازده اجاره و رشد ارزش بالا.",
        price: "از ۸۰,۰۰۰ دلار",
        href: "/fa/turkey/buy-property/",
      },
      {
        icon: Building2,
        title: "ثبت شرکت در ترکیه",
        desc: "شرکت LLC (Limited Şirket) یا JSC. مالکیت ۱۰۰٪ خارجی. پل اروپا-آسیا. دسترسی EU Customs Union.",
        price: "از ۱,۵۰۰ دلار",
        href: "/fa/turkey/company-registration/",
      },
      {
        icon: Plane,
        title: "ویزای توریستی",
        desc: "ویزای الکترونیکی توریستی ۳۰ تا ۹۰ روزه — درخواست آنلاین برای بازدید ملک یا دیدار خانواده.",
        price: "از ۵۰ دلار",
        href: "/fa/turkey/tourist-visa/",
      },
    ],
    services_view: "اطلاعات بیشتر",
    why_eyebrow: "چرا ترکیه؟",
    why_title: "چرا ترکیه را برای ۲۰۲۶ انتخاب کنیم",
    why_items: [
      { icon: Award, title: "سریع‌ترین CBI جهان", desc: "پاسپورت ترکیه در ۶ تا ۸ ماه — یکی از سریع‌ترین برنامه‌های شهروندی با سرمایه‌گذاری در دنیا." },
      { icon: Globe2, title: "۱۱۰+ کشور بدون ویزا", desc: "سفر بدون ویزا یا ویزای فرودگاهی به بیش از ۱۱۰ کشور شامل ژاپن، سنگاپور، هنگ‌کنگ، کره جنوبی." },
      { icon: TrendingUp, title: "ROI قوی ملک", desc: "قیمت ملک استانبول سالانه ۲۰ تا ۴۰٪ رشد. تقاضای اجاره از توریست، محلی و دیجیتال نومادها." },
      { icon: Users, title: "خانواده یکجا", desc: "همسر و فرزندان زیر ۱۸ سال با همان سرمایه‌گذاری شهروند می‌شوند — یک پرداخت." },
      { icon: Globe2, title: "پل اروپا و آسیا", desc: "موقعیت استراتژیک با پروازهای مستقیم به اروپا، MENA و آسیای میانه. عضو اتحادیه گمرکی EU." },
      { icon: ShieldCheck, title: "تابعیت دوگانه مجاز", desc: "پاسپورت اولیه‌تان حفظ می‌شود. ترکیه شهروندی را علاوه بر آن می‌دهد، نه به جای آن." },
    ],
    routes_eyebrow: "مسیرهای سرمایه‌گذاری",
    routes_title: "پنج مسیر واجد شرایط شهروندی ترکیه",
    routes_sub: "مسیر ملک به‌وضوح محبوب‌ترین است. بر اساس سرمایه، طرح کسب‌وکار و زمان‌بندی، مسیر مناسب را انتخاب کنید.",
    routes: [
      { type: "ملک", amount: "از ۴۰۰,۰۰۰ دلار", hold: "۳ سال", result: "شهروندی", best: "سرمایه‌گذار ملک، خانواده", highlighted: true },
      { type: "سپرده بانکی", amount: "از ۵۰۰,۰۰۰ دلار", hold: "۳ سال", result: "شهروندی", best: "پول نقد، کم‌دردسر" },
      { type: "اوراق دولتی", amount: "از ۵۰۰,۰۰۰ دلار", hold: "۳ سال", result: "شهروندی", best: "سرمایه‌گذار محافظه‌کار" },
      { type: "سرمایه ثابت", amount: "از ۵۰۰,۰۰۰ دلار", hold: "۳ سال", result: "شهروندی", best: "صاحبان کسب‌وکار فعال" },
      { type: "ایجاد شغل", amount: "۵۰ کارمند", hold: "۳ سال", result: "شهروندی", best: "کسب‌وکار جا افتاده" },
    ],
    routes_amount_label: "حداقل",
    routes_hold_label: "نگهداری",
    routes_result_label: "نتیجه",
    routes_best_label: "بهترین برای",
    alert_eyebrow: "تغییرات ۲۰۲۶",
    alert_title: "تغییرات ترکیه از ۱ مه ۲۰۲۶",
    alert_items: [
      "تمام پرداخت‌های ملک باید از طریق Güvenli Ödeme Sistemi (سیستم پرداخت امن) انجام شود — escrow بانکی اجباری برای محافظت از خریدار و فروشنده.",
      "هزینه residence permit به ۶۳۱ دلار/سال (یک‌ساله) و ۱,۸۵۷ دلار/سه‌ساله افزایش می‌یابد — اعمال روی تمدیدها بعد از ۱ مه.",
      "آستانه اقامت سرمایه‌گذار از طریق ملک همان ۲۰۰,۰۰۰ دلار باقی است — مثل ۲۰۲۵.",
      "شهروندی از طریق ملک همان ۴۰۰,۰۰۰ دلار باقی است — مثل ۲۰۲۵. زمان پردازش در ۲۰۲۶ با مدارک کامل به ۴ تا ۶ ماه کاهش یافته.",
      "ارزش ارزیابی ملک باید با قیمت قرارداد برابر باشد — ارزش‌گذاری کمتر می‌تواند درخواست اقامت یا شهروندی شما را باطل کند.",
    ],
    costs_eyebrow: "هزینه‌ها",
    costs_title: "هزینه‌های واقعی ترکیه ۲۰۲۶",
    costs_intro: "قیمت تقریبی end-to-end برای متداول‌ترین مسیرهای ترکیه. عدد نهایی به ملک، تعداد خانواده و مسیر بستگی دارد.",
    costs_disclaimer: "ارقام تقریبی برای ۲۰۲۶ هستند و هزینه‌های شخصی (مدرسه، سبک زندگی) را شامل نمی‌شوند. برای استعلام دقیق تماس بگیرید.",
    cost_groups: [
      {
        title: "شهروندی از طریق ملک ($400K)",
        items: [
          { label: "حداقل ملک", value: "۴۰۰,۰۰۰ دلار" },
          { label: "هزینه دولتی و حقوقی", value: "از ۸,۰۰۰ دلار" },
          { label: "هزینه خدمات (turnkey)", value: "از ۷,۰۰۰ دلار" },
        ],
      },
      {
        title: "اقامت سرمایه‌گذار از طریق ملک",
        items: [
          { label: "حداقل ملک", value: "۲۰۰,۰۰۰ دلار" },
          { label: "هزینه residence permit (یک‌ساله)", value: "۶۳۱ دلار" },
          { label: "هزینه residence permit (سه‌ساله)", value: "۱,۸۵۷ دلار" },
        ],
      },
      {
        title: "ثبت شرکت",
        items: [
          { label: "ثبت LLC (یک سهامدار)", value: "از ۱,۵۰۰ دلار" },
          { label: "افتتاح حساب بانکی", value: "از ۳۰۰ دلار" },
          { label: "حسابداری سالانه", value: "از ۱,۲۰۰ دلار/سال" },
        ],
      },
    ],
    cities_eyebrow: "کجا سرمایه‌گذاری کنیم",
    cities_title: "بهترین شهرها برای خریداران خارجی در ۲۰۲۶",
    cities_sub: "استانبول هنوز از نظر حجم پیشرو است، اما شهرهای ثانویه بازدهی اجاره بهتر و قیمت ورود پایین‌تر دارند.",
    cities: [
      { name: "استانبول", type: "پایتخت تجاری · بزرگ‌ترین بازار", highlights: "ویوی بسفر، سمت اروپا و آسیا، نقدشوندگی بالا برای فروش مجدد", price_from: "از ۱۴۰,۰۰۰ دلار" },
      { name: "آنتالیا", type: "مدیترانه · توریستی", highlights: "گردشگری ۱۲ ماهه، واحدهای برند ریزورت، محبوب بین روس‌ها", price_from: "از ۹۰,۰۰۰ دلار" },
      { name: "بدروم", type: "اژه · لاکچری", highlights: "ویلاهای بوتیک، مارینا، بازده اجاره تابستانی بالا", price_from: "از ۲۰۰,۰۰۰ دلار" },
      { name: "بورسا", type: "صنعتی · خانوادگی", highlights: "قیمت ورود پایین، مناسب خانواده، نزدیک استانبول (۱.۵ ساعت)", price_from: "از ۸۰,۰۰۰ دلار" },
      { name: "ازمیر", type: "ساحلی · در حال رشد", highlights: "سبک زندگی اژه، صحنه تک در حال رشد، ارزان‌تر از استانبول", price_from: "از ۹۰,۰۰۰ دلار" },
      { name: "آنکارا", type: "پایتخت · باثبات", highlights: "هاب دولتی و سفارت‌خانه‌ها، تقاضای اجاره پایدار", price_from: "از ۸۵,۰۰۰ دلار" },
    ],
    cities_price_label: "از",
    faq_title: "پرسش‌های رایج درباره ترکیه",
    faq_items: [
      {
        question: "حداقل سرمایه برای شهروندی ترکیه در ۲۰۲۶ چقدر است؟",
        answer:
          "۴۰۰,۰۰۰ دلار در ملک، نگهداری حداقل ۳ سال، محبوب‌ترین مسیر است. مسیرهای سپرده بانکی، اوراق دولتی، سرمایه ثابت و ایجاد شغل هم با ۵۰۰,۰۰۰ دلار (یا ۵۰ کارمند) وجود دارد. شهروندی معمولاً در ۶ تا ۸ ماه اعطا می‌شود.",
      },
      {
        question: "آیا خارجی‌ها می‌توانند آزادانه در ترکیه ملک بخرند؟",
        answer:
          "بله. خارجی‌ها در بیشتر نقاط ترکیه می‌توانند ملک Freehold بخرند، به جز برخی مناطق نظامی یا مرزی محدود. سند TAPU به نام شما ثبت می‌شود و کاملاً قابل انتقال و ارث است.",
      },
      {
        question: "از ۱ مه ۲۰۲۶ چه چیزی تغییر می‌کند؟",
        answer:
          "تمام معاملات ملک باید از طریق Güvenli Ödeme Sistemi (سیستم پرداخت امن) انجام شود — escrow اجباری بانکی. هزینه تمدید residence permit هم به ۶۳۱ دلار یک‌ساله یا ۱,۸۵۷ دلار سه‌ساله افزایش می‌یابد.",
      },
      {
        question: "آیا ترکیه تابعیت دوگانه را اجازه می‌دهد؟",
        answer:
          "بله. ترکیه تابعیت دوگانه را می‌پذیرد. پاسپورت اولیه‌تان حفظ می‌شود و ترکیه تابعیت را علاوه بر آن می‌دهد. برخی کشورهای مبدأ این را محدود می‌کنند — ما در onboarding بررسی می‌کنیم.",
      },
      {
        question: "آیا اعضای خانواده در شهروندی شامل می‌شوند؟",
        answer:
          "بله. همسر و فرزندان وابسته زیر ۱۸ سال در همان سرمایه‌گذاری بدون حداقل اضافی شامل می‌شوند. فرزندان بالای ۱۸ سال نیاز به درخواست جداگانه دارند.",
      },
      {
        question: "برای حفظ شهروندی چقدر باید در ترکیه زندگی کنم؟",
        answer:
          "هیچ حداقل اقامتی برای مسیر شهروندی با سرمایه‌گذاری وجود ندارد. پس از اعطا، شهروندی دائمی است و وابسته به حضور فیزیکی نیست.",
      },
      {
        question: "آیا می‌توانم بعد از ۳ سال ملک را بفروشم؟",
        answer:
          "بله. دوره ۳ ساله نگهداری یک محدودیت قانونی سختگیرانه است. پس از ۳ سال، می‌توانید ملک را آزادانه بفروشید بدون تأثیر بر شهروندی — شهروندی پس از اعطا دائمی است.",
      },
      {
        question: "پرداخت‌ها در سیستم پرداخت امن جدید چگونه انجام می‌شود؟",
        answer:
          "از ۱ مه ۲۰۲۶، خریدار وجه را به حساب بانک ترکی منتقل می‌کند، بانک پول را در escrow نگه می‌دارد، و فقط پس از انتقال کامل TAPU به فروشنده آزاد می‌کند. این از هر دو طرف در برابر کلاهبرداری محافظت می‌کند.",
      },
      {
        question: "تفاوت اقامت و شهروندی در ترکیه چیست؟",
        answer:
          "اقامت (Ikamet) حق زندگی در ترکیه را از ۲۰۰,۰۰۰ دلار ملک می‌دهد — هر ۱ یا ۲ سال تمدید. شهروندی از ۴۰۰,۰۰۰ دلار به شما پاسپورت ترکیه می‌دهد، دائمی و قابل ارث، بدون حداقل اقامت.",
      },
      {
        question: "آیا می‌توانم بدون مسافرت به ترکیه از راه دور اقدام کنم؟",
        answer:
          "بیشتر مراحل را می‌توان از راه دور با وکالت‌نامه (PoA) انجام داد. یک سفر کوتاه (۳ تا ۵ روز) برای دیدن املاک و امضای TAPU توصیه می‌شود اما الزامی نیست.",
      },
    ],
    crosssell_title: "مسیرهای دیگر برای بررسی",
    crosssell_citizenship_title: "شهروندی ترکیه",
    crosssell_citizenship_desc: "پاسپورت از طریق ملک — راهنمای کامل",
    crosssell_property_title: "خرید ملک در ترکیه",
    crosssell_property_desc: "استانبول، آنتالیا، بدروم و بیشتر",
    crosssell_uae_title: "گلدن ویزای امارات",
    crosssell_uae_desc: "مقایسه با اقامت ۱۰ ساله امارات",
    crosssell_oman_title: "اقامت سرمایه‌گذار عمان",
    crosssell_oman_desc: "جایگزین آرام‌تر — کارت ۵ یا ۱۰ ساله",
    lead_title: "نقشه راه شخصی ترکیه — رایگان",
    lead_sub: "هدف و بودجه را بنویسید — برنامه ترکیه با شرایط، شهرها و هزینه کل را در ۲۴ ساعت می‌فرستیم.",
  },
  ar: {
    breadcrumb: "تركيا",
    hero_h1: "تركيا 2026: الجنسية والإقامة والعقارات — جسرك بين أوروبا وآسيا",
    hero_sub:
      "جواز سفر تركي عبر العقار من 400,000 دولار (110+ دولة بدون تأشيرة) · إقامة المستثمر من 200,000 دولار · العائلة مشمولة. الجنسية في 6 إلى 8 أشهر — من أسرع برامج CBI في العالم.",
    hero_badge: "تركيا 2026",
    hero_placeholder: "اسأل عن الجنسية التركية وعقارات إسطنبول وإقامة تركيا…",
    stats: [
      { num: "400 ألف $", label: "الجنسية عبر العقار" },
      { num: "6 إلى 8 أشهر", label: "زمن الجواز" },
      { num: "+110", label: "دولة بدون تأشيرة" },
      { num: "200 ألف $", label: "الإقامة عبر العقار" },
    ],
    services_eyebrow: "خدمات تركيا",
    services_title: "ماذا نقدم في تركيا",
    services: [
      {
        icon: Award,
        title: "الجنسية التركية بالاستثمار",
        desc: "جواز سفر تركي خلال 6 إلى 8 أشهر بـ 400,000 دولار في العقار. العائلة مشمولة. الجنسية المزدوجة مسموحة.",
        price: "من 400,000 دولار",
        href: "/ar/turkey/citizenship/",
        badge: "الأكثر طلباً",
      },
      {
        icon: Building,
        title: "شراء عقار في تركيا",
        desc: "إسطنبول، أنطاليا، بودروم، بورصة. تملك حر للأجانب. عائد إيجار وارتفاع رأسمالي قويان.",
        price: "من 80,000 دولار",
        href: "/ar/turkey/buy-property/",
      },
      {
        icon: Building2,
        title: "تأسيس شركة في تركيا",
        desc: "ش.م.م تركية (Limited Şirket) أو JSC. ملكية أجنبية 100٪. جسر أوروبا-آسيا. وصول للاتحاد الجمركي الأوروبي.",
        price: "من 1,500 دولار",
        href: "/ar/turkey/company-registration/",
      },
      {
        icon: Plane,
        title: "تأشيرة سياحية إلكترونية",
        desc: "تأشيرة سياحية إلكترونية 30 إلى 90 يوماً — تقديم أونلاين لزيارة العقارات أو لقاء العائلة.",
        price: "من 50 دولار",
        href: "/ar/turkey/tourist-visa/",
      },
    ],
    services_view: "اعرف المزيد",
    why_eyebrow: "لماذا تركيا؟",
    why_title: "لماذا تختار تركيا في 2026",
    why_items: [
      { icon: Award, title: "أسرع برنامج CBI في العالم", desc: "جواز سفر تركي خلال 6 إلى 8 أشهر — من أسرع برامج الجنسية بالاستثمار عالمياً." },
      { icon: Globe2, title: "+110 دولة بدون تأشيرة", desc: "سفر بدون تأشيرة أو تأشيرة عند الوصول لـ +110 دولة بما في ذلك اليابان وسنغافورة وهونغ كونغ وكوريا الجنوبية." },
      { icon: TrendingUp, title: "عائد عقاري قوي", desc: "أسعار عقارات إسطنبول ترتفع 20-40٪ سنوياً. طلب إيجار قوي من السياحة والمحليين والرحالة الرقميين." },
      { icon: Users, title: "العائلة بأكملها بدفعة واحدة", desc: "الزوج والأبناء المعالون دون 18 يحصلون على الجنسية بنفس الاستثمار — دفعة واحدة." },
      { icon: Globe2, title: "جسر أوروبا وآسيا", desc: "موقع استراتيجي مع رحلات مباشرة لأوروبا والشرق الأوسط وآسيا الوسطى. عضو في الاتحاد الجمركي الأوروبي." },
      { icon: ShieldCheck, title: "ازدواجية الجنسية مسموحة", desc: "احتفظ بجواز سفرك الأصلي. تركيا تمنح الجنسية إضافة وليس بديلاً." },
    ],
    routes_eyebrow: "مسارات الاستثمار",
    routes_title: "خمسة مسارات مؤهلة للجنسية التركية",
    routes_sub: "العقار هو المسار الأكثر شعبية بفارق كبير. اختر المسار المناسب لرأس مالك وخطة عملك وزمنك.",
    routes: [
      { type: "العقار", amount: "من 400,000 $", hold: "3 سنوات", result: "الجنسية", best: "مستثمر العقار، العائلات", highlighted: true },
      { type: "إيداع بنكي", amount: "من 500,000 $", hold: "3 سنوات", result: "الجنسية", best: "رأس مال سائل، أقل جهد" },
      { type: "سندات حكومية", amount: "من 500,000 $", hold: "3 سنوات", result: "الجنسية", best: "مستثمر محافظ" },
      { type: "رأس مال ثابت", amount: "من 500,000 $", hold: "3 سنوات", result: "الجنسية", best: "أصحاب أعمال نشطون" },
      { type: "خلق وظائف", amount: "50 موظف", hold: "3 سنوات", result: "الجنسية", best: "مشغل قائم" },
    ],
    routes_amount_label: "الحد الأدنى",
    routes_hold_label: "فترة الاحتفاظ",
    routes_result_label: "النتيجة",
    routes_best_label: "الأنسب لـ",
    alert_eyebrow: "تحديثات 2026",
    alert_title: "ما الذي يتغير في تركيا في 1 مايو 2026",
    alert_items: [
      "جميع مدفوعات العقارات يجب أن تتم عبر Güvenli Ödeme Sistemi (نظام الدفع الآمن) — حساب ضمان بنكي إلزامي يحمي البائع والمشتري.",
      "رسوم الإقامة ترتفع إلى 631 دولار/سنة (سنوي) و 1,857 دولار/3 سنوات — تطبق على التجديدات بعد 1 مايو.",
      "حد الإقامة عبر العقار يبقى 200,000 دولار — كما في 2025.",
      "الجنسية عبر العقار تبقى 400,000 دولار — كما في 2025. وقت المعالجة في 2026 انخفض إلى 4 إلى 6 أشهر مع وثائق كاملة.",
      "تقييم العقار يجب أن يساوي سعر العقد — التقييم الأقل يمكن أن يبطل طلب إقامتك أو جنسيتك.",
    ],
    costs_eyebrow: "التكاليف",
    costs_title: "التكاليف الحقيقية في تركيا 2026",
    costs_intro: "أسعار شاملة إرشادية لأكثر مسارات تركيا شيوعاً. الأرقام النهائية تعتمد على العقار وحجم العائلة والمسار.",
    costs_disclaimer: "الأرقام إرشادية لـ 2026 ولا تشمل المصاريف الشخصية. تواصل معنا لعرض دقيق.",
    cost_groups: [
      {
        title: "الجنسية عبر العقار (400 ألف $)",
        items: [
          { label: "حد العقار", value: "400,000 $" },
          { label: "رسوم حكومية وقانونية", value: "من 8,000 $" },
          { label: "رسوم خدمات (turnkey)", value: "من 7,000 $" },
        ],
      },
      {
        title: "إقامة المستثمر عبر العقار",
        items: [
          { label: "حد العقار", value: "200,000 $" },
          { label: "رسوم الإقامة (سنوي)", value: "631 $" },
          { label: "رسوم الإقامة (3 سنوات)", value: "1,857 $" },
        ],
      },
      {
        title: "تأسيس شركة",
        items: [
          { label: "تأسيس ش.م.م (مساهم واحد)", value: "من 1,500 $" },
          { label: "فتح حساب بنكي", value: "من 300 $" },
          { label: "محاسبة سنوية", value: "من 1,200 $/سنة" },
        ],
      },
    ],
    cities_eyebrow: "أين تستثمر",
    cities_title: "أفضل المدن للمشترين الأجانب في 2026",
    cities_sub: "إسطنبول لا تزال تهيمن على الحجم، لكن المدن الثانوية تقدم عوائد إيجار أفضل وأسعار دخول أقل.",
    cities: [
      { name: "إسطنبول", type: "العاصمة التجارية · أكبر سوق", highlights: "إطلالات البوسفور، الجانب الأوروبي والآسيوي، سيولة عميقة لإعادة البيع", price_from: "من 140,000 $" },
      { name: "أنطاليا", type: "البحر المتوسط · سياحي", highlights: "سياحة طوال السنة، وحدات بعلامات منتجعية، شعبية بين الروس", price_from: "من 90,000 $" },
      { name: "بودروم", type: "بحر إيجة · فاخر", highlights: "فلل بوتيك، مرسى، عوائد إيجار صيفية ممتازة", price_from: "من 200,000 $" },
      { name: "بورصة", type: "صناعي · عائلي", highlights: "أسعار دخول أقل، مناسب للعائلات، قريب من إسطنبول (1.5 ساعة)", price_from: "من 80,000 $" },
      { name: "إزمير", type: "ساحلي · في نمو", highlights: "أسلوب حياة بحر إيجة، مشهد تقني نامي، أرخص من إسطنبول", price_from: "من 90,000 $" },
      { name: "أنقرة", type: "العاصمة · مستقر", highlights: "مركز الحكومة والسفارات، طلب إيجار مستقر", price_from: "من 85,000 $" },
    ],
    cities_price_label: "من",
    faq_title: "أسئلة شائعة عن تركيا",
    faq_items: [
      {
        question: "ما الحد الأدنى لاستثمار الجنسية التركية في 2026؟",
        answer:
          "400,000 دولار في العقار، احتفاظ 3 سنوات على الأقل، هو المسار الأكثر شعبية. مسارات الإيداع البنكي والسندات الحكومية ورأس المال الثابت وخلق الوظائف موجودة بـ 500,000 دولار (أو 50 موظف). الجنسية تُمنح عادة في 6 إلى 8 أشهر.",
      },
      {
        question: "هل يمكن للأجانب شراء العقار بحرية في تركيا؟",
        answer:
          "نعم. يمكن للأجانب شراء عقار تملك حر في معظم أنحاء تركيا، باستثناء بعض المناطق العسكرية أو الحدودية المقيدة. يُسجل سند TAPU باسمك وقابل للنقل والتوريث.",
      },
      {
        question: "ما الذي يتغير في 1 مايو 2026؟",
        answer:
          "جميع معاملات العقار يجب أن تتم عبر Güvenli Ödeme Sistemi (نظام الدفع الآمن) — حساب ضمان بنكي إلزامي. ورسوم تجديد الإقامة ترتفع إلى 631 دولار سنوي أو 1,857 دولار لـ 3 سنوات.",
      },
      {
        question: "هل تركيا تسمح بازدواجية الجنسية؟",
        answer:
          "نعم. تركيا تسمح بازدواجية الجنسية. تحتفظ بجواز سفرك الأصلي وتركيا تمنح الجنسية إضافة. بعض دول الأصل تقيدها — نتحقق منها أثناء onboarding.",
      },
      {
        question: "هل أفراد العائلة مشمولون في الجنسية؟",
        answer:
          "نعم. زوجك والأبناء المعالون دون 18 مشمولون بنفس الاستثمار بدون حد أدنى إضافي. الأبناء فوق 18 يحتاجون طلباً منفصلاً.",
      },
      {
        question: "كم يجب أن أعيش في تركيا للحفاظ على الجنسية؟",
        answer:
          "لا يوجد حد أدنى للإقامة لمسار الجنسية بالاستثمار. بمجرد منحها، الجنسية دائمة وغير مرتبطة بالحضور الفعلي.",
      },
      {
        question: "هل يمكنني بيع العقار بعد 3 سنوات؟",
        answer:
          "نعم. فترة الاحتفاظ 3 سنوات قيد قانوني صارم. بعد 3 سنوات، يمكنك بيع العقار بحرية دون التأثير على جنسيتك — الجنسية بمجرد منحها دائمة.",
      },
      {
        question: "كيف تتم المدفوعات في نظام الدفع الآمن الجديد؟",
        answer:
          "من 1 مايو 2026، يحول المشتري الأموال إلى حساب بنكي تركي، يحتفظ البنك بالأموال في حساب ضمان، ويفرج عنها للبائع فقط بعد إكمال نقل TAPU. هذا يحمي الطرفين من الاحتيال.",
      },
      {
        question: "ما الفرق بين الإقامة والجنسية في تركيا؟",
        answer:
          "الإقامة (Ikamet) تمنحك حق الإقامة في تركيا من 200,000 دولار في العقار — تجدد كل 1 أو 2 سنة. الجنسية من 400,000 دولار تمنحك جواز سفر تركي، دائم وقابل للتوريث، بدون حد أدنى للإقامة.",
      },
      {
        question: "هل يمكنني التقديم عن بُعد دون زيارة تركيا؟",
        answer:
          "معظم الخطوات يمكن إدارتها عن بُعد عبر توكيل (PoA). زيارة قصيرة (3 إلى 5 أيام) موصى بها لمعاينة العقارات وتوقيع TAPU، لكن ليست إلزامية تماماً.",
      },
    ],
    crosssell_title: "مسارات أخرى للنظر فيها",
    crosssell_citizenship_title: "الجنسية التركية",
    crosssell_citizenship_desc: "جواز السفر عبر العقار — دليل كامل",
    crosssell_property_title: "شراء عقار في تركيا",
    crosssell_property_desc: "إسطنبول وأنطاليا وبودروم والمزيد",
    crosssell_uae_title: "الإقامة الذهبية الإمارات",
    crosssell_uae_desc: "قارن مع إقامة 10 سنوات في الإمارات",
    crosssell_oman_title: "إقامة المستثمر العماني",
    crosssell_oman_desc: "بديل أهدأ — بطاقة 5 أو 10 سنوات",
    lead_title: "خارطة طريق تركيا — مجاناً",
    lead_sub: "أخبرنا بهدفك وميزانيتك — سنرسل خطة تركيا مع الأهلية والمدن والتكلفة الإجمالية خلال 24 ساعة.",
  },
  ru: {
    breadcrumb: "Турция",
    hero_h1: "Турция 2026: гражданство, ВНЖ и недвижимость — мост между Европой и Азией",
    hero_sub:
      "Турецкий паспорт через недвижимость от 400 000 $ (110+ стран без визы) · ВНЖ инвестора от 200 000 $ · Семья включена. Гражданство за 6–8 месяцев — одна из самых быстрых программ CBI в мире.",
    hero_badge: "Турция 2026",
    hero_placeholder: "Спросите про гражданство Турции, недвижимость в Стамбуле, Икамет…",
    stats: [
      { num: "$400K", label: "Гражданство через недвижимость" },
      { num: "6–8 мес", label: "Срок паспорта" },
      { num: "110+", label: "Стран без визы" },
      { num: "$200K", label: "ВНЖ через недвижимость" },
    ],
    services_eyebrow: "Услуги в Турции",
    services_title: "Что мы делаем в Турции",
    services: [
      {
        icon: Award,
        title: "Гражданство Турции по инвестициям",
        desc: "Турецкий паспорт за 6–8 месяцев через 400 000 $ в недвижимости. Семья включена. Двойное гражданство разрешено.",
        price: "От 400 000 $",
        href: "/ru/turkey/citizenship/",
        badge: "Популярно",
      },
      {
        icon: Building,
        title: "Покупка недвижимости в Турции",
        desc: "Стамбул, Анталья, Бодрум, Бурса. Полное право собственности для иностранцев. Высокая доходность аренды и рост цен.",
        price: "От 80 000 $",
        href: "/ru/turkey/buy-property/",
      },
      {
        icon: Building2,
        title: "Регистрация компании",
        desc: "Турецкая LLC (Limited Şirket) или JSC. 100% иностранное владение. Мост Европа-Азия. Доступ к Таможенному союзу ЕС.",
        price: "От 1 500 $",
        href: "/ru/turkey/company-registration/",
      },
      {
        icon: Plane,
        title: "Туристическая eVisa",
        desc: "Электронная виза на 30–90 дней — оформление онлайн для просмотра недвижимости или семейных визитов.",
        price: "От 50 $",
        href: "/ru/turkey/tourist-visa/",
      },
    ],
    services_view: "Подробнее",
    why_eyebrow: "Почему Турция",
    why_title: "Почему выбирают Турцию в 2026 году",
    why_items: [
      { icon: Award, title: "Самая быстрая CBI в мире", desc: "Турецкий паспорт за 6–8 месяцев — одна из самых быстрых программ гражданства за инвестиции в мире." },
      { icon: Globe2, title: "110+ стран без визы", desc: "Без визы или виза по прибытии в 110+ стран, включая Японию, Сингапур, Гонконг и Южную Корею." },
      { icon: TrendingUp, title: "Высокая доходность недвижимости", desc: "Цены на недвижимость в Стамбуле растут на 20–40% в год. Сильный спрос на аренду от туристов, местных и цифровых кочевников." },
      { icon: Users, title: "Вся семья сразу", desc: "Супруг и дети-иждивенцы до 18 лет получают гражданство по той же инвестиции — одна оплата." },
      { icon: Globe2, title: "Мост между Европой и Азией", desc: "Стратегическое положение, прямые рейсы в Европу, MENA, Центральную Азию. Член Таможенного союза ЕС." },
      { icon: ShieldCheck, title: "Двойное гражданство разрешено", desc: "Сохраняете оригинальный паспорт. Турция предоставляет гражданство дополнительно, не как замену." },
    ],
    routes_eyebrow: "Инвестиционные маршруты",
    routes_title: "Пять подходящих маршрутов к гражданству Турции",
    routes_sub: "Маршрут через недвижимость — самый популярный. Выбирайте под капитал, бизнес-план и сроки.",
    routes: [
      { type: "Недвижимость", amount: "От $400 000", hold: "3 года", result: "Гражданство", best: "Инвесторы недвижимости, семьи", highlighted: true },
      { type: "Банковский депозит", amount: "От $500 000", hold: "3 года", result: "Гражданство", best: "Ликвидный капитал, минимум усилий" },
      { type: "Гособлигации", amount: "От $500 000", hold: "3 года", result: "Гражданство", best: "Консервативные инвесторы" },
      { type: "Основной капитал", amount: "От $500 000", hold: "3 года", result: "Гражданство", best: "Активные владельцы бизнеса" },
      { type: "Создание рабочих мест", amount: "50 сотрудников", hold: "3 года", result: "Гражданство", best: "Действующий бизнес" },
    ],
    routes_amount_label: "Минимум",
    routes_hold_label: "Срок удержания",
    routes_result_label: "Результат",
    routes_best_label: "Подходит для",
    alert_eyebrow: "Изменения 2026",
    alert_title: "Что меняется в Турции с 1 мая 2026",
    alert_items: [
      "Все платежи за недвижимость должны проходить через Güvenli Ödeme Sistemi (Систему безопасных платежей) — обязательный банковский эскроу для защиты покупателя и продавца.",
      "Сборы за ВНЖ растут до 631 $/год (1 год) и 1 857 $/3 года — применяются к продлениям после 1 мая.",
      "Порог инвесторского ВНЖ через недвижимость остаётся 200 000 $ — как и в 2025.",
      "Гражданство через недвижимость остаётся 400 000 $ — как и в 2025. Срок обработки в 2026 снизился до 4–6 месяцев при полном пакете документов.",
      "Оценка недвижимости должна равняться цене договора — заниженная оценка может аннулировать заявление на ВНЖ или гражданство.",
    ],
    costs_eyebrow: "Стоимость",
    costs_title: "Реальные расходы в Турции 2026",
    costs_intro: "Ориентировочные суммарные цены на самые частые маршруты Турции. Финальные суммы зависят от объекта, состава семьи и маршрута.",
    costs_disclaimer: "Числа ориентировочные на 2026 и не включают личные расходы. Свяжитесь для точного расчёта.",
    cost_groups: [
      {
        title: "Гражданство через недвижимость ($400K)",
        items: [
          { label: "Минимум недвижимости", value: "$400 000" },
          { label: "Госпошлины и юр. услуги", value: "От $8 000" },
          { label: "Сервисный тариф (turnkey)", value: "От $7 000" },
        ],
      },
      {
        title: "Инвесторский ВНЖ через недвижимость",
        items: [
          { label: "Минимум недвижимости", value: "$200 000" },
          { label: "Сбор за ВНЖ (1 год)", value: "$631" },
          { label: "Сбор за ВНЖ (3 года)", value: "$1 857" },
        ],
      },
      {
        title: "Регистрация компании",
        items: [
          { label: "LLC (один акционер)", value: "От $1 500" },
          { label: "Открытие счёта", value: "От $300" },
          { label: "Бухгалтерия в год", value: "От $1 200/год" },
        ],
      },
    ],
    cities_eyebrow: "Где инвестировать",
    cities_title: "Лучшие города для иностранных покупателей в 2026",
    cities_sub: "Стамбул всё ещё доминирует по объёму, но вторичные города дают лучшую доходность аренды и более низкий порог входа.",
    cities: [
      { name: "Стамбул", type: "Деловая столица · крупнейший рынок", highlights: "Виды на Босфор, европейская и азиатская стороны, ликвидность для перепродажи", price_from: "От $140 000" },
      { name: "Анталья", type: "Средиземное море · туристический", highlights: "Круглогодичный туризм, юниты под брендом курортов, популярна у россиян", price_from: "От $90 000" },
      { name: "Бодрум", type: "Эгейское · люкс", highlights: "Бутиковые виллы, марина, лучшая летняя доходность", price_from: "От $200 000" },
      { name: "Бурса", type: "Промышленный · семейный", highlights: "Низкий порог входа, удобно для семей, рядом со Стамбулом (1.5 ч)", price_from: "От $80 000" },
      { name: "Измир", type: "Прибрежный · растущий", highlights: "Эгейский образ жизни, растущая ИТ-сцена, дешевле Стамбула", price_from: "От $90 000" },
      { name: "Анкара", type: "Столица · стабильный", highlights: "Госхаб и посольства, стабильный спрос на аренду", price_from: "От $85 000" },
    ],
    cities_price_label: "От",
    faq_title: "Частые вопросы про Турцию",
    faq_items: [
      {
        question: "Какой минимум инвестиций для гражданства Турции в 2026?",
        answer:
          "400 000 $ в недвижимости с удержанием 3 года — самый популярный маршрут. Также банковский депозит, гособлигации, основной капитал и создание рабочих мест от 500 000 $ (или 50 сотрудников). Гражданство обычно выдаётся за 6–8 месяцев.",
      },
      {
        question: "Могут ли иностранцы свободно покупать недвижимость в Турции?",
        answer:
          "Да. Иностранцы могут покупать freehold-недвижимость почти везде в Турции, кроме отдельных военных или приграничных зон. ТАПУ оформляется на ваше имя и полностью передаётся и наследуется.",
      },
      {
        question: "Что меняется с 1 мая 2026?",
        answer:
          "Все сделки с недвижимостью должны проходить через Güvenli Ödeme Sistemi (Систему безопасных платежей) — обязательный банковский эскроу. Сборы за продление ВНЖ растут до 631 $ (1 год) или 1 857 $ (3 года).",
      },
      {
        question: "Разрешает ли Турция двойное гражданство?",
        answer:
          "Да. Турция допускает двойное гражданство. Сохраняете оригинальный паспорт, Турция предоставляет гражданство дополнительно. Некоторые страны происхождения это ограничивают — мы проверяем при онбординге.",
      },
      {
        question: "Включаются ли члены семьи в гражданство?",
        answer:
          "Да. Супруг и дети-иждивенцы до 18 лет включаются в ту же инвестицию без дополнительного минимума. Дети старше 18 нуждаются в отдельной заявке.",
      },
      {
        question: "Сколько нужно жить в Турции для сохранения гражданства?",
        answer:
          "Для маршрута гражданства за инвестиции нет минимального требования к проживанию. После выдачи гражданство постоянное и не привязано к физическому присутствию.",
      },
      {
        question: "Можно ли продать недвижимость через 3 года?",
        answer:
          "Да. 3-летний срок удержания — строгое юридическое ограничение. После 3 лет можно продать без влияния на гражданство — гражданство, единожды выданное, постоянно.",
      },
      {
        question: "Как идут платежи в новой системе безопасных платежей?",
        answer:
          "С 1 мая 2026 покупатель переводит средства на турецкий банковский счёт, банк держит деньги в эскроу и переводит продавцу только после полной передачи ТАПУ. Это защищает обе стороны от мошенничества.",
      },
      {
        question: "В чём разница между ВНЖ и гражданством Турции?",
        answer:
          "ВНЖ (Икамет) даёт право жить в Турции при недвижимости от 200 000 $ — продлевается каждые 1–2 года. Гражданство от 400 000 $ даёт турецкий паспорт, постоянный и наследуемый, без минимального проживания.",
      },
      {
        question: "Можно ли подать удалённо без визита в Турцию?",
        answer:
          "Большинство шагов можно сделать удалённо по доверенности (PoA). Короткий визит (3–5 дней) рекомендуется для просмотра объектов и подписания ТАПУ, но не обязателен.",
      },
    ],
    crosssell_title: "Альтернативы для рассмотрения",
    crosssell_citizenship_title: "Гражданство Турции",
    crosssell_citizenship_desc: "Паспорт через недвижимость — полный гайд",
    crosssell_property_title: "Недвижимость Турции",
    crosssell_property_desc: "Стамбул, Анталья, Бодрум и больше",
    crosssell_uae_title: "Golden Visa ОАЭ",
    crosssell_uae_desc: "Сравните с 10-летним ВНЖ ОАЭ",
    crosssell_oman_title: "Инвесторский ВНЖ Омана",
    crosssell_oman_desc: "Спокойная альтернатива — карта 5/10 лет",
    lead_title: "Получите бесплатный план по Турции",
    lead_sub: "Расскажите о цели и бюджете — пришлём индивидуальный план по Турции с приемлемостью, городами и итогом в течение 24 часов.",
  },
};

export default function TurkeyHubClient() {
  const { lang, isRTL } = useLanguage();
  const c = CONTENT[lang];
  const Arrow = isRTL ? ChevronLeft : ChevronRight;
  const homeHref = lang === "en" ? "/" : `/${lang}/`;
  const linkPath = (path: string) => (lang === "en" ? `/${path}` : `/${lang}/${path}`);

  const breadcrumbItems = [
    { label: "Residency24", href: homeHref },
    { label: c.breadcrumb },
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
      title: c.crosssell_property_title,
      description: c.crosssell_property_desc,
      icon: Building,
      href: linkPath("turkey/buy-property/"),
    },
    {
      title: c.crosssell_uae_title,
      description: c.crosssell_uae_desc,
      icon: Globe2,
      href: linkPath("uae/"),
    },
    {
      title: c.crosssell_oman_title,
      description: c.crosssell_oman_desc,
      icon: IdCard,
      href: linkPath("oman/"),
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

        {/* Why Turkey */}
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

        {/* Investment routes table */}
        <section className="py-16 bg-surface">
          <div className="max-w-5xl mx-auto px-4">
            <div className="text-center mb-10">
              <p className="text-xs uppercase tracking-wider text-gold mb-2">{c.routes_eyebrow}</p>
              <h2 className="text-2xl md:text-3xl font-bold text-navy mb-3">{c.routes_title}</h2>
              <p className="text-sm text-muted-foreground max-w-2xl mx-auto">{c.routes_sub}</p>
            </div>
            <div className="bg-white border border-border rounded-xl overflow-hidden">
              <div className="hidden md:grid md:grid-cols-5 gap-3 px-5 py-3 bg-navy/5 border-b border-border text-xs font-semibold text-navy uppercase tracking-wider">
                <div>{c.routes_eyebrow}</div>
                <div>{c.routes_amount_label}</div>
                <div>{c.routes_hold_label}</div>
                <div>{c.routes_result_label}</div>
                <div>{c.routes_best_label}</div>
              </div>
              {c.routes.map((r, i) => (
                <div
                  key={i}
                  className={`grid grid-cols-1 md:grid-cols-5 gap-3 px-5 py-4 border-b border-border last:border-0 ${
                    r.highlighted ? "bg-gold/5" : ""
                  }`}
                >
                  <div className="text-sm font-bold text-navy flex items-center gap-2">
                    {r.highlighted && <CheckCircle2 className="w-4 h-4 text-gold shrink-0" />}
                    {r.type}
                  </div>
                  <div className="text-sm text-navy">
                    <span className="md:hidden font-semibold text-muted-foreground">{c.routes_amount_label}: </span>
                    {r.amount}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <span className="md:hidden font-semibold">{c.routes_hold_label}: </span>
                    {r.hold}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <span className="md:hidden font-semibold">{c.routes_result_label}: </span>
                    {r.result}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <span className="md:hidden font-semibold">{c.routes_best_label}: </span>
                    {r.best}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 2026 Updates alert */}
        <section className="py-12 bg-white">
          <div className="max-w-5xl mx-auto px-4">
            <div className="bg-gold/10 border-2 border-gold/40 rounded-2xl p-6">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-gold/20 flex items-center justify-center shrink-0">
                  <Bell className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-gold mb-1">{c.alert_eyebrow}</p>
                  <h2 className="text-xl md:text-2xl font-bold text-navy">{c.alert_title}</h2>
                </div>
              </div>
              <ul className="space-y-2 ms-1">
                {c.alert_items.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-ink">
                    <Zap className="w-4 h-4 text-gold mt-0.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Costs */}
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

        {/* Top cities */}
        <section className="py-16 bg-white">
          <div className="max-w-5xl mx-auto px-4">
            <div className="text-center mb-10">
              <p className="text-xs uppercase tracking-wider text-gold mb-2">{c.cities_eyebrow}</p>
              <h2 className="text-2xl md:text-3xl font-bold text-navy mb-3">{c.cities_title}</h2>
              <p className="text-sm text-muted-foreground max-w-2xl mx-auto">{c.cities_sub}</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {c.cities.map((city, i) => (
                <div key={i} className="bg-surface border border-border rounded-xl p-5">
                  <div className="w-9 h-9 rounded-lg bg-gold/10 flex items-center justify-center mb-3">
                    <MapPin className="w-5 h-5 text-gold" />
                  </div>
                  <h3 className="text-base font-bold text-navy mb-1">{city.name}</h3>
                  <p className="text-xs text-gold/80 mb-2">{city.type}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-3">{city.highlights}</p>
                  <p className="text-sm font-bold text-navy">
                    {c.cities_price_label}: <span className="text-gold">{city.price_from}</span>
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <NationalityHooks />

        <SharedFAQ items={c.faq_items} title={c.faq_title} />

        <SharedCrossSell items={crossSellItems} title={c.crosssell_title} />

        <SharedLeadForm
          serviceContext="turkey_general"
          title={c.lead_title}
          subtitle={c.lead_sub}
        />
      </main>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}

