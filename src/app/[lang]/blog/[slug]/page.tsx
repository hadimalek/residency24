import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { Lang } from "@/translations";
import { LANGS, LANG_CONFIG, BLOG_SEO, localizedPath } from "@/lib/seo";
import { fetchBlogPost, fetchBlogPostParams, fetchRelatedPosts } from "@/lib/cms/api";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import PostHero from "@/components/blog/PostHero";
import PostBreadcrumbs from "@/components/blog/PostBreadcrumbs";
import PostToc from "@/components/blog/PostToc";
import PostBody from "@/components/blog/PostBody";
import PostAuthor from "@/components/blog/PostAuthor";
import PostFaqs from "@/components/blog/PostFaqs";
import PostCta from "@/components/blog/PostCta";
import PostComments from "@/components/blog/PostComments";
import PostMeta from "@/components/blog/PostMeta";
import RelatedPosts from "@/components/blog/RelatedPosts";

export const dynamicParams = true;

export async function generateStaticParams() {
  const pairs = await fetchBlogPostParams();
  return pairs.map(({ lang, slug }) => ({ lang, slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
  const { lang: rawLang, slug } = await params;
  const lang = (LANGS.includes(rawLang as Lang) ? rawLang : "en") as Lang;
  const config = LANG_CONFIG[lang];

  const res = await fetchBlogPost(lang, slug);
  if (!res) {
    return { title: "Post not found — Residency24" };
  }

  const { post, seo, hreflang } = res.data;

  const title = seo.meta_title ?? post.title;
  const description = seo.meta_description ?? post.excerpt ?? "";
  const canonical = seo.canonical_url ?? post.canonical_url;
  const ogImage = seo.og_image_url ?? post.featured_image?.url;

  const languages: Record<string, string> = {};
  let xDefault: string | undefined;
  for (const h of hreflang) {
    if (h.lang === "x-default") xDefault = h.url;
    else languages[h.lang] = h.url;
  }
  if (xDefault) languages["x-default"] = xDefault;

  return {
    title,
    description,
    robots: seo.robots ?? "index,follow",
    alternates: {
      canonical,
      languages: Object.keys(languages).length > 0 ? languages : undefined,
    },
    openGraph: {
      type: (seo.og_type as "article") ?? "article",
      url: canonical,
      title: seo.og_title ?? title,
      description: seo.og_description ?? description,
      locale: config.locale,
      siteName: "Residency24",
      ...(ogImage ? { images: [{ url: ogImage, width: 1200, height: 630 }] } : {}),
      ...(post.published_at ? { publishedTime: post.published_at } : {}),
      ...(post.updated_at ? { modifiedTime: post.updated_at } : {}),
    },
    twitter: {
      card: (seo.twitter_card as "summary_large_image") ?? "summary_large_image",
      title: seo.twitter_title ?? title,
      description: seo.twitter_description ?? description,
      ...(seo.twitter_image_url ? { images: [seo.twitter_image_url] } : {}),
    },
    icons: { icon: "/favicon.png" },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang: rawLang, slug } = await params;
  const lang = (LANGS.includes(rawLang as Lang) ? rawLang : "en") as Lang;
  const dir = LANG_CONFIG[lang].dir;

  const res = await fetchBlogPost(lang, slug);
  if (!res) notFound();

  const { post, seo, hreflang, faqs, ctas, breadcrumbs, related } = res.data;
  const blogSeo = BLOG_SEO[lang];

  // Resolve related entities (entity_type=post) into full list items
  const relatedPosts = await fetchRelatedPosts(lang, related);

  // JSON-LD Article schema
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt ?? undefined,
    url: post.canonical_url,
    datePublished: post.published_at ?? undefined,
    dateModified: post.updated_at ?? undefined,
    inLanguage: lang,
    ...(post.author ? { author: { "@type": "Person", name: post.author.name } } : {}),
    ...(post.featured_image ? { image: post.featured_image.url } : {}),
    publisher: {
      "@type": "Organization",
      name: "Residency24",
      logo: { "@type": "ImageObject", url: "https://residency24.com/logo512.png" },
    },
  };

  // FAQ schema (if faqs present)
  const faqSchema =
    faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((f) => ({
            "@type": "Question",
            name: f.question,
            acceptedAnswer: { "@type": "Answer", text: f.answer },
          })),
        }
      : null;

  // Breadcrumb schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map((b, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: b.label,
      item: `https://residency24.com${b.href}`,
    })),
  };

  // Split CTAs by placement
  const midCtas = ctas.filter((c) => c.placement === "mid" || c.placement === "inline");
  const bottomCtas = ctas.filter((c) => c.placement === "bottom" || !c.placement);

  const blogListPath = localizedPath(lang, "blog");

  return (
    <LanguageProvider initialLang={lang}>
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="min-h-screen bg-background" dir={dir}>
        <Navbar />

        {/* Hero */}
        <PostHero post={post} lang={lang} />

        {/* Breadcrumbs */}
        <div className="max-w-5xl mx-auto px-4 mt-6">
          <PostBreadcrumbs breadcrumbs={breadcrumbs} lang={lang} blogListPath={blogListPath} />
        </div>

        {/* Main content + sidebar */}
        <div className="max-w-5xl mx-auto px-4 mt-8 pb-20">
          <div className="flex flex-col lg:flex-row gap-10">
            {/* Sidebar — ToC (sticky) */}
            {post.content_html && (
              <aside className="lg:w-64 flex-shrink-0 order-2 lg:order-none">
                <PostToc html={post.content_html} lang={lang} dir={dir} />
              </aside>
            )}

            {/* Article body */}
            <main className="flex-1 min-w-0">
              <PostBody html={post.content_html ?? ""} />

              {/* Category + tag chips */}
              <PostMeta category={post.category} tags={post.tags} lang={lang} />

              {/* Mid CTAs */}
              {midCtas.length > 0 && (
                <div className="mt-10 space-y-4">
                  {midCtas.map((cta, i) => (
                    <PostCta key={i} cta={cta} lang={lang} />
                  ))}
                </div>
              )}

              {/* FAQs */}
              {faqs.length > 0 && (
                <div className="mt-12">
                  <PostFaqs faqs={faqs} lang={lang} />
                </div>
              )}

              {/* Author */}
              {post.author && (
                <div className="mt-12">
                  <PostAuthor author={post.author} lang={lang} />
                </div>
              )}

              {/* Bottom CTAs */}
              {bottomCtas.length > 0 && (
                <div className="mt-10 space-y-4">
                  {bottomCtas.map((cta, i) => (
                    <PostCta key={i} cta={cta} lang={lang} />
                  ))}
                </div>
              )}

              {/* Related posts */}
              {relatedPosts.length > 0 && (
                <RelatedPosts
                  posts={relatedPosts}
                  lang={lang}
                  readMore={blogSeo.readMore}
                  readingTimeUnit={blogSeo.readingTimeUnit}
                />
              )}

              {/* Comments */}
              <div className="mt-14">
                <PostComments lang={lang} slug={slug} />
              </div>
            </main>
          </div>
        </div>

        <Footer />
        <WhatsAppFloat />
      </div>
    </LanguageProvider>
  );
}
