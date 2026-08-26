"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { type Lang } from '@/translations';

interface LanguageContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: Record<string, any>;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// IMPORTANT: never value-import `@/translations` from a Client Component — the
// whole 4-language blob (~460KB) would ship in every visitor's JS. The server
// layout passes only the active language's dict in here; client code reads it
// via useLanguage().t.
export const LanguageProvider: React.FC<{
  children: React.ReactNode;
  initialLang?: Lang;
  dict: Record<string, any>;
}> = ({ children, initialLang, dict }) => {
  const [lang, setLang] = useState<Lang>(initialLang || 'fa');
  const t = dict;
  const isRTL = t.dir === 'rtl';

  useEffect(() => {
    document.documentElement.dir = t.dir;
    document.documentElement.lang = lang;
  }, [lang, t.dir]);

  // When language changes, navigate to the new URL.
  // English lives on root paths (no /en prefix); fa/ar/ru keep their prefix.
  //
  // NOTE: nothing calls this any more, and nothing should. Driving the language
  // switch from JS is what orphaned three quarters of the site: a <button> that
  // sets window.location leaves no <a href> for a crawler to follow, so /fa,
  // /ar and /ru had zero inbound internal links and a full-site crawl reached
  // only 43 of 477 URLs. The switcher in src/components/Footer.tsx renders real
  // anchors instead. If you need a language control somewhere else, render
  // links there too — do not reach for this.
  const handleSetLang = (newLang: Lang) => {
    setLang(newLang);
    if (typeof window !== 'undefined') {
      const currentPath = window.location.pathname;
      // Strip any existing locale prefix to get the bare path (e.g. "/uae/")
      const langPattern = /^\/(fa|en|ar|ru)(\/|$)/;
      const bare = currentPath.replace(langPattern, '/');
      const target = newLang === 'en'
        ? (bare === '/' ? '/' : bare)
        : (bare === '/' ? `/${newLang}` : `/${newLang}${bare}`);
      window.location.href = target;
    }
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang: handleSetLang, t, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
};

export type { Lang };
