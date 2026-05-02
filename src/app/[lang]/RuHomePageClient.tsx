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
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";

const WA = "https://wa.me/971562009131?text=Здравствуйте,+нужна+консультация";

const ELIGIBILITY = "/ru/tools/visa-eligibility-checker/";
const COST = "/ru/tools/cost-calculator/";
const DOCS = "/ru/tools/document-checklist-generator/";
const COMPARE_UAE_OMAN = "/ru/compare/uae-vs-oman/";
const CONTACT = "/ru/contact/";
const BLOG = "/ru/blog/";

type CardLink = { title: string; desc: string; href: string; icon: any; badge?: string };

const HERO_FLOATING = [
  { title: "Компания в ОАЭ", icon: Building2 },
  { title: "Недвижимость в Дубае", icon: Home },
  { title: "Golden Visa", icon: Trophy },
  { title: "Семейная релокация", icon: Heart },
  { title: "Банковский счёт", icon: CreditCard },
];

const TRUST_BAR = [
  { label: "4 языка", icon: Languages },
  { label: "ОАЭ и Оман", icon: Globe2 },
  { label: "Компания + резидентство", icon: Briefcase },
  { label: "Недвижимость + Golden Visa", icon: Trophy },
  { label: "Поддержка семьи", icon: Heart },
];

const QUICK_ROUTES: CardLink[] = [
  { title: "Открыть компанию", desc: "Регистрация в ОАЭ или Омане — структура, лицензия, сопровождение.", href: "/ru/uae/register-company/", icon: Building2 },
  { title: "Получить резидентство", desc: "Резидентская виза через компанию, инвестиции или другие маршруты.", href: "/ru/uae/residency/", icon: ScrollText },
  { title: "Купить недвижимость", desc: "Объекты в Дубае и Омане — для жизни, аренды или резидентства.", href: "/ru/uae/property-purchase/", icon: Home },
  { title: "Перевезти семью", desc: "Семейные визы для супруги/супруга и детей с подготовкой документов.", href: "/ru/uae/family-visa/", icon: Users },
  { title: "Открыть банковский счёт", desc: "Корпоративный счёт после оценки compliance.", href: CONTACT, icon: CreditCard },
  { title: "Сравнить страны", desc: "ОАЭ или Оман — что подходит вам по бизнесу, бюджету и семье.", href: COMPARE_UAE_OMAN, icon: GitCompare },
];

const UAE_SERVICES: CardLink[] = [
  { title: "Открытие компании в ОАЭ", desc: "Free zone или mainland — подбор структуры под цель.", href: "/ru/uae/register-company/", icon: Building2 },
  { title: "Резидентская виза ОАЭ", desc: "Маршруты через компанию, работу или инвестиции.", href: "/ru/uae/residency/", icon: ScrollText },
  { title: "Недвижимость в Дубае", desc: "Готовые и off-plan объекты с прозрачным сопровождением.", href: "/ru/uae/property-purchase/", icon: Home },
  { title: "Golden Visa ОАЭ", desc: "Долгосрочная виза для инвесторов и предпринимателей.", href: "/ru/uae/golden-visa/", icon: Trophy, badge: "Популярно" },
  { title: "Туристическая виза ОАЭ", desc: "Для бизнес-визитов и подготовки к релокации.", href: "/ru/uae/tourist-visa/", icon: Plane },
  { title: "Семейная виза ОАЭ", desc: "Резидентство для супруги/супруга и детей.", href: "/ru/uae/family-visa/", icon: Users },
];

const OMAN_SERVICES: CardLink[] = [
  { title: "Открытие компании в Омане", desc: "Подбор формы и юрисдикции под бизнес-задачу.", href: "/ru/oman/register-company/", icon: Building2 },
  { title: "Резидентство в Омане", desc: "Маршруты для предпринимателей и инвесторов.", href: "/ru/oman/residency/", icon: ScrollText },
  { title: "Недвижимость в Омане", desc: "Объекты в зонах, открытых для иностранцев.", href: "/ru/oman/property-purchase/", icon: Home },
  { title: "Инвесторская виза", desc: "Для долгосрочной региональной структуры.", href: "/ru/oman/investor-visa/", icon: Landmark },
];

