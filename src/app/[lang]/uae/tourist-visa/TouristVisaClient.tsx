"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import Navbar from "@/components/Navbar";
import HeroChat from "@/components/HeroChat";
import TrustBar from "@/components/TrustBar";
import SharedBreadcrumb from "@/components/shared/SharedBreadcrumb";
import SharedStatsStrip from "@/components/shared/SharedStatsStrip";
import NationalityHooks from "@/components/NationalityHooks";
import SharedPricingTable from "@/components/shared/SharedPricingTable";
import SharedTestimonials from "@/components/shared/SharedTestimonials";
import SharedFAQ from "@/components/shared/SharedFAQ";
import SharedCrossSell from "@/components/shared/SharedCrossSell";
import SharedLeadForm from "@/components/shared/SharedLeadForm";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { CheckCircle, Trophy, Building2, Building, Globe } from "lucide-react";
import type { Stat } from "@/components/shared/SharedStatsStrip";
import type { Testimonial } from "@/components/shared/SharedTestimonials";
import type { FAQItem } from "@/components/shared/SharedFAQ";
import type { CrossSellItem } from "@/components/shared/SharedCrossSell";
import type { PricingRow } from "@/components/shared/SharedPricingTable";

export default function TouristVisaClient() {
  const { t, lang } = useLanguage();
  const p = t.uae_pages?.tourist_visa;
  const s = t.shared;

  if (!p) return null;

  const breadcrumbItems = [
    { label: "Residency24", href: `/${lang}/` },
    { label: "UAE", href: `/${lang}/uae/` },
    { label: p.h1 },
  ];

  const stats: Stat[] = [
    { value: "500", label: p.price, display: p.price },
    { value: "3", label: p.processing, display: p.processing },
    { value: "90", label: p.duration, display: p.duration },
  ];

  const pricingRows: PricingRow[] = (p.types as { name: string; price: string }[]).map((type) => ({
    label: type.name,
    amount: type.price,
  }));

  const testimonials: Testimonial[] = [
    { id: "p006-1", name: "Sara T.", flag: "\u{1F1EE}\u{1F1F7}", nationality: "Iran", outcome: "Tourist Visa — 2 days", quote: p.intro, service: "30-Day Visa", rating: 5, initials: "S.T" },
    { id: "p006-2", name: "Anna K.", flag: "\u{1F1F7}\u{1F1FA}", nationality: "Russia", outcome: "Tourist Visa — 1 day", quote: p.intro, service: "60-Day Visa", rating: 5, initials: "A.K" },
    { id: "p006-3", name: "Omar H.", flag: "\u{1F1F0}\u{1F1FC}", nationality: "Kuwait", outcome: "Tourist Visa", quote: p.intro, service: "90-Day Visa", rating: 5, initials: "O.H" },
  ];

  const faqItems: FAQItem[] = [
    { question: p.requirements_title, answer: (p.requirements as string[]).join(", ") },
  ];

  const crossSellItems: CrossSellItem[] = [
    { title: s.cs_golden_visa, description: s.cs_golden_visa_desc, icon: Trophy, href: `/${lang}/uae/golden-visa/`, isHighlighted: true },
    { title: s.cs_company_reg, description: s.cs_company_reg_desc, icon: Building2, href: `/${lang}/uae/company-registration/` },
    { title: s.cs_property, description: s.cs_property_desc, icon: Building, href: `/${lang}/uae/buy-property/` },
    { title: s.cs_oman_visa, description: s.cs_oman_visa_desc, icon: Globe, href: `/${lang}/visa/oman/` },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* S01 — Breadcrumb */}
      <SharedBreadcrumb items={breadcrumbItems} />

      {/* S02 — Hero + HeroChat (LOCKED) */}
      <HeroChat />

      {/* S03 — TrustBar (LOCKED) */}
      <TrustBar />

      {/* S04 — StatsStrip */}
      <SharedStatsStrip stats={stats} variant="dark" />

      {/* S05–S07 — Unique content */}
      {/* Visa Types */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">{p.types_title}</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {(p.types as { name: string; desc: string; price: string }[])?.map((item, i) => (
              <div key={i} className="rounded-xl border border-border bg-card p-5">
                <h3 className="font-semibold text-lg mb-1">{item.name}</h3>
                <p className="text-sm text-muted-foreground mb-2">{item.desc}</p>
                <p className="text-sm font-medium text-primary">{item.price}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Requirements */}
      {p.requirements && (
        <section className="py-12 bg-surface">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-2xl font-bold mb-6">{p.requirements_title}</h2>
            <ul className="space-y-3">
              {(p.requirements as string[]).map((req, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Process Steps */}
      {p.steps && (
        <section className="py-12 bg-white">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-2xl font-bold mb-6">{p.steps_title}</h2>
            <ol className="space-y-4">
              {(p.steps as string[]).map((step, i) => (
                <li key={i} className="flex items-start gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                    {i + 1}
                  </span>
                  <span className="pt-1">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      {/* S08 — NationalityHooks */}
      <NationalityHooks />

      {/* S09 — PricingTable */}
      <SharedPricingTable title={p.types_title} rows={pricingRows} showCTA />

      {/* S10 — Testimonials */}
      <SharedTestimonials testimonials={testimonials} title={s.testimonials_title} />

      {/* S11 — FAQ */}
      <SharedFAQ items={faqItems} title={s.faq_title} />

      {/* S12 — CrossSell */}
      <SharedCrossSell items={crossSellItems} title={s.cs_section_title} />

      {/* S13 — LeadForm (always last) */}
      <SharedLeadForm serviceContext="tourist_visa" />

      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
