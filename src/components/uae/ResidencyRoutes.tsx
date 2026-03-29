"use client";

import { useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";

const ROUTES = [
  {
    id: "gv_property",
    titleKey: "route_gv_property",
    investKey: "route_gv_property_invest",
    durationKey: "route_gv_property_duration",
    timeKey: "route_gv_property_time",
    slug: "uae/golden-visa",
    highlight: true,
    badge: "\u{2B50}",
  },
  {
    id: "gv_company",
    titleKey: "route_gv_company",
    investKey: "route_gv_company_invest",
    durationKey: "route_gv_company_duration",
    timeKey: "route_gv_company_time",
    slug: "uae/golden-visa",
    highlight: false,
    badge: null,
  },
  {
    id: "investor",
    titleKey: "route_investor",
    investKey: "route_investor_invest",
    durationKey: "route_investor_duration",
    timeKey: "route_investor_time",
    slug: "uae/company-registration",
    highlight: false,
    badge: null,
  },
  {
    id: "prop_visa",
    titleKey: "route_property_visa",
    investKey: "route_property_visa_invest",
    durationKey: "route_property_visa_dur",
    timeKey: "route_property_visa_time",
    slug: "uae/buy-property",
    highlight: false,
    badge: null,
  },
] as const;

export default function ResidencyRoutes() {
  const { lang, t, isRTL } = useLanguage();
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <section dir={isRTL ? "rtl" : "ltr"} className="py-16 px-4 bg-muted/30">
      <div className="max-w-[1100px] mx-auto">
        <h2 className="text-center text-2xl font-bold text-navy mb-8">
          {t.routes_section_title}
        </h2>

        {/* Desktop table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b-2 border-gold/30">
                <th className="text-start p-3 text-sm font-bold text-navy">{t.routes_col_route}</th>
                <th className="text-center p-3 text-sm font-bold text-navy">{t.routes_col_invest}</th>
                <th className="text-center p-3 text-sm font-bold text-navy">{t.routes_col_duration}</th>
                <th className="text-center p-3 text-sm font-bold text-navy">{t.routes_col_time}</th>
                <th className="text-center p-3 text-sm font-bold text-navy">{t.routes_col_action}</th>
              </tr>
            </thead>
            <tbody>
              {ROUTES.map((route) => (
                <tr
                  key={route.id}
                  className={`border-b border-border transition-colors ${
                    route.highlight ? "bg-navy text-white" : "hover:bg-muted/50"
                  }`}
                >
                  <td className="p-3">
                    <span className={`font-bold text-sm ${route.highlight ? "text-gold" : "text-navy"}`}>
                      {route.badge && <span className="me-1.5">{route.badge}</span>}
                      {t[route.titleKey]}
                    </span>
                  </td>
                  <td className={`p-3 text-center text-sm ${route.highlight ? "text-white/75" : "text-muted-foreground"}`}>
                    {t[route.investKey]}
                  </td>
                  <td className={`p-3 text-center text-sm ${route.highlight ? "text-white/75" : "text-muted-foreground"}`}>
                    {t[route.durationKey]}
                  </td>
                  <td className={`p-3 text-center text-sm ${route.highlight ? "text-white/75" : "text-muted-foreground"}`}>
                    {t[route.timeKey]}
                  </td>
                  <td className="p-3 text-center">
                    <Link
                      href={`/${lang}/${route.slug}/`}
                      className={`inline-block rounded-lg px-4 py-1.5 text-xs font-bold transition-colors ${
                        route.highlight
                          ? "bg-gold text-navy hover:bg-gold-dk"
                          : "bg-navy text-gold hover:bg-navy/90"
                      }`}
                    >
                      {t.routes_btn_details}
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile accordion */}
        <div className="flex flex-col gap-3 md:hidden">
          {ROUTES.map((route) => (
            <div
              key={route.id}
              className={`rounded-xl overflow-hidden ${
                route.highlight
                  ? "bg-navy shadow-lg shadow-navy/20"
                  : "bg-white border border-border shadow-sm"
              }`}
            >
              <button
                onClick={() => setExpanded(expanded === route.id ? null : route.id)}
                className="w-full flex items-center justify-between p-4"
              >
                <span className={`font-bold text-sm ${route.highlight ? "text-gold" : "text-navy"}`}>
                  {route.badge && <span className="me-1.5">{route.badge}</span>}
                  {t[route.titleKey]}
                </span>
                <span className={`text-xs transition-transform ${expanded === route.id ? "rotate-180" : ""} ${route.highlight ? "text-white/60" : "text-muted-foreground"}`}>
                  &#9660;
                </span>
              </button>

              {expanded === route.id && (
                <div className={`px-4 pb-4 grid grid-cols-3 gap-3 ${route.highlight ? "border-t border-white/10" : "border-t border-border"}`}>
                  {([
                    { label: t.routes_col_invest, val: t[route.investKey] },
                    { label: t.routes_col_duration, val: t[route.durationKey] },
                    { label: t.routes_col_time, val: t[route.timeKey] },
                  ] as const).map((item) => (
                    <div key={item.label} className="text-center pt-3">
                      <div className={`text-[0.65rem] mb-1 ${route.highlight ? "text-white/50" : "text-muted-foreground"}`}>
                        {item.label}
                      </div>
                      <div className={`text-sm font-semibold ${route.highlight ? "text-gold" : "text-navy"}`}>
                        {item.val}
                      </div>
                    </div>
                  ))}
                  <div className="col-span-3 mt-2">
                    <Link
                      href={`/${lang}/${route.slug}/`}
                      className={`block text-center rounded-lg py-2 text-xs font-bold transition-colors ${
                        route.highlight
                          ? "bg-gold text-navy hover:bg-gold-dk"
                          : "bg-navy text-gold hover:bg-navy/90"
                      }`}
                    >
                      {t.routes_btn_details}
                    </Link>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
