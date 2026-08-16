"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Sparkles, Check, ArrowRight, MapPin, Building2, Ruler, Home, Users, Calculator,
  Repeat, ShieldCheck, Languages, ClipboardCheck, Ban, Target, Search, FileText,
  CreditCard, MessageCircle, KeyRound, Landmark, Wallet, BadgeCheck, Clock, TrendingUp,
  ScrollText, HandCoins, type LucideIcon,
} from "lucide-react";
import dynamicImport from "next/dynamic";
import LandingHeader from "@/components/landing/LandingHeader";
import LandingFooter from "@/components/landing/LandingFooter";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import TeamSection from "@/components/TeamSection";
import MediaImage from "@/components/MediaImage";
import LandingLeadForm from "@/components/landing/LandingLeadForm";
import SharedStatsStrip from "@/components/shared/SharedStatsStrip";
import SharedHowItWorks from "@/components/shared/SharedHowItWorks";
import SharedFAQ from "@/components/shared/SharedFAQ";
import { CONTENT as C } from "./content";

const ChatModal = dynamicImport(() => import("@/components/ChatModal"), { ssr: false });
const LeadFormModal = dynamicImport(() => import("@/components/landing/LeadFormModal"), { ssr: false });

const WA = "https://wa.me/971562009131";
// Reuse the established landing gradient — no new colour tokens introduced.
const HERO_BG = "linear-gradient(135deg,#0E2266 0%,#1A3FA0 55%,#2851C4 100%)";
const IMG = (name: string) => `/images/ru/landing/${name}.jpg`;
const SOURCE_SLUG = "landing/real-state-dubai";

const GOAL_ICONS: LucideIcon[] = [TrendingUp, Building2, Home, Users, Calculator, KeyRound];
const WHY_ICONS: LucideIcon[] = [Languages, Target, ClipboardCheck, Ban, ShieldCheck, HandCoins];
const PROCESS_ICONS: LucideIcon[] = [Target, Search, ClipboardCheck, FileText, KeyRound];
const AREA_ICONS: LucideIcon[] = [Building2, Landmark, MapPin];
const COST_ICONS: LucideIcon[] = [ScrollText, FileText, BadgeCheck, HandCoins, CreditCard, Wallet];

const fade = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.12 },
};

function SectionHead({ tag, h2, sub, light }: { tag: string; h2: string; sub?: string; light?: boolean }) {
  return (
    <div className="max-w-2xl mx-auto text-center mb-12">
      <span className="inline-flex items-center gap-2 justify-center text-xs font-bold text-gold-dk uppercase tracking-wider mb-3">
        <Sparkles className="w-3.5 h-3.5" /> {tag}
      </span>
      <h2 className={`text-[28px] md:text-[32px] font-bold ${light ? "text-white" : "text-ink"}`}>{h2}</h2>
      {sub ? <p className={`mt-3 text-[15px] leading-relaxed ${light ? "text-white/70" : "text-muted-foreground"}`}>{sub}</p> : null}
    </div>
  );
}

