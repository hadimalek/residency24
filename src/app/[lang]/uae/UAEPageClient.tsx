"use client";

import type { Lang } from "@/translations";
import { useLanguage } from "@/contexts/LanguageContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { motion } from "framer-motion";
import { Star, Building2, Home, Plane, Shield, ChevronDown } from "lucide-react";
import { useState } from "react";

const iconMap: Record<string, React.ReactNode> = {
  star: <Star size={20} className="text-gold" />,
  building2: <Building2 size={20} className="text-gold" />,
  home: <Home size={20} className="text-gold" />,
  plane: <Plane size={20} className="text-gold" />,
  shield: <Shield size={20} className="text-gold" />,
};

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-4 text-start hover:bg-muted/30 transition-colors"
      >
        <span className="text-[15px] font-medium text-navy">{q}</span>
        <ChevronDown
          size={18}
          className={`text-muted-foreground shrink-0 ms-2 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="px-4 pb-4 text-[14px] text-muted-foreground leading-relaxed">
          {a}
        </div>
      )}
    </div>
  );
}

export default function UAEPageClient({ lang }: { lang: Lang }) {
  const { t } = useLanguage();
  const p = t.uaePage;

  if (!p) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative bg-navy text-white pt-28 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-navy via-navy to-[#0a1628] opacity-95" />
        <div className="relative max-w-5xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="inline-block text-4xl mb-4">🇦🇪</span>
            <h1 className="text-[32px] md:text-[40px] font-bold mb-3">{p.title}</h1>
            <p className="text-[16px] text-white/70 max-w-[640px] mx-auto mb-8">{p.subtitle}</p>
            <div className="flex flex-wrap justify-center gap-3">
              {p.highlights.map((h: any, i: number) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-[13px] font-medium"
                >
                  {iconMap[h.icon] || <Star size={16} className="text-gold" />}
                  {h.label}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Intro */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <p className="text-[15px] text-muted-foreground leading-relaxed text-center">{p.intro}</p>
        </div>
      </section>

      {/* Services */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-[28px] font-bold text-navy text-center mb-10">{p.services_title}</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {p.services.map((s: any, i: number) => (
              <motion.a
                key={s.id}
                href={s.href}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-white border border-border rounded-xl p-5 hover:border-navy hover:-translate-y-1 transition-all duration-200 block relative"
              >
                {s.tag && (
                  <span className="absolute top-3 end-3 text-[10px] bg-gold/20 text-gold-dk font-semibold px-2 py-0.5 rounded">
                    {s.tag}
                  </span>
                )}
                <div className="w-10 h-10 rounded-full bg-navy flex items-center justify-center mb-3">
                  {iconMap[s.icon] || <Star size={20} className="text-gold" />}
                </div>
                <h3 className="text-[16px] font-semibold text-navy mb-1">{s.name}</h3>
                <p className="text-[13px] text-muted-foreground mb-3">{s.desc}</p>
                <p className="text-sm text-gold font-semibold">{s.price}</p>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* Why UAE */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-[28px] font-bold text-navy text-center mb-10">{p.why_title}</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {p.why_items.map((item: any, i: number) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="border border-border rounded-xl p-5"
              >
                <h3 className="text-[15px] font-semibold text-navy mb-2">{item.title}</h3>
                <p className="text-[13px] text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-[28px] font-bold text-navy text-center mb-10">{p.faq_title}</h2>
          <div className="space-y-3">
            {p.faqs.map((faq: any, i: number) => (
              <FAQItem key={i} q={faq.q} a={faq.a} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-navy text-white text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-[28px] font-bold mb-3">{p.cta_title}</h2>
          <p className="text-[15px] text-white/70 mb-8">{p.cta_desc}</p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="https://wa.me/971562009131"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white font-semibold px-6 py-3 rounded-full transition-colors"
            >
              {p.cta_wa}
            </a>
            <a
              href={`/${lang}/#lead`}
              className="inline-flex items-center gap-2 bg-gold hover:bg-gold/90 text-navy font-semibold px-6 py-3 rounded-full transition-colors"
            >
              {p.cta_button}
            </a>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
