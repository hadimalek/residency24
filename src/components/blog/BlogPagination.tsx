"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import type { CmsPaginationMeta } from "@/lib/cms/api";

interface BlogPaginationProps {
  meta: CmsPaginationMeta;
  basePath: string;
  currentCategory: string;
  currentQ: string;
}

function buildUrl(basePath: string, page: number, category: string, q: string): string {
  const sp = new URLSearchParams();
  if (category) sp.set("category", category);
  if (q) sp.set("q", q);
  if (page > 1) sp.set("page", String(page));
  const qs = sp.toString();
  return `${basePath}${qs ? `?${qs}` : ""}`;
}

export default function BlogPagination({ meta, basePath, currentCategory, currentQ }: BlogPaginationProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const goTo = (page: number) => {
    startTransition(() => {
      router.push(buildUrl(basePath, page, currentCategory, currentQ));
    });
  };

  const { current_page: current, last_page: last } = meta;

  // Build page numbers with ellipsis
  const pages: (number | "…")[] = [];
  if (last <= 7) {
    for (let i = 1; i <= last; i++) pages.push(i);
  } else {
    pages.push(1);
    if (current > 3) pages.push("…");
    for (let i = Math.max(2, current - 1); i <= Math.min(last - 1, current + 1); i++) pages.push(i);
    if (current < last - 2) pages.push("…");
    pages.push(last);
  }

  const btnBase = "w-9 h-9 rounded-lg text-sm font-medium flex items-center justify-center transition-colors";
  const activeBtn = `${btnBase} bg-navy text-white`;
  const idleBtn = `${btnBase} text-ink hover:bg-navy/10`;
  const disabledBtn = `${btnBase} text-muted-foreground cursor-not-allowed`;

  return (
    <nav
      aria-label="Pagination"
      className={`flex items-center justify-center gap-1 ${isPending ? "opacity-60 pointer-events-none" : ""}`}
    >
      {/* Prev */}
      <button
        type="button"
        onClick={() => goTo(current - 1)}
        disabled={current <= 1}
        className={current <= 1 ? disabledBtn : idleBtn}
        aria-label="Previous page"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>

      {pages.map((p, i) =>
        p === "…" ? (
          <span key={`ellipsis-${i}`} className="w-9 h-9 flex items-center justify-center text-muted-foreground text-sm">
            …
          </span>
        ) : (
          <button
            key={p}
            type="button"
            onClick={() => p !== current && goTo(p)}
            className={p === current ? activeBtn : idleBtn}
            aria-current={p === current ? "page" : undefined}
          >
            {p}
          </button>
        )
      )}

      {/* Next */}
      <button
        type="button"
        onClick={() => goTo(current + 1)}
        disabled={current >= last}
        className={current >= last ? disabledBtn : idleBtn}
        aria-label="Next page"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>
    </nav>
  );
}
