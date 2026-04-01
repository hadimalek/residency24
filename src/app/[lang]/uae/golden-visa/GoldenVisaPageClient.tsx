"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import Navbar from "@/components/Navbar";
import HeroChat from "@/components/HeroChat";
import TrustBar from "@/components/TrustBar";
import GoldenVisaBreadcrumb from "@/components/p004/GoldenVisaBreadcrumb";
import GoldenVisaStatsStrip from "@/components/p004/GoldenVisaStatsStrip";
import EligibilityChecker from "@/components/p004/EligibilityChecker";
import GoldenVisaComparison from "@/components/p004/GoldenVisaComparison";
import GoldenVisaCategories from "@/components/p004/GoldenVisaCategories";
import GoldenVisaCostBreakdown from "@/components/p004/GoldenVisaCostBreakdown";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";

export default function GoldenVisaPageClient() {
  const { t, isRTL } = useLanguage();

  return (
    <div className={`min-h-screen bg-background ${isRTL ? "font-fa" : "font-en"}`} dir={isRTL ? "rtl" : "ltr"} style={{ scrollBehavior: "smooth" }}>
      <Navbar />
      <h1 className="sr-only">{t.p004.h1}</h1>
      <HeroChat />
      <TrustBar />
      <GoldenVisaBreadcrumb />
      <GoldenVisaStatsStrip />
      <EligibilityChecker />
      <GoldenVisaComparison />
      <GoldenVisaCategories />
      <GoldenVisaCostBreakdown />
      {/* Phase 4-5 components will be added here */}
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
