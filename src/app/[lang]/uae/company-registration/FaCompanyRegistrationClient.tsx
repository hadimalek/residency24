"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import SharedLeadForm from "@/components/shared/SharedLeadForm";
import SharedFAQ from "@/components/shared/SharedFAQ";
import SharedCrossSell from "@/components/shared/SharedCrossSell";
import type { CrossSellItem } from "@/components/shared/SharedCrossSell";
import { Trophy, Building, Globe, Check, X, ArrowLeft } from "lucide-react";
import HeroChat from "@/components/HeroChat";
import { localizedPath, BREADCRUMB_HOME } from "@/lib/locale-path";
import { FA, IMG } from "./fa-content";

/* ── layout primitives ─────────────────────────────────────────────────────
   The reference page alternates three bands (white / sand / ink). Mapped onto
   the site's own tokens so the page reads as part of the design system rather
   than a transplant: surface = sand, navy = ink.                            */

type Tone = "white" | "sand" | "ink";

const BAND: Record<Tone, string> = {
  white: "bg-white",
  sand: "bg-surface",
  ink: "bg-navy",
};

function Band({
  tone = "white",
  id,
  children,
}: {
  tone?: Tone;
  id?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className={`${BAND[tone]} py-14 md:py-20`}>
      <div className="max-w-5xl mx-auto px-4">{children}</div>
    </section>
  );
}

function Head({
  eyebrow,
  h2,
  lead,
  tone = "white",
  center,
}: {
  eyebrow?: string;
  h2: string;
  lead?: string;
  tone?: Tone;
  center?: boolean;
}) {
  const dark = tone === "ink";
  return (
    <div className={`mb-8 ${center ? "text-center" : ""}`}>
      {eyebrow && (
        <span
          className={`inline-block text-xs font-bold tracking-[0.12em] mb-3 ${
            dark ? "text-gold" : "text-gold-dk"
          }`}
        >
          {eyebrow}
        </span>
      )}
      <h2
        className={`text-[26px] md:text-[32px] font-bold leading-tight ${
          dark ? "text-white" : "text-navy"
        }`}
      >
        {h2}
      </h2>
      {lead && (
        <p
          className={`mt-3 text-[15px] leading-relaxed max-w-3xl ${
            center ? "mx-auto" : ""
          } ${dark ? "text-white/75" : "text-muted-foreground"}`}
        >
          {lead}
        </p>
      )}
    </div>
  );
}

function Prose({ text, tone = "white" }: { text: string | readonly string[]; tone?: Tone }) {
  const dark = tone === "ink";
  const paras = typeof text === "string" ? [text] : text;
  return (
    <div className="space-y-4 mb-8">
      {paras.map((p, i) => (
        <p
          key={i}
          className={`text-[15px] leading-[2] ${dark ? "text-white/80" : "text-ink"}`}
        >
          {p}
        </p>
      ))}
    </div>
  );
}

function CardGrid({
  items,
  tone = "white",
  cols = 4,
}: {
  items: readonly { t: string; d: string }[];
  tone?: Tone;
  cols?: 2 | 3 | 4;
}) {
  const dark = tone === "ink";
  const grid = cols === 2 ? "sm:grid-cols-2" : cols === 3 ? "sm:grid-cols-2 lg:grid-cols-3" : "sm:grid-cols-2 lg:grid-cols-4";
  return (
    <div className={`grid grid-cols-1 ${grid} gap-4`}>
      {items.map((c) => (
        <div
          key={c.t}
          className={`rounded-2xl border p-5 ${
            dark ? "border-white/15 bg-white/5" : "border-border bg-white"
          }`}
        >
          <p className={`font-bold text-[15px] mb-1.5 ${dark ? "text-white" : "text-navy"}`}>
            {c.t}
          </p>
          <p className={`text-[13px] leading-relaxed ${dark ? "text-white/70" : "text-muted-foreground"}`}>
            {c.d}
          </p>
        </div>
      ))}
    </div>
  );
}

/** Wide figure used to break up the long read. Plain <img>: these are existing
 *  library files served from /uploads and next/image is not configured for that
 *  route. Every one carries a descriptive Persian alt. */
