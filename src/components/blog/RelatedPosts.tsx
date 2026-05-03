import type { CmsPostListItem } from "@/lib/cms/api";
import type { Lang } from "@/translations";
import { LANG_CONFIG } from "@/lib/seo";
import BlogPostCard from "./BlogPostCard";

interface RelatedPostsProps {
  posts: CmsPostListItem[];
  lang: Lang;
  readMore: string;
  readingTimeUnit: string;
}

const heading: Record<string, string> = {
  fa: "مقالات مرتبط",
  ar: "مقالات ذات صلة",
  ru: "Похожие статьи",
  en: "Related Articles",
};

export default function RelatedPosts({ posts, lang, readMore, readingTimeUnit }: RelatedPostsProps) {
  const dir = LANG_CONFIG[lang].dir;
  if (posts.length === 0) return null;

  return (
    <section className="mt-16" dir={dir}>
      <h2 className="text-xl font-bold text-navy mb-6 flex items-center gap-2">
        <span className="w-1 h-6 bg-gold rounded-full" aria-hidden="true" />
        {heading[lang] ?? heading.en}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.slice(0, 3).map((post) => (
          <BlogPostCard
            key={post.id}
            post={post}
            lang={lang}
            readMore={readMore}
            readingTimeUnit={readingTimeUnit}
          />
        ))}
      </div>
    </section>
  );
}
