import Link from "next/link";
import type { Lang } from "@/translations";
import { localizedPath } from "@/lib/locale-path";
import type { ReadingItem } from "@/lib/seo/landing-reading";

/** Heading and lead, kept here rather than in translations.ts: that object is
 *  serialised into every page's payload, and this is four short strings. */
const COPY: Record<Lang, { heading: string; lead: string; more: string }> = {
  fa: {
    heading: "بیشتر بخوانید",
    lead: "راهنماهای تفصیلی ما درباره همین موضوع.",
    more: "همه مقالات",
  },
  en: {
    heading: "Further reading",
    lead: "Our detailed guides on this subject.",
    more: "All articles",
  },
  ar: {
    heading: "قراءات ذات صلة",
    lead: "أدلتنا التفصيلية حول هذا الموضوع.",
    more: "جميع المقالات",
  },
  ru: {
    heading: "Что почитать",
    lead: "Наши подробные материалы по этой теме.",
    more: "Все статьи",
  },
};

/**
 * Links from a service landing page to the articles that cover its subject.
 *
 * Presentational only, and rendered on the server — these links have to be in
 * the HTML, since the whole point is that a crawler follows them. See
 * src/lib/seo/landing-reading.ts for why this block exists at all.
 */
export default function SharedRelatedReading({
  items,
  lang,
}: {
  items: ReadingItem[];
  lang: Lang;
}) {
  if (!items.length) return null;
  const c = COPY[lang] ?? COPY.en;

  return (
    <section className="py-14 bg-surface" aria-labelledby="further-reading">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h2 id="further-reading" className="text-2xl md:text-3xl font-bold text-navy">
            {c.heading}
          </h2>
          <p className="text-muted-foreground text-sm mt-2">{c.lead}</p>
        </div>

        <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((a) => (
            <li key={a.slug}>
              <Link
                href={localizedPath(lang, `blog/${a.slug}`)}
                className="group block h-full bg-white border border-border rounded-xl p-5 hover:border-gold hover:shadow-md transition-all"
              >
                <h3 className="text-[15px] font-bold text-navy leading-relaxed group-hover:text-gold-dk transition-colors">
                  {a.title}
                </h3>
                {a.excerpt && (
                  <p className="text-[13px] text-muted-foreground mt-2 leading-relaxed line-clamp-3">
                    {a.excerpt}
                  </p>
                )}
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-6">
          <Link
            href={localizedPath(lang, "blog")}
            className="text-sm font-bold text-navy hover:text-gold transition-colors"
          >
            {c.more}
          </Link>
        </div>
      </div>
    </section>
  );
}
