"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import ContactBar from "@/components/ContactBar";
import { useLanguage } from "@/contexts/LanguageContext";
import { CheckCircle } from "lucide-react";

interface Props {
  serviceKey: "golden_visa" | "company_registration" | "buy_property" | "tourist_visa";
}

export default function UAEServicePageClient({ serviceKey }: Props) {
  const { t, isRTL } = useLanguage();
  const page = t.uae_page?.[serviceKey];

  if (!page) return null;

  return (
    <div className="min-h-screen bg-background" dir={isRTL ? "rtl" : "ltr"}>
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-16 px-4 bg-gradient-to-b from-navy-50 to-white dark:from-navy-950 dark:to-background">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block px-3 py-1 mb-4 text-sm font-medium bg-amber-100 text-amber-800 rounded-full">🇦🇪</span>
          <h1 className="text-3xl md:text-5xl font-bold mb-6">{page.h1}</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{page.sub}</p>
          {page.price && (
            <div className="mt-6">
              <span className="text-2xl font-bold text-amber-600">{page.price}</span>
              {page.price_note && <p className="text-sm text-muted-foreground mt-1">{page.price_note}</p>}
            </div>
          )}
        </div>
      </section>

      {/* Benefits */}
      {page.benefits && (
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">{page.benefits_title}</h2>
            <ul className="space-y-4 max-w-xl mx-auto">
              {page.benefits.map((b: string, i: number) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Requirements */}
      {page.requirements && (
        <section className="py-16 px-4 bg-muted/50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">{page.requirements_title}</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {page.requirements.map((r: any, i: number) => (
                <div key={i} className="p-6 rounded-2xl border bg-card">
                  <h3 className="font-semibold mb-2">{r.type}</h3>
                  <p className="text-sm text-muted-foreground">{r.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Types */}
      {page.types && (
        <section className="py-16 px-4 bg-muted/50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">{page.types_title}</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {page.types.map((type: any, i: number) => (
                <div key={i} className="p-6 rounded-2xl border bg-card">
                  <h3 className="font-semibold mb-2">{type.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{type.desc}</p>
                  <span className="text-amber-600 font-medium">{type.price}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Includes */}
      {page.includes && (
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">{page.includes_title}</h2>
            <ul className="space-y-4 max-w-xl mx-auto">
              {page.includes.map((item: string, i: number) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Areas (buy-property only) */}
      {page.areas && (
        <section className="py-16 px-4 bg-muted/50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">{page.areas_title}</h2>
            <div className="flex flex-wrap justify-center gap-3">
              {page.areas.map((area: string, i: number) => (
                <span key={i} className="px-4 py-2 rounded-full border bg-card text-sm font-medium">{area}</span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Process */}
      {page.process && (
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">{page.process_title}</h2>
            <div className="flex flex-col md:flex-row items-start md:items-center justify-center gap-4 md:gap-8">
              {page.process.map((step: string, i: number) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-amber-600 text-white flex items-center justify-center text-sm font-bold shrink-0">{i + 1}</span>
                  <span className="text-sm font-medium">{step}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-16 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <a
            href="https://wa.me/971562009131"
            className="inline-block px-8 py-4 bg-green-600 text-white font-semibold rounded-full hover:bg-green-700 transition-colors"
          >
            {page.cta}
          </a>
        </div>
      </section>

      <ContactBar />
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
