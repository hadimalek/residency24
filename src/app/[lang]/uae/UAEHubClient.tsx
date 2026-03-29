"use client";

import Navbar from "@/components/Navbar";
import HeroChat from "@/components/HeroChat";
import TrustBar from "@/components/TrustBar";
import UAEFactsStrip from "@/components/uae/UAEFactsStrip";
import UAEServicesGrid from "@/components/uae/UAEServicesGrid";
import WhyUAE from "@/components/uae/WhyUAE";
import PathFinder from "@/components/uae/PathFinder";
import ResidencyRoutes from "@/components/uae/ResidencyRoutes";
import CostBreakdown from "@/components/uae/CostBreakdown";
import DubaiAreas from "@/components/uae/DubaiAreas";
import Testimonials from "@/components/uae/Testimonials";
import CrossSellCTA from "@/components/uae/CrossSellCTA";
import UAEFAQAccordion from "@/components/uae/UAEFAQAccordion";
import NationalityHooks from "@/components/NationalityHooks";
import HowItWorks from "@/components/HowItWorks";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";

export default function UAEHubClient({ h1 }: { h1: string }) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <h1 className="sr-only">{h1}</h1>
      <main>
        {/* S01 */}
        <HeroChat />

        {/* S02 */}
        <TrustBar />

        {/* S03 */}
        <UAEFactsStrip />

        {/* S04 */}
        <UAEServicesGrid />

        {/* S05 */}
        <WhyUAE />

        {/* S06 */}
        <PathFinder />

        {/* S07 */}
        <ResidencyRoutes />

        {/* S08 */}
        <CostBreakdown />

        {/* S09 */}
        <HowItWorks />

        {/* S10 */}
        <DubaiAreas />

        {/* S11 */}
        <NationalityHooks />

        {/* S12 */}
        <Testimonials />

        {/* S13 */}
        <UAEFAQAccordion />

        {/* S14 */}
        <CrossSellCTA />
      </main>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
