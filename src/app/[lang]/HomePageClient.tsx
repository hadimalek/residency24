"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import Navbar from "@/components/Navbar";
import HeroChat from "@/components/HeroChat";
import TrustBar from "@/components/TrustBar";
import SharedBreadcrumb from "@/components/shared/SharedBreadcrumb";
import SharedStatsStrip from "@/components/shared/SharedStatsStrip";
import CountriesHub from "@/components/CountriesHub";
import AllServicesGrid from "@/components/AllServicesGrid";
import VideoSection from "@/components/VideoSection";
import HowItWorks from "@/components/HowItWorks";
import CompareSection from "@/components/CompareSection";
import AIAdvisorFeature from "@/components/AIAdvisorFeature";
import TeamSection from "@/components/TeamSection";
import Testimonials from "@/components/Testimonials";
import TrustCompliance from "@/components/TrustCompliance";
import BlogPreview from "@/components/BlogPreview";
import FAQ from "@/components/FAQ";
import SharedCrossSell from "@/components/shared/SharedCrossSell";
import SharedLeadForm from "@/components/shared/SharedLeadForm";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { Trophy, Building2, Building, Plane } from "lucide-react";
import type { CrossSellItem } from "@/components/shared/SharedCrossSell";
import type { Stat } from "@/components/shared/SharedStatsStrip";

export default function HomePageClient({ h1 }: { h1: string }) {
  const { t, lang } = useLanguage();
  const s = t.shared;

  const breadcrumbItems = [
    { label: "Residency24" },
  ];

  const stats: Stat[] = [
    { value: "500", label: s.stats_clients, display: "500+" },
    { value: "10", label: s.stats_years, display: "10+" },
    { value: "3", label: s.stats_offices, display: "3" },
    { value: "40", label: s.stats_countries, display: "40+" },
  ];

  const crossSellItems: CrossSellItem[] = [
    { title: s.cs_golden_visa, description: s.cs_golden_visa_desc, icon: Trophy, href: `/${lang}/uae/golden-visa/`, isHighlighted: true, badge: s.cs_badge_popular },
    { title: s.cs_company_reg, description: s.cs_company_reg_desc, icon: Building2, href: `/${lang}/uae/company-registration/` },
    { title: s.cs_property, description: s.cs_property_desc, icon: Building, href: `/${lang}/uae/buy-property/` },
    { title: s.cs_visa, description: s.cs_visa_desc, icon: Plane, href: `/${lang}/visa/uae/` },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <h1 className="sr-only">{h1}</h1>

      {/* S01 — Breadcrumb */}
      <SharedBreadcrumb items={breadcrumbItems} />

      {/* S02 — Hero + HeroChat (LOCKED) */}
      <HeroChat />

      {/* S03 — TrustBar (LOCKED) */}
      <TrustBar />

      {/* S04 — StatsStrip */}
      <SharedStatsStrip stats={stats} variant="dark" />

      {/* S05–S07 — Unique content */}
      <CountriesHub />
      <AllServicesGrid />
      <VideoSection />
      <HowItWorks />
      <CompareSection />
      <AIAdvisorFeature />
      <TeamSection />
      <TrustCompliance />
      <BlogPreview />

      {/* S10 — Testimonials */}
      <Testimonials />

      {/* S11 — FAQ */}
      <FAQ />

      {/* S12 — CrossSell */}
      <SharedCrossSell items={crossSellItems} title={s.cs_section_title} />

      {/* S13 — LeadForm (always last) */}
      <SharedLeadForm serviceContext="general" />

      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
