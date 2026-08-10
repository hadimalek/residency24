/**
 * Normalises inbound article body content into the two representations the rest
 * of the app expects:
 *
 *   - `html`  → stored in ArticleTranslation.content, read directly by the
 *                public render path (no editor on the read path).
 *   - `json`  → stored in ArticleTranslation.contentJson (Tiptap doc) so the
 *                admin editor can open and re-edit an API-created post.
 *
 * A caller may send any ONE of:
 *   - contentJson     (a Tiptap doc — used verbatim)
 *   - contentHtml     (raw HTML)
 *   - contentMarkdown (CommonMark/GFM — converted to HTML via `marked`)
 *
 * HTML/Markdown are round-tripped through Tiptap's schema
 * (HTML → generateJSON → generateHTML). This normalises the markup AND acts as
 * a sanitiser: any node/mark not in TIPTAP_EXTENSIONS (e.g. <script>, inline
 * event handlers, <iframe>) is dropped. Internal links (<a>), images (<img>),
 * headings, lists, tables, blockquotes and code survive — which is exactly the
 * surface an SEO/data-entry agent needs.
 */
import { generateJSON } from "@tiptap/html";
import { marked } from "marked";
import { TIPTAP_EXTENSIONS, tiptapJsonToHtml } from "@/lib/cms/admin-queries";
import { ContentApiError } from "./http";

export interface ContentInput {
  contentHtml?: string | null;
  contentMarkdown?: string | null;
  contentJson?: unknown;
}

export interface NormalisedContent {
  /** Sanitised, render-ready HTML for ArticleTranslation.content. */
  html: string;
  /** Tiptap doc JSON for ArticleTranslation.contentJson (null if empty). */
  json: unknown | null;
}

marked.setOptions({ gfm: true, breaks: false });

function markdownToHtml(markdown: string): string {
  // `async: false` guarantees a string return (no Promise) for our sync path.
  return marked.parse(markdown, { async: false }) as string;
}

/**
 * Returns null when the input carries no body at all (lets callers decide
 * whether that is allowed — e.g. a metadata-only PATCH).
 */
export function normaliseContent(input: ContentInput): NormalisedContent | null {
  // 1. Explicit Tiptap JSON wins — render HTML from it, keep JSON as-is.
  if (input.contentJson != null) {
    return { html: tiptapJsonToHtml(input.contentJson), json: input.contentJson };
  }

  // 2. Derive HTML from html/markdown.
  let rawHtml: string | null = null;
  if (typeof input.contentHtml === "string" && input.contentHtml.trim()) {
    rawHtml = input.contentHtml;
  } else if (typeof input.contentMarkdown === "string" && input.contentMarkdown.trim()) {
    rawHtml = markdownToHtml(input.contentMarkdown);
  }

  if (rawHtml == null) return null;

  // 3. HTML → Tiptap JSON (sanitising round-trip) → normalised HTML.
  try {
    const json = generateJSON(rawHtml, TIPTAP_EXTENSIONS);
    const html = tiptapJsonToHtml(json);
    return { html, json };
  } catch (err) {
    throw new ContentApiError(
      "bad_request",
      `Could not parse content body: ${err instanceof Error ? err.message : "invalid markup"}`
    );
  }
}