function Figure({ src, alt, priority }: { src: string; alt: string; priority?: boolean }) {
  return (
    <figure className="mb-8 rounded-2xl overflow-hidden border border-border">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        width={1200}
        height={630}
        loading={priority ? "eager" : "lazy"}
        // fetchPriority tells the browser this is the LCP candidate.
        fetchPriority={priority ? "high" : "auto"}
        decoding="async"
        className="w-full h-auto object-cover max-h-[380px]"
      />
    </figure>
  );
}

function DataTable({
  head,
  rows,
  caption,
}: {
  head: readonly string[];
  rows: readonly (readonly string[])[];
  caption?: string;
}) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-border bg-white">
      <table className="w-full text-[14px] border-collapse">
        {caption && <caption className="sr-only">{caption}</caption>}
        <thead>
          <tr className="bg-navy text-white">
            {head.map((h) => (
              <th key={h} scope="col" className="text-start font-bold px-4 py-3 whitespace-nowrap">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className={i % 2 ? "bg-surface/60" : ""}>
              {r.map((c, j) => (
                <td
                  key={j}
                  className={`px-4 py-3 border-t border-border ${
                    j === 0 ? "font-semibold text-navy" : "text-ink"
                  }`}
                >
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function InlineLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-gold-dk hover:text-navy transition-colors"
    >
      <ArrowLeft className="h-4 w-4" aria-hidden="true" />
      {label}
    </a>
  );
}

/* ── page ──────────────────────────────────────────────────────────────── */

export default function FaCompanyRegistrationClient({ relatedReading }: { relatedReading?: React.ReactNode }) {
  const lang = "fa" as const;
  const site = "https://residency24.com";
  const pageUrl = `${site}/fa/uae/company-registration`;

  const crossSell: CrossSellItem[] = [
    {
      title: "گلدن ویزای امارات",
      description: "اقامت ۱۰ ساله از مسیر سرمایه‌گذاری",
      icon: Trophy,
      href: localizedPath(lang, "uae/golden-visa"),
      isHighlighted: true,
    },
    {
      title: "خرید ملک در دبی",
      description: "سرمایه‌گذاری ملکی همراه با اقامت",
      icon: Building,
      href: localizedPath(lang, "uae/buy-property"),
    },
    {
      title: "ثبت شرکت در عمان",
      description: "گزینه‌ای کم‌هزینه‌تر در همان منطقه",
      icon: Globe,
      href: localizedPath(lang, "oman/company-registration"),
    },
  ];

  /* Schema. FAQPage + HowTo mirror content that is visibly on the page, which
     is what Google requires; Service carries the offer and the breadcrumb
     matches the visible trail. */
  const schemas = [
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: FA.faq.items.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "HowTo",
      name: FA.steps.h2,
      description: FA.steps.lead,
      inLanguage: "fa",
      totalTime: "P10D",
      estimatedCost: { "@type": "MonetaryAmount", currency: "AED", value: "12500" },
      step: FA.steps.items.map((s, i) => ({
        "@type": "HowToStep",
        position: i + 1,
        name: s.t,
        text: s.d,
        url: `${pageUrl}#steps`,
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "Service",
      serviceType: "ثبت شرکت در دبی و امارات",
      name: FA.hero.h1,
      description: FA.hero.lead,
      inLanguage: "fa",
      areaServed: { "@type": "Country", name: "United Arab Emirates" },
      provider: {
        "@type": "Organization",
        name: "Residency24",
        url: site,
        "@id": `${site}/#organization`,
      },
      offers: {
        "@type": "Offer",
        priceCurrency: "AED",
        price: "12500",
        priceSpecification: {
          "@type": "PriceSpecification",
          priceCurrency: "AED",
          minPrice: "8000",
          description: "نقطهٔ شروع هزینه بسته به ساختار انتخابی",
        },
        availability: "https://schema.org/InStock",
        url: pageUrl,
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: BREADCRUMB_HOME[lang], item: `${site}/fa` },
        { "@type": "ListItem", position: 2, name: "امارات", item: `${site}/fa/uae` },
        { "@type": "ListItem", position: 3, name: "ثبت شرکت در دبی", item: pageUrl },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      {schemas.map((s, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }}
        />
      ))}

      <Navbar />

      {/* ── Hero ─────────────────────────────────────────────────────────
          The shared AI chat hero, same as every other landing page: the
          suggested pills and the send button open ChatModal. H1 and sub are
          overridden with this page's keyword-targeted wording.             */}
      <HeroChat
        crumbs={[
          { label: BREADCRUMB_HOME[lang], href: localizedPath(lang) },
          { label: "امارات", href: localizedPath(lang, "uae") },
          { label: "ثبت شرکت در دبی" },
        ]}
        bgImage={IMG.hero}
        bgAlt={FA.hero.imgAlt}
        pageKey="p003"
        h1={FA.hero.h1}
        sub={FA.hero.h1sub}
      />

      {/* ── Lead ─────────────────────────────────────────────────────────── */}
      <section className="bg-white border-b border-border">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <p className="text-xs font-bold text-gold-dk tracking-[0.12em] mb-3">
            {FA.hero.eyebrow}
          </p>
          <p className="text-[15px] md:text-base text-ink leading-[2.1]">{FA.hero.lead}</p>
          <div className="flex flex-wrap gap-3 mt-6">
            <a
              href="#cta"
              className="rounded-xl bg-gold text-navy px-6 py-3 text-sm font-bold hover:opacity-90 transition-opacity"
            >
              {FA.hero.ctaPrimary}
            </a>
            <a
              href="#cost"
              className="rounded-xl border border-border text-navy px-6 py-3 text-sm font-bold hover:bg-surface transition-colors"
            >
              {FA.hero.ctaSecondary}
            </a>
          </div>
        </div>
      </section>

      {/* ── On-page table of contents ────────────────────────────────────── */}
      <nav aria-label={FA.toc.title} className="bg-white border-b border-border">
        <div className="max-w-5xl mx-auto px-4 py-5">
          <p className="text-xs font-bold text-navy/50 mb-3">{FA.toc.title}</p>
          <ul className="flex flex-wrap gap-2">
            {FA.toc.items.map((i) => (
              <li key={i.id}>
                <a
                  href={`#${i.id}`}
                  className="inline-block rounded-full border border-border bg-surface px-3.5 py-1.5 text-[13px] text-ink hover:border-gold hover:text-navy transition-colors"
                >
                  {i.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* ── Who ──────────────────────────────────────────────────────────── */}
      <Band tone="white" id="who">
        <Head eyebrow={FA.who.eyebrow} h2={FA.who.h2} lead={FA.who.lead} />
        <CardGrid items={FA.who.cards} />
      </Band>

      {/* ── Types ────────────────────────────────────────────────────────── */}
      <Band tone="sand" id="types">
        <Head eyebrow={FA.types.eyebrow} h2={FA.types.h2} lead={FA.types.lead} tone="sand" />
        <Figure src={IMG.city} alt={FA.types.imgAlt} />
        <Prose text={FA.types.body} />
        <div className="mb-8">
          <CardGrid items={FA.types.cards} cols={3} />
        </div>
        <h3 className="text-[19px] font-bold text-navy mb-4">{FA.types.tableTitle}</h3>
        <DataTable head={FA.types.tableHead} rows={FA.types.tableRows} caption={FA.types.tableTitle} />
      </Band>

      {/* ── Cost ─────────────────────────────────────────────────────────── */}
      <Band tone="white" id="cost">
        <Head eyebrow={FA.cost.eyebrow} h2={FA.cost.h2} lead={FA.cost.lead} />
        <Prose text={FA.cost.body} />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {FA.cost.plans.map((p) => (
            <div
              key={p.name}
              className={`rounded-2xl border p-6 ${
                "featured" in p && p.featured
                  ? "border-gold bg-gold/5 shadow-sm"
                  : "border-border bg-white"
              }`}
            >
              <p className="text-[15px] font-bold text-navy" dir="ltr">
                {p.name}
              </p>
              <p className="text-[24px] font-bold text-gold-dk mt-2 mb-4">{p.price}</p>
              <ul className="space-y-2">
                {p.items.map((it) => (
                  <li key={it} className="flex items-start gap-2 text-[13px] text-ink">
                    <Check className="h-4 w-4 text-gold-dk shrink-0 mt-0.5" aria-hidden="true" />
                    {it}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Band>

      {/* ── Extra costs ──────────────────────────────────────────────────── */}
      <Band tone="sand">
        <Head eyebrow={FA.extraCosts.eyebrow} h2={FA.extraCosts.h2} lead={FA.extraCosts.lead} tone="sand" />
        <CardGrid items={FA.extraCosts.cards} />
        <div className="mt-6">
          <InlineLink {...FA.extraCosts.link} />
        </div>
      </Band>

      {/* ── Family ───────────────────────────────────────────────────────── */}
      <Band tone="white">
        <Head eyebrow={FA.family.eyebrow} h2={FA.family.h2} lead={FA.family.lead} />
        <CardGrid items={FA.family.cards} />
      </Band>

      {/* ── Living costs ─────────────────────────────────────────────────── */}
      <Band tone="sand">
        <Head eyebrow={FA.living.eyebrow} h2={FA.living.h2} lead={FA.living.lead} tone="sand" />
        <DataTable head={FA.living.tableHead} rows={FA.living.tableRows} caption={FA.living.h2} />
        <div className="mt-6 rounded-2xl border border-border bg-white p-6">
          <h3 className="text-[17px] font-bold text-navy mb-2">{FA.living.summaryTitle}</h3>
          <p className="text-[15px] leading-[2] text-ink">{FA.living.summary}</p>
        </div>
      </Band>

      {/* ── Residency ────────────────────────────────────────────────────── */}
      <Band tone="ink" id="residency">
        <Head eyebrow={FA.residency.eyebrow} h2={FA.residency.h2} lead={FA.residency.lead} tone="ink" />
        <Prose text={FA.residency.body} tone="ink" />
        <a
          href={FA.residency.link.href}
          className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-gold hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          {FA.residency.link.label}
        </a>
      </Band>

      {/* ── Iranians ─────────────────────────────────────────────────────── */}
      <Band tone="white">
        <Head eyebrow={FA.iranians.eyebrow} h2={FA.iranians.h2} lead={FA.iranians.lead} />
        <Prose text={FA.iranians.body} />
      </Band>

      {/* ── Licenses ─────────────────────────────────────────────────────── */}
      <Band tone="sand">
        <Head eyebrow={FA.licenses.eyebrow} h2={FA.licenses.h2} lead={FA.licenses.lead} tone="sand" />
        <Prose text={FA.licenses.body} />
        <CardGrid items={FA.licenses.cards} cols={3} />
        <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
          {FA.licenses.links.map((l) => (
            <InlineLink key={l.href} {...l} />
          ))}
        </div>
      </Band>

      {/* ── Company types ────────────────────────────────────────────────── */}
      <Band tone="white">
        <Head eyebrow={FA.companyTypes.eyebrow} h2={FA.companyTypes.h2} lead={FA.companyTypes.lead} />
        <Prose text={FA.companyTypes.body} />
        <CardGrid items={FA.companyTypes.cards} />
        <div className="mt-6">
          <InlineLink {...FA.companyTypes.link} />
        </div>
      </Band>

      {/* ── Steps ────────────────────────────────────────────────────────── */}
      <Band tone="sand" id="steps">
        <Head eyebrow={FA.steps.eyebrow} h2={FA.steps.h2} lead={FA.steps.lead} tone="sand" />
        <Figure src={IMG.steps} alt={FA.steps.imgAlt} />
        <Prose text={FA.steps.body} />
        <ol className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {FA.steps.items.map((s, i) => (
            <li key={s.t} className="rounded-2xl border border-border bg-white p-5 flex gap-4">
              <span className="shrink-0 w-9 h-9 rounded-full bg-navy text-white font-bold text-sm flex items-center justify-center">
                {(i + 1).toLocaleString("fa-IR")}
              </span>
              <span>
                <span className="block font-bold text-[15px] text-navy mb-1">{s.t}</span>
                <span className="block text-[13px] leading-relaxed text-muted-foreground">{s.d}</span>
              </span>
            </li>
          ))}
        </ol>
        <div className="mt-6">
          <InlineLink {...FA.steps.link} />
        </div>
      </Band>

      {/* ── Duration ─────────────────────────────────────────────────────── */}
      <Band tone="white">
        <Head eyebrow={FA.duration.eyebrow} h2={FA.duration.h2} lead={FA.duration.lead} />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {FA.duration.items.map((d) => (
            <div key={d.d} className="rounded-2xl border border-border bg-surface p-5 text-center">
              <p className="text-[22px] font-bold text-navy">{d.v}</p>
              <p className="text-[13px] text-muted-foreground mt-1">{d.d}</p>
            </div>
          ))}
        </div>
        <p className="mt-6 rounded-xl border-s-4 border-gold bg-gold/5 px-5 py-4 text-[14px] leading-[2] text-ink">
          {FA.duration.note}
        </p>
      </Band>

      {/* ── Services ─────────────────────────────────────────────────────── */}
      <Band tone="sand">
        <Head eyebrow={FA.services.eyebrow} h2={FA.services.h2} lead={FA.services.lead} tone="sand" />
        <CardGrid items={FA.services.cards} />
      </Band>

      {/* ── Documents ────────────────────────────────────────────────────── */}
      <Band tone="white">
        <Head eyebrow={FA.documents.eyebrow} h2={FA.documents.h2} lead={FA.documents.lead} />
        <CardGrid items={FA.documents.cards} cols={3} />
      </Band>

      {/* ── Cities ───────────────────────────────────────────────────────── */}
      <Band tone="ink">
        <Head eyebrow={FA.cities.eyebrow} h2={FA.cities.h2} lead={FA.cities.lead} tone="ink" />
        <Prose text={FA.cities.body} tone="ink" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {FA.cities.items.map((c) => (
            <a
              key={c.name}
              href={c.href}
              className={`rounded-2xl border border-white/15 bg-white/5 p-5 hover:bg-white/10 transition-colors ${
                "wide" in c && c.wide ? "sm:col-span-2" : ""
              }`}
            >
              <span className="block font-bold text-[16px] text-white">{c.name}</span>
              <span className="block text-[13px] text-white/60 mt-1" dir="ltr">
                {c.lat}
              </span>
            </a>
          ))}
        </div>
      </Band>

      {/* ── Free zones ───────────────────────────────────────────────────── */}
      <Band tone="white" id="zones">
        <Head eyebrow={FA.zones.eyebrow} h2={FA.zones.h2} lead={FA.zones.lead} />
        <Figure src={IMG.zones} alt={FA.zones.imgAlt} />
        <Prose text={FA.zones.body} />
        <CardGrid items={FA.zones.cards} />
        <div className="mt-6">
          <InlineLink {...FA.zones.link} />
        </div>
      </Band>

      {/* ── Sectors ──────────────────────────────────────────────────────── */}
      <Band tone="sand">
        <Head eyebrow={FA.sectors.eyebrow} h2={FA.sectors.h2} lead={FA.sectors.lead} tone="sand" />
        <ul className="flex flex-wrap gap-2.5">
          {FA.sectors.pills.map((p) => (
            <li
              key={p}
              className="rounded-full border border-border bg-white px-4 py-2 text-[14px] text-ink"
            >
              {p}
            </li>
          ))}
        </ul>
        <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
          {FA.sectors.links.map((l) => (
            <InlineLink key={l.href} {...l} />
          ))}
        </div>
      </Band>

      {/* ── Bank ─────────────────────────────────────────────────────────── */}
      <Band tone="white" id="bank">
        <Head eyebrow={FA.bank.eyebrow} h2={FA.bank.h2} lead={FA.bank.lead} />
        <Prose text={FA.bank.body} />
        <CardGrid items={FA.bank.warnings} cols={2} />
      </Band>

      {/* ── Capital ──────────────────────────────────────────────────────── */}
      <Band tone="sand">
        <Head eyebrow={FA.capital.eyebrow} h2={FA.capital.h2} lead={FA.capital.lead} tone="sand" />
        <Prose text={FA.capital.body} />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {FA.capital.tiers.map((t) => (
            <div
              key={t.name}
              className={`rounded-2xl border p-6 ${
                "featured" in t && t.featured ? "border-gold bg-gold/5" : "border-border bg-white"
              }`}
            >
              <p className="font-bold text-[15px] text-navy mb-4">{t.name}</p>
              <ul className="space-y-2">
                {t.items.map((i) => (
                  <li key={i} className="flex items-start gap-2 text-[13px] text-ink">
                    <Check className="h-4 w-4 text-gold-dk shrink-0 mt-0.5" aria-hidden="true" />
                    {i}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Band>

      {/* ── Tax ──────────────────────────────────────────────────────────── */}
      <Band tone="white" id="tax">
        <Head eyebrow={FA.tax.eyebrow} h2={FA.tax.h2} lead={FA.tax.lead} />
        <Prose text={FA.tax.body} />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {FA.tax.stats.map((s) => (
            <div key={s.t} className="rounded-2xl border border-border bg-surface p-5">
              <p className="text-[26px] font-bold text-gold-dk">{s.v}</p>
              <p className="text-[14px] font-semibold text-navy mt-1">{s.t}</p>
              <p className="text-[12px] text-muted-foreground mt-1 leading-relaxed">{s.d}</p>
            </div>
          ))}
        </div>
      </Band>

      {/* ── Pros / cons ──────────────────────────────────────────────────── */}
      <Band tone="sand">
        <Head eyebrow={FA.prosCons.eyebrow} h2={FA.prosCons.h2} lead={FA.prosCons.lead} tone="sand" />
        <Prose text={FA.prosCons.body} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-6">
            <h3 className="font-bold text-[17px] text-emerald-800 mb-4">{FA.prosCons.prosTitle}</h3>
            <ul className="space-y-3">
              {FA.prosCons.pros.map((p) => (
                <li key={p.t} className="flex items-start gap-2.5">
                  <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-1" aria-hidden="true" />
                  <span>
                    <span className="block font-semibold text-[14px] text-navy">{p.t}</span>
                    <span className="block text-[13px] text-muted-foreground">{p.d}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-border bg-white p-6">
            <h3 className="font-bold text-[17px] text-navy mb-4">{FA.prosCons.consTitle}</h3>
            <ul className="space-y-3">
              {FA.prosCons.cons.map((p) => (
                <li key={p.t} className="flex items-start gap-2.5">
                  <X className="h-4 w-4 text-muted-foreground shrink-0 mt-1" aria-hidden="true" />
                  <span>
                    <span className="block font-semibold text-[14px] text-navy">{p.t}</span>
                    <span className="block text-[13px] text-muted-foreground">{p.d}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <p className="mt-6 text-[15px] leading-[2] text-ink">{FA.prosCons.conclusion}</p>
      </Band>

      {/* ── Risks ────────────────────────────────────────────────────────── */}
      <Band tone="white">
        <Head eyebrow={FA.risks.eyebrow} h2={FA.risks.h2} lead={FA.risks.lead} />
        <Prose text={FA.risks.body} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {FA.risks.items.map((r, i) => (
            <div key={r.t} className="rounded-2xl border border-border bg-surface p-5">
              <p className="text-[11px] font-bold text-gold-dk mb-1">
                ریسک {(i + 1).toLocaleString("fa-IR")}
              </p>
              <p className="font-bold text-[15px] text-navy mb-1.5">{r.t}</p>
              <p className="text-[13px] text-muted-foreground leading-relaxed mb-3">{r.d}</p>
              <p className="text-[13px] text-ink leading-relaxed border-t border-border pt-3">
                <span className="font-bold text-navy">راه‌حل: </span>
                {r.fix}
              </p>
            </div>
          ))}
        </div>
      </Band>

      {/* ── Mistakes ─────────────────────────────────────────────────────── */}
      <Band tone="sand">
        <Head eyebrow={FA.mistakes.eyebrow} h2={FA.mistakes.h2} lead={FA.mistakes.lead} tone="sand" />
        <Prose text={FA.mistakes.body} />
        <ul className="space-y-3">
          {FA.mistakes.items.map((m) => (
            <li
              key={m.wrong}
              className="rounded-2xl border border-border bg-white p-5 grid md:grid-cols-[1fr_auto_1fr] gap-3 md:gap-5 items-center"
            >
              <span className="flex items-start gap-2 text-[14px] text-muted-foreground">
                <X className="h-4 w-4 text-red-500 shrink-0 mt-0.5" aria-hidden="true" />
                {m.wrong}
              </span>
              <ArrowLeft className="hidden md:block h-4 w-4 text-gold-dk" aria-hidden="true" />
              <span className="flex items-start gap-2 text-[14px] font-semibold text-navy">
                <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" aria-hidden="true" />
                {m.right}
              </span>
            </li>
          ))}
        </ul>
      </Band>

      {/* ── Money transfer ───────────────────────────────────────────────── */}
      <Band tone="white">
        <Head eyebrow={FA.transfer.eyebrow} h2={FA.transfer.h2} lead={FA.transfer.lead} />
        <Prose text={FA.transfer.body} />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {FA.transfer.items.map((t) => (
            <div key={t.t} className="rounded-2xl border border-border bg-surface p-6">
              <p className="font-bold text-[15px] text-navy mb-1.5">{t.t}</p>
              <p className="text-[13px] text-muted-foreground leading-relaxed mb-4">{t.d}</p>
              <ul className="space-y-2">
                {t.points.map((p) => (
                  <li key={p} className="text-[13px] text-ink flex items-start gap-2">
                    <span className="text-gold-dk mt-0.5" aria-hidden="true">
                      ›
                    </span>
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="mt-6 rounded-xl border-s-4 border-gold bg-gold/5 px-5 py-4 text-[14px] leading-[2] text-ink">
          {FA.transfer.note}
        </p>
      </Band>

      {/* ── Country comparison ───────────────────────────────────────────── */}
      <Band tone="sand">
        <Head eyebrow={FA.comparison.eyebrow} h2={FA.comparison.h2} lead={FA.comparison.lead} tone="sand" />
        <Prose text={FA.comparison.body} />
        <DataTable head={FA.comparison.tableHead} rows={FA.comparison.tableRows} caption={FA.comparison.h2} />
        <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
          {FA.comparison.links.map((l) => (
            <InlineLink key={l.href} {...l} />
          ))}
        </div>
      </Band>

      {/* ── 2026 outlook ─────────────────────────────────────────────────── */}
      <Band tone="ink">
        <Head eyebrow={FA.future.eyebrow} h2={FA.future.h2} lead={FA.future.lead} tone="ink" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {FA.future.items.map((f) => (
            <div key={f.t} className="rounded-2xl border border-white/15 bg-white/5 p-5">
              <h3 className="font-bold text-[15px] text-white mb-1.5">{f.t}</h3>
              <p className="text-[13px] text-white/70 leading-relaxed">{f.d}</p>
            </div>
          ))}
        </div>
        <p className="mt-7 text-[15px] leading-[2] text-white/80">{FA.future.conclusion}</p>
      </Band>

      {/* ── Why us ───────────────────────────────────────────────────────── */}
      <Band tone="white">
        <Head eyebrow={FA.why.eyebrow} h2={FA.why.h2} lead={FA.why.lead} />
        <div className="grid lg:grid-cols-[1fr_1.1fr] gap-8 items-center">
          <div className="rounded-2xl overflow-hidden border border-border">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={IMG.team}
              alt={FA.why.imgAlt}
              width={800}
              height={600}
              loading="lazy"
              decoding="async"
              className="w-full h-auto object-cover"
            />
          </div>
          <div className="grid gap-4">
            {FA.why.items.map((w) => (
              <div key={w.t} className="rounded-2xl border border-border bg-surface p-5">
                <h3 className="font-bold text-[15px] text-navy mb-1.5">{w.t}</h3>
                <p className="text-[13px] text-muted-foreground leading-relaxed">{w.d}</p>
              </div>
            ))}
          </div>
        </div>
      </Band>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <div id="faq">
        <SharedFAQ
          title={FA.faq.h2}
          items={FA.faq.items.map((f) => ({ question: f.q, answer: f.a }))}
        />
      </div>

      {/* Articles on this subject — built on the server in page.tsx */}

      {relatedReading}


      <SharedCrossSell items={crossSell} title="خدمات مرتبط" />

      {/* ── Lead form (existing shared form) ─────────────────────────────── */}
      <div id="cta">
        <SharedLeadForm serviceContext="company_reg" title={FA.cta.h2} subtitle={FA.cta.sub} />
      </div>

      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
