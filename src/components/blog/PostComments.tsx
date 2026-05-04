"use client";

import { useEffect, useState, useRef } from "react";
import { fetchPostComments, submitComment, type CmsComment } from "@/lib/cms/api";

interface PostCommentsProps {
  lang: string;
  slug: string;
}

const i18n: Record<string, {
  heading: string;
  name: string;
  email: string;
  comment: string;
  submit: string;
  sending: string;
  successMsg: string;
  errorMsg: string;
  noComments: string;
  beFirst: string;
  namePlaceholder: string;
  emailPlaceholder: string;
  commentPlaceholder: string;
  leaveComment: string;
}> = {
  fa: {
    heading: "دیدگاه‌ها",
    name: "نام",
    email: "ایمیل",
    comment: "دیدگاه",
    submit: "ارسال دیدگاه",
    sending: "در حال ارسال...",
    successMsg: "دیدگاه شما ثبت شد و پس از تایید نمایش داده می‌شود.",
    errorMsg: "خطایی رخ داد. لطفاً دوباره تلاش کنید.",
    noComments: "هنوز دیدگاهی ثبت نشده است.",
    beFirst: "اولین نفری باشید که دیدگاه می‌گذارید!",
    namePlaceholder: "نام شما",
    emailPlaceholder: "ایمیل شما (منتشر نخواهد شد)",
    commentPlaceholder: "دیدگاه خود را بنویسید...",
    leaveComment: "دیدگاه بگذارید",
  },
  ar: {
    heading: "التعليقات",
    name: "الاسم",
    email: "البريد الإلكتروني",
    comment: "التعليق",
    submit: "إرسال التعليق",
    sending: "جارٍ الإرسال...",
    successMsg: "تم إرسال تعليقك وسيظهر بعد المراجعة.",
    errorMsg: "حدث خطأ. يرجى المحاولة مرة أخرى.",
    noComments: "لا توجد تعليقات بعد.",
    beFirst: "كن أول من يعلق!",
    namePlaceholder: "اسمك",
    emailPlaceholder: "بريدك الإلكتروني (لن يُنشر)",
    commentPlaceholder: "اكتب تعليقك...",
    leaveComment: "اترك تعليقاً",
  },
  ru: {
    heading: "Комментарии",
    name: "Имя",
    email: "Email",
    comment: "Комментарий",
    submit: "Отправить",
    sending: "Отправка...",
    successMsg: "Комментарий отправлен и появится после проверки.",
    errorMsg: "Произошла ошибка. Попробуйте ещё раз.",
    noComments: "Комментариев пока нет.",
    beFirst: "Будьте первым!",
    namePlaceholder: "Ваше имя",
    emailPlaceholder: "Ваш email (не будет опубликован)",
    commentPlaceholder: "Напишите комментарий...",
    leaveComment: "Оставить комментарий",
  },
  en: {
    heading: "Comments",
    name: "Name",
    email: "Email",
    comment: "Comment",
    submit: "Post Comment",
    sending: "Sending...",
    successMsg: "Your comment has been submitted and will appear after review.",
    errorMsg: "Something went wrong. Please try again.",
    noComments: "No comments yet.",
    beFirst: "Be the first to comment!",
    namePlaceholder: "Your name",
    emailPlaceholder: "Your email (won't be published)",
    commentPlaceholder: "Write your comment...",
    leaveComment: "Leave a Comment",
  },
};

function CommentCard({ comment }: { comment: CmsComment }) {
  return (
    <div className="flex gap-4 py-5">
      {/* Avatar initial */}
      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-navy/10 flex items-center justify-center text-navy font-bold text-sm">
        {comment.author_name.charAt(0).toUpperCase()}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-semibold text-navy text-sm">{comment.author_name}</span>
          <time className="text-xs text-muted-foreground">
            {new Date(comment.created_at).toLocaleDateString(undefined, {
              year: "numeric", month: "short", day: "numeric",
            })}
          </time>
        </div>
        <p className="text-sm text-ink leading-relaxed">{comment.content}</p>
      </div>
    </div>
  );
}

