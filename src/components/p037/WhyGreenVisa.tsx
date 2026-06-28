"use client";

import { ShieldCheck, CalendarClock, Users, Clock, type LucideIcon } from "lucide-react";

const ICONS: LucideIcon[] = [ShieldCheck, CalendarClock, Users, Clock];

interface WhyGreenVisaProps {
  data: any;
}

export default function WhyGreenVisa({ data }: WhyGreenVisaProps) {
  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-[28px] md:text-[32px] font-bold text-navy text-center mb-10">{data.title}</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {data.cards.map((c: any, i: number) => {
            const Icon = ICONS[i] ?? ShieldCheck;
            return (
              <div key={i} className="bg-surface border border-border rounded-2xl p-6">
                <div className="w-11 h-11 rounded-xl bg-gold-lt text-gold-dk flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-[15.5px] font-bold text-navy mb-2">{c.title}</h3>
                <p className="text-[13px] text-muted-foreground leading-relaxed">{c.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
