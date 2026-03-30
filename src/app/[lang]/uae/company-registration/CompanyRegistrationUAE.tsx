"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import Navbar from "@/components/Navbar";
import TrustBar from "@/components/TrustBar";
import CompanyTypeSelector from "@/components/CompanyTypeSelector";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import Footer from "@/components/Footer";

const SYSTEM_PROMPT = `You are a Dubai company registration expert at Residency24.
Answer questions about Mainland vs Free Zone vs Offshore, costs (from AED 21,000),
timeline (7-10 days), required documents, and UAE residency visa through company.
Respond in the same language as the question.`;

/* ─── Hero ──────────────────────────────────────────────── */
function HeroSection() {
  const { t, isRTL } = useLanguage();
  const cr = t.companyRegistrationUAE;

  return (
    <section className="relative bg-navy text-white py-20 md:py-28">
      <div className="max-w-3xl mx-auto px-4 text-center">
        <h1 className="text-[36px] md:text-[48px] font-bold leading-tight whitespace-pre-line mb-4">
          {cr.hero.headline}
        </h1>
        <p className="text-lg md:text-xl text-white/80 mb-8">
          {cr.hero.subheadline}
        </p>
        <a
          href="#section-cta"
          className="inline-block bg-gold text-navy font-semibold px-8 py-3.5 rounded-full text-base hover:opacity-90 transition"
        >
          {cr.cta.title}
        </a>
      </div>
    </section>
  );
}

/* ─── Anchor Nav ────────────────────────────────────────── */
function AnchorNav() {
  const { t } = useLanguage();
  const anchors: string[] = t.companyRegistrationUAE.anchors;

  return (
    <nav className="sticky top-16 z-40 bg-white shadow-[0_1px_4px_rgba(0,0,0,0.08)] overflow-x-auto whitespace-nowrap">
      <div className="inline-flex gap-2 px-6 py-3">
        {anchors.map((item, i) => (
          <a
            key={i}
            href={`#section-${i}`}
            className="px-3.5 py-1.5 rounded-full text-sm text-muted-foreground border border-border whitespace-nowrap hover:border-gold hover:text-navy transition"
          >
            {item}
          </a>
        ))}
      </div>
    </nav>
  );
}

