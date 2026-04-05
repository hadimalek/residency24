"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import Navbar from "@/components/Navbar";
import HeroChat from "@/components/HeroChat";
import TrustBar from "@/components/TrustBar";
import SharedBreadcrumb from "@/components/shared/SharedBreadcrumb";
import SharedStatsStrip from "@/components/shared/SharedStatsStrip";
import SharedHowItWorks from "@/components/shared/SharedHowItWorks";
import NationalityHooks from "@/components/NationalityHooks";
import SharedPricingTable from "@/components/shared/SharedPricingTable";
import SharedTestimonials from "@/components/shared/SharedTestimonials";
import SharedFAQ from "@/components/shared/SharedFAQ";
import SharedCrossSell from "@/components/shared/SharedCrossSell";
import SharedLeadForm from "@/components/shared/SharedLeadForm";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import VisaTypesGrid from "@/components/p006/VisaTypesGrid";
import DocumentsSection from "@/components/p006/DocumentsSection";
import { Trophy, Building2, Building, Globe, FileText, Send, Search, Shield, Mail } from "lucide-react";
import type { Stat } from "@/components/shared/SharedStatsStrip";
import type { Testimonial } from "@/components/shared/SharedTestimonials";
import type { FAQItem } from "@/components/shared/SharedFAQ";
import type { CrossSellItem } from "@/components/shared/SharedCrossSell";
import type { PricingTab } from "@/components/shared/SharedPricingTable";
import type { Step } from "@/components/shared/SharedHowItWorks";

