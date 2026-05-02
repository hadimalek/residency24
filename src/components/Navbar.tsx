"use client";

import { useState, useRef, useCallback } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { MessageCircle, Send, Menu, X, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
const logo = '/residency24-logo-white.svg';

const useHoverIntent = (delay = 150) => {
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const onEnter = useCallback(() => { clearTimeout(timeoutRef.current); setIsOpen(true); }, []);
  const onLeave = useCallback(() => { timeoutRef.current = setTimeout(() => setIsOpen(false), delay); }, [delay]);
  return { isOpen, onEnter, onLeave };
};

const Navbar = () => {
  const { t, isRTL, lang } = useLanguage();
  const [mobileOpen, setMobileOpen] = useState(false);
  const services = useHoverIntent();
  const countries = useHoverIntent();
  // English is served at root (no /en prefix). Other locales use /<lang>/.
  const lp = (path: string) => (lang === "en" ? `/${path}` : `/${lang}/${path}`);

  return (
    <motion.nav
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="sticky top-0 z-50 h-16 bg-navy flex items-center justify-between px-4 md:px-8"
      style={{ direction: 'ltr' }}
    >
      <a href="/" className="flex-shrink-0">
        <img src={logo} alt="Residency24" className="h-9" />
      </a>

      {/* Desktop nav */}
      <div className="hidden md:flex items-center gap-6 text-sm font-medium text-white/80" style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
        {/* Services mega dropdown */}
        <div className="relative" onMouseEnter={services.onEnter} onMouseLeave={services.onLeave}>
          <button className="flex items-center gap-1 hover:text-gold transition-colors py-4">
            {t.nav.services} <ChevronDown size={14} />
          </button>
          {services.isOpen && (
            <div className="absolute top-full mt-1 bg-white rounded-xl shadow-2xl border border-border p-5 min-w-[560px] z-50" style={{ [isRTL ? 'right' : 'left']: '-100px' }}>
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <p className="text-xs font-semibold text-navy mb-2">🇦🇪 {t.nav.menu.uae}</p>
                  <a href={lp('uae/golden-visa/')} className="block text-sm text-ink py-1 hover:text-navy">{t.nav.menu.golden_visa}</a>
                  <a href={lp('uae/company-registration/')} className="block text-sm text-ink py-1 hover:text-navy">{t.nav.menu.company_uae}</a>
                  <a href={lp('uae/buy-property/')} className="block text-sm text-ink py-1 hover:text-navy">{t.nav.menu.property_uae}</a>
                  <a href={lp('uae/tourist-visa/')} className="block text-sm text-ink py-1 hover:text-navy">{t.nav.menu.tourist_uae}</a>
                </div>
                <div>
                  <p className="text-xs font-semibold text-navy mb-2">🇴🇲 {t.nav.menu.oman}</p>
                  <a href={lp('oman/company-registration/')} className="block text-sm text-ink py-1 hover:text-navy">{t.nav.menu.company_oman}</a>
                  <a href={lp('oman/buy-property/')} className="block text-sm text-ink py-1 hover:text-navy">{t.nav.menu.property_oman}</a>
                  <a href={lp('oman/residency-visa/')} className="block text-sm text-ink py-1 hover:text-navy">{t.nav.menu.residency_oman}</a>
                </div>
                <div>
                  <p className="text-xs font-semibold text-navy mb-2">🇹🇷 {t.nav.menu.turkey}</p>
                  <a href={lp('turkey/citizenship/')} className="block text-sm text-ink py-1 hover:text-navy">
                    {t.nav.menu.citizenship_turkey} <span className="text-[10px] bg-gold text-navy px-1.5 py-0.5 rounded ms-1">NEW</span>
                  </a>
                  <a href={lp('turkey/buy-property/')} className="block text-sm text-ink py-1 hover:text-navy">{t.nav.menu.property_turkey}</a>
                  <a href={lp('turkey/company-registration/')} className="block text-sm text-ink py-1 hover:text-navy">{t.nav.menu.company_turkey}</a>
                </div>
              </div>
              <div className="border-t border-border mt-4 pt-3 flex gap-6">
                <a href={lp('compare/uae-vs-oman-vs-turkey/')} className="text-sm text-navy font-medium hover:underline">⚖️ {t.nav.menu.compare}</a>
                <a href="#hero" className="text-sm text-navy font-medium hover:underline">🤖 {t.nav.menu.ai_advisor}</a>
              </div>
            </div>
          )}
        </div>

        <div className="relative" onMouseEnter={countries.onEnter} onMouseLeave={countries.onLeave}>
          <button className="flex items-center gap-1 hover:text-gold transition-colors py-4">
            {t.nav.countries} <ChevronDown size={14} />
          </button>
          {countries.isOpen && (
            <div className="absolute top-full mt-1 bg-white rounded-lg shadow-xl border border-border py-2 min-w-[160px] z-50" style={{ [isRTL ? 'right' : 'left']: 0 }}>
              <a href={lp('uae/')} className="block px-4 py-2 text-sm text-ink hover:bg-surface">🇦🇪 {t.nav.menu.uae}</a>
              <a href={lp('oman/')} className="block px-4 py-2 text-sm text-ink hover:bg-surface">🇴🇲 {t.nav.menu.oman}</a>
              <a href={lp('turkey/')} className="block px-4 py-2 text-sm text-ink hover:bg-surface">🇹🇷 {t.nav.menu.turkey}</a>
            </div>
          )}
        </div>

        <a href={lp('about/')} className="hover:text-gold transition-colors">{t.nav.about}</a>
        <a href={lp('blog/')} className="hover:text-gold transition-colors">{t.nav.blog}</a>
      </div>

      <div className="flex items-center gap-2">
        <a href="https://t.me/residency24" target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-2 bg-telegram text-white rounded-lg px-3 md:px-4 py-2 text-sm font-medium hover:opacity-90 transition-opacity">
          <Send size={16} />
          <span className="hidden md:inline">{t.nav.tg}</span>
        </a>
        <a href="https://wa.me/971562009131" target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-2 bg-whatsapp text-white rounded-lg px-3 md:px-4 py-2 text-sm font-medium hover:opacity-90 transition-opacity">
          <MessageCircle size={16} />
          <span className="hidden md:inline">{t.nav.wa}</span>
        </a>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden text-white p-1">
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="absolute top-16 left-0 right-0 bg-navy border-t border-white/10 py-4 px-6 md:hidden z-50 max-h-[80vh] overflow-y-auto">
          <div className="space-y-3" style={{ direction: isRTL ? 'rtl' : 'ltr', textAlign: isRTL ? 'right' : 'left' }}>
            <p className="text-white/50 text-xs uppercase tracking-wider">🇦🇪 {t.nav.menu.uae}</p>
            <a href={lp('uae/golden-visa/')} className="block text-white/80 text-sm py-1">{t.nav.menu.golden_visa}</a>
            <a href={lp('uae/company-registration/')} className="block text-white/80 text-sm py-1">{t.nav.menu.company_uae}</a>
            <a href={lp('uae/buy-property/')} className="block text-white/80 text-sm py-1">{t.nav.menu.property_uae}</a>
            <div className="border-t border-white/10 pt-3 mt-3">
              <p className="text-white/50 text-xs uppercase tracking-wider">🇴🇲 {t.nav.menu.oman}</p>
              <a href={lp('oman/company-registration/')} className="block text-white/80 text-sm py-1">{t.nav.menu.company_oman}</a>
              <a href={lp('oman/buy-property/')} className="block text-white/80 text-sm py-1">{t.nav.menu.property_oman}</a>
            </div>
            <div className="border-t border-white/10 pt-3 mt-3">
              <p className="text-white/50 text-xs uppercase tracking-wider">🇹🇷 {t.nav.menu.turkey}</p>
              <a href={lp('turkey/citizenship/')} className="block text-white/80 text-sm py-1">{t.nav.menu.citizenship_turkey}</a>
              <a href={lp('turkey/buy-property/')} className="block text-white/80 text-sm py-1">{t.nav.menu.property_turkey}</a>
            </div>
            <div className="border-t border-white/10 pt-3 mt-3">
              <a href={lp('about/')} className="block text-white/80 text-sm py-1">{t.nav.about}</a>
              <a href={lp('blog/')} className="block text-white/80 text-sm py-1">{t.nav.blog}</a>
            </div>
          </div>
        </div>
      )}
    </motion.nav>
  );
};

export default Navbar;
