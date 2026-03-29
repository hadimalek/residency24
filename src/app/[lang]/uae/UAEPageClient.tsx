"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { Star, Building2, Home, Plane, Shield, CheckCircle, MapPin, Clock, DollarSign } from "lucide-react";

const iconMap: Record<string, React.FC<{ className?: string }>> = {
  star: Star,
  building2: Building2,
  home: Home,
  plane: Plane,
  shield: Shield,
};

function ServiceCard({ name, href, icon, price, desc, lang }: { name: string; href: string; icon: string; price: string; desc: string; lang: string }) {
  const Icon = iconMap[icon] || Star;
  return (
    <a href={href} className="group block rounded-2xl border border-border bg-card p-6 shadow-sm transition hover:shadow-md hover:border-primary/30">
      <div className="mb-3 flex items-center gap-3">
        <div className="rounded-lg bg-primary/10 p-2"><Icon className="h-5 w-5 text-primary" /></div>
        <h3 className="text-lg font-semibold">{name}</h3>
      </div>
      <p className="text-sm text-muted-foreground mb-3">{desc}</p>
      <p className="text-sm font-medium text-primary">{price}</p>
    </a>
  );
}

export default function UAEPageClient() {
  const { t, lang, isRTL } = useLanguage();
  const p = t.uae_pages?.landing;
  const countries = t.countries?.items?.find((c: any) => c.id === "uae");

  if (!p) return null;

  const services = countries?.services || [];

  return (
    <div className="min-h-screen bg-background" dir={isRTL ? "rtl" : "ltr"}>
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
        {/* Hero */}
        <section className="mb-16 text-center">
          <span className="inline-block mb-4 text-4xl">🇦🇪</span>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">{p.h1}</h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">{p.intro}</p>
        </section>

        {/* Services Grid */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-8 text-center">{p.services_title}</h2>
          <div className="grid gap-6 sm:grid-cols-2">
            {services.map((s: any, i: number) => (
              <ServiceCard key={i} name={s.name} href={s.href} icon={["star", "building2", "home", "plane"][i] || "star"} price={s.price} desc={countries?.tagline || ""} lang={lang} />
            ))}
          </div>
        </section>

        {/* Why UAE */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-8 text-center">{p.why_title}</h2>
          <div className="grid gap-6 sm:grid-cols-2">
            {p.why_items?.map((item: any, i: number) => (
              <div key={i} className="rounded-xl border border-border bg-card p-6">
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="text-center">
          <a
            href={`https://wa.me/971562009131`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3 text-lg font-semibold text-primary-foreground shadow-lg transition hover:opacity-90"
          >
            {p.cta}
          </a>
        </section>
      </main>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