const COMPARE_ROWS = [
  { criterion: "Бизнес", uae: "Развитая экосистема, free zones, быстрый старт", oman: "Спокойный рынок, региональная структура, GCC-доступ" },
  { criterion: "Недвижимость", uae: "Дубай: широкий выбор, ликвидность, аренда", oman: "Маскат и побережье: спокойные локации, разумные цены" },
  { criterion: "Семейная релокация", uae: "Развитая инфраструктура для семей и школ", oman: "Безопасная среда, более размеренный ритм" },
  { criterion: "Банковская система", uae: "Множество банков, требует compliance-подготовки", oman: "Локальная система, подходит под местный бизнес" },
  { criterion: "Стоимость", uae: "Зависит от free zone, лицензии и кейса", oman: "Часто более доступный старт по компании" },
  { criterion: "Подходит для", uae: "Бизнес, инвестиции, Golden Visa, недвижимость", oman: "Региональная релокация, инвесторы, спокойная база" },
];

const COST_SNAPSHOT = [
  { title: "Компания в ОАЭ", note: "После оценки кейса", icon: Building2 },
  { title: "Резидентская виза ОАЭ", note: "Зависит от маршрута", icon: ScrollText },
  { title: "Недвижимость в Дубае", note: "Зависит от объекта и цели", icon: Home },
  { title: "Golden Visa ОАЭ", note: "По требованиям программы", icon: Trophy },
  { title: "Компания в Омане", note: "После оценки кейса", icon: Briefcase },
  { title: "Семейная релокация", note: "Зависит от состава семьи", icon: Users },
];

const ELIG_STEPS = [
  { label: "Цель", icon: Target },
  { label: "Бюджет", icon: Wallet },
  { label: "Страна", icon: Globe2 },
  { label: "Семья", icon: Users },
  { label: "Контакт", icon: Phone },
];

const PROCESS = [
  { title: "Анализ цели", desc: "Понимаем, зачем вам резидентство или компания." },
  { title: "Подбор страны", desc: "Сравниваем ОАЭ, Оман и другие варианты." },
  { title: "Оценка стоимости", desc: "Ориентировочные расходы с учётом кейса." },
  { title: "Подготовка документов", desc: "Сопровождаем сбор и оформление." },
  { title: "Следующий шаг", desc: "Подача, поездка или открытие счёта." },
];

const BUSINESS_CARDS: CardLink[] = [
  { title: "Открытие компании", desc: "Free zone, mainland или offshore — под задачу.", href: "/ru/uae/register-company/", icon: Building2 },
  { title: "Корпоративный банковский счёт", desc: "Подготовка к compliance-проверке банка.", href: CONTACT, icon: CreditCard },
  { title: "Business visa", desc: "Виза предпринимателя и инвестора.", href: "/ru/uae/residency/", icon: Briefcase },
  { title: "Tax residency guidance", desc: "Ориентир по налоговому резидентству.", href: CONTACT, icon: Landmark },
  { title: "Подготовка документов", desc: "Чек-лист и сопровождение по этапам.", href: DOCS, icon: FileText },
  { title: "Compliance notes", desc: "Что важно знать о KYC и проверках.", href: CONTACT, icon: ShieldCheck },
];

const FAMILY_CARDS: CardLink[] = [
  { title: "Семейная виза", desc: "Резидентство для супруги/супруга и детей.", href: "/ru/uae/family-visa/", icon: Heart },
  { title: "Документы для dependents", desc: "Свидетельства, переводы, апостили.", href: DOCS, icon: FileText },
  { title: "Стоимость по составу семьи", desc: "Расчёт под количество членов семьи.", href: COST, icon: Calculator },
  { title: "Сроки и этапы", desc: "Что и когда оформляется.", href: ELIGIBILITY, icon: ListChecks },
];

const WHY_US = [
  { title: "Поддержка на русском языке", desc: "Менеджеры, документы и переписка — без языкового барьера.", icon: Languages },
  { title: "ОАЭ и Оман в одном сравнении", desc: "Помогаем выбрать страну под цель, а не продаём одну.", icon: GitCompare },
  { title: "Прозрачная оценка", desc: "Объясняем стоимость, сроки и риски заранее.", icon: ShieldCheck },
  { title: "Без ложных гарантий", desc: "Не обещаем 100% одобрение — даём честный прогноз.", icon: Check },
  { title: "Удобные инструменты", desc: "Калькулятор стоимости, чек-листы и подбор маршрута.", icon: Calculator },
  { title: "Мультиязычная платформа", desc: "RU, EN, FA, AR — единый стандарт сопровождения.", icon: Globe2 },
];

