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
  Plane,
  Building,
  IdCard,
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
    breadcrumb_self: "Tourist Visa",
    hero_h1: "Oman Tourist eVisa — Apply Online in Minutes",
    hero_sub:
      "Online eVisa for tourism, business meetings or property viewings in Oman. Available for most nationalities — 10, 30 or multi-entry options. Result usually within 3–5 business days.",
    hero_badge: "Oman eVisa 2026",
    hero_placeholder: "Ask about Oman eVisa eligibility, processing time…",
    stats: [
      { num: "3–5 d", label: "Average processing" },
      { num: "10–30 d", label: "Stay options" },
      { num: "USD 20+", label: "Government fee" },
      { num: "100%", label: "Online application" },
    ],
    options_eyebrow: "Visa options",
    options_title: "Which Oman visa is right for you?",
    options_sub: "Choose the visa that matches your travel length and plan to return. We file the application, monitor status and deliver the eVisa by email.",
    options: [
      {
        duration: "10-day single entry",
        price: "USD 20 + service",
        entry: "Single entry",
        best_for: "Short trips, property viewings",
        highlighted: true,
      },
      {
        duration: "30-day single entry",
        price: "USD 50 + service",
        entry: "Single entry",
        best_for: "Tourism, family visits",
      },
      {
        duration: "1-year multi-entry",
        price: "USD 100 + service",
        entry: "Multi-entry, 30 days/visit",
        best_for: "Frequent visitors, business",
      },
    ],
    options_entry_label: "Entry",
    options_best_for_label: "Best for",
    requirements_title: "What you need to apply",
    requirements: [
      { title: "Valid passport", desc: "At least 6 months validity from arrival date." },
      { title: "Digital photo", desc: "Recent passport-style photo, white background, JPEG." },
      { title: "Return flight (or onward)", desc: "Reservation showing planned exit from Oman." },
      { title: "Hotel or host details", desc: "Hotel booking or address of host you will stay with." },
      { title: "Payment card", desc: "Visa / Mastercard for government fee + our service fee." },
      { title: "Travel insurance (recommended)", desc: "Strongly recommended for the duration of your stay." },
    ],
    steps_title: "How we process your Oman eVisa",
    steps: [
      { title: "Eligibility check", desc: "We confirm your nationality, purpose and travel dates.", days: "Day 1" },
      { title: "Document collection", desc: "Send us passport scan, photo and travel details.", days: "Day 1–2" },
      { title: "Application & payment", desc: "We submit via the Royal Oman Police portal and pay government fee.", days: "Day 2" },
      { title: "eVisa delivery", desc: "PDF eVisa delivered to your email — show on arrival at Muscat/Salalah airport.", days: "Day 3–7" },
    ],
    faq_title: "Oman tourist visa — FAQ",
    faq_items: [
      { question: "Who can apply for the Oman eVisa?", answer: "Most nationalities are eligible to apply online via the Royal Oman Police (ROP) portal. We handle the entire submission and confirm eligibility before charging." },
      { question: "How long is the eVisa valid?", answer: "Typically 30 days from issuance to enter Oman, and the stay duration (10 / 30 days, or 1 year multi-entry) starts on entry." },
      { question: "Can I extend my tourist visa in Oman?", answer: "Most tourist visas can be extended once for an additional 10 or 30 days at ROP offices in Oman before expiry." },
      { question: "Do I need a sponsor or invitation letter?", answer: "Not for standard tourist eVisas. Some specialized visas (visit, business) may require host details." },
      { question: "Can children be included on my application?", answer: "Each traveller — including children — needs a separate eVisa application with their own passport." },
      { question: "Can the tourist visa be converted to residency?", answer: "Not directly. You must apply for an Investor Residency Card separately, with the qualifying investment in place." },
    ],
    crosssell_title: "Going further than tourism?",
    crosssell_residency_title: "Investor Residency",
    crosssell_residency_desc: "Convert visit into a 5/10-year residency",
    crosssell_property_title: "Buy Property in Oman",
    crosssell_property_desc: "Visit + freehold purchase package",
    crosssell_uae_title: "UAE Tourist Visa",
    crosssell_uae_desc: "Visiting both Oman and UAE? Bundle visas",
    lead_title: "Apply for your Oman eVisa today",
    lead_sub: "Send us your passport details and travel dates — we’ll handle the rest and deliver the eVisa by email.",
  },
  fa: {
    breadcrumb_oman: "عمان",
    breadcrumb_self: "ویزای توریستی",
    hero_h1: "ویزای الکترونیکی توریستی عمان — درخواست آنلاین در چند دقیقه",
    hero_sub:
      "ویزای آنلاین برای گردشگری، جلسه کاری یا بازدید ملک در عمان. برای اکثر ملیت‌ها — ۱۰، ۳۰ روزه یا multi-entry. نتیجه معمولاً ۳ تا ۵ روز کاری.",
    hero_badge: "eVisa عمان ۲۰۲۶",
    hero_placeholder: "درباره ملیت، زمان پردازش و انواع eVisa عمان بپرسید…",
    stats: [
      { num: "۳ تا ۵ روز", label: "میانگین پردازش" },
      { num: "۱۰ تا ۳۰ روز", label: "گزینه‌های اقامت" },
      { num: "از ۲۰ دلار", label: "هزینه دولتی" },
      { num: "۱۰۰٪", label: "درخواست آنلاین" },
    ],
    options_eyebrow: "گزینه‌های ویزا",
    options_title: "کدام ویزای عمان مناسب شماست؟",
    options_sub: "ویزای متناسب با مدت سفر و دفعات ورود را انتخاب کنید. ما درخواست را ثبت، وضعیت را پیگیری و eVisa را ایمیل می‌کنیم.",
    options: [
      {
        duration: "ورود تکی ۱۰ روز",
        price: "۲۰ دلار + خدمات",
        entry: "ورود تکی",
        best_for: "سفر کوتاه، بازدید ملک",
        highlighted: true,
      },
      {
        duration: "ورود تکی ۳۰ روز",
        price: "۵۰ دلار + خدمات",
        entry: "ورود تکی",
        best_for: "گردشگری، دیدار خانواده",
      },
      {
        duration: "۱ سال چندبار ورود",
        price: "۱۰۰ دلار + خدمات",
        entry: "Multi-entry، ۳۰ روز/بازدید",
        best_for: "بازدیدکننده مکرر، کسب‌وکار",
      },
    ],
    options_entry_label: "نوع ورود",
    options_best_for_label: "بهترین برای",
    requirements_title: "مدارک لازم",
    requirements: [
      { title: "پاسپورت معتبر", desc: "حداقل ۶ ماه اعتبار از تاریخ ورود." },
      { title: "عکس دیجیتال", desc: "عکس اخیر پاسپورتی، زمینه سفید، JPEG." },
      { title: "بلیط برگشت (یا ادامه سفر)", desc: "رزرو نشان‌دهنده خروج برنامه‌ریزی‌شده از عمان." },
      { title: "هتل یا میزبان", desc: "رزرو هتل یا آدرس میزبان." },
      { title: "کارت پرداخت", desc: "Visa/Mastercard برای هزینه دولتی + هزینه خدمات." },
      { title: "بیمه سفر (توصیه)", desc: "اکیداً توصیه می‌شود برای مدت اقامت." },
    ],
    steps_title: "نحوه پردازش eVisa عمان",
    steps: [
      { title: "بررسی واجد شرایط بودن", desc: "ملیت، هدف و تاریخ سفر شما را تأیید می‌کنیم.", days: "روز ۱" },
      { title: "جمع‌آوری مدارک", desc: "اسکن پاسپورت، عکس و جزئیات سفر برایمان بفرستید.", days: "روز ۱ تا ۲" },
      { title: "درخواست و پرداخت", desc: "ارسال از طریق پورتال پلیس سلطنتی عمان (ROP) و پرداخت هزینه دولتی.", days: "روز ۲" },
      { title: "دریافت eVisa", desc: "PDF eVisa به ایمیلتان می‌رسد — در فرودگاه مسقط/صلاله نشان دهید.", days: "روز ۳ تا ۷" },
    ],
    faq_title: "ویزای توریستی عمان — پرسش‌های رایج",
    faq_items: [
      { question: "چه کسانی می‌توانند درخواست eVisa عمان دهند؟", answer: "اکثر ملیت‌ها از طریق پورتال پلیس سلطنتی عمان (ROP) واجد درخواست آنلاین هستند. ما کل ارسال را مدیریت می‌کنیم و قبل از پرداخت، واجد شرایط بودن را تأیید می‌کنیم." },
      { question: "eVisa چقدر اعتبار دارد؟", answer: "معمولاً ۳۰ روز از تاریخ صدور برای ورود به عمان، و مدت اقامت (۱۰/۳۰ روز یا یک‌سال چندبار) از تاریخ ورود شروع می‌شود." },
      { question: "آیا می‌توانم در عمان ویزا را تمدید کنم؟", answer: "اکثر ویزاهای توریستی قابل یک‌بار تمدید ۱۰ یا ۳۰ روزه در دفاتر ROP قبل از انقضاست." },
      { question: "آیا به اسپانسر یا دعوت‌نامه نیاز دارم؟", answer: "برای eVisa توریستی استاندارد خیر. برخی ویزاهای تخصصی ممکن است اطلاعات میزبان نیاز داشته باشند." },
      { question: "آیا فرزندان روی درخواست من می‌آیند؟", answer: "هر مسافر — از جمله کودکان — به درخواست جداگانه با پاسپورت خود نیاز دارد." },
      { question: "آیا ویزای توریستی به اقامت تبدیل می‌شود؟", answer: "مستقیم خیر. باید برای کارت اقامت سرمایه‌گذار جداگانه با سرمایه‌گذاری واجد شرایط اقدام کنید." },
    ],
    crosssell_title: "فراتر از گردشگری؟",
    crosssell_residency_title: "اقامت سرمایه‌گذار",
    crosssell_residency_desc: "بازدید را به اقامت ۵ یا ۱۰ ساله تبدیل کنید",
    crosssell_property_title: "خرید ملک در عمان",
    crosssell_property_desc: "پکیج بازدید + خرید Freehold",
    crosssell_uae_title: "ویزای توریستی امارات",
    crosssell_uae_desc: "می‌خواهید هم عمان هم امارات؟ ویزا را با هم بگیرید",
    lead_title: "همین امروز eVisa عمان را بگیرید",
    lead_sub: "اطلاعات پاسپورت و تاریخ سفر را بفرستید — بقیه را ما انجام می‌دهیم و eVisa را ایمیل می‌کنیم.",
  },
  ar: {
    breadcrumb_oman: "عُمان",
    breadcrumb_self: "تأشيرة سياحية",
    hero_h1: "تأشيرة عُمان السياحية الإلكترونية — تقديم أونلاين خلال دقائق",
    hero_sub:
      "تأشيرة إلكترونية للسياحة أو الاجتماعات أو زيارة العقارات. متاحة لمعظم الجنسيات — 10، 30 يوماً أو متعددة الدخول. النتيجة عادة 3 إلى 5 أيام عمل.",
    hero_badge: "eVisa عُمان 2026",
    hero_placeholder: "اسأل عن الجنسيات المؤهلة ووقت المعالجة وأنواع eVisa عُمان…",
    stats: [
      { num: "3 إلى 5 أيام", label: "متوسط المعالجة" },
      { num: "10 إلى 30 يوماً", label: "مدد الإقامة" },
      { num: "من 20 دولار", label: "رسوم حكومية" },
      { num: "100٪", label: "تقديم أونلاين" },
    ],
    options_eyebrow: "خيارات التأشيرة",
    options_title: "أي تأشيرة عُمان مناسبة لك؟",
    options_sub: "اختر التأشيرة المناسبة لمدة سفرك. نتولى التقديم والمتابعة وتسليم eVisa بالبريد.",
    options: [
      {
        duration: "10 أيام دخول مرة واحدة",
        price: "20 دولار + خدمات",
        entry: "دخول واحد",
        best_for: "رحلات قصيرة، زيارة عقارات",
        highlighted: true,
      },
      {
        duration: "30 يوماً دخول مرة واحدة",
        price: "50 دولار + خدمات",
        entry: "دخول واحد",
        best_for: "سياحة، زيارات عائلية",
      },
      {
        duration: "سنة متعددة الدخول",
        price: "100 دولار + خدمات",
        entry: "متعددة الدخول، 30 يوماً/زيارة",
        best_for: "زيارات متكررة، أعمال",
      },
    ],
    options_entry_label: "نوع الدخول",
    options_best_for_label: "الأنسب لـ",
    requirements_title: "ما تحتاجه للتقديم",
    requirements: [
      { title: "جواز سفر ساري", desc: "صلاحية لا تقل عن 6 أشهر من تاريخ الوصول." },
      { title: "صورة رقمية", desc: "صورة شخصية حديثة بخلفية بيضاء، JPEG." },
      { title: "تذكرة عودة (أو ما بعد)", desc: "حجز يظهر الخروج المخطط من عُمان." },
      { title: "تفاصيل الفندق أو المضيف", desc: "حجز فندقي أو عنوان المضيف." },
      { title: "بطاقة دفع", desc: "Visa/Mastercard للرسوم الحكومية ورسوم الخدمات." },
      { title: "تأمين سفر (موصى به)", desc: "ينصح بشدة طوال فترة الإقامة." },
    ],
    steps_title: "كيف نعالج تأشيرة عُمان الإلكترونية",
    steps: [
      { title: "فحص الأهلية", desc: "نؤكد الجنسية والغرض والتواريخ.", days: "اليوم 1" },
      { title: "جمع الوثائق", desc: "أرسل لنا صورة جواز السفر والصورة وتفاصيل السفر.", days: "اليوم 1 إلى 2" },
      { title: "التقديم والدفع", desc: "نقدم عبر بوابة شرطة عُمان السلطانية وندفع الرسوم.", days: "اليوم 2" },
      { title: "تسليم eVisa", desc: "نرسل PDF التأشيرة بريداً — تظهرها عند الوصول لمطار مسقط/صلالة.", days: "اليوم 3 إلى 7" },
    ],
    faq_title: "تأشيرة عُمان السياحية — أسئلة شائعة",
    faq_items: [
      { question: "من يمكنه التقديم على eVisa عُمان؟", answer: "معظم الجنسيات مؤهلة للتقديم عبر بوابة شرطة عُمان السلطانية (ROP). نتولى التقديم بالكامل ونؤكد الأهلية قبل أي رسوم." },
      { question: "ما مدة صلاحية eVisa؟", answer: "عادة 30 يوماً من الإصدار للدخول، ومدة الإقامة (10/30 يوماً أو سنة متعددة) تبدأ من تاريخ الدخول." },
      { question: "هل يمكن تمديد التأشيرة السياحية؟", answer: "معظم التأشيرات السياحية تُمدد مرة لـ 10 أو 30 يوماً إضافية قبل الانتهاء في مكاتب ROP." },
      { question: "هل أحتاج كفيلاً أو دعوة؟", answer: "ليس للتأشيرة السياحية الإلكترونية القياسية. بعض التأشيرات قد تحتاج تفاصيل مضيف." },
      { question: "هل تُضم الأطفال على طلبي؟", answer: "كل مسافر — بما في ذلك الأطفال — يحتاج طلب eVisa مستقل بجواز سفره." },
      { question: "هل يمكن تحويلها لإقامة؟", answer: "لا مباشرة. تحتاج إلى التقديم على إقامة المستثمر منفصلة مع وجود الاستثمار المؤهل." },
    ],
    crosssell_title: "تخطط لأبعد من السياحة؟",
    crosssell_residency_title: "إقامة المستثمر",
    crosssell_residency_desc: "حول الزيارة إلى إقامة 5 أو 10 سنوات",
    crosssell_property_title: "شراء عقار في عُمان",
    crosssell_property_desc: "حزمة زيارة + شراء تملك حر",
    crosssell_uae_title: "تأشيرة الإمارات السياحية",
    crosssell_uae_desc: "تزور عُمان والإمارات؟ احصل على الاثنتين",
    lead_title: "تقدم على eVisa عُمان اليوم",
    lead_sub: "أرسل تفاصيل جواز سفرك وتواريخ السفر — نعتني بالباقي ونرسل eVisa بالبريد.",
  },
  ru: {
    breadcrumb_oman: "Оман",
    breadcrumb_self: "Туристическая виза",
    hero_h1: "Туристическая eVisa Омана — оформите онлайн за минуты",
    hero_sub:
      "Электронная виза для туризма, деловых встреч или просмотра недвижимости. Подходит для большинства гражданств — 10, 30 дней или мультивиза. Результат обычно 3–5 рабочих дней.",
    hero_badge: "eVisa Оман 2026",
    hero_placeholder: "Спросите про список стран, сроки рассмотрения и типы eVisa…",
    stats: [
      { num: "3–5 дн", label: "Среднее рассмотрение" },
      { num: "10–30 дн", label: "Варианты пребывания" },
      { num: "От 20 $", label: "Госсбор" },
      { num: "100%", label: "Подача онлайн" },
    ],
    options_eyebrow: "Варианты визы",
    options_title: "Какая виза Омана вам подойдёт?",
    options_sub: "Выбирайте под длительность поездки. Мы подадим заявку, отследим статус и пришлём eVisa на e-mail.",
    options: [
      {
        duration: "10 дней, один въезд",
        price: "20 $ + сервис",
        entry: "Один въезд",
        best_for: "Короткие поездки, просмотр недвижимости",
        highlighted: true,
      },
      {
        duration: "30 дней, один въезд",
        price: "50 $ + сервис",
        entry: "Один въезд",
        best_for: "Туризм, семейные визиты",
      },
      {
        duration: "1 год, мультивиза",
        price: "100 $ + сервис",
        entry: "Мультивиза, 30 дней на визит",
        best_for: "Частые визиты, бизнес",
      },
    ],
    options_entry_label: "Тип въезда",
    options_best_for_label: "Подходит для",
    requirements_title: "Что нужно для подачи",
    requirements: [
      { title: "Действующий паспорт", desc: "Минимум 6 месяцев действия от даты въезда." },
      { title: "Цифровое фото", desc: "Свежее фото на белом фоне, JPEG." },
      { title: "Обратный билет (или дальше)", desc: "Бронь, показывающая выезд из Омана." },
      { title: "Отель или принимающая сторона", desc: "Бронь отеля или адрес принимающего." },
      { title: "Платёжная карта", desc: "Visa/Mastercard для госсбора и сервиса." },
      { title: "Страховка (рекомендуется)", desc: "Настоятельно рекомендуется на весь срок поездки." },
    ],
    steps_title: "Как мы оформляем eVisa Омана",
    steps: [
      { title: "Проверка приемлемости", desc: "Подтверждаем гражданство, цель и даты поездки.", days: "День 1" },
      { title: "Сбор документов", desc: "Пришлите скан паспорта, фото и детали поездки.", days: "День 1–2" },
      { title: "Подача и оплата", desc: "Подача через портал ROP и оплата госсбора.", days: "День 2" },
      { title: "Выдача eVisa", desc: "PDF eVisa приходит на e-mail — показываете в аэропорту Маската/Салалы.", days: "День 3–7" },
    ],
    faq_title: "Туристическая виза Омана — FAQ",
    faq_items: [
      { question: "Кому доступна eVisa Омана?", answer: "Большинство гражданств может подать онлайн через портал Royal Oman Police (ROP). Мы ведём подачу и подтверждаем приемлемость перед оплатой." },
      { question: "Как долго действует eVisa?", answer: "Обычно 30 дней с даты выдачи для въезда; срок пребывания (10/30 дней или год мультивизы) начинается с даты въезда." },
      { question: "Можно ли продлить туристическую визу в Омане?", answer: "Большинство туристических виз можно один раз продлить на 10 или 30 дней в офисах ROP до истечения." },
      { question: "Нужны спонсор или приглашение?", answer: "Для стандартной туристической eVisa — нет. У отдельных виз могут потребоваться данные принимающей стороны." },
      { question: "Включаются ли дети в моё заявление?", answer: "Каждый путешественник — включая детей — нуждается в отдельной eVisa со своим паспортом." },
      { question: "Можно ли превратить туристическую визу в ВНЖ?", answer: "Напрямую нет. Нужно подать отдельно на инвесторский ВНЖ при наличии подходящей инвестиции." },
    ],
    crosssell_title: "Дальше туризма?",
    crosssell_residency_title: "Инвесторский ВНЖ",
    crosssell_residency_desc: "Превратите визит в ВНЖ на 5/10 лет",
    crosssell_property_title: "Недвижимость в Омане",
    crosssell_property_desc: "Пакет визит + freehold-покупка",
    crosssell_uae_title: "Туристическая виза ОАЭ",
    crosssell_uae_desc: "Едете и в Оман, и в ОАЭ? Свяжите визы",
    lead_title: "Оформите eVisa Омана сегодня",
    lead_sub: "Пришлите данные паспорта и даты поездки — остальное мы возьмём на себя и отправим eVisa на почту.",
  },
};

export default function OmanTouristVisaClient() {
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
          serviceContext="oman_tourist_visa"
          title={c.lead_title}
          subtitle={c.lead_sub}
        />
      </main>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}

