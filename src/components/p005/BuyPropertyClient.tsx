"use client";

import { useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import Navbar from "@/components/Navbar";
import HeroChat from "@/components/HeroChat";
import TrustBar from "@/components/TrustBar";
import SharedBreadcrumb from "@/components/shared/SharedBreadcrumb";
import SharedStatsStrip from "@/components/shared/SharedStatsStrip";
import ValueProps from "@/components/p005/ValueProps";
import PropertyVisaTable from "@/components/p005/PropertyVisaTable";
import NationalityHooks from "@/components/NationalityHooks";
import DubaiAreasGrid from "@/components/p005/DubaiAreasGrid";
import SharedHowItWorks from "@/components/shared/SharedHowItWorks";
import SharedPricingTable from "@/components/shared/SharedPricingTable";
import SharedLeadForm from "@/components/shared/SharedLeadForm";
import SharedTestimonials from "@/components/shared/SharedTestimonials";
import SharedCrossSell from "@/components/shared/SharedCrossSell";
import SharedFAQ from "@/components/shared/SharedFAQ";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import type { Lang } from "@/translations";
import { Target, Users, CreditCard, Search, FileSignature, CheckCircle, Landmark, Building, Key, Star, Trophy, Globe, Plane, Building2 } from "lucide-react";
import type { Testimonial } from "@/components/shared/SharedTestimonials";
import type { Step } from "@/components/shared/SharedHowItWorks";
import type { FAQItem } from "@/components/shared/SharedFAQ";
import type { CrossSellItem } from "@/components/shared/SharedCrossSell";
import type { Stat } from "@/components/shared/SharedStatsStrip";
import type { PricingRow } from "@/components/shared/SharedPricingTable";

const BASE_URL = "https://residency24.com";

function buildSchemas(lang: Lang, bp: any) {
  const langPrefix = lang === "en" ? `${BASE_URL}` : `${BASE_URL}/${lang}`;
  const pageUrl = `${langPrefix}/uae/buy-property/`;
  const homeLabel: Record<Lang, string> = { fa: "خانه", en: "Home", ar: "الرئيسية", ru: "Главная" };

  const service = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: bp.hero_headline,
    description: bp.hero_sub,
    provider: { "@type": "Organization", name: "Residency24", url: `${langPrefix}/` },
    areaServed: { "@type": "City", name: "Dubai" },
    url: pageUrl,
  };

  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: (bp.faq_items as { q: string; a: string }[]).map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  const areas = [
    { name: { en: "Downtown Dubai", fa: "داون‌تاون دبی", ar: "وسط مدينة دبي", ru: "Даунтаун Дубай" } },
    { name: { en: "Dubai Marina", fa: "دبی مارینا", ar: "دبي مارينا", ru: "Дубай Марина" } },
    { name: { en: "JVC", fa: "JVC", ar: "JVC", ru: "JVC" } },
    { name: { en: "Business Bay", fa: "بیزینس‌بی", ar: "خليج الأعمال", ru: "Бизнес Бэй" } },
    { name: { en: "Dubai Hills Estate", fa: "دبی هیلز", ar: "تلال دبي", ru: "Дубай Хиллс" } },
    { name: { en: "Palm Jumeirah", fa: "پالم جمیرا", ar: "جزيرة النخلة", ru: "Пальма Джумейра" } },
    { name: { en: "Dubai South", fa: "دبی ساوث", ar: "دبي الجنوب", ru: "Дубай Саут" } },
  ];

  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: bp.areas_title,
    itemListElement: areas.map((a, i) => ({ "@type": "ListItem", position: i + 1, name: a.name[lang] })),
  };

  const howTo = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: bp.how_title,
    step: (bp.how_steps as { title: string; desc: string }[]).map((s, i) => ({
      "@type": "HowToStep", position: i + 1, name: s.title, text: s.desc,
    })),
  };

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: homeLabel[lang], item: `${langPrefix}/` },
      { "@type": "ListItem", position: 2, name: bp.breadcrumb_uae, item: `${langPrefix}/uae/` },
      { "@type": "ListItem", position: 3, name: bp.breadcrumb_property, item: pageUrl },
    ],
  };

  return [service, faq, itemList, howTo, breadcrumb];
}

