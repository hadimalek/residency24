"use client";

import { useRouter } from "next/navigation";
import { type FormEvent, useCallback, useTransition } from "react";
import type { CmsCategory } from "@/lib/cms/api";
import type { Lang } from "@/translations";
import { LANG_CONFIG } from "@/lib/seo";

interface BlogFiltersProps {
  categories: CmsCategory[];
  activeCategory: string;
  activeQ: string;
  lang: Lang;
  seo: { searchPlaceholder: string; allLabel: string };
  basePath: string;
}

export default function BlogFilters({
  categories,
  activeCategory,
  activeQ,
  lang,
  seo,
  basePath,
}: BlogFiltersProps) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const dir = LANG_CONFIG[lang].dir;

  const navigate = useCallback(
    (category: string, q: string) => {
      const sp = new URLSearchParams();
      if (category) sp.set("category", category);
      if (q) sp.set("q", q);
      const qs = sp.toString();
      startTransition(() => {
        router.push(`${basePath}${qs ? `?${qs}` : ""}`);
      });
    },
    [basePath, router]
  );

  const handleCategory = (slug: string) => navigate(slug, activeQ);

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const q = (e.currentTarget.elements.namedItem("q") as HTMLInputElement).value.trim();
    navigate(activeCategory, q);
  };

  return (
    <div
      className="bg-white rounded-2xl shadow-lg border border-border px-5 py-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center"
      dir={dir}
    >
      {/* Category chips */}
      <div className="flex items-center gap-2 flex-wrap flex-1 min-w-0">
        <button
          type="button"
          onClick={() => handleCategory("")}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
            activeCategory === ""
              ? "bg-navy text-white"
              : "bg-surface text-ink hover:bg-navy/10"
          }`}
        >
          {seo.allLabel}
        </button>
        {categories.map((cat) => (
          <button
            key={cat.slug}
            type="button"
            onClick={() => handleCategory(cat.slug)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
              activeCategory === cat.slug
                ? "bg-navy text-white"
                : "bg-surface text-ink hover:bg-navy/10"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex items-center gap-2 flex-shrink-0 w-full sm:w-auto">
        <div className="relative w-full sm:w-56">
          <input
            type="search"
            name="q"
            defaultValue={activeQ}
            placeholder={seo.searchPlaceholder}
            className="w-full h-9 rounded-full border border-border bg-surface pl-9 pr-4 text-sm text-ink placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-navy/30"
            style={{ direction: dir }}
          />
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </div>
        <button
          type="submit"
          className="h-9 w-9 flex items-center justify-center rounded-full bg-navy text-white hover:bg-navy/90 transition-colors flex-shrink-0"
          aria-label="Search"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
          </svg>
        </button>
      </form>
    </div>
  );
}
