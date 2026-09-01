interface PostBodyProps {
  html: string;
  /** The <h1> the page already renders, so a copy of it in the body can go. */
  title?: string;
}

/** Compares heading text to the page title without punctuation or case noise. */
function sameText(a: string, b: string): boolean {
  const norm = (x: string) =>
    x.replace(/<[^>]+>/g, " ").replace(/[\s‌]+/g, " ").replace(/[«»"'`.,:;!?]/g, "").trim().toLowerCase();
  return norm(a) === norm(b) && norm(a).length > 0;
}

/**
 * No <h1> may come from article content — the page template owns the only one.
 *
 * The WordPress import left a bare <h1> at the top of 21 Russian posts that
 * repeated the title word for word, so those pages shipped two identical h1s.
 * A copy of the title is dropped outright; anything else becomes an h2, which
 * is what it should have been. Handled at render rather than by editing the
 * stored HTML so the next import cannot reintroduce it.
 */
function demoteStrayH1(html: string, title?: string): string {
  return html.replace(/<h1([^>]*)>([\s\S]*?)<\/h1>/gi, (_m, attrs, inner) => {
    if (title && sameText(inner, title)) return "";
    return `<h2${attrs}>${inner}</h2>`;
  });
}

/**
 * Injects `id` attributes onto h2/h3 tags so PostToc scroll-spy can anchor them.
 * Slug is derived from the inner text content.
 */
function injectHeadingIds(html: string): string {
  let counter = 0;
  return html.replace(/<h([23])([^>]*)>([\s\S]*?)<\/h[23]>/gi, (match, level, attrs, inner) => {
    if (/\bid=/.test(attrs)) return match;
    const text = inner.replace(/<[^>]+>/g, "").trim();
    // simple slug: lowercase + keep Persian/Arabic + replace spaces with dashes
    const slug =
      text
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^\p{L}\p{N}\-]/gu, "")
        .slice(0, 60) || `heading-${counter}`;
    counter++;
    return `<h${level}${attrs} id="${slug}">${inner}</h${level}>`;
  });
}

/**
 * Defer in-article images: content HTML comes from the CMS with plain <img>
 * tags that load eagerly. On long mobile posts that hurts LCP/INP and wastes
 * bandwidth (a big driver of GSC "needs improvement" Core Web Vitals). We add
 * loading="lazy" + decoding="async" to every <img> that doesn't already set
 * them. The hero image (PostHero) stays eager/high-priority — it's the LCP.
 */
function deferImages(html: string): string {
  return html.replace(/<img\b([^>]*?)\/?>/gi, (match, attrs) => {
    if (/\bloading\s*=/i.test(attrs)) return match;
    let a: string = attrs;
    if (!/\bdecoding\s*=/i.test(a)) a += ' decoding="async"';
    return `<img${a} loading="lazy">`;
  });
}

export default function PostBody({ html, title }: PostBodyProps) {
  if (!html) return null;

  // Order matters: demote first so a promoted h2 also gets its anchor id.
  const processedHtml = deferImages(injectHeadingIds(demoteStrayH1(html, title)));

  return (
    <article
      className="blog-prose"
      dangerouslySetInnerHTML={{ __html: processedHtml }}
    />
  );
}
