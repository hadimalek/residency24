"use client";

import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";

const DESTINATIONS = [
  {
    id: "oman",
    flag: "\u{1F1F4}\u{1F1F2}",
    badgeBg: "bg-green-800",
    titleKey: "cs_oman_title",
    descKey: "cs_oman_desc",
    tagKey: "cs_oman_tag",
  },
  {
    id: "turkey",
    flag: "\u{1F1F9}\u{1F1F7}",
    badgeBg: "bg-red-800",
    titleKey: "cs_turkey_title",
    descKey: "cs_turkey_desc",
    tagKey: "cs_turkey_tag",
  },
] as const;

export default function CrossSellCTA() {
  const { lang, t, isRTL } = useLanguage();

  return (
    <section dir={isRTL ? "rtl" : "ltr"} className="py-16 px-4 bg-muted/30">
      <div className="max-w-[900px] mx-auto">
        <h2 className="text-center text-2xl font-bold text-navy mb-2">
          {t.cs_section_title}
        </h2>
        <p className="text-center text-muted-foreground text-sm mb-8">
          {t.cs_section_sub}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {DESTINATIONS.map((dest) => (
            <div
              key={dest.id}
              className="bg-white rounded-2xl p-7 border border-border shadow-sm"
            >
              <div className={`flex items-center gap-3 mb-3 ${isRTL ? "flex-row-reverse" : ""}`}>
                <span className="text-3xl">{dest.flag}</span>
                <div>
                  <h3 className="text-base font-bold text-navy">
                    {t[dest.titleKey]}
                  </h3>
                  <span className={`text-[0.7rem] font-bold ${dest.badgeBg} text-white px-2 py-0.5 rounded-full`}>
                    {t[dest.tagKey]}
                  </span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                {t[dest.descKey]}
              </p>
              <Link
                href={`/${lang}/${dest.id}/`}
                className="block w-full text-center bg-navy text-gold rounded-xl py-2.5 font-bold text-sm hover:bg-navy/90 transition-colors"
              >
                {t.cs_explore_btn} →
              </Link>
            </div>
          ))}
        </div>

        <div className="text-center mt-6">
          <Link
            href={`/${lang}/compare/uae-vs-oman-vs-turkey/`}
            className="inline-block border-2 border-navy text-navy rounded-xl px-7 py-2.5 font-bold text-sm hover:bg-navy hover:text-gold transition-colors"
          >
            {t.cs_compare_btn}
          </Link>
        </div>
      </div>
    </section>
  );
}
