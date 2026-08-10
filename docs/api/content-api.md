# Content API — Article Automation (`/api/content`)

A programmatic, **article-scoped** HTTP API for an external system (an AI agent,
an MCP server, a data-entry pipeline) to fully manage blog articles: create,
publish, translate, internally link, attach images, and set SEO metadata.

> **Scope guarantee.** This API can only touch **articles**, blog **categories**,
> and **images**. It has **no** access to leads, users, providers, prompts,
> chat, or any `/api/admin/*` route. It uses its own bearer-key auth, entirely
> separate from the admin browser session.

---

## Authentication

Every request must carry a bearer key:

```
Authorization: Bearer <CONTENT_API_KEY>
```

(An `X-API-Key: <key>` header is also accepted for clients that cannot set
`Authorization`.)

- Set `CONTENT_API_KEY` in the server environment. Generate a strong value with
  `openssl rand -base64 48`.
- Multiple keys may be comma-separated (`key_a,key_b`) so a key can be rotated
  or revoked per-integration without downtime.
- Comparison is constant-time. A missing/blank/placeholder key disables the API
  (`503 not_configured`).

Confirm your key works:

```bash
curl -s https://residency24.com/api/content \
  -H "Authorization: Bearer $CONTENT_API_KEY"
```

Returns a discovery document listing every endpoint, allowed image types, and
article statuses.

---

## Response envelope

**Success**
```json
{ "data": { … }, "meta": { … } }   // meta present on lists
```

**Error**
```json
{ "error": { "code": "validation_error", "message": "…", "details": [ … ] } }
```

| HTTP | `code`                   | When                                    |
|------|--------------------------|-----------------------------------------|
| 401  | `unauthorized`           | Missing/invalid key                     |
| 404  | `not_found`              | Unknown article id                      |
| 409  | `conflict`               | Slug already used / category exists     |
| 413  | `payload_too_large`      | Image over the size cap                 |
| 415  | `unsupported_media_type` | Image type not allowed                  |
| 422  | `validation_error`       | Body failed schema validation           |
| 503  | `not_configured`         | `CONTENT_API_KEY` not set               |

---

## Content model

An **article** has locale-independent fields plus one or more **translations**:

| Article field     | Type / notes                                                    |
|-------------------|-----------------------------------------------------------------|
| `slug`            | Auto-generated from the first title if omitted; kept unique.    |
| `status`          | `DRAFT` \| `REVIEW` \| `PUBLISHED` \| `ARCHIVED` (default DRAFT). |
| `isFeatured`      | boolean                                                         |
| `featuredImageId` | Media id from `POST /api/content/media`                         |
| `category`        | Blog category **slug** (see categories endpoint)               |
| `countryId`       | Optional country association                                    |
| `robots`          | e.g. `"index,follow"` / `"noindex,follow"` — controls sitemap   |
| `publishedAt`     | ISO 8601; auto-set on first publish if omitted                  |

| Translation field | Type / notes                                                    |
|-------------------|-----------------------------------------------------------------|
| `locale`          | `en` \| `fa` \| `ar` \| `ru`                                     |
| `title`           | required                                                        |
| `excerpt`         | short summary                                                   |
| **body** (one of) | `contentHtml` \| `contentMarkdown` \| `contentJson`             |
| `metaTitle`       | SEO `<title>`                                                   |
| `metaDescription` | SEO meta description                                            |
| `faqs`            | `[{ "question": "…", "answer": "…" }]` — rendered as FAQ schema  |

### Body formats

Send exactly one of:

- **`contentMarkdown`** — CommonMark/GFM. Converted to HTML server-side.
- **`contentHtml`** — raw HTML.
- **`contentJson`** — a Tiptap document (advanced; used verbatim).

HTML and Markdown are normalized through the editor's schema (the same one the
admin panel uses). This **sanitizes** the markup — `<script>`, inline event
handlers and unknown embeds are dropped — while keeping headings, lists,
tables, blockquotes, code, images (`<img>`) and links (`<a>`). Every
API-created article stays fully editable in the admin editor.

### Internal linking & images (the SEO/data-entry workflow)

1. `GET /api/content/link-index?locale=fa` → published articles as
   `{ title, url }` targets. Weave relevant `<a href="/…">` links into the body.
2. `POST /api/content/media` → upload/ingest an image, get back a `url`. Embed
   it as `<img src="/uploads/…">` and/or set it as `featuredImageId`.
3. `POST /api/content/articles` with the finished body + `metaTitle`,
   `metaDescription`, `faqs`, `category` → a complete, SEO-ready post.

---

## Endpoints

