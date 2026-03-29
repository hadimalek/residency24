"use client";

import { useState, useRef, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Send, Phone, MoreVertical } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
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

/* ── Avatar ── */
const R24Avatar = ({ size = 40 }: { size?: number }) => (
  <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
    <img
      src={faviconImg}
      alt="Residency24"
      className="rounded-full object-cover"
      style={{ width: size, height: size }}
    />
    <span
      className="absolute rounded-full"
      style={{
        width: size * 0.25,
        height: size * 0.25,
        background: '#4ADE80',
        border: '2px solid #001E6E',
        bottom: 0,
        right: 0,
      }}
    />
  </div>
);

/* ── Typing dots ── */
const TypingDots = () => (
  <div className="flex items-end gap-1.5 mb-1.5" style={{ direction: 'ltr', justifyContent: 'flex-start', animation: 'msgIn .2s ease-out' }}>
    <R24Avatar size={24} />
    <div className="bg-white rounded-[14px] rounded-bl-[3px] px-3 py-2.5 flex gap-1.5 shadow-sm">
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

/* ── Double Tick ── */
const DoubleTick = ({ read }: { read: boolean }) => (
  <svg width="16" height="11" viewBox="0 0 16 11" fill="none">
    <path d="M1 5.5L4.5 9L11 2" stroke={read ? '#4ADE80' : 'rgba(255,255,255,0.4)'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M5 5.5L8.5 9L15 2" stroke={read ? '#4ADE80' : 'rgba(255,255,255,0.4)'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
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

/* ── Lead Capture (inline chat bubble) ── */
const LeadCapture = ({
  t,
  sessionId,
  onDone,
  onDismiss,
  lang,
}: {
  t: any;
  sessionId: string | null;
  onDone: () => void;
  onDismiss: () => void;
  lang: string;
}) => {
  const lt = LEAD_FORM_T[lang] || LEAD_FORM_T.en;
  const services = SERVICE_OPTIONS[lang] || SERVICE_OPTIONS.en;
  const isRTL = lang === 'fa' || lang === 'ar';

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
      onDone();
    } catch {
      setError('Error');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="mx-1 my-1.5 p-4 bg-white rounded-xl text-center shadow-sm" style={{ border: '1px solid rgba(201,165,90,0.3)', animation: 'leadIn .3s ease-out' }}>
        <div className="text-2xl mb-2">✓</div>
        <p className="text-sm font-semibold" style={{ color: '#001E6E' }}>{lt.success_title}</p>
        <p className="text-xs mt-1" style={{ color: '#6E7B8B' }}>{lt.success_msg}</p>
      </div>
    );
  }

  const inputClass = 'w-full px-3 py-2 text-[13px] rounded-lg border outline-none mb-2 bg-[#FAFAFA] transition-colors focus:border-[#001E6E]';

  return (
    <div
      className="mx-1 my-1.5 bg-white rounded-xl overflow-hidden shadow-sm"
      style={{ border: '1px solid rgba(201,165,90,0.3)', animation: 'leadIn .3s ease-out', direction: isRTL ? 'rtl' : 'ltr' }}
    >
      <div className="flex items-center gap-2 px-3 py-2.5" style={{ background: 'rgba(0,30,110,0.03)', borderBottom: '1px solid #E2DDD8' }}>
        <span className="text-lg">📋</span>
        <div>
          <p className="text-[13px] font-semibold" style={{ color: '#001E6E' }}>{lt.title}</p>
          <p className="text-[11px]" style={{ color: '#6E7B8B' }}>{lt.subtitle}</p>
        </div>
      </div>
      <div className="p-3">
        <label className="text-[11px] font-medium mb-0.5 block" style={{ color: '#001E6E' }}>{lt.name_label} *</label>
        <input value={name} onChange={e => setName(e.target.value)} placeholder={lt.name_ph} className={inputClass} style={{ borderColor: '#E2DDD8', fontFamily: 'inherit' }} />

        <label className="text-[11px] font-medium mb-0.5 block" style={{ color: '#001E6E' }}>{lt.phone_label} *</label>
        <input value={phone} onChange={e => setPhone(e.target.value)} placeholder={lt.phone_ph} type="tel" className={inputClass} style={{ borderColor: '#E2DDD8', fontFamily: 'inherit', direction: 'ltr', textAlign: isRTL ? 'right' : 'left' }} />

        <label className="text-[11px] font-medium mb-0.5 block" style={{ color: '#001E6E' }}>{lt.email_label}</label>
        <input value={email} onChange={e => setEmail(e.target.value)} placeholder="email@example.com" type="email" className={inputClass} style={{ borderColor: '#E2DDD8', fontFamily: 'inherit', direction: 'ltr', textAlign: isRTL ? 'right' : 'left' }} />

        <label className="text-[11px] font-medium mb-0.5 block" style={{ color: '#001E6E' }}>{lt.service_label}</label>
        <select value={service} onChange={e => setService(e.target.value)} className={inputClass} style={{ borderColor: '#E2DDD8', fontFamily: 'inherit' }}>
          {services.map((s: string) => <option key={s} value={s}>{s}</option>)}
        </select>

        {error && <p className="text-[11px] text-red-500 mb-2">{error}</p>}
        <button onClick={handleSubmit} disabled={submitting} className="w-full py-2.5 rounded-lg text-[13px] font-semibold text-white transition-colors disabled:opacity-60" style={{ background: '#C9A55A' }}>
          {submitting ? '...' : lt.submit}
        </button>
        <p className="text-[10px] text-center mt-2" style={{ color: '#6E7B8B' }}>🔒 {lt.privacy}</p>
        <button onClick={onDismiss} className="w-full py-1 text-[11px] mt-1 transition-colors" style={{ color: '#6E7B8B' }}>
          {lt.later}
        </button>
      </div>
    </div>
  );
};

/* ════════════════════════════════════════════
   TRIGGER BUTTON (legacy)
   ════════════════════════════════════════════ */
export const ChatTrigger = ({ onClick }: { onClick: () => void }) => {
  return null;
};

/* ════════════════════════════════════════════
   MODAL
   ════════════════════════════════════════════ */
const ChatModal = ({ isOpen, onClose, initialMessage = '' }: { isOpen: boolean; onClose: () => void; initialMessage?: string }) => {
  const { t, lang, isRTL } = useLanguage();
  const ct = t.chat_modal;

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
      // Start a new session each time modal opens
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
      // Show error message in chat
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
            className="flex flex-col overflow-hidden w-[420px] max-w-[calc(100vw-32px)] h-[620px] max-h-[calc(100vh-48px)] rounded-[20px] bg-white shadow-[0_32px_80px_rgba(0,0,0,0.25),0_8px_24px_rgba(0,30,110,0.2)] max-[480px]:rounded-b-none max-[480px]:fixed max-[480px]:bottom-0 max-[480px]:left-0 max-[480px]:right-0 max-[480px]:w-full max-[480px]:h-[90vh] max-[480px]:max-h-[90vh] max-[480px]:rounded-t-[20px]"
          >
            {/* ── HEADER ── */}
            <div
              className="flex items-center gap-2.5 px-3.5 py-3 flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #001E6E 0%, #002B9A 100%)', direction: 'ltr' }}
            >
              <img
                src={brandLogo}
                alt="Residency24"
                className="h-9 w-auto max-w-[150px] flex-shrink-0 object-contain"
              />
              <div className="flex-1 min-w-0">
                <p className="text-[15px] font-bold text-white">{ct.header.name}</p>
                <p className="text-[12px]" style={{ color: isLoading ? '#DCC896' : 'rgba(255,255,255,0.6)' }}>
                  {isLoading ? ct.header.typing : ct.header.subtitle}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <button className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.08)' }}>
                  <Phone size={14} color="rgba(255,255,255,0.6)" />
                </button>
                <button className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.08)' }}>
                  <MoreVertical size={14} color="rgba(255,255,255,0.6)" />
                </button>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors"
                style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)' }}
              >
                <X size={14} color="rgba(255,255,255,0.8)" />
              </button>
            </div>

            <div className="mx-4" style={{ height: 1, background: 'linear-gradient(90deg, transparent, rgba(220,200,150,0.3), transparent)' }} />

            {/* ── CHAT AREA ── */}
            <div
              className="flex-1 overflow-y-auto px-3 py-3.5 space-y-1.5"
              style={{
                background: '#F0EDE8',
                backgroundImage: 'radial-gradient(circle, rgba(0,30,110,0.04) 1px, transparent 1px)',
                backgroundSize: '20px 20px',
                direction: isRTL ? 'rtl' : 'ltr',
              }}
            >
              <div className="flex justify-center mb-2">
                <span className="text-[10px] px-3 py-1 rounded-full" style={{ background: 'rgba(0,30,110,0.06)', color: '#6E7B8B' }}>
                  {ct.today}
                </span>
              </div>

              {messages.map(msg => (
                <div
                  key={msg.id}
                  style={{ direction: 'ltr', animation: 'msgIn .2s ease-out' }}
                  className={`flex gap-1.5 mb-1.5 ${msg.role === 'assistant' ? 'justify-start items-end' : 'justify-end'}`}
                >
                  {msg.role === 'assistant' && <R24Avatar size={24} />}
                  <div
                    className="max-w-[80%] px-3 py-2.5 text-[13px] leading-relaxed shadow-sm"
                    style={
                      msg.role === 'assistant'
                        ? { background: '#fff', borderRadius: '14px 14px 14px 3px', color: '#1A1A2E', direction: isRTL ? 'rtl' : 'ltr' }
                        : { background: 'linear-gradient(135deg,#001E6E,#002B9A)', borderRadius: '14px 14px 3px 14px', color: '#fff', direction: isRTL ? 'rtl' : 'ltr' }
                    }
                  >
                    {msg.role === 'assistant' && (
                      <p className="text-[10px] font-semibold mb-1" style={{ color: '#DCC896' }}>{ct.header.name}</p>
                    )}
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                    <div className="flex items-center gap-1 mt-1" style={{ justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                      <span className="text-[9px]" style={{ color: msg.role === 'user' ? 'rgba(255,255,255,0.5)' : '#6E7B8B' }}>{msg.time}</span>
                      {msg.role === 'user' && <DoubleTick read={msg.read} />}
                    </div>
                  </div>
                </div>
              ))}

              {isLoading && <TypingDots />}

              {showLead && !leadDone && (
                <LeadCapture t={t} sessionId={sessionId} lang={lang} onDone={handleLeadDone} onDismiss={() => { setShowLead(false); setLeadDone(true); }} />
              )}

              <div ref={bottomRef} />
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

            {/* ── INPUT BAR ── */}
            <div
              className={`flex items-center gap-2 px-2.5 py-2 flex-shrink-0 ${isRTL ? 'flex-row-reverse' : ''}`}
              style={{ background: '#F5F4F2', borderTop: '1px solid #E2DDD8' }}
            >
              <div
                className={`flex-1 flex items-center rounded-full bg-white px-3 ${isRTL ? 'flex-row-reverse' : ''}`}
                style={{ border: '1px solid rgba(0,30,110,0.1)', boxShadow: '0 1px 4px rgba(0,30,110,0.06)' }}
              >
                <input
                  ref={inputRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), send())}
                  placeholder={ct.input_placeholder}
                  className="flex-1 bg-transparent border-none outline-none text-sm py-2.5"
                  style={{ color: '#1A1A2E', fontFamily: 'inherit', direction: isRTL ? 'rtl' : 'ltr', textAlign: isRTL ? 'right' : 'left' }}
                />
                <span className="text-sm cursor-pointer opacity-50 hover:opacity-100 transition-opacity">😊</span>
              </div>
              <button
                onClick={() => send()}
                disabled={!input.trim() || isLoading}
                className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all"
                style={{ background: input.trim() ? '#001E6E' : 'rgba(0,30,110,0.2)' }}
              >
                <Send size={16} color="white" style={{ transform: isRTL ? 'scaleX(-1) rotate(-45deg)' : '' }} />
              </button>
            </div>

            {/* ── BRAND FOOTER ── */}
            <div
              className="flex items-center justify-between px-3.5 py-1.5 flex-shrink-0 text-[10px]"
              style={{ background: '#001E6E', color: 'rgba(255,255,255,0.5)' }}
            >
              <span>{ct.brand_footer}</span>
              <span className="flex items-center gap-1">🔒 {ct.privacy}</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ChatModal;
