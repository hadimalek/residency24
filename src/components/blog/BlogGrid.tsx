import type { CmsPostListItem } from "@/lib/cms/api";
import type { Lang } from "@/translations";
import { LANG_CONFIG } from "@/lib/seo";
import BlogPostCard from "./BlogPostCard";

interface BlogGridProps {
  posts: CmsPostListItem[];
  lang: Lang;
  seo: { readMore: string; readingTimeUnit: string; noResults: string; noResultsSub: string };
}

export default function BlogGrid({ posts, lang, seo }: BlogGridProps) {
  const dir = LANG_CONFIG[lang].dir;

  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center" dir={dir}>
        <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-muted-foreground/40 mb-4" aria-hidden="true">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="9" y1="13" x2="15" y2="13" />
          <line x1="9" y1="17" x2="12" y2="17" />
        </svg>
        <p className="text-lg font-semibold text-navy mb-1">{seo.noResults}</p>
        <p className="text-sm text-muted-foreground">{seo.noResultsSub}</p>
      </div>
    );
  }

  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      dir={dir}
    >
      {posts.map((post) => (
        <BlogPostCard
          key={post.id}
          post={post}
          lang={lang}
          readMore={seo.readMore}
          readingTimeUnit={seo.readingTimeUnit}
        />
      ))}
    </div>
  );
}