### `GET /api/content/articles`
List/search. Query: `page`, `per_page` (≤100), `locale`, `status`, `category`, `q`.

```bash
curl -s "https://residency24.com/api/content/articles?status=PUBLISHED&locale=fa&per_page=10" \
  -H "Authorization: Bearer $CONTENT_API_KEY"
```

### `POST /api/content/articles`
Create a full article — one or many locales at once.

```bash
curl -s https://residency24.com/api/content/articles \
  -H "Authorization: Bearer $CONTENT_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "PUBLISHED",
    "category": "golden-visa",
    "featuredImageId": "cmxyz…",
    "translations": [
      {
        "locale": "fa",
        "title": "راهنمای کامل اقامت طلایی امارات",
        "excerpt": "همه چیز درباره ویزای طلایی…",
        "contentMarkdown": "## مقدمه\n\nاقامت طلایی… [ویزای توریستی](/fa/uae/tourist-visa) …",
        "metaTitle": "اقامت طلایی امارات ۲۰۲۶ | Residency24",
        "metaDescription": "شرایط، هزینه و مراحل دریافت اقامت طلایی امارات.",
        "faqs": [{ "question": "مدت اعتبار؟", "answer": "۵ یا ۱۰ سال." }]
      }
    ]
  }'
```

Response: `201` with the created article (including `id`, `slug`, and each
translation's public `url`).

### `GET /api/content/articles/{id}`
Fetch one article with all translations.

### `PATCH /api/content/articles/{id}`
Partial update. Any omitted field is left unchanged. Optionally patch a single
locale via a `translation` object (its `locale` selects which one; omitting the
body keeps existing content — it is never blanked).

```bash
curl -s -X PATCH https://residency24.com/api/content/articles/$ID \
  -H "Authorization: Bearer $CONTENT_API_KEY" -H "Content-Type: application/json" \
  -d '{ "status": "PUBLISHED", "translation": { "locale": "fa", "metaDescription": "متن جدید" } }'
```

### `DELETE /api/content/articles/{id}`
Delete an article and its translations.

### `PUT /api/content/articles/{id}/translations`
Add or replace **one** locale (idempotent on `articleId`+`locale`). Use to
publish a translated version without touching the other locales.

```bash
curl -s -X PUT https://residency24.com/api/content/articles/$ID/translations \
  -H "Authorization: Bearer $CONTENT_API_KEY" -H "Content-Type: application/json" \
  -d '{ "locale": "en", "title": "UAE Golden Visa — Full Guide", "contentMarkdown": "## Intro…" }'
```

### `GET /api/content/categories?locale=fa` · `POST /api/content/categories`
Read the managed blog-category list; create new ones. Articles reference a
category by its `slug`.

```bash
curl -s -X POST https://residency24.com/api/content/categories \
  -H "Authorization: Bearer $CONTENT_API_KEY" -H "Content-Type: application/json" \
  -d '{ "locale": "fa", "name": "اقامت امارات" }'
```

### `POST /api/content/media`
Attach an image. Two modes:

**Upload bytes (multipart):**
```bash
curl -s -X POST https://residency24.com/api/content/media \
  -H "Authorization: Bearer $CONTENT_API_KEY" \
  -F "file=@./photo.webp" -F "alt=Dubai skyline" -F "locale=fa"
```

**Ingest by URL (server fetches it):**
```bash
curl -s -X POST https://residency24.com/api/content/media \
  -H "Authorization: Bearer $CONTENT_API_KEY" -H "Content-Type: application/json" \
  -d '{ "sourceUrl": "https://images.example.com/dubai.jpg", "alt": "Dubai skyline", "locale": "fa" }'
```

Response: `{ "data": { "id": "…", "url": "/uploads/…", "mimeType": "…", "size": 12345 } }`.
Use `url` inside article HTML and/or `id` as `featuredImageId`.

Allowed types: JPEG, PNG, WebP, GIF, SVG, AVIF. Max 10 MB (configurable via
`CONTENT_API_MAX_IMAGE_BYTES`). URL ingestion blocks localhost/private-range
hosts (SSRF protection).

### `GET /api/content/link-index?locale=fa&q=visa&limit=200`
Published articles as internal-link targets: `{ title, excerpt, url, category }`.

---

## Setup checklist

1. `CONTENT_API_KEY="<random>"` in the server `.env` (see `.env.example`).
2. `npm install` (adds `marked` for Markdown support).
3. Restart the app (`pm2 restart residency24`).
4. Smoke test: `curl -H "Authorization: Bearer $CONTENT_API_KEY" https://residency24.com/api/content`.

No database migration is required — the API reuses the existing
`Article` / `ArticleTranslation` / `BlogCategory` / `Media` tables.
