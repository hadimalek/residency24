"use client";

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { Send, Sparkles } from 'lucide-react';
import ChatModal from '@/components/ChatModal';

const HeroChat = () => {
  const { t, isRTL } = useLanguage();
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
      <section className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center px-4 py-12 bg-navy">
        <div className="w-full max-w-[760px] flex flex-col items-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 bg-gold/15 border border-gold/40 rounded-full px-4 py-1.5 mb-6"
          >
            <Sparkles size={14} className="text-gold" />
            <span className="text-xs text-gold tracking-wide">{t.hero.badge}</span>
          </motion.div>

          {/* H1 */}
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-[clamp(28px,5.5vw,56px)] font-bold text-white leading-[1.08] max-w-[700px] mb-4 text-center"
          >
            {t.hero.h1}
          </motion.h1>

          {/* Sub */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-lg text-white/70 text-center mb-8"
          >
            {t.hero.sub}
          </motion.p>

          {/* ChatGPT-style input box */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.35 }}
            className="w-full max-w-[680px]"
          >
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
                  placeholder={t.hero.placeholder}
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
          </motion.div>

          {/* Suggested pills */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-5 w-full max-w-[680px]"
          >
            <p className="text-[12px] text-white/40 mb-2.5 text-center">{t.hero.pill_label}</p>
            <div className="flex flex-wrap justify-center gap-2">
              {(t.hero.pills as string[]).map((pill: string, i: number) => (
                <motion.button
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.65 + i * 0.05 }}
                  onClick={() => openWithMessage(pill)}
                  className="px-3.5 py-2 text-[13px] rounded-full bg-white/10 text-white/80 border border-white/15 backdrop-blur-sm transition-all hover:bg-white/20 hover:text-white hover:border-white/30"
                >
                  {pill}
                </motion.button>
              ))}
            </div>
          </motion.div>
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
