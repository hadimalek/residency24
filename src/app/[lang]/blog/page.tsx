import type { Metadata } from "next";
import type { Lang } from "@/translations";
import {
  LANGS,
  LANG_CONFIG,
  BLOG_SEO,
  getBlogPageUrl,
  localizedPath,
} from "@/lib/seo";
import { fetchBlogPosts, fetchBlogCategories } from "@/lib/cms/api";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";

import BlogHero from "@/components/blog/BlogHero";
import BlogFilters from "@/components/blog/BlogFilters";
import BlogGrid from "@/components/blog/BlogGrid";
import BlogPagination from "@/components/blog/BlogPagination";

export async function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

/**
 * Paginated listings must self-canonicalise. Pointing `?page=2` at `/blog`
 * (which is what this used to do) tells Google page 2 is a duplicate of page 1,
 * so the posts linked only from page 2+ inherit nothing — which defeats the
 * whole point of making the pagination crawlable in the first place.
 *
 * hreflang alternates are emitted for page 1 only: each locale has a different
 * number of posts (287 fa vs 19 ar), so "page 5 in Arabic" often does not exist
 * and advertising it as an alternate would be a lie.
 */
export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ category?: string; q?: string; page?: string }>;
}): Promise<Metadata> {
  const { lang: rawLang } = await params;
  const sp = await searchParams;
  const lang = (LANGS.includes(rawLang as Lang) ? rawLang : "en") as Lang;
  const seo = BLOG_SEO[lang];
  const config = LANG_CONFIG[lang];

  const page = Math.max(1, Number(sp.page ?? 1) || 1);
  const category = sp.category ?? "";
  const q = sp.q ?? "";

  // A `?category=` query is a legacy duplicate of the /blog/category/<slug>
  // route, so canonicalise it there rather than leaving two indexable URLs.
  const base = category
    ? `${getBlogPageUrl(lang)}/category/${encodeURIComponent(category)}`
    : getBlogPageUrl(lang);
  const suffix = page > 1 ? `?page=${page}` : "";
  const pageUrl = `${base}${suffix}`;

  const isPlainFirstPage = page === 1 && !category && !q;

  const languages: Record<string, string> = {};
  if (isPlainFirstPage) {
    for (const l of LANGS) {
      languages[LANG_CONFIG[l].hreflang] = getBlogPageUrl(l);
    }
    languages["x-default"] = getBlogPageUrl("en");
  }

  const title = page > 1 ? `${seo.title} — ${page}` : seo.title;

  return {
    title,
    description: seo.description,
    // On-site search results are an unbounded, thin URL space — crawl the links
    // on them, but keep them out of the index.
    ...(q ? { robots: { index: false, follow: true } } : {}),
    alternates: {
      canonical: pageUrl,
      ...(isPlainFirstPage ? { languages } : {}),
    },
    openGraph: {
      type: "website",
      url: pageUrl,
      title,
      description: seo.description,
      locale: config.locale,
      alternateLocale: LANGS.filter((l) => l !== lang).map((l) => LANG_CONFIG[l].locale),
      siteName: "Residency24",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: seo.description,
    },
    icons: { icon: "/favicon.png" },
  };
}

// 9 put the Persian blog 32 pagination hops deep; 24 brings it to 12 and keeps
// every post within a few clicks of the index. The /api/cms/posts route caps
// per_page at 50.
const PER_PAGE = 24;

export default async function BlogPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ category?: string; q?: string; page?: string }>;
}) {
  const { lang: rawLang } = await params;
  const sp = await searchParams;

  const lang = (LANGS.includes(rawLang as Lang) ? rawLang : "en") as Lang;
  const seo = BLOG_SEO[lang];

  const category = sp.category ?? "";
  const q = sp.q ?? "";
  const page = Math.max(1, Number(sp.page ?? 1));

  // Fetch in parallel
  const [postsResponse, categories] = await Promise.all([
    fetchBlogPosts(lang, { category: category || undefined, q: q || undefined, page, per_page: PER_PAGE }),
    fetchBlogCategories(lang),
  ]);

  const blogListingSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": seo.h1,
    "description": seo.description,
    "url": getBlogPageUrl(lang),
    "inLanguage": lang,
    "blogPost": postsResponse.data.slice(0, 3).map((p) => ({
      "@type": "BlogPosting",
      "headline": p.title,
      "url": `https://residency24.com${p.url}`,
      "datePublished": p.published_at,
      "dateModified": p.updated_at,
      ...(p.author ? { "author": { "@type": "Person", "name": p.author.name } } : {}),
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogListingSchema) }}
      />
      <div className="min-h-screen bg-background">
        <Navbar />

        {/* Hero */}
        <BlogHero
          eyebrow={seo.eyebrow}
          h1={seo.h1}
          sub={seo.sub}
          lang={lang}
        />

        {/* Filter bar (floats up, overlapping hero bottom) */}
        <div className="relative z-10 -mt-8">
          <div className="max-w-5xl mx-auto px-4">
            <BlogFilters
              categories={categories}
              activeCategory={category}
              activeQ={q}
              lang={lang}
              seo={seo}
              basePath={localizedPath(lang, "blog")}
            />
          </div>
        </div>

        {/* Post grid */}
        <section className="max-w-5xl mx-auto px-4 pt-10 pb-16">
          <BlogGrid
            posts={postsResponse.data}
            lang={lang}
            seo={seo}
          />

          {postsResponse.meta.last_page > 1 && (
            <div className="mt-12">
              <BlogPagination
                meta={postsResponse.meta}
                basePath={localizedPath(lang, "blog")}
                currentCategory={category}
                currentQ={q}
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