/* ─── Why Dubai ─────────────────────────────────────────── */
function WhyDubaiSection() {
  const { t } = useLanguage();
  const cr = t.companyRegistrationUAE;

  const points = [
    { icon: "🏦", key: "tax" },
    { icon: "🌍", key: "hub" },
    { icon: "🛂", key: "visa" },
    { icon: "💰", key: "ownership" },
  ];

  const WHY_DATA: Record<string, { title: string; desc: string }[]> = {
    fa: [
      { title: "۰٪ مالیات بر درآمد", desc: "هیچ مالیات بر درآمد شخصی یا شرکتی" },
      { title: "هاب تجاری جهانی", desc: "دسترسی آسان به بازارهای آسیا، اروپا و آفریقا" },
      { title: "ویزای اقامت ۳ ساله", desc: "از طریق ثبت شرکت ویزای اقامت برای شما و تیمتان" },
      { title: "مالکیت ۱۰۰٪ خارجی", desc: "از سال ۲۰۲۱ بدون نیاز به شریک محلی" },
    ],
    en: [
      { title: "0% Income Tax", desc: "No personal or corporate income tax" },
      { title: "Global Business Hub", desc: "Easy access to Asia, Europe and Africa markets" },
      { title: "3-Year Residence Visa", desc: "Company registration grants residence visa for you and team" },
      { title: "100% Foreign Ownership", desc: "Since 2021, no local partner required" },
    ],
    ar: [
      { title: "0% ضريبة دخل", desc: "لا ضرائب على الدخل الشخصي أو الشركات" },
      { title: "مركز أعمال عالمي", desc: "وصول سهل لأسواق آسيا وأوروبا وأفريقيا" },
      { title: "إقامة 3 سنوات", desc: "تأشيرة إقامة لك ولفريقك عبر تسجيل الشركة" },
      { title: "ملكية أجنبية 100%", desc: "منذ 2021 بدون شريك محلي" },
    ],
    ru: [
      { title: "0% налога на доход", desc: "Нет подоходного или корпоративного налога" },
      { title: "Глобальный бизнес-хаб", desc: "Лёгкий доступ к рынкам Азии, Европы и Африки" },
      { title: "Виза ВНЖ на 3 года", desc: "Регистрация компании даёт ВНЖ вам и команде" },
      { title: "100% иностранное владение", desc: "С 2021 без местного партнёра" },
    ],
  };

  const { lang } = useLanguage();
  const items = WHY_DATA[lang] || WHY_DATA.en;

  return (
    <motion.section
      id="section-0"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      className="py-16 bg-white"
    >
      <div className="max-w-[960px] mx-auto px-4">
        <h2 className="text-[32px] font-bold text-navy text-center mb-10">
          {cr.whyDubai.title}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {items.map((item, i) => (
            <div key={i} className="flex gap-4 p-5 rounded-xl border border-border">
              <span className="text-[28px] flex-shrink-0">{points[i].icon}</span>
              <div>
                <h3 className="font-semibold text-navy mb-1">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

/* ─── How It Works / Steps ──────────────────────────────── */
function StepsSection() {
  const { t } = useLanguage();
  const cr = t.companyRegistrationUAE;

  return (
    <motion.section
      id="section-2"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      className="py-16 bg-white"
    >
      <div className="max-w-[960px] mx-auto px-4">
        <h2 className="text-[32px] font-bold text-navy text-center mb-10">
          {cr.howItWorks.title}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cr.steps.map((step: any, i: number) => (
            <div key={i} className="relative p-5 rounded-xl border border-border">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-[28px]">{step.icon}</span>
                <span className="text-xs font-semibold text-gold bg-navy px-2.5 py-0.5 rounded-full">
                  {step.day}
                </span>
              </div>
              <h3 className="font-semibold text-navy mb-1">{step.title}</h3>
              <p className="text-sm text-muted-foreground">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

/* ─── Pricing Table ─────────────────────────────────────── */
function PricingSection() {
  const { t } = useLanguage();
  const cr = t.companyRegistrationUAE;
  const { pricing } = cr;

  return (
    <motion.section
      id="section-3"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      className="py-16 bg-surface"
    >
      <div className="max-w-[760px] mx-auto px-4">
        <h2 className="text-[32px] font-bold text-navy text-center mb-8">
          {pricing.title}
        </h2>
        <div className="overflow-x-auto rounded-xl border border-border bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-navy text-white">
                <th className="text-start p-3 font-medium">{pricing.headers.item}</th>
                <th className="text-start p-3 font-medium">{pricing.headers.fz}</th>
                <th className="text-start p-3 font-medium">{pricing.headers.ml}</th>
              </tr>
            </thead>
            <tbody>
              {pricing.rows.map((row: any, i: number) => (
                <tr
                  key={i}
                  className={`border-t border-border ${row.bold ? "font-bold bg-gold/10" : ""}`}
                >
                  <td className="p-3">{row.label}</td>
                  <td className="p-3">{row.fz}</td>
                  <td className="p-3">{row.ml}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.section>
  );
}

/* ─── FAQ Section ───────────────────────────────────────── */
function FAQSection() {
  const { t } = useLanguage();
  const cr = t.companyRegistrationUAE;
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <motion.section
      id="section-5"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      className="py-16 bg-surface"
    >
      <div className="max-w-[760px] mx-auto px-4">
        <h2 className="text-[32px] font-bold text-navy text-center mb-8">
          {cr.faq.title}
        </h2>
        <div className="divide-y divide-border">
          {cr.faq.items.map((item: any, i: number) => {
            const isOpen = openIndex === i;
            return (
              <div key={i} className="py-5">
                <button
                  onClick={() => setOpenIndex(isOpen ? -1 : i)}
                  className="w-full flex items-center justify-between text-start"
                >
                  <span className="text-base font-medium text-navy pe-4">{item.q}</span>
                  <span className="text-[22px] text-gold flex-shrink-0">{isOpen ? "\u2212" : "+"}</span>
                </button>
                {isOpen && (
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{item.a}</p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </motion.section>
  );
}

/* ─── CTA / Lead Form ───────────────────────────────────── */
function CTASection() {
  const { t } = useLanguage();
  const cr = t.companyRegistrationUAE;
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const msg = encodeURIComponent(`Hi, I'm ${name}. I'd like a free consultation about company registration in Dubai.`);
    window.open(`https://wa.me/971562009131?text=${msg}`, "_blank");
  };

  return (
    <section id="section-cta" className="py-16 bg-navy text-white">
      <div className="max-w-md mx-auto px-4 text-center">
        <h2 className="text-[28px] font-bold mb-6">{cr.cta.title}</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="text"
            required
            placeholder={cr.cta.name}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="px-4 py-3 rounded-lg text-navy text-sm bg-white placeholder:text-muted-foreground"
          />
          <input
            type="tel"
            required
            placeholder={cr.cta.phone}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="px-4 py-3 rounded-lg text-navy text-sm bg-white placeholder:text-muted-foreground"
          />
          <button
            type="submit"
            className="bg-gold text-navy font-semibold px-6 py-3 rounded-lg text-sm hover:opacity-90 transition"
          >
            {cr.cta.submit}
          </button>
        </form>
      </div>
    </section>
  );
}

/* ─── Schema JSON-LD ────────────────────────────────────── */
function SchemaMarkup() {
  const { lang } = useLanguage();
  const t = useLanguage().t.companyRegistrationUAE;

  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Company Registration in Dubai",
    provider: { "@type": "Organization", name: "Residency24", url: "https://residency24.com" },
    areaServed: { "@type": "Country", name: "United Arab Emirates" },
    offers: { "@type": "Offer", price: "12500", priceCurrency: "AED" },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: t.faq.items.map((item: any) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  );
}

/* ─── Main Page Component ───────────────────────────────── */
export default function CompanyRegistrationUAE() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <TrustBar />
      <AnchorNav />
      <WhyDubaiSection />
      <CompanyTypeSelector />
      <StepsSection />
      <PricingSection />
      {/* section-4 (Documents) placeholder — can be added later */}
      <FAQSection />
      <CTASection />
      <SchemaMarkup />
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
