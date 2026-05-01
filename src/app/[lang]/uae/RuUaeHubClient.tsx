"use client";

import { useState } from "react";
import {
  Building2,
  Home,
  Users,
  CreditCard,
  GitCompare,
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
  Phone,
  Target,
  Wallet,
  Globe2,
  BookOpen,
  Landmark,
  ScrollText,
  HelpCircle,
  Building,
  KeyRound,
  Banknote,
  ClipboardList,
  Search,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import SharedBreadcrumb from "@/components/shared/SharedBreadcrumb";

const WA = "https://wa.me/971562009131?text=Здравствуйте,+нужна+консультация+по+ОАЭ";

const ELIGIBILITY = "/ru/tools/visa-eligibility-checker/";
const COST = "/ru/tools/cost-calculator/";
const DOCS = "/ru/tools/document-checklist-generator/";
const COMPARE_UAE_OMAN = "/ru/compare/uae-vs-oman/";
const COMPARE_COMPANY_PROPERTY = "/ru/compare/company-formation-vs-property-purchase/";
const CONTACT = "/ru/contact/";
const BLOG = "/ru/blog/";

const UAE_REGISTER = "/ru/uae/register-company/";
const UAE_RESIDENCY = "/ru/uae/residency/";
const UAE_PROPERTY = "/ru/uae/property-purchase/";
const UAE_GOLDEN = "/ru/uae/golden-visa/";
const UAE_TOURIST = "/ru/uae/tourist-visa/";
const UAE_FAMILY = "/ru/uae/family-visa/";
const UAE_VISA = "/ru/uae/visa/";

type CardLink = { title: string; desc: string; href: string; icon: any; badge?: string };

const HERO_FLOATING = [
  { title: "Компания в ОАЭ", icon: Building2 },
  { title: "Резидентская виза", icon: ScrollText },
  { title: "Недвижимость", icon: Home },
  { title: "Golden Visa", icon: Trophy },
  { title: "Семья", icon: Heart },
  { title: "Банк", icon: CreditCard },
];

const TRUST_BAR = [
  { label: "Поддержка на русском языке", icon: Languages },
  { label: "ОАЭ: бизнес, недвижимость, визы", icon: Building },
  { label: "Case-by-case оценка", icon: Search },
  { label: "Семья и dependents", icon: Users },
  { label: "Банковское сопровождение", icon: Banknote },
];

const PATHWAYS: CardLink[] = [
  { title: "Открыть компанию", desc: "Free zone или mainland, лицензия, резидентская виза и дальнейшее сопровождение.", href: UAE_REGISTER, icon: Building2 },
  { title: "Получить резидентскую визу", desc: "Маршруты через компанию, недвижимость, семью или инвестиции.", href: UAE_RESIDENCY, icon: ScrollText },
  { title: "Купить недвижимость", desc: "Инвестиции в Дубае и возможная связь с резидентством.", href: UAE_PROPERTY, icon: Home },
  { title: "Golden Visa", desc: "Долгосрочный маршрут для подходящих категорий заявителей.", href: UAE_GOLDEN, icon: Trophy, badge: "Популярно" },
  { title: "Перевезти семью", desc: "Dependents, family visa, документы и сроки.", href: UAE_FAMILY, icon: Users },
  { title: "Получить визу", desc: "Туристическая, бизнес, семейная и другие визовые сценарии.", href: UAE_VISA, icon: Plane },
];

const WHY_UAE = [
  { title: "Бизнес-среда", desc: "Free zone, mainland, international trade, company setup.", icon: Briefcase },
  { title: "Резидентство", desc: "Разные маршруты для предпринимателей, инвесторов и семей.", icon: ScrollText },
  { title: "Недвижимость", desc: "Дубай как популярный рынок для инвесторов.", icon: Home },
  { title: "Семья", desc: "Инфраструктура, школы, жильё, family visas.", icon: Heart },
  { title: "Банковская система", desc: "Возможности есть, но compliance требует подготовки.", icon: Banknote },
  { title: "Международная мобильность", desc: "Удобный региональный и глобальный hub.", icon: Globe2 },
];

const SERVICES: CardLink[] = [
  { title: "Открытие компании в ОАЭ", desc: "Подбор юрисдикции, лицензии и базовой структуры.", href: UAE_REGISTER, icon: Building2 },
  { title: "Резидентская виза ОАЭ", desc: "Подбор подходящего основания для резидентства.", href: UAE_RESIDENCY, icon: ScrollText },
  { title: "Недвижимость в Дубае", desc: "Покупка недвижимости с учётом цели и бюджета.", href: UAE_PROPERTY, icon: Home },
  { title: "Golden Visa ОАЭ", desc: "Проверка соответствия требованиям долгосрочной визы.", href: UAE_GOLDEN, icon: Trophy, badge: "Популярно" },
  { title: "Туристическая виза ОАЭ", desc: "Краткосрочные визы и подготовка документов.", href: UAE_TOURIST, icon: Plane },
  { title: "Семейная виза ОАЭ", desc: "Визы для супруги/супруга, детей и dependents.", href: UAE_FAMILY, icon: Users },
];

const ROUTE_COMPARE = [
  { route: "Компания", best: "Предприниматели, founders, business owners", goal: "Бизнес + резидентство", complexity: "Средняя", next: "Подобрать юрисдикцию", href: UAE_REGISTER, icon: Building2 },
  { route: "Недвижимость", best: "Инвесторы, семьи", goal: "Инвестиция + возможное резидентство", complexity: "Средняя", next: "Оценить бюджет", href: UAE_PROPERTY, icon: Home },
  { route: "Golden Visa", best: "Инвесторы и подходящие категории", goal: "Долгосрочное резидентство", complexity: "Выше", next: "Проверить eligibility", href: UAE_GOLDEN, icon: Trophy },
  { route: "Семейная виза", best: "Семьи", goal: "Переезд семьи", complexity: "Зависит от спонсора", next: "Проверить документы", href: UAE_FAMILY, icon: Heart },
  { route: "Туристическая виза", best: "Краткосрочные поездки", goal: "Въезд / поездка", complexity: "Ниже", next: "Подготовить заявку", href: UAE_TOURIST, icon: Plane },
  { route: "Banking support", best: "Бизнес и инвесторы", goal: "Счёт и структура", complexity: "Зависит от compliance", next: "Обсудить кейс", href: CONTACT, icon: Banknote },
];

const COST_SNAPSHOT = [
  { title: "Компания в ОАЭ", note: "После оценки кейса", icon: Building2 },
  { title: "Резидентская виза", note: "Зависит от основания", icon: ScrollText },
  { title: "Недвижимость в Дубае", note: "Зависит от объекта и цели", icon: Home },
  { title: "Golden Visa", note: "По требованиям программы", icon: Trophy },
  { title: "Семейная релокация", note: "Зависит от количества членов семьи", icon: Users },
  { title: "Банковское сопровождение", note: "После проверки структуры", icon: Banknote },
];

const COMPANY_CHECKLIST = [
  { title: "Выбор free zone или mainland", icon: Building },
  { title: "Подбор лицензии", icon: ClipboardList },
  { title: "Резидентская виза через компанию", icon: ScrollText },
  { title: "Корпоративный банковский счёт", icon: CreditCard },
  { title: "Подготовка документов", icon: FileText },
  { title: "Compliance и source of funds", icon: ShieldCheck },
];

const PROPERTY_GV: CardLink[] = [
  { title: "Недвижимость в Дубае", desc: "Подбор объекта и оценка связи с резидентством.", href: UAE_PROPERTY, icon: Home },
  { title: "Инвесторская резидентская виза", desc: "Возможные сценарии для владельцев недвижимости.", href: UAE_RESIDENCY, icon: ScrollText },
  { title: "Golden Visa", desc: "Долгосрочный маршрут для соответствующих заявителей.", href: UAE_GOLDEN, icon: Trophy },
  { title: "Семья", desc: "Возможность рассмотреть dependents при подходящем сценарии.", href: UAE_FAMILY, icon: Users },
];

const FAMILY_CARDS: CardLink[] = [
  { title: "Семейная виза", desc: "Резидентство для супруги/супруга и детей.", href: UAE_FAMILY, icon: Heart },
  { title: "Документы для dependents", desc: "Свидетельства, переводы, апостили.", href: DOCS, icon: FileText },
  { title: "Стоимость по составу семьи", desc: "Расчёт под количество членов семьи.", href: COST, icon: Calculator },
  { title: "Сроки и этапы", desc: "Что и когда оформляется.", href: ELIGIBILITY, icon: ListChecks },
  { title: "Жильё и адаптация", desc: "Базовые ориентиры по районам и инфраструктуре.", href: CONTACT, icon: KeyRound },
];

const PROCESS = [
  { title: "Анализ цели", desc: "Бизнес, семья, недвижимость, резидентство или виза." },
  { title: "Подбор маршрута", desc: "Сравниваем доступные варианты в ОАЭ." },
  { title: "Оценка стоимости", desc: "Показываем ориентировочный бюджет и этапы." },
  { title: "Документы", desc: "Формируем список документов и требований." },
  { title: "Сопровождение", desc: "Помогаем перейти к заявке или консультации." },
];

const REQUIREMENTS = [
  { title: "Паспорт", icon: FileText },
  { title: "Цель переезда", icon: Target },
  { title: "Текущая страна проживания", icon: MapPin },
  { title: "Состав семьи", icon: Users },
  { title: "Бюджет", icon: Wallet },
  { title: "Планируемые сроки", icon: ListChecks },
  { title: "Бизнес-активность или источник средств", icon: Briefcase },
  { title: "Документы по недвижимости (если применимо)", icon: Home },
];

const RISKS = [
  "Мы не обещаем гарантированное одобрение",
  "Стоимость зависит от маршрута и состава семьи",
  "Банковский счёт требует compliance-проверки",
  "Сроки зависят от документов и процедур",
  "Покупка недвижимости не всегда автоматически означает долгосрочную визу",
  "Условия программ могут меняться",
];

const TOOLS: CardLink[] = [
  { title: "Проверка вариантов", desc: "Ответьте на несколько вопросов и получите предварительное направление.", href: ELIGIBILITY, icon: Target },
  { title: "Расчёт стоимости", desc: "Оцените примерный бюджет по стране, семье и услуге.", href: COST, icon: Calculator },
  { title: "Список документов", desc: "Получите предварительный checklist под ваш маршрут.", href: DOCS, icon: ClipboardList },
];

const FAQS = [
  { q: "Можно ли получить резидентство в ОАЭ через компанию?", a: "Да, регистрация компании в свободной зоне или на материке — один из распространённых маршрутов к резидентской визе. Конкретные условия зависят от типа лицензии, структуры компании и требований выбранного органа." },
  { q: "Что лучше: открыть компанию или купить недвижимость?", a: "Это зависит от цели. Компания подходит, когда основной приоритет — бизнес и операционная структура; недвижимость — когда важны инвестиция и возможная связь с резидентством. Часто оптимальным становится комбинированный сценарий." },
  { q: "Можно ли получить Golden Visa через недвижимость?", a: "В ряде случаев — да, при соответствии актуальным порогам стоимости и требованиям к объекту. Условия программы могут меняться, поэтому нужна индивидуальная оценка кейса." },
  { q: "Можно ли перевезти семью в ОАЭ?", a: "Да, основной заявитель, как правило, может включить супругу/супруга и детей в семейную визу. Точный список dependents и документы зависят от выбранного маршрута и спонсора." },
  { q: "Можно ли открыть банковский счёт после регистрации компании?", a: "Открытие счёта возможно, но проходит отдельную compliance-проверку банка. Сроки и решение зависят от профиля бенефициара и деятельности компании." },
  { q: "Сколько времени занимает процесс?", a: "Сроки зависят от маршрута, готовности документов и государственных процедур. Часть шагов начинается параллельно, итоговый таймлайн формируется после оценки кейса." },
  { q: "Можно ли начать процесс удалённо?", a: "Многие шаги — оценка, подбор маршрута и подготовка документов — можно начать удалённо. Биометрия и открытие счёта обычно требуют личного присутствия в ОАЭ." },
  { q: "Какие документы нужны для первичной оценки?", a: "Достаточно общей информации о цели, бюджете, стране, составе семьи и гражданстве. Полный список документов формируется после выбора маршрута." },
  { q: "Что Residency24 не гарантирует?", a: "Мы не гарантируем одобрение со стороны государственных органов и не обещаем точные сроки или 100% результат. Наша работа — подбор маршрута и сопровождение подготовки документов." },
];

const GUIDES = [
  { title: "Как открыть компанию в ОАЭ русскоязычному предпринимателю?", desc: "Free zone vs mainland и подготовка к банку.", href: BLOG },
  { title: "ОАЭ или Оман: что выбрать для релокации?", desc: "Сравнение направлений по бизнесу, семье и стоимости.", href: BLOG },
  { title: "Недвижимость в Дубае и резидентство", desc: "Что важно знать перед покупкой объекта.", href: BLOG },
  { title: "Golden Visa ОАЭ: кому подходит?", desc: "Категории заявителей и ключевые требования.", href: BLOG },
  { title: "Банковский счёт в ОАЭ", desc: "Какие документы могут понадобиться и как готовиться.", href: BLOG },
];

function CardGrid({ items, cols = 3 }: { items: CardLink[]; cols?: 2 | 3 }) {
  const colClass = cols === 2 ? "md:grid-cols-2" : "md:grid-cols-2 lg:grid-cols-3";
  return (
    <div className={`grid grid-cols-1 ${colClass} gap-5`}>
      {items.map((c) => {
        const Icon = c.icon;
        return (
          <a
            key={c.title}
            href={c.href}
            className="group relative rounded-2xl border border-border bg-white p-6 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all"
          >
            {c.badge && (
              <span className="absolute top-4 right-4 bg-gold text-navy text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded-full">
                {c.badge}
              </span>
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
      <button
        onClick={() => onToggle(idx)}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-surface transition-colors"
      >
        <span className="font-semibold text-navy text-sm md:text-base">{q}</span>
        <ChevronDown className={`w-5 h-5 text-navy transition-transform shrink-0 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed">{a}</div>}
    </div>
  );
}

export default function RuUaeHubClient({ h1 }: { h1: string }) {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [form, setForm] = useState({ name: "", phone: "", goal: "", budget: "", family: "", message: "" });
  const [sent, setSent] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone) return;
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("event", "lead_form_submit", { service: "ru_uae_hub" });
    }
    setSent(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <SharedBreadcrumb items={[{ label: "ОАЭ" }]} />

      {/* HERO */}
      <section className="relative overflow-hidden bg-navy text-white">
        <div
          className="absolute inset-0 opacity-[0.18] pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, hsl(var(--gold)) 0, transparent 35%), radial-gradient(circle at 80% 60%, hsl(var(--navy-lt)) 0, transparent 45%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.06] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(hsl(var(--gold)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--gold)) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        <div className="relative max-w-7xl mx-auto px-4 py-14 md:py-20">
          <div className="grid lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 bg-white/10 border border-gold/30 rounded-full px-3 py-1 text-xs text-gold-lt mb-5">
                <MapPin className="w-3.5 h-3.5" /> 🇦🇪 ОАЭ · Дубай · Абу-Даби
              </div>
              <h1 className="text-3xl md:text-5xl font-bold leading-tight">{h1}</h1>
              <p className="mt-5 text-base md:text-lg text-white/80 max-w-2xl">
                Подберите подходящий путь в ОАЭ: открытие компании, покупка недвижимости, Golden Visa, резидентская виза, семейная релокация или банковское сопровождение.
              </p>

              <ul className="mt-6 grid sm:grid-cols-2 gap-2 max-w-xl">
                {[
                  "Поддержка на русском языке",
                  "Компания, недвижимость, визы и резидентство",
                  "Оценка маршрута до начала процесса",
                  "Прозрачные условия без ложных гарантий",
                ].map((b) => (
                  <li key={b} className="flex items-start gap-2 text-sm text-white/90">
                    <Check className="w-4 h-4 text-gold mt-0.5 shrink-0" /> {b}
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <a href={ELIGIBILITY} className="inline-flex items-center justify-center gap-2 bg-gold text-navy font-semibold px-6 py-3 rounded-xl hover:bg-gold-dk transition-colors min-h-[48px]">
                  Проверить мои варианты <ArrowRight className="w-4 h-4" />
                </a>
                <a href={COST} className="inline-flex items-center justify-center gap-2 bg-white/10 border border-white/20 text-white font-medium px-6 py-3 rounded-xl hover:bg-white/15 transition-colors min-h-[48px]">
                  <Calculator className="w-4 h-4" /> Рассчитать стоимость
                </a>
                <a href={WA} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 bg-whatsapp text-white font-medium px-6 py-3 rounded-xl hover:opacity-90 transition-opacity min-h-[48px]">
                  <MessageCircle className="w-4 h-4" /> Написать в WhatsApp
                </a>
              </div>
            </div>

            <div className="lg:col-span-5 relative">
              <div className="relative aspect-[5/6] max-w-md mx-auto">
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-navy-lt to-navy border border-gold/30 shadow-2xl" />
                <div className="absolute inset-4 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-sm overflow-hidden">
                  {/* Stylized Dubai skyline silhouette */}
                  <svg viewBox="0 0 400 480" className="w-full h-full opacity-90">
                    <defs>
                      <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0" stopColor="hsl(var(--navy-lt))" />
                        <stop offset="1" stopColor="hsl(var(--navy))" />
                      </linearGradient>
                      <linearGradient id="bld" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0" stopColor="hsl(var(--gold))" stopOpacity="0.85" />
                        <stop offset="1" stopColor="hsl(var(--gold-dk))" stopOpacity="0.4" />
                      </linearGradient>
                    </defs>
                    <rect width="400" height="480" fill="url(#sky)" />
                    <circle cx="320" cy="100" r="36" fill="hsl(var(--gold))" opacity="0.25" />
                    {/* Burj-like tower */}
                    <polygon points="200,80 210,420 190,420" fill="url(#bld)" opacity="0.9" />
                    <polygon points="200,80 205,180 215,420 195,420" fill="url(#bld)" opacity="0.6" />
                    {/* Buildings */}
                    {[
                      [40, 260, 50, 160],
                      [100, 220, 60, 200],
                      [170, 300, 30, 120],
                      [240, 230, 70, 190],
                      [320, 270, 50, 150],
                    ].map(([x, y, w, h], i) => (
                      <rect key={i} x={x} y={y} width={w} height={h} fill="hsl(var(--gold))" opacity={0.18 + i * 0.05} />
                    ))}
                    <rect x="0" y="420" width="400" height="60" fill="hsl(var(--navy))" opacity="0.6" />
                  </svg>
                </div>
                {HERO_FLOATING.map((f, i) => {
                  const Icon = f.icon;
                  const positions = [
                    "top-2 -left-3 sm:-left-10",
                    "top-1/4 -right-3 sm:-right-10",
                    "top-1/2 -left-5 sm:-left-14",
                    "top-1/3 -right-2 sm:-right-6",
                    "bottom-1/4 -left-2 sm:-left-8",
                    "bottom-4 left-1/2 -translate-x-1/2",
                  ];
                  return (
                    <div key={f.title} className={`absolute ${positions[i]} bg-white text-navy rounded-xl shadow-xl px-3 py-2 flex items-center gap-2 text-xs font-semibold`}>
                      <Icon className="w-4 h-4 text-gold-dk" />
                      {f.title}
                    </div>
                  );
                })}
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
                  <span className="w-9 h-9 rounded-lg bg-gold-lt text-navy flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4" />
                  </span>
                  <span className="font-medium">{t.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* PATHWAYS */}
      <section className="py-16 md:py-20 bg-surface">
        <div className="max-w-7xl mx-auto px-4">
          <SectionHead eyebrow="Маршруты" title="Выберите путь в ОАЭ" subtitle="Разные цели требуют разных маршрутов. Начните с того, что для вас важнее." />
          <CardGrid items={PATHWAYS} />
          <div className="mt-8 text-center">
            <a href={ELIGIBILITY} className="inline-flex items-center gap-2 bg-navy text-white font-semibold px-6 py-3 rounded-xl hover:bg-navy-lt transition-colors">
              Не знаете, что выбрать? Проверить мои варианты <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* WHY UAE */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <SectionHead eyebrow="Почему ОАЭ" title="Почему ОАЭ выбирают для релокации и бизнеса" subtitle="ОАЭ часто рассматривают не только как страну для визы, а как платформу для бизнеса, семьи, инвестиций и международной структуры." />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {WHY_UAE.map((w) => {
              const Icon = w.icon;
              return (
                <div key={w.title} className="rounded-2xl border border-border p-6 hover:border-gold transition-colors bg-white">
                  <div className="w-11 h-11 rounded-xl bg-navy text-gold flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="font-semibold text-navy">{w.title}</div>
                  <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{w.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="py-16 md:py-20 bg-surface">
        <div className="max-w-7xl mx-auto px-4">
          <SectionHead eyebrow="Услуги" title="Услуги Residency24 по ОАЭ" subtitle="Выберите услугу или начните с предварительной оценки, если не уверены в маршруте." />
          <CardGrid items={SERVICES} />
        </div>
      </section>

      {/* ROUTE COMPARISON */}
      <section className="py-16 md:py-20 bg-navy text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gold mb-3">
              <GitCompare className="w-3.5 h-3.5" /> Подбор маршрута
            </div>
            <h2 className="text-2xl md:text-4xl font-bold leading-tight">Какой путь в ОАЭ подходит вам?</h2>
            <p className="text-white/75 mt-3 text-base md:text-lg">
              Сравните основные маршруты по цели, бюджету, семье и сложности подготовки.
            </p>
          </div>

          <div className="hidden md:block rounded-2xl overflow-hidden border border-white/10 bg-white/[0.04]">
            <div className="grid grid-cols-12 bg-white/10 text-sm font-semibold">
              <div className="col-span-2 px-5 py-4">Маршрут</div>
              <div className="col-span-3 px-5 py-4">Best for</div>
              <div className="col-span-3 px-5 py-4">Цель</div>
              <div className="col-span-2 px-5 py-4">Сложность</div>
              <div className="col-span-2 px-5 py-4">Следующий шаг</div>
            </div>
            {ROUTE_COMPARE.map((r, i) => {
              const Icon = r.icon;
              return (
                <a key={r.route} href={r.href} className={`grid grid-cols-12 text-sm hover:bg-white/[0.06] transition-colors ${i % 2 === 0 ? "bg-white/[0.02]" : ""}`}>
                  <div className="col-span-2 px-5 py-4 font-semibold text-gold-lt border-t border-white/10 flex items-center gap-2">
                    <Icon className="w-4 h-4 text-gold" /> {r.route}
                  </div>
                  <div className="col-span-3 px-5 py-4 text-white/85 border-t border-white/10">{r.best}</div>
                  <div className="col-span-3 px-5 py-4 text-white/85 border-t border-white/10">{r.goal}</div>
                  <div className="col-span-2 px-5 py-4 text-white/85 border-t border-white/10">{r.complexity}</div>
                  <div className="col-span-2 px-5 py-4 text-gold border-t border-white/10 inline-flex items-center gap-1">
                    {r.next} <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </a>
              );
            })}
          </div>

          <div className="md:hidden space-y-3">
            {ROUTE_COMPARE.map((r) => {
              const Icon = r.icon;
              return (
                <a key={r.route} href={r.href} className="block rounded-xl border border-white/10 bg-white/[0.04] p-4 hover:bg-white/[0.08] transition-colors">
                  <div className="flex items-center gap-2 text-gold font-semibold">
                    <Icon className="w-4 h-4" /> {r.route}
                  </div>
                  <div className="text-sm text-white/85 mt-2"><span className="text-gold-lt">Best for:</span> {r.best}</div>
                  <div className="text-sm text-white/85 mt-1"><span className="text-gold-lt">Цель:</span> {r.goal}</div>
                  <div className="text-sm text-white/85 mt-1"><span className="text-gold-lt">Сложность:</span> {r.complexity}</div>
                  <div className="text-sm text-gold mt-2 inline-flex items-center gap-1">{r.next} <ArrowRight className="w-3.5 h-3.5" /></div>
                </a>
              );
            })}
          </div>

          <div className="mt-8 text-center flex flex-col sm:flex-row gap-3 justify-center">
            <a href={ELIGIBILITY} className="inline-flex items-center justify-center gap-2 bg-gold text-navy font-semibold px-6 py-3 rounded-xl hover:bg-gold-dk transition-colors">
              Проверить, какой маршрут подходит мне <ArrowRight className="w-4 h-4" />
            </a>
            <a href={COMPARE_COMPANY_PROPERTY} className="inline-flex items-center justify-center gap-2 bg-white/10 border border-white/20 text-white font-medium px-6 py-3 rounded-xl hover:bg-white/15 transition-colors">
              Компания vs недвижимость
            </a>
          </div>
        </div>
      </section>

      {/* COST SNAPSHOT */}
      <section className="py-16 md:py-20 bg-surface">
        <div className="max-w-7xl mx-auto px-4">
          <SectionHead eyebrow="Стоимость" title="Ориентировочная стоимость популярных маршрутов" subtitle="Стоимость зависит от маршрута, состава семьи, документов, юрисдикции и требований соответствующих органов." />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {COST_SNAPSHOT.map((c) => {
              const Icon = c.icon;
              return (
                <div key={c.title} className="rounded-2xl bg-white border border-border p-6 flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-gold-lt text-navy flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-semibold text-navy">{c.title}</div>
                    <div className="text-sm text-muted-foreground mt-1">{c.note}</div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-8 text-center">
            <a href={COST} className="inline-flex items-center gap-2 bg-navy text-white font-semibold px-6 py-3 rounded-xl hover:bg-navy-lt transition-colors">
              <Calculator className="w-4 h-4" /> Рассчитать стоимость
            </a>
          </div>
        </div>
      </section>

      {/* COMPANY + BANKING */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-5">
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gold-dk mb-3">
                <Briefcase className="w-3.5 h-3.5" /> Бизнес
              </div>
              <h2 className="text-2xl md:text-4xl font-bold text-navy leading-tight">Компания, банковский счёт и compliance в ОАЭ</h2>
              <p className="text-muted-foreground mt-4">
                Для многих русскоязычных клиентов путь в ОАЭ начинается с бизнеса, но успешная структура требует не только регистрации компании.
              </p>
              <p className="text-sm text-muted-foreground mt-3">
                Мы помогаем подобрать юрисдикцию, лицензию и резидентский маршрут так, чтобы компания и банковский счёт работали как единая структура с учётом compliance.
              </p>
              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <a href={CONTACT} className="inline-flex items-center justify-center gap-2 bg-navy text-white font-semibold px-6 py-3 rounded-xl hover:bg-navy-lt transition-colors">
                  Обсудить бизнес-задачу <ArrowRight className="w-4 h-4" />
                </a>
                <a href={UAE_REGISTER} className="inline-flex items-center justify-center gap-2 bg-gold-lt text-navy font-semibold px-6 py-3 rounded-xl hover:bg-gold transition-colors">
                  Открытие компании
                </a>
              </div>
            </div>
            <div className="lg:col-span-7">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {COMPANY_CHECKLIST.map((c, i) => {
                  const Icon = c.icon;
                  return (
                    <div key={c.title} className="rounded-2xl border border-border bg-surface p-5 flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-navy text-gold flex items-center justify-center shrink-0">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-[11px] uppercase tracking-wider text-gold-dk font-semibold">Шаг {i + 1}</div>
                        <div className="font-semibold text-navy text-sm mt-0.5">{c.title}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROPERTY + GOLDEN VISA */}
      <section className="py-16 md:py-20 bg-gradient-to-b from-surface to-gold-lt/40">
        <div className="max-w-7xl mx-auto px-4">
          <SectionHead eyebrow="Недвижимость" title="Недвижимость и Golden Visa в ОАЭ" subtitle="Покупка недвижимости может быть частью стратегии резидентства и инвестиций, но требования зависят от суммы, объекта и актуальных правил программы." />
          <CardGrid items={PROPERTY_GV} cols={2} />
          <div className="mt-8 max-w-3xl mx-auto rounded-xl border border-gold/40 bg-white px-5 py-4 text-sm text-ink/80 flex items-start gap-3">
            <AlertTriangle className="w-4 h-4 text-gold-dk mt-0.5 shrink-0" />
            <span>Требования к визам и порогам инвестиций могут меняться. Перед началом необходимо проверить актуальные условия.</span>
          </div>
          <div className="mt-8 text-center">
            <a href={UAE_PROPERTY} className="inline-flex items-center gap-2 bg-navy text-white font-semibold px-6 py-3 rounded-xl hover:bg-navy-lt transition-colors">
              Оценить сценарий с недвижимостью <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* FAMILY */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <SectionHead eyebrow="Семья" title="Релокация семьи в ОАЭ" subtitle="Если вы планируете переезд с семьёй, важно заранее оценить визы, документы, сроки, расходы и зависимость членов семьи от основного заявителя." />
          <CardGrid items={FAMILY_CARDS} />
          <div className="mt-8 text-center">
            <a href={ELIGIBILITY} className="inline-flex items-center gap-2 bg-navy text-white font-semibold px-6 py-3 rounded-xl hover:bg-navy-lt transition-colors">
              Проверить семейный сценарий <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* PROCESS TIMELINE */}
      <section className="py-16 md:py-20 bg-surface">
        <div className="max-w-7xl mx-auto px-4">
          <SectionHead eyebrow="Процесс" title="Как проходит работа" subtitle="Процесс зависит от выбранного маршрута, но обычно начинается с оценки цели, бюджета и документов." />
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {PROCESS.map((p, i) => (
              <div key={p.title} className="relative rounded-2xl bg-white border border-border p-5">
                <div className="w-9 h-9 rounded-full bg-navy text-gold flex items-center justify-center font-bold text-sm">{i + 1}</div>
                <div className="mt-3 font-semibold text-navy">{p.title}</div>
                <div className="text-sm text-muted-foreground mt-1">{p.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* REQUIREMENTS */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <SectionHead eyebrow="Документы" title="Что может понадобиться для первичной оценки" subtitle="Точный список зависит от выбранного маршрута, но для первичной оценки обычно нужны базовые данные." />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {REQUIREMENTS.map((r) => {
              const Icon = r.icon;
              return (
                <div key={r.title} className="rounded-xl border border-border bg-surface p-4 flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-navy text-gold flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="font-medium text-navy text-sm">{r.title}</div>
                </div>
              );
            })}
          </div>
          <div className="mt-8 text-center">
            <a href={DOCS} className="inline-flex items-center gap-2 bg-navy text-white font-semibold px-6 py-3 rounded-xl hover:bg-navy-lt transition-colors">
              <ClipboardList className="w-4 h-4" /> Получить список документов
            </a>
          </div>
        </div>
      </section>

      {/* RISKS */}
      <section className="py-16 md:py-20 bg-surface">
        <div className="max-w-5xl mx-auto px-4">
          <SectionHead eyebrow="Прозрачность" title="Что важно знать до начала" subtitle="Мы заранее объясняем ограничения, чтобы пользователь принимал решение без ложных ожиданий." />
          <div className="rounded-2xl border border-gold/40 bg-gold-lt/40 p-6 md:p-10">
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl bg-gold text-navy flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <ul className="space-y-2.5">
                  {RISKS.map((r) => (
                    <li key={r} className="flex items-start gap-2 text-sm text-ink">
                      <Check className="w-4 h-4 text-navy mt-0.5 shrink-0" /> {r}
                    </li>
                  ))}
                </ul>
                <p className="mt-5 text-xs text-ink/70 italic">
                  Информация на странице носит общий характер. Условия, стоимость, сроки и результат зависят от профиля заявителя и решения соответствующих органов.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TOOLS */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <SectionHead eyebrow="Инструменты" title="Инструменты для выбора маршрута" subtitle="Используйте инструменты Residency24, чтобы оценить варианты и подготовить документы заранее." />
          <CardGrid items={TOOLS} />
          <div className="mt-8 text-center">
            <a href={COMPARE_UAE_OMAN} className="inline-flex items-center gap-2 text-navy font-semibold hover:underline">
              <GitCompare className="w-4 h-4" /> Сравнить ОАЭ и Оман
            </a>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 md:py-20 bg-surface">
        <div className="max-w-3xl mx-auto px-4">
          <SectionHead eyebrow="FAQ" title="Частые вопросы об ОАЭ" subtitle="Коротко о главном — без обещаний и громких слов." />
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
          <SectionHead eyebrow="Блог" title="Полезные материалы об ОАЭ" subtitle="Гайды и разборы для русскоязычных клиентов." />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {GUIDES.map((g) => (
              <a key={g.title} href={g.href} className="group rounded-2xl border border-border bg-white overflow-hidden hover:shadow-lg transition-shadow flex flex-col">
                <div className="h-32 bg-gradient-to-br from-navy to-navy-lt flex items-center justify-center text-gold">
                  <BookOpen className="w-10 h-10" />
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <div className="font-semibold text-navy">{g.title}</div>
                  <p className="text-sm text-muted-foreground mt-1 flex-1">{g.desc}</p>
                  <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-navy group-hover:text-gold-dk transition-colors">
                    Читать <ArrowRight className="w-4 h-4" />
                  </span>
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

      {/* LEAD FORM */}
      <section id="consultation-form" className="py-16 md:py-24 bg-navy text-white">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gold mb-3">
              <Sparkles className="w-3.5 h-3.5" /> Бесплатная оценка
            </div>
            <h2 className="text-2xl md:text-4xl font-bold">Начните с оценки вашего маршрута в ОАЭ</h2>
            <p className="text-white/80 mt-3 text-base md:text-lg">
              Расскажите нам о вашей цели, бюджете, составе семьи и сроках — мы подскажем, какие варианты стоит рассмотреть.
            </p>
          </div>

          <div className="rounded-3xl bg-white/[0.04] border border-white/10 p-6 md:p-10 backdrop-blur-sm">
            {sent ? (
              <div className="text-center py-8">
                <div className="w-14 h-14 mx-auto rounded-full bg-green-500/20 text-green-400 flex items-center justify-center mb-4">
                  <Check className="w-7 h-7" />
                </div>
                <div className="text-lg font-semibold">Спасибо! Мы свяжемся с вами в ближайшее время.</div>
                <p className="text-white/70 mt-2 text-sm">Пока ждёте — напишите нам в WhatsApp для быстрого ответа.</p>
                <a href={WA} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex items-center gap-2 bg-whatsapp text-white font-semibold px-6 py-3 rounded-xl hover:opacity-90 transition-opacity">
                  <MessageCircle className="w-4 h-4" /> Написать в WhatsApp
                </a>
              </div>
            ) : (
              <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input required type="text" placeholder="Имя" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="bg-white/10 border border-gold/30 text-white placeholder:text-white/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold transition-colors min-h-[48px]" />
                <input required type="tel" placeholder="Телефон / WhatsApp" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="bg-white/10 border border-gold/30 text-white placeholder:text-white/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold transition-colors min-h-[48px]" />
                <select value={form.goal} onChange={(e) => setForm({ ...form, goal: e.target.value })} className="bg-white/10 border border-gold/30 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold transition-colors min-h-[48px]">
                  <option value="" className="text-navy">Цель</option>
                  <option className="text-navy">Открыть компанию</option>
                  <option className="text-navy">Резидентская виза</option>
                  <option className="text-navy">Недвижимость</option>
                  <option className="text-navy">Golden Visa</option>
                  <option className="text-navy">Семейная релокация</option>
                  <option className="text-navy">Туристическая виза</option>
                  <option className="text-navy">Банковский счёт</option>
                </select>
                <select value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })} className="bg-white/10 border border-gold/30 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold transition-colors min-h-[48px]">
                  <option value="" className="text-navy">Бюджет</option>
                  <option className="text-navy">До 25 000 USD</option>
                  <option className="text-navy">25 000 – 100 000 USD</option>
                  <option className="text-navy">100 000 – 500 000 USD</option>
                  <option className="text-navy">Свыше 500 000 USD</option>
                  <option className="text-navy">Ещё не определён</option>
                </select>
                <select value={form.family} onChange={(e) => setForm({ ...form, family: e.target.value })} className="md:col-span-2 bg-white/10 border border-gold/30 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold transition-colors min-h-[48px]">
                  <option value="" className="text-navy">Состав семьи</option>
                  <option className="text-navy">Я один(а)</option>
                  <option className="text-navy">Супруг(а)</option>
                  <option className="text-navy">Супруг(а) + дети</option>
                  <option className="text-navy">Расширенная семья</option>
                </select>
                <textarea placeholder="Сообщение (необязательно)" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} rows={3} className="md:col-span-2 bg-white/10 border border-gold/30 text-white placeholder:text-white/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold transition-colors" />

                <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button type="submit" className="bg-gold text-navy font-bold px-6 py-3 rounded-xl hover:bg-gold-dk transition-colors min-h-[48px]">
                    Получить консультацию
                  </button>
                  <a href={WA} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 bg-whatsapp text-white font-semibold px-6 py-3 rounded-xl hover:opacity-90 transition-opacity min-h-[48px]">
                    <MessageCircle className="w-4 h-4" /> Написать в WhatsApp
                  </a>
                  <a href={COST} className="inline-flex items-center justify-center gap-2 bg-white/10 border border-white/20 text-white font-medium px-6 py-3 rounded-xl hover:bg-white/15 transition-colors min-h-[48px]">
                    <Calculator className="w-4 h-4" /> Рассчитать стоимость
                  </a>
                </div>
                <p className="md:col-span-2 text-xs text-white/60 mt-1">
                  Мы используем данные только для предварительной оценки вашего кейса. Условия программ могут меняться, итоговый результат зависит от решения соответствующих органов.
                </p>
              </form>
            )}
          </div>

          <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            <a href="/ru/" className="text-white/70 hover:text-gold transition-colors inline-flex items-center gap-1"><Phone className="w-3.5 h-3.5" /> Главная</a>
            <a href={CONTACT} className="text-white/70 hover:text-gold transition-colors inline-flex items-center gap-1"><MessageCircle className="w-3.5 h-3.5" /> Контакты</a>
            <a href="/ru/oman/" className="text-white/70 hover:text-gold transition-colors inline-flex items-center gap-1"><Globe2 className="w-3.5 h-3.5" /> Оман</a>
            <a href={BLOG} className="text-white/70 hover:text-gold transition-colors inline-flex items-center gap-1"><BookOpen className="w-3.5 h-3.5" /> Блог</a>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
