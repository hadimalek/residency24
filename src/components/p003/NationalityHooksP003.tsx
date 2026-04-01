"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { Users, Globe } from "lucide-react";
import { motion } from "framer-motion";

export default function NationalityHooksP003() {
  const { t, lang } = useLanguage();
  const cr = t.cr;

  const isRTL = lang === "fa" || lang === "ar";
  const isDark = lang === "fa" || lang === "ru" || lang === "ar";
  const Icon = lang === "en" ? Globe : Users;

  return (
    <motion.section
      id="cr-s10"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      className="py-16"
    >
      <div className="max-w-3xl mx-auto px-6">
        <div
          className={[
            "rounded-2xl p-8",
            isDark ? "bg-navy text-white" : "bg-surface",
          ].join(" ")}
        >
          <div className="flex items-start gap-4">
            <Icon
              className={[
                "w-12 h-12 shrink-0",
                isDark ? "text-gold" : "text-navy",
              ].join(" ")}
            />
            <div>
              <h2
                className={[
                  "text-xl font-bold mb-3",
                  isDark ? "text-white" : "text-navy",
                ].join(" ")}
              >
                {cr.nat_title}
              </h2>
              <p
                className={[
                  "text-sm leading-relaxed mb-6",
                  isDark ? "text-white/80" : "text-muted-foreground",
                ].join(" ")}
              >
                {cr.nat_body}
              </p>
              <a
                href="https://wa.me/971562009131"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-whatsapp text-white font-bold px-6 py-3 rounded-xl hover:opacity-90 transition"
              >
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
