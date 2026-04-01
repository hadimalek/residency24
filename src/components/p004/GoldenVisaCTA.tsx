"use client";

import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { MessageCircle, Video, FileText, Shield, Lock, Clock } from "lucide-react";

export default function GoldenVisaCTA() {
  const { t, lang } = useLanguage();
  const p = t.p004;

  const [name, setName] = useState("");
  const [nationality, setNationality] = useState("");
  const [interest, setInterest] = useState("");
  const [phone, setPhone] = useState("");

  const whatsappUrl = `https://wa.me/971562009131?text=${encodeURIComponent(p.whatsapp_msg)}`;

  const handleWhatsAppClick = (section: string) => {
    (window as any).gtag?.("event", "golden_visa_whatsapp_click", {
      section,
      language: lang,
    });
  };

  const handleSubmit = () => {
    if (!name || !phone) return;
    (window as any).gtag?.("event", "golden_visa_lead_form_submit", {
      nationality: nationality || "unknown",
      interest: interest || "unknown",
      language: lang,
    });
    // Redirect to WhatsApp with details
    const msg = `${p.whatsapp_msg}\n\nName: ${name}\nNationality: ${nationality}\nInterest: ${interest}\nPhone: ${phone}`;
    window.open(`https://wa.me/971562009131?text=${encodeURIComponent(msg)}`, "_blank");
  };

  const nationalities = [
    { fa: "ایرانی", en: "Iranian", ar: "إيراني", ru: "Иранец" },
    { fa: "عرب", en: "Arab", ar: "عربي", ru: "Араб" },
    { fa: "روسی", en: "Russian", ar: "روسي", ru: "Русский" },
    { fa: "سایر", en: "Other", ar: "أخرى", ru: "Другое" },
  ];

  return (
    <section id="consultation-form" className="bg-navy py-20 px-6">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-gold mb-4">{p.cta_final_title}</h2>
        <p className="text-white/70 text-base mb-8">{p.cta_final_sub}</p>

        <div className="flex gap-3 justify-center flex-wrap mb-10">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => handleWhatsAppClick("final_cta")}
            className="bg-green-500 text-white font-bold rounded-xl px-6 py-3 text-sm flex items-center gap-2 hover:bg-green-600 transition-colors"
          >
            <MessageCircle size={18} />
            {p.cta_whatsapp}
          </a>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="border border-gold text-gold rounded-xl px-6 py-3 text-sm flex items-center gap-2 hover:bg-gold/10 transition-colors"
          >
            <Video size={18} />
            {p.cta_video}
          </a>
          <a
            href="#consultation-form"
            className="border border-gold/50 text-gold/80 rounded-xl px-6 py-3 text-sm flex items-center gap-2 hover:bg-gold/10 transition-colors"
          >
            <FileText size={18} />
            {p.cta_form}
          </a>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-start">
          <p className="text-white/80 text-sm font-semibold mb-4">{p.form_title}</p>
          <div className="space-y-3">
            <input
              type="text"
              placeholder={p.form_name}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-gold/50"
            />
            <select
              value={nationality}
              onChange={(e) => setNationality(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-gold/50"
            >
              <option value="" className="text-navy">{p.form_nationality}</option>
              {nationalities.map((n, i) => (
                <option key={i} value={n.en} className="text-navy">
                  {n[lang as keyof typeof n] || n.en}
                </option>
              ))}
            </select>
            <select
              value={interest}
              onChange={(e) => setInterest(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-gold/50"
            >
              <option value="" className="text-navy">{p.form_interest}</option>
              {(p.form_interest_options as string[]).map((opt: string, i: number) => (
                <option key={i} value={opt} className="text-navy">{opt}</option>
              ))}
            </select>
            <input
              type="tel"
              placeholder={p.form_phone}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-gold/50"
            />
            <button
              onClick={handleSubmit}
              className="w-full bg-gold text-navy font-bold rounded-xl py-3 text-sm mt-4 hover:bg-gold/90 transition-colors"
            >
              {p.form_submit}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-center gap-4 mt-6 text-white/50 text-xs">
          <span className="flex items-center gap-1"><Shield size={12} /> </span>
          <span className="flex items-center gap-1"><Lock size={12} /> </span>
          <span className="flex items-center gap-1"><Clock size={12} /> </span>
          <span>{p.form_trust}</span>
        </div>
      </div>
    </section>
  );
}
