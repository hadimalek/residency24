"use client";

import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import ChatModal from "@/components/ChatModal";
import SharedBreadcrumb from "@/components/shared/SharedBreadcrumb";
import GreenVisaHero from "@/components/p037/GreenVisaHero";
import EligibilityCheck from "@/components/p037/EligibilityCheck";
import WhyGreenVisa from "@/components/p037/WhyGreenVisa";
import PathwayTabs from "@/components/p037/PathwayTabs";

export default function GreenVisaPageClient() {
  const { t, lang, isRTL } = useLanguage();
  const p = t.page_p037;
  const h = t.hero_p037;

  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const openChat = (message = "") => {
    setChatMessage(message);
    setChatOpen(true);
  };

  const breadcrumbItems = [
    { label: p.breadcrumb[0], href: `/${lang}/` },
    { label: p.breadcrumb[1], href: `/${lang}/uae/` },
    { label: p.breadcrumb[2] },
  ];

  return (
    <div className="min-h-screen bg-background" style={{ direction: isRTL ? "rtl" : "ltr" }}>
      <Navbar />

      {/* S01 */}
      <SharedBreadcrumb items={breadcrumbItems} />

      {/* S02 */}
      <GreenVisaHero h={h} images={p.images} isRTL={isRTL} onOpenChat={openChat} />

      {/* S03 */}
      <EligibilityCheck data={p.eligibility} isRTL={isRTL} onOpenChat={openChat} />

      {/* S04 */}
      <WhyGreenVisa data={p.why} />

      {/* S05 */}
      <PathwayTabs data={p.pathwaysDetail} images={p.images} />

      {/* S06–S10 added in Phase 5 */}

      <WhatsAppFloat />
      <Footer />
      <ChatModal isOpen={chatOpen} onClose={() => setChatOpen(false)} initialMessage={chatMessage} />
    </div>
  );
}
