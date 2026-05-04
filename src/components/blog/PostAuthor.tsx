import type { CmsAuthorDetail } from "@/lib/cms/api";
import type { Lang } from "@/translations";
import { LANG_CONFIG } from "@/lib/seo";

interface PostAuthorProps {
  author: CmsAuthorDetail;
  lang: Lang;
}

const authorLabel: Record<string, string> = {
  fa: "درباره نویسنده",
  ar: "عن الكاتب",
  ru: "Об авторе",
  en: "About the Author",
};

export default function PostAuthor({ author, lang }: PostAuthorProps) {
  const dir = LANG_CONFIG[lang].dir;

  return (
    <div
      className="bg-surface rounded-2xl border border-border p-6 flex gap-5 items-start"
      dir={dir}
    >
      {/* Avatar */}
      <div className="flex-shrink-0">
        {author.avatar ? (
          <img
            src={author.avatar.url}
            alt={author.name}
            width={72}
            height={72}
            className="w-16 h-16 rounded-full object-cover border-2 border-gold"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-navy flex items-center justify-center text-white text-2xl font-bold border-2 border-gold">
            {author.name.charAt(0).toUpperCase()}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="min-w-0 flex-1">
        <p className="text-xs font-bold text-navy/50 uppercase tracking-widest mb-1">
          {authorLabel[lang] ?? authorLabel.en}
        </p>
        <p className="font-bold text-navy text-base">{author.name}</p>
        {author.title && (
          <p className="text-sm text-gold-dk font-medium mt-0.5">{author.title}</p>
        )}
        {author.bio && (
          <p className="text-sm text-ink mt-2 leading-relaxed">{author.bio}</p>
        )}
      </div>
    </div>
  );
}