export default function RealEstateDubaiPageClient() {
  const [leadOpen, setLeadOpen] = useState(false);
  const [leadMounted, setLeadMounted] = useState(false);
  const openLead = () => {
    setLeadMounted(true);
    setLeadOpen(true);
  };
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMounted, setChatMounted] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const openChat = (message = "") => {
    setChatMessage(message);
    setChatMounted(true);
    setChatOpen(true);
  };

  return (
    <div className="min-h-screen bg-background" style={{ direction: "ltr" }}>
      <LandingHeader />

      {/* 01 — Hero */}
      <header className="relative overflow-hidden text-white" style={{ background: HERO_BG }}>
        <div className="max-w-6xl mx-auto px-4 py-16 md:py-24">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/15 rounded-full px-4 py-2 text-sm font-medium mb-7">
            <MapPin className="w-4 h-4" /> {C.hero.pill}
          </div>
          <div className="grid lg:grid-cols-[1.25fr_1fr] gap-10 lg:gap-12 items-start">
            <div>
              <h1 className="text-[32px] md:text-[42px] font-extrabold leading-tight max-w-xl">{C.hero.h1}</h1>
              <p className="text-base md:text-[17px] text-white/75 max-w-lg leading-relaxed mt-5">{C.hero.sub}</p>
              <div className="grid sm:grid-cols-2 gap-x-7 gap-y-3 mt-8 max-w-xl">
                {C.hero.bullets.map((b, i) => (
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
                  {C.hero.cta_primary} <ArrowRight className="w-4 h-4" />
                </button>
                <a href={WA} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-green-500 text-white font-bold px-6 py-3.5 rounded-xl text-sm hover:-translate-y-0.5 transition-transform">
                  <MessageCircle className="w-4 h-4" /> {C.hero.cta_whatsapp}
                </a>
              </div>
              {/* Project thumbnails — proof of real inventory near the hero */}
              <div className="grid grid-cols-3 gap-3 mt-9 max-w-md">
                {C.projects.cards.slice(0, 3).map((p, i) => (
                  <div key={i} className="relative h-20 rounded-xl overflow-hidden border border-white/15">
                    <MediaImage src={IMG(p.img)} alt={p.name} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>

            {/* AI advisor card */}
            <div className="bg-white rounded-2xl p-6 md:p-7 shadow-2xl text-start">
              <div className="inline-flex items-center gap-1.5 bg-[#F0F2FB] text-navy px-3 py-1.5 rounded-full text-xs font-bold mb-4">
                <Sparkles className="w-3.5 h-3.5" /> {C.hero.advisor.pill}
              </div>
              <h3 className="text-lg font-bold text-ink mb-2">{C.hero.advisor.h3}</h3>
              <p className="text-[13.5px] text-muted-foreground leading-relaxed mb-4">{C.hero.advisor.p}</p>
              <button
                onClick={() => openChat()}
                className="w-full text-start border border-border rounded-xl px-4 py-3 text-[13.5px] text-muted-foreground bg-[#FAFBFD] mb-4 hover:border-navy/40 transition-colors"
              >
                {C.hero.advisor.placeholder}
              </button>
              <div className="text-xs font-bold text-muted-foreground mb-2.5">{C.hero.advisor.questions_label}</div>
              <div className="flex flex-col gap-2">
                {C.hero.advisor.questions.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => openChat(q)}
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

      {/* 02 — Trust strip */}
      <div className="border-b border-border bg-white">
        <div className="max-w-6xl mx-auto px-4 py-5 grid grid-cols-2 md:grid-cols-4 gap-4">
          {C.trust.map((item, i) => (
            <span key={i} className="flex items-center gap-2.5 text-[13px] font-semibold text-ink">
              <span className="w-6 h-6 rounded-full bg-[#EEF1FB] text-navy flex items-center justify-center shrink-0">
                <Check className="w-3.5 h-3.5" />
              </span>
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* Stat strip */}
      <SharedStatsStrip
        variant="light"
        stats={C.stats.map((s) => ({ value: s.display, display: s.display, label: s.label }))}
      />

      {/* 03 — Selected UAE projects */}
      <motion.section {...fade} id="projects" className="py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-4">
          <SectionHead tag={C.projects.tag} h2={C.projects.h2} sub={C.projects.sub} />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {C.projects.cards.map((p, i) => (
              <div key={i} className="bg-surface border border-border rounded-2xl overflow-hidden shadow-sm hover:-translate-y-1 hover:border-navy-lt transition-all flex flex-col">
                <div className="relative h-44">
                  <MediaImage src={IMG(p.img)} alt={p.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/50 to-transparent" />
                  <span className={`absolute top-3.5 start-3.5 text-[11px] font-extrabold px-3 py-1 rounded-full ${p.status === "Off-plan" ? "bg-gold text-navy" : "bg-white/95 text-ink"}`}>
                    {p.status}
                  </span>
                  <span className="absolute top-3.5 end-3.5 bg-white/90 text-navy text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full">
                    {p.developer}
                  </span>
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="text-[16px] font-bold text-ink mb-2">{p.name}</h3>
                  <div className="flex flex-col gap-1.5 text-[12.5px] text-muted-foreground mb-4">
                    <span className="inline-flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 shrink-0" /> {p.area}</span>
                    <span className="inline-flex items-center gap-1.5"><Ruler className="w-3.5 h-3.5 shrink-0" /> {p.type}</span>
                  </div>
                  <div className="mt-auto">
                    <div className="text-[15px] font-extrabold text-navy">{p.price}</div>
                    <div className="text-[12px] text-muted-foreground mb-3">{p.meta}</div>
                    <button onClick={openLead} className="text-[13px] font-bold text-navy inline-flex items-center gap-1.5">
                      {C.projects.cta} <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className="text-center text-[12.5px] text-muted-foreground mt-6 max-w-2xl mx-auto">{C.projects.note}</p>
        </div>
      </motion.section>

      {/* 04 — Property Match finder */}
      <motion.section {...fade} className="py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="rounded-3xl p-8 md:p-12 text-white" style={{ background: HERO_BG }}>
            <div className="grid lg:grid-cols-2 gap-10 items-center">
              <div>
                <span className="inline-flex items-center gap-2 text-xs font-bold text-gold uppercase tracking-wider mb-3">
                  <Target className="w-3.5 h-3.5" /> Подбор под вас
                </span>
                <h2 className="text-[26px] md:text-[30px] font-bold mb-3">Не уверены, что подходит именно вам?</h2>
                <p className="text-white/70 leading-relaxed mb-6">Ответьте на несколько вопросов о цели, формате покупки и бюджете — пришлём персональную подборку объектов. «Бюджет пока не определён» — тоже вариант.</p>
                <button onClick={openLead} className="inline-flex items-center gap-2 bg-[#FBF6E8] text-navy font-bold px-6 py-3.5 rounded-xl text-sm hover:-translate-y-0.5 transition-transform">
                  Получить персональную подборку <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              <div>
                <div className="flex">
                  {["Цель", "Тип", "Район", "Бюджет", "Контакт"].map((label, i) => {
                    const Icon = [Target, Home, MapPin, Calculator, MessageCircle][i];
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
                  Это предварительная подборка. Итоговые варианты зависят от актуального наличия, застройщика и условий на момент сделки.
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* 05 — Buy by goal */}
      <motion.section {...fade} id="goals" className="py-16 md:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <SectionHead tag={C.goals.tag} h2={C.goals.h2} sub={C.goals.sub} />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {C.goals.cards.map((c, i) => {
              const Icon = GOAL_ICONS[i] ?? Building2;
              return (
                <div key={i} className="bg-surface border border-border rounded-2xl p-7 hover:-translate-y-1 hover:border-navy-lt transition-all">
                  <div className="w-12 h-12 rounded-xl bg-[#EEF1FB] text-navy flex items-center justify-center mb-4"><Icon className="w-6 h-6" /></div>
                  <h3 className="text-[17px] font-bold text-ink mb-2">{c.title}</h3>
                  <p className="text-[13.5px] text-muted-foreground leading-relaxed mb-4">{c.desc}</p>
                  <button onClick={openLead} className="text-[13px] font-bold text-navy inline-flex items-center gap-1.5">
                    {c.cta} <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* 06 — Emirates & areas */}
      <motion.section {...fade} className="py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-4">
          <SectionHead tag={C.areas.tag} h2={C.areas.h2} sub={C.areas.sub} />
          <div className="grid md:grid-cols-3 gap-5">
            {C.areas.cards.map((a, i) => {
              const Icon = AREA_ICONS[i] ?? MapPin;
              return (
                <div key={i} className="bg-surface border border-border rounded-2xl p-7">
                  <div className="w-11 h-11 rounded-xl bg-[#EEF1FB] text-navy flex items-center justify-center mb-4"><Icon className="w-5 h-5" /></div>
                  <h3 className="text-[17px] font-bold text-ink mb-2">{a.name}</h3>
                  <p className="text-[13.5px] text-muted-foreground leading-relaxed">{a.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* 07 — Ready vs Off-plan */}
      <motion.section {...fade} className="py-16 md:py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <SectionHead tag={C.readyOffplan.tag} h2={C.readyOffplan.h2} sub={C.readyOffplan.sub} />
          <div className="grid md:grid-cols-2 gap-5">
            {[C.readyOffplan.ready, C.readyOffplan.offplan].map((col, i) => (
              <div key={i} className={`rounded-2xl p-7 border ${i === 0 ? "bg-surface border-border" : "bg-gold-lt border-gold/40"}`}>
                <div className="flex items-center gap-2.5 mb-5">
                  <span className={`w-10 h-10 rounded-xl flex items-center justify-center ${i === 0 ? "bg-[#EEF1FB] text-navy" : "bg-gold text-navy"}`}>
                    {i === 0 ? <BadgeCheck className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                  </span>
                  <h3 className="text-[18px] font-bold text-ink">{col.title}</h3>
                </div>
                <ul className="flex flex-col gap-3">
                  {col.points.map((pt, j) => (
                    <li key={j} className="flex gap-3 text-[13.5px] text-ink leading-relaxed">
                      <span className="w-[18px] h-[18px] rounded-full bg-green-500/18 text-green-600 flex items-center justify-center text-[10px] shrink-0 mt-0.5"><Check className="w-3 h-3" /></span>
                      {pt}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <button onClick={openLead} className="inline-flex items-center gap-2 bg-navy text-white font-bold px-6 py-3.5 rounded-xl text-sm hover:-translate-y-0.5 transition-transform">
              {C.readyOffplan.cta} <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.section>

      {/* 08 — Why us */}
      <motion.section {...fade} className="py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-4">
          <SectionHead tag={C.why.tag} h2={C.why.h2} sub={C.why.sub} />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {C.why.cards.map((c, i) => {
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

      {/* 09 — Advisor / team (real photos) */}
      <TeamSection hideMeetMore />

      {/* 10 — Process + remote */}
      <SharedHowItWorks
        variant="cards"
        title={C.process.h2}
        subtitle={C.process.sub}
        steps={C.process.steps.map((s, i) => ({
          number: i + 1,
          title: s.title,
          description: s.description,
          icon: PROCESS_ICONS[i] ?? Target,
        }))}
      />
      <div className="max-w-4xl mx-auto px-4 -mt-4 mb-16 md:mb-20">
        <div className="flex items-start gap-3 bg-surface border border-border rounded-2xl p-5">
          <span className="w-8 h-8 rounded-lg bg-[#EEF1FB] text-navy flex items-center justify-center shrink-0"><Repeat className="w-4 h-4" /></span>
          <p className="text-[13px] text-muted-foreground leading-relaxed">{C.process.remote}</p>
        </div>
      </div>

      {/* 11 — Costs & transparency */}
      <motion.section {...fade} className="py-16 md:py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <SectionHead tag={C.costs.tag} h2={C.costs.h2} sub={C.costs.sub} />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {C.costs.items.map((c, i) => {
              const Icon = COST_ICONS[i] ?? Wallet;
              return (
                <div key={i} className="bg-surface border border-border rounded-2xl p-6 flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-gold-lt text-gold-dk flex items-center justify-center shrink-0"><Icon className="w-5 h-5" /></div>
                  <div>
                    <div className="text-sm font-bold text-ink mb-1">{c.name}</div>
                    <div className="text-[12.5px] text-muted-foreground leading-relaxed">{c.note}</div>
                  </div>
                </div>
              );
            })}
          </div>
          <p className="text-center text-[12.5px] text-muted-foreground mt-6 max-w-2xl mx-auto">{C.costs.note}</p>
          <div className="text-center mt-6">
            <button onClick={openLead} className="inline-flex items-center gap-2 bg-navy text-white font-bold px-6 py-3.5 rounded-xl text-sm hover:-translate-y-0.5 transition-transform">
              {C.costs.cta} <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.section>

      {/* 12 — Case studies */}
      <motion.section {...fade} className="py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-4">
          <SectionHead tag={C.cases.tag} h2={C.cases.h2} sub={C.cases.sub} />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {C.cases.cards.map((c, i) => (
              <div key={i} className="bg-surface border border-border rounded-2xl overflow-hidden shadow-sm">
                <div className="relative h-36">
                  <MediaImage src={`/images/ru/${c.img}.jpg`} alt={c.goal} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/55 to-transparent" />
                  <span className="absolute bottom-3 start-3 bg-white/95 text-ink text-[11px] font-extrabold px-3 py-1 rounded-full">{c.goal}</span>
                </div>
                <div className="p-5">
                  <p className="text-[13px] text-muted-foreground leading-relaxed">{c.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* 13 — Residency / Golden Visa */}
      <motion.section {...fade} className="py-12 md:py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="rounded-2xl p-8 md:p-10 text-white flex flex-col md:flex-row md:items-center gap-6" style={{ background: HERO_BG }}>
            <div className="flex-1">
              <span className="inline-flex items-center gap-2 text-xs font-bold text-gold uppercase tracking-wider mb-3">
                <ShieldCheck className="w-3.5 h-3.5" /> {C.residency.tag}
              </span>
              <h2 className="text-[22px] md:text-[26px] font-bold mb-2">{C.residency.h2}</h2>
              <p className="text-white/75 text-[14px] leading-relaxed">{C.residency.sub}</p>
            </div>
            <button onClick={openLead} className="inline-flex items-center gap-2 bg-[#FBF6E8] text-navy font-bold px-6 py-3.5 rounded-xl text-sm shrink-0 hover:-translate-y-0.5 transition-transform">
              {C.residency.cta} <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.section>

      {/* 14 — FAQ (+ FAQPage schema generated from the visible questions) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: C.faq.items.map((f) => ({
              "@type": "Question",
              name: f.question,
              acceptedAnswer: { "@type": "Answer", text: f.answer },
            })),
          }),
        }}
      />
      <SharedFAQ title={C.faq.h2} items={C.faq.items.map((f) => ({ question: f.question, answer: f.answer }))} />

      {/* 15 — Final CTA + form */}
      <motion.section {...fade} id="contact" className="py-16 md:py-20" style={{ background: HERO_BG }}>
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-[28px] md:text-[32px] font-bold text-gold mb-3">{C.form.cta_title}</h2>
          <p className="text-white/75 mb-8 max-w-xl mx-auto">{C.form.cta_sub}</p>
          <div className="bg-white/5 rounded-3xl p-6 md:p-8 border border-gold/20">
            <LandingLeadForm sourceSlug={SOURCE_SLUG} strings={C.form} />
          </div>
        </div>
      </motion.section>

      <WhatsAppFloat />
      <LandingFooter />
      {leadMounted && (
        <LeadFormModal open={leadOpen} onOpenChange={setLeadOpen} sourceSlug={SOURCE_SLUG} strings={C.form} />
      )}
      {chatMounted && (
        <ChatModal isOpen={chatOpen} onClose={() => setChatOpen(false)} initialMessage={chatMessage} />
      )}
    </div>
  );
}
