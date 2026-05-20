/**
 * Server-side helpers for /api/admin/* — these power the admin CRUD UIs.
 * Renders Tiptap JSON → HTML on save so the public site keeps reading the
 * cached `content` field (no editor on the public render path).
 */
import { generateHTML } from "@tiptap/html";
import StarterKit from "@tiptap/starter-kit";
import { Image } from "@tiptap/extension-image";
import { Link } from "@tiptap/extension-link";
import { JSDOM } from "jsdom";

// JSDOM polyfill so Tiptap's prosemirror DOMParser works under Node.
const dom = new JSDOM("");
const g = globalThis as any;
g.window ||= dom.window;
g.document ||= dom.window.document;
g.DOMParser ||= dom.window.DOMParser;
g.Node ||= dom.window.Node;

const TIPTAP_EXTENSIONS = [StarterKit, Image, Link];

export function tiptapJsonToHtml(json: any): string {
  if (!json) return "";
  try {
    return generateHTML(json, TIPTAP_EXTENSIONS);
  } catch (e) {
    console.error("[tiptapJsonToHtml] failed:", e);
    return "";
  }
}

/** Generate a URL-safe slug. Permits Persian/Cyrillic chars (they work fine
 *  in URLs once URL-encoded) — only strips ASCII punctuation that would be
 *  ambiguous in a URL. */
export function slugify(input: string): string {
  return (
    input
      .toLowerCase()
      .normalize("NFKC")
      .replace(/[\s_]+/g, "-")
      .replace(/[!-,./:-@[-`{-~]+/g, "")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 200) || "untitled"
  );
}

/** Approximate reading time from rendered HTML (200 wpm baseline). */
export function readingTimeFromHtml(html: string): number {
  const text = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}
