"use client";

import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Shield, Building2, Home, ClipboardCheck, FileText, Send, Stethoscope, BadgeCheck,
  ArrowRight, MessageCircle,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import ChatModal from "@/components/ChatModal";
import TrustBar from "@/components/TrustBar";
import ContactBar from "@/components/ContactBar";
import MediaImage from "@/components/MediaImage";
import SharedBreadcrumb from "@/components/shared/SharedBreadcrumb";
import SharedPricingTable from "@/components/shared/SharedPricingTable";
import SharedHowItWorks from "@/components/shared/SharedHowItWorks";
import SharedFAQ from "@/components/shared/SharedFAQ";
import SharedCrossSell from "@/components/shared/SharedCrossSell";
import type { CrossSellItem } from "@/components/shared/SharedCrossSell";
import GreenVisaHero from "@/components/p037/GreenVisaHero";
import EligibilityCheck from "@/components/p037/EligibilityCheck";
import WhyGreenVisa from "@/components/p037/WhyGreenVisa";
import PathwayTabs from "@/components/p037/PathwayTabs";
import GreenVisaComparison from "@/components/p037/GreenVisaComparison";

const WA = "https://wa.me/971562009131";
const HOW_ICONS = [ClipboardCheck, FileText, Send, Stethoscope, BadgeCheck];

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

  const howSteps = p.howItWorks.steps.map((s: any, i: number) => ({
    number: i + 1,
    title: s.title,
    description: s.description,
    icon: HOW_ICONS[i] ?? ClipboardCheck,
  }));

  const crossSellItems: CrossSellItem[] = [
    { ...p.crossSell.items[0], icon: Shield, href: `/${lang}/uae/golden-visa/`, isHighlighted: true },
    { ...p.crossSell.items[1], icon: Building2, href: `/${lang}/uae/company-registration/` },
    { ...p.crossSell.items[2], icon: Home, href: `/${lang}/uae/buy-property/` },
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

      {/* S06 — Pricing */}
      <SharedPricingTable title={p.pricing.title} rows={p.pricing.rows} />
      <div className="bg-white">
        <p className="max-w-3xl mx-auto px-4 pb-16 -mt-6 text-xs text-muted-foreground text-center leading-relaxed">
          {p.pricing.disclaimer}
        </p>
      </div>

      {/* S07 — Comparison */}
      <GreenVisaComparison data={p.comparison} />

      {/* S08 — Process banner + How it works */}
      <div className="bg-white pt-16">
        <div className="max-w-5xl mx-auto px-4">
          <div className="relative aspect-[21/9] rounded-3xl overflow-hidden border-t-2 border-gold">
            <MediaImage src={p.images.processBanner.src} alt={p.images.processBanner.alt} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-navy/30 pointer-events-none" />
          </div>
        </div>
      </div>
      <SharedHowItWorks steps={howSteps} title={p.howItWorks.title} variant="cards" />

      {/* S09 — FAQ */}
      <SharedFAQ items={p.faq.items} title={p.faq.title} />

      {/* S10 — Cross-sell + CTA + TrustBar */}
      <SharedCrossSell items={crossSellItems} title={p.crossSell.title} variant="dark" />
      <TrustBar />
      <section className="py-16 md:py-20 bg-navy text-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-[28px] md:text-[32px] font-bold text-gold mb-3">{p.finalCta.title}</h2>
          <p className="text-white/75 mb-8 max-w-xl mx-auto">{p.finalCta.subtitle}</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              type="button"
              onClick={() => openChat()}
              className="inline-flex items-center gap-2 bg-gold text-navy font-bold px-6 py-3.5 rounded-xl text-sm hover:-translate-y-0.5 transition-transform"
            >
              {p.finalCta.primaryLabel} <ArrowRight className={`w-4 h-4 ${isRTL ? "rotate-180" : ""}`} />
            </button>
            <a
              href={WA}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-green-500 text-white font-bold px-6 py-3.5 rounded-xl text-sm hover:-translate-y-0.5 transition-transform"
            >
              <MessageCircle className="w-4 h-4" /> {p.finalCta.whatsappLabel}
            </a>
          </div>
        </div>
      </section>
      <ContactBar />

      <WhatsAppFloat />
      <Footer />
      <ChatModal isOpen={chatOpen} onClose={() => setChatOpen(false)} initialMessage={chatMessage} />
    </div>
  );
}
