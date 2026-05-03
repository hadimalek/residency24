import type { Lang } from "@/translations";
import { LANG_CONFIG } from "@/lib/seo";

interface BlogHeroProps {
  eyebrow: string;
  h1: string;
  sub: string;
  lang: Lang;
}

export default function BlogHero({ eyebrow, h1, sub, lang }: BlogHeroProps) {
  const dir = LANG_CONFIG[lang].dir;

  return (
    <section
      className="bg-navy pt-20 pb-24 px-4 text-center"
      dir={dir}
    >
      <p className="text-gold text-sm font-semibold uppercase tracking-widest mb-3">
        {eyebrow}
      </p>
      <h1 className="text-white text-3xl md:text-5xl font-bold leading-tight mb-4">
        {h1}
      </h1>
      <p className="text-white/60 text-base md:text-lg max-w-xl mx-auto">
        {sub}
      </p>
    </section>
  );
}
