"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import { Shield, Building2 } from "lucide-react";
import Link from "next/link";

const RelatedServices = () => {
  const { t, lang } = useLanguage();
  const bp = t.bp;

  const cards = [
    {
      icon: Shield,
      title: bp.related_visa_title,
      desc: bp.related_visa_desc,
      href: `/${lang}/uae/golden-visa/`,
      cta: bp.related_visa_title,
    },
    {
      icon: Building2,
      title: bp.related_company_title,
      desc: bp.related_company_desc,
      href: `/${lang}/uae/company-registration/`,
      cta: bp.related_company_title,
    },
  ];

  return (
    <section className="py-16 bg-navy">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-white text-center mb-10">
          {bp.related_title}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {cards.map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.3, delay: i * 0.1 }}
              className="border border-gold/30 rounded-2xl p-6 bg-white/5 hover:bg-white/10 transition-colors"
            >
              <card.icon className="w-8 h-8 text-gold mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">{card.title}</h3>
              <p className="text-sm text-white/70 mb-4 leading-relaxed">{card.desc}</p>
              <Link
                href={card.href}
                className="text-gold font-semibold text-sm hover:underline"
              >
                &rarr; {card.cta}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RelatedServices;
