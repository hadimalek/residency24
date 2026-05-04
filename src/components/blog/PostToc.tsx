"use client";

import { useEffect, useRef, useState } from "react";

interface TocItem {
  id: string;
  text: string;
  level: number;
}

function extractHeadings(html: string): TocItem[] {
  const matches = [...html.matchAll(/<h([23])[^>]*?(?:id="([^"]*)")?[^>]*>([\s\S]*?)<\/h[23]>/gi)];
  return matches.map((m, i) => {
    const level = parseInt(m[1], 10);
    const id = m[2] || `heading-${i}`;
    // Strip inner HTML tags from heading text
    const text = m[3].replace(/<[^>]+>/g, "").trim();
    return { id, text, level };
  });
}

interface PostTocProps {
  html: string;
  lang: string;
  dir: "ltr" | "rtl";
}

export default function PostToc({ html, lang, dir }: PostTocProps) {
  const [activeId, setActiveId] = useState<string>("");
  const headings = extractHeadings(html);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (headings.length === 0) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-80px 0px -60% 0px", threshold: 0 }
    );

    headings.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observerRef.current?.observe(el);
    });

    return () => observerRef.current?.disconnect();
  }, [html]);

  if (headings.length < 2) return null;

  const tocLabel: Record<string, string> = {
    fa: "فهرست مطالب",
    ar: "جدول المحتويات",
    ru: "Содержание",
    en: "Table of Contents",
  };

  return (
    <div className="sticky top-20 bg-surface rounded-2xl border border-border p-5" dir={dir}>
      <p className="text-xs font-bold text-navy/60 uppercase tracking-widest mb-3">
        {tocLabel[lang] ?? tocLabel.en}
      </p>
      <nav>
        <ul className="space-y-1">
          {headings.map(({ id, text, level }) => (
            <li key={id} className={level === 3 ? "pl-3" : ""}>
              <a
                href={`#${id}`}
                className={`block text-sm py-0.5 leading-snug transition-colors rounded px-1 ${
                  activeId === id
                    ? "text-navy font-semibold bg-gold-lt"
                    : "text-ink/70 hover:text-navy"
                }`}
              >
                {text}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
