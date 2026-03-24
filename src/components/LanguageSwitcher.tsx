"use client";

import { useLanguage, Lang } from '@/contexts/LanguageContext';

const LanguageSwitcher = () => {
  const { lang, setLang, isRTL } = useLanguage();

  return (
    <div
      className="fixed bottom-6 z-50 bg-white border border-border rounded-full px-3 py-1.5 flex gap-1.5 shadow-lg"
      style={{ [isRTL ? 'left' : 'right']: 24 }}
    >
      {(['fa', 'en', 'ar', 'ru'] as Lang[]).map((l) => (
        <button
          key={l}
          onClick={() => setLang(l)}
          className={`px-2.5 py-1 text-xs rounded-full font-medium transition-colors ${
            lang === l
              ? 'bg-navy text-white'
              : 'text-muted-foreground hover:text-navy'
          }`}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
};

export default LanguageSwitcher;
