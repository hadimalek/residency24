"use client";

import { useState } from "react";
import {
  Building2,
  Building,
  Home,
  Users,
  CreditCard,
  Trophy,
  Plane,
  Heart,
  Briefcase,
  ShieldCheck,
  FileText,
  Languages,
  Calculator,
  ListChecks,
  Sparkles,
  ArrowRight,
  Check,
  ChevronDown,
  AlertTriangle,
  MapPin,
  MessageCircle,
  Target,
  Wallet,
  Globe2,
  BookOpen,
  Landmark,
  ScrollText,
  HelpCircle,
  KeyRound,
  Banknote,
  ClipboardList,
  Search,
  IdCard,
  ShoppingBag,
  Cpu,
  GraduationCap,
  Truck,
  Wand2,
  UserCog,
  Stethoscope,
  Network,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import SharedBreadcrumb from "@/components/shared/SharedBreadcrumb";

const WA = "https://wa.me/971562009131?text=Здравствуйте,+нужна+консультация+по+открытию+компании+в+ОАЭ";

const ELIGIBILITY = "/ru/tools/visa-eligibility-checker/";
const COST = "/ru/tools/cost-calculator/";
const DOCS = "/ru/tools/document-checklist-generator/";
const COMPARE_COMPANY_PROPERTY = "/ru/compare/company-formation-vs-property-purchase/";
const COMPARE_UAE_OMAN = "/ru/compare/uae-vs-oman/";
const CONTACT = "/ru/contact/";
const BLOG = "/ru/blog/";

const UAE_HUB = "/ru/uae/";
const UAE_RESIDENCY = "/ru/uae/residency/";
const UAE_PROPERTY = "/ru/uae/property-purchase/";
const UAE_GOLDEN = "/ru/uae/golden-visa/";
const UAE_FAMILY = "/ru/uae/family-visa/";
const UAE_VISA = "/ru/uae/visa/";

type CardLink = { title: string; desc: string; href: string; icon: any; badge?: string };

const HERO_FLOATING = [
  { title: "Free Zone", icon: Building2 },
  { title: "Mainland", icon: Building },
  { title: "Residence Visa", icon: ScrollText },
  { title: "Emirates ID", icon: IdCard },
  { title: "Bank Account", icon: CreditCard },
];

const TRUST_BAR = [
  { label: "Русскоязычная поддержка", icon: Languages },
  { label: "Free Zone / Mainland", icon: Building2 },
  { label: "Компания + резидентство", icon: ScrollText },
  { label: "Документы и лицензия", icon: FileText },
  { label: "Banking readiness", icon: Banknote },
];

const ROUTE_TIMELINE = [
  { title: "Выбор юрисдикции", desc: "Free Zone или Mainland под бизнес-модель.", icon: Globe2 },
  { title: "Регистрация компании", desc: "Учредительные документы и подача заявки.", icon: Building2 },
  { title: "Business license", desc: "Лицензия под выбранную деятельность.", icon: ScrollText },
  { title: "Establishment / immigration file", desc: "Открытие иммиграционного дела компании.", icon: FileText },
  { title: "Резидентская виза", desc: "Виза для собственника и партнёров.", icon: ShieldCheck },
  { title: "Emirates ID", desc: "Идентификатор резидента после визы.", icon: IdCard },
  { title: "Банковский счёт / family", desc: "Корпоративный счёт и сценарий для семьи.", icon: CreditCard },
];

const FZ_ML_CRITERIA = [
  { label: "Подходит для", fz: "International business, consulting, online services, trading", ml: "Работа на рынке ОАЭ, локальные контракты, отдельные виды деятельности" },
  { label: "Сложность запуска", fz: "Обычно проще", ml: "Может быть сложнее" },
  { label: "Стоимость", fz: "Зависит от free zone и пакета", ml: "Зависит от лицензии, деятельности и требований" },
  { label: "Офис", fz: "Flexi-desk / virtual в ряде юрисдикций", ml: "Часто требования к офису серьёзнее" },
  { label: "Визы", fz: "Зависит от пакета и квоты", ml: "Зависит от структуры и лицензии" },
  { label: "Банковский счёт", fz: "Возможен, зависит от compliance", ml: "Возможен, зависит от business profile" },
  { label: "Лучше для", fz: "Быстрый старт и международная деятельность", ml: "Локальный рынок и расширенная деятельность в UAE" },
];

const AUDIENCE: CardLink[] = [
  { title: "Предприниматели", desc: "Хотят открыть бизнес и работать через UAE company.", href: CONTACT, icon: Briefcase },
  { title: "Владельцы онлайн-бизнеса", desc: "Нужна международная структура и платежи.", href: CONTACT, icon: Globe2 },
  { title: "Инвесторы", desc: "Рассматривают ОАЭ как бизнес-юрисдикцию.", href: UAE_GOLDEN, icon: Trophy },
  { title: "Семьи", desc: "Планируют релокацию через основной бизнес-сценарий.", href: UAE_FAMILY, icon: Heart },
  { title: "Consultants / freelancers", desc: "Нужна лицензия для профессиональной деятельности.", href: CONTACT, icon: UserCog },
  { title: "Existing business owners", desc: "Хотят перенести часть структуры в ОАЭ.", href: CONTACT, icon: Network },
];

const SCOPE = [
  { title: "Анализ цели и профиля", icon: Target },
  { title: "Выбор Free Zone или Mainland", icon: Globe2 },
  { title: "Подбор лицензии и activity", icon: ScrollText },
  { title: "Подготовка документов", icon: FileText },
  { title: "Сопровождение регистрации", icon: ClipboardList },
  { title: "Визовый сценарий", icon: ShieldCheck },
  { title: "Emirates ID pathway", icon: IdCard },
  { title: "Банковская подготовка", icon: Banknote },
  { title: "Family scenario review", icon: Users },
];

const COST_FACTORS = [
  { title: "Юрисдикция", desc: "Free Zone или Mainland", icon: Globe2 },
  { title: "Тип лицензии", desc: "Commercial, professional, industrial и др.", icon: ScrollText },
  { title: "Количество виз", desc: "Founder, partners, employees, dependents", icon: Users },
  { title: "Office option", desc: "Flexi desk, virtual или физический офис", icon: KeyRound },
  { title: "Banking preparation", desc: "Документы, source of funds, бизнес-модель", icon: Banknote },
  { title: "Дополнительные approvals", desc: "Для отдельных видов деятельности", icon: ShieldCheck },
  { title: "Family scenario", desc: "Если нужны визы для семьи", icon: Heart },
  { title: "Renewal costs", desc: "Ежегодные продления лицензии и виз", icon: ListChecks },
];

const PROCESS = [
  { title: "Первичная оценка", desc: "Цель, бизнес-модель, визы, семья, банк." },
  { title: "Выбор юрисдикции", desc: "Free Zone или Mainland, activity, license type." },
  { title: "Подготовка документов", desc: "Паспорт, фото, формы, данные shareholders." },
  { title: "Подача и регистрация", desc: "Заявка, approvals, выпуск лицензии." },
  { title: "Визовый сценарий", desc: "Residence visa, Emirates ID, медицинские этапы." },
  { title: "Banking readiness", desc: "Подготовка к корпоративному счёту и compliance." },
];

const REQUIRED_DOCS = [
  { title: "Паспорт shareholders", icon: FileText },
  { title: "Фото", icon: IdCard },
  { title: "Варианты названия компании", icon: Building2 },
  { title: "Описание business activity", icon: ScrollText },
  { title: "Данные участников / shareholders", icon: Users },
  { title: "Текущая страна проживания", icon: MapPin },
  { title: "Планируемое количество виз", icon: ShieldCheck },
  { title: "Документы по source of funds", icon: Banknote },
  { title: "Business model / contracts", icon: Briefcase },
  { title: "Семейные данные (dependents)", icon: Heart },
];

const COMPLIANCE_CARDS = [
  { title: "Business model clarity", icon: Target },
  { title: "Source of funds", icon: Banknote },
  { title: "Company license", icon: ScrollText },
  { title: "Corporate documents", icon: FileText },
  { title: "Shareholder documents", icon: Users },
  { title: "Contracts / invoices", icon: ClipboardList },
  { title: "Office или business presence", icon: KeyRound },
  { title: "Expected transactions", icon: Wallet },
];

const VISA_CARDS: CardLink[] = [
  { title: "Residence Visa", desc: "Возможный сценарий для владельца или партнёра компании.", href: UAE_RESIDENCY, icon: ShieldCheck },
  { title: "Emirates ID", desc: "Связан с резидентским статусом и этапами оформления.", href: UAE_RESIDENCY, icon: IdCard },
  { title: "Family Visa", desc: "Возможность рассмотреть dependents после оценки заявителя.", href: UAE_FAMILY, icon: Heart },
  { title: "Medical / документы", desc: "Часть этапов требует личного присутствия и проверки документов.", href: DOCS, icon: Stethoscope },
];

const ACTIVITIES: CardLink[] = [
  { title: "Commercial license", desc: "Торговля и широкий спектр коммерческих операций.", href: CONTACT, icon: ShoppingBag },
  { title: "Professional license", desc: "Услуги и профессиональная деятельность.", href: CONTACT, icon: Briefcase },
  { title: "Consulting activity", desc: "Консалтинг и экспертные услуги.", href: CONTACT, icon: UserCog },
  { title: "Trading activity", desc: "Импорт, экспорт, дистрибуция.", href: CONTACT, icon: Truck },
  { title: "E-commerce / online", desc: "Онлайн-продажи и платформы.", href: CONTACT, icon: Cpu },
  { title: "Industrial / special", desc: "Производство и регулируемые направления.", href: CONTACT, icon: Wand2 },
];

const RISKS = [
  "Банковский счёт не гарантируется",
  "Сроки зависят от юрисдикции и документов",
  "Стоимость зависит от license, visas, office и activity",
  "Некоторые виды деятельности требуют approvals",
  "Резидентская виза зависит от структуры и требований",
  "Compliance для некоторых клиентов может быть более детальным",
];

const RELATED: CardLink[] = [
  { title: "Резидентская виза ОАЭ", desc: "Маршруты резидентства для владельцев и партнёров.", href: UAE_RESIDENCY, icon: ScrollText },
  { title: "Недвижимость в Дубае", desc: "Инвестиции и связь с резидентством.", href: UAE_PROPERTY, icon: Home },
  { title: "Golden Visa ОАЭ", desc: "Долгосрочный маршрут для подходящих категорий.", href: UAE_GOLDEN, icon: Trophy },
  { title: "Семейная виза ОАЭ", desc: "Визы для супруги/супруга и детей.", href: UAE_FAMILY, icon: Heart },
  { title: "Визы в ОАЭ", desc: "Туристическая, бизнес, семейная и др.", href: UAE_VISA, icon: Plane },
  { title: "ОАЭ Country Hub", desc: "Все услуги по ОАЭ в одном месте.", href: UAE_HUB, icon: Globe2 },
];

const FAQS = [
  { q: "Можно ли открыть компанию в ОАЭ нерезиденту?", a: "Да, нерезиденты могут регистрировать компании в ОАЭ — это распространённый сценарий. Конкретные условия и список документов зависят от выбранной юрисдикции и вида деятельности." },
  { q: "Что выбрать: Free Zone или Mainland?", a: "Free Zone обычно подходит для международной деятельности, консалтинга и онлайн-сервисов; Mainland — для работы на рынке ОАЭ и локальных контрактов. Финальный выбор зависит от бизнес-модели, виз и банковского профиля." },
  { q: "Можно ли получить резидентскую визу через компанию?", a: "Да, регистрация компании — один из распространённых маршрутов к резидентской визе. Условия зависят от юрисдикции, лицензии и квоты на визы." },
  { q: "Можно ли открыть корпоративный банковский счёт?", a: "Открытие счёта возможно, но банк проводит отдельную compliance-проверку. Решение зависит от документов, источника средств, бизнес-модели и профиля бенефициара." },
  { q: "Какие документы нужны для регистрации компании?", a: "Базовый набор обычно включает паспорт, фото, варианты названия, описание деятельности и данные shareholders. Полный список формируется после выбора юрисдикции и activity." },
  { q: "Сколько времени занимает открытие компании?", a: "Сроки зависят от юрисдикции, типа лицензии и готовности документов. Часть шагов идёт параллельно — итоговый таймлайн формируется после оценки кейса." },
  { q: "Можно ли добавить семью после получения резидентской визы?", a: "Да, после получения резидентской визы основной заявитель, как правило, может рассмотреть визы для супруги/супруга и детей. Условия зависят от структуры и требований органов." },
  { q: "Нужно ли личное присутствие?", a: "Многие шаги начинаются удалённо. Часть этапов — биометрия, медицинский осмотр и открытие счёта — обычно требуют личного присутствия в ОАЭ." },
  { q: "От чего зависит стоимость?", a: "Итоговая стоимость зависит от юрисдикции, лицензии, количества виз, офиса, banking preparation и дополнительных approvals. Мы делаем индивидуальную оценку до начала процесса." },
  { q: "Что Residency24 не гарантирует?", a: "Мы не гарантируем одобрение государственных органов, открытие банковского счёта или конкретные сроки. Наша работа — подбор маршрута, подготовка документов и сопровождение." },
];

const GUIDES = [
  { title: "Free Zone или Mainland: что выбрать для компании в ОАЭ?", desc: "Сравнение по бизнес-модели, визам и банку.", href: BLOG },
  { title: "Как открыть корпоративный счёт в ОАЭ?", desc: "Документы, source of funds и compliance.", href: BLOG },
  { title: "Компания в ОАЭ и резидентская виза", desc: "Что важно знать о связке бизнес + ВНЖ.", href: BLOG },
  { title: "Какие документы нужны для открытия компании в Дубае?", desc: "Базовый и расширенный пакет.", href: BLOG },
  { title: "Бизнес-релокация в ОАЭ для русскоязычных предпринимателей", desc: "От оценки до запуска и счёта.", href: BLOG },
];

function CardGrid({ items, cols = 3 }: { items: CardLink[]; cols?: 2 | 3 }) {
  const colClass = cols === 2 ? "md:grid-cols-2" : "md:grid-cols-2 lg:grid-cols-3";
  return (
    <div className={`grid grid-cols-1 ${colClass} gap-5`}>
      {items.map((c) => {
        const Icon = c.icon;
        return (
          <a key={c.title} href={c.href} className="group relative rounded-2xl border border-border bg-white p-6 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all">
            {c.badge && (
              <span className="absolute top-4 right-4 bg-gold text-navy text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded-full">{c.badge}</span>
            )}
            <div className="w-11 h-11 rounded-xl bg-navy/5 text-navy flex items-center justify-center mb-4 group-hover:bg-navy group-hover:text-white transition-colors">
              <Icon className="w-5 h-5" />
            </div>
            <div className="font-semibold text-navy text-base mb-1">{c.title}</div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">{c.desc}</p>
            <span className="inline-flex items-center gap-1 text-sm font-medium text-navy group-hover:text-gold-dk transition-colors">
              Подробнее <ArrowRight className="w-4 h-4" />
            </span>
          </a>
        );
      })}
    </div>
  );
}

function SectionHead({ eyebrow, title, subtitle }: { eyebrow?: string; title: string; subtitle?: string }) {
  return (
    <div className="mb-10 text-center max-w-3xl mx-auto">
      {eyebrow && (
        <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gold-dk mb-3">
          <Sparkles className="w-3.5 h-3.5" /> {eyebrow}
        </div>
      )}
      <h2 className="text-2xl md:text-4xl font-bold text-navy leading-tight">{title}</h2>
      {subtitle && <p className="text-muted-foreground mt-3 text-base md:text-lg">{subtitle}</p>}
    </div>
  );
}

function FaqItem({ q, a, idx, open, onToggle }: { q: string; a: string; idx: number; open: boolean; onToggle: (i: number) => void }) {
  return (
    <div className="border border-border rounded-xl bg-white overflow-hidden">
      <button onClick={() => onToggle(idx)} className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-surface transition-colors">
        <span className="font-semibold text-navy text-sm md:text-base">{q}</span>
        <ChevronDown className={`w-5 h-5 text-navy transition-transform shrink-0 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed">{a}</div>}
    </div>
  );
}

export default function RuRegisterCompanyClient() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [heroForm, setHeroForm] = useState({ name: "", phone: "", goal: "", needVisa: "", message: "" });
  const [heroSent, setHeroSent] = useState(false);
  const [finalForm, setFinalForm] = useState({ name: "", phone: "", businessType: "", needVisa: "", needBank: "", message: "" });
  const [finalSent, setFinalSent] = useState(false);

  const submitHero = (e: React.FormEvent) => {
    e.preventDefault();
    if (!heroForm.name || !heroForm.phone) return;
    if (typeof window !== "undefined" && (window as any).gtag) (window as any).gtag("event", "lead_form_submit", { service: "ru_uae_register_company_hero" });
    setHeroSent(true);
  };

  const submitFinal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!finalForm.name || !finalForm.phone) return;
    if (typeof window !== "undefined" && (window as any).gtag) (window as any).gtag("event", "lead_form_submit", { service: "ru_uae_register_company_final" });
    setFinalSent(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <SharedBreadcrumb items={[{ label: "ОАЭ", href: UAE_HUB }, { label: "Открытие компании" }]} />

      {/* HERO */}
      <section className="relative overflow-hidden bg-navy text-white">
        <div className="absolute inset-0 opacity-[0.18] pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at 20% 20%, hsl(var(--gold)) 0, transparent 35%), radial-gradient(circle at 80% 60%, hsl(var(--navy-lt)) 0, transparent 45%)" }} />
        <div className="absolute inset-0 opacity-[0.06] pointer-events-none" style={{ backgroundImage: "linear-gradient(hsl(var(--gold)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--gold)) 1px, transparent 1px)", backgroundSize: "48px 48px" }} />
        <div className="relative max-w-7xl mx-auto px-4 py-14 md:py-20">
          <div className="grid lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 bg-white/10 border border-gold/30 rounded-full px-3 py-1 text-xs text-gold-lt mb-5">
                <MapPin className="w-3.5 h-3.5" /> 🇦🇪 ОАЭ · Дубай · Free Zone и Mainland
              </div>
              <h1 className="text-3xl md:text-5xl font-bold leading-tight">Открытие компании в ОАЭ с поддержкой на русском языке</h1>
              <p className="mt-5 text-base md:text-lg text-white/80 max-w-2xl">
                Помогаем русскоязычным предпринимателям и инвесторам выбрать подходящую юрисдикцию, подготовить документы, оценить визовый сценарий, понять банковские требования и запустить бизнес в ОАЭ.
              </p>

              <ul className="mt-6 grid sm:grid-cols-2 gap-2 max-w-xl">
                {[
                  "Free Zone или Mainland",
                  "Компания + резидентская виза",
                  "Подготовка документов",
                  "Банковское сопровождение и compliance",
                  "Поддержка на русском языке",
                ].map((b) => (
                  <li key={b} className="flex items-start gap-2 text-sm text-white/90">
                    <Check className="w-4 h-4 text-gold mt-0.5 shrink-0" /> {b}
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <a href={CONTACT} className="inline-flex items-center justify-center gap-2 bg-gold text-navy font-semibold px-6 py-3 rounded-xl hover:bg-gold-dk transition-colors min-h-[48px]">
                  Получить консультацию <ArrowRight className="w-4 h-4" />
                </a>
                <a href={COST} className="inline-flex items-center justify-center gap-2 bg-white/10 border border-white/20 text-white font-medium px-6 py-3 rounded-xl hover:bg-white/15 transition-colors min-h-[48px]">
                  <Calculator className="w-4 h-4" /> Рассчитать стоимость
                </a>
                <a href={ELIGIBILITY} className="inline-flex items-center justify-center gap-2 bg-white/10 border border-white/20 text-white font-medium px-6 py-3 rounded-xl hover:bg-white/15 transition-colors min-h-[48px]">
                  <Target className="w-4 h-4" /> Проверить мой сценарий
                </a>
                <a href={WA} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 bg-whatsapp text-white font-medium px-6 py-3 rounded-xl hover:opacity-90 transition-opacity min-h-[48px]">
                  <MessageCircle className="w-4 h-4" /> WhatsApp
                </a>
              </div>
            </div>

            <div className="lg:col-span-5 relative">
              <div className="relative">
                <div className="absolute -top-4 -left-4 right-12 bottom-12 rounded-3xl bg-gradient-to-br from-navy-lt to-navy/60 border border-gold/30 -z-0" />
                <div className="relative rounded-3xl bg-white text-ink p-6 md:p-7 shadow-2xl">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-9 h-9 rounded-lg bg-navy text-gold flex items-center justify-center"><Briefcase className="w-4 h-4" /></div>
                    <div>
                      <div className="text-xs uppercase tracking-wider text-gold-dk font-semibold">Бесплатная оценка</div>
                      <div className="font-bold text-navy">Получить консультацию</div>
                    </div>
                  </div>

                  {heroSent ? (
                    <div className="text-center py-6">
                      <div className="w-12 h-12 mx-auto rounded-full bg-green-100 text-green-600 flex items-center justify-center mb-3">
                        <Check className="w-6 h-6" />
                      </div>
                      <div className="font-semibold text-navy">Спасибо! Мы свяжемся с вами в ближайшее время.</div>
                      <a href={WA} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-2 bg-whatsapp text-white font-semibold px-5 py-2.5 rounded-xl hover:opacity-90 transition-opacity">
                        <MessageCircle className="w-4 h-4" /> Написать в WhatsApp
                      </a>
                    </div>
                  ) : (
                    <form onSubmit={submitHero} className="space-y-3">
                      <input required type="text" placeholder="Имя" value={heroForm.name} onChange={(e) => setHeroForm({ ...heroForm, name: e.target.value })} className="w-full bg-surface border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-navy transition-colors min-h-[44px]" />
                      <input required type="tel" placeholder="Телефон / WhatsApp" value={heroForm.phone} onChange={(e) => setHeroForm({ ...heroForm, phone: e.target.value })} className="w-full bg-surface border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-navy transition-colors min-h-[44px]" />
                      <select value={heroForm.goal} onChange={(e) => setHeroForm({ ...heroForm, goal: e.target.value })} className="w-full bg-surface border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-navy transition-colors min-h-[44px]">
                        <option value="">Цель открытия компании</option>
                        <option>Бизнес и операции</option>
                        <option>Резидентство</option>
                        <option>Международная структура</option>
                        <option>Релокация семьи</option>
                        <option>Ещё не определена</option>
                      </select>
                      <select value={heroForm.needVisa} onChange={(e) => setHeroForm({ ...heroForm, needVisa: e.target.value })} className="w-full bg-surface border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-navy transition-colors min-h-[44px]">
                        <option value="">Нужна ли резидентская виза?</option>
                        <option>Да</option>
                        <option>Нет</option>
                        <option>Пока не уверен(а)</option>
                      </select>
                      <textarea placeholder="Сообщение (необязательно)" value={heroForm.message} onChange={(e) => setHeroForm({ ...heroForm, message: e.target.value })} rows={2} className="w-full bg-surface border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-navy transition-colors" />
                      <button type="submit" className="w-full bg-navy text-white font-semibold px-5 py-3 rounded-xl hover:bg-navy-lt transition-colors min-h-[48px]">
                        Получить консультацию
                      </button>
                      <p className="text-[11px] text-muted-foreground text-center">
                        Мы используем данные только для предварительной оценки кейса.
                      </p>
                    </form>
                  )}
                </div>
                {/* Floating chips */}
                <div className="hidden md:flex flex-wrap gap-2 absolute -bottom-5 left-4 right-4">
                  {HERO_FLOATING.map((f) => {
                    const Icon = f.icon;
                    return (
                      <span key={f.title} className="bg-navy text-white text-[11px] font-semibold rounded-full px-3 py-1.5 inline-flex items-center gap-1.5 shadow-lg border border-gold/30">
                        <Icon className="w-3.5 h-3.5 text-gold" /> {f.title}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST BAR */}
      <section className="bg-white border-y border-border">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {TRUST_BAR.map((t) => {
              const Icon = t.icon;
              return (
                <div key={t.label} className="flex items-center gap-2 text-sm text-navy/90">
                  <span className="w-9 h-9 rounded-lg bg-gold-lt text-navy flex items-center justify-center shrink-0"><Icon className="w-4 h-4" /></span>
                  <span className="font-medium">{t.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* COMPANY + RESIDENCY ROUTE */}
      <section className="py-16 md:py-20 bg-surface">
        <div className="max-w-7xl mx-auto px-4">
          <SectionHead eyebrow="Полный маршрут" title="Компания в ОАЭ — это не только регистрация" subtitle="Для многих клиентов компания в ОАЭ становится частью более широкой задачи: резидентская виза, Emirates ID, банковский счёт, международные платежи и релокация семьи." />
          <div className="relative">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-4">
              {ROUTE_TIMELINE.map((s, i) => {
                const Icon = s.icon;
                return (
                  <div key={s.title} className="relative rounded-2xl bg-white border border-border p-5">
                    <div className="absolute -top-3 left-5 w-7 h-7 rounded-full bg-gold text-navy text-xs font-bold flex items-center justify-center">{i + 1}</div>
                    <div className="w-10 h-10 rounded-lg bg-navy text-gold flex items-center justify-center mt-2 mb-3"><Icon className="w-4 h-4" /></div>
                    <div className="font-semibold text-navy text-sm">{s.title}</div>
                    <div className="text-xs text-muted-foreground mt-1 leading-relaxed">{s.desc}</div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="mt-8 text-center">
            <a href={ELIGIBILITY} className="inline-flex items-center gap-2 bg-navy text-white font-semibold px-6 py-3 rounded-xl hover:bg-navy-lt transition-colors">
              Проверить, какой маршрут подходит мне <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* FREE ZONE VS MAINLAND */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <SectionHead eyebrow="Юрисдикция" title="Free Zone или Mainland — что выбрать?" subtitle="Выбор юрисдикции влияет на деятельность компании, стоимость, требования, банковский профиль и дальнейший визовый сценарий." />

          <div className="hidden md:block rounded-2xl overflow-hidden border border-border">
            <div className="grid grid-cols-3 bg-navy text-white text-sm font-semibold">
              <div className="px-5 py-4">Критерий</div>
              <div className="px-5 py-4 flex items-center gap-2"><Building2 className="w-4 h-4 text-gold" /> Free Zone</div>
              <div className="px-5 py-4 flex items-center gap-2"><Building className="w-4 h-4 text-gold" /> Mainland</div>
            </div>
            {FZ_ML_CRITERIA.map((r, i) => (
              <div key={r.label} className={`grid grid-cols-3 text-sm ${i % 2 === 0 ? "bg-surface" : "bg-white"}`}>
                <div className="px-5 py-4 font-semibold text-navy border-t border-border">{r.label}</div>
                <div className="px-5 py-4 text-ink/80 border-t border-border">{r.fz}</div>
                <div className="px-5 py-4 text-ink/80 border-t border-border">{r.ml}</div>
              </div>
            ))}
          </div>

          <div className="md:hidden grid grid-cols-1 gap-4">
            <div className="rounded-2xl border border-border bg-white p-5">
              <div className="flex items-center gap-2 font-bold text-navy"><Building2 className="w-5 h-5 text-gold-dk" /> Free Zone</div>
              <ul className="mt-3 space-y-2 text-sm text-ink/85">
                {FZ_ML_CRITERIA.map((c) => (
                  <li key={c.label}><span className="text-gold-dk font-semibold">{c.label}:</span> {c.fz}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-border bg-white p-5">
              <div className="flex items-center gap-2 font-bold text-navy"><Building className="w-5 h-5 text-gold-dk" /> Mainland</div>
              <ul className="mt-3 space-y-2 text-sm text-ink/85">
                {FZ_ML_CRITERIA.map((c) => (
                  <li key={c.label}><span className="text-gold-dk font-semibold">{c.label}:</span> {c.ml}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <a href={CONTACT} className="inline-flex items-center justify-center gap-2 bg-navy text-white font-semibold px-6 py-3 rounded-xl hover:bg-navy-lt transition-colors">
              Помогите выбрать юрисдикцию <ArrowRight className="w-4 h-4" />
            </a>
            <a href={COMPARE_COMPANY_PROPERTY} className="inline-flex items-center justify-center gap-2 bg-gold-lt text-navy font-semibold px-6 py-3 rounded-xl hover:bg-gold transition-colors">
              Компания vs недвижимость
            </a>
          </div>
        </div>
      </section>

      {/* AUDIENCE */}
      <section className="py-16 md:py-20 bg-surface">
        <div className="max-w-7xl mx-auto px-4">
          <SectionHead eyebrow="Кому подходит" title="Кому подходит открытие компании в ОАЭ?" subtitle="Этот маршрут может быть полезен не только для запуска бизнеса, но и для резидентства, международной структуры и финансового планирования." />
          <CardGrid items={AUDIENCE} />
        </div>
      </section>

      {/* SCOPE — what we handle */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <SectionHead eyebrow="Объём работ" title="Что берёт на себя Residency24" subtitle="Мы помогаем пройти путь от выбора юрисдикции до подготовки документов и следующего шага после регистрации." />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
            {SCOPE.map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.title} className="rounded-xl border border-border bg-white p-4 flex items-start gap-3 hover:border-gold transition-colors">
                  <div className="w-10 h-10 rounded-lg bg-navy text-gold flex items-center justify-center shrink-0"><Icon className="w-4 h-4" /></div>
                  <div className="font-medium text-navy text-sm">{s.title}</div>
                </div>
              );
            })}
          </div>
          <div className="mt-8 text-center">
            <a href={CONTACT} className="inline-flex items-center gap-2 bg-navy text-white font-semibold px-6 py-3 rounded-xl hover:bg-navy-lt transition-colors">
              Обсудить мой бизнес-сценарий <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* COST FACTORS */}
      <section className="py-16 md:py-20 bg-surface">
        <div className="max-w-7xl mx-auto px-4">
          <SectionHead eyebrow="Стоимость" title="От чего зависит стоимость открытия компании в ОАЭ?" subtitle="Стоимость не должна оцениваться только по цене регистрации. На итоговый бюджет влияют лицензия, юрисдикция, визы, офис, банковская подготовка и документы." />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {COST_FACTORS.map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.title} className="rounded-2xl bg-white border border-border p-5">
                  <div className="w-10 h-10 rounded-lg bg-gold-lt text-navy flex items-center justify-center mb-3"><Icon className="w-5 h-5" /></div>
                  <div className="font-semibold text-navy text-sm">{f.title}</div>
                  <div className="text-xs text-muted-foreground mt-1 leading-relaxed">{f.desc}</div>
                </div>
              );
            })}
          </div>
          <div className="mt-6 max-w-3xl mx-auto rounded-xl border border-gold/40 bg-white px-5 py-4 text-sm text-ink/80 flex items-start gap-3">
            <AlertTriangle className="w-4 h-4 text-gold-dk mt-0.5 shrink-0" />
            <span>Точная стоимость зависит от выбранной юрисдикции, вида деятельности, количества виз и требований конкретного органа.</span>
          </div>
          <div className="mt-8 text-center">
            <a href={COST} className="inline-flex items-center gap-2 bg-navy text-white font-semibold px-6 py-3 rounded-xl hover:bg-navy-lt transition-colors">
              <Calculator className="w-4 h-4" /> Рассчитать ориентировочную стоимость
            </a>
          </div>
        </div>
      </section>

      {/* PROCESS TIMELINE */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <SectionHead eyebrow="Процесс" title="Как проходит открытие компании" subtitle="Процесс зависит от выбранной юрисдикции и вида деятельности, но обычно проходит по следующим этапам." />
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {PROCESS.map((p, i) => (
              <div key={p.title} className="relative rounded-2xl bg-surface border border-border p-5">
                <div className="w-9 h-9 rounded-full bg-navy text-gold flex items-center justify-center font-bold text-sm">{i + 1}</div>
                <div className="mt-3 font-semibold text-navy text-sm">{p.title}</div>
                <div className="text-xs text-muted-foreground mt-1 leading-relaxed">{p.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DOCUMENTS */}
      <section className="py-16 md:py-20 bg-surface">
        <div className="max-w-7xl mx-auto px-4">
          <SectionHead eyebrow="Документы" title="Какие документы могут понадобиться?" subtitle="Точный список зависит от юрисдикции, структуры компании, деятельности и визового сценария." />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {REQUIRED_DOCS.map((r) => {
              const Icon = r.icon;
              return (
                <div key={r.title} className="rounded-xl border border-border bg-white p-4 flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-navy text-gold flex items-center justify-center shrink-0"><Icon className="w-4 h-4" /></div>
                  <div className="font-medium text-navy text-sm">{r.title}</div>
                </div>
              );
            })}
          </div>
          <div className="mt-8 text-center">
            <a href={DOCS} className="inline-flex items-center gap-2 bg-navy text-white font-semibold px-6 py-3 rounded-xl hover:bg-navy-lt transition-colors">
              <ClipboardList className="w-4 h-4" /> Получить предварительный список документов
            </a>
          </div>
        </div>
      </section>

      {/* CORPORATE BANK & COMPLIANCE */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-5">
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gold-dk mb-3">
                <Banknote className="w-3.5 h-3.5" /> Banking
              </div>
              <h2 className="text-2xl md:text-4xl font-bold text-navy leading-tight">Корпоративный счёт и compliance</h2>
              <p className="text-muted-foreground mt-4">
                Открытие компании не гарантирует автоматическое открытие банковского счёта. Банки оценивают документы, структуру бизнеса, источник средств и реальную деятельность компании.
              </p>
              <div className="mt-5 rounded-xl border border-gold/40 bg-gold-lt/40 px-4 py-3 text-sm text-ink/85 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-navy mt-0.5 shrink-0" />
                <span>Мы помогаем подготовить пакет и объяснить требования, но решение об открытии счёта принимает банк.</span>
              </div>
              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <a href={CONTACT} className="inline-flex items-center justify-center gap-2 bg-navy text-white font-semibold px-6 py-3 rounded-xl hover:bg-navy-lt transition-colors">
                  Подготовиться к банковскому счёту <ArrowRight className="w-4 h-4" />
                </a>
                <a href={WA} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 bg-whatsapp text-white font-semibold px-6 py-3 rounded-xl hover:opacity-90 transition-opacity">
                  <MessageCircle className="w-4 h-4" /> WhatsApp
                </a>
              </div>
            </div>
            <div className="lg:col-span-7">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {COMPLIANCE_CARDS.map((c) => {
                  const Icon = c.icon;
                  return (
                    <div key={c.title} className="rounded-xl border border-border bg-surface p-4 flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-navy text-gold flex items-center justify-center shrink-0"><Icon className="w-4 h-4" /></div>
                      <div className="font-semibold text-navy text-sm">{c.title}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* RESIDENCE / EMIRATES ID / FAMILY */}
      <section className="py-16 md:py-20 bg-gradient-to-b from-surface to-gold-lt/30">
        <div className="max-w-7xl mx-auto px-4">
          <SectionHead eyebrow="Резидентство" title="Резидентская виза, Emirates ID и семья" subtitle="После регистрации компании можно рассмотреть визовый сценарий для собственника, партнёров или членов семьи — в зависимости от структуры и требований." />
          <CardGrid items={VISA_CARDS} cols={2} />
          <div className="mt-8 text-center">
            <a href={ELIGIBILITY} className="inline-flex items-center gap-2 bg-navy text-white font-semibold px-6 py-3 rounded-xl hover:bg-navy-lt transition-colors">
              Проверить визовый сценарий <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* ACTIVITIES */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <SectionHead eyebrow="Деятельность" title="Типы деятельности и лицензий" subtitle="Выбор activity влияет на юрисдикцию, стоимость, банковский профиль и требования к документам." />
          <CardGrid items={ACTIVITIES} />
          <p className="mt-6 text-center text-sm text-muted-foreground max-w-2xl mx-auto">
            Некоторые виды деятельности требуют дополнительных approvals или специальных условий.
          </p>
        </div>
      </section>

      {/* RISKS */}
      <section className="py-16 md:py-20 bg-surface">
        <div className="max-w-5xl mx-auto px-4">
          <SectionHead eyebrow="Прозрачность" title="Что важно знать до начала" subtitle="Мы заранее объясняем ограничения, чтобы вы принимали решение без ложных ожиданий." />
          <div className="rounded-2xl border border-gold/40 bg-gold-lt/40 p-6 md:p-10">
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl bg-gold text-navy flex items-center justify-center shrink-0"><AlertTriangle className="w-5 h-5" /></div>
              <div>
                <ul className="space-y-2.5">
                  {RISKS.map((r) => (
                    <li key={r} className="flex items-start gap-2 text-sm text-ink"><Check className="w-4 h-4 text-navy mt-0.5 shrink-0" /> {r}</li>
                  ))}
                </ul>
                <p className="mt-5 text-xs text-ink/70 italic">
                  Информация на странице носит общий характер. Условия, стоимость, сроки и результат зависят от профиля заявителя, выбранной юрисдикции и решения соответствующих органов.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* RELATED UAE SERVICES */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <SectionHead eyebrow="Связанные услуги" title="Связанные услуги по ОАЭ" subtitle="Откройте дополнительные сценарии, которые часто рассматриваются вместе с компанией." />
          <CardGrid items={RELATED} />
          <div className="mt-8 text-center flex flex-col sm:flex-row gap-3 justify-center">
            <a href={COMPARE_UAE_OMAN} className="inline-flex items-center gap-2 text-navy font-semibold hover:underline">
              <Landmark className="w-4 h-4" /> Сравнить ОАЭ и Оман
            </a>
            <a href="/ru/oman/" className="inline-flex items-center gap-2 text-navy font-semibold hover:underline">
              <Globe2 className="w-4 h-4" /> Перейти к Оману
            </a>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 md:py-20 bg-surface">
        <div className="max-w-3xl mx-auto px-4">
          <SectionHead eyebrow="FAQ" title="Частые вопросы об открытии компании в ОАЭ" subtitle="Коротко о главном — без обещаний и громких слов." />
          <div className="space-y-3">
            {FAQS.map((f, i) => (
              <FaqItem key={f.q} q={f.q} a={f.a} idx={i} open={openFaq === i} onToggle={(idx) => setOpenFaq(openFaq === idx ? null : idx)} />
            ))}
          </div>
          <div className="mt-8 text-center text-sm text-muted-foreground flex items-center justify-center gap-2">
            <HelpCircle className="w-4 h-4 text-navy" /> Не нашли ответ?
            <a href={CONTACT} className="text-navy font-semibold hover:underline">Напишите нам</a>
          </div>
        </div>
      </section>

      {/* GUIDES */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <SectionHead eyebrow="Блог" title="Полезные материалы о бизнесе в ОАЭ" subtitle="Гайды и разборы для русскоязычных предпринимателей." />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {GUIDES.map((g) => (
              <a key={g.title} href={g.href} className="group rounded-2xl border border-border bg-white overflow-hidden hover:shadow-lg transition-shadow flex flex-col">
                <div className="h-32 bg-gradient-to-br from-navy to-navy-lt flex items-center justify-center text-gold">
                  <BookOpen className="w-10 h-10" />
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <div className="font-semibold text-navy">{g.title}</div>
                  <p className="text-sm text-muted-foreground mt-1 flex-1">{g.desc}</p>
                  <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-navy group-hover:text-gold-dk transition-colors">Читать <ArrowRight className="w-4 h-4" /></span>
                </div>
              </a>
            ))}
          </div>
          <div className="mt-8 text-center">
            <a href={BLOG} className="inline-flex items-center gap-2 bg-navy text-white font-semibold px-6 py-3 rounded-xl hover:bg-navy-lt transition-colors">
              Смотреть все материалы <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section id="consultation-form" className="py-16 md:py-24 bg-navy text-white">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gold mb-3">
              <Sparkles className="w-3.5 h-3.5" /> Бесплатная оценка
            </div>
            <h2 className="text-2xl md:text-4xl font-bold">Начните с оценки вашего бизнес-сценария</h2>
            <p className="text-white/80 mt-3 text-base md:text-lg">
              Расскажите нам о вашей цели, деятельности, визовом сценарии и банковских задачах — мы подскажем, какой маршрут стоит рассмотреть.
            </p>
          </div>

          <div className="rounded-3xl bg-white/[0.04] border border-white/10 p-6 md:p-10 backdrop-blur-sm">
            {finalSent ? (
              <div className="text-center py-8">
                <div className="w-14 h-14 mx-auto rounded-full bg-green-500/20 text-green-400 flex items-center justify-center mb-4"><Check className="w-7 h-7" /></div>
                <div className="text-lg font-semibold">Спасибо! Мы свяжемся с вами в ближайшее время.</div>
                <p className="text-white/70 mt-2 text-sm">Пока ждёте — напишите нам в WhatsApp для быстрого ответа.</p>
                <a href={WA} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex items-center gap-2 bg-whatsapp text-white font-semibold px-6 py-3 rounded-xl hover:opacity-90 transition-opacity">
                  <MessageCircle className="w-4 h-4" /> Написать в WhatsApp
                </a>
              </div>
            ) : (
              <form onSubmit={submitFinal} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input required type="text" placeholder="Имя" value={finalForm.name} onChange={(e) => setFinalForm({ ...finalForm, name: e.target.value })} className="bg-white/10 border border-gold/30 text-white placeholder:text-white/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold transition-colors min-h-[48px]" />
                <input required type="tel" placeholder="Телефон / WhatsApp" value={finalForm.phone} onChange={(e) => setFinalForm({ ...finalForm, phone: e.target.value })} className="bg-white/10 border border-gold/30 text-white placeholder:text-white/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold transition-colors min-h-[48px]" />
                <select value={finalForm.businessType} onChange={(e) => setFinalForm({ ...finalForm, businessType: e.target.value })} className="bg-white/10 border border-gold/30 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold transition-colors min-h-[48px]">
                  <option value="" className="text-navy">Тип бизнеса</option>
                  <option className="text-navy">Consulting</option>
                  <option className="text-navy">Online / E-commerce</option>
                  <option className="text-navy">Trading</option>
                  <option className="text-navy">Professional services</option>
                  <option className="text-navy">Industrial / special</option>
                  <option className="text-navy">Holding / структура</option>
                  <option className="text-navy">Другое</option>
                </select>
                <select value={finalForm.needVisa} onChange={(e) => setFinalForm({ ...finalForm, needVisa: e.target.value })} className="bg-white/10 border border-gold/30 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold transition-colors min-h-[48px]">
                  <option value="" className="text-navy">Нужна ли резидентская виза?</option>
                  <option className="text-navy">Да</option>
                  <option className="text-navy">Нет</option>
                  <option className="text-navy">Пока не уверен(а)</option>
                </select>
                <select value={finalForm.needBank} onChange={(e) => setFinalForm({ ...finalForm, needBank: e.target.value })} className="md:col-span-2 bg-white/10 border border-gold/30 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold transition-colors min-h-[48px]">
                  <option value="" className="text-navy">Нужен ли корпоративный счёт?</option>
                  <option className="text-navy">Да</option>
                  <option className="text-navy">Нет</option>
                  <option className="text-navy">Возможно, нужно обсудить</option>
                </select>
                <textarea placeholder="Сообщение (необязательно)" value={finalForm.message} onChange={(e) => setFinalForm({ ...finalForm, message: e.target.value })} rows={3} className="md:col-span-2 bg-white/10 border border-gold/30 text-white placeholder:text-white/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold transition-colors" />

                <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button type="submit" className="bg-gold text-navy font-bold px-6 py-3 rounded-xl hover:bg-gold-dk transition-colors min-h-[48px]">
                    Получить консультацию
                  </button>
                  <a href={COST} className="inline-flex items-center justify-center gap-2 bg-white/10 border border-white/20 text-white font-medium px-6 py-3 rounded-xl hover:bg-white/15 transition-colors min-h-[48px]">
                    <Calculator className="w-4 h-4" /> Рассчитать стоимость
                  </a>
                  <a href={WA} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 bg-whatsapp text-white font-semibold px-6 py-3 rounded-xl hover:opacity-90 transition-opacity min-h-[48px]">
                    <MessageCircle className="w-4 h-4" /> Написать в WhatsApp
                  </a>
                </div>
                <p className="md:col-span-2 text-xs text-white/60 mt-1">
                  Мы используем данные только для предварительной оценки вашего кейса. Решение о визе или открытии счёта принимают соответствующие органы и банки.
                </p>
              </form>
            )}
          </div>

          <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            <a href={UAE_HUB} className="text-white/70 hover:text-gold transition-colors inline-flex items-center gap-1"><Globe2 className="w-3.5 h-3.5" /> ОАЭ Hub</a>
            <a href={CONTACT} className="text-white/70 hover:text-gold transition-colors inline-flex items-center gap-1"><MessageCircle className="w-3.5 h-3.5" /> Контакты</a>
            <a href="/ru/" className="text-white/70 hover:text-gold transition-colors inline-flex items-center gap-1"><Search className="w-3.5 h-3.5" /> Главная</a>
            <a href={BLOG} className="text-white/70 hover:text-gold transition-colors inline-flex items-center gap-1"><BookOpen className="w-3.5 h-3.5" /> Блог</a>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
