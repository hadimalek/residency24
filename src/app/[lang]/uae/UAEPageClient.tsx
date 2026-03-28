"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import ContactBar from "@/components/ContactBar";
import { useLanguage } from "@/contexts/LanguageContext";
import { Shield, Star, Building2, Plane } from "lucide-react";

const iconMap: Record<string, React.FC<{ className?: string }>> = {
  shield: Shield,
  star: Star,
  building2: Building2,
  plane: Plane,
};

export default function UAEPageClient() {
  const { t, isRTL } = useLanguage();
  const page = t.uae_page?.country;
  const countryData = t.countries?.items?.find((c: any) => c.id === "uae");

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
        </div>
      </section>

      {/* Why UAE */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">{page.why_title}</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {page.why_items?.map((item: any, i: number) => {
              const Icon = iconMap[item.icon] || Shield;
              return (
                <div key={i} className="p-6 rounded-2xl border bg-card hover:shadow-lg transition-shadow">
                  <Icon className="w-8 h-8 mb-4 text-amber-600" />
                  <h3 className="font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-16 px-4 bg-muted/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">{page.services_title}</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {countryData?.services?.map((svc: any, i: number) => (
              <a key={i} href={svc.href} className="block p-6 rounded-2xl border bg-card hover:shadow-lg transition-shadow">
                <h3 className="font-semibold mb-2">{svc.name}</h3>
                <p className="text-sm text-amber-600 font-medium">{svc.price}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

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
