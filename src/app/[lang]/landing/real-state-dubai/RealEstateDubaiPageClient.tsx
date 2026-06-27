"use client";

import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import {
  Sparkles, Check, ArrowRight, MapPin, Building2, Ruler, Home, Users, Calculator,
  Repeat, Award, Palmtree, Scale, Landmark, FileText, ShieldCheck, Languages, Globe,
  ClipboardCheck, Ban, Target, Search, CreditCard, Phone, MessageCircle, AlertTriangle,
  type LucideIcon,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import TeamSection from "@/components/TeamSection";
import MediaImage from "@/components/MediaImage";
import LandingLeadForm from "@/components/landing/LandingLeadForm";
import LeadFormModal from "@/components/landing/LeadFormModal";
import SharedStatsStrip from "@/components/shared/SharedStatsStrip";
import SharedHowItWorks from "@/components/shared/SharedHowItWorks";
import SharedFAQ from "@/components/shared/SharedFAQ";

const WA = "https://wa.me/971562009131";
const HERO_BG = "linear-gradient(135deg,#0E2266 0%,#1A3FA0 55%,#2851C4 100%)";
const DEST_IMG = ["/images/ru/uae-dubai.jpg", "/images/ru/oman-muscat.jpg", "/images/ru/turkey-istanbul.jpg"];

const GOAL_ICONS: LucideIcon[] = [Building2, Ruler, Home, Users, Calculator, Repeat];
const PRICE_ICONS: LucideIcon[] = [Building2, Ruler, Home, Award, Palmtree, Users];
const TOPIC_ICONS: LucideIcon[] = [Building2, Ruler, Scale, Landmark, FileText, ShieldCheck];
const WHY_ICONS: LucideIcon[] = [Languages, Globe, ClipboardCheck, Ban, Calculator, Sparkles];
const STEP_ICONS: LucideIcon[] = [Target, CreditCard, Globe, Users, Phone];
const PROCESS_ICONS: LucideIcon[] = [Target, Search, Calculator, FileText, ArrowRight];

function SectionHead({ tag, h2, sub, light }: { tag: string; h2: string; sub: string; light?: boolean }) {
  return (
    <div className="max-w-2xl mx-auto text-center mb-12">
      <span className="inline-flex items-center gap-2 justify-center text-xs font-bold text-gold-dk uppercase tracking-wider mb-3">
        <Sparkles className="w-3.5 h-3.5" /> {tag}
      </span>
      <h2 className={`text-[28px] md:text-[32px] font-bold ${light ? "text-white" : "text-ink"}`}>{h2}</h2>
      <p className={`mt-3 text-[15px] leading-relaxed ${light ? "text-white/70" : "text-muted-foreground"}`}>{sub}</p>
    </div>
  );
}

const fade = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.12 },
};