const RISKS = [
  "Мы не обещаем гарантированное одобрение",
  "Стоимость может меняться в зависимости от кейса",
  "Сроки зависят от документов и государственных процедур",
  "Банковский счёт требует отдельной проверки compliance",
  "Недвижимость не всегда автоматически означает долгосрочную визу",
];

const CASES = [
  { tag: "Предприниматель", title: "Компания в ОАЭ", desc: "Подбор free zone и структура под IT-сервисы.", icon: Briefcase },
  { tag: "Семья", title: "Релокация в Дубай", desc: "Резидентство для супругов и двух детей со школой рядом.", icon: Heart },
  { tag: "Инвестор", title: "Недвижимость и резидентство", desc: "Объект в Дубае с маршрутом к инвесторской визе.", icon: Home },
  { tag: "Бизнес-владелец", title: "Оман / региональная структура", desc: "Местная компания и счёт под GCC-операции.", icon: Landmark },
];

const FAQS = [
  { q: "Можно ли получить резидентство в ОАЭ через компанию?", a: "Да, регистрация компании в свободной зоне или на материке — один из распространённых маршрутов к резидентской визе. Конкретные условия зависят от типа лицензии и требований органа." },
  { q: "Что лучше для русскоязычных клиентов: ОАЭ или Оман?", a: "ОАЭ чаще подходят для бизнеса, недвижимости и Golden Visa, Оман — для спокойной региональной релокации и инвестиционной резиденции. Финальный выбор зависит от цели, бюджета и семьи." },
  { q: "Можно ли открыть банковский счёт после регистрации компании?", a: "Открытие счёта возможно, но проходит отдельную compliance-проверку банка. Сроки и решение зависят от профиля бенефициара и деятельности компании." },
  { q: "Можно ли перевезти семью?", a: "Да, основной заявитель, как правило, может включить супругу/супруга и детей в семейную визу. Список dependents и документы зависят от маршрута и страны." },
  { q: "Даёт ли покупка недвижимости право на резидентство?", a: "В ОАЭ покупка недвижимости определённой стоимости может давать инвесторскую или Golden Visa, но это не происходит автоматически и зависит от объекта и требований органов." },
  { q: "Сколько стоит Golden Visa в ОАЭ?", a: "Итоговая стоимость зависит от программы, профиля заявителя и состава семьи. Мы делаем индивидуальную оценку кейса до начала процесса." },
  { q: "Можно ли начать процесс удалённо?", a: "Многие шаги — оценка, подбор маршрута и подготовка документов — начинаются удалённо. Биометрия и открытие счёта обычно требуют личного присутствия." },
  { q: "Какие документы нужны для первичной оценки?", a: "Достаточно общей информации о цели, бюджете, стране, составе семьи и гражданстве. Полный список формируется после выбора маршрута." },
  { q: "Что Residency24 не гарантирует?", a: "Мы не гарантируем одобрение государственных органов и не обещаем точные сроки. Наша работа — подбор маршрута и сопровождение подготовки документов." },
];

