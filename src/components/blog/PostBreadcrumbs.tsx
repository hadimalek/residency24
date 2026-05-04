import type { CmsBreadcrumb } from "@/lib/cms/api";
import type { Lang } from "@/translations";
import { LANG_CONFIG } from "@/lib/seo";

interface PostBreadcrumbsProps {
  breadcrumbs: CmsBreadcrumb[];
  lang: Lang;
  blogListPath: string;
}

export default function PostBreadcrumbs({ breadcrumbs, lang, blogListPath }: PostBreadcrumbsProps) {
  const dir = LANG_CONFIG[lang].dir;
  const items = breadcrumbs.length > 0 ? breadcrumbs : [];

  if (items.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" dir={dir}>
      <ol className="flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
        {items.map((crumb, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={i} className="flex items-center gap-1">
              {i > 0 && (
                <span className="text-muted-foreground/50 select-none" aria-hidden="true">
                  {dir === "rtl" ? "‹" : "›"}
                </span>
              )}
              {isLast ? (
                <span className="text-navy font-medium line-clamp-1 max-w-[200px]" aria-current="page">
                  {crumb.label}
                </span>
              ) : (
                <a
                  href={crumb.href}
                  className="hover:text-navy transition-colors truncate max-w-[140px]"
                >
                  {crumb.label}
                </a>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
