"use client";

import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import SharedBreadcrumb from "@/components/shared/SharedBreadcrumb";
import MediaImage from "@/components/MediaImage";
import type { Lang } from "@/translations";
import { motion } from "framer-motion";
import {
  MessageCircle,
  Send,
  Phone,
  Mail,
  MapPin,
  Clock,
  Check,
  Building2,
  ExternalLink,
} from "lucide-react";

// Shared contact channels (not translated)
const WA_NUMBER = "971562009131";
const PHONE_DISPLAY = "+971 56 200 9131";
const PHONE_TEL = "+971562009131";
const EMAIL = "info@residency24.com";
const TELEGRAM = "https://t.me/residency24";
const DUBAI_MAP_Q = "Al+Khail+Heights,+Dubai";

interface Office {
  flag: string;
  city: string;
  address: string;
  email: string;
  phone?: string;
  mapQuery: string;
}

interface Content {
  breadcrumb: string;
  hero_badge: string;
  hero_h1: string;
  hero_sub: string;
  form_title: string;
  form_sub: string;
  f_name: string;
  f_email: string;
  f_phone: string;
  f_subject: string;
  f_subject_options: string[];
  f_message: string;
  f_submit: string;
  f_privacy: string;
  success_title: string;
  success_msg: string;
  success_wa: string;
  methods_title: string;
  wa_desc: string;
  tg_desc: string;
  phone_desc: string;
  email_desc: string;
  hours_title: string;
  hours_value: string;
  response_note: string;
  offices_eyebrow: string;
  offices_title: string;
  offices_sub: string;
  directions: string;
  offices: Office[];
  wa_text: string;
}

