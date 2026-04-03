"use client";

import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import { Check, MessageCircle } from "lucide-react";

interface SharedLeadFormProps {
  title?: string;
  subtitle?: string;
  serviceContext?: string;
}

const SharedLeadForm = ({ title, subtitle, serviceContext = "general" }: SharedLeadFormProps) => {
  const { t, lang } = useLanguage();
  const s = t.shared;
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!name || !phone) return;
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("event", "lead_form_submit", { service: serviceContext });
    }
    setSubmitted(true);
  };

  const whatsappTexts: Record<string, string> = {
    fa: "سلام،+درخواست+مشاوره+دارم",
    en: "Hi,+I+need+consultation",
    ar: "مرحباً،+أحتاج+استشارة",
    ru: "Здравствуйте,+нужна+консультация",
  };

  const inputClass =
    "w-full bg-white/10 border border-gold/30 text-white placeholder:text-white/40 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold transition-colors min-h-[48px]";

  const trustItems = [s.lead_trust1, s.lead_trust2, s.lead_trust3];

  return (
    <section id="consultation-form" className="py-16 bg-navy">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gold">
            {title || s.lead_title}
          </h2>
          <p className="text-white/70 mt-2">{subtitle || s.lead_subtitle}</p>
        </div>

        {submitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/10 rounded-2xl p-8 text-center max-w-md mx-auto"
          >
            <Check className="w-12 h-12 text-green-500 mx-auto mb-3" />
            <p className="text-white font-semibold">{s.lead_trust2}</p>
          </motion.div>
        ) : (
          <div className="max-w-lg mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                placeholder={s.lead_name}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={inputClass}
              />
              <input
                type="tel"
                placeholder={s.lead_whatsapp}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={inputClass}
              />
            </div>

            <button
              onClick={handleSubmit}
              className="w-full bg-gold text-navy font-bold px-8 py-4 rounded-xl text-base hover:bg-gold-dk transition-colors min-h-[48px]"
            >
              {s.lead_cta}
            </button>

            <div className="mt-4">
              <a
                href={`https://wa.me/971562009131?text=${whatsappTexts[lang] || whatsappTexts.en}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-whatsapp text-white font-semibold w-full rounded-xl py-3 hover:opacity-90 transition-opacity min-h-[48px]"
              >
                <MessageCircle className="w-5 h-5" />
                WhatsApp
              </a>
            </div>
          </div>
        )}

        <div className="flex items-center gap-6 justify-center flex-wrap mt-6">
          {trustItems.map((item, i) => (
            <span key={i} className="text-xs text-white/50 flex items-center gap-1">
              <Check className="w-3 h-3 text-green-500" />
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SharedLeadForm;