const GUIDES = [
  { title: "ОАЭ или Оман: что выбрать для релокации?", desc: "Сравнение двух направлений по бизнесу, семье и стоимости.", href: BLOG },
  { title: "Как открыть компанию в Дубае русскоязычному предпринимателю?", desc: "Free zone vs mainland и подготовка к банку.", href: BLOG },
  { title: "Golden Visa ОАЭ: кому подходит?", desc: "Категории заявителей и ключевые требования.", href: BLOG },
  { title: "Недвижимость в Дубае и резидентство", desc: "Что важно знать перед покупкой объекта.", href: BLOG },
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

function SectionHead({ eyebrow, title, subtitle, center = true }: { eyebrow?: string; title: string; subtitle?: string; center?: boolean }) {
  return (
    <div className={`mb-10 ${center ? "text-center max-w-3xl mx-auto" : "max-w-3xl"}`}>
      {eyebrow && (
        <div className={`inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gold-dk mb-3 ${center ? "" : ""}`}>
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
      {open && (
        <div className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed">{a}</div>
      )}
    </div>
  );
}

export default function RuHomePageClient({ h1 }: { h1: string }) {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [form, setForm] = useState({ name: "", phone: "", goal: "", country: "ОАЭ", message: "" });
  const [sent, setSent] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone) return;
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("event", "lead_form_submit", { service: "ru_home" });
    }
    setSent(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

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
        <div className="relative max-w-7xl mx-auto px-4 py-16 md:py-24">
          <div className="grid lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 bg-white/10 border border-gold/30 rounded-full px-3 py-1 text-xs text-gold-lt mb-5">
                <MapPin className="w-3.5 h-3.5" /> ОАЭ · Оман · и другие направления
              </div>
              <h1 className="text-3xl md:text-5xl font-bold leading-tight">
                {h1}
              </h1>
              <p className="mt-5 text-base md:text-lg text-white/80 max-w-2xl">
                Подберите подходящий путь для релокации в ОАЭ, Оман и другие страны: компания, недвижимость, Golden Visa, семейный переезд или инвестиционная виза.
              </p>

              <ul className="mt-6 grid sm:grid-cols-2 gap-2 max-w-xl">
                {[
                  "Поддержка на русском языке",
                  "ОАЭ, Оман и другие направления",
                  "Компания, недвижимость, визы и резидентство",
                  "Предварительная оценка до начала процесса",
                ].map((b) => (
                  <li key={b} className="flex items-start gap-2 text-sm text-white/90">
                    <Check className="w-4 h-4 text-gold mt-0.5 shrink-0" /> {b}
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <a
                  href={ELIGIBILITY}
                  className="inline-flex items-center justify-center gap-2 bg-gold text-navy font-semibold px-6 py-3 rounded-xl hover:bg-gold-dk transition-colors min-h-[48px]"
                >
                  Проверить мои варианты <ArrowRight className="w-4 h-4" />
                </a>
                <a
                  href={COST}
                  className="inline-flex items-center justify-center gap-2 bg-white/10 border border-white/20 text-white font-medium px-6 py-3 rounded-xl hover:bg-white/15 transition-colors min-h-[48px]"
                >
                  <Calculator className="w-4 h-4" /> Рассчитать стоимость
                </a>
                <a
                  href={WA}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-whatsapp text-white font-medium px-6 py-3 rounded-xl hover:opacity-90 transition-opacity min-h-[48px]"
                >
                  <MessageCircle className="w-4 h-4" /> Написать в WhatsApp
                </a>
              </div>
            </div>

            <div className="lg:col-span-5 relative">
              <div className="relative aspect-[5/6] max-w-md mx-auto">
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-navy-lt to-navy border border-gold/30 shadow-2xl" />
                <div className="absolute inset-4 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-sm flex items-center justify-center">
                  <div className="text-center px-6">
                    <Globe2 className="w-14 h-14 text-gold mx-auto mb-3" />
                    <div className="text-sm uppercase tracking-widest text-gold-lt">Residency24</div>
                    <div className="mt-2 text-white/80 text-sm">Премиум-сопровождение релокации и резидентства</div>
                  </div>
                </div>
                {HERO_FLOATING.map((f, i) => {
                  const Icon = f.icon;
                  const positions = [
                    "top-2 -left-4 sm:-left-10",
                    "top-1/4 -right-4 sm:-right-10",
                    "top-1/2 -left-6 sm:-left-14",
                    "bottom-1/4 -right-2 sm:-right-8",
                    "bottom-4 left-1/2 -translate-x-1/2",
                  ];
                  return (
                    <div
                      key={f.title}
                      className={`absolute ${positions[i]} bg-white text-navy rounded-xl shadow-xl px-3 py-2 flex items-center gap-2 text-xs font-semibold`}
                    >
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

      {/* QUICK ROUTES */}
      <section className="py-16 md:py-20 bg-surface">
        <div className="max-w-7xl mx-auto px-4">
          <SectionHead
            eyebrow="С чего начать"
            title="Что вы хотите сделать?"
            subtitle="Выберите цель — мы покажем подходящие маршруты, примерную стоимость и следующий шаг."
          />
          <CardGrid items={QUICK_ROUTES} />
        </div>
      </section>

      {/* DESTINATIONS */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <SectionHead
            eyebrow="Направления"
            title="Популярные направления для русскоязычных клиентов"
            subtitle="Выберите страну — мы покажем услуги, которые подходят под вашу задачу."
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* UAE */}
            <div className="rounded-2xl overflow-hidden border border-border bg-white shadow-sm hover:shadow-xl transition-shadow flex flex-col">
              <div className="relative h-36 bg-gradient-to-br from-navy to-navy-lt flex items-center justify-center">
                <div className="text-6xl">🇦🇪</div>
                <span className="absolute top-3 left-3 bg-gold text-navy text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded-full">Топ-выбор</span>
              </div>
              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-xl font-bold text-navy">ОАЭ</h3>
                <p className="text-sm text-muted-foreground mt-1">Для бизнеса, недвижимости, Golden Visa и семейной релокации.</p>
                <ul className="mt-4 space-y-1.5 text-sm text-ink">
                  {["Компания в Дубае", "Резидентская виза", "Недвижимость", "Golden Visa", "Банковский счёт"].map((x) => (
                    <li key={x} className="flex items-center gap-2"><Check className="w-4 h-4 text-gold-dk" /> {x}</li>
                  ))}
                </ul>
                <a href="/ru/uae/" className="mt-6 inline-flex items-center justify-center gap-2 bg-navy text-white font-semibold px-5 py-3 rounded-xl hover:bg-navy-lt transition-colors">
                  Смотреть ОАЭ <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Oman */}
            <div className="rounded-2xl overflow-hidden border border-border bg-white shadow-sm hover:shadow-xl transition-shadow flex flex-col">
              <div className="relative h-36 bg-gradient-to-br from-gold-dk to-gold flex items-center justify-center">
                <div className="text-6xl">🇴🇲</div>
              </div>
              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-xl font-bold text-navy">Оман</h3>
                <p className="text-sm text-muted-foreground mt-1">Для предпринимателей, инвесторов и спокойной региональной релокации.</p>
                <ul className="mt-4 space-y-1.5 text-sm text-ink">
                  {["Открытие компании", "Инвестиционная резиденция", "Недвижимость", "Бизнес-сопровождение"].map((x) => (
                    <li key={x} className="flex items-center gap-2"><Check className="w-4 h-4 text-gold-dk" /> {x}</li>
                  ))}
                </ul>
                <a href="/ru/oman/" className="mt-6 inline-flex items-center justify-center gap-2 bg-navy text-white font-semibold px-5 py-3 rounded-xl hover:bg-navy-lt transition-colors">
                  Смотреть Оман <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Other */}
            <div className="rounded-2xl overflow-hidden border border-border bg-white shadow-sm hover:shadow-xl transition-shadow flex flex-col">
              <div className="relative h-36 bg-gradient-to-br from-surface to-gold-lt flex items-center justify-center text-navy">
                <Globe2 className="w-14 h-14" />
              </div>
              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-xl font-bold text-navy">Другие страны</h3>
                <p className="text-sm text-muted-foreground mt-1">Турция, Канада, Великобритания, Германия и другие направления.</p>
                <ul className="mt-4 space-y-1.5 text-sm text-ink">
                  {["Индивидуальная оценка кейса", "Подбор страны под цель", "Консультация на русском", "Мультистрановые сценарии"].map((x) => (
                    <li key={x} className="flex items-center gap-2"><Check className="w-4 h-4 text-gold-dk" /> {x}</li>
                  ))}
                </ul>
                <a href={CONTACT} className="mt-6 inline-flex items-center justify-center gap-2 bg-navy text-white font-semibold px-5 py-3 rounded-xl hover:bg-navy-lt transition-colors">
                  Получить консультацию <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* UAE SERVICES */}
      <section className="py-16 md:py-20 bg-surface">
        <div className="max-w-7xl mx-auto px-4">
          <SectionHead
            eyebrow="ОАЭ"
            title="Услуги по ОАЭ"
            subtitle="Основные маршруты для резидентства, бизнеса, недвижимости и виз в ОАЭ."
          />
          <CardGrid items={UAE_SERVICES} />
        </div>
      </section>

      {/* OMAN SERVICES */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <SectionHead
            eyebrow="Оман"
            title="Услуги по Оману"
            subtitle="Оман — перспективное направление для бизнеса, инвестиций и региональной релокации."
          />
          <CardGrid items={OMAN_SERVICES} cols={2} />
        </div>
      </section>

      {/* COMPARISON */}
      <section className="py-16 md:py-20 bg-navy text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gold mb-3">
              <GitCompare className="w-3.5 h-3.5" /> Сравнение
            </div>
            <h2 className="text-2xl md:text-4xl font-bold leading-tight">ОАЭ или Оман — что выбрать?</h2>
            <p className="text-white/75 mt-3 text-base md:text-lg">
              Сравните два направления по бизнесу, стоимости, банковской системе, семье и инвестиционным возможностям.
            </p>
          </div>

          <div className="hidden md:block rounded-2xl overflow-hidden border border-white/10 bg-white/[0.04]">
            <div className="grid grid-cols-3 bg-white/10 text-sm font-semibold">
              <div className="px-5 py-4">Критерий</div>
              <div className="px-5 py-4">🇦🇪 ОАЭ</div>
              <div className="px-5 py-4">🇴🇲 Оман</div>
            </div>
            {COMPARE_ROWS.map((r, i) => (
              <div key={r.criterion} className={`grid grid-cols-3 text-sm ${i % 2 === 0 ? "bg-white/[0.02]" : ""}`}>
                <div className="px-5 py-4 font-medium text-gold-lt border-t border-white/10">{r.criterion}</div>
                <div className="px-5 py-4 text-white/85 border-t border-white/10">{r.uae}</div>
                <div className="px-5 py-4 text-white/85 border-t border-white/10">{r.oman}</div>
              </div>
            ))}
          </div>

          <div className="md:hidden space-y-3">
            {COMPARE_ROWS.map((r) => (
              <div key={r.criterion} className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
                <div className="text-gold font-semibold text-sm mb-2">{r.criterion}</div>
                <div className="text-sm text-white/85"><span className="text-gold-lt">🇦🇪 ОАЭ:</span> {r.uae}</div>
                <div className="text-sm text-white/85 mt-1"><span className="text-gold-lt">🇴🇲 Оман:</span> {r.oman}</div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <a href={COMPARE_UAE_OMAN} className="inline-flex items-center gap-2 bg-gold text-navy font-semibold px-6 py-3 rounded-xl hover:bg-gold-dk transition-colors">
              Сравнить ОАЭ и Оман <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* COST SNAPSHOT */}
      <section className="py-16 md:py-20 bg-surface">
        <div className="max-w-7xl mx-auto px-4">
          <SectionHead
            eyebrow="Стоимость"
            title="Ориентировочная стоимость популярных маршрутов"
            subtitle="Стоимость зависит от страны, типа услуги, состава семьи, документов и требований конкретного органа."
          />
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

      {/* ELIGIBILITY CTA */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="rounded-3xl bg-gradient-to-br from-navy to-navy-lt text-white p-8 md:p-12 relative overflow-hidden">
            <div
              className="absolute inset-0 opacity-10 pointer-events-none"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 80% 20%, hsl(var(--gold)) 0, transparent 40%)",
              }}
            />
            <div className="relative grid lg:grid-cols-2 gap-10 items-center">
              <div>
                <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gold mb-3">
                  <Target className="w-3.5 h-3.5" /> Подбор маршрута
                </div>
                <h2 className="text-2xl md:text-4xl font-bold leading-tight">Не уверены, какой путь подходит именно вам?</h2>
                <p className="text-white/80 mt-3 text-base md:text-lg">
                  Ответьте на несколько вопросов о цели, бюджете, стране и составе семьи — мы покажем предварительные варианты.
                </p>
                <a href={ELIGIBILITY} className="mt-6 inline-flex items-center gap-2 bg-gold text-navy font-semibold px-6 py-3 rounded-xl hover:bg-gold-dk transition-colors">
                  Проверить мои варианты <ArrowRight className="w-4 h-4" />
                </a>
              </div>
              <div>
                <div className="grid grid-cols-5 gap-2">
                  {ELIG_STEPS.map((s, i) => {
                    const Icon = s.icon;
                    return (
                      <div key={s.label} className="text-center">
                        <div className="w-10 h-10 mx-auto rounded-full bg-white/10 border border-gold/30 flex items-center justify-center text-gold">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="text-[11px] mt-2 text-white/80">{s.label}</div>
                        {i < ELIG_STEPS.length - 1 && (
                          <div className="hidden md:block h-px bg-gold/30 mt-5 -mr-2" />
                        )}
                      </div>
                    );
                  })}
                </div>
                <div className="mt-6 rounded-xl bg-white/5 border border-white/10 p-4 text-sm text-white/80">
                  Это предварительная оценка. Итоговый результат зависит от профиля заявителя и решения соответствующих органов.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW WE HELP */}
      <section className="py-16 md:py-20 bg-surface">
        <div className="max-w-7xl mx-auto px-4">
          <SectionHead
            eyebrow="Процесс"
            title="Как Residency24 помогает"
            subtitle="Мы не просто показываем список услуг — мы помогаем выбрать маршрут под вашу ситуацию."
          />
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
            {PROCESS.map((p, i) => (
              <div key={p.title} className="relative rounded-2xl bg-white border border-border p-5">
                <div className="w-9 h-9 rounded-full bg-navy text-gold flex items-center justify-center font-bold text-sm">
                  {i + 1}
                </div>
                <div className="mt-3 font-semibold text-navy">{p.title}</div>
                <div className="text-sm text-muted-foreground mt-1">{p.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BUSINESS / BANKING */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <SectionHead
            eyebrow="Бизнес"
            title="Бизнес, банковский счёт и структура за рубежом"
            subtitle="Для многих русскоязычных клиентов релокация связана не только с визой, но и с компанией, банковским счётом и финансовой структурой."
          />
          <CardGrid items={BUSINESS_CARDS} />
          <div className="mt-8 text-center">
            <a href={CONTACT} className="inline-flex items-center gap-2 bg-navy text-white font-semibold px-6 py-3 rounded-xl hover:bg-navy-lt transition-colors">
              Обсудить бизнес-задачу <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* FAMILY */}
      <section className="py-16 md:py-20 bg-gold-lt/40">
        <div className="max-w-7xl mx-auto px-4">
          <SectionHead
            eyebrow="Семья"
            title="Релокация семьи"
            subtitle="Помогаем оценить варианты для заявителя, супруги/супруга и детей: визы, документы, сроки и следующий шаг."
          />
          <CardGrid items={FAMILY_CARDS} cols={2} />
          <div className="mt-8 text-center">
            <a href={ELIGIBILITY} className="inline-flex items-center gap-2 bg-navy text-white font-semibold px-6 py-3 rounded-xl hover:bg-navy-lt transition-colors">
              Проверить семейный сценарий <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <SectionHead
            eyebrow="Преимущества"
            title="Почему русскоязычные клиенты выбирают Residency24"
            subtitle="Мы строим работу на прозрачности и подборе маршрута, а не на громких обещаниях."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {WHY_US.map((w) => {
              const Icon = w.icon;
              return (
                <div key={w.title} className="rounded-2xl border border-border p-6 hover:border-gold transition-colors">
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

      {/* TRANSPARENCY / RISKS */}
      <section className="py-16 md:py-20 bg-surface">
        <div className="max-w-5xl mx-auto px-4">
          <div className="rounded-2xl border border-gold/40 bg-gold-lt/40 p-6 md:p-10">
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl bg-gold text-navy flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-navy">Что важно знать до начала</h2>
                <p className="text-sm text-ink/80 mt-2">Эта информация помогает реалистично оценить процесс и избежать ложных ожиданий.</p>
                <ul className="mt-5 space-y-2.5">
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

      {/* CASES */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <SectionHead
            eyebrow="Примеры"
            title="Типовые кейсы"
            subtitle="Несколько распространённых сценариев, с которыми обращаются русскоязычные клиенты."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {CASES.map((c) => {
              const Icon = c.icon;
              return (
                <div key={c.title} className="rounded-2xl border border-border bg-white p-6 hover:shadow-lg transition-shadow">
                  <div className="text-[11px] uppercase tracking-wider text-gold-dk font-semibold">{c.tag}</div>
                  <div className="mt-2 flex items-center gap-2 font-semibold text-navy">
                    <Icon className="w-4 h-4 text-navy" /> {c.title}
                  </div>
                  <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{c.desc}</p>
                </div>
              );
            })}
          </div>
          <div className="mt-8 text-center">
            <a href={CONTACT} className="inline-flex items-center gap-2 bg-navy text-white font-semibold px-6 py-3 rounded-xl hover:bg-navy-lt transition-colors">
              Обсудить мой случай <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 md:py-20 bg-surface">
        <div className="max-w-3xl mx-auto px-4">
          <SectionHead eyebrow="FAQ" title="Частые вопросы" subtitle="Коротко о главном — без обещаний и громких слов." />
          <div className="space-y-3">
            {FAQS.map((f, i) => (
              <FaqItem
                key={f.q}
                q={f.q}
                a={f.a}
                idx={i}
                open={openFaq === i}
                onToggle={(idx) => setOpenFaq(openFaq === idx ? null : idx)}
              />
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
          <SectionHead eyebrow="Блог" title="Полезные материалы" subtitle="Гайды и разборы для русскоязычных клиентов." />
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

      {/* FINAL CTA */}
      <section id="consultation-form" className="py-16 md:py-24 bg-navy text-white">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gold mb-3">
              <Sparkles className="w-3.5 h-3.5" /> Бесплатная оценка
            </div>
            <h2 className="text-2xl md:text-4xl font-bold">Начните с бесплатной оценки вашего случая</h2>
            <p className="text-white/80 mt-3 text-base md:text-lg">
              Расскажите нам о цели, стране, бюджете и сроках — мы подскажем, какие варианты стоит рассмотреть.
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
                <a
                  href={WA}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex items-center gap-2 bg-whatsapp text-white font-semibold px-6 py-3 rounded-xl hover:opacity-90 transition-opacity"
                >
                  <MessageCircle className="w-4 h-4" /> Написать в WhatsApp
                </a>
              </div>
            ) : (
              <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  required
                  placeholder="Имя"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-white/10 border border-gold/30 text-white placeholder:text-white/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold transition-colors min-h-[48px]"
                />
                <input
                  type="tel"
                  required
                  placeholder="Телефон / WhatsApp"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full bg-white/10 border border-gold/30 text-white placeholder:text-white/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold transition-colors min-h-[48px]"
                />
                <input
                  type="text"
                  placeholder="Цель (например: компания, ВНЖ, недвижимость)"
                  value={form.goal}
                  onChange={(e) => setForm({ ...form, goal: e.target.value })}
                  className="w-full bg-white/10 border border-gold/30 text-white placeholder:text-white/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold transition-colors min-h-[48px]"
                />
                <select
                  value={form.country}
                  onChange={(e) => setForm({ ...form, country: e.target.value })}
                  className="w-full bg-white/10 border border-gold/30 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold transition-colors min-h-[48px]"
                >
                  <option className="text-navy">ОАЭ</option>
                  <option className="text-navy">Оман</option>
                  <option className="text-navy">Ещё не решил(а)</option>
                  <option className="text-navy">Другая страна</option>
                </select>
                <textarea
                  placeholder="Сообщение (необязательно)"
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  rows={3}
                  className="md:col-span-2 w-full bg-white/10 border border-gold/30 text-white placeholder:text-white/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold transition-colors"
                />
                <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button type="submit" className="bg-gold text-navy font-bold px-6 py-3 rounded-xl hover:bg-gold-dk transition-colors min-h-[48px]">
                    Получить консультацию
                  </button>
                  <a
                    href={WA}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 bg-whatsapp text-white font-semibold px-6 py-3 rounded-xl hover:opacity-90 transition-opacity min-h-[48px]"
                  >
                    <MessageCircle className="w-4 h-4" /> Написать в WhatsApp
                  </a>
                  <a
                    href={COST}
                    className="inline-flex items-center justify-center gap-2 bg-white/10 border border-white/20 text-white font-medium px-6 py-3 rounded-xl hover:bg-white/15 transition-colors min-h-[48px]"
                  >
                    <Calculator className="w-4 h-4" /> Рассчитать стоимость
                  </a>
                </div>
                <p className="md:col-span-2 text-xs text-white/60 mt-1">
                  Отправляя форму, вы соглашаетесь на обработку данных для предварительной консультации. Мы не обещаем гарантированное одобрение со стороны органов.
                </p>
              </form>
            )}
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
