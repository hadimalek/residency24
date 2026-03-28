"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { ChevronRight, Plane, FileText } from "lucide-react";
import Link from "next/link";

export default function TouristVisaPage() {
  const { t, isRTL, lang } = useLanguage();
  const p = t.uae_page;
  const tv = p.tourist_visa_page;

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
          <li className="text-foreground font-medium">{tv.h1.split("—")[0].trim()}</li>
        </ol>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-sky-100 dark:bg-sky-900/30 flex items-center justify-center">
            <Plane className="w-6 h-6 text-sky-600" />
          </div>
          <span className="text-sm px-3 py-1 rounded-full bg-primary/10 text-primary font-medium">🇦🇪</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-4">{tv.h1}</h1>
        <p className="text-lg text-muted-foreground">{tv.intro}</p>
      </section>

      {/* Visa Types */}
      <section className="max-w-4xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">{tv.types_title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tv.types.map((type: any, i: number) => (
            <div key={i} className="rounded-2xl border bg-card p-6 text-center">
              <h3 className="text-lg font-semibold mb-2">{type.name}</h3>
              <p className="text-primary font-medium text-xl mb-2">{type.price}</p>
              <p className="text-sm text-muted-foreground">{type.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Required Documents */}
      <section className="max-w-4xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">{tv.docs_title}</h2>
        <ul className="space-y-3">
          {tv.docs.map((doc: string, i: number) => (
            <li key={i} className="flex items-start gap-3">
              <FileText className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <span>{doc}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-4 py-12 text-center">
        <a href="https://wa.me/971562009131" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-primary text-primary-foreground font-medium hover:opacity-90 transition text-lg">
          {tv.cta}
        </a>
      </section>

      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
