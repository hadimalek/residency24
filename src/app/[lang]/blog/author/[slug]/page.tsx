import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { Lang } from "@/translations";
import {
  LANGS,
  LANG_CONFIG,
  BLOG_SEO,
  BREADCRUMB_HOME,
  getBlogPageUrl,
  getPageUrl,
  localizedPath,
} from "@/lib/seo";
import { fetchAuthor, fetchBlogPosts } from "@/lib/cms/api";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";

import AuthorProfileCard from "@/components/blog/AuthorProfileCard";
import BlogGrid from "@/components/blog/BlogGrid";
import BlogPagination from "@/components/blog/BlogPagination";

export const dynamic = "force-dynamic";

// Matches the blog index and the category hubs.
const PER_PAGE = 24;

const COPY: Record<Lang, { eyebrow: string; postsBy: (n: string) => string; empty: string }> = {
  fa: {
    eyebrow: "نویسنده",
    postsBy: (n) => `نوشته‌های ${n}`,
    empty: "هنوز مقاله‌ای از این نویسنده منتشر نشده است.",
  },
  en: {
    eyebrow: "Author",
    postsBy: (n) => `Articles by ${n}`,
    empty: "This author has no published articles yet.",
  },
  ar: {
    eyebrow: "الكاتب",
    postsBy: (n) => `مقالات ${n}`,
    empty: "لا توجد مقالات منشورة لهذا الكاتب بعد.",
  },
  ru: {
    eyebrow: "Автор",
    postsBy: (n) => `Статьи ${n}`,
    empty: "У этого автора пока нет публикаций.",
  },
};

function authorPath(lang: Lang, slug: string): string {
  return localizedPath(lang, `blog/author/${encodeURIComponent(slug)}`);
}

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string; slug: string }>;
  searchParams: Promise<{ page?: string }>;
}): Promise<Metadata> {
  const { lang: rawLang, slug } = await params;
  const sp = await searchParams;
  const lang = (LANGS.includes(rawLang as Lang) ? rawLang : "en") as Lang;
  const config = LANG_CONFIG[lang];
  const page = Math.max(1, Number(sp.page ?? 1) || 1);

  const author = await fetchAuthor(lang, decodeURIComponent(slug));
  if (!author) return { title: BLOG_SEO[lang].title };

  const base = `https://residency24.com${authorPath(lang, author.slug)}`;
  // Paginated slices self-canonicalise, same rule as the blog index.
  const pageUrl = page > 1 ? `${base}?page=${page}` : base;
  const title = page > 1
    ? `${author.name} — ${COPY[lang].eyebrow} — ${page}`
    : `${author.name} — ${COPY[lang].eyebrow}`;
  const description =
    author.bio?.slice(0, 300) ?? `${COPY[lang].postsBy(author.name)} — Residency24`;

  // A profile is only worth indexing in a locale the author has actually
  // published in. Someone who writes only in English has an empty page at
  // /fa/blog/author/… — thin content that should never enter the index. `follow`
  // keeps the outbound links alive for the rare human who lands there.
  const hasPostsHere = author.post_locales.includes(lang);

  // hreflang across exactly the locales with content, so the cluster every page
  // advertises is mutually consistent and contains no indexable-empty members.
  // Page 1 only: post counts differ per locale, so "page 3 in Arabic" may not exist.
  const languages: Record<string, string> = {};
  if (page === 1 && hasPostsHere) {
    for (const l of LANGS) {
      if (author.post_locales.includes(l)) {
        languages[LANG_CONFIG[l].hreflang] = `https://residency24.com${authorPath(l, author.slug)}`;
      }
    }
  }

  return {
    title,
    description,
    ...(hasPostsHere ? {} : { robots: { index: false, follow: true } }),
    alternates: {
      canonical: pageUrl,
      ...(Object.keys(languages).length > 1 ? { languages } : {}),
    },
    openGraph: {
      type: "profile",
      url: pageUrl,
      title,
      description,
      locale: config.locale,
      siteName: "Residency24",
      ...(author.avatar?.url ? { images: [{ url: author.avatar.url }] } : {}),
    },
    twitter: { card: "summary", title, description },
    icons: { icon: "/favicon.png" },
  };
}

export default async function AuthorPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string; slug: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { lang: rawLang, slug: rawSlug } = await params;
  const sp = await searchParams;
  const lang = (LANGS.includes(rawLang as Lang) ? rawLang : "en") as Lang;
  const slug = decodeURIComponent(rawSlug);
  const page = Math.max(1, Number(sp.page ?? 1) || 1);
  const seo = BLOG_SEO[lang];
  const copy = COPY[lang];

  const author = await fetchAuthor(lang, slug);
  if (!author) notFound();

  const postsResponse = await fetchBlogPosts(lang, {
    author: slug,
    page,
    per_page: PER_PAGE,
  });

  const profileUrl = `https://residency24.com${authorPath(lang, author.slug)}`;
  const sameAs = Object.values(author.links).filter((u): u is string => Boolean(u));

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    // One identifier for the person across all four locales. Without it each
    // localised page looks like a different Person; with it they consolidate
    // into a single entity, which is the whole point of author markup.
    "@id": `https://residency24.com/blog/author/${encodeURIComponent(author.slug)}#person`,
    name: author.name,
    url: profileUrl,
    ...(author.title ? { jobTitle: author.title } : {}),
    ...(author.bio ? { description: author.bio } : {}),
    ...(author.avatar?.url ? { image: author.avatar.url } : {}),
    ...(sameAs.length > 0 ? { sameAs } : {}),
    worksFor: { "@type": "Organization", name: "Residency24", url: getPageUrl(lang) },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: BREADCRUMB_HOME[lang], item: getPageUrl(lang) },
      { "@type": "ListItem", position: 2, name: seo.h1, item: getBlogPageUrl(lang) },
      { "@type": "ListItem", position: 3, name: author.name, item: profileUrl },
    ],
  };

  return (
    <>
      {[personSchema, breadcrumbSchema].map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      <div className="min-h-screen bg-background">
        <Navbar />

        <section className="max-w-5xl mx-auto px-4 pt-10">
          <AuthorProfileCard author={author} lang={lang} eyebrow={copy.eyebrow} />
        </section>

        <section className="max-w-5xl mx-auto px-4 pt-10 pb-16">
          <h2
            className="text-xl font-bold text-navy mb-6"
            dir={LANG_CONFIG[lang].dir}
          >
            {copy.postsBy(author.name)}
            <span className="text-sm font-normal text-muted-foreground ms-2">
              ({author.post_count.toLocaleString(lang === "fa" ? "fa-IR" : lang)})
            </span>
          </h2>

          {postsResponse.data.length === 0 ? (
            <p
              className="text-sm text-muted-foreground py-12 text-center"
              dir={LANG_CONFIG[lang].dir}
            >
              {copy.empty}
            </p>
          ) : (
            <BlogGrid posts={postsResponse.data} lang={lang} seo={seo} />
          )}

          {postsResponse.meta.last_page > 1 && (
            <div className="mt-12">
              <BlogPagination
                meta={postsResponse.meta}
                basePath={authorPath(lang, author.slug)}
                currentCategory=""
                currentQ=""
              />
            </div>
          )}
        </section>

        <Footer />
        <WhatsAppFloat />
      </div>
    </>
  );
}
