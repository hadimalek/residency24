"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import Navbar from "@/components/Navbar";
import HeroChat from "@/components/HeroChat";
import TrustBar from "@/components/TrustBar";
import SharedBreadcrumb from "@/components/shared/SharedBreadcrumb";
import GoldenVisaStatsStrip from "@/components/p004/GoldenVisaStatsStrip";
import EligibilityChecker from "@/components/p004/EligibilityChecker";
import GoldenVisaComparison from "@/components/p004/GoldenVisaComparison";
import GoldenVisaCategories from "@/components/p004/GoldenVisaCategories";
import GoldenVisaCostBreakdown from "@/components/p004/GoldenVisaCostBreakdown";
import GoldenVisaProcess from "@/components/p004/GoldenVisaProcess";
import GoldenVisaUpdates from "@/components/p004/GoldenVisaUpdates";
import GoldenVisaNationalityNotes from "@/components/p004/GoldenVisaNationalityNotes";
import SharedTestimonials from "@/components/shared/SharedTestimonials";
import SharedFAQ from "@/components/shared/SharedFAQ";
import SharedCrossSell from "@/components/shared/SharedCrossSell";
import SharedLeadForm from "@/components/shared/SharedLeadForm";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { Building, Building2, Globe, Plane } from "lucide-react";
import type { Testimonial } from "@/components/shared/SharedTestimonials";
import type { FAQItem } from "@/components/shared/SharedFAQ";
import type { CrossSellItem } from "@/components/shared/SharedCrossSell";

export default function GoldenVisaPageClient() {
  const { t, lang, isRTL } = useLanguage();
  const p = t.p004;

  const homeLabels: Record<string, string> = { fa: "خانه", en: "Home", ar: "الرئيسية", ru: "Главная" };
  const breadcrumbItems = [
    { label: "Residency24", href: `/${lang}/` },
    { label: p.breadcrumb_uae, href: `/${lang}/uae/` },
    { label: p.breadcrumb_gv },
  ];

  const testimonials: Testimonial[] = [
    { id: "p004-1", name: p.testimonial1_name, flag: "\u{1F1EE}\u{1F1F7}", nationality: "Iran", outcome: "Golden Visa", quote: p.testimonial1_quote, service: p.testimonial1_type, rating: 5, initials: p.testimonial1_name?.slice(0, 2) || "AM" },
    { id: "p004-2", name: p.testimonial2_name, flag: "\u{1F1F7}\u{1F1FA}", nationality: "Russia", outcome: "Golden Visa", quote: p.testimonial2_quote, service: p.testimonial2_type, rating: 5, initials: p.testimonial2_name?.slice(0, 2) || "MK" },
    { id: "p004-3", name: p.testimonial3_name, flag: "\u{1F1F0}\u{1F1FC}", nationality: "Kuwait", outcome: "Golden Visa", quote: p.testimonial3_quote, service: p.testimonial3_type, rating: 5, initials: p.testimonial3_name?.slice(0, 2) || "AA" },
  ];

  const faqItems: FAQItem[] = (p.faq_items as { q: string; a: string }[] || []).map((item: { q: string; a: string }) => ({
    question: item.q,
    answer: item.a,
  }));

  const s = t.shared;

  const crossSellItems: CrossSellItem[] = [
    { title: s.cs_property, description: s.cs_property_gold_desc, icon: Building, href: `/${lang}/uae/buy-property/`, isHighlighted: true, badge: s.cs_badge_fastest },
    { title: s.cs_company_reg, description: s.cs_company_gold_desc, icon: Building2, href: `/${lang}/uae/company-registration/` },
    { title: s.cs_oman, description: s.cs_oman_desc, icon: Globe, href: `/${lang}/oman/` },
    { title: s.cs_visa, description: s.cs_visa_desc, icon: Plane, href: `/${lang}/visa/uae/` },
  ];

  return (
    <div className="min-h-screen bg-background" style={{ scrollBehavior: "smooth" }}>
      <Navbar />
      <h1 className="sr-only">{p.h1}</h1>

      {/* S01 — Breadcrumb */}
      <SharedBreadcrumb items={breadcrumbItems} />

      {/* S02 — Hero + HeroChat (LOCKED) */}
      <HeroChat />

      {/* S03 — TrustBar (LOCKED) */}
      <TrustBar />

      {/* S04 — StatsStrip */}
      <GoldenVisaStatsStrip />

      {/* S05–S07 — Unique content */}
      <EligibilityChecker />
      <GoldenVisaComparison />
      <GoldenVisaCategories />
      <GoldenVisaCostBreakdown />
      <GoldenVisaProcess />
      <GoldenVisaUpdates />

      {/* S08 — NationalityHooks */}
      <GoldenVisaNationalityNotes />

      {/* S10 — Testimonials */}
      <SharedTestimonials testimonials={testimonials} title={p.testimonials_title} />

      {/* S11 — FAQ */}
      <SharedFAQ items={faqItems} title={p.faq_title} />

      {/* S12 — CrossSell */}
      <SharedCrossSell items={crossSellItems} title={s.cs_section_title} />

      {/* S13 — LeadForm (always last) */}
      <SharedLeadForm serviceContext="golden_visa" title={p.cta_final_title} subtitle={p.cta_final_sub} />
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
