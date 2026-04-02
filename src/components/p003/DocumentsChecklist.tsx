"use client";

import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { ClipboardList, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";

const INDIVIDUAL_DOCS = [
  { key: "doc1", noteKey: "doc1n", required: true },
  { key: "doc2", noteKey: null, required: true },
  { key: "doc3", noteKey: "doc3n", required: true },
  { key: "doc4", noteKey: "doc4n", required: false },
  { key: "doc5", noteKey: null, required: false },
] as const;

export default function DocumentsChecklist() {
  const { t, lang } = useLanguage();
  const cr = t.cr;
  const [tab, setTab] = useState<"ind" | "corp">("ind");

  return (
    <motion.section
      id="cr-s9"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      className="py-16 bg-surface"
    >
      <div className="max-w-3xl mx-auto px-6">
        <h2 className="text-2xl font-bold text-navy text-center mb-8">
          {cr.docs_title}
        </h2>

        {/* Tabs */}
        <div className="flex gap-3 justify-center mb-8">
          <button
            onClick={() => setTab("ind")}
            className={[
              "px-5 py-2 rounded-full text-sm font-semibold transition-colors",
              tab === "ind"
                ? "bg-navy text-gold"
                : "border border-navy text-navy hover:bg-navy/5",
            ].join(" ")}
          >
            {cr.docs_tab_ind}
          </button>
          <button
            onClick={() => setTab("corp")}
            className={[
              "px-5 py-2 rounded-full text-sm font-semibold transition-colors",
              tab === "corp"
                ? "bg-navy text-gold"
                : "border border-navy text-navy hover:bg-navy/5",
            ].join(" ")}
          >
            {cr.docs_tab_corp}
          </button>
        </div>

        {tab === "ind" ? (
          <div className="space-y-4">
            {INDIVIDUAL_DOCS.map(({ key, noteKey, required }, i) => (
              <div
                key={i}
                className="bg-white rounded-xl p-4 shadow-sm flex gap-3 items-start"
              >
                <ClipboardList className="w-5 h-5 text-navy shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-foreground font-medium">{cr[key]}</span>
                    <span
                      className={[
                        "text-xs px-2 py-0.5 rounded-full font-semibold",
                        required
                          ? "bg-green-100 text-green-800"
                          : "bg-blue-100 text-blue-800",
                      ].join(" ")}
                    >
                      {required ? cr.doc_req : cr.doc_opt}
                    </span>
                  </div>
                  {noteKey && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {cr[noteKey]}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl p-8 shadow-sm text-center">
            <MessageCircle className="w-12 h-12 text-navy mx-auto mb-4" />
            <p className="text-foreground mb-4">{cr.doc_corp_msg}</p>
            <a
              href={`https://wa.me/971562009131`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-whatsapp text-white font-bold px-6 py-3 rounded-xl hover:opacity-90 transition"
            >
              {cr.doc_corp_cta}
            </a>
          </div>
        )}

        <p className="text-xs text-muted-foreground text-center mt-6">
          {cr.docs_note}
        </p>
      </div>
    </motion.section>
  );
}
