"use client";

import { Briefcase, Laptop, Building2, ArrowRight, type LucideIcon } from "lucide-react";

const ICONS: LucideIcon[] = [Briefcase, Laptop, Building2];

interface EligibilityCheckProps {
  data: any;
  isRTL: boolean;
  onOpenChat: (message?: string) => void;
}

export default function EligibilityCheck({ data, isRTL, onOpenChat }: EligibilityCheckProps) {
  return (
    <section className="py-16 md:py-20 bg-surface">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-[28px] md:text-[32px] font-bold text-navy">{data.title}</h2>
          <p className="mt-3 text-[15px] text-muted-foreground">{data.subtitle}</p>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {data.pathways.map((pw: any, i: number) => {
            const Icon = ICONS[i] ?? Briefcase;
            return (
              <div key={i} className="bg-white border border-border rounded-2xl p-6 flex flex-col">
                <div className="w-12 h-12 rounded-xl bg-navy/5 text-navy flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-[17px] font-bold text-navy mb-2">{pw.title}</h3>
                <p className="text-[13.5px] text-muted-foreground leading-relaxed flex-1">{pw.requirement}</p>
                <button
                  type="button"
                  onClick={() => onOpenChat(pw.title)}
                  className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-bold text-navy hover:text-gold-dk transition-colors"
                >
                  {data.ctaLabel} <ArrowRight className={`w-3.5 h-3.5 ${isRTL ? "rotate-180" : ""}`} />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
