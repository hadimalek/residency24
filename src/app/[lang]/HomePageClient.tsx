"use client";

import Navbar from "@/components/Navbar";
import HeroChat from "@/components/HeroChat";
import TrustBar from "@/components/TrustBar";
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
import ContactBar from "@/components/ContactBar";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";

export default function HomePageClient({ h1 }: { h1: string }) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <h1 className="sr-only">{h1}</h1>
      <HeroChat />
      <TrustBar />
      <CountriesHub />
      <AllServicesGrid />
      <VideoSection />
      <HowItWorks />
      <CompareSection />
      <AIAdvisorFeature />
      <TeamSection />
      <Testimonials />
      <TrustCompliance />
      <BlogPreview />
      <FAQ />
      <ContactBar />
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
