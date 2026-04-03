"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import type { Lang } from "@/translations";
import Navbar from "@/components/Navbar";
import HeroChat from "@/components/HeroChat";
import TrustBar from "@/components/TrustBar";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import SharedBreadcrumb from "@/components/shared/SharedBreadcrumb";
import WhyDubai from "@/components/p003/WhyDubai";
import CompanyTypeSelector from "@/components/p003/CompanyTypeSelector";
import FreeZones from "@/components/p003/FreeZones";
import HowItWorksP003 from "@/components/p003/HowItWorksP003";
import PricingTable from "@/components/p003/PricingTable";
import DocumentsChecklist from "@/components/p003/DocumentsChecklist";
import NationalityHooksP003 from "@/components/p003/NationalityHooksP003";
import SharedCrossSell from "@/components/shared/SharedCrossSell";
import SharedTestimonials from "@/components/shared/SharedTestimonials";
import SharedFAQ from "@/components/shared/SharedFAQ";
import SharedLeadForm from "@/components/shared/SharedLeadForm";
import { Star, Home } from "lucide-react";
import type { Testimonial } from "@/components/shared/SharedTestimonials";
import type { FAQItem } from "@/components/shared/SharedFAQ";
import type { CrossSellItem } from "@/components/shared/SharedCrossSell";

export default function CompanyRegistrationClient({ lang }: { lang: Lang }) {
  const { t } = useLanguage();
  const cr = t.cr;
  const navItems = cr.nav_items?.split("|") ?? [];
  const faqItems: FAQItem[] = (cr.faq_items ?? []).map((item: { q: string; a: string }) => ({
    question: item.q,
    answer: item.a,
  }));

  const breadcrumbItems = [
    { label: "Residency24", href: `/${lang}/` },
    { label: cr.breadcrumb_uae || "UAE", href: `/${lang}/uae/` },
    { label: cr.breadcrumb_cr || cr.seo_title?.split("|")[0] || "Company Registration" },
  ];

  const testimonials: Testimonial[] = [
    { id: "p003-1", name: cr.t1_name, flag: "\u{1F1EE}\u{1F1F7}", nationality: "Iran", outcome: cr.t1_type, quote: cr.t1_quote, service: cr.t1_type, rating: 5, initials: cr.t1_name?.slice(0, 2) || "AM" },
    { id: "p003-2", name: cr.t2_name, flag: "\u{1F1F7}\u{1F1FA}", nationality: "Russia", outcome: cr.t2_type, quote: cr.t2_quote, service: cr.t2_type, rating: 5, initials: cr.t2_name?.slice(0, 2) || "MK" },
    { id: "p003-3", name: cr.t3_name, flag: "\u{1F1F0}\u{1F1FC}", nationality: "Kuwait", outcome: cr.t3_type, quote: cr.t3_quote, service: cr.t3_type, rating: 5, initials: cr.t3_name?.slice(0, 2) || "AA" },
  ];

  const crossSellItems: CrossSellItem[] = [
    { title: cr.cross_gv_title, description: cr.cross_gv_desc, icon: Star, href: `/${lang}/uae/golden-visa/`, isHighlighted: true },
    { title: cr.cross_prop_title, description: cr.cross_prop_desc, icon: Home, href: `/${lang}/uae/buy-property/` },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroChat />
      <TrustBar />
      <SharedBreadcrumb items={breadcrumbItems} />

      {/* Anchor Nav */}
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

      <WhyDubai />
      <CompanyTypeSelector />
      <FreeZones />
      <HowItWorksP003 />
      <PricingTable />
      <DocumentsChecklist />
      <NationalityHooksP003 />
      <SharedCrossSell items={crossSellItems} title={cr.cross_title} />
      <SharedTestimonials testimonials={testimonials} title={cr.testi_title} />
      <SharedFAQ items={faqItems} title={cr.faq_title} />
      <SharedLeadForm serviceContext="company_reg" title={cr.cta_title} subtitle={cr.cta_sub} />

      {/* JSON-LD Schemas */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            name: "Company Registration in Dubai",
            provider: { "@type": "Organization", name: "Residency24", url: "https://residency24.com" },
            offers: { "@type": "Offer", price: "12500", priceCurrency: "AED" },
            areaServed: { "@type": "Country", name: "United Arab Emirates" },
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: (cr.faq_items ?? []).slice(0, 5).map((item: { q: string; a: string }) => ({
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
              { "@type": "ListItem", position: 1, name: "Home", item: `https://residency24.com/${lang}/` },
              { "@type": "ListItem", position: 2, name: "UAE", item: `https://residency24.com/${lang}/uae/` },
              { "@type": "ListItem", position: 3, name: "Company Registration", item: `https://residency24.com/${lang}/uae/company-registration/` },
            ],
          }),
        }}
      />

      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
