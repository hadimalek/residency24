import type { CmsBreadcrumb } from "@/lib/cms/api";
import type { Lang } from "@/translations";
import { LANG_CONFIG } from "@/lib/seo";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PostBreadcrumbsProps {
  breadcrumbs: CmsBreadcrumb[];
  lang: Lang;
  blogListPath: string;
}

export default function PostBreadcrumbs({ breadcrumbs, lang }: PostBreadcrumbsProps) {
  const dir = LANG_CONFIG[lang].dir;
  const items = breadcrumbs.length > 0 ? breadcrumbs : [];

  if (items.length === 0) return null;

  // In RTL the visual flow is right→left, so the inter-item arrow should
  // point LEFT (the direction reading proceeds). LTR is the mirror.
  const Sep = dir === "rtl" ? ChevronLeft : ChevronRight;

  return (
    <nav aria-label="Breadcrumb" dir={dir}>
      <ol className="flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
        {items.map((crumb, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={i} className="flex items-center gap-1">
              {i > 0 && (
                <Sep
                  className="h-4 w-4 text-muted-foreground/50 select-none"
                  aria-hidden="true"
                />
              )}
              {isLast ? (
                <span className="text-navy font-medium line-clamp-1 max-w-[260px]" aria-current="page">
                  {crumb.label}
                </span>
              ) : (
                <a
                  href={crumb.href}
                  className="hover:text-navy transition-colors truncate max-w-[180px]"
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
