"use client";

import { FormEvent, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import type { Lang } from "@/translations";
import Navbar from "@/components/Navbar";
import HeroChat from "@/components/HeroChat";
import TrustBar from "@/components/TrustBar";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import WhyDubai from "@/components/p003/WhyDubai";
import CompanyTypeSelector from "@/components/p003/CompanyTypeSelector";
import FreeZones from "@/components/p003/FreeZones";
import HowItWorksP003 from "@/components/p003/HowItWorksP003";
import PricingTable from "@/components/p003/PricingTable";
import DocumentsChecklist from "@/components/p003/DocumentsChecklist";
import NationalityHooksP003 from "@/components/p003/NationalityHooksP003";
import CrossSell from "@/components/p003/CrossSell";
import TestimonialsP003 from "@/components/p003/TestimonialsP003";
import FAQP003 from "@/components/p003/FAQP003";

export default function CompanyRegistrationClient({ lang }: { lang: Lang }) {
  const { t } = useLanguage();
  const cr = t.cr;
  const navItems = cr.nav_items?.split("|") ?? [];
  const faqItems = cr.faq_items ?? [];

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const handleWhatsApp = (e: FormEvent) => {
    e.preventDefault();
    const msg = encodeURIComponent(
      `${cr.cta_submit} - ${name} - ${phone}`
    );
    window.open(`https://wa.me/971562009131?text=${msg}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* S1 — HeroChat (untouched) */}
      <HeroChat />

      {/* S2 — TrustBar (untouched) */}
      <TrustBar />

      {/* S3 — Anchor Nav */}
      <nav className="sticky top-16 z-40 bg-white shadow-sm overflow-x-auto">
        <div className="flex gap-2 px-6 py-3 whitespace-nowrap">
          {navItems.map((item: string, i: number) => (
            <a
              key={i}
              href={`#cr-s${i + 4}`}
              className="text-sm text-muted-foreground border border-border rounded-full px-4 py-1.5 hover:border-gold hover:text-navy transition-colors shrink-0"
            >
              {item}
            </a>
          ))}
        </div>
      </nav>

      {/* S4 — Why Dubai */}
      <WhyDubai />

      {/* S5 — Company Type Selector */}
      <CompanyTypeSelector />

      {/* S6 — Free Zones */}
      <FreeZones />

      {/* S7 — How It Works */}
      <HowItWorksP003 />

      {/* S8 — Pricing */}
      <PricingTable />

      {/* S9 — Documents */}
      <DocumentsChecklist />

      {/* S10 — Nationality Hooks */}
      <NationalityHooksP003 />

      {/* S11 — Cross-Sell */}
      <CrossSell />

      {/* S12 — Testimonials */}
      <TestimonialsP003 />

      {/* S13 — FAQ */}
      <FAQP003 />

      {/* S14 — Final CTA */}
      <section id="cr-s14" className="py-20 bg-navy">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-bold text-white mb-3">
            {cr.cta_title}
          </h2>
          <p className="text-gold/80 mb-10">{cr.cta_sub}</p>
          <form onSubmit={handleWhatsApp} className="flex flex-col gap-4">
            <input
              type="text"
              placeholder={cr.cta_name}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl text-foreground bg-white focus:outline-none focus:ring-2 focus:ring-gold text-base"
            />
            <input
              type="tel"
              placeholder={cr.cta_phone}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-3 rounded-xl text-foreground bg-white focus:outline-none focus:ring-2 focus:ring-gold text-base"
            />
            <button
              type="submit"
              className="bg-gold text-navy font-bold px-6 py-3 rounded-xl hover:bg-gold-dk transition w-full"
            >
              {cr.cta_submit}
            </button>
          </form>
        </div>
      </section>

      {/* JSON-LD Schemas */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            name: "Company Registration in Dubai",
            provider: {
              "@type": "Organization",
              name: "Residency24",
              url: "https://residency24.com",
            },
            offers: {
              "@type": "Offer",
              price: "12500",
              priceCurrency: "AED",
            },
            areaServed: {
              "@type": "Country",
              name: "United Arab Emirates",
            },
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqItems.slice(0, 5).map((item: { q: string; a: string }) => ({
              "@type": "Question",
              name: item.q,
              acceptedAnswer: { "@type": "Answer", text: item.a },
            })),
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: `https://residency24.com/${lang}/`,
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "UAE",
                item: `https://residency24.com/${lang}/uae/`,
              },
              {
                "@type": "ListItem",
                position: 3,
                name: "Company Registration",
                item: `https://residency24.com/${lang}/uae/company-registration/`,
              },
            ],
          }),
        }}
      />

      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
