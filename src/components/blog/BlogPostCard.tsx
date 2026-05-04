import type { CmsPostListItem } from "@/lib/cms/api";
import type { Lang } from "@/translations";
import { LANG_CONFIG } from "@/lib/seo";

const CATEGORY_COLORS = [
  "bg-blue-100 text-blue-700",
  "bg-emerald-100 text-emerald-700",
  "bg-amber-100 text-amber-700",
  "bg-purple-100 text-purple-700",
  "bg-rose-100 text-rose-700",
  "bg-teal-100 text-teal-700",
];

function categoryColor(slug: string): string {
  let hash = 0;
  for (let i = 0; i < slug.length; i++) hash = slug.charCodeAt(i) + ((hash << 5) - hash);
  return CATEGORY_COLORS[Math.abs(hash) % CATEGORY_COLORS.length];
}

function formatDate(dateStr: string | null, lang: Lang): string {
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr);
    const locale = LANG_CONFIG[lang].locale.replace("_", "-");
    return d.toLocaleDateString(locale, { year: "numeric", month: "short", day: "numeric" });
  } catch {
    return dateStr.slice(0, 10);
  }
}

interface BlogPostCardProps {
  post: CmsPostListItem;
  lang: Lang;
  readMore: string;
  readingTimeUnit: string;
}

export default function BlogPostCard({ post, lang, readMore, readingTimeUnit }: BlogPostCardProps) {
  const dir = LANG_CONFIG[lang].dir;
  const colorClass = post.category ? categoryColor(post.category.slug) : "bg-slate-100 text-slate-600";

  return (
    <article
      className="bg-white rounded-2xl overflow-hidden border border-border shadow-sm hover:shadow-md transition-shadow flex flex-col h-full"
      dir={dir}
    >
      {/* Thumbnail */}
      <a href={post.url} className="block aspect-[16/9] overflow-hidden bg-navy/10 flex-shrink-0">
        {post.featured_image ? (
          <img
            src={post.featured_image.url}
            alt={post.featured_image.alt ?? post.title}
            width={post.featured_image.width ?? 640}
            height={post.featured_image.height ?? 360}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-navy/20 to-navy/5" />
        )}
      </a>

      <div className="p-5 flex flex-col flex-1 gap-3">
        {/* Category + reading time */}
        <div className="flex items-center gap-2 flex-wrap">
          {post.category && (
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${colorClass}`}>
              {post.category.name}
            </span>
          )}
          {post.reading_time_minutes && (
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
              </svg>
              {post.reading_time_minutes} {readingTimeUnit}
            </span>
          )}
        </div>

        {/* Title */}
        <h2 className="font-bold text-navy text-base leading-snug line-clamp-2">
          <a href={post.url} className="hover:text-gold transition-colors">
            {post.title}
          </a>
        </h2>

        {/* Excerpt */}
        {post.excerpt && (
          <p className="text-sm text-muted-foreground line-clamp-3 flex-1">
            {post.excerpt}
          </p>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between mt-auto pt-2 border-t border-border">
          <time className="text-xs text-muted-foreground" dateTime={post.published_at ?? undefined}>
            {formatDate(post.published_at, lang)}
          </time>
          <a
            href={post.url}
            className="text-xs font-semibold text-gold hover:text-gold-dk transition-colors"
          >
            {readMore} →
          </a>
        </div>
      </div>
    </article>
  );
}
