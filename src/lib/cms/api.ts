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

// ── PDP types ─────────────────────────────────────────────────────────────

export interface CmsAuthorDetail {
  name: string;
  slug: string;
  title: string | null;
  bio: string | null;
  avatar: CmsMedia | null;
}

export interface CmsPostDetail {
  id: number;
  lang: string;
  type: string;
  title: string;
  slug: string;
  url: string;
  canonical_url: string;
  excerpt: string | null;
  content_html: string | null;
  reading_time_minutes: number | null;
  published_at: string | null;
  updated_at: string | null;
  author: CmsAuthorDetail | null;
  category: CmsCategory | null;
  tags: CmsTag[];
  featured_image: CmsMedia | null;
}

export interface CmsSeo {
  meta_title: string | null;
  meta_description: string | null;
  robots: string | null;
  canonical_url: string | null;
  og_title: string | null;
  og_description: string | null;
  og_image_url: string | null;
  og_type: string | null;
  twitter_card: string | null;
  twitter_title: string | null;
  twitter_description: string | null;
  twitter_image_url: string | null;
}

export interface CmsHreflang {
  lang: string;
  url: string;
}

export interface CmsFaq {
  question: string;
  answer: string;
  sort_order: number;
}

export interface CmsCta {
  type: string;
  title: string | null;
  body: string | null;
  button_label: string | null;
  target_url: string | null;
  service_context: string | null;
  placement: string | null;
}

export interface CmsRelated {
  entity_type: string;
  entity_key: string;
  relation: string;
}

export interface CmsBreadcrumb {
  label: string;
  href: string;
}

export interface CmsPostDetailResponse {
  data: {
    post: CmsPostDetail;
    seo: CmsSeo;
    hreflang: CmsHreflang[];
    faqs: CmsFaq[];
    ctas: CmsCta[];
    related: CmsRelated[];
    breadcrumbs: CmsBreadcrumb[];
  };
}

// ── Comments types ────────────────────────────────────────────────────────

export interface CmsComment {
  id: number;
  author_name: string;
  content: string;
  created_at: string;
}

export interface CmsCommentSubmit {
  lang: string;
  slug: string;
  author_name: string;
  author_email: string;
  content: string;
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

export async function fetchBlogPost(
  lang: string,
  slug: string
): Promise<CmsPostDetailResponse | null> {
  return cmsGet<CmsPostDetailResponse>(
    `/api/cms/posts/${lang}/${encodeURIComponent(slug)}`,
    60
  );
}

export async function fetchPostComments(
  lang: string,
  slug: string
): Promise<CmsComment[]> {
  const result = await cmsGet<{ data: CmsComment[] }>(
    `/api/cms/posts/${lang}/${encodeURIComponent(slug)}/comments`,
    30
  );
  return result?.data ?? [];
}

export async function fetchBlogPostParams(): Promise<{ lang: string; slug: string }[]> {
  const result = await cmsGet<{ data: { lang: string; slug: string }[] }>(
    `/api/cms/posts/params`,
    300
  );
  return result?.data ?? [];
}

export async function submitComment(
  payload: CmsCommentSubmit
): Promise<{ success: boolean; message?: string }> {
  if (!CMS_API_URL) return { success: false, message: "CMS not configured" };
  try {
    const res = await fetch(`${CMS_API_URL}/api/cms/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (!res.ok) return { success: false, message: json.message ?? "Submission failed" };
    return { success: true };
  } catch {
    return { success: false, message: "Network error" };
  }
}
