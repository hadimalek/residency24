"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import ContactBar from "@/components/ContactBar";
import SharedCrossSell from "@/components/shared/SharedCrossSell";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import { Briefcase, MapPin, Phone, Mail, CheckCircle, Globe, Building2, Handshake, ChevronRight, Shield, Home, Plane } from "lucide-react";
import type { CrossSellItem } from "@/components/shared/SharedCrossSell";

export default function AboutPageClient() {
  const { t, isRTL, lang } = useLanguage();
  const a = t.about;

  const crossSellItems: CrossSellItem[] = [
    { title: a.cross_gv_title, description: a.cross_gv_desc, icon: Shield, href: `/${lang}/uae/golden-visa/`, isHighlighted: true },
    { title: a.cross_company_title, description: a.cross_company_desc, icon: Building2, href: `/${lang}/uae/company-registration/` },
    { title: a.cross_property_title, description: a.cross_property_desc, icon: Home, href: `/${lang}/uae/buy-property/` },
    { title: a.cross_tourist_title, description: a.cross_tourist_desc, icon: Plane, href: `/${lang}/uae/tourist-visa/` },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Breadcrumb */}
      <div className="bg-white border-b border-border" style={{ direction: isRTL ? "rtl" : "ltr" }}>
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-2 text-sm text-muted-foreground">
          <a href={`/${lang}/`} className="hover:text-navy transition-colors">{a.breadcrumb_home}</a>
          <ChevronRight size={14} className={isRTL ? "rotate-180" : ""} />
          <span className="text-navy font-medium">{a.hero.h1.split("—")[0].trim()}</span>
        </div>
      </div>

      {/* 1. Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="py-20 bg-navy"
        style={{ direction: isRTL ? "rtl" : "ltr" }}
      >
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-[clamp(28px,5.5vw,48px)] font-bold text-white leading-tight mb-6">
            {a.hero.h1}
          </h1>
          <p className="text-[16px] text-white/80 leading-relaxed max-w-3xl mx-auto">
            {a.hero.p}
          </p>
        </div>
      </motion.section>

      {/* 2. Our Story */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.12 }}
        className="py-20 bg-white"
        style={{ direction: isRTL ? "rtl" : "ltr" }}
      >
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-[36px] font-bold text-navy mb-6 text-center">{a.story.h2}</h2>
          <p className="text-[15px] text-muted-foreground leading-relaxed mb-4">{a.story.p1}</p>
          <p className="text-[15px] text-muted-foreground leading-relaxed">
            {a.story.p2.split(a.story.link_text)[0]}
            <a
              href={`/${lang}/international-company-registration/`}
              className="text-navy font-medium underline hover:text-gold transition-colors"
            >
              {a.story.link_text}
            </a>
            {a.story.p2.split(a.story.link_text)[1] || ""}
          </p>
        </div>
      </motion.section>

      {/* 3. Stats */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.12 }}
        className="py-16 bg-surface border-y border-border"
        style={{ direction: isRTL ? "rtl" : "ltr" }}
      >
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-[36px] font-bold text-navy mb-10 text-center">{a.stats.h2}</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 text-center">
            {a.stats.items.map((s: any, i: number) => (
              <div key={i} className="relative">
                <p className="text-[28px] font-bold text-navy">{s.num}</p>
                <p className="text-[13px] text-muted-foreground mt-1">{s.label}</p>
                {i < a.stats.items.length - 1 && (
                  <div className="hidden lg:block absolute end-0 top-1/2 -translate-y-1/2 w-px h-10 bg-border" />
                )}
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* 4. Team */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.12 }}
        className="py-20 bg-background"
        style={{ direction: isRTL ? "rtl" : "ltr" }}
      >
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-[36px] font-bold text-navy mb-12 text-center">{a.team.h2}</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {a.team.members.map((m: any, i: number) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                className="group relative bg-card rounded-2xl overflow-hidden border border-border hover:border-navy/40 hover:shadow-xl transition-all duration-300"
              >
                <div className="relative w-full aspect-[3/4] bg-navy overflow-hidden">
                  <img
                    src={m.photo}
                    alt={`${m.name} - ${m.title} - Residency24`}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    onError={(e) => {
                      const target = e.currentTarget;
                      target.style.display = "none";
                      const fallback = target.nextElementSibling as HTMLElement;
                      if (fallback) fallback.style.display = "flex";
                    }}
                  />
                  <div className="w-full h-full items-center justify-center" style={{ display: "none" }}>
                    <span className="text-gold font-bold text-4xl">
                      {m.name.split(" ").map((w: string) => w[0]).join("").slice(0, 2)}
                    </span>
                  </div>
                  <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-navy/80 to-transparent" />
                </div>
                <div className="p-5">
                  <h4 className="text-lg font-bold text-navy leading-tight">{m.name}</h4>
                  <p className="text-sm text-gold mt-1 flex items-center gap-1.5">
                    <Briefcase size={13} className="shrink-0" />
                    <span>{m.title}</span>
                  </p>
                  <p className="text-[13px] text-muted-foreground mt-3 leading-relaxed">{m.bio}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* 5. Offices */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.12 }}
        className="py-20 bg-white"
        style={{ direction: isRTL ? "rtl" : "ltr" }}
      >
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-[36px] font-bold text-navy mb-12 text-center">{a.offices.h2}</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {a.offices.items.map((office: any, i: number) => (
              <div
                key={i}
                className="bg-surface rounded-2xl border border-border p-6 hover:shadow-lg transition-shadow"
              >
                <h3 className="text-xl font-bold text-navy mb-4 flex items-center gap-2">
                  <Building2 size={20} className="text-gold" />
                  {office.city}
                </h3>
                <div className="space-y-2.5 text-[14px] text-muted-foreground">
                  <p className="flex items-start gap-2">
                    <MapPin size={16} className="text-navy shrink-0 mt-0.5" />
                    <span>{office.address}</span>
                  </p>
                  {office.phone ? (
                    <p className="flex items-center gap-2">
                      <Phone size={16} className="text-navy shrink-0" />
                      <a href={`tel:${office.phone.replace(/[^+\d]/g, "")}`} className="hover:text-navy transition-colors" dir="ltr">
                        {office.phone}
                      </a>
                    </p>
                  ) : (
                    // TODO: replace with actual Mashhad phone number
                    <p className="flex items-center gap-2 text-muted-foreground/50">
                      <Phone size={16} className="shrink-0" />
                      <span>—</span>
                    </p>
                  )}
                  <p className="flex items-center gap-2">
                    <Mail size={16} className="text-navy shrink-0" />
                    <a href={`mailto:${office.email}`} className="hover:text-navy transition-colors">{office.email}</a>
                  </p>
                </div>
                {office.services_label && (
                  <div className="mt-5 flex flex-wrap gap-2">
                    <a
                      href={`/${lang}/${office.services_link_suffix}`}
                      className="inline-flex items-center gap-1 text-sm font-medium text-navy bg-navy/5 hover:bg-navy/10 rounded-lg px-3 py-1.5 transition-colors"
                    >
                      {office.services_label}
                      <ChevronRight size={14} className={isRTL ? "rotate-180" : ""} />
                    </a>
                    {i === 0 && a.offices.oman_services_label && (
                      <a
                        href={`/${lang}/oman/`}
                        className="inline-flex items-center gap-1 text-sm font-medium text-navy bg-navy/5 hover:bg-navy/10 rounded-lg px-3 py-1.5 transition-colors"
                      >
                        {a.offices.oman_services_label}
                        <ChevronRight size={14} className={isRTL ? "rotate-180" : ""} />
                      </a>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* LICENSES SECTION — PLACEHOLDER */}
      {/* این بخش را وقتی اسکن مجوز DED دبی آماده شد فعال کنید */}
      {/* <section className="py-20 bg-surface">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-[36px] font-bold text-navy mb-12 text-center">Licenses</h2>
          TODO: Add scanned DED Dubai license images here
        </div>
      </section> */}

      {/* 6. Why Us */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.12 }}
        className="py-20 bg-surface"
        style={{ direction: isRTL ? "rtl" : "ltr" }}
      >
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-[36px] font-bold text-navy mb-12 text-center">{a.why.h2}</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {a.why.items.map((item: any, i: number) => {
              const Icon = item.icon === "check" ? CheckCircle : item.icon === "globe" ? Globe : item.icon === "building" ? Building2 : Handshake;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="bg-white rounded-2xl border border-border p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="w-10 h-10 rounded-xl bg-navy/5 flex items-center justify-center mb-4">
                    <Icon size={20} className="text-gold" />
                  </div>
                  <h3 className="text-lg font-bold text-navy mb-2">{item.title}</h3>
                  <p className="text-[14px] text-muted-foreground leading-relaxed">{item.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* 7. Related Services */}
      {a.cross_sell_title && (
        <SharedCrossSell items={crossSellItems} title={a.cross_sell_title} />
      )}

      {/* 8. CTA Final */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        className="py-20 bg-navy"
        style={{ direction: isRTL ? "rtl" : "ltr" }}
      >
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-[36px] font-bold text-white mb-4">{a.cta.h2}</h2>
          <p className="text-[16px] text-white/80 mb-8">{a.cta.p}</p>
          <a
            href={`/${lang}/contact/`}
            className="inline-block bg-gold text-navy font-semibold rounded-xl px-8 py-3.5 text-base hover:opacity-90 transition-opacity"
          >
            {a.cta.btn}
          </a>
        </div>
      </motion.section>

      <ContactBar />
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
