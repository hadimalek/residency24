/**
 * CMS API client — consumed by Next.js Server Components.
 * All calls are made server-side only. Never imported in client components.
 */

const CMS_API_URL = (process.env.CMS_API_URL ?? "").replace(/\/$/, "");

// ── Types ──────────────────────────────────────────────────────────────────

export interface CmsMedia {
  url: string;
  alt: string | null;
  width: number | null;
  height: number | null;
  mime_type: string;
}

export interface CmsAuthorBrief {
  name: string;
  slug: string;
}

export interface CmsCategory {
  name: string;
  slug: string;
  description: string | null;
}

export interface CmsTag {
  name: string;
  slug: string;
}

export interface CmsPostListItem {
  id: number;
  lang: string;
  type: string;
  title: string;
  slug: string;
  /** Path-only (no host), e.g. "/blog/slug" or "/fa/blog/slug" */
  url: string;
  excerpt: string | null;
  reading_time_minutes: number | null;
  published_at: string | null;
  updated_at: string | null;
  author: CmsAuthorBrief | null;
  category: CmsCategory | null;
  tags: CmsTag[];
  featured_image: CmsMedia | null;
  has_translations: boolean;
  translation_count?: number;
}

export interface CmsPaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number | null;
  to: number | null;
}

export interface CmsPaginationLinks {
  first: string | null;
  last: string | null;
  prev: string | null;
  next: string | null;
}

export interface CmsPostListResponse {
  data: CmsPostListItem[];
  meta: CmsPaginationMeta;
  links: CmsPaginationLinks;
}

// ── Fetch helpers ─────────────────────────────────────────────────────────

async function cmsGet<T>(path: string, revalidate = 60): Promise<T | null> {
  if (!CMS_API_URL) return null;

  try {
    const res = await fetch(`${CMS_API_URL}${path}`, {
      next: { revalidate },
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

// ── Public API ────────────────────────────────────────────────────────────

export async function fetchBlogPosts(
  lang: string,
  opts: {
    category?: string;
    tag?: string;
    q?: string;
    page?: number;
    per_page?: number;
    type?: string;
  } = {}
): Promise<CmsPostListResponse> {
  const qs = new URLSearchParams({ lang });
  if (opts.type)     qs.set("type", opts.type);
  if (opts.category) qs.set("category", opts.category);
  if (opts.tag)      qs.set("tag", opts.tag);
  if (opts.q)        qs.set("q", opts.q);
  if (opts.page && opts.page > 1) qs.set("page", String(opts.page));
  if (opts.per_page) qs.set("per_page", String(opts.per_page));

  const result = await cmsGet<CmsPostListResponse>(`/api/cms/posts?${qs}`, 60);

  return result ?? {
    data: [],
    meta: { current_page: 1, last_page: 1, per_page: 12, total: 0, from: null, to: null },
    links: { first: null, last: null, prev: null, next: null },
  };
}

export async function fetchBlogCategories(lang: string): Promise<CmsCategory[]> {
  const result = await cmsGet<{ data: CmsCategory[] }>(`/api/cms/categories?lang=${lang}`, 300);
  return result?.data ?? [];
}
