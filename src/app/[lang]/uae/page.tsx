"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { Shield, Globe, Zap, Users, Star, Building2, Home, Plane, ChevronRight } from "lucide-react";
import Link from "next/link";

const ICONS: Record<string, React.ElementType> = { shield: Shield, globe: Globe, zap: Zap, users: Users, star: Star, building2: Building2, home: Home, plane: Plane };

export default function UAEPage() {
  const { t, isRTL } = useLanguage();
  const p = t.uae_page;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Breadcrumb */}
      <nav className="max-w-6xl mx-auto px-4 pt-24 pb-2 text-sm text-muted-foreground" aria-label="Breadcrumb">
        <ol className="flex items-center gap-1">
          <li><Link href={`/${t.dir === "rtl" ? "fa" : "en"}/`} className="hover:text-foreground">{p.breadcrumb_home}</Link></li>
          <li><ChevronRight className={`w-3 h-3 ${isRTL ? "rotate-180" : ""}`} /></li>
          <li className="text-foreground font-medium">{p.breadcrumb_uae}</li>
        </ol>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 py-16 text-center">
        <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">{p.hero_badge}</span>
        <h1 className="text-3xl md:text-5xl font-bold mb-4">{p.hero_h1}</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">{p.hero_sub}</p>
        <a href="https://wa.me/971562009131" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-medium hover:opacity-90 transition">
          {p.hero_cta}
        </a>
      </section>

      {/* Why UAE */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">{p.why_title}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {p.why_items.map((item: any, i: number) => {
            const Icon = ICONS[item.icon] || Shield;
            return (
              <div key={i} className="rounded-2xl border bg-card p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Services */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">{p.services_title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {p.services.map((svc: any) => {
            const Icon = ICONS[svc.icon] || Star;
            return (
              <Link key={svc.id} href={svc.href} className="group rounded-2xl border bg-card p-6 hover:border-primary/50 hover:shadow-lg transition">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-lg">{svc.title}</h3>
                      {svc.tag && <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">{svc.tag}</span>}
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{svc.desc}</p>
                    <p className="text-sm font-semibold text-primary">{svc.price}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {svc.features.map((f: string, i: number) => (
                    <span key={i} className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">{f}</span>
                  ))}
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-6">{p.cta_title}</h2>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a href="https://wa.me/971562009131" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-green-600 text-white font-medium hover:bg-green-700 transition">
            {p.cta_wa}
          </a>
        </div>
      </section>

      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
