import type { CmsCta } from "@/lib/cms/api";
import type { Lang } from "@/translations";
import { LANG_CONFIG } from "@/lib/seo";

interface PostCtaProps {
  cta: CmsCta;
  lang: Lang;
}

const WHATSAPP_NUMBER = "+971562009131";

const ctaDefaults: Record<string, { title: string; body: string; button: string }> = {
  fa: {
    title: "مشاوره رایگان با متخصصان ما",
    body: "ظرف ۲ ساعت از طریق واتساپ پاسخ می‌دهیم.",
    button: "درخواست مشاوره رایگان",
  },
  ar: {
    title: "استشارة مجانية مع خبرائنا",
    body: "نرد عليك خلال ساعتين عبر واتساب.",
    button: "طلب استشارة مجانية",
  },
  ru: {
    title: "Бесплатная консультация наших экспертов",
    body: "Ответим в течение 2 часов через WhatsApp.",
    button: "Получить консультацию",
  },
  en: {
    title: "Free Consultation with Our Experts",
    body: "We reply within 2 hours via WhatsApp.",
    button: "Get Free Consultation",
  },
};

export default function PostCta({ cta, lang }: PostCtaProps) {
  const dir = LANG_CONFIG[lang].dir;
  const defaults = ctaDefaults[lang] ?? ctaDefaults.en;

  const title = cta.title ?? defaults.title;
  const body = cta.body ?? defaults.body;
  const buttonLabel = cta.button_label ?? defaults.button;

  const isWhatsApp = cta.type === "whatsapp";
  const href = cta.target_url ?? (isWhatsApp ? `https://wa.me/${WHATSAPP_NUMBER.replace(/\D/g, "")}` : "#contact");

  return (
    <div
      className="rounded-2xl bg-navy px-8 py-8 flex flex-col md:flex-row items-center justify-between gap-6"
      dir={dir}
    >
      <div className="text-center md:text-start">
        <h3 className="text-white font-bold text-xl mb-1">{title}</h3>
        {body && <p className="text-white/70 text-sm">{body}</p>}
      </div>
      <a
        href={href}
        target={isWhatsApp ? "_blank" : undefined}
        rel={isWhatsApp ? "noopener noreferrer" : undefined}
        className="flex-shrink-0 inline-flex items-center gap-2 bg-gold hover:bg-gold-dk text-navy font-semibold text-sm px-6 py-3 rounded-xl transition-colors"
      >
        {isWhatsApp && (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
            <path d="M12 0C5.373 0 0 5.373 0 12c0 2.134.558 4.132 1.535 5.868L.057 23.884a.5.5 0 0 0 .611.611l6.016-1.478A11.943 11.943 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.89 0-3.664-.524-5.18-1.438L3.57 21.57l1.006-3.25A10 10 0 1 1 12 22z" />
          </svg>
        )}
        {buttonLabel}
      </a>
    </div>
  );
}