export default function TouristVisaClient() {
  const { t, lang, isRTL } = useLanguage();
  const p = t.uae_pages?.tourist_visa;
  const s = t.shared;

  if (!p) return null;

  const l = (fa: string, en: string, ar: string, ru: string): string =>
    ({ fa, en, ar, ru } as Record<string, string>)[lang] || en;

  // S01 — Breadcrumb
  const breadcrumbItems = [
    { label: "Residency24", href: `/${lang}/` },
    { label: p.breadcrumb_uae || "UAE", href: `/${lang}/uae/` },
    { label: p.breadcrumb_tv || p.h1 },
  ];

  // S04 — Stats
  const stats: Stat[] = [
    { value: "5000", label: l("ویزا صادر شده", "Visas Processed", "تأشيرة معالجة", "виз оформлено"), display: "5,000+" },
    { value: "350", label: l("شروع قیمت", "Starting From", "يبدأ من", "от"), display: "AED 350" },
    { value: "5", label: l("روز پردازش", "Day Processing", "أيام معالجة", "дней обработки"), display: "5–10" },
    { value: "4", label: l("زبان پشتیبانی", "Languages", "لغات الدعم", "языка"), display: "4" },
  ];

  // S06 — HowItWorks steps
  const steps: Step[] = [
    {
      number: 1,
      title: l("درخواست ثبت کنید", "Submit Request", "قدّم طلبك", "Подайте заявку"),
      description: l("واتساپ، چت‌بات یا فرم", "WhatsApp, chatbot, or form", "واتساب أو النموذج", "WhatsApp, чат-бот или форма"),
      icon: Send,
      duration: l("۵ دقیقه", "5 min", "٥ دقائق", "5 мин"),
    },
    {
      number: 2,
      title: l("مدارک ارسال کنید", "Provide Documents", "أرسل وثائقك", "Предоставьте документы"),
      description: l("پاسپورت و مدارک لازم", "Passport and required documents", "جواز السفر والوثائق", "Паспорт и документы"),
      icon: FileText,
      duration: l("۱ روز", "1 day", "يوم", "1 день"),
    },
    {
      number: 3,
      title: l("ما در ICP ثبت می‌کنیم", "We Submit to ICP", "نقدم لـ ICP", "Подаём в ICP"),
      description: l("متخصصان ما درخواست را ثبت می‌کنند", "Our specialists handle submission", "متخصصونا يتولون التقديم", "Наши специалисты подают заявку"),
      icon: Search,
      duration: l("۱ روز", "1 day", "يوم", "1 день"),
    },
    {
      number: 4,
      title: l("پردازش ICP", "ICP Processing", "معالجة ICP", "Обработка ICP"),
      description: l("۳–۷ روز (ایرانی‌ها: ۵–۱۰ روز). شما را در جریان می‌گذاریم.", "3–7 days standard. Iranian nationals: 5–10 days. We update you.", "٣-٧ أيام. الإيرانيون: ٥-١٠ أيام.", "3–7 дней. Иранцы: 5–10 дней."),
      icon: Shield,
      duration: l("۳–۱۰ روز", "3–10 days", "٣-١٠ أيام", "3–10 дней"),
    },
    {
      number: 5,
      title: l("ویزا آماده است", "Visa Ready", "تأشيرتك جاهزة", "Виза готова"),
      description: l("ویزا به ایمیل ارسال می‌شود", "E-visa sent to your email", "التأشيرة ترسل بريدياً", "Виза на email"),
      icon: Mail,
      duration: l("فوری", "Immediate", "فوراً", "Немедленно"),
    },
  ];

  // S09 — Pricing tabs
  const pricingTabs: PricingTab[] = [
    {
      id: "visa30",
      label: l("ویزای ۳۰ روزه", "30-Day Visa", "تأشيرة ٣٠ يوماً", "Виза 30 дней"),
      rows: [
        { label: l("هزینه دولتی (ICP)", "Government Fee (ICP)", "رسوم حكومية (ICP)", "Госпошлина (ICP)"), amount: "AED 200–300" },
        { label: l("کارمزد رزیدنسی۲۴", "Residency24 Service Fee", "رسوم رزيدنسي24", "Сервисный сбор Residency24"), amount: "AED 150–250", isHighlighted: true },
        { label: s.pricing_total, amount: "AED 350–550", isTotal: true },
      ],
      footerNote: l("پردازش: ۳–۷ روز کاری", "Processing: 3–7 business days", "المعالجة: ٣-٧ أيام", "Обработка: 3–7 рабочих дней"),
    },
    {
      id: "visa60",
      label: l("ویزای ۶۰ روزه", "60-Day Visa", "تأشيرة ٦٠ يوماً", "Виза 60 дней"),
      rows: [
        { label: l("هزینه دولتی (ICP)", "Government Fee", "رسوم حكومية", "Госпошлина"), amount: "AED 400–500" },
        { label: l("کارمزد رزیدنسی۲۴", "Residency24 Service Fee", "رسوم رزيدنسي24", "Сервисный сбор"), amount: "AED 150–250", isHighlighted: true },
        { label: s.pricing_total, amount: "AED 550–750", isTotal: true },
      ],
      footerNote: l("پردازش: ۳–۷ روز", "Processing: 3–7 days", "المعالجة: ٣-٧ أيام", "Обработка: 3–7 дней"),
    },
    {
      id: "visa90",
      label: l("ویزای ۹۰ روزه", "90-Day Visa", "تأشيرة ٩٠ يوماً", "Виза 90 дней"),
      rows: [
        { label: l("هزینه دولتی (ICP)", "Government Fee", "رسوم حكومية", "Госпошлина"), amount: "AED 500–700" },
        { label: l("کارمزد رزیدنسی۲۴", "Residency24 Service Fee", "رسوم رزيدنسي24", "Сервисный сбор"), amount: "AED 200–300", isHighlighted: true },
        { label: s.pricing_total, amount: "AED 750–1,000", isTotal: true },
      ],
      footerNote: l("پردازش: ۵–۱۰ روز (ایرانی‌ها)", "Processing: 5–10 days (Iranian nationals)", "المعالجة: ٥-١٠ أيام (الإيرانيون)", "Обработка: 5–10 дней (иранцы)"),
    },
    {
      id: "multi",
      label: l("چند ورودی", "Multi-Entry", "متعدد الدخول", "Мультивиза"),
      rows: [
        { label: l("هزینه دولتی", "Government Fee", "رسوم حكومية", "Госпошлина"), amount: "AED 800–1,000" },
        { label: l("کارمزد رزیدنسی۲۴", "Residency24 Service Fee", "رسوم رزيدنسي24", "Сервисный сбор"), amount: "AED 200–300", isHighlighted: true },
        { label: s.pricing_total, amount: "AED 1,000–1,300", isTotal: true },
      ],
    },
  ];

  // S10 — Testimonials
  const testimonials: Testimonial[] = [
    {
      id: "p006-t1",
      name: l("احمد رضایی", "Ahmad Rezaei", "أحمد رضائي", "Ахмад Резаи"),
      flag: "\u{1F1EE}\u{1F1F7}",
      nationality: l("ایرانی · دبی", "Iranian · Dubai", "إيراني · دبي", "Иранец · Дубай"),
      outcome: l("ویزای ۳۰ روزه دریافت شد", "30-Day Visa Approved", "تأشيرة ٣٠ يوماً", "Виза 30 дней"),
      quote: l(
        "بعد از دو بار رد شدن از آژانس‌های دیگر، رزیدنسی۲۴ در ۸ روز ویزام رو گرفت.",
        "After two rejections from other agencies, Residency24 got my visa in 8 days.",
        "بعد رفضين من وكالات أخرى، حصلت على تأشيرتي في ٨ أيام.",
        "После двух отказов в других агентствах, Residency24 оформила визу за 8 дней."
      ),
      service: l("ویزای توریستی", "Tourist Visa", "تأشيرة سياحية", "Туристическая виза"),
      rating: 5,
      initials: "A.R",
    },
    {
      id: "p006-t2",
      name: l("محمد الکاظمی", "Mohammad Al-Kazemi", "محمد الكاظمي", "Мохаммад Аль-Каземи"),
      flag: "\u{1F1EE}\u{1F1F6}",
      nationality: l("عراقی · دبی", "Iraqi · Dubai", "عراقي · دبي", "Иракец · Дубай"),
      outcome: l("تأشيرة ٦٠ يوماً", "60-Day Visa", "تأشيرة ٦٠ يوماً", "Виза 60 дней"),
      quote: l(
        "درخواست من در ۱۲ روز پردازش شد. خدمات عالی به زبان عربی.",
        "My application was processed in 12 days. Excellent service in Arabic.",
        "تمت معالجة طلبي في ١٢ يوماً. خدمة ممتازة بالعربية.",
        "Заявка обработана за 12 дней. Отличный сервис на арабском."
      ),
      service: l("ویزای توریستی", "Tourist Visa", "تأشيرة سياحية", "Туристическая виза"),
      rating: 5,
      initials: "M.K",
    },
    {
      id: "p006-t3",
      name: "James Wilson",
      flag: "\u{1F1EC}\u{1F1E7}",
      nationality: l("بریتانیایی · دبی", "British · Dubai", "بريطاني · دبي", "Британец · Дубай"),
      outcome: l("مولتی ویزا + گلدن ویزا", "Multi-Entry Visa + Golden Visa", "تأشيرة متعددة + ذهبية", "Мультивиза + Golden Visa"),
      quote: l(
        "برای بازدید ملک آمدم، مولتی ویزا گرفتم و الان گلدن ویزا دارم.",
        "Came for property scouting, got a multi-entry visa and stayed. Now have a 10-year Golden Visa.",
        "جئت لاستكشاف العقارات، حصلت على تأشيرة متعددة ثم إقامة ذهبية.",
        "Приехал на осмотр недвижимости, получил мультивизу, теперь Golden Visa на 10 лет."
      ),
      service: l("ویزای توریستی", "Tourist Visa", "تأشيرة سياحية", "Туристическая виза"),
      rating: 5,
      initials: "J.W",
    },
  ];

  // S11 — FAQ
  const faqItems: FAQItem[] = [
    {
      question: l("آیا رزیدنسی۲۴ ویزا برای ایرانی‌ها می‌گیرد؟", "Can Iranian nationals get UAE tourist visa through Residency24?", "هل يمكن للإيرانيين الحصول على تأشيرة الإمارات؟", "Residency24 оформляет визы для иранцев?"),
      answer: l("بله. تخصص ما. پردازش ۵–۱۰ روز کاری. نرخ تأیید ۹۵٪+", "Yes. Our speciality. Processing 5–10 days. 95%+ approval rate.", "نعم. تخصصنا. ٥-١٠ أيام. +٩٥٪ قبول.", "Да. Наша специализация. 5–10 дней. 95%+ одобрение."),
    },
    {
      question: l("تفاوت ۳۰ روزه و ۹۰ روزه چیست؟", "Difference between 30-day and 90-day visa?", "الفرق بين تأشيرة ٣٠ و٩٠ يوماً؟", "Разница между визой на 30 и 90 дней?"),
      answer: l("ویزای ۳۰ روزه ارزان‌تر است. ویزای ۹۰ روزه برای سفرهای کاری مناسب‌تر و قابل تمدید است.", "30-day is more affordable. 90-day suits business trips and is extendable for 30 more days.", "تأشيرة ٣٠ يوماً أرخص. تأشيرة ٩٠ للأعمال وقابلة للتمديد.", "Виза 30 дней дешевле. Виза 90 дней для деловых поездок и продлеваемая."),
    },
    {
      question: l("آیا می‌توان ویزا را داخل امارات تمدید کرد؟", "Can I extend my UAE visa inside the country?", "هل يمكن تمديد التأشيرة داخل الإمارات؟", "Можно ли продлить визу внутри ОАЭ?"),
      answer: l("بله. یک بار ۳۰ روز اضافه. هزینه: ۶۰۰ درهم + ۵٪ VAT.", "Yes. Once for 30 extra days. Fee: AED 600 + 5% VAT.", "نعم. مرة واحدة لمدة ٣٠ يوماً. رسوم: ٦٠٠ درهم + ٥٪.", "Да. Один раз на 30 дней. Стоимость: AED 600 + 5% НДС."),
    },
    {
      question: l("آیا روسی‌ها به ویزا نیاز دارند؟", "Do Russian nationals need UAE tourist visa?", "هل يحتاج الروس إلى تأشيرة؟", "Нужна ли гражданам России виза в ОАЭ?"),
      answer: l("نه. روسی‌ها تا ۹۰ روز بدون ویزا. برای اقامت بیشتر: گرین ویزا یا گلدن ویزا.", "No. Russians enter visa-free up to 90 days. For longer stays: Green or Golden Visa.", "لا. الروس بدون تأشيرة ٩٠ يوماً. للإقامة الأطول: الخضراء أو الذهبية.", "Нет. Россияне без визы 90 дней. Для долгосрочного: Green или Golden Visa."),
    },
    {
      question: l("با ویزای توریستی حساب بانکی باز می‌شود؟", "Can I open a UAE bank account on tourist visa?", "هل أفتح حساباً مصرفياً بالتأشيرة السياحية؟", "Можно открыть счёт в банке ОАЭ по туристической визе?"),
      answer: l("معمولاً نه — بانک‌ها نیاز به اقامت دارند. اما بازدید توریستی فرصت ملاقات با بانک‌ها و شروع اقامت است.", "Typically no — banks require residency. But your visit is ideal to meet banks and start the residency process.", "عادةً لا. البنوك تشترط الإقامة. لكن زيارتك للقاء البنوك والبدء في الإقامة.", "Как правило, нет. Но визит — идеальное время встретиться с банками и начать оформление ВНЖ."),
    },
    {
      question: l("ویزای توریستی چطور به اقامت تبدیل می‌شود؟", "How can tourist visa lead to UAE residency?", "كيف تتحول التأشيرة السياحية إلى إقامة؟", "Как туристическая виза может стать резидентством?"),
      answer: l("بیش از ۴۰٪ مشتریان اقامتی ما با ویزای توریستی شروع کردند. در طول بازدید می‌توان ملک خرید، شرکت ثبت کرد یا گلدن ویزا گرفت.", "40%+ of our residency clients started with tourist visa. During your visit: buy property, register company, or qualify for Golden Visa.", "أكثر من ٤٠٪ من عملائنا بدأوا بتأشيرة سياحية. يمكنك شراء عقار أو تأسيس شركة أو الحصول على إقامة ذهبية.", "40%+ наших клиентов начали с туристической визы. Во время визита: купить недвижимость, открыть компанию или Golden Visa."),
    },
    {
      question: l("هزینه ویزای توریستی چقدر است؟", "What is the total cost of UAE tourist visa?", "ما التكلفة الإجمالية للتأشيرة السياحية؟", "Сколько стоит туристическая виза ОАЭ?"),
      answer: l("ویزای ۳۰ روزه: از ۳۵۰ درهم. ویزای ۶۰ روزه: از ۵۵۰ درهم. ویزای ۹۰ روزه: از ۷۵۰ درهم.", "30-day from AED 350. 60-day from AED 550. 90-day from AED 750.", "تأشيرة ٣٠ من ٣٥٠ درهم. ٦٠ يوماً من ٥٥٠. ٩٠ يوماً من ٧٥٠.", "Виза 30 дней от AED 350. 60 дней от AED 550. 90 дней от AED 750."),
    },
    {
      question: l("چرا رزیدنسی۲۴ بهتر از اقدام مستقل است؟", "Why use Residency24 instead of applying directly?", "لماذا رزيدنسي24 أفضل من التقديم المباشر؟", "Зачем Residency24, если можно самостоятельно?"),
      answer: l("تیم ما مدارک را بررسی، خطاها را رفع و وضعیت را پیگیری می‌کند. نرخ موفقیت: ۹۵٪+ در مقابل ۷۰–۸۰٪ اقدام مستقل.", "Our team reviews documents, fixes errors, tracks status, appeals rejections. Success: 95%+ vs 70–80% self-applied.", "فريقنا يراجع الوثائق ويصحح الأخطاء ويتابع الحالة. +٩٥٪ نجاح مقابل ٧٠-٨٠٪ للتقديم الشخصي.", "Наша команда проверяет документы, исправляет ошибки, отслеживает статус. 95%+ успех против 70–80% самостоятельно."),
    },
  ];

  // S12 — CrossSell
  const crossSellItems: CrossSellItem[] = [
    {
      title: s.cs_golden_visa,
      description: s.cs_golden_visa_desc,
      icon: Trophy,
      href: `/${lang}/uae/golden-visa/`,
      isHighlighted: true,
      badge: s.cs_badge_popular,
    },
    {
      title: s.cs_company_reg,
      description: s.cs_company_reg_desc,
      icon: Building2,
      href: `/${lang}/uae/company-registration/`,
    },
    {
      title: s.cs_property,
      description: s.cs_property_desc,
      icon: Building,
      href: `/${lang}/uae/buy-property/`,
    },
    {
      title: s.cs_oman_visa,
      description: s.cs_oman_visa_desc,
      icon: Globe,
      href: `/${lang}/visa/oman/`,
    },
  ];

  return (
    <div className="min-h-screen bg-background" style={{ scrollBehavior: "smooth" }}>
      <Navbar />
      <h1 className="sr-only">{p.hero_h1 || p.h1}</h1>

      {/* S01 — Breadcrumb */}
      <SharedBreadcrumb items={breadcrumbItems} />

      {/* S02 — Hero + HeroChat (LOCKED) */}
      <HeroChat />

      {/* S03 — TrustBar (LOCKED) */}
      <TrustBar />

      {/* S04 — SharedStatsStrip variant="dark" */}
      <SharedStatsStrip stats={stats} variant="dark" />

      {/* S05 — VisaTypesGrid (Page-specific) */}
      <VisaTypesGrid />

      {/* S06 — HowItWorks */}
      <SharedHowItWorks
        steps={steps}
        title={p.process_title || p.steps_title}
        variant="numbered"
      />

      {/* S07 — DocumentsSection (Page-specific) */}
      <DocumentsSection />

      {/* S08 — NationalityHooks (LOCKED position) */}
      <NationalityHooks />

      {/* S09 — SharedPricingTable with 4 tabs */}
      <SharedPricingTable
        title={s.pricing_title}
        tabs={pricingTabs}
        showCTA
        ctaText={s.pricing_cta}
      />

      {/* S10 — SharedTestimonials */}
      <SharedTestimonials testimonials={testimonials} title={s.testimonials_title} />

      {/* S11 — SharedFAQ (first item open by default) */}
      <SharedFAQ items={faqItems} title={s.faq_title} />

      {/* S12 — SharedCrossSell */}
      <SharedCrossSell items={crossSellItems} title={s.cs_section_title} />

      {/* S13 — SharedLeadForm (always last section) */}
      <SharedLeadForm serviceContext="tourist_visa" />

      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
