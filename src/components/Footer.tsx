"use client";

import { usePathname } from 'next/navigation';
import { useLanguage, Lang } from '@/contexts/LanguageContext';
import { LANGS, localizedPath, stripLocale } from '@/lib/locale-path';
import { MessageCircle, Send } from 'lucide-react';
const logoWhite = '/residency24-logo-white.svg';

const LANG_LABELS: Record<Lang, string> = { fa: 'FA', en: 'EN', ar: 'AR', ru: 'RU' };

const Footer = () => {
  const { lang, t } = useLanguage();
  const pathname = usePathname() ?? '/';

  const columns = [
    { title: t.footer.cols.uae_title, links: t.footer.cols.uae_links },
    { title: t.footer.cols.oman_title, links: t.footer.cols.oman_links },
    { title: t.footer.cols.turkey_title, links: t.footer.cols.turkey_links },
    { title: t.footer.cols.company_title, links: t.footer.cols.company_links },
  ];

  // Where each language link should point. Static pages exist in all four
  // locales, so the equivalent path is correct. Blog POSTS are not translated
  // — /fa/blog/<slug> has no English twin and vice versa — so for a post we
  // send the visitor to the target locale's blog index rather than emit a link
  // that 404s. Category pages are locale-specific too, for the same reason.
  //
  // stripLocale() is what makes this safe to compute in a Client Component.
  // src/proxy.ts rewrites English routes (/uae/x -> /en/uae/x), so usePathname()
  // yields "/en/uae/x" on the server but "/uae/x" in the browser. Stripping the
  // locale segment collapses both to the same bare path, so the rendered hrefs
  // are identical on both sides and hydration stays clean. Do not build these
  // links from the raw pathname.
  const bare = stripLocale(pathname);
  const isBlogChild = bare.startsWith('blog/');
  const localeHref = (target: Lang) =>
    localizedPath(target, isBlogChild ? 'blog' : bare);

  return (
    <footer className="bg-[#0A0A0A] text-white/60 pt-16 pb-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start mb-10 gap-6" style={{ direction: 'ltr' }}>
          <img src={logoWhite} alt="Residency24" className="h-9" />
          <div className="flex gap-2">
            <a href="https://t.me/residency24" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 bg-telegram text-white rounded-lg px-5 py-2.5 text-sm font-medium hover:opacity-90 transition-opacity">
              <Send size={16} /> {t.nav.tg}
            </a>
            <a href="https://wa.me/971562009131" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 bg-whatsapp text-white rounded-lg px-5 py-2.5 text-sm font-medium hover:opacity-90 transition-opacity">
              <MessageCircle size={16} /> {t.nav.wa}
            </a>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          {columns.map((col, i) => (
            <div key={i}>
              <p className="text-[13px] font-semibold text-white mb-4">{col.title}</p>
              <ul className="space-y-2">
                {col.links.map((link: any, j: number) => (
                  <li key={j}>
                    <a href={link.href} className="text-[13px] text-white/50 hover:text-white transition-colors">{link.label}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <div className="text-center md:text-start">
            <p>{t.footer.copyright} · {t.footer.tagline}</p>
            <p className="mt-1 max-w-[500px] leading-relaxed">{t.footer.disclaimer}</p>
          </div>
          {/* Language switcher. These MUST be real <a href> elements, not
              buttons: they are the ONLY internal links that cross a locale
              boundary. Every other footer/nav link stays inside the current
              language, so when this was a row of <button onClick> the fa/ar/ru
              trees had zero inbound links and sat outside the crawlable link
              graph entirely (a full-site crawl reached 43 of 477 URLs).
              hreflang does not substitute for this — it is a <head> hint that
              carries no link equity. */}
          <nav className="flex gap-1" aria-label="Language">
            {LANGS.map((l) => {
              const isActive = l === lang;
              return (
                <a
                  key={l}
                  href={localeHref(l)}
                  hrefLang={l}
                  lang={l}
                  aria-current={isActive ? 'page' : undefined}
                  className={`px-2.5 py-1 text-xs rounded transition-colors ${isActive ? 'bg-gold text-navy font-semibold' : 'text-white/50 hover:text-white'}`}
                >
                  {LANG_LABELS[l]}
                </a>
              );
            })}
          </nav>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
