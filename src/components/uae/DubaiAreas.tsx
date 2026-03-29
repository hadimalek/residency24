"use client";

import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";

const AREAS = [
  { id: "downtown", nameKey: "area_downtown_name", priceKey: "area_downtown_price", roiKey: "area_downtown_roi", typeKey: "area_downtown_type", badgeKey: "areas_badge_premium", emoji: "\u{1F3D9}\u{FE0F}" },
  { id: "marina",   nameKey: "area_marina_name",   priceKey: "area_marina_price",   roiKey: "area_marina_roi",   typeKey: "area_marina_type",   badgeKey: "areas_badge_popular", emoji: "\u{26F5}" },
  { id: "palm",     nameKey: "area_palm_name",     priceKey: "area_palm_price",     roiKey: "area_palm_roi",     typeKey: "area_palm_type",     badgeKey: "areas_badge_luxury",  emoji: "\u{1F334}" },
  { id: "jvc",      nameKey: "area_jvc_name",      priceKey: "area_jvc_price",      roiKey: "area_jvc_roi",      typeKey: "area_jvc_type",      badgeKey: "areas_badge_roi",     emoji: "\u{1F3D8}\u{FE0F}" },
  { id: "bb",       nameKey: "area_bb_name",       priceKey: "area_bb_price",       roiKey: "area_bb_roi",       typeKey: "area_bb_type",       badgeKey: "areas_badge_business",emoji: "\u{1F3E2}" },
  { id: "creek",    nameKey: "area_creek_name",    priceKey: "area_creek_price",    roiKey: "area_creek_roi",    typeKey: "area_creek_type",    badgeKey: "areas_badge_new",     emoji: "\u{1F30A}" },
] as const;

export default function DubaiAreas() {
  const { lang, t, isRTL } = useLanguage();

  return (
    <section dir={isRTL ? "rtl" : "ltr"} className="py-16 px-4 bg-muted/30">
      <div className="max-w-[1200px] mx-auto">
        <h2 className="text-center text-2xl font-bold text-navy mb-8">
          {t.areas_section_title}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {AREAS.map((area) => (
            <Link
              key={area.id}
              href={`/${lang}/uae/buy-property/#${area.id}`}
              className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:-translate-y-1 hover:shadow-lg transition-all duration-200"
            >
              {/* Image placeholder */}
              <div className="h-36 bg-gradient-to-br from-navy to-navy-lt flex items-center justify-center text-5xl relative">
                {area.emoji}
                <span className={`absolute top-3 ${isRTL ? "start-3" : "end-3"} bg-gold text-navy text-[0.7rem] font-bold px-2.5 py-0.5 rounded-full`}>
                  {t[area.badgeKey]}
                </span>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="text-base font-bold text-navy mb-3">
                  {t[area.nameKey]}
                </h3>
                <div className="flex flex-col gap-1.5">
                  {([
                    { label: t.areas_price_from, val: t[area.priceKey] },
                    { label: t.areas_roi_label, val: t[area.roiKey] },
                    { label: t.areas_type_label, val: t[area.typeKey] },
                  ] as const).map((row) => (
                    <div key={row.label} className="flex justify-between text-[0.825rem]">
                      <span className="text-muted-foreground">{row.label}</span>
                      <span className="font-semibold text-foreground">{row.val}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
