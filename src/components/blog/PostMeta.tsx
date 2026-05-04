import type { CmsCategory, CmsTag } from "@/lib/cms/api";
import type { Lang } from "@/translations";
import { LANG_CONFIG, localizedPath } from "@/lib/seo";

interface PostMetaProps {
  category: CmsCategory | null;
  tags: CmsTag[];
  lang: Lang;
}

const tagLabel: Record<string, string> = {
  fa: "برچسب‌ها",
  ar: "الوسوم",
  ru: "Метки",
  en: "Tags",
};

export default function PostMeta({ category, tags, lang }: PostMetaProps) {
  const dir = LANG_CONFIG[lang].dir;
  const blogBase = localizedPath(lang, "blog");

  if (!category && tags.length === 0) return null;

  return (
    <div
      className="flex flex-wrap items-center gap-2 mt-8 pt-6 border-t border-border"
      dir={dir}
    >
      {category && (
        <a
          href={`${blogBase}?category=${encodeURIComponent(category.slug)}`}
          className="inline-flex items-center gap-1.5 bg-gold-lt text-navy text-xs font-semibold px-3 py-1.5 rounded-full hover:bg-gold transition-colors"
        >
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
            <line x1="7" y1="7" x2="7.01" y2="7" />
          </svg>
          {category.name}
        </a>
      )}

      {tags.length > 0 && (
        <>
          <span className="text-xs text-muted-foreground font-medium ms-2">
            {tagLabel[lang] ?? tagLabel.en}:
          </span>
          {tags.map((tag) => (
            <a
              key={tag.slug}
              href={`${blogBase}?tag=${encodeURIComponent(tag.slug)}`}
              className="inline-flex items-center bg-surface text-ink text-xs px-2.5 py-1 rounded-full border border-border hover:border-navy hover:text-navy transition-colors"
            >
              #{tag.name}
            </a>
          ))}
        </>
      )}
    </div>
  );
}
