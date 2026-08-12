interface PostBodyProps {
  html: string;
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

export default function PostBody({ html }: PostBodyProps) {
  if (!html) return null;

  const processedHtml = deferImages(injectHeadingIds(html));

  return (
    <article
      className="blog-prose"
      dangerouslySetInnerHTML={{ __html: processedHtml }}
    />
  );
}
