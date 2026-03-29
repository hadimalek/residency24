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

  // When language changes, navigate to the new URL
  const handleSetLang = (newLang: Lang) => {
    setLang(newLang);
    if (typeof window !== 'undefined') {
      const currentPath = window.location.pathname;
      // Replace /xx/ prefix or navigate to /newLang/
      const langPattern = /^\/(fa|en|ar|ru)(\/|$)/;
      if (langPattern.test(currentPath)) {
        const newPath = currentPath.replace(langPattern, `/${newLang}$2`);
        window.location.href = newPath;
      } else {
        window.location.href = `/${newLang}/`;
      }
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
