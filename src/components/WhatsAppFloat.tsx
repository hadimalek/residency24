"use client";

import { useLanguage } from '@/contexts/LanguageContext';
import { MessageCircle } from 'lucide-react';

const WhatsAppFloat = () => {
  const { isRTL } = useLanguage();

  return (
    <a
      href="https://wa.me/971562009131"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="WhatsApp"
      className="fixed bottom-7 z-50 flex items-center gap-2 bg-[#25D366] text-white px-5 py-3 rounded-full shadow-[0_4px_20px_rgba(37,211,102,0.35)] font-semibold text-[15px] hover:-translate-y-0.5 hover:shadow-[0_8px_28px_rgba(37,211,102,0.45)] transition-all duration-200"
      style={{ [isRTL ? 'left' : 'right']: '28px' }}
    >
      <MessageCircle size={20} />
      <span className="hidden sm:inline">WhatsApp</span>
    </a>
  );
};

export default WhatsAppFloat;
