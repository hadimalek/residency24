import type { Metadata } from "next";
import { notFound } from "next/navigation";
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
import { LanguageProvider } from "@/contexts/LanguageContext";
import BlogHero from "@/components/blog/BlogHero";
import BlogFilters from "@/components/blog/BlogFilters";
import BlogGrid from "@/components/blog/BlogGrid";
import BlogPagination from "@/components/blog/BlogPagination";

export const dynamic = "force-dynamic";

const PER_PAGE = 9;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
  const { lang: rawLang, slug } = await params;
  const lang = (LANGS.includes(rawLang as Lang) ? rawLang : "en") as Lang;
  const seo = BLOG_SEO[lang];
  const config = LANG_CONFIG[lang];
  const decodedSlug = decodeURIComponent(slug);

  const cats = await fetchBlogCategories(lang);
  const cat = cats.find((c) => c.slug === decodedSlug);
  const title = cat ? `${cat.name} — ${seo.title}` : seo.title;
  const description = cat?.description ?? seo.description;
  const pageUrl = `${getBlogPageUrl(lang).replace(/\/$/, "")}/category/${slug}`;

  return {
    title,
    description,
    alternates: { canonical: pageUrl },
    openGraph: {
      type: "website",
      url: pageUrl,
      title,
      description,
      locale: config.locale,
      siteName: "Residency24",
    },
    twitter: { card: "summary_large_image", title, description },
    icons: { icon: "/favicon.png" },
  };
}

export default async function BlogCategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string; slug: string }>;
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const { lang: rawLang, slug } = await params;
  const sp = await searchParams;

  const lang = (LANGS.includes(rawLang as Lang) ? rawLang : "en") as Lang;
  const seo = BLOG_SEO[lang];
  const decodedSlug = decodeURIComponent(slug);

  const q = sp.q ?? "";
  const page = Math.max(1, Number(sp.page ?? 1));

  const [postsResponse, categories] = await Promise.all([
    fetchBlogPosts(lang, {
      category: decodedSlug,
      q: q || undefined,
      page,
      per_page: PER_PAGE,
    }),
    fetchBlogCategories(lang),
  ]);

  const cat = categories.find((c) => c.slug === decodedSlug);
  if (!cat) notFound();

  return (
    <LanguageProvider initialLang={lang}>
      <div className="min-h-screen bg-background">
        <Navbar />

        <BlogHero
          eyebrow={seo.eyebrow}
          h1={cat.name}
          sub={cat.description ?? seo.sub}
          lang={lang}
        />

        <div className="relative z-10 -mt-8">
          <div className="max-w-5xl mx-auto px-4">
            <BlogFilters
              categories={categories}
              activeCategory={decodedSlug}
              activeQ={q}
              lang={lang}
              seo={seo}
              basePath={localizedPath(lang, "blog")}
            />
          </div>
        </div>

        <section className="max-w-5xl mx-auto px-4 pt-10 pb-16">
          <BlogGrid posts={postsResponse.data} lang={lang} seo={seo} />

          {postsResponse.meta.last_page > 1 && (
            <div className="mt-12">
              <BlogPagination
                meta={postsResponse.meta}
                basePath={`${localizedPath(lang, "blog")}/category/${slug}`}
                currentCategory=""
                currentQ={q}
              />
            </div>
          )}
        </section>

        <Footer />
        <WhatsAppFloat />
      </div>
    </LanguageProvider>
  );
}
