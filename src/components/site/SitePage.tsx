"use client";

import { LanguageProvider } from "@/contexts/LanguageContext";
import Navbar from "@/components/Navbar";
import HeroChat from "@/components/HeroChat";
import TrustBar from "@/components/TrustBar";
import CountriesHub from "@/components/CountriesHub";
import AllServicesGrid from "@/components/AllServicesGrid";
import VideoSection from "@/components/VideoSection";
import HowItWorks from "@/components/HowItWorks";
import CompareSection from "@/components/CompareSection";
import PricingCards from "@/components/PricingCards";
import AIAdvisorFeature from "@/components/AIAdvisorFeature";
import NationalityHooks from "@/components/NationalityHooks";
import TeamSection from "@/components/TeamSection";
import Testimonials from "@/components/Testimonials";
import TrustCompliance from "@/components/TrustCompliance";
import BlogPreview from "@/components/BlogPreview";
import FAQ from "@/components/FAQ";
import ContactBar from "@/components/ContactBar";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";

export function SitePage() {
  return (
    <LanguageProvider>
      <div className="min-h-screen bg-background">
        <Navbar />
        <HeroChat pageKey="p001" />
        <TrustBar />
        <CountriesHub />
        <AllServicesGrid />
        <VideoSection />
        <HowItWorks />
        <CompareSection />
        <PricingCards />
        <AIAdvisorFeature />
        <NationalityHooks />
        <TeamSection />
        <Testimonials />
        <TrustCompliance />
        <BlogPreview />
        <FAQ />
        <ContactBar />
        <Footer />
        <WhatsAppFloat />
      </div>
    </LanguageProvider>
  );
}
