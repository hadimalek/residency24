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
  Plane,
  Globe2,
  Clock,
} from "lucide-react";
import type { CrossSellItem } from "@/components/shared/SharedCrossSell";
import type { FAQItem } from "@/components/shared/SharedFAQ";
import type { Lang } from "@/translations";

interface VisaCard {
  duration: string;
  price: string;
  entry: string;
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
  options: VisaCard[];
  options_entry_label: string;
  options_best_for_label: string;
  requirements_title: string;
  requirements: { title: string; desc: string }[];
  steps_title: string;
  steps: { title: string; desc: string; days: string }[];
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
    breadcrumb_self: "Tourist Visa",
    hero_h1: "Turkey Tourist eVisa 2026 — Apply Online in Minutes",
    hero_sub:
      "Online eVisa for tourism, property scouting or business trips to Turkey. Available for most nationalities — 30 or 90-day, single or multi-entry. Result usually within minutes to 24 hours.",
    hero_badge: "Turkey eVisa 2026",
    hero_placeholder: "Ask about Turkey eVisa eligibility, processing time, multi-entry options…",
    stats: [
      { num: "Minutes", label: "Average processing" },
      { num: "30–90 d", label: "Stay options" },
      { num: "$20+", label: "Government fee" },
      { num: "100%", label: "Online application" },
    ],
    options_eyebrow: "Visa options",
    options_title: "Which Turkey visa fits your trip?",
    options_sub: "Choose by trip length and number of visits. We file the application, monitor status and deliver the eVisa by email.",
    options: [
      {
        duration: "30-day single entry",
        price: "$20 + service",
        entry: "Single entry",
        best_for: "Short trips, property viewing",
        highlighted: true,
      },
      {
        duration: "30-day multi-entry",
        price: "$50 + service",
        entry: "Multiple entries within 30 days",
        best_for: "Business meetings + return",
      },
      {
        duration: "90-day multi-entry",
        price: "$60 + service",
        entry: "Multiple entries within 180 days",
        best_for: "Frequent visitors, longer trips",
      },
    ],
    options_entry_label: "Entry",
    options_best_for_label: "Best for",
    requirements_title: "What you need to apply",
    requirements: [
      { title: "Valid passport", desc: "At least 6 months validity from arrival date." },
      { title: "Email address", desc: "eVisa is delivered as a PDF to your email." },
      { title: "Return flight (recommended)", desc: "Return or onward booking from Turkey." },
      { title: "Hotel booking (recommended)", desc: "Hotel reservation for your stay." },
      { title: "Payment card", desc: "Visa or Mastercard for the government fee + our service fee." },
      { title: "Travel insurance (recommended)", desc: "Covers your stay duration." },
    ],
    steps_title: "How we process your Turkey eVisa",
    steps: [
      { title: "Eligibility check", desc: "We confirm your nationality, purpose and travel dates.", days: "Day 1" },
      { title: "Document submission", desc: "Send us your passport scan and travel details.", days: "Day 1" },
      { title: "Application + payment", desc: "We file via the official Turkey eVisa portal and pay the government fee.", days: "Day 1" },
      { title: "eVisa delivery", desc: "PDF eVisa delivered to your email — show on arrival at any Turkish airport.", days: "Day 1–2" },
    ],
    faq_title: "Turkey tourist visa — FAQ",
    faq_items: [
      { question: "Who can apply for the Turkey eVisa?", answer: "Most nationalities are eligible to apply online via the official Turkey eVisa portal. Some nationalities can enter Turkey visa-free for 30–90 days; others need a sticker visa from an embassy." },
      { question: "How long is the eVisa valid?", answer: "Typically 180 days from issuance to enter Turkey. The stay duration (30 or 90 days) starts when you cross the border." },
      { question: "Can I extend my tourist visa in Turkey?", answer: "Tourist eVisas cannot be extended inside Turkey. To stay longer you must either exit and re-enter (subject to limits), apply for a residence permit or convert to a long-stay visa." },
      { question: "Do I need a sponsor or invitation letter?", answer: "Not for the standard tourist eVisa. Some business or family-visit visas require a sponsor/invitation." },
      { question: "Can children be included on my application?", answer: "Each traveller — including children — needs a separate eVisa application with their own passport." },
      { question: "Can the tourist visa be converted to residency?", answer: "Not directly. To get residency you must apply for a residence permit (Ikamet) — typically inside Turkey while on the tourist visa, with valid grounds (property, work, study, family)." },
    ],
    crosssell_title: "Going beyond a visit?",
    crosssell_citizenship_title: "Turkish Citizenship",
    crosssell_citizenship_desc: "Convert visit into a passport via $400K property",
    crosssell_property_title: "Buy Property in Turkey",
    crosssell_property_desc: "Visit + freehold purchase package",
    crosssell_uae_title: "UAE Tourist Visa",
    crosssell_uae_desc: "Visiting both Turkey and UAE? Bundle visas",
    lead_title: "Apply for your Turkey eVisa today",
    lead_sub: "Send us your passport details and travel dates — we'll handle the rest and deliver the eVisa by email.",
  },
  fa: {
    breadcrumb_turkey: "ترکیه",
    breadcrumb_self: "ویزای توریستی",
    hero_h1: "ویزای الکترونیکی توریستی ترکیه ۲۰۲۶ — درخواست آنلاین در چند دقیقه",
    hero_sub:
      "ویزای آنلاین برای گردشگری، بازدید ملک یا سفر کاری به ترکیه. برای اکثر ملیت‌ها — ۳۰ یا ۹۰ روزه، ورود تکی یا چندبار. نتیجه معمولاً ظرف چند دقیقه تا ۲۴ ساعت.",
    hero_badge: "eVisa ترکیه ۲۰۲۶",
    hero_placeholder: "درباره ملیت، زمان پردازش، چندبار ورود ترکیه بپرسید…",
    stats: [
      { num: "چند دقیقه", label: "میانگین پردازش" },
      { num: "۳۰ تا ۹۰ روز", label: "گزینه‌های اقامت" },
      { num: "از ۲۰ دلار", label: "هزینه دولتی" },
      { num: "۱۰۰٪", label: "درخواست آنلاین" },
    ],
    options_eyebrow: "گزینه‌های ویزا",
    options_title: "کدام ویزای ترکیه مناسب سفر شماست؟",
    options_sub: "بر اساس مدت سفر و تعداد بازدیدها انتخاب کنید. ما درخواست می‌دهیم، وضعیت را پیگیری و eVisa را ایمیل می‌کنیم.",
    options: [
      {
        duration: "۳۰ روز ورود تکی",
        price: "۲۰ دلار + خدمات",
        entry: "ورود تکی",
        best_for: "سفر کوتاه، بازدید ملک",
        highlighted: true,
      },
      {
        duration: "۳۰ روز چندبار ورود",
        price: "۵۰ دلار + خدمات",
        entry: "چند ورود ظرف ۳۰ روز",
        best_for: "جلسات کاری + بازگشت",
      },
      {
        duration: "۹۰ روز چندبار ورود",
        price: "۶۰ دلار + خدمات",
        entry: "چند ورود ظرف ۱۸۰ روز",
        best_for: "بازدیدکننده مکرر، سفر طولانی",
      },
    ],
    options_entry_label: "نوع ورود",
    options_best_for_label: "بهترین برای",
    requirements_title: "مدارک لازم",
    requirements: [
      { title: "پاسپورت معتبر", desc: "حداقل ۶ ماه اعتبار از تاریخ ورود." },
      { title: "آدرس ایمیل", desc: "eVisa به‌صورت PDF به ایمیلتان ارسال می‌شود." },
      { title: "بلیط برگشت (توصیه)", desc: "رزرو برگشت یا ادامه از ترکیه." },
      { title: "رزرو هتل (توصیه)", desc: "رزرو هتل برای مدت اقامت." },
      { title: "کارت پرداخت", desc: "Visa یا Mastercard برای هزینه دولتی + هزینه خدمات." },
      { title: "بیمه سفر (توصیه)", desc: "پوشش مدت اقامت." },
    ],
    steps_title: "نحوه پردازش eVisa ترکیه",
    steps: [
      { title: "بررسی واجد شرایط بودن", desc: "ملیت، هدف و تاریخ سفر را تأیید می‌کنیم.", days: "روز ۱" },
      { title: "ارسال مدارک", desc: "اسکن پاسپورت و جزئیات سفر را برایمان بفرستید.", days: "روز ۱" },
      { title: "درخواست + پرداخت", desc: "از پورتال رسمی eVisa ترکیه ارسال و هزینه دولتی را پرداخت می‌کنیم.", days: "روز ۱" },
      { title: "دریافت eVisa", desc: "PDF eVisa به ایمیلتان می‌رسد — در فرودگاه ترکیه نشان دهید.", days: "روز ۱ تا ۲" },
    ],
    faq_title: "ویزای توریستی ترکیه — پرسش‌های رایج",
    faq_items: [
      { question: "چه کسانی می‌توانند درخواست eVisa ترکیه دهند؟", answer: "اکثر ملیت‌ها از طریق پورتال رسمی eVisa ترکیه واجد شرایط درخواست آنلاین هستند. برخی ملیت‌ها تا ۳۰ تا ۹۰ روز بدون ویزا وارد می‌شوند؛ برخی نیاز به ویزای استیکر از سفارت دارند." },
      { question: "eVisa چقدر اعتبار دارد؟", answer: "معمولاً ۱۸۰ روز از تاریخ صدور برای ورود به ترکیه. مدت اقامت (۳۰ یا ۹۰ روز) از زمان عبور از مرز شروع می‌شود." },
      { question: "آیا می‌توانم در ترکیه ویزا را تمدید کنم؟", answer: "eVisa توریستی در داخل ترکیه قابل تمدید نیست. برای ماندن طولانی‌تر، یا باید خارج و دوباره وارد شوید، یا اقامت بگیرید، یا به ویزای بلندمدت تبدیل کنید." },
      { question: "آیا به اسپانسر یا دعوت‌نامه نیاز دارم؟", answer: "برای eVisa توریستی استاندارد خیر. برخی ویزاهای کاری یا دیدار خانواده نیاز به اسپانسر دارند." },
      { question: "آیا فرزندان روی درخواست من می‌آیند؟", answer: "هر مسافر — از جمله کودکان — به درخواست جداگانه با پاسپورت خود نیاز دارد." },
      { question: "آیا ویزای توریستی به اقامت تبدیل می‌شود؟", answer: "مستقیم خیر. برای اقامت باید برای residence permit (Ikamet) اقدام کنید — معمولاً داخل ترکیه با ویزای توریستی، با دلیل معتبر (ملک، کار، تحصیل، خانواده)." },
    ],
    crosssell_title: "فراتر از بازدید؟",
    crosssell_citizenship_title: "شهروندی ترکیه",
    crosssell_citizenship_desc: "بازدید را به پاسپورت از ملک ۴۰۰K تبدیل کنید",
    crosssell_property_title: "خرید ملک در ترکیه",
    crosssell_property_desc: "پکیج بازدید + خرید Freehold",
    crosssell_uae_title: "ویزای توریستی امارات",
    crosssell_uae_desc: "می‌خواهید هم ترکیه هم امارات؟ ویزا را با هم بگیرید",
    lead_title: "همین امروز eVisa ترکیه را بگیرید",
    lead_sub: "اطلاعات پاسپورت و تاریخ سفر را بفرستید — بقیه را ما انجام می‌دهیم و eVisa را ایمیل می‌کنیم.",
  },
  ar: {
    breadcrumb_turkey: "تركيا",
    breadcrumb_self: "تأشيرة سياحية",
    hero_h1: "تأشيرة تركيا السياحية الإلكترونية 2026 — تقديم أونلاين خلال دقائق",
    hero_sub:
      "تأشيرة إلكترونية للسياحة أو زيارة العقارات أو الأعمال إلى تركيا. متاحة لمعظم الجنسيات — 30 أو 90 يوماً، دخول واحد أو متعدد. النتيجة عادة خلال دقائق إلى 24 ساعة.",
    hero_badge: "eVisa تركيا 2026",
    hero_placeholder: "اسأل عن الجنسيات المؤهلة، وقت المعالجة، خيارات الدخول المتعدد…",
    stats: [
      { num: "دقائق", label: "متوسط المعالجة" },
      { num: "30–90 يوم", label: "مدد الإقامة" },
      { num: "من 20 $", label: "رسوم حكومية" },
      { num: "100٪", label: "تقديم أونلاين" },
    ],
    options_eyebrow: "خيارات التأشيرة",
    options_title: "أي تأشيرة تركيا تناسب رحلتك؟",
    options_sub: "اختر حسب مدة الرحلة وعدد الزيارات. نتولى التقديم والمتابعة وتسليم eVisa بالبريد.",
    options: [
      {
        duration: "30 يوم دخول واحد",
        price: "20 $ + خدمات",
        entry: "دخول واحد",
        best_for: "رحلات قصيرة، زيارة عقار",
        highlighted: true,
      },
      {
        duration: "30 يوم دخول متعدد",
        price: "50 $ + خدمات",
        entry: "دخول متعدد خلال 30 يوماً",
        best_for: "اجتماعات أعمال + عودة",
      },
      {
        duration: "90 يوم دخول متعدد",
        price: "60 $ + خدمات",
        entry: "دخول متعدد خلال 180 يوماً",
        best_for: "زيارات متكررة، رحلات طويلة",
      },
    ],
    options_entry_label: "نوع الدخول",
    options_best_for_label: "الأنسب لـ",
    requirements_title: "ما تحتاجه للتقديم",
    requirements: [
      { title: "جواز سفر ساري", desc: "صلاحية لا تقل عن 6 أشهر من تاريخ الوصول." },
      { title: "بريد إلكتروني", desc: "eVisa تُسلم كـ PDF لبريدك الإلكتروني." },
      { title: "تذكرة عودة (موصى به)", desc: "حجز عودة أو ما بعد من تركيا." },
      { title: "حجز فندقي (موصى به)", desc: "حجز فندقي لمدة الإقامة." },
      { title: "بطاقة دفع", desc: "Visa أو Mastercard للرسوم الحكومية ورسوم الخدمات." },
      { title: "تأمين سفر (موصى به)", desc: "يغطي مدة الإقامة." },
    ],
    steps_title: "كيف نعالج eVisa تركيا",
    steps: [
      { title: "فحص الأهلية", desc: "نؤكد جنسيتك وغرضك وتواريخ السفر.", days: "اليوم 1" },
      { title: "تقديم الوثائق", desc: "أرسل لنا صورة جواز السفر وتفاصيل السفر.", days: "اليوم 1" },
      { title: "التقديم + الدفع", desc: "نقدم عبر البوابة الرسمية لـ eVisa تركيا وندفع الرسوم الحكومية.", days: "اليوم 1" },
      { title: "تسليم eVisa", desc: "PDF eVisa تصل لبريدك — تظهرها عند الوصول لأي مطار تركي.", days: "اليوم 1 إلى 2" },
    ],
    faq_title: "تأشيرة تركيا السياحية — أسئلة شائعة",
    faq_items: [
      { question: "من يمكنه التقديم على eVisa تركيا؟", answer: "معظم الجنسيات مؤهلة للتقديم عبر البوابة الرسمية. بعض الجنسيات تدخل تركيا بدون تأشيرة 30 إلى 90 يوماً؛ غيرها تحتاج تأشيرة لاصقة من السفارة." },
      { question: "ما مدة صلاحية eVisa؟", answer: "عادة 180 يوماً من الإصدار للدخول. مدة الإقامة (30 أو 90 يوماً) تبدأ عند عبور الحدود." },
      { question: "هل يمكن تمديد التأشيرة السياحية في تركيا؟", answer: "لا يمكن تمديد eVisa السياحية داخل تركيا. للبقاء أطول يجب الخروج وإعادة الدخول، أو التقديم على إقامة، أو التحويل لتأشيرة طويلة." },
      { question: "هل أحتاج كفيلاً أو دعوة؟", answer: "لا للتأشيرة السياحية القياسية. بعض تأشيرات الأعمال أو زيارة العائلة تحتاج كفيلاً/دعوة." },
      { question: "هل تُضم الأطفال على طلبي؟", answer: "كل مسافر — بمن فيهم الأطفال — يحتاج طلب eVisa مستقل بجواز سفره." },
      { question: "هل تتحول التأشيرة السياحية لإقامة؟", answer: "لا مباشرة. للحصول على إقامة يجب التقديم على Ikamet — عادة داخل تركيا أثناء التأشيرة السياحية بأسباب صحيحة (عقار، عمل، دراسة، عائلة)." },
    ],
    crosssell_title: "أبعد من زيارة؟",
    crosssell_citizenship_title: "الجنسية التركية",
    crosssell_citizenship_desc: "حول الزيارة لجواز سفر عبر عقار 400 ألف",
    crosssell_property_title: "شراء عقار في تركيا",
    crosssell_property_desc: "حزمة زيارة + شراء تملك حر",
    crosssell_uae_title: "تأشيرة الإمارات السياحية",
    crosssell_uae_desc: "تزور تركيا والإمارات؟ احصل على الاثنتين",
    lead_title: "تقدم على eVisa تركيا اليوم",
    lead_sub: "أرسل تفاصيل جواز سفرك وتواريخ السفر — نتولى الباقي ونرسل eVisa بالبريد.",
  },
  ru: {
    breadcrumb_turkey: "Турция",
    breadcrumb_self: "Туристическая виза",
    hero_h1: "Туристическая eVisa Турции 2026 — оформите онлайн за минуты",
    hero_sub:
      "Электронная виза для туризма, осмотра недвижимости или деловых поездок в Турцию. Подходит для большинства гражданств — 30 или 90 дней, разовая или мульти. Результат обычно от минут до 24 часов.",
    hero_badge: "eVisa Турция 2026",
    hero_placeholder: "Спросите про список стран, сроки рассмотрения, мультивизы…",
    stats: [
      { num: "Минуты", label: "Среднее рассмотрение" },
      { num: "30–90 дн", label: "Варианты пребывания" },
      { num: "От 20 $", label: "Госсбор" },
      { num: "100%", label: "Подача онлайн" },
    ],
    options_eyebrow: "Варианты визы",
    options_title: "Какая виза Турции подойдёт под поездку?",
    options_sub: "Выбирайте по длительности и числу визитов. Подаём заявку, отслеживаем статус и присылаем eVisa на e-mail.",
    options: [
      {
        duration: "30 дней, один въезд",
        price: "20 $ + сервис",
        entry: "Один въезд",
        best_for: "Короткие поездки, просмотр недвижимости",
        highlighted: true,
      },
      {
        duration: "30 дней, мультивиза",
        price: "50 $ + сервис",
        entry: "Несколько въездов в 30 дней",
        best_for: "Бизнес-встречи + возврат",
      },
      {
        duration: "90 дней, мультивиза",
        price: "60 $ + сервис",
        entry: "Несколько въездов в 180 дней",
        best_for: "Частые визиты, длинные поездки",
      },
    ],
    options_entry_label: "Тип въезда",
    options_best_for_label: "Подходит для",
    requirements_title: "Что нужно для подачи",
    requirements: [
      { title: "Действующий паспорт", desc: "Минимум 6 месяцев с даты въезда." },
      { title: "E-mail", desc: "eVisa приходит PDF на ваш e-mail." },
      { title: "Обратный билет (рекомендуется)", desc: "Бронь обратного или дальнейшего вылета." },
      { title: "Отель (рекомендуется)", desc: "Бронь отеля на срок поездки." },
      { title: "Платёжная карта", desc: "Visa/Mastercard для госсбора + сервиса." },
      { title: "Страховка (рекомендуется)", desc: "Покрывает срок поездки." },
    ],
    steps_title: "Как мы оформляем eVisa Турции",
    steps: [
      { title: "Проверка приемлемости", desc: "Подтверждаем гражданство, цель, даты.", days: "День 1" },
      { title: "Сбор документов", desc: "Пришлите скан паспорта и детали поездки.", days: "День 1" },
      { title: "Подача + оплата", desc: "Подача через официальный портал eVisa Турции и оплата госсбора.", days: "День 1" },
      { title: "Выдача eVisa", desc: "PDF eVisa приходит на e-mail — показывайте в любом турецком аэропорту.", days: "День 1–2" },
    ],
    faq_title: "Туристическая виза Турции — FAQ",
    faq_items: [
      { question: "Кому доступна eVisa Турции?", answer: "Большинство гражданств может подать через официальный портал. Некоторые гражданства въезжают в Турцию без визы 30–90 дней; другим нужна стикер-виза в посольстве." },
      { question: "Сколько действует eVisa?", answer: "Обычно 180 дней с даты выдачи для въезда. Срок пребывания (30 или 90 дней) начинается с пересечения границы." },
      { question: "Можно ли продлить туристическую визу в Турции?", answer: "Туристическую eVisa нельзя продлить внутри Турции. Чтобы остаться дольше — либо выехать и въехать снова, либо подать на ВНЖ, либо перейти на долгосрочную визу." },
      { question: "Нужны спонсор или приглашение?", answer: "Для стандартной туристической eVisa — нет. Бизнес или семейные визы могут требовать спонсора/приглашения." },
      { question: "Включаются ли дети в моё заявление?", answer: "Каждый путешественник, в том числе дети, нуждается в отдельной eVisa со своим паспортом." },
      { question: "Можно ли превратить туристическую визу в ВНЖ?", answer: "Напрямую нет. Для ВНЖ нужно подать на Ikamet — обычно внутри Турции на туристической, при наличии оснований (недвижимость, работа, учёба, семья)." },
    ],
    crosssell_title: "Дальше визита?",
    crosssell_citizenship_title: "Гражданство Турции",
    crosssell_citizenship_desc: "Превратите визит в паспорт через $400K в недвижимости",
    crosssell_property_title: "Недвижимость в Турции",
    crosssell_property_desc: "Пакет визит + freehold-покупка",
    crosssell_uae_title: "Туристическая виза ОАЭ",
    crosssell_uae_desc: "Едете и в Турцию, и в ОАЭ? Свяжите визы",
    lead_title: "Оформите eVisa Турции сегодня",
    lead_sub: "Пришлите данные паспорта и даты поездки — остальное мы возьмём на себя и отправим eVisa на e-mail.",
  },
};

