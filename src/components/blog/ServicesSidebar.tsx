import { getServicesForPost } from "@/lib/blog/services";
import type { Lang } from "@/translations";
import { LANG_CONFIG } from "@/lib/seo";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface ServicesSidebarProps {
  lang: Lang;
  /** Category slug of the current post; used to prioritize the most relevant
   *  services for this article. */
  categorySlug: string | null;
}

const heading: Record<string, string> = {
  fa: "خدمات مرتبط",
  ar: "خدمات ذات صلة",
  ru: "Популярные услуги",
  en: "Featured services",
};

export default function ServicesSidebar({ lang, categorySlug }: ServicesSidebarProps) {
  const services = getServicesForPost(lang, categorySlug);
  const dir = LANG_CONFIG[lang].dir;
  const Arrow = dir === "rtl" ? ArrowLeft : ArrowRight;

  if (services.length === 0) return null;

  return (
    <aside dir={dir} className="space-y-3">
      <h3 className="text-xs font-bold text-navy/60 uppercase tracking-widest mb-3 px-1">
        {heading[lang] ?? heading.en}
      </h3>
      <div className="space-y-3">
        {services.map((s) => (
          <a
            key={s.id}
            href={s.href}
            className="group block rounded-2xl bg-white border border-border shadow-sm hover:shadow-md hover:border-gold transition-all p-4 relative overflow-hidden"
          >
            {/* gold accent strip */}
            <span
              className={`absolute top-0 ${dir === "rtl" ? "right-0" : "left-0"} h-full w-1 bg-gradient-to-b from-gold to-gold-dk`}
              aria-hidden="true"
            />
            <div className={dir === "rtl" ? "pr-2" : "pl-2"}>
              <div className="flex items-center justify-between gap-2">
                <h4 className="font-bold text-navy text-sm leading-snug">{s.title}</h4>
                <Arrow className="h-4 w-4 text-gold group-hover:text-navy transition-colors flex-shrink-0" />
              </div>
              <p className="text-xs text-gold-dk font-medium mt-1.5">{s.subtitle}</p>
            </div>
          </a>
        ))}
      </div>
    </aside>
  );
}
