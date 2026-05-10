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
  CheckCircle2,
  FileText,
} from "lucide-react";
import type { CrossSellItem } from "@/components/shared/SharedCrossSell";
import type { FAQItem } from "@/components/shared/SharedFAQ";
import type { Lang } from "@/translations";

interface RouteRow {
  type: string;
  amount: string;
  hold: string;
  notes: string;
  highlighted?: boolean;
}

interface Content {
  breadcrumb_turkey: string;
  breadcrumb_self: string;
  hero_h1: string;
  hero_sub: string;
  hero_badge: string;
  hero_placeholder: string;
  stats: { num: string; label: string }[];
  routes_eyebrow: string;
  routes_title: string;
  routes_sub: string;
  routes: RouteRow[];
  routes_type_label: string;
  routes_amount_label: string;
  routes_hold_label: string;
  routes_notes_label: string;
  steps_eyebrow: string;
  steps_title: string;
  steps: { title: string; desc: string; days: string }[];
  docs_title: string;
  docs_intro: string;
  docs: string[];
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
    breadcrumb_turkey: "Turkey",
    breadcrumb_self: "Citizenship by Investment",
    hero_h1: "Turkish Citizenship by Investment 2026 — Passport in 6–8 Months from $400,000",
    hero_sub:
      "One of the world's fastest CBI programs. $400,000 in real estate (held 3 years) gives you and your family Turkish passports — visa-free to 110+ countries. Dual citizenship allowed.",
    hero_badge: "Turkey CBI 2026",
    hero_placeholder: "Ask about Turkish CBI requirements, restricted nationalities, family inclusion…",
    stats: [
      { num: "$400K", label: "Property minimum" },
      { num: "6–8 mo", label: "Average timeline" },
      { num: "110+", label: "Visa-free countries" },
      { num: "3 yr", label: "Hold period" },
    ],
    routes_eyebrow: "Five qualifying routes",
    routes_title: "All five qualifying routes for Turkish citizenship",
    routes_sub: "Real estate is by far the most popular path — over 80% of CBI applications come through property. The other four routes serve specific investor profiles.",
    routes: [
      { type: "Real estate", amount: "$400,000+", hold: "3 years", notes: "Single or multiple properties. Must include 3-year no-sell annotation on TAPU. SPK-certified valuation required.", highlighted: true },
      { type: "Bank deposit", amount: "$500,000+", hold: "3 years", notes: "Fixed deposit in a Turkish bank, USD or TRY. Cannot withdraw or transfer abroad during the 3 years." },
      { type: "Government bonds", amount: "$500,000+", hold: "3 years", notes: "Turkish government debt instruments held through a regulated Turkish broker." },
      { type: "Fixed capital", amount: "$500,000+", hold: "3 years", notes: "Investment in fixed business assets — equipment, machinery, infrastructure — confirmed by Ministry of Industry." },
      { type: "Job creation", amount: "50 employees", hold: "3 years", notes: "Hire and maintain 50+ Turkish citizens for a minimum of 3 years. Confirmed by Ministry of Labour." },
    ],
    routes_type_label: "Route",
    routes_amount_label: "Min amount",
    routes_hold_label: "Hold",
    routes_notes_label: "Notes",
    steps_eyebrow: "Process",
    steps_title: "How Turkish citizenship by investment works step-by-step",
    steps: [
      { title: "Tax ID + bank account", desc: "We obtain your Turkish tax number (Vergi Numarası) and open a bank account in your name — both can be done before you arrive.", days: "Day 1–7" },
      { title: "Property selection + SPK valuation", desc: "We shortlist properties matching your goal, get a SPK-certified valuation report and confirm the title is clean.", days: "Day 7–21" },
      { title: "Sale contract + Safe Payment", desc: "Sign the SPA. From May 2026, payment goes through Güvenli Ödeme Sistemi (mandatory bank-managed escrow).", days: "Day 14–30" },
      { title: "TAPU + 3-year annotation", desc: "Title deed transfer at Land Registry with the mandatory 3-year no-sell annotation. You become the legal owner.", days: "Day 25–40" },
      { title: "Residence permit", desc: "Health insurance + biometrics + temporary residence permit issued — required to file the citizenship application.", days: "Day 40–70" },
      { title: "Citizenship application + passport", desc: "Submit citizenship application. Background check and ministry approval. Passport issued at the consulate or in Turkey.", days: "Day 70–240" },
    ],
    docs_title: "Documents you will need",
    docs_intro: "Standard documentation for the property route. Apostilled and translated by sworn Turkish translators. We coordinate everything end-to-end.",
    docs: [
      "Valid passport (6+ months validity, all pages)",
      "Notarized + apostilled birth certificate",
      "Marriage certificate (if applicable, apostilled)",
      "Children's birth certificates (under 18)",
      "Recent biometric photos (white background)",
      "Police clearance / criminal record certificate",
      "Turkish health insurance (we arrange)",
      "TAPU + SPK valuation report (we arrange)",
      "Bank receipts confirming the $400,000 transfer",
      "Address registration in Turkey (Adres Beyanı)",
      "Power of Attorney for remote application (optional)",
    ],
    costs_title: "Real costs of the property route",
    costs_intro: "Indicative all-in costs to take a $400,000 property purchase to a Turkish passport for one applicant + spouse + 2 children.",
    costs_disclaimer: "Figures are 2026 indicative. Final cost depends on the property, family size and route. We provide a binding case-based quote after our initial call.",
    cost_groups: [
      {
        title: "Property + transfer",
        items: [
          { label: "Property minimum", value: "$400,000" },
          { label: "TAPU transfer fee (4%)", value: "From $16,000" },
          { label: "Notary + translations", value: "From $1,500" },
        ],
      },
      {
        title: "Application fees",
        items: [
          { label: "Residence permit", value: "$631" },
          { label: "Citizenship application", value: "$1,500" },
          { label: "Health insurance (per person)", value: "From $300" },
        ],
      },
      {
        title: "Service + extras",
        items: [
          { label: "Service fee (turnkey)", value: "From $7,000" },
          { label: "Power of Attorney", value: "From $400" },
          { label: "Sworn translation per doc", value: "From $50" },
        ],
      },
    ],
    faq_title: "Turkish citizenship by investment — FAQ",
    faq_items: [
      { question: "Can I keep my original citizenship?", answer: "Yes. Turkey allows dual nationality. Some home countries restrict it (China, India, Iran for some categories) — we check yours during onboarding before you commit." },
      { question: "Are there any restricted nationalities?", answer: "Citizens of Syria, Armenia, North Korea, Cuba and a few other countries cannot acquire property in Turkey for citizenship. Iranians, Russians, Saudi citizens and most other nationalities are eligible." },
      { question: "Can my children apply with me?", answer: "Yes. Children under 18 are included in the same investment with no minimum increase. Children 18–25 may be included if they are unmarried students dependent on the main applicant — case-by-case." },
      { question: "Do I have to live in Turkey?", answer: "No. There is no minimum stay requirement for the citizenship-by-investment route, before or after citizenship is granted. You can collect your passport and never set foot in Turkey again — though you'll likely want to visit." },
      { question: "Can I sell the property after 3 years?", answer: "Yes. After exactly 3 years from TAPU registration, you can sell the property freely with no impact on your citizenship — citizenship, once granted, is permanent and inheritable." },
      { question: "What is SPK valuation and why does it matter?", answer: "SPK is the Turkish Capital Markets Board. Your property must be valued by an SPK-licensed appraiser. From 2026, the valuation must equal the actual sale price — under-valuing or over-valuing the property can void your application." },
      { question: "Can I use multiple properties to reach $400,000?", answer: "Yes. You can combine 2 or more properties (residential, commercial or land) totaling $400,000 or more, all with the same 3-year no-sell annotation." },
      { question: "What about Iranian citizens — can we apply?", answer: "Yes. Iranian nationals are fully eligible and one of the largest applicant groups for Turkish CBI. We have specialised teams to handle Iran-specific documentation and money transfer logistics." },
      { question: "What changed on May 1, 2026?", answer: "All real estate payments now flow through Güvenli Ödeme Sistemi — a mandatory bank-managed escrow. The escrow only releases funds to the seller after TAPU is transferred. This protects you from fraud and aligns with new anti-money-laundering rules." },
      { question: "How long is the Turkish passport valid?", answer: "10 years for adults. Renewable indefinitely as long as you remain a Turkish citizen — and citizenship-by-investment grants permanent citizenship that cannot be revoked except in extreme cases (treason, fraud)." },
    ],
    crosssell_title: "Combine with",
    crosssell_property_title: "Buy Property in Turkey",
    crosssell_property_desc: "Find the right property for the $400K route",
    crosssell_company_title: "Turkey Company Registration",
    crosssell_company_desc: "Pair citizenship with a Turkish company",
    crosssell_uae_title: "UAE Golden Visa",
    crosssell_uae_desc: "Compare with 10-year UAE residency",
    lead_title: "Get a Turkey CBI feasibility check",
    lead_sub: "Tell us your nationality, family size and budget — we'll send a clear go/no-go assessment with total cost and timeline within 24 hours.",
  },
  fa: {
    breadcrumb_turkey: "ترکیه",
    breadcrumb_self: "شهروندی با سرمایه‌گذاری",
    hero_h1: "شهروندی ترکیه با سرمایه‌گذاری ۲۰۲۶ — پاسپورت در ۶ تا ۸ ماه از ۴۰۰,۰۰۰ دلار",
    hero_sub:
      "یکی از سریع‌ترین برنامه‌های CBI جهان. ۴۰۰,۰۰۰ دلار در ملک (با نگهداری ۳ سال) به شما و خانواده‌تان پاسپورت ترکیه می‌دهد — سفر بدون ویزا به ۱۱۰+ کشور. تابعیت دوگانه مجاز.",
    hero_badge: "CBI ترکیه ۲۰۲۶",
    hero_placeholder: "درباره شرایط CBI ترکیه، ملیت‌های ممنوع، شامل خانواده بپرسید…",
    stats: [
      { num: "۴۰۰K دلار", label: "حداقل ملک" },
      { num: "۶ تا ۸ ماه", label: "زمان متوسط" },
      { num: "۱۱۰+", label: "کشور بدون ویزا" },
      { num: "۳ سال", label: "دوره نگهداری" },
    ],
    routes_eyebrow: "پنج مسیر واجد شرایط",
    routes_title: "تمام پنج مسیر واجد شرایط شهروندی ترکیه",
    routes_sub: "مسیر ملک به‌وضوح محبوب‌ترین است — بیش از ۸۰٪ درخواست‌های CBI از طریق ملک می‌آیند. چهار مسیر دیگر مناسب پروفایل‌های خاص سرمایه‌گذار است.",
    routes: [
      { type: "ملک", amount: "از ۴۰۰,۰۰۰ دلار", hold: "۳ سال", notes: "یک یا چند ملک. باید annotation عدم فروش ۳ ساله روی TAPU داشته باشد. ارزیابی SPK لازم است.", highlighted: true },
      { type: "سپرده بانکی", amount: "از ۵۰۰,۰۰۰ دلار", hold: "۳ سال", notes: "سپرده ثابت در بانک ترکی به دلار یا لیر. در طول ۳ سال قابل برداشت یا انتقال به خارج نیست." },
      { type: "اوراق دولتی", amount: "از ۵۰۰,۰۰۰ دلار", hold: "۳ سال", notes: "اوراق بدهی دولت ترکیه از طریق کارگزار دارای مجوز ترکی." },
      { type: "سرمایه ثابت", amount: "از ۵۰۰,۰۰۰ دلار", hold: "۳ سال", notes: "سرمایه‌گذاری در دارایی‌های ثابت کسب‌وکار — تجهیزات، ماشین‌آلات، زیرساخت — تأیید وزارت صنعت." },
      { type: "ایجاد شغل", amount: "۵۰ کارمند", hold: "۳ سال", notes: "استخدام و حفظ ۵۰+ شهروند ترکی برای حداقل ۳ سال. تأیید وزارت کار." },
    ],
    routes_type_label: "مسیر",
    routes_amount_label: "حداقل",
    routes_hold_label: "نگهداری",
    routes_notes_label: "توضیحات",
    steps_eyebrow: "فرآیند",
    steps_title: "شهروندی ترکیه با سرمایه‌گذاری گام‌به‌گام چگونه است",
    steps: [
      { title: "کد مالیاتی + حساب بانکی", desc: "کد مالیاتی ترکیه (Vergi Numarası) را می‌گیریم و حساب بانکی به نام شما باز می‌کنیم — هر دو قبل از ورود شما قابل انجام است.", days: "روز ۱ تا ۷" },
      { title: "انتخاب ملک + ارزیابی SPK", desc: "املاک متناسب با هدف شما را short-list می‌کنیم، گزارش ارزیابی SPK معتبر می‌گیریم و سند را تأیید می‌کنیم.", days: "روز ۷ تا ۲۱" },
      { title: "قرارداد فروش + سیستم پرداخت امن", desc: "SPA امضا می‌شود. از مه ۲۰۲۶ پرداخت از طریق Güvenli Ödeme Sistemi (escrow بانکی اجباری) انجام می‌شود.", days: "روز ۱۴ تا ۳۰" },
      { title: "TAPU + annotation ۳ ساله", desc: "انتقال سند در اداره ثبت اسناد با annotation اجباری ۳ ساله عدم فروش. شما مالک قانونی می‌شوید.", days: "روز ۲۵ تا ۴۰" },
      { title: "مجوز اقامت", desc: "بیمه سلامت + بیومتریک + اقامت موقت صادر می‌شود — برای ثبت درخواست شهروندی لازم است.", days: "روز ۴۰ تا ۷۰" },
      { title: "درخواست شهروندی + پاسپورت", desc: "ارسال درخواست شهروندی. بررسی سوابق و تأیید وزارت. پاسپورت در کنسولگری یا ترکیه صادر می‌شود.", days: "روز ۷۰ تا ۲۴۰" },
    ],
    docs_title: "مدارک مورد نیاز",
    docs_intro: "مدارک استاندارد برای مسیر ملک. apostille شده و توسط مترجم رسمی ترکی ترجمه می‌شود. ما همه چیز را end-to-end هماهنگ می‌کنیم.",
    docs: [
      "پاسپورت معتبر (حداقل ۶ ماه اعتبار، تمام صفحات)",
      "شناسنامه نوتاری شده + apostille",
      "سند ازدواج (در صورت داشتن، apostille)",
      "شناسنامه فرزندان (زیر ۱۸)",
      "عکس‌های بیومتریک اخیر (زمینه سفید)",
      "گواهی عدم سوء سابقه",
      "بیمه سلامت ترکیه (ما تنظیم می‌کنیم)",
      "TAPU + گزارش ارزیابی SPK (ما تنظیم می‌کنیم)",
      "رسیدهای بانکی تأییدکننده انتقال ۴۰۰,۰۰۰ دلار",
      "ثبت آدرس در ترکیه (Adres Beyanı)",
      "وکالت‌نامه برای درخواست از راه دور (اختیاری)",
    ],
    costs_title: "هزینه واقعی مسیر ملک",
    costs_intro: "هزینه تقریبی end-to-end برای رسیدن از خرید ملک ۴۰۰,۰۰۰ دلاری به پاسپورت ترکی برای یک متقاضی + همسر + ۲ فرزند.",
    costs_disclaimer: "ارقام تقریبی ۲۰۲۶. هزینه نهایی به ملک، تعداد خانواده و مسیر بستگی دارد. پس از تماس اولیه قیمت دقیق بر اساس کیس می‌دهیم.",
    cost_groups: [
      {
        title: "ملک + انتقال",
        items: [
          { label: "حداقل ملک", value: "۴۰۰,۰۰۰ دلار" },
          { label: "هزینه انتقال TAPU (۴٪)", value: "از ۱۶,۰۰۰ دلار" },
          { label: "نوتاری + ترجمه", value: "از ۱,۵۰۰ دلار" },
        ],
      },
      {
        title: "هزینه‌های درخواست",
        items: [
          { label: "مجوز اقامت", value: "۶۳۱ دلار" },
          { label: "درخواست شهروندی", value: "۱,۵۰۰ دلار" },
          { label: "بیمه سلامت (هر نفر)", value: "از ۳۰۰ دلار" },
        ],
      },
      {
        title: "خدمات + موارد جانبی",
        items: [
          { label: "هزینه خدمات (turnkey)", value: "از ۷,۰۰۰ دلار" },
          { label: "وکالت‌نامه", value: "از ۴۰۰ دلار" },
          { label: "ترجمه رسمی هر سند", value: "از ۵۰ دلار" },
        ],
      },
    ],
    faq_title: "شهروندی ترکیه با سرمایه‌گذاری — پرسش‌های رایج",
    faq_items: [
      { question: "آیا تابعیت اصلی‌ام را حفظ می‌کنم؟", answer: "بله. ترکیه تابعیت دوگانه را می‌پذیرد. برخی کشورهای مبدأ آن را محدود می‌کنند (چین، هند، ایران در برخی دسته‌ها) — قبل از تعهد در onboarding بررسی می‌کنیم." },
      { question: "آیا ملیت‌های ممنوع وجود دارد؟", answer: "شهروندان سوریه، ارمنستان، کره شمالی، کوبا و چند کشور دیگر نمی‌توانند ملک ترکیه برای شهروندی بخرند. ایرانی‌ها، روس‌ها، عربستانی‌ها و اکثر ملیت‌های دیگر واجد شرایط‌اند." },
      { question: "آیا فرزندانم می‌توانند با من اقدام کنند؟", answer: "بله. فرزندان زیر ۱۸ سال در همان سرمایه‌گذاری بدون افزایش حداقل شامل می‌شوند. فرزندان ۱۸ تا ۲۵ سال اگر مجرد و دانشجو وابسته به متقاضی اصلی باشند ممکن است بسته به مورد شامل شوند." },
      { question: "آیا باید در ترکیه زندگی کنم؟", answer: "خیر. هیچ حداقل اقامتی برای مسیر شهروندی با سرمایه‌گذاری وجود ندارد، نه قبل و نه بعد از اعطای شهروندی. می‌توانید پاسپورت بگیرید و دیگر هرگز پا به ترکیه نگذارید — اگرچه احتمالاً می‌خواهید بازدید کنید." },
      { question: "آیا می‌توانم بعد از ۳ سال ملک را بفروشم؟", answer: "بله. دقیقاً ۳ سال پس از ثبت TAPU، می‌توانید آزادانه بفروشید بدون تأثیر بر شهروندی — شهروندی پس از اعطا دائمی و قابل ارث است." },
      { question: "ارزیابی SPK چیست و چرا مهم است؟", answer: "SPK سازمان بازارهای سرمایه ترکیه است. ملک شما باید توسط ارزیاب دارای مجوز SPK ارزیابی شود. از ۲۰۲۶ ارزیابی باید با قیمت واقعی فروش برابر باشد — ارزش‌گذاری کم یا زیاد می‌تواند درخواست را باطل کند." },
      { question: "آیا می‌توانم چند ملک ترکیب کنم؟", answer: "بله. می‌توانید ۲ یا چند ملک (مسکونی، تجاری یا زمین) با مجموع ۴۰۰,۰۰۰ دلار یا بیشتر، همگی با annotation ۳ ساله عدم فروش ترکیب کنید." },
      { question: "ایرانیان چطور — می‌توانیم اقدام کنیم؟", answer: "بله. اتباع ایرانی کاملاً واجد شرایط‌اند و یکی از بزرگ‌ترین گروه‌های متقاضی CBI ترکیه هستند. ما تیم‌های تخصصی برای رسیدگی به مدارک ایرانی و لجستیک انتقال پول داریم." },
      { question: "از ۱ مه ۲۰۲۶ چه چیزی تغییر کرد؟", answer: "تمام پرداخت‌های ملک حالا از طریق Güvenli Ödeme Sistemi جریان دارند — escrow اجباری بانکی. escrow وجه را فقط پس از انتقال TAPU به فروشنده آزاد می‌کند. این از کلاهبرداری محافظت و با قوانین ضد پولشویی جدید همسوست." },
      { question: "پاسپورت ترکیه چقدر اعتبار دارد؟", answer: "۱۰ سال برای بزرگسالان. تا زمانی که شهروند ترکیه باقی بمانید بدون محدودیت قابل تمدید است — و شهروندی با سرمایه‌گذاری شهروندی دائمی می‌دهد که جز در موارد شدید (خیانت، تقلب) قابل لغو نیست." },
    ],
    crosssell_title: "ترکیب کنید با",
    crosssell_property_title: "خرید ملک در ترکیه",
    crosssell_property_desc: "ملک مناسب مسیر ۴۰۰K پیدا کنید",
    crosssell_company_title: "ثبت شرکت در ترکیه",
    crosssell_company_desc: "شهروندی + شرکت ترکی را ترکیب کنید",
    crosssell_uae_title: "گلدن ویزای امارات",
    crosssell_uae_desc: "مقایسه با اقامت ۱۰ ساله امارات",
    lead_title: "ارزیابی امکان‌سنجی CBI ترکیه",
    lead_sub: "ملیت، تعداد خانواده و بودجه را بنویسید — ارزیابی شفاف go/no-go با هزینه کل و زمان‌بندی در ۲۴ ساعت می‌فرستیم.",
  },
  ar: {
    breadcrumb_turkey: "تركيا",
    breadcrumb_self: "الجنسية بالاستثمار",
    hero_h1: "الجنسية التركية بالاستثمار 2026 — جواز سفر خلال 6 إلى 8 أشهر من 400,000 دولار",
    hero_sub:
      "أحد أسرع برامج CBI في العالم. 400,000 دولار في العقار (احتفاظ 3 سنوات) يمنحك ولعائلتك جوازات سفر تركية — سفر بدون تأشيرة لـ +110 دولة. ازدواجية الجنسية مسموحة.",
    hero_badge: "CBI تركيا 2026",
    hero_placeholder: "اسأل عن شروط CBI تركيا، الجنسيات المقيدة، شمول العائلة…",
    stats: [
      { num: "400 ألف $", label: "الحد الأدنى للعقار" },
      { num: "6–8 أشهر", label: "الزمن المتوسط" },
      { num: "+110", label: "دولة بدون تأشيرة" },
      { num: "3 سنوات", label: "فترة الاحتفاظ" },
    ],
    routes_eyebrow: "خمسة مسارات مؤهلة",
    routes_title: "جميع المسارات الخمسة المؤهلة للجنسية التركية",
    routes_sub: "العقار هو الأكثر شعبية بفارق كبير — أكثر من 80٪ من طلبات CBI تأتي عبر العقار. المسارات الأربعة الأخرى تخدم ملفات مستثمر محددة.",
    routes: [
      { type: "العقار", amount: "من 400,000 $", hold: "3 سنوات", notes: "عقار واحد أو عدة عقارات. يجب أن يحوي annotation عدم بيع 3 سنوات على TAPU. تقييم SPK معتمد مطلوب.", highlighted: true },
      { type: "إيداع بنكي", amount: "من 500,000 $", hold: "3 سنوات", notes: "إيداع ثابت في بنك تركي بالدولار أو الليرة. لا يمكن السحب أو التحويل للخارج خلال 3 سنوات." },
      { type: "سندات حكومية", amount: "من 500,000 $", hold: "3 سنوات", notes: "أدوات الدين الحكومي التركي عبر وسيط مرخص في تركيا." },
      { type: "رأس مال ثابت", amount: "من 500,000 $", hold: "3 سنوات", notes: "استثمار في أصول الأعمال الثابتة — معدات، آلات، بنية تحتية — تأكيد وزارة الصناعة." },
      { type: "خلق وظائف", amount: "50 موظف", hold: "3 سنوات", notes: "توظيف +50 مواطن تركي والإبقاء عليهم لمدة 3 سنوات. تأكيد وزارة العمل." },
    ],
    routes_type_label: "المسار",
    routes_amount_label: "الحد الأدنى",
    routes_hold_label: "الاحتفاظ",
    routes_notes_label: "ملاحظات",
    steps_eyebrow: "العملية",
    steps_title: "كيف تتم الجنسية التركية بالاستثمار خطوة بخطوة",
    steps: [
      { title: "الرقم الضريبي + الحساب البنكي", desc: "نحصل على رقمك الضريبي التركي (Vergi Numarası) ونفتح حساباً بنكياً باسمك — كلاهما قبل وصولك.", days: "اليوم 1 إلى 7" },
      { title: "اختيار العقار + تقييم SPK", desc: "نحضر قائمة عقارات تطابق هدفك، نحصل على تقرير تقييم SPK معتمد ونؤكد نظافة الملكية.", days: "اليوم 7 إلى 21" },
      { title: "عقد البيع + الدفع الآمن", desc: "نوقع SPA. من مايو 2026، الدفع يتم عبر Güvenli Ödeme Sistemi (حساب ضمان بنكي إلزامي).", days: "اليوم 14 إلى 30" },
      { title: "TAPU + annotation 3 سنوات", desc: "نقل سند الملكية في السجل العقاري مع annotation عدم البيع لـ 3 سنوات. تصبح المالك القانوني.", days: "اليوم 25 إلى 40" },
      { title: "تصريح الإقامة", desc: "تأمين صحي + بصمات + إقامة مؤقتة — مطلوبة لتقديم طلب الجنسية.", days: "اليوم 40 إلى 70" },
      { title: "طلب الجنسية + جواز السفر", desc: "تقديم طلب الجنسية. فحص الخلفية وموافقة الوزارة. جواز السفر يصدر من القنصلية أو في تركيا.", days: "اليوم 70 إلى 240" },
    ],
    docs_title: "الوثائق المطلوبة",
    docs_intro: "وثائق قياسية لمسار العقار. مصادقة مع apostille وترجمة من قبل مترجم تركي محلف. نتولى كل شيء end-to-end.",
    docs: [
      "جواز سفر ساري (صلاحية 6+ أشهر، جميع الصفحات)",
      "شهادة ميلاد موثقة + apostille",
      "عقد الزواج (إن وجد، apostille)",
      "شهادات ميلاد الأبناء (دون 18)",
      "صور بيومترية حديثة (خلفية بيضاء)",
      "شهادة عدم محكومية",
      "تأمين صحي تركي (نتولى ترتيبه)",
      "TAPU + تقرير تقييم SPK (نتولى ترتيبه)",
      "إيصالات بنكية تؤكد تحويل 400,000 دولار",
      "تسجيل العنوان في تركيا (Adres Beyanı)",
      "توكيل للتقديم عن بُعد (اختياري)",
    ],
    costs_title: "تكاليف حقيقية لمسار العقار",
    costs_intro: "تكلفة شاملة إرشادية للوصول من شراء عقار 400,000 $ إلى جواز سفر تركي لمتقدم واحد + زوج + طفلين.",
    costs_disclaimer: "أرقام إرشادية لـ 2026. التكلفة النهائية تعتمد على العقار وحجم العائلة والمسار. نقدم عرضاً مفصلاً ملزماً بعد المكالمة الأولية.",
    cost_groups: [
      {
        title: "العقار + النقل",
        items: [
          { label: "حد العقار", value: "400,000 $" },
          { label: "رسوم نقل TAPU (4٪)", value: "من 16,000 $" },
          { label: "كاتب عدل + ترجمة", value: "من 1,500 $" },
        ],
      },
      {
        title: "رسوم الطلب",
        items: [
          { label: "تصريح الإقامة", value: "631 $" },
          { label: "طلب الجنسية", value: "1,500 $" },
          { label: "تأمين صحي (للشخص)", value: "من 300 $" },
        ],
      },
      {
        title: "الخدمات + الإضافات",
        items: [
          { label: "رسوم الخدمات (turnkey)", value: "من 7,000 $" },
          { label: "توكيل", value: "من 400 $" },
          { label: "ترجمة محلفة لكل وثيقة", value: "من 50 $" },
        ],
      },
    ],
    faq_title: "الجنسية التركية بالاستثمار — أسئلة شائعة",
    faq_items: [
      { question: "هل أحتفظ بجنسيتي الأصلية؟", answer: "نعم. تركيا تسمح بازدواجية الجنسية. بعض دول الأصل تقيدها (الصين، الهند، إيران لبعض الفئات) — نتحقق منها أثناء onboarding قبل الالتزام." },
      { question: "هل توجد جنسيات مقيدة؟", answer: "مواطنو سوريا وأرمينيا وكوريا الشمالية وكوبا وقليل من البلدان الأخرى لا يمكنهم اقتناء العقار في تركيا للجنسية. الإيرانيون والروس والسعوديون ومعظم الجنسيات الأخرى مؤهلون." },
      { question: "هل يمكن لأبنائي التقديم معي؟", answer: "نعم. الأبناء دون 18 مشمولون بنفس الاستثمار بدون زيادة الحد الأدنى. الأبناء من 18 إلى 25 قد يُشملون إذا كانوا غير متزوجين وطلاب معالين بالمتقدم الرئيسي — حسب كل حالة." },
      { question: "هل يجب أن أعيش في تركيا؟", answer: "لا. لا يوجد حد أدنى للإقامة لمسار الجنسية بالاستثمار، قبل أو بعد منح الجنسية. يمكنك استلام جواز سفرك ولا تطأ تركيا مرة أخرى — رغم أنك ستزور على الأرجح." },
      { question: "هل يمكنني بيع العقار بعد 3 سنوات؟", answer: "نعم. بعد 3 سنوات بالضبط من تسجيل TAPU، يمكنك البيع بحرية دون التأثير على جنسيتك — الجنسية بمجرد منحها دائمة وقابلة للتوريث." },
      { question: "ما هو تقييم SPK ولماذا يهم؟", answer: "SPK هو هيئة أسواق المال التركية. يجب تقييم عقارك من قبل مقيم مرخص من SPK. من 2026 يجب أن يساوي التقييم سعر البيع الفعلي — التقييم الأقل أو الأعلى يمكن أن يبطل الطلب." },
      { question: "هل يمكنني استخدام عدة عقارات للوصول إلى 400,000 $؟", answer: "نعم. يمكنك دمج عقارين أو أكثر (سكني، تجاري أو أرض) بإجمالي 400,000 $ أو أكثر، كلها مع annotation عدم البيع لـ 3 سنوات." },
      { question: "ماذا عن المواطنين العرب — هل يمكننا التقديم؟", answer: "نعم. مواطنو السعودية والإمارات والكويت ومصر والأردن وجميع الدول العربية الأخرى مؤهلون. لدينا فرق متخصصة بالعربية للتعامل مع الوثائق المحددة لكل بلد." },
      { question: "ماذا تغير في 1 مايو 2026؟", answer: "جميع مدفوعات العقار الآن تتدفق عبر Güvenli Ödeme Sistemi — حساب ضمان بنكي إلزامي. يفرج عن الأموال للبائع فقط بعد نقل TAPU. هذا يحمي من الاحتيال ويتماشى مع قواعد مكافحة غسيل الأموال الجديدة." },
      { question: "كم تستمر صلاحية جواز السفر التركي؟", answer: "10 سنوات للبالغين. قابل للتجديد بدون قيود ما دمت مواطناً تركياً — والجنسية بالاستثمار تمنح جنسية دائمة لا يمكن إلغاؤها إلا في حالات شديدة (خيانة، احتيال)." },
    ],
    crosssell_title: "اجمع مع",
    crosssell_property_title: "شراء عقار في تركيا",
    crosssell_property_desc: "اعثر على العقار المناسب لمسار 400 ألف",
    crosssell_company_title: "تأسيس شركة في تركيا",
    crosssell_company_desc: "اجمع الجنسية مع شركة تركية",
    crosssell_uae_title: "الإقامة الذهبية الإمارات",
    crosssell_uae_desc: "قارن مع إقامة 10 سنوات في الإمارات",
    lead_title: "احصل على فحص جدوى لـ CBI تركيا",
    lead_sub: "أخبرنا بجنسيتك وحجم عائلتك وميزانيتك — سنرسل تقييم go/no-go واضح مع التكلفة الإجمالية والمدة خلال 24 ساعة.",
  },
  ru: {
    breadcrumb_turkey: "Турция",
    breadcrumb_self: "Гражданство по инвестициям",
    hero_h1: "Гражданство Турции по инвестициям 2026 — паспорт за 6–8 месяцев от 400 000 $",
    hero_sub:
      "Одна из самых быстрых программ CBI в мире. 400 000 $ в недвижимости (удержание 3 года) даёт вам и семье турецкие паспорта — безвизовый въезд в 110+ стран. Двойное гражданство разрешено.",
    hero_badge: "CBI Турция 2026",
    hero_placeholder: "Спросите про условия CBI Турции, ограничения по гражданству, включение семьи…",
    stats: [
      { num: "$400K", label: "Минимум недвижимости" },
      { num: "6–8 мес", label: "Средний срок" },
      { num: "110+", label: "Стран без визы" },
      { num: "3 года", label: "Срок удержания" },
    ],
    routes_eyebrow: "Пять подходящих маршрутов",
    routes_title: "Все пять маршрутов к гражданству Турции",
    routes_sub: "Маршрут через недвижимость самый популярный — более 80% заявок CBI идут через недвижимость. Остальные четыре маршрута для специфических профилей инвесторов.",
    routes: [
      { type: "Недвижимость", amount: "От $400 000", hold: "3 года", notes: "Один или несколько объектов. На ТАПУ обязательная отметка о запрете продажи 3 года. Требуется оценка SPK.", highlighted: true },
      { type: "Банковский депозит", amount: "От $500 000", hold: "3 года", notes: "Срочный депозит в турецком банке в USD или TRY. Нельзя снять или вывести за границу в течение 3 лет." },
      { type: "Гособлигации", amount: "От $500 000", hold: "3 года", notes: "Турецкие государственные долговые инструменты через лицензированного турецкого брокера." },
      { type: "Основной капитал", amount: "От $500 000", hold: "3 года", notes: "Инвестиция в основные средства бизнеса — оборудование, машины, инфраструктура — подтверждение Министерства промышленности." },
      { type: "Создание рабочих мест", amount: "50 сотрудников", hold: "3 года", notes: "Нанять и удерживать 50+ граждан Турции минимум 3 года. Подтверждение Министерства труда." },
    ],
    routes_type_label: "Маршрут",
    routes_amount_label: "Минимум",
    routes_hold_label: "Удержание",
    routes_notes_label: "Заметки",
    steps_eyebrow: "Процесс",
    steps_title: "Как получить гражданство Турции по инвестициям шаг за шагом",
    steps: [
      { title: "ИНН + банковский счёт", desc: "Получаем турецкий ИНН (Vergi Numarası) и открываем банковский счёт на ваше имя — оба до вашего приезда.", days: "День 1–7" },
      { title: "Подбор объекта + оценка SPK", desc: "Шортлистим объекты под цель, получаем сертифицированный отчёт SPK и проверяем чистоту титула.", days: "День 7–21" },
      { title: "Договор + Безопасный платёж", desc: "Подписание SPA. С мая 2026 платежи проходят через Güvenli Ödeme Sistemi (обязательный банковский эскроу).", days: "День 14–30" },
      { title: "ТАПУ + 3-летняя отметка", desc: "Передача права в Кадастре с обязательной отметкой о запрете продажи 3 года. Вы становитесь юридическим владельцем.", days: "День 25–40" },
      { title: "ВНЖ", desc: "Медстраховка + биометрия + временный ВНЖ — необходим для подачи на гражданство.", days: "День 40–70" },
      { title: "Заявление на гражданство + паспорт", desc: "Подача на гражданство. Проверка биографии и одобрение министерства. Паспорт выдается в консульстве или в Турции.", days: "День 70–240" },
    ],
    docs_title: "Необходимые документы",
    docs_intro: "Стандартный пакет для маршрута через недвижимость. Апостиль и перевод присяжным турецким переводчиком. Координируем всё end-to-end.",
    docs: [
      "Действующий паспорт (срок 6+ месяцев, все страницы)",
      "Нотариально заверенное свидетельство о рождении + апостиль",
      "Свидетельство о браке (если применимо, апостиль)",
      "Свидетельства о рождении детей (до 18)",
      "Свежие биометрические фото (белый фон)",
      "Справка о несудимости",
      "Турецкая медстраховка (мы оформляем)",
      "ТАПУ + отчёт оценки SPK (мы оформляем)",
      "Банковские квитанции о переводе $400 000",
      "Регистрация адреса в Турции (Adres Beyanı)",
      "Доверенность для удалённой подачи (опционально)",
    ],
    costs_title: "Реальные расходы по маршруту через недвижимость",
    costs_intro: "Ориентировочные суммарные расходы — от покупки объекта за $400 000 до турецкого паспорта на одного заявителя + супруг + 2 детей.",
    costs_disclaimer: "Цифры ориентировочные на 2026. Финал зависит от объекта, состава семьи и маршрута. Точное предложение даём после первой звонка по кейсу.",
    cost_groups: [
      {
        title: "Объект + перевод",
        items: [
          { label: "Минимум объекта", value: "$400 000" },
          { label: "Сбор за ТАПУ (4%)", value: "От $16 000" },
          { label: "Нотариус + переводы", value: "От $1 500" },
        ],
      },
      {
        title: "Сборы за подачу",
        items: [
          { label: "ВНЖ", value: "$631" },
          { label: "Заявление на гражданство", value: "$1 500" },
          { label: "Медстраховка (на чел.)", value: "От $300" },
        ],
      },
      {
        title: "Сервис + доп.",
        items: [
          { label: "Сервисный тариф (turnkey)", value: "От $7 000" },
          { label: "Доверенность", value: "От $400" },
          { label: "Присяжный перевод за документ", value: "От $50" },
        ],
      },
    ],
    faq_title: "Гражданство Турции по инвестициям — FAQ",
    faq_items: [
      { question: "Сохраняю ли я оригинальное гражданство?", answer: "Да. Турция допускает двойное гражданство. Некоторые страны происхождения это ограничивают (Китай, Индия, Иран — для отдельных категорий) — мы проверяем при онбординге до обязательств." },
      { question: "Есть ли ограничения по гражданству?", answer: "Граждане Сирии, Армении, Северной Кореи, Кубы и нескольких других стран не могут приобретать недвижимость в Турции для гражданства. Иранцы, россияне, граждане Саудовской Аравии и большинство других — могут." },
      { question: "Могут ли дети подать со мной?", answer: "Да. Дети до 18 включены в ту же инвестицию без увеличения минимума. Дети 18–25 могут быть включены, если не состоят в браке и являются студентами-иждивенцами — индивидуально." },
      { question: "Нужно ли жить в Турции?", answer: "Нет. Для маршрута гражданства за инвестиции нет требований к минимальному пребыванию ни до, ни после получения гражданства. Можно забрать паспорт и больше никогда не приезжать — хотя, скорее всего, захочется." },
      { question: "Можно ли продать недвижимость через 3 года?", answer: "Да. Ровно через 3 года после регистрации ТАПУ можно продать объект свободно без влияния на гражданство — гражданство, единожды выданное, постоянно и наследуется." },
      { question: "Что такое оценка SPK и почему это важно?", answer: "SPK — Совет по рынкам капитала Турции. Объект должен быть оценён лицензированным оценщиком SPK. С 2026 оценка должна равняться фактической цене продажи — заниженная или завышенная оценка может аннулировать заявку." },
      { question: "Можно ли использовать несколько объектов для $400 000?", answer: "Да. Можно объединить 2 или больше объектов (жильё, коммерция или земля) на сумму от $400 000, все с 3-летней отметкой запрета продажи." },
      { question: "А что насчёт россиян — можем подавать?", answer: "Да. Граждане РФ полностью имеют право и являются одной из крупнейших групп заявителей CBI Турции после санкций. У нас русскоязычные команды для документации и логистики переводов." },
      { question: "Что изменилось с 1 мая 2026?", answer: "Все платежи за недвижимость теперь идут через Güvenli Ödeme Sistemi — обязательный банковский эскроу. Эскроу освобождает средства продавцу только после передачи ТАПУ. Это защита от мошенничества и соответствие новым правилам ПОД/ФТ." },
      { question: "Сколько действует турецкий паспорт?", answer: "10 лет для взрослых. Бесконечно продлеваем, пока вы остаётесь гражданином Турции — а гражданство по инвестициям бессрочное и не отзывается, кроме крайних случаев (госизмена, мошенничество)." },
    ],
    crosssell_title: "Совмещайте с",
    crosssell_property_title: "Покупка недвижимости в Турции",
    crosssell_property_desc: "Найдите подходящий объект для маршрута $400K",
    crosssell_company_title: "Регистрация компании в Турции",
    crosssell_company_desc: "Совмещайте гражданство с компанией",
    crosssell_uae_title: "Golden Visa ОАЭ",
    crosssell_uae_desc: "Сравните с 10-летним ВНЖ ОАЭ",
    lead_title: "Получите проверку приемлемости CBI Турции",
    lead_sub: "Расскажите про гражданство, состав семьи и бюджет — пришлём чёткий вердикт go/no-go с итогом и сроками в течение 24 часов.",
  },
};