const CONTENT: Record<Lang, Content> = {
  en: {
    breadcrumb: "Contact",
    hero_badge: "We're here to help",
    hero_h1: "Get in Touch with Residency24",
    hero_sub:
      "Questions about residency, company setup, property or a Golden Visa? Reach our Dubai-based team — we usually reply within 2 hours.",
    form_title: "Send us a message",
    form_sub: "Tell us what you need and we'll get back to you with a tailored plan.",
    f_name: "Full name",
    f_email: "Email",
    f_phone: "Phone / WhatsApp",
    f_subject: "I'm interested in…",
    f_subject_options: ["UAE Golden Visa", "Company Setup", "Buy Property", "Oman Residency", "Turkey Citizenship", "Something else"],
    f_message: "Your message (optional)",
    f_submit: "Send Message",
    f_privacy: "By submitting, you agree we may contact you about your enquiry. We never share your data.",
    success_title: "Thank you! Message received.",
    success_msg: "A Residency24 specialist will contact you shortly. For an instant reply, message us on WhatsApp.",
    success_wa: "Chat on WhatsApp",
    methods_title: "Other ways to reach us",
    wa_desc: "Fastest reply, 7 days a week",
    tg_desc: "Message us on Telegram",
    phone_desc: "Call our Dubai office",
    email_desc: "Email us anytime",
    hours_title: "Working hours",
    hours_value: "Sun–Fri · 9:00–18:00 (GST)",
    response_note: "We usually respond within 2 hours during working hours.",
    offices_eyebrow: "Our Offices",
    offices_title: "Visit us in person",
    offices_sub: "Real physical presence — not just a website. Our team is on the ground in the region.",
    directions: "Get directions",
    offices: [
      { flag: "🇦🇪", city: "Dubai, UAE", address: "Al Khail Heights Apartment Building, RB 03A, No. 218, Dubai", email: "info@residency24.com", phone: "+971 56 200 9131", mapQuery: "Al+Khail+Heights,+Dubai" },
      { flag: "🇮🇷", city: "Mashhad, Iran", address: "Nabsh Farhad 14, Mashhad", email: "mash@residency24.com", mapQuery: "Farhad+14,+Mashhad,+Iran" },
    ],
    wa_text: "Hi,+I+have+a+question",
  },

  fa: {
    breadcrumb: "تماس با ما",
    hero_badge: "ما اینجاییم تا کمک کنیم",
    hero_h1: "با رزیدنسی۲۴ در تماس باشید",
    hero_sub:
      "سؤالی درباره اقامت، ثبت شرکت، خرید ملک یا گلدن ویزا دارید؟ با تیم ما در دبی تماس بگیرید — معمولاً ظرف ۲ ساعت پاسخ می‌دهیم.",
    form_title: "برای ما پیام بفرستید",
    form_sub: "بگویید به چه چیزی نیاز دارید تا برنامه‌ای متناسب با شما ارائه دهیم.",
    f_name: "نام و نام خانوادگی",
    f_email: "ایمیل",
    f_phone: "تلفن / واتساپ",
    f_subject: "علاقه‌مند هستم به…",
    f_subject_options: ["گلدن ویزای امارات", "ثبت شرکت", "خرید ملک", "اقامت عمان", "شهروندی ترکیه", "موضوع دیگر"],
    f_message: "پیام شما (اختیاری)",
    f_submit: "ارسال پیام",
    f_privacy: "با ارسال این فرم، موافقت می‌کنید که برای پیگیری درخواست‌تان با شما تماس بگیریم. اطلاعات شما هرگز به اشتراک گذاشته نمی‌شود.",
    success_title: "ممنون! پیام شما دریافت شد.",
    success_msg: "یکی از متخصصان رزیدنسی۲۴ به‌زودی با شما تماس می‌گیرد. برای پاسخ فوری، در واتساپ پیام دهید.",
    success_wa: "گفتگو در واتساپ",
    methods_title: "سایر راه‌های ارتباطی",
    wa_desc: "سریع‌ترین پاسخ، ۷ روز هفته",
    tg_desc: "در تلگرام پیام دهید",
    phone_desc: "تماس با دفتر دبی",
    email_desc: "هر زمان ایمیل بزنید",
    hours_title: "ساعات کاری",
    hours_value: "یکشنبه–جمعه · ۹:۰۰–۱۸:۰۰ (به وقت دبی)",
    response_note: "در ساعات کاری معمولاً ظرف ۲ ساعت پاسخ می‌دهیم.",
    offices_eyebrow: "دفاتر ما",
    offices_title: "حضوری به ما سر بزنید",
    offices_sub: "حضور فیزیکی واقعی — نه فقط یک وب‌سایت. تیم ما در منطقه حضور دارد.",
    directions: "مسیریابی",
    offices: [
      { flag: "🇦🇪", city: "دبی، امارات", address: "Al Khail Heights Apartment Building, RB 03A, No. 218، دبی", email: "info@residency24.com", phone: "+971 56 200 9131", mapQuery: "Al+Khail+Heights,+Dubai" },
      { flag: "🇮🇷", city: "مشهد، ایران", address: "نبش فرهاد ۱۴، مشهد", email: "mash@residency24.com", mapQuery: "Farhad+14,+Mashhad,+Iran" },
    ],
    wa_text: "سلام،+یک+سؤال+دارم",
  },

  ar: {
    breadcrumb: "اتصل بنا",
    hero_badge: "نحن هنا لمساعدتك",
    hero_h1: "تواصل مع Residency24",
    hero_sub:
      "أسئلة عن الإقامة أو تأسيس الشركات أو شراء العقارات أو التأشيرة الذهبية؟ تواصل مع فريقنا في دبي — عادةً نرد خلال ساعتين.",
    form_title: "أرسل لنا رسالة",
    form_sub: "أخبرنا بما تحتاجه وسنعود إليك بخطة مخصصة.",
    f_name: "الاسم الكامل",
    f_email: "البريد الإلكتروني",
    f_phone: "الهاتف / واتساب",
    f_subject: "أنا مهتم بـ…",
    f_subject_options: ["التأشيرة الذهبية الإمارات", "تأسيس شركة", "شراء عقار", "إقامة عُمان", "جنسية تركيا", "موضوع آخر"],
    f_message: "رسالتك (اختياري)",
    f_submit: "إرسال الرسالة",
    f_privacy: "بإرسالك النموذج، توافق على أن نتواصل معك بخصوص طلبك. لن نشارك بياناتك أبداً.",
    success_title: "شكراً! تم استلام رسالتك.",
    success_msg: "سيتواصل معك أحد متخصصي Residency24 قريباً. للرد الفوري، راسلنا على واتساب.",
    success_wa: "محادثة واتساب",
    methods_title: "طرق أخرى للتواصل",
    wa_desc: "أسرع رد، ٧ أيام في الأسبوع",
    tg_desc: "راسلنا على تيليجرام",
    phone_desc: "اتصل بمكتب دبي",
    email_desc: "راسلنا في أي وقت",
    hours_title: "ساعات العمل",
    hours_value: "الأحد–الجمعة · ٩:٠٠–١٨:٠٠ (بتوقيت الخليج)",
    response_note: "عادةً نرد خلال ساعتين خلال ساعات العمل.",
    offices_eyebrow: "مكاتبنا",
    offices_title: "زرنا شخصياً",
    offices_sub: "حضور فعلي حقيقي — وليس مجرد موقع إلكتروني. فريقنا موجود في المنطقة.",
    directions: "الحصول على الاتجاهات",
    offices: [
      { flag: "🇦🇪", city: "دبي، الإمارات", address: "Al Khail Heights Apartment Building, RB 03A, No. 218، دبي", email: "info@residency24.com", phone: "+971 56 200 9131", mapQuery: "Al+Khail+Heights,+Dubai" },
      { flag: "🇮🇷", city: "مشهد، إيران", address: "Nabsh Farhad 14, Mashhad", email: "mash@residency24.com", mapQuery: "Farhad+14,+Mashhad,+Iran" },
    ],
    wa_text: "مرحباً،+لدي+سؤال",
  },

  ru: {
    breadcrumb: "Контакты",
    hero_badge: "Мы рады помочь",
    hero_h1: "Свяжитесь с Residency24",
    hero_sub:
      "Вопросы по ВНЖ, регистрации компании, недвижимости или Золотой визе? Напишите нашей команде в Дубае — обычно отвечаем в течение 2 часов.",
    form_title: "Напишите нам",
    form_sub: "Расскажите, что вам нужно, и мы вернёмся с индивидуальным планом.",
    f_name: "Имя и фамилия",
    f_email: "Email",
    f_phone: "Телефон / WhatsApp",
    f_subject: "Меня интересует…",
    f_subject_options: ["Золотая виза ОАЭ", "Регистрация компании", "Недвижимость", "ВНЖ Омана", "Гражданство Турции", "Другое"],
    f_message: "Ваше сообщение (необязательно)",
    f_submit: "Отправить",
    f_privacy: "Отправляя форму, вы соглашаетесь, что мы можем связаться с вами по вашему запросу. Мы не передаём ваши данные третьим лицам.",
    success_title: "Спасибо! Сообщение получено.",
    success_msg: "Специалист Residency24 свяжется с вами в ближайшее время. Для мгновенного ответа напишите нам в WhatsApp.",
    success_wa: "Написать в WhatsApp",
    methods_title: "Другие способы связи",
    wa_desc: "Самый быстрый ответ, 7 дней в неделю",
    tg_desc: "Напишите в Telegram",
    phone_desc: "Позвоните в офис в Дубае",
    email_desc: "Пишите в любое время",
    hours_title: "Часы работы",
    hours_value: "Вс–Пт · 9:00–18:00 (GST)",
    response_note: "В рабочее время обычно отвечаем в течение 2 часов.",
    offices_eyebrow: "Наши офисы",
    offices_title: "Приходите к нам",
    offices_sub: "Реальное физическое присутствие — а не только сайт. Наша команда работает в регионе.",
    directions: "Построить маршрут",
    offices: [
      { flag: "🇦🇪", city: "Дубай, ОАЭ", address: "Al Khail Heights Apartment Building, RB 03A, No. 218, Dubai", email: "info@residency24.com", phone: "+971 56 200 9131", mapQuery: "Al+Khail+Heights,+Dubai" },
      { flag: "🇮🇷", city: "Мешхед, Иран", address: "Nabsh Farhad 14, Mashhad", email: "mash@residency24.com", mapQuery: "Farhad+14,+Mashhad,+Iran" },
    ],
    wa_text: "Здравствуйте,+у+меня+вопрос",
  },
};

