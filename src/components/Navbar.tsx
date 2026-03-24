"use client";

import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { MessageCircle, Send, Menu, X, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
const logo = '/residency24-logo-280.png';

const Navbar = () => {
  const { t, isRTL } = useLanguage();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [countriesOpen, setCountriesOpen] = useState(false);

  return (
    <motion.nav
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="sticky top-0 z-50 h-16 bg-navy flex items-center justify-between px-4 md:px-8"
      style={{ direction: 'ltr' }}
    >
      <a href="/" className="flex-shrink-0">
        <img src={logo} alt="Residency24" className="h-9 brightness-0 invert" />
      </a>

      {/* Desktop nav */}
      <div className="hidden md:flex items-center gap-6 text-sm font-medium text-white/80" style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
        {/* Services mega dropdown */}
        <div className="relative" onMouseEnter={() => setServicesOpen(true)} onMouseLeave={() => setServicesOpen(false)}>
          <button className="flex items-center gap-1 hover:text-gold transition-colors">
            {t.nav.services} <ChevronDown size={14} />
          </button>
          {servicesOpen && (
            <div className="absolute top-full mt-1 bg-white rounded-xl shadow-2xl border border-border p-5 min-w-[560px] z-50" style={{ [isRTL ? 'right' : 'left']: '-100px' }}>
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <p className="text-xs font-semibold text-navy mb-2">🇦🇪 {t.nav.menu.uae}</p>
                  <a href={`/${isRTL ? 'fa' : 'en'}/uae/golden-visa/`} className="block text-sm text-ink py-1 hover:text-navy">{t.nav.menu.golden_visa}</a>
                  <a href={`/${isRTL ? 'fa' : 'en'}/uae/company-registration/`} className="block text-sm text-ink py-1 hover:text-navy">{t.nav.menu.company_uae}</a>
                  <a href={`/${isRTL ? 'fa' : 'en'}/uae/buy-property/`} className="block text-sm text-ink py-1 hover:text-navy">{t.nav.menu.property_uae}</a>
                  <a href={`/${isRTL ? 'fa' : 'en'}/uae/tourist-visa/`} className="block text-sm text-ink py-1 hover:text-navy">{t.nav.menu.tourist_uae}</a>
                </div>
                <div>
                  <p className="text-xs font-semibold text-navy mb-2">🇴🇲 {t.nav.menu.oman}</p>
                  <a href={`/${isRTL ? 'fa' : 'en'}/oman/company-registration/`} className="block text-sm text-ink py-1 hover:text-navy">{t.nav.menu.company_oman}</a>
                  <a href={`/${isRTL ? 'fa' : 'en'}/oman/buy-property/`} className="block text-sm text-ink py-1 hover:text-navy">{t.nav.menu.property_oman}</a>
                  <a href={`/${isRTL ? 'fa' : 'en'}/oman/residency-visa/`} className="block text-sm text-ink py-1 hover:text-navy">{t.nav.menu.residency_oman}</a>
                </div>
                <div>
                  <p className="text-xs font-semibold text-navy mb-2">🇹🇷 {t.nav.menu.turkey}</p>
                  <a href={`/${isRTL ? 'fa' : 'en'}/turkey/citizenship/`} className="block text-sm text-ink py-1 hover:text-navy">
                    {t.nav.menu.citizenship_turkey} <span className="text-[10px] bg-gold text-navy px-1.5 py-0.5 rounded ms-1">NEW</span>
                  </a>
                  <a href={`/${isRTL ? 'fa' : 'en'}/turkey/buy-property/`} className="block text-sm text-ink py-1 hover:text-navy">{t.nav.menu.property_turkey}</a>
                  <a href={`/${isRTL ? 'fa' : 'en'}/turkey/company-registration/`} className="block text-sm text-ink py-1 hover:text-navy">{t.nav.menu.company_turkey}</a>
                </div>
              </div>
              <div className="border-t border-border mt-4 pt-3 flex gap-6">
                <a href={`/${isRTL ? 'fa' : 'en'}/compare/uae-vs-oman-vs-turkey/`} className="text-sm text-navy font-medium hover:underline">⚖️ {t.nav.menu.compare}</a>
                <a href="#hero" className="text-sm text-navy font-medium hover:underline">🤖 {t.nav.menu.ai_advisor}</a>
              </div>
            </div>
          )}
        </div>

        <div className="relative" onMouseEnter={() => setCountriesOpen(true)} onMouseLeave={() => setCountriesOpen(false)}>
          <button className="flex items-center gap-1 hover:text-gold transition-colors">
            {t.nav.countries} <ChevronDown size={14} />
          </button>
          {countriesOpen && (
            <div className="absolute top-full mt-1 bg-white rounded-lg shadow-xl border border-border py-2 min-w-[160px] z-50" style={{ [isRTL ? 'right' : 'left']: 0 }}>
              <a href={`/${isRTL ? 'fa' : 'en'}/uae/`} className="block px-4 py-2 text-sm text-ink hover:bg-surface">🇦🇪 {t.nav.menu.uae}</a>
              <a href={`/${isRTL ? 'fa' : 'en'}/oman/`} className="block px-4 py-2 text-sm text-ink hover:bg-surface">🇴🇲 {t.nav.menu.oman}</a>
              <a href={`/${isRTL ? 'fa' : 'en'}/turkey/`} className="block px-4 py-2 text-sm text-ink hover:bg-surface">🇹🇷 {t.nav.menu.turkey}</a>
            </div>
          )}
        </div>

        <a href={`/${isRTL ? 'fa' : 'en'}/about/`} className="hover:text-gold transition-colors">{t.nav.about}</a>
        <a href={`/${isRTL ? 'fa' : 'en'}/blog/`} className="hover:text-gold transition-colors">{t.nav.blog}</a>
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
            <a href={`/${isRTL ? 'fa' : 'en'}/uae/golden-visa/`} className="block text-white/80 text-sm py-1">{t.nav.menu.golden_visa}</a>
            <a href={`/${isRTL ? 'fa' : 'en'}/uae/company-registration/`} className="block text-white/80 text-sm py-1">{t.nav.menu.company_uae}</a>
            <a href={`/${isRTL ? 'fa' : 'en'}/uae/buy-property/`} className="block text-white/80 text-sm py-1">{t.nav.menu.property_uae}</a>
            <div className="border-t border-white/10 pt-3 mt-3">
              <p className="text-white/50 text-xs uppercase tracking-wider">🇴🇲 {t.nav.menu.oman}</p>
              <a href={`/${isRTL ? 'fa' : 'en'}/oman/company-registration/`} className="block text-white/80 text-sm py-1">{t.nav.menu.company_oman}</a>
              <a href={`/${isRTL ? 'fa' : 'en'}/oman/buy-property/`} className="block text-white/80 text-sm py-1">{t.nav.menu.property_oman}</a>
            </div>
            <div className="border-t border-white/10 pt-3 mt-3">
              <p className="text-white/50 text-xs uppercase tracking-wider">🇹🇷 {t.nav.menu.turkey}</p>
              <a href={`/${isRTL ? 'fa' : 'en'}/turkey/citizenship/`} className="block text-white/80 text-sm py-1">{t.nav.menu.citizenship_turkey}</a>
              <a href={`/${isRTL ? 'fa' : 'en'}/turkey/buy-property/`} className="block text-white/80 text-sm py-1">{t.nav.menu.property_turkey}</a>
            </div>
            <div className="border-t border-white/10 pt-3 mt-3">
              <a href={`/${isRTL ? 'fa' : 'en'}/about/`} className="block text-white/80 text-sm py-1">{t.nav.about}</a>
              <a href={`/${isRTL ? 'fa' : 'en'}/blog/`} className="block text-white/80 text-sm py-1">{t.nav.blog}</a>
            </div>
          </div>
        </div>
      )}
    </motion.nav>
  );
};

export default Navbar;
