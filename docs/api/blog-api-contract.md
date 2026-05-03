# Blog CMS API Contract

**Base URL:** `{CMS_API_URL}/api/cms`  
**Verified against:** Laravel CMS + SQLite smoke DB, all 4 languages seeded  
**Last validated:** 2025-05-03

---

## Table of Contents

1. [Listing Endpoint (PLP)](#1-listing-endpoint-plp)
2. [Detail Endpoint (PDP)](#2-detail-endpoint-pdp)
3. [Params Endpoint (generateStaticParams)](#3-params-endpoint)
4. [Categories Endpoint](#4-categories-endpoint)
5. [Tags Endpoint](#5-tags-endpoint)
6. [Sitemap Endpoint](#6-sitemap-endpoint)
7. [Error Responses](#7-error-responses)
8. [Pagination Structure](#8-pagination-structure)
9. [Hreflang Structure](#9-hreflang-structure)
10. [Frontend Integration Notes](#10-frontend-integration-notes)

---

## 1. Listing Endpoint (PLP)

### Request

```
GET /api/cms/posts
```

| Parameter  | Type    | Required | Description                                               |
|------------|---------|----------|-----------------------------------------------------------|
| `lang`     | string  | ✅ yes    | Language code: `en`, `fa`, `ar`, `ru`                    |
| `type`     | string  | no       | Post type: `post`, `guide`, `news`, `case_study`         |
| `category` | string  | no       | Category slug (must match `lang`)                        |
| `tag`      | string  | no       | Tag slug (must match `lang`)                             |
| `author`   | string  | no       | Author slug (must match `lang`)                          |
| `q`        | string  | no       | Full-text search on title + excerpt (max 120 chars)     |
| `page`     | integer | no       | Page number (default: 1)                                 |
| `per_page` | integer | no       | Results per page (default: 12, max: 50)                  |

### Response Shape

```json
{
  "data": [
    {
      "id": 1,
      "lang": "en",
      "type": "post",
      "title": "UAE Golden Visa: Complete Guide for 2025",
      "slug": "uae-golden-visa-complete-guide-2025",
      "url": "/blog/uae-golden-visa-complete-guide-2025",
      "excerpt": "Everything you need to know about the UAE 10-year Golden Visa — eligibility, cost, documents, and how long it takes in 2025.",
      "reading_time_minutes": 8,
      "published_at": "2025-04-23T16:32:52+00:00",
      "updated_at": "2025-05-03T16:32:52+00:00",
      "author": {
        "name": "Hadi Malek",
        "slug": "hadi-malek"
      },
      "category": {
        "name": "Golden Visa",
        "slug": "golden-visa",
        "description": "Everything about the UAE 10-year Golden Visa programme."
      },
      "tags": [
        { "name": "Dubai", "slug": "dubai" }
      ],
      "featured_image": {
        "url": "https://cdn.example.com/cover.jpg",
        "alt": "Dubai skyline at sunset",
        "width": 1200,
        "height": 630,
        "mime_type": "image/jpeg"
      },
      "has_translations": true,
      "translation_count": 2
    }
  ],
  "links": { ... },
  "meta": { ... }
}
```

### PLP Field Checklist

| Field                          | Key in response                          | Present |
|-------------------------------|------------------------------------------|---------|
| Post title                    | `data[].title`                           | ✅      |
| Slug                          | `data[].slug`                            | ✅      |
| Public URL (path)             | `data[].url`                             | ✅      |
| Excerpt                       | `data[].excerpt`                         | ✅      |
| Featured image URL            | `data[].featured_image.url`              | ✅      |
| Featured image alt            | `data[].featured_image.alt`              | ✅      |
| Featured image width          | `data[].featured_image.width`            | ✅      |
| Featured image height         | `data[].featured_image.height`           | ✅      |
| Published date                | `data[].published_at` (ISO 8601)         | ✅      |
| Updated date                  | `data[].updated_at` (ISO 8601)           | ✅      |
| Category name + slug          | `data[].category.name`, `.slug`          | ✅      |
| Tags array                    | `data[].tags[]`                          | ✅      |
| Author name + slug            | `data[].author.name`, `.slug`            | ✅      |
| Reading time                  | `data[].reading_time_minutes`            | ✅      |
| Has translations flag         | `data[].has_translations`                | ✅      |
| Translation count             | `data[].translation_count`               | ✅      |
| Pagination meta               | `meta.total`, `meta.per_page`, etc.      | ✅      |

---

## 2. Detail Endpoint (PDP)

### Request

```
GET /api/cms/posts/{lang}/{slug}
```

- `lang` — 2-letter language code (`en`, `fa`, `ar`, `ru`)
- `slug` — URL slug. Supports Unicode slugs for RTL languages (Persian/Arabic). URL-encode non-ASCII slugs.

Returns 404 JSON if post is not found or not published.

### Response Shape

```json
{
  "data": {
    "post": {
      "id": 1,
      "lang": "en",
      "type": "post",
      "title": "UAE Golden Visa: Complete Guide for 2025",
      "slug": "uae-golden-visa-complete-guide-2025",
      "url": "/blog/uae-golden-visa-complete-guide-2025",
      "canonical_url": "https://residency24.com/blog/uae-golden-visa-complete-guide-2025",
      "excerpt": "Everything you need to know...",
      "content_html": "<h2>What Is the UAE Golden Visa?</h2>...",
      "content_json": null,
      "reading_time_minutes": 8,
      "published_at": "2025-04-23T16:32:52+00:00",
      "updated_at": "2025-05-03T16:32:52+00:00",
      "author": {
        "name": "Hadi Malek",
        "slug": "hadi-malek",
        "title": "Senior Immigration Advisor",
        "bio": "Hadi has helped over 500 clients obtain UAE residency since 2015.",
        "avatar": {
          "url": "https://cdn.example.com/hadi.jpg",
          "alt": null,
          "width": 200,
          "height": 200,
          "mime_type": "image/jpeg"
        }
      },
      "category": {
        "name": "Golden Visa",
        "slug": "golden-visa",
        "description": "..."
      },
      "tags": [
        { "name": "Dubai", "slug": "dubai" }
      ],
      "featured_image": {
        "url": "https://cdn.example.com/cover.jpg",
        "alt": "Dubai skyline",
        "width": 1200,
        "height": 630,
        "mime_type": "image/jpeg"
      }
    },
    "seo": {
      "meta_title": "UAE Golden Visa 2025: Complete Guide — Residency24",
      "meta_description": "Get the UAE 10-year Golden Visa in 2025. Full guide...",
      "robots": "index,follow",
      "canonical_url": "https://residency24.com/blog/uae-golden-visa-complete-guide-2025",
      "og_title": "UAE Golden Visa: Complete Guide for 2025",
      "og_description": "Everything you need to know about the UAE 10-year Golden Visa.",
      "og_image_url": "https://cdn.example.com/cover.jpg",
      "og_type": "article",
      "twitter_card": "summary_large_image",
      "twitter_title": "UAE Golden Visa 2025 — Full Guide",
      "twitter_description": "Eligibility, cost, documents, and processing time.",
      "twitter_image_url": "https://cdn.example.com/cover.jpg",
      "schema_json": null
    },
    "hreflang": [
      { "lang": "en",        "url": "https://residency24.com/blog/uae-golden-visa-complete-guide-2025" },
      { "lang": "fa",        "url": "https://residency24.com/fa/blog/راهنمای-کامل-ویزای-طلایی-امارات-۲۰۲۵" },
      { "lang": "x-default", "url": "https://residency24.com/blog/uae-golden-visa-complete-guide-2025" }
    ],
    "faqs": [
      {
        "question": "Who is eligible for the UAE Golden Visa?",
        "answer": "Investors with AED 2M+ real estate...",
        "sort_order": 0
      }
    ],
    "ctas": [
      {
        "type": "lead_form",
        "title": "Check Your Golden Visa Eligibility",
        "body": "Our advisors review your profile...",
        "button_label": "Get Free Assessment",
        "target_url": null,
        "service_context": "golden_visa",
        "placement": "mid"
      },
      {
        "type": "whatsapp",
        "title": "Have a quick question?",
        "body": null,
        "button_label": "Chat on WhatsApp",
        "target_url": "https://wa.me/971XXXXXXXXX",
        "service_context": null,
        "placement": "bottom"
      }
    ],
    "related": [
      { "entity_type": "service", "entity_key": "golden-visa",                          "relation": "pillar"  },
      { "entity_type": "post",    "entity_key": "buy-property-dubai-foreigners-guide",   "relation": "related" }
    ],
    "breadcrumbs": [
      { "label": "Home",                                  "href": "/"                             },
      { "label": "Blog",                                  "href": "/blog"                         },
      { "label": "Golden Visa",                           "href": "/blog/category/golden-visa"    },
      { "label": "UAE Golden Visa: Complete Guide 2025",  "href": "/blog/uae-golden-visa-complete-guide-2025" }
    ]
  }
}
```

### PDP Field Checklist

| Field                      | Key in response                           | Present |
|---------------------------|-------------------------------------------|---------|
| Title                     | `data.post.title`                         | ✅      |
| Slug                      | `data.post.slug`                          | ✅      |
| Public URL (path)         | `data.post.url`                           | ✅      |
| Canonical URL (full)      | `data.post.canonical_url`                 | ✅      |
| content_html              | `data.post.content_html`                  | ✅      |
| Featured image            | `data.post.featured_image.{url,alt,w,h}`  | ✅      |
| Author name/slug/title/bio| `data.post.author.*`                      | ✅      |
| Author avatar             | `data.post.author.avatar.*`               | ✅      |
| Published date            | `data.post.published_at`                  | ✅      |
| Updated date              | `data.post.updated_at`                    | ✅      |
| Category                  | `data.post.category.{name,slug}`          | ✅      |
| Tags                      | `data.post.tags[]`                        | ✅      |
| Reading time              | `data.post.reading_time_minutes`          | ✅      |
| FAQ blocks                | `data.faqs[].{question,answer}`           | ✅      |
| CTA blocks                | `data.ctas[].{type,title,service_context}`| ✅      |
| Related entities          | `data.related[].{entity_type,entity_key}` | ✅      |
| Breadcrumbs               | `data.breadcrumbs[].{label,href}`         | ✅      |
| meta_title                | `data.seo.meta_title`                     | ✅      |
| meta_description          | `data.seo.meta_description`               | ✅      |
| robots                    | `data.seo.robots`                         | ✅      |
| canonical_url             | `data.seo.canonical_url`                  | ✅      |
| og_title                  | `data.seo.og_title`                       | ✅      |
| og_description            | `data.seo.og_description`                 | ✅      |
| og_image_url              | `data.seo.og_image_url`                   | ✅      |
| og_type                   | `data.seo.og_type`                        | ✅      |
| twitter_card              | `data.seo.twitter_card`                   | ✅      |
| schema_json               | `data.seo.schema_json`                    | ✅      |
| hreflang alternates       | `data.hreflang[].{lang,url}`              | ✅      |
| x-default entry           | `data.hreflang` entry with `lang=x-default` | ✅   |

---

## 3. Params Endpoint

Used by Next.js `generateStaticParams()` to pre-render all blog post pages at build time.

### Request

```
GET /api/cms/posts/params?lang=en&type=post
```

### Response

```json
{
  "data": [
    { "lang": "en", "slug": "uae-golden-visa-complete-guide-2025" },
    { "lang": "en", "slug": "buy-property-dubai-foreigners-guide" }
  ]
}
```

---

## 4. Categories Endpoint

### Request

```
GET /api/cms/categories?lang=en
```

### Response

```json
{
  "data": [
    {
      "name": "Golden Visa",
      "slug": "golden-visa",
      "description": "Everything about the UAE 10-year Golden Visa programme."
    }
  ]
}
```

---

## 5. Tags Endpoint

### Request

```
GET /api/cms/tags?lang=en
```

### Response

```json
{
  "data": [
    { "name": "Dubai",    "slug": "dubai"    },
    { "name": "Property", "slug": "property" }
  ]
}
```

---

## 6. Sitemap Endpoint

Consumed by `src/app/sitemap.ts` in Next.js. Returns one entry per published post.

### Request

```
GET /api/cms/sitemap
GET /api/cms/sitemap?lang=en
GET /api/cms/sitemap?lang=en&type=post
```

### Response

```json
{
  "data": [
    {
      "lang": "en",
      "url": "https://residency24.com/blog/uae-golden-visa-complete-guide-2025",
      "path": "/blog/uae-golden-visa-complete-guide-2025",
      "lastmod": "2025-05-03T16:32:52+00:00",
      "alternates": [
        { "lang": "en",        "url": "https://residency24.com/blog/uae-golden-visa-complete-guide-2025" },
        { "lang": "fa",        "url": "https://residency24.com/fa/blog/..." },
        { "lang": "x-default", "url": "https://residency24.com/blog/uae-golden-visa-complete-guide-2025" }
      ]
    }
  ]
}
```

---

## 7. Error Responses

### 404 — Post not found or not published

```json
{
  "error": "not_found",
  "message": "No published post found for lang='en' slug='does-not-exist'."
}
```

HTTP status: `404`

### 422 — Missing required `lang` parameter

```json
{
  "message": "The lang query parameter is required.",
  "errors": {
    "lang": [
      "The lang query parameter is required."
    ]
  }
}
```

HTTP status: `422`

### 422 — Invalid language code

```json
{
  "message": "The supplied lang is not an active language.",
  "errors": {
    "lang": [
      "The supplied lang is not an active language."
    ]
  }
}
```

HTTP status: `422`

---

## 8. Pagination Structure

All listing endpoints return a standard Laravel paginator envelope:

```json
{
  "data": [ ... ],
  "links": {
    "first": "https://cms.residency24.com/api/cms/posts?lang=en&page=1",
    "last":  "https://cms.residency24.com/api/cms/posts?lang=en&page=5",
    "prev":  null,
    "next":  "https://cms.residency24.com/api/cms/posts?lang=en&page=2"
  },
  "meta": {
    "current_page": 1,
    "from":         1,
    "last_page":    5,
    "per_page":     12,
    "to":           12,
    "total":        56,
    "path":         "https://cms.residency24.com/api/cms/posts",
    "links": [
      { "url": null,   "label": "« Previous", "active": false },
      { "url": "...",  "label": "1",           "active": true  },
      { "url": "...",  "label": "2",           "active": false },
      { "url": null,   "label": "Next »",      "active": false }
    ]
  }
}
```

**Fields used by the frontend:**

| Field              | Usage                              |
|--------------------|------------------------------------|
| `meta.total`       | "56 articles" count display        |
| `meta.current_page`| Active page indicator              |
| `meta.last_page`   | Disable "Next" when reached        |
| `meta.per_page`    | Items per page display             |
| `links.next`       | Next page URL                      |
| `links.prev`       | Previous page URL                  |

---

## 9. Hreflang Structure

- Present in: `GET /api/cms/posts/{lang}/{slug}` as `data.hreflang[]`
- Present in: `GET /api/cms/sitemap` as `data[].alternates[]`

```json
[
  { "lang": "en",        "url": "https://residency24.com/blog/uae-golden-visa-complete-guide-2025" },
  { "lang": "fa",        "url": "https://residency24.com/fa/blog/راهنمای-کامل-ویزای-طلایی-امارات-۲۰۲۵" },
  { "lang": "ar",        "url": "https://residency24.com/ar/blog/..." },
  { "lang": "x-default", "url": "https://residency24.com/blog/uae-golden-visa-complete-guide-2025" }
]
```

**Rules:**
- Only includes published siblings (drafts excluded)
- Partial groups are valid (e.g. en + fa only, ar/ru absent)
- Standalone posts (no translation group) return `[]`
- `x-default` priority: explicit `group.x_default_lang` → `en` sibling → first sibling

**Next.js `generateMetadata()` usage:**

```ts
// src/app/[lang]/blog/[slug]/page.tsx
export async function generateMetadata({ params }) {
  const post = await fetchPost(params.lang, params.slug);
  return {
    title: post.data.seo.meta_title,
    description: post.data.seo.meta_description,
    robots: post.data.seo.robots,
    alternates: {
      canonical: post.data.seo.canonical_url,
      languages: Object.fromEntries(
        post.data.hreflang
          .filter(h => h.lang !== 'x-default')
          .map(h => [h.lang, h.url])
      ),
    },
    openGraph: {
      title:       post.data.seo.og_title,
      description: post.data.seo.og_description,
      url:         post.data.seo.canonical_url,
      type:        post.data.seo.og_type,
      images:      [{ url: post.data.seo.og_image_url }],
    },
    twitter: {
      card:        post.data.seo.twitter_card,
      title:       post.data.seo.twitter_title,
      description: post.data.seo.twitter_description,
      images:      [post.data.seo.twitter_image_url],
    },
  };
}
```

---

## 10. Frontend Integration Notes

### Environment variable required in Next.js

```env
CMS_API_URL=https://cms.residency24.com
```

### Fetch pattern for Server Components

```ts
// src/lib/cms/api.ts

const BASE = process.env.CMS_API_URL;

export async function fetchPosts(lang: string, params?: Record<string, string>) {
  const qs = new URLSearchParams({ lang, ...params }).toString();
  const res = await fetch(`${BASE}/api/cms/posts?${qs}`, {
    next: { tags: [`post-list:${lang}`], revalidate: 60 },
  });
  if (!res.ok) throw new Error('Failed to fetch posts');
  return res.json();
}

export async function fetchPost(lang: string, slug: string) {
  const res = await fetch(`${BASE}/api/cms/posts/${lang}/${encodeURIComponent(slug)}`, {
    next: { tags: [`post:${lang}:${slug}`], revalidate: 60 },
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error('Failed to fetch post');
  return res.json();
}
```

### URL construction rules

| Language | Blog list URL           | Post detail URL                          |
|----------|-------------------------|------------------------------------------|
| en       | `/blog`                 | `/blog/{slug}`                           |
| fa       | `/fa/blog`              | `/fa/blog/{slug}` (slug may be Unicode)  |
| ar       | `/ar/blog`              | `/ar/blog/{slug}`                        |
| ru       | `/ru/blog`              | `/ru/blog/{slug}`                        |

### Slug encoding note

Persian and Arabic slugs use Unicode characters (e.g. `راهنمای-کامل-...`). When constructing fetch URLs server-side, use `encodeURIComponent(slug)`. Next.js `params.slug` will already be decoded — pass as-is to the API call (Laravel URL-decodes it automatically).

### Cache invalidation (Phase 4)

When the CMS publishes or updates a post, it will POST to:

```
POST https://residency24.com/api/revalidate
Authorization: Bearer {REVALIDATE_SECRET}
Content-Type: application/json

{ "lang": "en", "slug": "uae-golden-visa-complete-guide-2025" }
```

The Next.js route handler calls `revalidateTag('post:en:uae-golden-visa-complete-guide-2025')`.
