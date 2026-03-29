"use client";

import { useState, useRef, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Send, ArrowLeft, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import ReactMarkdown from 'react-markdown';
const faviconImg = '/favicon.svg';
const brandLogo = '/residency24-logo-white.svg';

/* ── Types ── */
interface ChatMessage {
  id: number;
  role: 'user' | 'assistant';
  text: string;
  time: string;
  read: boolean;
}

/* ── Session key helper ── */
const SESSION_KEY = 'r24_chat_session';

function getSessionId(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(SESSION_KEY);
}

function setSessionId(id: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(SESSION_KEY, id);
  }
}

function clearSessionId() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(SESSION_KEY);
  }
}

/* ── Avatar — always uses favicon ── */
const R24Avatar = ({ size = 32 }: { size?: number }) => (
  <div className="relative flex-shrink-0 rounded-full bg-[#F0F0F0] flex items-center justify-center" style={{ width: size, height: size }}>
    <img
      src={faviconImg}
      alt="Residency24"
      className="object-contain"
      style={{ width: size * 0.65, height: size * 0.65 }}
    />
  </div>
);

/* ── Typing dots ── */
const TypingDots = () => (
  <div className="flex items-end gap-2 mb-1" style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
    <R24Avatar size={28} />
    <div className="bg-white rounded-[18px] rounded-bl-[4px] px-4 py-3 flex gap-1.5 shadow-sm border border-[#E8E8E8]">
      {[0, 1, 2].map(i => (
        <span
          key={i}
          className="w-[6px] h-[6px] rounded-full"
          style={{
            background: '#DCC896',
            animation: `dotPulse 1.2s infinite ease-in-out ${i * 0.15}s`,
          }}
        />
      ))}
    </div>
  </div>
);

/* ── Markdown renderer ── */
const MarkdownMessage = ({ content, isUser, isRTL }: { content: string; isUser: boolean; isRTL: boolean }) => (
  <ReactMarkdown
    components={{
      strong: ({ children }) => (
        <strong style={{ fontWeight: 700, color: isUser ? '#FFFFFF' : '#001E6E' }}>{children}</strong>
      ),
      ol: ({ children }) => (
        <ol style={{
          margin: '8px 0',
          paddingRight: isRTL ? '20px' : '0',
          paddingLeft: isRTL ? '0' : '20px',
          listStyle: 'decimal',
        }}>{children}</ol>
      ),
      ul: ({ children }) => (
        <ul style={{
          margin: '8px 0',
          paddingRight: isRTL ? '20px' : '0',
          paddingLeft: isRTL ? '0' : '20px',
          listStyle: 'disc',
        }}>{children}</ul>
      ),
      li: ({ children }) => <li style={{ marginBottom: '4px' }}>{children}</li>,
      p: ({ children }) => <p style={{ marginBottom: '4px' }}>{children}</p>,
    }}
  >
    {content}
  </ReactMarkdown>
);

