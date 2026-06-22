"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

interface TocItem {
  id: string;
  text: string;
  level: number;
  number: string;
}

function extractHeadings(html: string): TocItem[] {
  const matches = [...html.matchAll(/<h([23])[^>]*?(?:id="([^"]*)")?[^>]*>([\s\S]*?)<\/h[23]>/gi)];
  let h2 = 0;
  let h3 = 0;
  return matches.map((m, i) => {
    const level = parseInt(m[1], 10);
    const id = m[2] || `heading-${i}`;
    const text = m[3].replace(/<[^>]+>/g, "").trim();
    let number: string;
    if (level === 2) {
      h2 += 1;
      h3 = 0;
      number = `${h2}`;
    } else {
      // H3 before any H2 still gets a sensible label.
      h3 += 1;
      number = `${h2}.${h3}`;
    }
    return { id, text, level, number };
  });
}

interface PostTocProps {
  html: string;
  lang: string;
  dir: "ltr" | "rtl";
}

const COLLAPSED_COUNT = 4;

export default function PostToc({ html, lang, dir }: PostTocProps) {
  const [activeId, setActiveId] = useState<string>("");
  const [expanded, setExpanded] = useState(false);
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

  // Pure JS scroll — never updates the URL hash, so reload/share/back-button
  // behavior is unaffected.
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    const headerOffset = 80;
    const top = el.getBoundingClientRect().top + window.pageYOffset - headerOffset;
    window.scrollTo({ top, behavior: "smooth" });
    setActiveId(id);
  };

  const tocLabel: Record<string, string> = {
    fa: "فهرست مطالب",
    ar: "جدول المحتويات",
    ru: "Содержание",
    en: "Table of Contents",
  };

  const moreLabel: Record<string, string> = {
    fa: "مشاهده بیشتر",
    ar: "عرض المزيد",
    ru: "Показать ещё",
    en: "Show more",
  };

  const lessLabel: Record<string, string> = {
    fa: "بستن",
    ar: "عرض أقل",
    ru: "Свернуть",
    en: "Show less",
  };

  const hasToggle = headings.length > COLLAPSED_COUNT;
  const visible = expanded || !hasToggle ? headings : headings.slice(0, COLLAPSED_COUNT);
  const remaining = headings.length - COLLAPSED_COUNT;

  return (
    <div className="sticky top-20 bg-surface rounded-2xl border border-border p-5" dir={dir}>
      <p className="text-xs font-bold text-navy/60 uppercase tracking-widest mb-3">
        {tocLabel[lang] ?? tocLabel.en}
      </p>
      <nav>
        <ul className="space-y-1">
          {visible.map(({ id, text, level, number }) => (
            <li key={id} className={level === 3 ? "ps-4" : ""}>
              <button
                type="button"
                onClick={(e) => handleClick(e, id)}
                className={`flex w-full items-start gap-2 text-start text-sm py-0.5 leading-snug transition-colors rounded px-1 cursor-pointer ${
                  activeId === id
                    ? "text-navy font-semibold bg-gold-lt"
                    : "text-ink/70 hover:text-navy"
                }`}
              >
                <span
                  className={`shrink-0 tabular-nums ${
                    level === 2 ? "font-semibold text-navy/70" : "text-navy/40"
                  } ${activeId === id ? "text-navy" : ""}`}
                >
                  {number}
                </span>
                <span className="min-w-0">{text}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {hasToggle && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="mt-3 flex items-center gap-1 text-xs font-medium text-navy hover:text-gold-dk transition-colors cursor-pointer"
        >
          <ChevronDown
            size={14}
            className={`transition-transform ${expanded ? "rotate-180" : ""}`}
          />
          {expanded ? lessLabel[lang] ?? lessLabel.en : `${moreLabel[lang] ?? moreLabel.en} (+${remaining})`}
        </button>
      )}
    </div>
  );
}
