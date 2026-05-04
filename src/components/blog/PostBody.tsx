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

export default function PostBody({ html }: PostBodyProps) {
  if (!html) return null;

  const processedHtml = injectHeadingIds(html);

  return (
    <article
      className="blog-prose"
      dangerouslySetInnerHTML={{ __html: processedHtml }}
    />
  );
}
