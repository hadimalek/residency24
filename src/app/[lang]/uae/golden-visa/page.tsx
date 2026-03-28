"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { ChevronRight, Star, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function GoldenVisaPage() {
  const { t, isRTL, lang } = useLanguage();
  const p = t.uae_page;
  const gv = p.golden_visa_page;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Breadcrumb */}
      <nav className="max-w-6xl mx-auto px-4 pt-24 pb-2 text-sm text-muted-foreground" aria-label="Breadcrumb">
        <ol className="flex items-center gap-1">
          <li><Link href={`/${lang}/`} className="hover:text-foreground">{p.breadcrumb_home}</Link></li>
          <li><ChevronRight className={`w-3 h-3 ${isRTL ? "rotate-180" : ""}`} /></li>
          <li><Link href={`/${lang}/uae/`} className="hover:text-foreground">{p.breadcrumb_uae}</Link></li>
          <li><ChevronRight className={`w-3 h-3 ${isRTL ? "rotate-180" : ""}`} /></li>
          <li className="text-foreground font-medium">{gv.h1.split("—")[0].trim()}</li>
        </ol>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
            <Star className="w-6 h-6 text-yellow-600" />
          </div>
          <span className="text-sm px-3 py-1 rounded-full bg-primary/10 text-primary font-medium">🇦🇪</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-4">{gv.h1}</h1>
        <p className="text-lg text-muted-foreground">{gv.intro}</p>
      </section>

      {/* Who is eligible */}
      <section className="max-w-4xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">{gv.who_title}</h2>
        <ul className="space-y-3">
          {gv.who_items.map((item: string, i: number) => (
            <li key={i} className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Costs */}
      <section className="max-w-4xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">{gv.cost_title}</h2>
        <div className="rounded-2xl border bg-card p-6 space-y-3">
          <p className="font-medium">{gv.cost_gov}</p>
          <p className="text-muted-foreground">{gv.cost_service}</p>
        </div>
      </section>

      {/* Process */}
      <section className="max-w-4xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">{gv.process_title}</h2>
        <ol className="space-y-4">
          {gv.process_steps.map((step: string, i: number) => (
            <li key={i} className="flex items-start gap-4">
              <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold flex-shrink-0">{i + 1}</span>
              <span className="pt-1">{step}</span>
            </li>
          ))}
        </ol>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-4 py-12 text-center">
        <a href="https://wa.me/971562009131" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-primary text-primary-foreground font-medium hover:opacity-90 transition text-lg">
          {gv.cta}
        </a>
      </section>

      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
