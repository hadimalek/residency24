"use client";

import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';
import { MessageCircle, Send } from 'lucide-react';

const ContactBar = () => {
  const { t } = useLanguage();

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      className="py-10 bg-navy"
    >
      <div className="max-w-5xl mx-auto px-4 flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6">
        <div className="text-center md:text-start">
          <span className="text-white text-base font-medium">{t.contact_bar.label}</span>
          {t.contact_bar.response && (
            <p className="text-xs text-gold mt-0.5">{t.contact_bar.response}</p>
          )}
        </div>
        <a href="https://t.me/residency24" target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-2 bg-telegram text-white rounded-lg px-7 py-3 text-sm font-medium hover:opacity-90 transition-opacity w-full md:w-auto justify-center">
          <Send size={16} /> {t.contact_bar.tg}
        </a>
        <a href="https://wa.me/971562009131" target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-2 bg-whatsapp text-white rounded-lg px-7 py-3 text-sm font-medium hover:opacity-90 transition-opacity w-full md:w-auto justify-center">
          <MessageCircle size={16} /> {t.contact_bar.wa}
        </a>
      </div>
    </motion.section>
  );
};

export default ContactBar;
