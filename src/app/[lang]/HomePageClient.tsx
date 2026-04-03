"use client";

import Navbar from "@/components/Navbar";
import HeroChat from "@/components/HeroChat";
import CountriesHub from "@/components/CountriesHub";
import AllServicesGrid from "@/components/AllServicesGrid";
import VideoSection from "@/components/VideoSection";
import CompareSection from "@/components/CompareSection";
import PricingCards from "@/components/PricingCards";
import AIAdvisorFeature from "@/components/AIAdvisorFeature";
import NationalityHooks from "@/components/NationalityHooks";
import TeamSection from "@/components/TeamSection";
import TrustCompliance from "@/components/TrustCompliance";
import BlogPreview from "@/components/BlogPreview";
import FAQ from "@/components/FAQ";
import ContactBar from "@/components/ContactBar";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import SharedTestimonials from "@/components/shared/SharedTestimonials";
import type { Testimonial } from "@/components/shared/SharedTestimonials";
import SharedStatsStrip from "@/components/shared/SharedStatsStrip";
import type { Stat } from "@/components/shared/SharedStatsStrip";
import SharedHowItWorks from "@/components/shared/SharedHowItWorks";
import type { Step } from "@/components/shared/SharedHowItWorks";

const homeTestimonials: Testimonial[] = [
  {
    id: "home-t1",
    nameKey: "sharedTestimonials.clients.0.name",
    nationalityFlag: "🇮🇷",
    nationalityKey: "sharedTestimonials.clients.0.nationality",
    outcomeKey: "sharedTestimonials.clients.0.outcome",
    quoteKey: "sharedTestimonials.clients.0.quote",
    serviceKey: "sharedTestimonials.clients.0.service",
    rating: 5,
    avatarInitials: "R.M",
  },
  {
    id: "home-t2",
    nameKey: "sharedTestimonials.clients.1.name",
    nationalityFlag: "🇷🇺",
    nationalityKey: "sharedTestimonials.clients.1.nationality",
    outcomeKey: "sharedTestimonials.clients.1.outcome",
    quoteKey: "sharedTestimonials.clients.1.quote",
    serviceKey: "sharedTestimonials.clients.1.service",
    rating: 5,
    avatarInitials: "A.K",
  },
  {
    id: "home-t3",
    nameKey: "sharedTestimonials.clients.2.name",
    nationalityFlag: "🇮🇷",
    nationalityKey: "sharedTestimonials.clients.2.nationality",
    outcomeKey: "sharedTestimonials.clients.2.outcome",
    quoteKey: "sharedTestimonials.clients.2.quote",
    serviceKey: "sharedTestimonials.clients.2.service",
    rating: 5,
    avatarInitials: "S.T",
  },
];

const homeStats: Stat[] = [
  { value: "5,000+", labelKey: "sharedStats.clientsLabel" },
  { value: "12", labelKey: "sharedStats.yearsLabel" },
  { value: "3", labelKey: "sharedStats.countriesLabel" },
  { value: "4", labelKey: "sharedStats.officesLabel" },
];

const homeSteps: Step[] = [
  { number: 1, titleKey: "how.steps.0.title", descriptionKey: "how.steps.0.desc" },
  { number: 2, titleKey: "how.steps.1.title", descriptionKey: "how.steps.1.desc" },
  { number: 3, titleKey: "how.steps.2.title", descriptionKey: "how.steps.2.desc" },
  { number: 4, titleKey: "how.steps.3.title", descriptionKey: "how.steps.3.desc" },
];

export default function HomePageClient({ h1 }: { h1: string }) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <h1 className="sr-only">{h1}</h1>
      <HeroChat />
      <SharedStatsStrip stats={homeStats} variant="light" />
      <CountriesHub />
      <AllServicesGrid />
      <VideoSection />
      <SharedHowItWorks
        steps={homeSteps}
        titleKey="how.h2"
        subtitleKey="how.sub"
        variant="numbered"
      />
      <CompareSection />
      <PricingCards />
      <AIAdvisorFeature />
      <NationalityHooks />
      <TeamSection />
      <SharedTestimonials
        testimonials={homeTestimonials}
        titleKey="sharedTestimonials.sectionTitle"
        subtitleKey="sharedTestimonials.sectionSubtitle"
      />
      <TrustCompliance />
      <BlogPreview />
      <FAQ />
      <ContactBar />
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
