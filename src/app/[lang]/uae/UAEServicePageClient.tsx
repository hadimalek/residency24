"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import SharedCrossSell from "@/components/shared/SharedCrossSell";
import { CheckCircle, Clock, DollarSign, Calendar, Shield, Building2, Home } from "lucide-react";
import type { CrossSellItem } from "@/components/shared/SharedCrossSell";

type ServicePageType = "golden_visa" | "company_registration" | "buy_property" | "tourist_visa";

export default function UAEServicePageClient({ service }: { service: ServicePageType }) {
  const { t, lang, isRTL } = useLanguage();
  const p = t.uae_pages?.[service];

  if (!p) return null;

  const crossSellItems: CrossSellItem[] = [
    { title: p.cross_gv_title, description: p.cross_gv_desc, icon: Shield, href: `/${lang}/uae/golden-visa/`, isHighlighted: true },
    { title: p.cross_company_title, description: p.cross_company_desc, icon: Building2, href: `/${lang}/uae/company-registration/` },
    { title: p.cross_property_title, description: p.cross_property_desc, icon: Home, href: `/${lang}/uae/buy-property/` },
  ];

  return (
    <div className="min-h-screen bg-background" dir={isRTL ? "rtl" : "ltr"}>
      <Navbar />
      <main className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
        {/* Hero */}
        <section className="mb-12 text-center">
          <span className="inline-block mb-4 text-4xl">🇦🇪</span>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">{p.h1}</h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground mb-6">{p.intro}</p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            {p.price && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-4 py-1.5 font-medium text-primary">
                <DollarSign className="h-4 w-4" /> {p.price}
              </span>
            )}
            {p.processing && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-4 py-1.5 font-medium">
                <Clock className="h-4 w-4" /> {p.processing}
              </span>
            )}
            {p.duration && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-4 py-1.5 font-medium">
                <Calendar className="h-4 w-4" /> {p.duration}
              </span>
            )}
          </div>
          {p.visa_info && (
            <p className="mt-4 text-sm font-medium text-primary bg-primary/5 inline-block rounded-lg px-4 py-2">{p.visa_info}</p>
          )}
        </section>

        {/* Categories / Types */}
        {(p.categories || p.types || p.areas) && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">{p.categories_title || p.types_title || p.areas_title}</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {(p.categories || p.types || p.areas)?.map((item: any, i: number) => (
                <div key={i} className="rounded-xl border border-border bg-card p-5">
                  <h3 className="font-semibold text-lg mb-1">{item.name}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{item.desc}</p>
                  {item.price && <p className="text-sm font-medium text-primary">{item.price}</p>}
                  {item.range && <p className="text-sm font-medium text-primary">{item.range}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Requirements */}
        {p.requirements && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">{p.requirements_title}</h2>
            <ul className="space-y-3">
              {p.requirements.map((req: string, i: number) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Steps */}
        {p.steps && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">{p.steps_title}</h2>
            <ol className="space-y-4">
              {p.steps.map((step: string, i: number) => (
                <li key={i} className="flex items-start gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                    {i + 1}
                  </span>
                  <span className="pt-1">{step}</span>
                </li>
              ))}
            </ol>
          </section>
        )}

        {/* CTA */}
        <section className="text-center">
          <a
            href="https://wa.me/971562009131"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-navy text-gold px-8 py-3 text-lg font-semibold shadow-lg transition hover:bg-navy-lt"
          >
            {p.cta}
          </a>
        </section>
      </main>
      {p.cross_sell_title && (
        <SharedCrossSell items={crossSellItems} title={p.cross_sell_title} />
      )}
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
