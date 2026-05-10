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
  Building,
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
  breadcrumb_turkey: string;
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
  crosssell_property_title: string;
  crosssell_property_desc: string;
  crosssell_uae_title: string;
  crosssell_uae_desc: string;
  lead_title: string;
  lead_sub: string;
}

const CONTENT: Record<Lang, Content> = {
  en: {
    breadcrumb_turkey: "Turkey",
    breadcrumb_self: "Company Registration",
    hero_h1: "Register a Company in Turkey 2026 — LLC, JSC or Free Zone",
    hero_sub:
      "100% foreign ownership · setup in 5–10 business days · TRY 50,000 capital (~$1,400). Bridge between Europe and Asia with EU Customs Union access. We handle articles, address, bank account end-to-end.",
    hero_badge: "Turkey Company 2026",
    hero_placeholder: "Ask about LLC vs JSC, Free Zones, tax rates, banking…",
    stats: [
      { num: "100%", label: "Foreign ownership" },
      { num: "5–10 d", label: "Setup time" },
      { num: "$1,400", label: "Min capital (LLC)" },
      { num: "30 yr", label: "Free Zone tax holiday" },
    ],
    options_eyebrow: "Your options",
    options_title: "LLC, JSC or Free Zone — what fits you?",
    options_sub: "All three allow 100% foreign ownership. Choose based on your activity, target market and long-term tax strategy.",
    options: [
      {
        title: "Limited Şirket (LLC)",
        tagline: "Most popular for SMBs",
        bullets: [
          "Min capital TRY 50,000 (~$1,400)",
          "1 to 50 shareholders, single shareholder allowed",
          "Director can be foreign and remote (with PoA)",
          "Investor visa for founder + work permits",
        ],
        price: "From $1,500",
        best_for: "Trade, services, e-commerce, startups",
        highlighted: true,
      },
      {
        title: "Anonim Şirket (JSC)",
        tagline: "Bigger structures, IPO-ready",
        bullets: [
          "Min capital TRY 250,000 (~$7,000)",
          "Better for raising capital, multiple investors",
          "Required for some regulated activities",
          "Can list on Borsa Istanbul",
        ],
        price: "From $3,500",
        best_for: "Larger ventures, financial services, holding",
      },
      {
        title: "Free Zone Company",
        tagline: "Export, manufacturing, IT",
        bullets: [
          "30-year corporate tax holiday on qualifying export",
          "Customs duty exemption on imports",
          "100% capital and profit repatriation",
          "Ideal for shipping, IT, manufacturing",
        ],
        price: "From $4,500",
        best_for: "Export, IT, logistics, manufacturing",
      },
    ],
    options_best_for: "Best for",
    steps_title: "How company setup works in Turkey",
    steps: [
      { title: "Discovery + structure", desc: "We map your activity to the right form (LLC / JSC / Free Zone) and target market.", days: "Day 1–2" },
      { title: "Documents + articles", desc: "We prepare articles of association, gather KYC and notarize the founder's documents.", days: "Day 2–5" },
      { title: "Trade Registry filing", desc: "Submission to the Istanbul / Ankara Trade Registry. Tax number issued.", days: "Day 5–8" },
      { title: "Bank account + tax office", desc: "We open a corporate bank account and register with the tax office. Operations can start.", days: "Day 8–15" },
    ],
    costs_title: "Real costs in Turkey 2026",
    costs_intro: "Indicative all-in pricing for the most common Turkey company structures.",
    costs_disclaimer: "Figures are 2026 indicative. Final cost depends on activity, shareholder count and visas. Contact us for an exact quote.",
    cost_groups: [
      {
        title: "LLC (Limited Şirket)",
        items: [
          { label: "Government + notary fees", value: "From $400" },
          { label: "Service fee", value: "From $1,100" },
          { label: "Annual accounting", value: "From $1,200/yr" },
        ],
      },
      {
        title: "Free Zone company",
        items: [
          { label: "License + setup", value: "From $3,500" },
          { label: "Office / flexi-desk", value: "From $1,000/yr" },
          { label: "Tax holiday", value: "30 years" },
        ],
      },
      {
        title: "Visas + extras",
        items: [
          { label: "Investor visa per founder", value: "From $300" },
          { label: "Work permit per employee", value: "From $400" },
          { label: "Bank account opening", value: "From $300" },
        ],
      },
    ],
    faq_title: "Company registration in Turkey — FAQ",
    faq_items: [
      { question: "Can I own 100% of a Turkish company as a foreigner?", answer: "Yes. Foreigners can fully own LLCs, JSCs and Free Zone companies in Turkey across most sectors. A handful of regulated sectors (broadcasting, defense) have ownership restrictions." },
      { question: "What is the minimum capital?", answer: "TRY 50,000 (~$1,400) for an LLC; TRY 250,000 (~$7,000) for a JSC. Capital must be paid into the company bank account before commencing operations." },
      { question: "Do I need to live in Turkey?", answer: "No. The company can be incorporated and operate fully with a non-resident director. A turkish residence permit is recommended if you want to manage day-to-day operations on the ground or sponsor family." },
      { question: "What's the corporate tax rate?", answer: "25% standard corporate tax in 2026. Free Zones exempt qualifying export activities for up to 30 years. Turkey also has 90+ double-tax treaties to avoid taxing the same income twice." },
      { question: "Can the company sponsor my residence permit?", answer: "Yes. Once the company is operating, you can apply for an Investor / Independent Worker residence permit through the company. This is renewable annually." },
      { question: "Which industries qualify for Free Zone tax holidays?", answer: "Manufacturing, IT software development, R&D, logistics, port services and many export-oriented activities. The exemption applies only to income from qualifying activities — domestic sales are still taxed." },
    ],
    crosssell_title: "Other Turkey services",
    crosssell_citizenship_title: "Turkish Citizenship",
    crosssell_citizenship_desc: "Pair the company with citizenship via property",
    crosssell_property_title: "Buy Property in Turkey",
    crosssell_property_desc: "Combine business + property",
    crosssell_uae_title: "UAE Company Setup",
    crosssell_uae_desc: "Compare with UAE Free Zones",
    lead_title: "Get an exact Turkey company quote",
    lead_sub: "Tell us your activity and shareholder structure — we'll send a tailored breakdown of costs and timeline within 24 hours.",
  },
  fa: {
    breadcrumb_turkey: "ترکیه",
    breadcrumb_self: "ثبت شرکت",
    hero_h1: "ثبت شرکت در ترکیه ۲۰۲۶ — LLC، JSC یا فری‌زون",
    hero_sub:
      "مالکیت ۱۰۰٪ خارجی · ثبت در ۵ تا ۱۰ روز کاری · سرمایه ۵۰,۰۰۰ لیر (~۱,۴۰۰ دلار). پل اروپا و آسیا با دسترسی به EU Customs Union. ما اساسنامه، آدرس و حساب بانکی را end-to-end انجام می‌دهیم.",
    hero_badge: "شرکت ترکیه ۲۰۲۶",
    hero_placeholder: "درباره LLC در مقابل JSC، فری‌زون، نرخ مالیات، بانکداری بپرسید…",
    stats: [
      { num: "۱۰۰٪", label: "مالکیت خارجی" },
      { num: "۵ تا ۱۰ روز", label: "زمان ثبت" },
      { num: "۱,۴۰۰ دلار", label: "حداقل سرمایه (LLC)" },
      { num: "۳۰ سال", label: "معافیت فری‌زون" },
    ],
    options_eyebrow: "گزینه‌های شما",
    options_title: "LLC، JSC یا فری‌زون — کدام برای شما؟",
    options_sub: "هر سه امکان مالکیت ۱۰۰٪ خارجی را می‌دهند. بر اساس فعالیت، بازار هدف و استراتژی مالیاتی بلندمدت انتخاب کنید.",
    options: [
      {
        title: "Limited Şirket (LLC)",
        tagline: "محبوب‌ترین برای کسب‌وکار کوچک",
        bullets: [
          "حداقل سرمایه ۵۰,۰۰۰ لیر (~۱,۴۰۰ دلار)",
          "۱ تا ۵۰ سهامدار، تک سهامدار مجاز",
          "مدیر می‌تواند خارجی و از راه دور باشد (با وکالت)",
          "ویزای سرمایه‌گذار برای مؤسس + اجازه کار",
        ],
        price: "از ۱,۵۰۰ دلار",
        best_for: "تجارت، خدمات، تجارت الکترونیک، استارتاپ",
        highlighted: true,
      },
      {
        title: "Anonim Şirket (JSC)",
        tagline: "ساختارهای بزرگ‌تر، آماده IPO",
        bullets: [
          "حداقل سرمایه ۲۵۰,۰۰۰ لیر (~۷,۰۰۰ دلار)",
          "بهتر برای جذب سرمایه، چند سرمایه‌گذار",
          "برای برخی فعالیت‌های تنظیمی الزامی",
          "قابلیت لیست در بورس استانبول",
        ],
        price: "از ۳,۵۰۰ دلار",
        best_for: "کسب‌وکار بزرگ، خدمات مالی، هلدینگ",
      },
      {
        title: "شرکت فری‌زون",
        tagline: "صادرات، تولید، IT",
        bullets: [
          "معافیت ۳۰ ساله مالیات شرکتی برای صادرات واجد",
          "معافیت گمرکی واردات",
          "بازگردانی ۱۰۰٪ سرمایه و سود",
          "ایده‌آل برای کشتیرانی، IT، تولید",
        ],
        price: "از ۴,۵۰۰ دلار",
        best_for: "صادرات، IT، لجستیک، تولید",
      },
    ],
    options_best_for: "بهترین برای",
    steps_title: "ثبت شرکت در ترکیه چگونه انجام می‌شود",
    steps: [
      { title: "بررسی + ساختار", desc: "فعالیت شما را به فرم صحیح (LLC / JSC / فری‌زون) و بازار هدف نگاشت می‌کنیم.", days: "روز ۱ تا ۲" },
      { title: "مدارک + اساسنامه", desc: "اساسنامه را آماده، KYC جمع‌آوری و مدارک مؤسس را نوتاری می‌کنیم.", days: "روز ۲ تا ۵" },
      { title: "ثبت در ثبت تجاری", desc: "ارسال به ثبت تجاری استانبول/آنکارا. شماره مالیاتی صادر می‌شود.", days: "روز ۵ تا ۸" },
      { title: "حساب بانکی + اداره مالیات", desc: "حساب شرکتی باز و در اداره مالیات ثبت می‌کنیم. عملیات می‌تواند شروع شود.", days: "روز ۸ تا ۱۵" },
    ],
    costs_title: "هزینه‌های واقعی ترکیه ۲۰۲۶",
    costs_intro: "قیمت تقریبی end-to-end برای متداول‌ترین ساختارهای شرکت ترکیه.",
    costs_disclaimer: "ارقام تقریبی ۲۰۲۶. هزینه نهایی به فعالیت، تعداد سهامدار و ویزاها بستگی دارد. تماس بگیرید.",
    cost_groups: [
      {
        title: "LLC (Limited Şirket)",
        items: [
          { label: "هزینه دولتی + نوتاری", value: "از ۴۰۰ دلار" },
          { label: "هزینه خدمات", value: "از ۱,۱۰۰ دلار" },
          { label: "حسابداری سالانه", value: "از ۱,۲۰۰ دلار/سال" },
        ],
      },
      {
        title: "شرکت فری‌زون",
        items: [
          { label: "لایسنس + ثبت", value: "از ۳,۵۰۰ دلار" },
          { label: "دفتر / فلکسی‌دسک", value: "از ۱,۰۰۰ دلار/سال" },
          { label: "معافیت مالیاتی", value: "۳۰ سال" },
        ],
      },
      {
        title: "ویزا + موارد جانبی",
        items: [
          { label: "ویزای سرمایه‌گذار هر مؤسس", value: "از ۳۰۰ دلار" },
          { label: "اجازه کار هر کارمند", value: "از ۴۰۰ دلار" },
          { label: "افتتاح حساب بانکی", value: "از ۳۰۰ دلار" },
        ],
      },
    ],
    faq_title: "ثبت شرکت در ترکیه — پرسش‌های رایج",
    faq_items: [
      { question: "آیا به‌عنوان خارجی می‌توانم ۱۰۰٪ مالک شرکت ترکی باشم؟", answer: "بله. خارجی‌ها می‌توانند کاملاً مالک LLC، JSC و شرکت‌های فری‌زون در ترکیه در اکثر بخش‌ها باشند. تعداد محدودی بخش تنظیمی (پخش، دفاع) محدودیت مالکیت دارد." },
      { question: "حداقل سرمایه چقدر است؟", answer: "۵۰,۰۰۰ لیر (~۱,۴۰۰ دلار) برای LLC؛ ۲۵۰,۰۰۰ لیر (~۷,۰۰۰ دلار) برای JSC. سرمایه باید قبل از شروع عملیات به حساب شرکت پرداخت شود." },
      { question: "آیا باید در ترکیه زندگی کنم؟", answer: "خیر. شرکت می‌تواند با مدیر غیر مقیم کاملاً تأسیس و فعالیت کند. اقامت ترکیه توصیه می‌شود اگر می‌خواهید عملیات روزانه را از ترکیه مدیریت کنید یا اسپانسر خانواده شوید." },
      { question: "نرخ مالیات شرکتی چقدر است؟", answer: "۲۵٪ مالیات شرکتی استاندارد در ۲۰۲۶. فری‌زون‌ها فعالیت‌های صادراتی واجد را تا ۳۰ سال معاف می‌کنند. ترکیه ۹۰+ معاهده مالیات مضاعف دارد." },
      { question: "آیا شرکت می‌تواند اسپانسر اقامتم باشد؟", answer: "بله. پس از فعال شدن شرکت، می‌توانید برای اقامت سرمایه‌گذار / کارگر مستقل از طریق شرکت اقدام کنید. سالانه قابل تمدید." },
      { question: "کدام صنایع واجد معافیت فری‌زون‌اند؟", answer: "تولید، توسعه نرم‌افزار IT، R&D، لجستیک، خدمات بندری و بسیاری از فعالیت‌های صادرات‌محور. معافیت فقط برای درآمد از فعالیت‌های واجد — فروش داخلی همچنان مالیات دارد." },
    ],
    crosssell_title: "سایر خدمات ترکیه",
    crosssell_citizenship_title: "شهروندی ترکیه",
    crosssell_citizenship_desc: "شرکت + شهروندی از طریق ملک را ترکیب کنید",
    crosssell_property_title: "خرید ملک در ترکیه",
    crosssell_property_desc: "کسب‌وکار + ملک را ترکیب کنید",
    crosssell_uae_title: "ثبت شرکت امارات",
    crosssell_uae_desc: "مقایسه با فری‌زون‌های امارات",
    lead_title: "قیمت دقیق شرکت ترکیه را بگیرید",
    lead_sub: "نوع فعالیت و ساختار سهامدار را بنویسید — تفکیک هزینه و زمان‌بندی اختصاصی در ۲۴ ساعت می‌فرستیم.",
  },
  ar: {
    breadcrumb_turkey: "تركيا",
    breadcrumb_self: "تأسيس شركة",
    hero_h1: "تأسيس شركة في تركيا 2026 — ش.م.م، ش.م.ع أو منطقة حرة",
    hero_sub:
      "ملكية أجنبية 100٪ · تأسيس خلال 5 إلى 10 أيام عمل · رأس مال 50,000 ليرة (~1,400 دولار). جسر بين أوروبا وآسيا مع وصول للاتحاد الجمركي الأوروبي. نتولى العقد التأسيسي والعنوان والحساب البنكي.",
    hero_badge: "شركة تركيا 2026",
    hero_placeholder: "اسأل عن ش.م.م مقابل ش.م.ع، المناطق الحرة، الضرائب، البنوك…",
    stats: [
      { num: "100٪", label: "ملكية أجنبية" },
      { num: "5–10 أيام", label: "زمن التأسيس" },
      { num: "1,400 $", label: "حد رأس المال (ش.م.م)" },
      { num: "30 سنة", label: "إعفاء المنطقة الحرة" },
    ],
    options_eyebrow: "خياراتك",
    options_title: "ش.م.م أو ش.م.ع أو منطقة حرة — أيهما يناسبك؟",
    options_sub: "الثلاثة تسمح بملكية أجنبية 100٪. اختر حسب نشاطك والسوق المستهدف واستراتيجية الضرائب طويلة الأمد.",
    options: [
      {
        title: "Limited Şirket (ش.م.م)",
        tagline: "الأكثر شعبية للشركات الصغيرة",
        bullets: [
          "حد أدنى لرأس المال 50,000 ليرة (~1,400 دولار)",
          "1 إلى 50 مساهم، يُسمح بمساهم واحد",
          "المدير يمكن أن يكون أجنبياً وعن بُعد (بتوكيل)",
          "تأشيرة المستثمر للمؤسس + تصاريح العمل",
        ],
        price: "من 1,500 $",
        best_for: "تجارة، خدمات، تجارة إلكترونية، شركات ناشئة",
        highlighted: true,
      },
      {
        title: "Anonim Şirket (ش.م.ع)",
        tagline: "هياكل أكبر، جاهزة للاكتتاب",
        bullets: [
          "حد أدنى لرأس المال 250,000 ليرة (~7,000 دولار)",
          "أفضل لرفع رأس المال، عدة مستثمرين",
          "إلزامي لبعض الأنشطة المنظمة",
          "إمكانية الإدراج في بورصة إسطنبول",
        ],
        price: "من 3,500 $",
        best_for: "مشاريع كبيرة، خدمات مالية، شركة قابضة",
      },
      {
        title: "شركة منطقة حرة",
        tagline: "تصدير، تصنيع، IT",
        bullets: [
          "إعفاء ضريبي 30 سنة على التصدير المؤهل",
          "إعفاء جمركي للواردات",
          "إعادة 100٪ من رأس المال والأرباح",
          "مثالي للشحن، IT، التصنيع",
        ],
        price: "من 4,500 $",
        best_for: "تصدير، IT، لوجستيات، تصنيع",
      },
    ],
    options_best_for: "الأنسب لـ",
    steps_title: "كيف يتم تأسيس الشركة في تركيا",
    steps: [
      { title: "الاستكشاف + الهيكل", desc: "نطابق نشاطك مع الشكل الصحيح (ش.م.م / ش.م.ع / منطقة حرة) والسوق المستهدف.", days: "اليوم 1 إلى 2" },
      { title: "الوثائق + العقد", desc: "نعد عقد التأسيس، نجمع KYC ونوثق وثائق المؤسس.", days: "اليوم 2 إلى 5" },
      { title: "تقديم السجل التجاري", desc: "تقديم لسجل التجارة في إسطنبول/أنقرة. إصدار الرقم الضريبي.", days: "اليوم 5 إلى 8" },
      { title: "الحساب البنكي + مكتب الضرائب", desc: "نفتح حساباً مؤسسياً ونسجل في مكتب الضرائب. يمكن بدء العمليات.", days: "اليوم 8 إلى 15" },
    ],
    costs_title: "تكاليف حقيقية في تركيا 2026",
    costs_intro: "أسعار شاملة إرشادية لأكثر هياكل الشركات شيوعاً في تركيا.",
    costs_disclaimer: "أرقام إرشادية لـ 2026. التكلفة النهائية تعتمد على النشاط وعدد المساهمين والتأشيرات. تواصل لعرض دقيق.",
    cost_groups: [
      {
        title: "ش.م.م (Limited Şirket)",
        items: [
          { label: "رسوم حكومية + كاتب عدل", value: "من 400 $" },
          { label: "رسوم خدمات", value: "من 1,100 $" },
          { label: "محاسبة سنوية", value: "من 1,200 $/سنة" },
        ],
      },
      {
        title: "شركة منطقة حرة",
        items: [
          { label: "رخصة + تأسيس", value: "من 3,500 $" },
          { label: "مكتب / فليكسي ديسك", value: "من 1,000 $/سنة" },
          { label: "إعفاء ضريبي", value: "30 سنة" },
        ],
      },
      {
        title: "تأشيرات + إضافات",
        items: [
          { label: "تأشيرة مستثمر للمؤسس", value: "من 300 $" },
          { label: "تصريح عمل للموظف", value: "من 400 $" },
          { label: "فتح حساب بنكي", value: "من 300 $" },
        ],
      },
    ],
    faq_title: "تأسيس شركة في تركيا — أسئلة شائعة",
    faq_items: [
      { question: "هل يمكنني تملك 100٪ من شركة تركية كأجنبي؟", answer: "نعم. الأجانب يمكنهم تملك ش.م.م وش.م.ع وشركات المناطق الحرة بالكامل في معظم القطاعات. عدد قليل من القطاعات المنظمة (البث، الدفاع) لها قيود ملكية." },
      { question: "ما الحد الأدنى لرأس المال؟", answer: "50,000 ليرة (~1,400 دولار) لـ ش.م.م؛ 250,000 ليرة (~7,000 دولار) لـ ش.م.ع. يجب دفع رأس المال في حساب الشركة قبل بدء العمليات." },
      { question: "هل يجب أن أعيش في تركيا؟", answer: "لا. يمكن للشركة التأسيس والعمل بالكامل مع مدير غير مقيم. إقامة تركيا موصى بها لإدارة العمليات اليومية أو كفالة العائلة." },
      { question: "ما نسبة الضريبة على الشركات؟", answer: "25٪ ضريبة شركات قياسية في 2026. المناطق الحرة تعفي أنشطة التصدير المؤهلة حتى 30 سنة. تركيا لديها +90 معاهدة لتجنب الازدواج الضريبي." },
      { question: "هل يمكن للشركة كفالة إقامتي؟", answer: "نعم. بمجرد تشغيل الشركة، يمكنك التقديم على إقامة المستثمر / العامل المستقل عبر الشركة. قابلة للتجديد سنوياً." },
      { question: "أي صناعات تستفيد من إعفاء المنطقة الحرة؟", answer: "التصنيع، تطوير برمجيات IT، R&D، اللوجستيات، خدمات الموانئ والعديد من الأنشطة الموجهة للتصدير. الإعفاء يطبق فقط على دخل الأنشطة المؤهلة — المبيعات المحلية تخضع للضريبة." },
    ],
    crosssell_title: "خدمات تركيا الأخرى",
    crosssell_citizenship_title: "الجنسية التركية",
    crosssell_citizenship_desc: "اجمع الشركة مع الجنسية عبر العقار",
    crosssell_property_title: "شراء عقار في تركيا",
    crosssell_property_desc: "اجمع العمل والعقار",
    crosssell_uae_title: "تأسيس شركة في الإمارات",
    crosssell_uae_desc: "قارن مع المناطق الحرة الإماراتية",
    lead_title: "احصل على عرض دقيق لشركتك في تركيا",
    lead_sub: "أخبرنا بنشاطك وهيكل المساهمين — سنرسل تفصيلاً مخصصاً للتكاليف والمدة الزمنية خلال 24 ساعة.",
  },
  ru: {
    breadcrumb_turkey: "Турция",
    breadcrumb_self: "Регистрация компании",
    hero_h1: "Регистрация компании в Турции 2026 — LLC, JSC или свободная зона",
    hero_sub:
      "100% иностранное владение · регистрация за 5–10 рабочих дней · уставной капитал 50 000 TRY (~1 400 $). Мост между Европой и Азией с доступом к Таможенному союзу ЕС. Берём на себя устав, адрес, банковский счёт.",
    hero_badge: "Компания в Турции 2026",
    hero_placeholder: "Спросите про LLC vs JSC, свободные зоны, налоги, банкинг…",
    stats: [
      { num: "100%", label: "Иностранное владение" },
      { num: "5–10 дн", label: "Срок регистрации" },
      { num: "$1 400", label: "Мин. капитал (LLC)" },
      { num: "30 лет", label: "Каникулы СЭЗ" },
    ],
    options_eyebrow: "Ваши варианты",
    options_title: "LLC, JSC или свободная зона — что подходит?",
    options_sub: "Все три варианта дают 100% иностранное владение. Выбирайте по деятельности, целевому рынку и долгосрочной налоговой стратегии.",
    options: [
      {
        title: "Limited Şirket (LLC)",
        tagline: "Самая популярная для МСБ",
        bullets: [
          "Мин. капитал 50 000 TRY (~1 400 $)",
          "1–50 акционеров, разрешён 1 акционер",
          "Директор может быть иностранцем и удалённо (по доверенности)",
          "Виза инвестора для основателя + рабочие визы",
        ],
        price: "От 1 500 $",
        best_for: "Торговля, услуги, e-commerce, стартапы",
        highlighted: true,
      },
      {
        title: "Anonim Şirket (JSC)",
        tagline: "Большие структуры, готовы к IPO",
        bullets: [
          "Мин. капитал 250 000 TRY (~7 000 $)",
          "Лучше для привлечения капитала, нескольких инвесторов",
          "Обязательна для некоторых регулируемых видов",
          "Возможна листинг на Borsa Istanbul",
        ],
        price: "От 3 500 $",
        best_for: "Крупные предприятия, фин. услуги, холдинги",
      },
      {
        title: "Компания в свободной зоне",
        tagline: "Экспорт, производство, IT",
        bullets: [
          "30-летние налоговые каникулы на квалифицированный экспорт",
          "Освобождение от пошлин на импорт",
          "100% репатриация капитала и прибыли",
          "Идеально для логистики, IT, производства",
        ],
        price: "От 4 500 $",
        best_for: "Экспорт, IT, логистика, производство",
      },
    ],
    options_best_for: "Подходит для",
    steps_title: "Как идёт регистрация компании в Турции",
    steps: [
      { title: "Discovery + структура", desc: "Сопоставляем деятельность с правильной формой (LLC / JSC / СЭЗ) и целевым рынком.", days: "День 1–2" },
      { title: "Документы + устав", desc: "Готовим устав, собираем KYC и нотариально заверяем документы основателя.", days: "День 2–5" },
      { title: "Подача в Торговый реестр", desc: "Подача в Торговый реестр Стамбула/Анкары. Выдача ИНН.", days: "День 5–8" },
      { title: "Счёт + налоговая", desc: "Открываем корпоративный счёт и регистрируем в налоговой. Можно начинать работу.", days: "День 8–15" },
    ],
    costs_title: "Реальные расходы в Турции 2026",
    costs_intro: "Ориентировочные суммарные цены на самые частые структуры компаний в Турции.",
    costs_disclaimer: "Числа ориентировочные на 2026. Финал зависит от деятельности, числа акционеров и виз. Свяжитесь для точного расчёта.",
    cost_groups: [
      {
        title: "LLC (Limited Şirket)",
        items: [
          { label: "Госпошлины + нотариус", value: "От 400 $" },
          { label: "Сервисный тариф", value: "От 1 100 $" },
          { label: "Бухгалтерия в год", value: "От 1 200 $/год" },
        ],
      },
      {
        title: "Компания в СЭЗ",
        items: [
          { label: "Лицензия + регистрация", value: "От 3 500 $" },
          { label: "Офис / флекси-стол", value: "От 1 000 $/год" },
          { label: "Налоговые каникулы", value: "30 лет" },
        ],
      },
      {
        title: "Визы и доп. расходы",
        items: [
          { label: "Виза инвестора на основателя", value: "От 300 $" },
          { label: "Рабочая виза на сотрудника", value: "От 400 $" },
          { label: "Открытие счёта", value: "От 300 $" },
        ],
      },
    ],
    faq_title: "Регистрация компании в Турции — FAQ",
    faq_items: [
      { question: "Может ли иностранец владеть 100% турецкой компании?", answer: "Да. Иностранцы могут полностью владеть LLC, JSC и компаниями в свободных зонах в большинстве секторов. У небольшого числа регулируемых секторов (вещание, оборона) есть ограничения." },
      { question: "Какой минимум капитала?", answer: "50 000 TRY (~1 400 $) для LLC; 250 000 TRY (~7 000 $) для JSC. Капитал должен быть внесён на корпоративный счёт до начала операций." },
      { question: "Нужно ли жить в Турции?", answer: "Нет. Компания может быть зарегистрирована и работать с нерезидентным директором. Турецкий ВНЖ рекомендуется для оперативного управления или спонсорства семьи." },
      { question: "Какова ставка корпоративного налога?", answer: "25% стандартный корпоративный налог в 2026. СЭЗ освобождают квалифицированный экспорт до 30 лет. Турция имеет 90+ соглашений об избежании двойного налогообложения." },
      { question: "Может ли компания спонсировать мой ВНЖ?", answer: "Да. После запуска компании можно подавать на ВНЖ инвестора / независимого работника через компанию. Продлеваемый ежегодно." },
      { question: "Какие отрасли получают льготы СЭЗ?", answer: "Производство, разработка ПО IT, R&D, логистика, портовые услуги и многие экспортно-ориентированные виды. Льгота применяется только к доходу от квалифицированных видов — внутренние продажи облагаются налогом." },
    ],
    crosssell_title: "Другие услуги Турции",
    crosssell_citizenship_title: "Гражданство Турции",
    crosssell_citizenship_desc: "Совмещайте компанию с гражданством через недвижимость",
    crosssell_property_title: "Недвижимость в Турции",
    crosssell_property_desc: "Совмещайте бизнес и недвижимость",
    crosssell_uae_title: "Компания в ОАЭ",
    crosssell_uae_desc: "Сравните с свободными зонами ОАЭ",
    lead_title: "Получите точный расчёт по компании в Турции",
    lead_sub: "Расскажите о деятельности и составе акционеров — пришлём индивидуальную раскладку расходов и сроков в течение 24 часов.",
  },
};

export default function TurkeyCompanyRegistrationClient() {
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
      title: c.crosssell_property_title,
      description: c.crosssell_property_desc,
      icon: Building,
      href: linkPath("turkey/buy-property/"),
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

        {/* Options */}
        <section className="py-16 bg-surface">
          <div className="max-w-5xl mx-auto px-4">
            <div className="text-center mb-10">
              <p className="text-xs uppercase tracking-wider text-gold mb-2">{c.options_eyebrow}</p>
              <h2 className="text-2xl md:text-3xl font-bold text-navy mb-3">{c.options_title}</h2>
              <p className="text-sm text-muted-foreground max-w-2xl mx-auto">{c.options_sub}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
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

        {/* Steps */}
        <section className="py-16 bg-white">
          <div className="max-w-5xl mx-auto px-4">
            <div className="text-center mb-10">
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
          serviceContext="turkey_company_registration"
          title={c.lead_title}
          subtitle={c.lead_sub}
        />
      </main>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}

