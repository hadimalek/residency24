"use client";

import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";

const SERVICES = [
  {
    id: "golden-visa",
    icon: "\u{1F3C6}",
    slug: "golden-visa",
    badgeKey: "service_badge_popular",
    priceKey: "golden_visa_price",
    titleKey: "service_golden_visa_title",
    descKey: "service_golden_visa_desc",
    highlights: ["uae_gv_highlight_1", "uae_gv_highlight_2", "uae_gv_highlight_3"],
    accentColor: "text-gold",
    borderColor: "hover:border-gold",
    badgeBg: "bg-gold text-navy",
  },
  {
    id: "company-registration",
    icon: "\u{1F3E2}",
    slug: "company-registration",
    badgeKey: "service_badge_fast",
    priceKey: "company_reg_price",
    titleKey: "service_company_title",
    descKey: "service_company_desc",
    highlights: ["uae_co_highlight_1", "uae_co_highlight_2", "uae_co_highlight_3"],
    accentColor: "text-blue-500",
    borderColor: "hover:border-blue-500",
    badgeBg: "bg-blue-500 text-white",
  },
  {
    id: "buy-property",
    icon: "\u{1F3D9}\u{FE0F}",
    slug: "buy-property",
    badgeKey: "service_badge_investment",
    priceKey: "property_price",
    titleKey: "service_property_title",
    descKey: "service_property_desc",
    highlights: ["uae_prop_highlight_1", "uae_prop_highlight_2", "uae_prop_highlight_3"],
    accentColor: "text-emerald-500",
    borderColor: "hover:border-emerald-500",
    badgeBg: "bg-emerald-500 text-white",
  },
  {
    id: "tourist-visa",
    icon: "\u{2708}\u{FE0F}",
    slug: "tourist-visa",
    badgeKey: "service_badge_quick",
    priceKey: "tourist_visa_price",
    titleKey: "service_tourist_title",
    descKey: "service_tourist_desc",
    highlights: ["uae_tv_highlight_1", "uae_tv_highlight_2", "uae_tv_highlight_3"],
    accentColor: "text-orange-500",
    borderColor: "hover:border-orange-500",
    badgeBg: "bg-orange-500 text-white",
  },
] as const;

export default function UAEServicesGrid() {
  const { lang, t, isRTL } = useLanguage();

  return (
    <section dir={isRTL ? "rtl" : "ltr"} className="py-16 px-4 bg-muted/30">
      <div className="max-w-[1200px] mx-auto">
        <h2 className="text-center text-2xl font-bold text-navy mb-10">
          {t.uae_services_heading}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {SERVICES.map((svc) => {
            const href = svc.slug.startsWith("../")
              ? `/${lang}/${svc.slug.replace("../", "")}/`
              : `/${lang}/uae/${svc.slug}/`;

            return (
              <Link
                key={svc.id}
                href={href}
                className={`group relative bg-white rounded-2xl p-7 border-2 border-transparent shadow-sm
                  transition-all duration-200 ${svc.borderColor} hover:-translate-y-1 hover:shadow-lg`}
              >
                {/* Badge */}
                <span className={`absolute top-4 ${isRTL ? "start-4" : "end-4"} ${svc.badgeBg} text-[0.7rem] font-bold px-2.5 py-0.5 rounded-full`}>
                  {t[svc.badgeKey]}
                </span>

                {/* Icon */}
                <div className="text-4xl mb-3">{svc.icon}</div>

                {/* Title */}
                <h3 className="text-base font-bold text-navy mb-2">
                  {t[svc.titleKey]}
                </h3>

                {/* Description */}
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                  {t[svc.descKey]}
                </p>

                {/* Highlights */}
                <ul className="space-y-1 mb-5">
                  {svc.highlights.map((hk) => (
                    <li key={hk} className="flex items-center gap-1.5 text-[0.8rem] text-foreground">
                      <span className={`${svc.accentColor} font-bold`}>&#10003;</span>
                      {t[hk]}
                    </li>
                  ))}
                </ul>

                {/* Price + CTA */}
                <div className="flex items-center justify-between mt-auto">
                  <span className={`text-sm font-bold ${svc.accentColor}`}>
                    {t[svc.priceKey]}
                  </span>
                  <span className="bg-navy text-gold rounded-lg px-3 py-1.5 text-xs font-semibold group-hover:bg-navy/90 transition-colors">
                    {t.service_cta_learn_more}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
