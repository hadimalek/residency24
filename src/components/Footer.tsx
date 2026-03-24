"use client";

import { useLanguage, Lang } from '@/contexts/LanguageContext';
import { MessageCircle, Send } from 'lucide-react';
const logoWhite = '/residency24-logo-white.svg';

const Footer = () => {
  const { lang, setLang, t } = useLanguage();

  const columns = [
    { title: t.footer.cols.uae_title, links: t.footer.cols.uae_links },
    { title: t.footer.cols.oman_title, links: t.footer.cols.oman_links },
    { title: t.footer.cols.turkey_title, links: t.footer.cols.turkey_links },
    { title: t.footer.cols.company_title, links: t.footer.cols.company_links },
  ];

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
          <div className="flex gap-1">
            {(['fa', 'en', 'ar', 'ru'] as Lang[]).map((l) => (
              <button key={l} onClick={() => setLang(l)}
                className={`px-2.5 py-1 text-xs rounded transition-colors ${lang === l ? 'bg-gold text-navy font-semibold' : 'text-white/50 hover:text-white'}`}>
                {l.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
