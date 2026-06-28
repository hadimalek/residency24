"use client";

import { Check, Sparkles, ArrowRight } from "lucide-react";
import MediaImage from "@/components/MediaImage";

interface GreenVisaHeroProps {
  h: any;
  images: any;
  isRTL: boolean;
  onOpenChat: (message?: string) => void;
}

export default function GreenVisaHero({ h, images, isRTL, onOpenChat }: GreenVisaHeroProps) {
  return (
    <header className="relative overflow-hidden text-white bg-navy">
      <div className="max-w-6xl mx-auto px-4 py-16 md:py-20 grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
        {/* Mandatory hero image */}
        <div className="relative aspect-[4/3] rounded-3xl overflow-hidden border border-gold/20 shadow-2xl">
          <MediaImage src={images.hero.src} alt={images.hero.alt} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-navy/50 to-transparent pointer-events-none" />
        </div>

        {/* Content + chat entry */}
        <div className={isRTL ? "text-right" : "text-left"}>
          <span className="inline-flex items-center gap-2 bg-white/10 border border-gold/30 text-gold px-3 py-1.5 rounded-full text-xs font-bold mb-4">
            <Sparkles className="w-3.5 h-3.5" /> {h.eyebrow}
          </span>
          <h1 className="text-[30px] md:text-[40px] font-extrabold leading-tight">{h.title}</h1>
          <p className="text-base text-white/75 mt-4 max-w-xl">{h.subtitle}</p>

          <div className="flex flex-wrap gap-2 mt-5">
            {h.pathwayBadges.map((b: string, i: number) => (
              <span key={i} className="bg-white/10 text-white/90 text-xs font-semibold px-3 py-1.5 rounded-full">
                {b}
              </span>
            ))}
          </div>

          <div className="flex flex-wrap gap-x-5 gap-y-2 mt-5">
            {h.trustMicro.map((tm: string, i: number) => (
              <span key={i} className="flex items-center gap-1.5 text-sm text-white/80">
                <Check className="w-4 h-4 text-gold" /> {tm}
              </span>
            ))}
          </div>

          <button
            type="button"
            onClick={() => onOpenChat()}
            className="mt-7 w-full max-w-md text-start bg-white rounded-xl px-4 py-3.5 text-[14px] text-muted-foreground hover:shadow-lg transition-shadow flex items-center justify-between gap-3"
          >
            <span>{h.heroChatPlaceholder}</span>
            <ArrowRight className={`w-4 h-4 text-navy shrink-0 ${isRTL ? "rotate-180" : ""}`} />
          </button>
        </div>
      </div>
    </header>
  );
}
