"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import Navbar from "@/components/Navbar";
import HeroChat from "@/components/HeroChat";
import TrustBar from "@/components/TrustBar";
import SharedBreadcrumb from "@/components/shared/SharedBreadcrumb";
import UAEFactsStrip from "@/components/uae/UAEFactsStrip";
import UAEServicesGrid from "@/components/uae/UAEServicesGrid";
import WhyUAE from "@/components/uae/WhyUAE";
import PathFinder from "@/components/uae/PathFinder";
import ResidencyRoutes from "@/components/uae/ResidencyRoutes";
import CostBreakdown from "@/components/uae/CostBreakdown";
import DubaiAreas from "@/components/uae/DubaiAreas";
import NationalityHooks from "@/components/NationalityHooks";
import SharedPricingTable from "@/components/shared/SharedPricingTable";
import Testimonials from "@/components/uae/Testimonials";
import UAEFAQAccordion from "@/components/uae/UAEFAQAccordion";
import SharedCrossSell from "@/components/shared/SharedCrossSell";
import SharedLeadForm from "@/components/shared/SharedLeadForm";
import HowItWorks from "@/components/HowItWorks";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { Trophy, Building2, Building, Globe } from "lucide-react";
import type { CrossSellItem } from "@/components/shared/SharedCrossSell";

export default function UAEHubClient({ h1 }: { h1: string }) {
  const { t, lang } = useLanguage();
  const s = t.shared;

  const breadcrumbItems = [
    { label: "Residency24", href: `/${lang}/` },
    { label: "UAE" },
  ];

  const crossSellItems: CrossSellItem[] = [
    { title: s.cs_golden_visa, description: s.cs_golden_visa_desc, icon: Trophy, href: `/${lang}/uae/golden-visa/`, isHighlighted: true, badge: s.cs_badge_popular },
    { title: s.cs_company_reg, description: s.cs_company_reg_desc, icon: Building2, href: `/${lang}/uae/company-registration/` },
    { title: s.cs_property, description: s.cs_property_desc, icon: Building, href: `/${lang}/uae/buy-property/` },
    { title: s.cs_oman, description: s.cs_oman_desc, icon: Globe, href: `/${lang}/oman/` },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <h1 className="sr-only">{h1}</h1>
      <main>
        {/* S01 — Breadcrumb */}
        <SharedBreadcrumb items={breadcrumbItems} />

        {/* S02 — Hero + HeroChat (LOCKED) */}
        <HeroChat pageKey="p002" />

        {/* S03 — TrustBar (LOCKED) */}
        <TrustBar />

        {/* S04 — StatsStrip */}
        <UAEFactsStrip />

        {/* S05–S07 — Unique content */}
        <UAEServicesGrid />
        <WhyUAE />
        <PathFinder />
        <ResidencyRoutes />
        <CostBreakdown />
        <HowItWorks />
        <DubaiAreas />

        {/* S08 — NationalityHooks */}
        <NationalityHooks />

        {/* S10 — Testimonials */}
        <Testimonials />

        {/* S11 — FAQ */}
        <UAEFAQAccordion />

        {/* S12 — CrossSell */}
        <SharedCrossSell items={crossSellItems} title={s.cs_section_title} />

        {/* S13 — LeadForm (always last) */}
        <SharedLeadForm serviceContext="uae_general" />
      </main>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