export default function PostComments({ lang, slug }: PostCommentsProps) {
  const t = i18n[lang] ?? i18n.en;
  const dir = ["fa", "ar"].includes(lang) ? "rtl" : "ltr";

  const [comments, setComments] = useState<CmsComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    fetchPostComments(lang, slug)
      .then(setComments)
      .finally(() => setLoading(false));
  }, [lang, slug]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    const payload = {
      lang,
      slug,
      author_name: (fd.get("author_name") as string).trim(),
      author_email: (fd.get("author_email") as string).trim(),
      content: (fd.get("content") as string).trim(),
    };

    setSubmitting(true);
    const result = await submitComment(payload);
    setSubmitting(false);

    if (result.success) {
      setSubmitted(true);
      formRef.current?.reset();
    } else {
      setError(result.message ?? t.errorMsg);
    }
  }

  return (
    <section dir={dir}>
      {/* Section header */}
      <div className="flex items-center gap-3 mb-6">
        <h2 className="text-xl font-bold text-navy">{t.heading}</h2>
        {!loading && (
          <span className="text-xs font-semibold bg-navy/10 text-navy px-2.5 py-0.5 rounded-full">
            {comments.length}
          </span>
        )}
      </div>

      {/* Comment list */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="flex gap-4 py-5">
              <div className="w-10 h-10 rounded-full bg-surface animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-surface rounded animate-pulse w-24" />
                <div className="h-3 bg-surface rounded animate-pulse w-48" />
              </div>
            </div>
          ))}
        </div>
      ) : comments.length > 0 ? (
        <div className="divide-y divide-border border border-border rounded-2xl px-5 bg-white mb-10">
          {comments.map((c) => (
            <CommentCard key={c.id} comment={c} />
          ))}
        </div>
      ) : (
        <div className="text-center py-10 border border-border rounded-2xl bg-surface mb-10">
          <p className="text-navy font-medium">{t.noComments}</p>
          <p className="text-sm text-muted-foreground mt-1">{t.beFirst}</p>
        </div>
      )}

      {/* Comment form */}
      <div className="bg-white rounded-2xl border border-border p-6">
        <h3 className="font-bold text-navy text-base mb-5">{t.leaveComment}</h3>

        {submitted ? (
          <div className="flex items-start gap-3 bg-emerald-50 border border-emerald-200 rounded-xl p-4">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 mt-0.5" aria-hidden="true">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <p className="text-sm text-emerald-800">{t.successMsg}</p>
          </div>
        ) : (
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-ink mb-1.5" htmlFor="author_name">
                  {t.name} *
                </label>
                <input
                  id="author_name"
                  name="author_name"
                  type="text"
                  required
                  placeholder={t.namePlaceholder}
                  className="w-full h-10 rounded-xl border border-border bg-surface px-3 text-sm text-ink placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-navy/25"
                  style={{ direction: dir }}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-ink mb-1.5" htmlFor="author_email">
                  {t.email} *
                </label>
                <input
                  id="author_email"
                  name="author_email"
                  type="email"
                  required
                  placeholder={t.emailPlaceholder}
                  className="w-full h-10 rounded-xl border border-border bg-surface px-3 text-sm text-ink placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-navy/25"
                  dir="ltr"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink mb-1.5" htmlFor="content">
                {t.comment} *
              </label>
              <textarea
                id="content"
                name="content"
                required
                minLength={5}
                maxLength={2000}
                rows={4}
                placeholder={t.commentPlaceholder}
                className="w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-sm text-ink placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-navy/25 resize-none"
                style={{ direction: dir }}
              />
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                {error}
              </p>
            )}

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-2 bg-navy hover:bg-navy-lt disabled:opacity-60 text-white font-semibold text-sm px-6 py-2.5 rounded-xl transition-colors"
              >
                {submitting ? (
                  <>
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                    </svg>
                    {t.sending}
                  </>
                ) : (
                  t.submit
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
