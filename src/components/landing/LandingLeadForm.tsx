"use client";

import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import { Check, Loader2 } from "lucide-react";

interface LandingLeadFormProps {
  /** "hero" = on a dark navy background; "cta" = same, slightly different copy slot. */
  variant?: "hero" | "cta";
  /** Page slug used to tag the lead's sourcePage, e.g. "uae-life". */
  sourceSlug: string;
  /** Optional localized form labels; defaults to t.uaeLife.form. */
  strings?: Record<string, string>;
}

type Status = "idle" | "loading" | "sent" | "error";

const inputClass =
  "w-full bg-white/10 border border-gold/30 text-white placeholder:text-white/40 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold transition-colors min-h-[48px]";

export default function LandingLeadForm({ sourceSlug, strings }: LandingLeadFormProps) {
  const { t, lang } = useLanguage();
  const f = strings ?? t.uaeLife.form;

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const n = name.trim();
    const p = phone.trim();
    if (n.length < 2 || p.replace(/\D/g, "").length < 6) {
      setError(f.errorRequired);
      return;
    }
    setError("");
    setStatus("loading");
    try {
      const res = await fetch("/api/landing-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: n,
          phone: p,
          sourcePage: `/${lang}/${sourceSlug}`,
          website,
        }),
      });
      if (!res.ok) throw new Error("request failed");
      if (typeof window !== "undefined" && (window as any).gtag) {
        (window as any).gtag("event", "lead_form_submit", { service: "uae_life_landing" });
      }
      setStatus("sent");
    } catch {
      setStatus("error");
      setError(f.errorGeneric);
    }
  };

  if (status === "sent") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white/10 rounded-2xl p-8 text-center max-w-md mx-auto"
      >
        <Check className="w-12 h-12 text-green-500 mx-auto mb-3" />
        <p className="text-white font-semibold">{f.thankYou}</p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={submit} className="max-w-md mx-auto w-full">
      <div className="grid grid-cols-1 gap-4 mb-4">
        <input
          type="text"
          name="name"
          autoComplete="name"
          placeholder={f.namePlaceholder}
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={inputClass}
        />
        <input
          type="tel"
          name="phone"
          inputMode="tel"
          autoComplete="tel"
          placeholder={f.phonePlaceholder}
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className={inputClass}
        />
        {/* Honeypot — hidden from users, bots tend to fill it */}
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          className="hidden"
          aria-hidden="true"
        />
      </div>

      {error && <p className="text-sm text-red-300 mb-3 text-center">{error}</p>}

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full bg-gold text-navy font-bold px-8 py-4 rounded-xl text-base hover:bg-gold-dk transition-colors min-h-[48px] flex items-center justify-center gap-2 disabled:opacity-70"
      >
        {status === "loading" && <Loader2 className="w-5 h-5 animate-spin" />}
        {status === "loading" ? f.sending : f.cta}
      </button>

      <p className="text-xs text-white/50 mt-3 text-center">{f.phoneHint}</p>
      <p className="text-[11px] text-white/40 mt-2 text-center leading-relaxed">{f.consent}</p>
    </form>
  );
}
