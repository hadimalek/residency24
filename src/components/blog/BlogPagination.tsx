import Link from "next/link";
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

const btnBase = "w-9 h-9 rounded-lg text-sm font-medium flex items-center justify-center transition-colors";
const activeBtn = `${btnBase} bg-navy text-white`;
const idleBtn = `${btnBase} text-ink hover:bg-navy/10`;
const disabledBtn = `${btnBase} text-muted-foreground cursor-not-allowed`;

const ChevronLeft = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const ChevronRight = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

/**
 * Blog pagination.
 *
 * Every navigable page MUST be a real <a href> (via next/link). This used to be
 * a client component rendering <button onClick={router.push()}>, which meant
 * page 2..N existed (they return 200) but nothing in the HTML pointed at them —
 * so of 287 published Persian posts only the first `PER_PAGE` were reachable
 * from the blog index by a crawler, and the rest had no internal inlinks at all.
 *
 * No hooks are needed, so this is a Server Component: zero JS shipped for it.
 * `prefetch={false}` keeps a 12-link pagination row from prefetching a dozen
 * dynamic routes the moment it scrolls into view.
 */
export default function BlogPagination({ meta, basePath, currentCategory, currentQ }: BlogPaginationProps) {
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

  const href = (page: number) => buildUrl(basePath, page, currentCategory, currentQ);

  return (
    <nav aria-label="Pagination" className="flex items-center justify-center gap-1">
      {/* Prev */}
      {current > 1 ? (
        <Link href={href(current - 1)} rel="prev" prefetch={false} className={idleBtn} aria-label="Previous page">
          <ChevronLeft />
        </Link>
      ) : (
        <span className={disabledBtn} aria-disabled="true" aria-label="Previous page">
          <ChevronLeft />
        </span>
      )}

      {pages.map((p, i) =>
        p === "…" ? (
          <span key={`ellipsis-${i}`} className="w-9 h-9 flex items-center justify-center text-muted-foreground text-sm">
            …
          </span>
        ) : p === current ? (
          <span key={p} className={activeBtn} aria-current="page">
            {p}
          </span>
        ) : (
          <Link key={p} href={href(p)} prefetch={false} className={idleBtn} aria-label={`Page ${p}`}>
            {p}
          </Link>
        )
      )}

      {/* Next */}
      {current < last ? (
        <Link href={href(current + 1)} rel="next" prefetch={false} className={idleBtn} aria-label="Next page">
          <ChevronRight />
        </Link>
      ) : (
        <span className={disabledBtn} aria-disabled="true" aria-label="Next page">
          <ChevronRight />
        </span>
      )}
    </nav>
  );
}