export default function RealEstateDubaiPageClient() {
  const { t, isRTL } = useLanguage();
  const u = t.realEstateDubai;
  const [leadOpen, setLeadOpen] = useState(false);
  const openLead = () => setLeadOpen(true);

  const dir = isRTL ? "rtl" : "ltr";

  return (
    <div className="min-h-screen bg-background" style={{ direction: dir }}>
      <Navbar />

      {/* Hero */}
      <header className="relative overflow-hidden text-white" style={{ background: HERO_BG }}>
        <div className="max-w-6xl mx-auto px-4 py-16 md:py-24">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/15 rounded-full px-4 py-2 text-sm font-medium mb-7">
            <MapPin className="w-4 h-4" /> {u.hero.pill}
          </div>
          <div className="grid lg:grid-cols-[1.25fr_1fr] gap-10 lg:gap-12 items-start">
            <div>
              <h1 className="text-[32px] md:text-[42px] font-extrabold leading-tight max-w-xl">{u.hero.h1}</h1>
              <p className="text-base md:text-[17px] text-white/75 max-w-lg leading-relaxed mt-5">{u.hero.sub}</p>
              <div className="grid sm:grid-cols-2 gap-x-7 gap-y-3 mt-8 max-w-xl">
                {u.hero.bullets.map((b: string, i: number) => (
                  <span key={i} className="flex items-start gap-2 text-sm font-medium text-white/90">
                    <span className="w-[18px] h-[18px] rounded-full bg-green-500/25 text-green-300 flex items-center justify-center text-[11px] shrink-0 mt-0.5">
                      <Check className="w-3 h-3" />
                    </span>
                    {b}
                  </span>
                ))}
              </div>
              <div className="flex flex-wrap gap-3 mt-9">
                <button onClick={openLead} className="inline-flex items-center gap-2 bg-[#FBF6E8] text-navy font-bold px-6 py-3.5 rounded-xl text-sm hover:-translate-y-0.5 transition-transform">
                  {u.hero.cta_options} <ArrowRight className={`w-4 h-4 ${isRTL ? "rotate-180" : ""}`} />
                </button>
                <a href={WA} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-green-500 text-white font-bold px-6 py-3.5 rounded-xl text-sm hover:-translate-y-0.5 transition-transform">
                  <MessageCircle className="w-4 h-4" /> {u.hero.cta_whatsapp}
                </a>
              </div>
            </div>

            {/* AI advisor card — opens the lead form on interaction */}
            <div className="bg-white rounded-2xl p-6 md:p-7 shadow-2xl text-start">
              <div className="inline-flex items-center gap-1.5 bg-[#F0F2FB] text-navy px-3 py-1.5 rounded-full text-xs font-bold mb-4">
                <Sparkles className="w-3.5 h-3.5" /> {u.hero.advisor.pill}
              </div>
              <h3 className="text-lg font-bold text-ink mb-2">{u.hero.advisor.h3}</h3>
              <p className="text-[13.5px] text-muted-foreground leading-relaxed mb-4">{u.hero.advisor.p}</p>
              <button
                onClick={openLead}
                className="w-full text-start border border-border rounded-xl px-4 py-3 text-[13.5px] text-muted-foreground bg-[#FAFBFD] mb-4 hover:border-navy/40 transition-colors"
              >
                {u.hero.advisor.placeholder}
              </button>
              <div className="text-xs font-bold text-muted-foreground mb-2.5">{u.hero.advisor.questions_label}</div>
              <div className="flex flex-col gap-2">
                {u.hero.advisor.questions.map((q: string, i: number) => (
                  <button
                    key={i}
                    onClick={openLead}
                    className="text-start bg-surface border border-border text-navy px-3.5 py-2.5 rounded-lg text-[13px] font-semibold hover:bg-[#EEF1FA] transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Stat strip */}
      <SharedStatsStrip
        variant="light"
        stats={u.stats.items.map((s: any) => ({ value: s.display, display: s.display, label: s.label }))}
      />

      {/* Goal cards */}
      <motion.section {...fade} id="goals" className="py-16 md:py-20" style={{ direction: dir }}>
        <div className="max-w-6xl mx-auto px-4">
          <SectionHead tag={u.goals.tag} h2={u.goals.h2} sub={u.goals.sub} />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {u.goals.cards.map((c: any, i: number) => {
              const Icon = GOAL_ICONS[i] ?? Building2;
              return (
                <div key={i} className="bg-surface border border-border rounded-2xl p-7 hover:-translate-y-1 hover:border-navy-lt transition-all">
                  <div className="w-12 h-12 rounded-xl bg-[#EEF1FB] text-navy flex items-center justify-center mb-4"><Icon className="w-6 h-6" /></div>
                  <h3 className="text-[17px] font-bold text-ink mb-2">{c.title}</h3>
                  <p className="text-[13.5px] text-muted-foreground leading-relaxed mb-4">{c.desc}</p>
                  <button onClick={openLead} className="text-[13px] font-bold text-navy inline-flex items-center gap-1.5">
                    {c.cta} <ArrowRight className={`w-3.5 h-3.5 ${isRTL ? "rotate-180" : ""}`} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* Destinations */}
      <motion.section {...fade} className="py-16 md:py-20 bg-white" style={{ direction: dir }}>
        <div className="max-w-6xl mx-auto px-4">
          <SectionHead tag={u.destinations.tag} h2={u.destinations.h2} sub={u.destinations.sub} />
          <div className="grid md:grid-cols-3 gap-6">
            {u.destinations.cards.map((c: any, i: number) => (
              <div key={i} className="bg-surface border border-border rounded-2xl overflow-hidden shadow-sm">
                <div className="relative h-44">
                  <MediaImage src={DEST_IMG[i]} alt={c.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/60 to-transparent" />
                  {c.badge ? <span className="absolute top-3.5 start-3.5 bg-gold text-navy text-[11px] font-extrabold px-3 py-1 rounded-full">{c.badge}</span> : null}
                </div>
                <div className="p-6">
                  <h3 className="text-[19px] font-bold text-ink mb-2.5">{c.name}</h3>
                  <p className="text-[13.5px] text-muted-foreground leading-relaxed mb-4">{c.desc}</p>
                  <div className="flex flex-col gap-2 mb-5">
                    {c.tags.map((tag: string, j: number) => (
                      <span key={j} className="flex items-center gap-2 text-[13px] font-medium text-ink">
                        <span className="w-4 h-4 rounded-full bg-green-500/15 text-green-600 flex items-center justify-center text-[9px] shrink-0"><Check className="w-2.5 h-2.5" /></span>
                        {tag}
                      </span>
                    ))}
                  </div>
                  <button onClick={openLead} className="text-[13.5px] font-bold text-navy inline-flex items-center gap-1.5">
                    {c.cta} <ArrowRight className={`w-3.5 h-3.5 ${isRTL ? "rotate-180" : ""}`} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Comparison */}
      <motion.section {...fade} id="compare" className="py-16 md:py-20" style={{ background: HERO_BG }}>
        <div className="max-w-5xl mx-auto px-4" style={{ direction: dir }}>
          <SectionHead tag={u.compare.tag} h2={u.compare.h2} sub={u.compare.sub} light />
          <div className="grid sm:grid-cols-2 gap-4 max-w-3xl mx-auto mb-8">
            {[{ img: DEST_IMG[0], label: u.compare.dubai_label }, { img: DEST_IMG[1], label: u.compare.muscat_label }].map((p, i) => (
              <div key={i} className="relative h-40 rounded-2xl overflow-hidden">
                <MediaImage src={p.img} alt={p.label} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-navy/30" />
                <span className="absolute bottom-3 start-3 bg-white/95 text-ink text-[13px] font-extrabold px-3 py-1.5 rounded-lg">{p.label}</span>
              </div>
            ))}
          </div>
          <div className="bg-white/[0.06] border border-white/15 rounded-2xl overflow-hidden max-w-4xl mx-auto">
            <div className="grid grid-cols-[1.2fr_1fr_1fr] bg-white/10">
              {[u.compare.head.criteria, u.compare.head.uae, u.compare.head.oman].map((h: string, i: number) => (
                <div key={i} className="px-4 md:px-6 py-4 font-extrabold text-sm text-white">{h}</div>
              ))}
            </div>
            {u.compare.rows.map((r: any, i: number) => (
              <div key={i} className="grid grid-cols-[1.2fr_1fr_1fr] border-t border-white/10">
                <div className="px-4 md:px-6 py-4 text-[13px] font-bold text-white/60">{r.label}</div>
                <div className="px-4 md:px-6 py-4 text-[13px] text-white/90">{r.uae}</div>
                <div className="px-4 md:px-6 py-4 text-[13px] text-white/90">{r.oman}</div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <button onClick={openLead} className="inline-flex items-center gap-2 bg-gold text-navy font-bold px-6 py-3.5 rounded-xl text-sm hover:-translate-y-0.5 transition-transform">
              {u.compare.cta} <ArrowRight className={`w-4 h-4 ${isRTL ? "rotate-180" : ""}`} />
            </button>
          </div>
        </div>
      </motion.section>

      {/* Pricing */}
      <motion.section {...fade} id="pricing" className="py-16 md:py-20" style={{ direction: dir }}>
        <div className="max-w-6xl mx-auto px-4">
          <SectionHead tag={u.pricing.tag} h2={u.pricing.h2} sub={u.pricing.sub} />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {u.pricing.cards.map((c: any, i: number) => {
              const Icon = PRICE_ICONS[i] ?? Building2;
              return (
                <div key={i} className="bg-surface border border-border rounded-2xl p-6 flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-gold-lt text-gold-dk flex items-center justify-center shrink-0"><Icon className="w-5 h-5" /></div>
                  <div>
                    <div className="text-sm font-bold text-ink mb-1">{c.name}</div>
                    <div className="text-[12.5px] text-muted-foreground">{c.note}</div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="text-center mt-9">
            <button onClick={openLead} className="inline-flex items-center gap-2 bg-navy text-white font-bold px-6 py-3.5 rounded-xl text-sm hover:-translate-y-0.5 transition-transform">
              {u.form.cta} <ArrowRight className={`w-4 h-4 ${isRTL ? "rotate-180" : ""}`} />
            </button>
          </div>
        </div>
      </motion.section>

      {/* Finder / stepper */}
      <motion.section {...fade} className="py-12 md:py-16" style={{ direction: dir }}>
        <div className="max-w-6xl mx-auto px-4">
          <div className="rounded-3xl p-8 md:p-12 text-white" style={{ background: HERO_BG }}>
            <div className="grid lg:grid-cols-2 gap-10 items-center">
              <div>
                <span className="inline-flex items-center gap-2 text-xs font-bold text-gold uppercase tracking-wider mb-3">
                  <Target className="w-3.5 h-3.5" /> {u.finder.tag}
                </span>
                <h2 className="text-[26px] md:text-[30px] font-bold mb-3">{u.finder.h2}</h2>
                <p className="text-white/70 leading-relaxed mb-6">{u.finder.sub}</p>
                <button onClick={openLead} className="inline-flex items-center gap-2 bg-[#FBF6E8] text-navy font-bold px-6 py-3.5 rounded-xl text-sm hover:-translate-y-0.5 transition-transform">
                  {u.finder.cta} <ArrowRight className={`w-4 h-4 ${isRTL ? "rotate-180" : ""}`} />
                </button>
              </div>
              <div>
                <div className="flex">
                  {u.finder.steps.map((label: string, i: number) => {
                    const Icon = STEP_ICONS[i] ?? Target;
                    return (
                      <div key={i} className="flex flex-col items-center gap-2 flex-1">
                        <span className={`w-9 h-9 rounded-full flex items-center justify-center border ${i === 0 ? "bg-gold text-navy border-gold" : "bg-navy text-white border-white/20"}`}>
                          <Icon className="w-4 h-4" />
                        </span>
                        <span className={`text-[11px] font-semibold ${i === 0 ? "text-white" : "text-white/60"}`}>{label}</span>
                      </div>
                    );
                  })}
                </div>
                <div className="bg-white/[0.08] border border-white/15 rounded-xl p-4 text-[12.5px] text-white/75 leading-relaxed mt-5">
                  {u.finder.note}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Process (shared) */}
      <SharedHowItWorks
        variant="cards"
        title={u.process.h2}
        subtitle={u.process.sub}
        steps={u.process.steps.map((s: any, i: number) => ({
          number: i + 1,
          title: s.title,
          description: s.description,
          icon: PROCESS_ICONS[i] ?? Target,
        }))}
      />

      {/* Topics */}
      <motion.section {...fade} className="py-16 md:py-20 bg-white" style={{ direction: dir }}>
        <div className="max-w-6xl mx-auto px-4">
          <SectionHead tag={u.topics.tag} h2={u.topics.h2} sub={u.topics.sub} />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {u.topics.cards.map((c: any, i: number) => {
              const Icon = TOPIC_ICONS[i] ?? Building2;
              return (
                <div key={i} className="bg-surface border border-border rounded-2xl p-5">
                  <div className="w-10 h-10 rounded-lg bg-[#EEF1FB] text-navy flex items-center justify-center mb-3.5"><Icon className="w-5 h-5" /></div>
                  <h4 className="text-[14.5px] font-bold text-ink mb-1.5">{c.title}</h4>
                  <p className="text-[12.5px] text-muted-foreground leading-relaxed">{c.desc}</p>
                </div>
              );
            })}
          </div>
          <div className="text-center">
            <button onClick={openLead} className="inline-flex items-center gap-2 bg-navy text-white font-bold px-6 py-3.5 rounded-xl text-sm hover:-translate-y-0.5 transition-transform">
              {u.topics.cta} <ArrowRight className={`w-4 h-4 ${isRTL ? "rotate-180" : ""}`} />
            </button>
          </div>
        </div>
      </motion.section>

      {/* Why us */}
      <motion.section {...fade} className="py-16 md:py-20" style={{ direction: dir }}>
        <div className="max-w-6xl mx-auto px-4">
          <SectionHead tag={u.why.tag} h2={u.why.h2} sub={u.why.sub} />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {u.why.cards.map((c: any, i: number) => {
              const Icon = WHY_ICONS[i] ?? ShieldCheck;
              return (
                <div key={i} className="bg-surface border border-border rounded-2xl p-6">
                  <div className="w-10 h-10 rounded-lg bg-[#EEF1FB] text-navy flex items-center justify-center mb-4"><Icon className="w-5 h-5" /></div>
                  <h3 className="text-[15.5px] font-bold text-ink mb-2">{c.title}</h3>
                  <p className="text-[13px] text-muted-foreground leading-relaxed">{c.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* Team (shared, real photos) */}
      <TeamSection />

      {/* Transparency */}
      <motion.section {...fade} className="py-12 md:py-16" style={{ direction: dir }}>
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-gold-lt border border-gold/40 rounded-2xl p-8 md:p-10">
            <div className="flex items-center gap-2.5 mb-5">
              <AlertTriangle className="w-5 h-5 text-gold-dk" />
              <h3 className="text-lg font-bold text-ink">{u.transparency.title}</h3>
            </div>
            <ul className="flex flex-col gap-3 mb-5">
              {u.transparency.items.map((item: string, i: number) => (
                <li key={i} className="flex gap-3 text-sm text-ink leading-relaxed">
                  <span className="w-[18px] h-[18px] rounded-full bg-green-500/18 text-green-600 flex items-center justify-center text-[10px] shrink-0 mt-0.5"><Check className="w-3 h-3" /></span>
                  {item}
                </li>
              ))}
            </ul>
            <p className="text-[12.5px] text-muted-foreground leading-relaxed border-t border-gold/40 pt-4">{u.transparency.note}</p>
          </div>
        </div>
      </motion.section>

      {/* FAQ (shared) */}
      <SharedFAQ title={u.faq.h2} items={u.faq.items} />

      {/* Final lead form */}
      <motion.section {...fade} id="contact" className="py-16 md:py-20" style={{ background: HERO_BG, direction: dir }}>
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-[28px] md:text-[32px] font-bold text-gold mb-3">{u.form.cta_title}</h2>
          <p className="text-white/75 mb-8 max-w-xl mx-auto">{u.form.cta_sub}</p>
          <div className="bg-white/5 rounded-3xl p-6 md:p-8 border border-gold/20">
            <LandingLeadForm sourceSlug="landing/real-state-dubai" strings={u.form} />
          </div>
        </div>
      </motion.section>

      <WhatsAppFloat />
      <Footer />
      <LeadFormModal open={leadOpen} onOpenChange={setLeadOpen} sourceSlug="landing/real-state-dubai" strings={u.form} />
    </div>
  );
}