export default function TurkeyTouristVisaClient() {
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
      href: linkPath("uae/tourist-visa/"),
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

        {/* Visa options */}
        <section className="py-16 bg-surface">
          <div className="max-w-5xl mx-auto px-4">
            <div className="text-center mb-10">
              <p className="text-xs uppercase tracking-wider text-gold mb-2">{c.options_eyebrow}</p>
              <h2 className="text-2xl md:text-3xl font-bold text-navy mb-3">{c.options_title}</h2>
              <p className="text-sm text-muted-foreground max-w-2xl mx-auto">{c.options_sub}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {c.options.map((o, i) => (
                <div
                  key={i}
                  className={`bg-white rounded-2xl p-6 border ${
                    o.highlighted ? "border-2 border-gold shadow-md" : "border-border"
                  }`}
                >
                  <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center mb-3">
                    <Plane className="w-5 h-5 text-gold" />
                  </div>
                  <h3 className="text-base font-bold text-navy mb-3">{o.duration}</h3>
                  <p className="text-lg font-bold text-gold mb-3">{o.price}</p>
                  <p className="text-xs text-muted-foreground mb-1">
                    <span className="font-semibold text-navy">{c.options_entry_label}:</span> {o.entry}
                  </p>
                  <p className="text-xs text-muted-foreground border-t border-border pt-2 mt-2">
                    <span className="font-semibold text-navy">{c.options_best_for_label}:</span> {o.best_for}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Requirements */}
        <section className="py-16 bg-white">
          <div className="max-w-5xl mx-auto px-4">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-navy">{c.requirements_title}</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {c.requirements.map((r, i) => (
                <div key={i} className="bg-surface border border-border rounded-xl p-5">
                  <div className="w-9 h-9 rounded-lg bg-navy/5 flex items-center justify-center mb-3">
                    <Clock className="w-5 h-5 text-navy" />
                  </div>
                  <h3 className="text-base font-semibold text-navy mb-1">{r.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{r.desc}</p>
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

        <HowItWorks />
        <SharedFAQ items={c.faq_items} title={c.faq_title} />
        <SharedCrossSell items={crossSellItems} title={c.crosssell_title} />
        <SharedLeadForm
          serviceContext="turkey_tourist_visa"
          title={c.lead_title}
          subtitle={c.lead_sub}
        />
      </main>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
