"use client";

import { useState } from "react";
import type { CmsFaq } from "@/lib/cms/api";
import type { Lang } from "@/translations";
import { LANG_CONFIG } from "@/lib/seo";

interface PostFaqsProps {
  faqs: CmsFaq[];
  lang: Lang;
}

const faqLabel: Record<string, string> = {
  fa: "سوالات متداول",
  ar: "الأسئلة الشائعة",
  ru: "Часто задаваемые вопросы",
  en: "Frequently Asked Questions",
};

export default function PostFaqs({ faqs, lang }: PostFaqsProps) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const dir = LANG_CONFIG[lang].dir;

  return (
    <section dir={dir}>
      <h2 className="text-xl font-bold text-navy mb-5">
        {faqLabel[lang] ?? faqLabel.en}
      </h2>
      <div className="divide-y divide-border rounded-2xl border border-border overflow-hidden">
        {faqs.map((faq, i) => {
          const isOpen = openIdx === i;
          return (
            <div key={i} className="bg-white">
              <button
                type="button"
                onClick={() => setOpenIdx(isOpen ? null : i)}
                className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-surface transition-colors"
                aria-expanded={isOpen}
              >
                <span className="font-medium text-navy text-sm leading-snug text-start">
                  {faq.question}
                </span>
                <span
                  className={`flex-shrink-0 w-6 h-6 rounded-full border border-border flex items-center justify-center transition-transform ${
                    isOpen ? "rotate-180 bg-navy border-navy" : ""
                  }`}
                >
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={isOpen ? "white" : "currentColor"}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </span>
              </button>
              {isOpen && (
                <div className="px-5 pb-4 text-sm text-ink leading-relaxed">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
