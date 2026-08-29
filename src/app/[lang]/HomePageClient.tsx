"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import Navbar from "@/components/Navbar";
import HeroChat from "@/components/HeroChat";
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
import type { HomePostPreview } from "@/lib/cms/articles";
import { localizedPath } from "@/lib/locale-path";

export default function HomePageClient({ h1, blogPosts }: { h1: string; blogPosts?: HomePostPreview[] }) {
  const { t, lang } = useLanguage();
  const s = t.shared;

  const crossSellItems: CrossSellItem[] = [
    { title: s.cs_golden_visa, description: s.cs_golden_visa_desc, icon: Trophy, href: localizedPath(lang, 'uae/golden-visa'), isHighlighted: true, badge: s.cs_badge_popular },
    { title: s.cs_company_reg, description: s.cs_company_reg_desc, icon: Building2, href: localizedPath(lang, 'uae/company-registration') },
    { title: s.cs_property, description: s.cs_property_desc, icon: Building, href: localizedPath(lang, 'uae/buy-property') },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* S02 — Hero + HeroChat (LOCKED) */}
      <HeroChat pageKey="p001" />

      {/* S05–S07 — Unique content */}
      <CountriesHub />
      <AllServicesGrid />
      <VideoSection />
      <HowItWorks />
      <CompareSection />
      <AIAdvisorFeature />
      <TeamSection />
      <TrustCompliance />
      <BlogPreview posts={blogPosts} />

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
