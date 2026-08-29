"use client";

import { useState, useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Send } from "lucide-react";
import ChatModal from '@/components/ChatModal';
import { BreadcrumbTrail } from '@/components/shared/SharedBreadcrumb';
import type { BreadcrumbItem } from '@/components/shared/SharedBreadcrumb';

type HeroChatPage = 'p001' | 'p002' | 'p003' | 'p004' | 'p005' | 'p006'

interface HeroChatProps {
  pageKey?: HeroChatPage
  h1?: string
  sub?: string
  badge?: string
  placeholder?: string
  pills?: string[]
  pillLabel?: string
  /** Rendered at the top of the hero, over the background, instead of in a
      separate white band above it. */
  crumbs?: BreadcrumbItem[]
  /** Photo behind the hero. Darkened below so the text stays readable. */
  bgImage?: string
  bgAlt?: string
}

// `badge` is accepted and ignored. The pill above the H1 was dropped from every
// page: on the homepage it read "AI Advisor · Free · 4 Languages" and elsewhere
// it repeated the same "390+ successful cases" claim the page already made
// below. The prop stays in the signature so the call sites still type-check;
// remove it from them when one of those pages is next touched.
const HeroChat = ({ pageKey, h1: h1Override, sub: subOverride, placeholder: placeholderOverride, pills: pillsOverride, pillLabel: pillLabelOverride, crumbs, bgImage, bgAlt }: HeroChatProps = {}) => {
  const { t, isRTL } = useLanguage();

  // resolve hero content: explicit overrides > page-specific translation key > shared homepage hero
  const heroKey = pageKey ? `hero_${pageKey}` : 'hero'
  const baseHero = (t[heroKey] ?? t.hero) as typeof t.hero
  const hero = {
    ...baseHero,
    h1: h1Override ?? baseHero.h1,
    sub: subOverride ?? baseHero.sub,
    placeholder: placeholderOverride ?? baseHero.placeholder,
    pills: pillsOverride ?? baseHero.pills,
    pill_label: pillLabelOverride ?? baseHero.pill_label,
  }
  // Lifts the type off a photo. Skipped on the flat-navy heroes, where the
  // contrast is already there and a shadow would only muddy the text.
  const overPhoto = bgImage ? ' [text-shadow:0_2px_18px_rgba(0,12,45,0.75)]' : '';

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [initialMessage, setInitialMessage] = useState('');
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const openWithMessage = (msg: string) => {
    setInitialMessage(msg);
    setIsModalOpen(true);
    setInputValue('');
  };

  const handleSubmit = () => {
    if (inputValue.trim()) {
      openWithMessage(inputValue.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <>
      <section className="relative min-h-[calc(100vh-64px)] flex flex-col bg-navy overflow-hidden">
        {bgImage && (
          <>
            {/* The photo. `scale-110` crops the white rounded frame the blog
                library bakes into its images, which would otherwise show as a
                pale edge around a full-bleed background. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={bgImage}
              alt={bgAlt ?? ''}
              className="absolute inset-0 w-full h-full object-cover scale-110"
              fetchPriority="high"
              decoding="async"
            />
            {/* Two layers, tuned so the skyline actually reads while the text
                stays legible: an even wash that takes the daylight down to a
                blue the white type can sit on, then a vertical gradient that
                deepens towards both edges, where the crumbs and the pills need
                more contrast than the middle of the photo gives them. */}
            <div className="absolute inset-0 bg-navy/55" aria-hidden="true" />
            <div
              className="absolute inset-0 bg-gradient-to-b from-navy via-navy/25 to-navy"
              aria-hidden="true"
            />
          </>
        )}

        {crumbs?.length ? (
          <BreadcrumbTrail items={crumbs} className="relative w-full max-w-5xl mx-auto px-4 pt-4" />
        ) : null}

        <div className="relative flex-1 w-full flex flex-col items-center justify-center px-4 py-12">
          <div className="w-full max-w-[760px] flex flex-col items-center">
          {/* H1 */}
          <h1
            className={`text-[clamp(28px,5.5vw,56px)] font-bold text-white leading-[1.08] max-w-[700px] mb-4 text-center${overPhoto}`}
          >
            {hero.h1}
          </h1>

          {/* Sub */}
          <p className={`text-lg text-white/85 text-center mb-8${overPhoto}`}>
            {hero.sub}
          </p>

          {/* ChatGPT-style input box */}
          <div className="w-full max-w-[680px]">
            <div
              className="bg-white rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.25)] transition-shadow focus-within:shadow-[0_8px_48px_rgba(0,0,0,0.35)]"
              style={{ border: '1.5px solid rgba(255,255,255,0.15)' }}
            >
              <div className="flex items-end p-3 gap-2.5">
                {isRTL && (
                  <button
                    onClick={handleSubmit}
                    disabled={!inputValue.trim()}
                    className="flex-shrink-0 w-12 h-12 rounded-[14px] flex items-center justify-center transition-all"
                    style={{
                      background: inputValue.trim() ? '#001E6E' : 'rgba(0,30,110,0.15)',
                      cursor: inputValue.trim() ? 'pointer' : 'default',
                    }}
                    aria-label="ارسال"
                  >
                    <Send size={17} strokeWidth={2} color={inputValue.trim() ? 'white' : 'rgba(0,30,110,0.4)'} style={{ transform: 'scaleX(-1)' }} />
                  </button>
                )}
                <textarea
                  ref={inputRef}
                  value={inputValue}
                  onChange={e => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={hero.placeholder}
                  rows={1}
                  dir={isRTL ? 'rtl' : 'ltr'}
                  className="flex-1 bg-transparent border-none outline-none text-[16px] text-ink resize-none py-3 px-3 placeholder:text-muted leading-relaxed overflow-hidden"
                  style={{ fontFamily: 'inherit', textAlign: isRTL ? 'right' : 'left', minHeight: '48px', maxHeight: '48px' }}
                />
                {!isRTL && (
                  <button
                    onClick={handleSubmit}
                    disabled={!inputValue.trim()}
                    className="flex-shrink-0 w-12 h-12 rounded-[14px] flex items-center justify-center transition-all"
                    style={{
                      background: inputValue.trim() ? '#001E6E' : 'rgba(0,30,110,0.15)',
                      cursor: inputValue.trim() ? 'pointer' : 'default',
                    }}
                    aria-label="Send"
                  >
                    <Send size={17} strokeWidth={2} color={inputValue.trim() ? 'white' : 'rgba(0,30,110,0.4)'} />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Suggested pills */}
          <div className="mt-5 w-full max-w-[680px]">
            <p className={`text-[12px] text-white/60 mb-2.5 text-center${overPhoto}`}>{hero.pill_label}</p>
            <div className="flex flex-wrap justify-center gap-2">
              {(hero.pills as string[]).map((pill: string, i: number) => (
                <button
                  key={i}
                  onClick={() => openWithMessage(pill)}
                  className="px-3.5 py-2 text-[13px] rounded-full bg-white/10 text-white/80 border border-white/15 backdrop-blur-sm transition-all hover:bg-white/20 hover:text-white hover:border-white/30"
                >
                  {pill}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>

      <ChatModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setInitialMessage(''); }}
        initialMessage={initialMessage}
      />
    </>
  );
};

export default HeroChat;
