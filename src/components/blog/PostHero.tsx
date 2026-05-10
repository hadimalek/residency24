import type { CmsPostDetail } from "@/lib/cms/api";
import type { Lang } from "@/translations";
import { LANG_CONFIG } from "@/lib/seo";

interface PostHeroProps {
  post: CmsPostDetail;
  lang: Lang;
}

function formatDate(dateStr: string | null, lang: Lang): string {
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr);
    const locale = LANG_CONFIG[lang].locale.replace("_", "-");
    return d.toLocaleDateString(locale, { year: "numeric", month: "long", day: "numeric" });
  } catch {
    return dateStr.slice(0, 10);
  }
}

export default function PostHero({ post, lang }: PostHeroProps) {
  const dir = LANG_CONFIG[lang].dir;

  return (
    <header className="relative w-full" dir={dir}>
      {/* Featured image */}
      <div className="relative h-64 md:h-96 w-full overflow-hidden bg-navy">
        {post.featured_image ? (
          <img
            src={post.featured_image.url}
            alt={post.featured_image.alt ?? post.title}
            width={post.featured_image.width ?? 1200}
            height={post.featured_image.height ?? 630}
            className="w-full h-full object-cover"
            fetchPriority="high"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-navy to-navy-lt" />
        )}
        {/* Dark overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/40 to-transparent" />
      </div>

      {/* Meta overlay — category + title + author/date */}
      <div className="absolute bottom-0 inset-x-0 px-4 pb-8 md:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Category badge */}
          {post.category && (
            <span className="inline-block bg-gold text-navy text-xs font-bold px-3 py-1 rounded-full mb-3">
              {post.category.name}
            </span>
          )}

          {/* Title */}
          <h1 className="text-white text-2xl md:text-4xl font-bold leading-tight mb-4 max-w-3xl">
            {post.title}
          </h1>

          {/* Author / date / reading time */}
          <div className="flex flex-wrap items-center gap-4 text-white/75 text-sm">
            {post.author && (
              <span className="flex items-center gap-1.5">
                {post.author.avatar ? (
                  <img
                    src={post.author.avatar.url}
                    alt={post.author.name}
                    width={24}
                    height={24}
                    className="rounded-full w-6 h-6 object-cover"
                  />
                ) : (
                  <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold text-white">
                    {post.author.name.charAt(0).toUpperCase()}
                  </span>
                )}
                {post.author.name}
              </span>
            )}
            {post.published_at && (
              <span className="flex items-center gap-1">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                <time dateTime={post.published_at}>{formatDate(post.published_at, lang)}</time>
              </span>
            )}
            {post.reading_time_minutes && (
              <span className="flex items-center gap-1">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                </svg>
                {post.reading_time_minutes} min
              </span>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