export default function BuyPropertyClient({ h1 }: { h1: string }) {
  const { t, lang } = useLanguage();
  const bp = t.bp;
  const s = t.shared;

  useEffect(() => {
    const schemas = buildSchemas(lang, bp);
    const scripts: HTMLScriptElement[] = schemas.map((schema) => {
      const el = document.createElement("script");
      el.type = "application/ld+json";
      el.text = JSON.stringify(schema);
      document.head.appendChild(el);
      return el;
    });
    return () => { scripts.forEach((el) => { if (el.parentNode) el.parentNode.removeChild(el); }); };
  }, [lang, bp]);

  const STEP_ICONS = [Target, Users, CreditCard, Search, FileSignature, CheckCircle, Landmark, Building, Key, Star];
  const steps: Step[] = (bp.how_steps as { title: string; desc: string; time: string }[]).map((step, i) => ({
    number: i + 1,
    title: step.title,
    description: step.desc,
    icon: STEP_ICONS[i],
    duration: step.time,
  }));

  const costRows: PricingRow[] = (bp.cost_rows as { item: string; value: string }[]).map((r) => ({
    label: r.item,
    amount: r.value,
  }));
  costRows.push({ label: bp.cost_total, amount: bp.cost_total_value, isTotal: true });

  const stats: Stat[] = [
    { value: "6", label: bp.stats_yield_label, display: bp.stats_yield_num },
    { value: "0", label: bp.stats_tax_label, display: bp.stats_tax_num },
    { value: "750", label: bp.stats_entry_label, display: bp.stats_entry_num },
    { value: "10", label: bp.stats_visa_label, display: bp.stats_visa_num },
  ];

  const testimonials: Testimonial[] = [
    { id: "p005-1", name: "Alireza M.", flag: "\u{1F1EE}\u{1F1F7}", nationality: "Tehran", outcome: "Golden Visa — 60 days", quote: bp.faq_items?.[0]?.a?.slice(0, 80) || "With Residency24 I bought the apartment and got my Golden Visa in 60 days.", service: "JVC Apartment", rating: 5, initials: "A.M" },
    { id: "p005-2", name: "Mikhail K.", flag: "\u{1F1F7}\u{1F1FA}", nationality: "Moscow", outcome: "Title Deed in 30 days", quote: "The team handled everything remotely. Professional, fast, transparent.", service: "Dubai Marina", rating: 5, initials: "M.K" },
    { id: "p005-3", name: "Ahmed A.", flag: "\u{1F1F0}\u{1F1FC}", nationality: "Kuwait", outcome: "Family Golden Visa", quote: "Professional Arabic-speaking team. Everything was seamless from start to finish.", service: "Dubai Hills Villa", rating: 5, initials: "A.A" },
  ];

  const faqItems: FAQItem[] = (bp.faq_items as { q: string; a: string }[]).map((item) => ({
    question: item.q,
    answer: item.a,
  }));

  const crossSellItems: CrossSellItem[] = [
    { title: s.cs_golden_visa, description: s.cs_golden_via_prop_desc, icon: Trophy, href: `/${lang}/uae/golden-visa/`, isHighlighted: true, badge: s.cs_badge_unlock },
    { title: s.cs_company_reg, description: s.cs_company_reg_desc, icon: Building2, href: `/${lang}/uae/company-registration/` },
    { title: s.cs_oman_prop, description: s.cs_oman_prop_desc, icon: Globe, href: `/${lang}/oman/buy-property/` },
    { title: s.cs_visa, description: s.cs_visa_desc, icon: Plane, href: `/${lang}/visa/uae/` },
  ];

  const breadcrumbItems = [
    { label: "Residency24", href: `/${lang}/` },
    { label: bp.breadcrumb_uae, href: `/${lang}/uae/` },
    { label: bp.breadcrumb_property },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <h1 className="sr-only">{h1}</h1>

      {/* S01 — Breadcrumb */}
      <SharedBreadcrumb items={breadcrumbItems} />

      {/* S02 — Hero + HeroChat (LOCKED) */}
      <HeroChat pageKey="p005" />

      {/* S03 — TrustBar (LOCKED) */}
      <TrustBar />

      {/* S04 — StatsStrip */}
      <SharedStatsStrip stats={stats} variant="dark" />

      {/* S05–S07 — Unique content */}
      <ValueProps />
      <PropertyVisaTable />
      <DubaiAreasGrid />
      <SharedHowItWorks steps={steps} title={bp.how_title} variant="numbered" />
      <SharedPricingTable title={bp.cost_title} rows={costRows} showCTA />

      {/* S08 — NationalityHooks */}
      <NationalityHooks />

      {/* S10 — Testimonials */}
      <SharedTestimonials testimonials={testimonials} title={bp.testimonials_title} />

      {/* S11 — FAQ */}
      <SharedFAQ items={faqItems} title={bp.faq_h2} />

      {/* S12 — CrossSell */}
      <SharedCrossSell items={crossSellItems} title={s.cs_section_title} />

      {/* S13 — LeadForm (always last) */}
      <SharedLeadForm serviceContext="property" title={bp.form_title} />

      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
