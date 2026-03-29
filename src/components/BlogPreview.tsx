"use client";

import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';

const BlogPreview = () => {
  const { t } = useLanguage();

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      className="py-20 bg-white"
    >
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <span className="inline-block text-xs font-semibold text-gold tracking-[0.12em] uppercase mb-3">{t.blog.badge}</span>
          <h2 className="text-[32px] font-bold text-navy mb-2">{t.blog.h2}</h2>
          <p className="text-[15px] text-muted-foreground">{t.blog.sub}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {t.blog.posts.map((post: any, i: number) => (
            <a
              key={i}
              href={post.href}
              className="border border-border rounded-xl overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-200 block"
            >
              <div className="aspect-video overflow-hidden">
                <img src={post.img} alt={post.title} className="w-full h-full object-cover" loading="lazy" />
              </div>
              <div className="p-5">
                <span className="inline-block text-[11px] bg-gold text-navy font-semibold px-2 py-0.5 rounded mb-2">{post.tag}</span>
                <h3 className="text-base font-semibold text-navy mb-2 line-clamp-2">{post.title}</h3>
                <p className="text-[13px] text-muted-foreground line-clamp-2 mb-3">{post.excerpt}</p>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">{post.date}</span>
                  <span className="text-[13px] text-navy font-medium">{t.blog.read_more} ←</span>
                </div>
              </div>
            </a>
          ))}
        </div>

        <div className="text-center mt-8">
          <a href={t.blog.href} className="inline-block bg-navy text-white rounded-lg px-8 py-3 text-sm font-semibold hover:bg-navy-lt transition-colors">
            {t.blog.cta}
          </a>
        </div>
      </div>
    </motion.section>
  );
};

export default BlogPreview;