export default function ContactPageClient() {
  const { lang, isRTL } = useLanguage();
  const c = CONTENT[lang];
  const homeHref = lang === "en" ? "/" : `/${lang}/`;

  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: c.f_subject_options[0], message: "" });
  const [sent, setSent] = useState(false);

  const waHref = `https://wa.me/${WA_NUMBER}?text=${c.wa_text}`;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || (!form.email && !form.phone)) return;
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("event", "lead_form_submit", { service: "contact_page" });
    }
    setSent(true);
  };

  const breadcrumbItems = [
    { label: "Residency24", href: homeHref },
    { label: c.breadcrumb },
  ];

  const methods = [
    { icon: MessageCircle, label: "WhatsApp", value: PHONE_DISPLAY, desc: c.wa_desc, href: waHref, accent: "bg-whatsapp", external: true },
    { icon: Send, label: "Telegram", value: "@residency24", desc: c.tg_desc, href: TELEGRAM, accent: "bg-telegram", external: true },
    { icon: Phone, label: lang === "ru" ? "Телефон" : lang === "fa" ? "تلفن" : lang === "ar" ? "هاتف" : "Phone", value: PHONE_DISPLAY, desc: c.phone_desc, href: `tel:${PHONE_TEL}`, accent: "bg-navy", external: false },
    { icon: Mail, label: "Email", value: EMAIL, desc: c.email_desc, href: `mailto:${EMAIL}`, accent: "bg-gold-dk", external: false },
  ];

  const inputClass =
    "w-full bg-white border border-border text-ink placeholder:text-muted-foreground rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-colors min-h-[48px]";

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
            <p className="text-base md:text-lg text-white/75 max-w-3xl mx-auto">{c.hero_sub}</p>
          </div>
        </section>

        {/* Form + methods */}
        <section className="py-16 bg-surface">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid lg:grid-cols-5 gap-6">
              {/* Form */}
              <div className="lg:col-span-3 bg-white border border-border rounded-2xl p-6 md:p-8 shadow-sm">
                <h2 className="text-2xl font-bold text-navy">{c.form_title}</h2>
                <p className="text-sm text-muted-foreground mt-1 mb-6">{c.form_sub}</p>

                {sent ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-10"
                  >
                    <div className="w-14 h-14 mx-auto rounded-full bg-green-500/15 text-green-600 flex items-center justify-center mb-4">
                      <Check className="w-7 h-7" />
                    </div>
                    <p className="text-lg font-semibold text-navy">{c.success_title}</p>
                    <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">{c.success_msg}</p>
                    <a
                      href={waHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-5 inline-flex items-center gap-2 bg-whatsapp text-white font-semibold px-6 py-3 rounded-xl hover:opacity-90 transition-opacity"
                    >
                      <MessageCircle className="w-5 h-5" /> {c.success_wa}
                    </a>
                  </motion.div>
                ) : (
                  <form onSubmit={submit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input
                      type="text"
                      required
                      placeholder={c.f_name}
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className={inputClass}
                    />
                    <input
                      type="email"
                      placeholder={c.f_email}
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className={inputClass}
                    />
                    <input
                      type="tel"
                      placeholder={c.f_phone}
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className={inputClass}
                    />
                    <select
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      className={inputClass}
                    >
                      {c.f_subject_options.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                    <textarea
                      placeholder={c.f_message}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      rows={4}
                      className={`sm:col-span-2 ${inputClass}`}
                    />
                    <button
                      type="submit"
                      className="sm:col-span-2 bg-gold text-navy font-bold px-8 py-3.5 rounded-xl text-base hover:bg-gold-dk transition-colors min-h-[48px]"
                    >
                      {c.f_submit}
                    </button>
                    <p className="sm:col-span-2 text-xs text-muted-foreground">{c.f_privacy}</p>
                  </form>
                )}
              </div>

              {/* Methods */}
              <div className="lg:col-span-2 flex flex-col gap-4">
                <h2 className="text-lg font-bold text-navy">{c.methods_title}</h2>
                {methods.map((m) => {
                  const Icon = m.icon;
                  return (
                    <a
                      key={m.label}
                      href={m.href}
                      {...(m.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      className="group flex items-center gap-4 bg-white border border-border rounded-xl p-4 hover:shadow-md hover:border-gold/40 transition-all"
                    >
                      <span className={`w-11 h-11 rounded-xl ${m.accent} text-white flex items-center justify-center shrink-0`}>
                        <Icon className="w-5 h-5" />
                      </span>
                      <div className="min-w-0">
                        <div className="font-semibold text-navy text-sm">{m.label}</div>
                        <div className="text-sm text-ink truncate" dir="ltr" style={{ textAlign: isRTL ? "right" : "left" }}>{m.value}</div>
                        <div className="text-xs text-muted-foreground">{m.desc}</div>
                      </div>
                    </a>
                  );
                })}

                <div className="bg-white border border-border rounded-xl p-4 flex items-start gap-3">
                  <Clock className="w-5 h-5 text-gold-dk shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-navy text-sm">{c.hours_title}</div>
                    <div className="text-sm text-ink">{c.hours_value}</div>
                    <div className="text-xs text-muted-foreground mt-1">{c.response_note}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Offices + map */}
        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-10">
              <p className="text-xs uppercase tracking-wider text-gold mb-2">{c.offices_eyebrow}</p>
              <h2 className="text-2xl md:text-3xl font-bold text-navy mb-3">{c.offices_title}</h2>
              <p className="text-sm text-muted-foreground max-w-2xl mx-auto">{c.offices_sub}</p>
            </div>

            {/* Dubai office photo */}
            <div className="relative aspect-[16/9] md:aspect-[21/9] rounded-2xl overflow-hidden border-t-2 border-gold shadow-sm mb-8">
              <MediaImage src="/images/office-dubai.jpg" alt={c.offices[0].city} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/40 to-transparent pointer-events-none" />
            </div>

            <div className="grid lg:grid-cols-2 gap-6 items-stretch">
              {/* Office cards */}
              <div className="flex flex-col gap-4">
                {c.offices.map((o) => (
                  <div key={o.city} className="bg-surface border border-border rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-2xl">{o.flag}</span>
                      <h3 className="text-lg font-bold text-navy">{o.city}</h3>
                    </div>
                    <ul className="space-y-2.5 text-sm">
                      <li className="flex items-start gap-2.5 text-ink">
                        <MapPin className="w-4 h-4 text-gold-dk mt-0.5 shrink-0" />
                        <span>{o.address}</span>
                      </li>
                      {o.phone && (
                        <li className="flex items-center gap-2.5 text-ink">
                          <Phone className="w-4 h-4 text-gold-dk shrink-0" />
                          <a href={`tel:${o.phone.replace(/[^+\d]/g, "")}`} dir="ltr" className="hover:text-navy">{o.phone}</a>
                        </li>
                      )}
                      <li className="flex items-center gap-2.5 text-ink">
                        <Mail className="w-4 h-4 text-gold-dk shrink-0" />
                        <a href={`mailto:${o.email}`} dir="ltr" className="hover:text-navy">{o.email}</a>
                      </li>
                    </ul>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${o.mapQuery}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-navy hover:text-gold-dk transition-colors"
                    >
                      <Building2 className="w-4 h-4" /> {c.directions}
                      <ExternalLink className={`w-3.5 h-3.5 ${isRTL ? "rotate-180" : ""}`} />
                    </a>
                  </div>
                ))}
              </div>

              {/* Map (Dubai HQ) */}
              <div className="rounded-2xl overflow-hidden border border-border min-h-[320px] shadow-sm">
                <iframe
                  title="Residency24 Dubai office map"
                  src={`https://www.google.com/maps?q=${DUBAI_MAP_Q}&z=13&output=embed`}
                  className="w-full h-full min-h-[320px]"
                  style={{ border: 0 }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