export default function TurkeyCitizenshipClient() {
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
      title: c.crosssell_property_title,
      description: c.crosssell_property_desc,
      icon: Building,
      href: linkPath("turkey/buy-property/"),
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

        {/* Routes table */}
        <section className="py-16 bg-surface">
          <div className="max-w-5xl mx-auto px-4">
            <div className="text-center mb-10">
              <p className="text-xs uppercase tracking-wider text-gold mb-2">{c.routes_eyebrow}</p>
              <h2 className="text-2xl md:text-3xl font-bold text-navy mb-3">{c.routes_title}</h2>
              <p className="text-sm text-muted-foreground max-w-2xl mx-auto">{c.routes_sub}</p>
            </div>
            <div className="bg-white border border-border rounded-xl overflow-hidden">
              <div className="hidden md:grid md:grid-cols-12 gap-3 px-5 py-3 bg-navy/5 border-b border-border text-xs font-semibold text-navy uppercase tracking-wider">
                <div className="col-span-2">{c.routes_type_label}</div>
                <div className="col-span-2">{c.routes_amount_label}</div>
                <div className="col-span-2">{c.routes_hold_label}</div>
                <div className="col-span-6">{c.routes_notes_label}</div>
              </div>
              {c.routes.map((r, i) => (
                <div
                  key={i}
                  className={`grid grid-cols-1 md:grid-cols-12 gap-3 px-5 py-4 border-b border-border last:border-0 ${
                    r.highlighted ? "bg-gold/5" : ""
                  }`}
                >
                  <div className="text-sm font-bold text-navy md:col-span-2 flex items-center gap-2">
                    {r.highlighted && <CheckCircle2 className="w-4 h-4 text-gold shrink-0" />}
                    {r.type}
                  </div>
                  <div className="text-sm text-navy md:col-span-2">
                    <span className="md:hidden font-semibold text-muted-foreground">{c.routes_amount_label}: </span>
                    {r.amount}
                  </div>
                  <div className="text-sm text-muted-foreground md:col-span-2">
                    <span className="md:hidden font-semibold">{c.routes_hold_label}: </span>
                    {r.hold}
                  </div>
                  <div className="text-sm text-muted-foreground md:col-span-6">
                    <span className="md:hidden font-semibold">{c.routes_notes_label}: </span>
                    {r.notes}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Steps */}
        <section className="py-16 bg-white">
          <div className="max-w-5xl mx-auto px-4">
            <div className="text-center mb-10">
              <p className="text-xs uppercase tracking-wider text-gold mb-2">{c.steps_eyebrow}</p>
              <h2 className="text-2xl md:text-3xl font-bold text-navy">{c.steps_title}</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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

        {/* Documents */}
        <section className="py-16 bg-surface">
          <div className="max-w-5xl mx-auto px-4">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-navy mb-3">{c.docs_title}</h2>
              <p className="text-sm text-muted-foreground max-w-2xl mx-auto">{c.docs_intro}</p>
            </div>
            <div className="bg-white border border-border rounded-xl p-6">
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {c.docs.map((d, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-ink">
                    <FileText className="w-4 h-4 text-gold mt-0.5 shrink-0" />
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
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
          serviceContext="turkey_citizenship"
          title={c.lead_title}
          subtitle={c.lead_sub}
        />
      </main>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}

