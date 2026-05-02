"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import translations, { type Lang } from '@/translations';

interface LanguageContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: Record<string, any>;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode; initialLang?: Lang }> = ({ children, initialLang }) => {
  const [lang, setLang] = useState<Lang>(initialLang || 'fa');
  const t = translations[lang];
  const isRTL = t.dir === 'rtl';

  useEffect(() => {
    document.documentElement.dir = t.dir;
    document.documentElement.lang = lang;
  }, [lang, t.dir]);

  // When language changes, navigate to the new URL.
  // English lives on root paths (no /en prefix); fa/ar/ru keep their prefix.
  const handleSetLang = (newLang: Lang) => {
    setLang(newLang);
    if (typeof window !== 'undefined') {
      const currentPath = window.location.pathname;
      // Strip any existing locale prefix to get the bare path (e.g. "/uae/")
      const langPattern = /^\/(fa|en|ar|ru)(\/|$)/;
      const bare = currentPath.replace(langPattern, '/');
      const target = newLang === 'en'
        ? (bare === '/' ? '/' : bare)
        : (bare === '/' ? `/${newLang}/` : `/${newLang}${bare}`);
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