const getNow = () => {
  const d = new Date();
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

/* ── Lead Form Translations ── */
const LEAD_FORM_T: Record<string, { title: string; subtitle: string; name_label: string; name_ph: string; phone_label: string; phone_ph: string; email_label: string; service_label: string; submit: string; success_title: string; success_msg: string; privacy: string; later: string; error_req: string }> = {
  fa: { title: "مشاوره رایگان — رزیدنسی۲۴", subtitle: "کارشناسان ما در کمتر از ۲۴ ساعت با شما تماس می‌گیرند", name_label: "نام و نام خانوادگی", name_ph: "مثال: علی رضایی", phone_label: "شماره واتساپ یا تلفن", phone_ph: "+98 یا +971", email_label: "ایمیل (اختیاری)", service_label: "خدمت مورد نظر", submit: "ارسال و دریافت مشاوره رایگان", success_title: "درخواست شما ثبت شد ✓", success_msg: "کارشناسان رزیدنسی۲۴ به زودی با شما تماس خواهند گرفت.", privacy: "اطلاعات شما محرمانه است", later: "بعداً", error_req: "لطفاً نام و شماره تلفن را وارد کنید" },
  en: { title: "Free Consultation — Residency24", subtitle: "Our experts will contact you within 24 hours", name_label: "Full Name", name_ph: "e.g. John Smith", phone_label: "WhatsApp or Phone", phone_ph: "+971 or your country code", email_label: "Email (optional)", service_label: "Service of Interest", submit: "Get My Free Consultation", success_title: "Request Received ✓", success_msg: "A Residency24 specialist will contact you shortly.", privacy: "Your information is confidential", later: "Later", error_req: "Please enter your name and phone number" },
  ar: { title: "استشارة مجانية — ريزيدنسي٢٤", subtitle: "سيتواصل معك خبراؤنا خلال ٢٤ ساعة", name_label: "الاسم الكامل", name_ph: "مثال: محمد العلي", phone_label: "رقم واتساب أو الهاتف", phone_ph: "+971 أو رمز بلدك", email_label: "البريد الإلكتروني (اختياري)", service_label: "الخدمة المطلوبة", submit: "احصل على استشارتي المجانية", success_title: "تم استلام طلبك ✓", success_msg: "سيتواصل معك أحد متخصصي ريزيدنسي٢٤ قريباً.", privacy: "معلوماتك سرية", later: "لاحقاً", error_req: "يرجى إدخال الاسم ورقم الهاتف" },
  ru: { title: "Бесплатная консультация — Residency24", subtitle: "Наши эксперты свяжутся с вами в течение 24 часов", name_label: "Полное имя", name_ph: "Например: Иван Петров", phone_label: "WhatsApp или телефон", phone_ph: "+7 или ваш код страны", email_label: "Email (необязательно)", service_label: "Интересующая услуга", submit: "Получить бесплатную консультацию", success_title: "Заявка принята ✓", success_msg: "Специалист Residency24 свяжется с вами в ближайшее время.", privacy: "Ваши данные конфиденциальны", later: "Позже", error_req: "Пожалуйста, введите имя и номер телефона" },
};

const SERVICE_OPTIONS: Record<string, string[]> = {
  fa: ["ثبت شرکت در امارات", "گلدن ویزا امارات", "خرید ملک در دبی", "اقامت عمان", "شهروندی ترکیه", "ویزای فریلنسر", "سایر"],
  en: ["UAE Company Formation", "UAE Golden Visa", "Dubai Property Investment", "Oman Residency", "Turkey Citizenship", "Freelance Visa", "Other"],
  ar: ["تأسيس شركة في الإمارات", "الإقامة الذهبية", "الاستثمار العقاري في دبي", "إقامة عُمان", "الجنسية التركية", "تأشيرة المستقل", "أخرى"],
  ru: ["Регистрация компании в ОАЭ", "Золотая виза ОАЭ", "Недвижимость в Дубае", "Резидентство Омана", "Гражданство Турции", "Виза фрилансера", "Другое"],
};

/* ── Lead Capture — Full-page overlay replacing chat ── */
const LeadCaptureFullPage = ({
  t,
  sessionId,
  isRTL,
  lang,
  onDone,
  onBack,
}: {
  t: any;
  sessionId: string | null;
  isRTL: boolean;
  lang: string;
  onDone: () => void;
  onBack: () => void;
}) => {
  const lt = LEAD_FORM_T[lang] || LEAD_FORM_T.en;
  const services = SERVICE_OPTIONS[lang] || SERVICE_OPTIONS.en;

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [service, setService] = useState(services[0]);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim() || !phone.trim()) {
      setError(lt.error_req);
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      const res = await fetch('/api/chat/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, name, phone, email, nationality: service }),
      });
      if (!res.ok) throw new Error('Failed');
      setSubmitted(true);
      setTimeout(() => onDone(), 600);
    } catch {
      setError('Error');
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    'w-full px-4 py-3 text-[15px] rounded-xl border-[1.5px] outline-none mb-3 bg-[#FAFAFA] transition-colors focus:border-[#001E6E] focus:bg-white focus:shadow-[0_0_0_3px_rgba(0,30,110,0.07)]';

  const BackArrow = isRTL ? ArrowRight : ArrowLeft;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="absolute inset-0 z-[1001] flex flex-col bg-white overflow-hidden"
    >
      {/* Header — same style as chat header */}
      <div
        className="flex items-center gap-3 px-4 flex-shrink-0"
        style={{ background: 'linear-gradient(135deg, #001E6E 0%, #002B9A 100%)', direction: 'ltr', height: '60px' }}
      >
        <button
          onClick={onBack}
          className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-colors"
          style={{ background: 'rgba(255,255,255,0.12)' }}
        >
          <BackArrow size={16} color="white" />
        </button>
        <img src={brandLogo} alt="Residency24" className="h-8 w-auto max-w-[140px] flex-shrink-0 object-contain" />
        <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: '#1D9E75' }} />
      </div>

      {/* Form body */}
      <div className="flex-1 overflow-y-auto px-5 py-6" style={{ background: '#F0EDE8' }}>
        {submitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center h-full text-center"
          >
            <div className="text-5xl mb-4">✅</div>
            <p className="text-lg font-semibold" style={{ color: '#001E6E' }}>{lt.success_title}</p>
            <p className="text-sm mt-2" style={{ color: '#6E7B8B' }}>{lt.success_msg}</p>
          </motion.div>
        ) : (
          <div className="max-w-sm mx-auto">
            <div className="flex items-center gap-3 mb-5">
              <R24Avatar size={40} />
              <div>
                <p className="text-[15px] font-semibold" style={{ color: '#001E6E' }}>{lt.title}</p>
                <p className="text-[13px]" style={{ color: '#6E7B8B' }}>{lt.subtitle}</p>
              </div>
            </div>
            <input value={name} onChange={e => setName(e.target.value)} placeholder={lt.name_ph} className={inputClass} style={{ borderColor: '#E2DDD8', fontFamily: 'inherit', direction: isRTL ? 'rtl' : 'ltr', fontSize: '16px' }} />
            <input value={phone} onChange={e => setPhone(e.target.value)} placeholder={lt.phone_ph} type="tel" className={inputClass} style={{ borderColor: '#E2DDD8', fontFamily: 'inherit', direction: 'ltr', fontSize: '16px' }} />
            <input value={email} onChange={e => setEmail(e.target.value)} placeholder="email@example.com" type="email" className={inputClass} style={{ borderColor: '#E2DDD8', fontFamily: 'inherit', direction: 'ltr', fontSize: '16px' }} />
            <select value={service} onChange={e => setService(e.target.value)} className={inputClass} style={{ borderColor: '#E2DDD8', fontFamily: 'inherit', color: service ? '#1A1A2E' : '#6E7B8B', direction: isRTL ? 'rtl' : 'ltr' }}>
              {services.map((s: string) => <option key={s} value={s}>{s}</option>)}
            </select>
            {error && <p className="text-[12px] text-red-500 mb-3">{error}</p>}
            <button onClick={handleSubmit} disabled={submitting} className="w-full py-3 rounded-xl text-[15px] font-semibold text-white transition-colors disabled:opacity-60" style={{ background: '#001E6E' }}>
              {submitting ? '...' : lt.submit}
            </button>
            <button onClick={onBack} className="w-full py-2 text-[13px] mt-2 transition-colors" style={{ color: '#6E7B8B' }}>
              {lt.later}
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

/* ── TRIGGER (legacy) ── */
export const ChatTrigger = ({ onClick }: { onClick: () => void }) => {
  return null;
};

/* ════════════════════════════════════════════
   MODAL
   ════════════════════════════════════════════ */

const ChatModal = ({ isOpen, onClose, initialMessage = '' }: { isOpen: boolean; onClose: () => void; initialMessage?: string }) => {
  const { t, lang, isRTL } = useLanguage();
  const ct = t.chat_modal;

  // Lock body scroll when open (simple approach — no position:fixed to avoid mobile input bugs)
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const welcomeMsg: ChatMessage = {
    id: 0,
    role: 'assistant',
    text: ct.welcome,
    time: getNow(),
    read: true,
  };

  const [messages, setMessages] = useState<ChatMessage[]>([welcomeMsg]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [aiCount, setAiCount] = useState(0);
  const [showLead, setShowLead] = useState(false);
  const [leadDone, setLeadDone] = useState(false);
  const [sessionId, setSessionIdState] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const nextId = useRef(1);
  const initialSent = useRef(false);

  // Reset when opened
  useEffect(() => {
    if (isOpen) {
      setMessages([{ ...welcomeMsg, time: getNow() }]);
      setInput('');
      setIsLoading(false);
      setAiCount(0);
      setShowLead(false);
      setLeadDone(false);
      nextId.current = 1;
      initialSent.current = false;
      clearSessionId();
      setSessionIdState(null);
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  // Auto-send initial message
  useEffect(() => {
    if (isOpen && initialMessage && !initialSent.current) {
      initialSent.current = true;
      setTimeout(() => send(initialMessage), 400);
    }
  }, [isOpen, initialMessage]);

  // Fallback: show lead after 4 AI responses if AI hasn't triggered it
  useEffect(() => {
    if (aiCount >= 4 && !leadDone && !showLead) {
      const timer = setTimeout(() => setShowLead(true), 700);
      return () => clearTimeout(timer);
    }
  }, [aiCount, leadDone, showLead]);

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading, showLead]);

  const send = useCallback(async (text?: string) => {
    const msg = (text || input).trim();
    if (!msg || isLoading) return;

    const userMsg: ChatMessage = { id: nextId.current++, role: 'user', text: msg, time: getNow(), read: false };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: msg,
          sessionId: sessionId || getSessionId(),
          language: lang,
          pageSlug: typeof window !== 'undefined' ? window.location.pathname.replace(/^\/(fa|en|ar|ru)\//, '').replace(/\/$/, '') || undefined : undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'API error');

      // Save session ID for future messages
      if (data.sessionId) {
        setSessionId(data.sessionId);
        setSessionIdState(data.sessionId);
      }

      // Parse response for lead form trigger
      let responseText = data.response;
      let shouldShowLeadForm = false;
      const triggerRegex = /\{"action"\s*:\s*"open_lead_form"[^}]*\}/;
      const triggerMatch = responseText.match(triggerRegex);
      if (triggerMatch && !leadDone) {
        responseText = responseText.replace(triggerRegex, '').trim();
        shouldShowLeadForm = true;
      }

      setMessages(prev => {
        const updated = prev.map(m => m.role === 'user' ? { ...m, read: true } : m);
        return [
          ...updated,
          { id: nextId.current++, role: 'assistant', text: responseText, time: getNow(), read: true },
        ];
      });
      setAiCount(c => c + 1);

      if (shouldShowLeadForm) {
        setTimeout(() => setShowLead(true), 700);
      }
    } catch (err: any) {
      const errorText = err?.message || 'خطا در اتصال به سرور';
      setMessages(prev => {
        const updated = prev.map(m => m.role === 'user' ? { ...m, read: true } : m);
        return [
          ...updated,
          { id: nextId.current++, role: 'assistant', text: `⚠️ ${errorText}`, time: getNow(), read: true },
        ];
      });
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, sessionId, lang]);

  const handleLeadDone = () => {
    setLeadDone(true);
    setShowLead(false);
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        { id: nextId.current++, role: 'assistant', text: ct.lead.thank_msg, time: getNow(), read: true },
      ]);
    }, 500);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[1000] flex items-center justify-center"
          style={{ background: 'rgba(0,20,60,0.55)', backdropFilter: 'blur(6px)' }}
          onClick={e => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.95 }}
            transition={{ duration: 0.28, type: 'spring', damping: 20, stiffness: 300 }}
            className="relative flex flex-col overflow-hidden w-[420px] max-w-[calc(100vw-32px)] h-[620px] max-h-[calc(100vh-48px)] rounded-[20px] bg-white shadow-[0_32px_80px_rgba(0,0,0,0.25),0_8px_24px_rgba(0,30,110,0.2)] max-[480px]:fixed max-[480px]:inset-0 max-[480px]:w-full max-[480px]:h-[100dvh] max-[480px]:max-w-full max-[480px]:max-h-[100dvh] max-[480px]:rounded-none max-[480px]:shadow-none"
          >
            {/* ── HEADER — Logo + online dot + close only ── */}
            <div
              className="flex items-center gap-3 px-4 flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #001E6E 0%, #002B9A 100%)', direction: 'ltr', height: '60px' }}
            >
              {/* Logo — always left */}
              <div className="flex items-center gap-2">
                <img
                  src={brandLogo}
                  alt="Residency24"
                  className="h-8 w-auto max-w-[140px] flex-shrink-0 object-contain"
                />
                {/* Online dot */}
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: '#1D9E75' }} />
              </div>

              {/* Spacer */}
              <div className="flex-1" />

              {/* Close button — always right */}
              <button
                onClick={onClose}
                className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-colors"
                style={{ background: 'rgba(255,255,255,0.12)' }}
              >
                <X size={16} color="white" />
              </button>
            </div>

            {/* ── CHAT AREA ── */}
            <div
              className="flex-1 overflow-y-scroll px-4 py-4"
              style={{
                background: '#F0EDE8',
                backgroundImage: 'radial-gradient(circle, rgba(0,30,110,0.04) 1px, transparent 1px)',
                backgroundSize: '20px 20px',
                WebkitOverflowScrolling: 'touch',
                overscrollBehavior: 'contain',
              }}
            >
              {/* Date badge */}
              <div className="flex justify-center mb-3">
                <span className="text-[10px] px-3 py-1 rounded-full" style={{ background: 'rgba(0,30,110,0.06)', color: '#6E7B8B' }}>
                  {ct.today}
                </span>
              </div>

              <div className="space-y-2">
                {messages.map(msg => {
                  const isUser = msg.role === 'user';
                  const isBot = msg.role === 'assistant';

                  return (
                    <div
                      key={msg.id}
                      style={{ animation: 'msgIn .2s ease-out' }}
                      className={`flex items-end gap-2 mb-1 ${isUser ? 'flex-row-reverse justify-start' : 'flex-row justify-start'}`}
                    >
                      {isBot && <R24Avatar size={28} />}

                      <div
                        className="max-w-[78%] px-4 py-3 text-[15px] leading-[1.7] shadow-sm"
                        style={{
                          background: isBot ? '#FFFFFF' : '#001E6E',
                          border: isBot ? '1px solid #E8E8E8' : 'none',
                          borderRadius: isBot ? '18px 18px 18px 4px' : '18px 18px 4px 18px',
                          color: isBot ? '#323232' : '#FFFFFF',
                          direction: isRTL ? 'rtl' : 'ltr',
                          textAlign: isRTL ? 'right' : 'left',
                        }}
                      >
                        <MarkdownMessage content={msg.text} isUser={isUser} isRTL={isRTL} />
                        <div className="flex items-center gap-1 mt-1" style={{ justifyContent: isUser ? 'flex-end' : 'flex-start' }}>
                          <span className="text-[9px]" style={{ color: isUser ? 'rgba(255,255,255,0.5)' : '#6E7B8B' }}>{msg.time}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {isLoading && <TypingDots />}

                <div ref={bottomRef} />
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* ── PILLS ── */}
            {messages.length <= 2 && (
              <div
                className="flex gap-1.5 px-2 py-1.5 overflow-x-auto flex-shrink-0"
                style={{ background: '#F5F4F2', borderTop: '1px solid #E2DDD8' }}
              >
                {(ct.pills as string[]).map((pill: string, i: number) => (
                  <button
                    key={i}
                    onClick={() => send(pill)}
                    className="px-3 py-1.5 text-[11px] rounded-2xl bg-white whitespace-nowrap flex-shrink-0 transition-all hover:bg-navy hover:text-white hover:border-navy"
                    style={{ border: '1.5px solid rgba(0,30,110,0.2)', color: '#001E6E' }}
                  >
                    {pill}
                  </button>
                ))}
              </div>
            )}

            {/* ── INPUT BAR — Unified ChatInput ── */}
            <div
              className="flex items-end gap-2.5 flex-shrink-0"
              style={{
                flexDirection: 'row',
                padding: '14px 16px',
                paddingBottom: 'max(14px, env(safe-area-inset-bottom))',
                background: '#FFFFFF',
                borderTop: '1px solid #ebebeb',
              }}
            >
              {isRTL && (
                <button
                  onClick={() => send()}
                  disabled={!input.trim() || isLoading}
                  className="w-12 h-12 rounded-[14px] flex items-center justify-center flex-shrink-0 transition-all"
                  style={{
                    background: input.trim() ? '#001E6E' : 'rgba(0,30,110,0.2)',
                    cursor: input.trim() ? 'pointer' : 'default',
                  }}
                  aria-label="ارسال"
                >
                  <Send size={17} strokeWidth={2} color="white" style={{ transform: 'scaleX(-1)' }} />
                </button>
              )}

              <textarea
                ref={inputRef as any}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), send())}
                placeholder={ct.input_placeholder}
                rows={1}
                dir={isRTL ? 'rtl' : 'ltr'}
                className="flex-1 rounded-3xl outline-none transition-all"
                style={{
                  color: '#323232',
                  fontFamily: 'inherit',
                  textAlign: isRTL ? 'right' : 'left',
                  fontSize: '16px',
                  padding: '12px 16px',
                  minHeight: '48px',
                  maxHeight: '140px',
                  resize: 'none',
                  lineHeight: '1.5',
                  WebkitAppearance: 'none',
                  overflowY: 'auto',
                  background: '#f4f4f4',
                  border: '1.5px solid transparent',
                }}
                onFocus={e => { e.target.style.background = '#ffffff'; e.target.style.borderColor = '#001E6E'; }}
                onBlur={e => { e.target.style.background = '#f4f4f4'; e.target.style.borderColor = 'transparent'; }}
              />

              {!isRTL && (
                <button
                  onClick={() => send()}
                  disabled={!input.trim() || isLoading}
                  className="w-12 h-12 rounded-[14px] flex items-center justify-center flex-shrink-0 transition-all"
                  style={{
                    background: input.trim() ? '#001E6E' : 'rgba(0,30,110,0.2)',
                    cursor: input.trim() ? 'pointer' : 'default',
                  }}
                  aria-label="Send"
                >
                  <Send size={17} strokeWidth={2} color="white" />
                </button>
              )}
            </div>

            {/* Lead form overlay — replaces chat in place */}
            <AnimatePresence>
              {showLead && !leadDone && (
                <LeadCaptureFullPage
                  t={t}
                  sessionId={sessionId}
                  isRTL={isRTL}
                  lang={lang}
                  onDone={handleLeadDone}
                  onBack={() => { setShowLead(false); setLeadDone(true); }}
                />
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ChatModal;
