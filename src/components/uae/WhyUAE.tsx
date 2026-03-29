"use client";

import { useLanguage } from "@/contexts/LanguageContext";

const ADVANTAGES = [
  { icon: "\u{1F6AB}\u{1F4B0}", titleKey: "adv_zero_tax_title",  descKey: "adv_zero_tax_desc" },
  { icon: "\u{1F30D}",          titleKey: "adv_ownership_title", descKey: "adv_ownership_desc" },
  { icon: "\u{1F6C2}",          titleKey: "adv_visa_free_title", descKey: "adv_visa_free_desc" },
  { icon: "\u{1F3E6}",          titleKey: "adv_banking_title",   descKey: "adv_banking_desc" },
  { icon: "\u{26A1}",           titleKey: "adv_speed_title",     descKey: "adv_speed_desc" },
  { icon: "\u{1F468}\u200D\u{1F469}\u200D\u{1F467}\u200D\u{1F466}", titleKey: "adv_family_title", descKey: "adv_family_desc" },
  { icon: "\u{1F310}",          titleKey: "adv_location_title",  descKey: "adv_location_desc" },
  { icon: "\u{1F4C8}",          titleKey: "adv_market_title",    descKey: "adv_market_desc" },
] as const;

export default function WhyUAE() {
  const { t, isRTL } = useLanguage();

  return (
    <section dir={isRTL ? "rtl" : "ltr"} className="py-16 px-4 bg-white">
      <div className="max-w-[1200px] mx-auto">
        <h2 className="text-center text-2xl font-bold text-navy mb-10">
          {t.why_uae_section_title}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {ADVANTAGES.map((adv) => (
            <div
              key={adv.titleKey}
              className={`bg-muted/40 rounded-xl p-6 ${isRTL ? "border-r-4" : "border-l-4"} border-gold`}
            >
              <div className="text-3xl mb-2">{adv.icon}</div>
              <h3 className="text-base font-bold text-navy mb-1">
                {t[adv.titleKey]}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t[adv.descKey]}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
