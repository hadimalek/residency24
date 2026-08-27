import { Globe } from "lucide-react";
import type { CmsAuthorProfile } from "@/lib/cms/api";
import type { Lang } from "@/translations";
import { LANG_CONFIG } from "@/lib/seo";

interface AuthorProfileCardProps {
  author: CmsAuthorProfile;
  lang: Lang;
  eyebrow: string;
}

// lucide-react 1.x ships no brand marks, so the platform glyphs are inline
// single-path SVGs. Kept as raw paths rather than adding a dependency for five
// icons.
const BRAND_PATHS: Record<string, string> = {
  linkedin:
    "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
  instagram:
    "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z",
  telegram:
    "M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.5.5 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.26-1.91.177-.184 3.247-2.977 3.307-3.23.007-.03.01-.14-.056-.197-.066-.06-.174-.041-.253-.024-.108.024-1.807 1.148-5.098 3.372-.482.331-.917.492-1.307.484-.43-.008-1.259-.243-1.875-.443-.756-.246-1.356-.376-1.303-.79.028-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z",
  x: "M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z",
};

function BrandIcon({ name }: { name: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
      <path d={BRAND_PATHS[name]} />
    </svg>
  );
}

// Order matters — this is the order the links render in.
const SOCIALS = [
  { key: "website", label: "Website" },
  { key: "linkedin", label: "LinkedIn" },
  { key: "instagram", label: "Instagram" },
  { key: "telegram", label: "Telegram" },
  { key: "x", label: "X" },
] as const;

export default function AuthorProfileCard({ author, lang, eyebrow }: AuthorProfileCardProps) {
  const dir = LANG_CONFIG[lang].dir;

  return (
    <div
      className="bg-white rounded-2xl border border-border shadow-sm p-6 sm:p-8 flex flex-col sm:flex-row gap-6 items-center sm:items-start text-center sm:text-start"
      dir={dir}
    >
      <div className="flex-shrink-0">
        {author.avatar ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={author.avatar.url}
            alt={author.avatar.alt ?? author.name}
            width={128}
            height={128}
            className="w-28 h-28 rounded-full object-cover border-4 border-gold"
          />
        ) : (
          <div className="w-28 h-28 rounded-full bg-navy flex items-center justify-center text-white text-4xl font-bold border-4 border-gold">
            {author.name.charAt(0).toUpperCase()}
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-xs font-bold text-navy/50 uppercase tracking-widest mb-1">
          {eyebrow}
        </p>
        {/* The author's name is this page's single H1 — the page is about the
            person, not about the blog. */}
        <h1 className="text-2xl font-bold text-navy">{author.name}</h1>
        {author.title && (
          <p className="text-sm text-gold-dk font-medium mt-1">{author.title}</p>
        )}
        {author.bio && (
          <p className="text-sm text-ink mt-3 leading-relaxed whitespace-pre-line">
            {author.bio}
          </p>
        )}

        <div className="flex items-center justify-center sm:justify-start gap-2 mt-5 flex-wrap">
          {SOCIALS.map(({ key, label }) => {
            const href = author.links[key];
            if (!href) return null;
            return (
              <a
                key={key}
                href={href}
                target="_blank"
                // Outbound links to third-party profiles: noopener for safety,
                // nofollow because we are not vouching for what is on them.
                rel="noopener noreferrer nofollow"
                aria-label={`${author.name} — ${label}`}
                title={label}
                className="w-9 h-9 rounded-lg border border-border flex items-center justify-center text-navy hover:bg-navy hover:text-white transition-colors"
              >
                {key === "website" ? (
                  <Globe className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <BrandIcon name={key} />
                )}
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}
