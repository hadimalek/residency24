"use client";

import { useState } from "react";
import {
  Building2,
  Home,
  Users,
  CreditCard,
  Trophy,
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
  ScrollText,
  HelpCircle,
  KeyRound,
  Banknote,
  ClipboardList,
  Search,
  TrendingUp,
  Coins,
  Building,
  Landmark,
  GraduationCap,
  Hammer,
  BadgeCheck,
  PiggyBank,
  Plane,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import SharedBreadcrumb from "@/components/shared/SharedBreadcrumb";

const WA = "https://wa.me/971562009131?text=Здравствуйте,+нужна+консультация+по+недвижимости+в+ОАЭ";

const ELIGIBILITY = "/ru/tools/visa-eligibility-checker/";
const COST = "/ru/tools/cost-calculator/";
const DOCS = "/ru/tools/document-checklist-generator/";
const COMPARE_COMPANY_PROPERTY = "/ru/compare/company-formation-vs-property-purchase/";
const COMPARE_UAE_OMAN = "/ru/compare/uae-vs-oman/";
const CONTACT = "/ru/contact/";
const BLOG = "/ru/blog/";

const UAE_HUB = "/ru/uae/";
const UAE_REGISTER = "/ru/uae/register-company/";
const UAE_RESIDENCY = "/ru/uae/residency/";
const UAE_GOLDEN = "/ru/uae/golden-visa/";
const UAE_FAMILY = "/ru/uae/family-visa/";
const UAE_VISA = "/ru/uae/visa/";

type CardLink = { title: string; desc: string; href: string; icon: any; badge?: string; cta?: string };

const HERO_FLOATING = [
  { title: "Investment", icon: TrendingUp },
  { title: "Rental income", icon: Coins },
  { title: "Residence Visa", icon: ScrollText },
  { title: "Golden Visa", icon: Trophy },
  { title: "Family relocation", icon: Heart },
];

const TRUST_BAR = [
  { label: "Русскоязычная поддержка", icon: Languages },
  { label: "Инвестиции + резидентство", icon: TrendingUp },
  { label: "Dubai property market", icon: Building },
  { label: "Golden Visa review", icon: Trophy },
  { label: "Семейный сценарий", icon: Heart },
];

const GOALS: CardLink[] = [
  { title: "Инвестиции", desc: "Подбор объекта с учётом бюджета, района и потенциала роста.", href: CONTACT, icon: TrendingUp, cta: "Оценить инвестицию" },
  { title: "Доход от аренды", desc: "Выбор района и типа объекта под rental demand.", href: CONTACT, icon: Coins, cta: "Обсудить доходность" },
  { title: "Резидентская виза", desc: "Проверка связи покупки с возможным визовым сценарием.", href: UAE_RESIDENCY, icon: ScrollText, cta: "Проверить условия" },
  { title: "Golden Visa", desc: "Оценка соответствия объекта и бюджета требованиям программы.", href: UAE_GOLDEN, icon: Trophy, cta: "Проверить eligibility", badge: "Популярно" },
  { title: "Переезд семьи", desc: "Выбор района с учётом жизни, школ и инфраструктуры.", href: UAE_FAMILY, icon: Heart, cta: "Оценить сценарий" },
  { title: "Сохранение капитала", desc: "Покупка как часть международной структуры активов.", href: CONTACT, icon: PiggyBank, cta: "Получить консультацию" },
];

const WHY_DUBAI = [
  { title: "Международный рынок", desc: "Объекты, доступные иностранным покупателям в зонах freehold.", icon: Globe2 },
  { title: "Высокий спрос на аренду", desc: "Дубай как туристический и бизнес-хаб с устойчивой rental demand.", icon: Coins },
  { title: "Freehold areas", desc: "Зоны полной собственности для иностранных покупателей.", icon: KeyRound },
  { title: "Инфраструктура для семьи", desc: "Школы, медицина, транспорт и районы под семейный быт.", icon: GraduationCap },
  { title: "Связь с резидентством", desc: "Возможные сценарии резидентской или Golden Visa.", icon: ScrollText },
  { title: "Международная инвест-логика", desc: "Долларовая привязка и понятные правила сделок.", icon: TrendingUp },
];

const ROUTE_TIMELINE = [
  { title: "Бюджет", icon: Wallet },
  { title: "Выбор объекта", icon: Home },
  { title: "Проверка статуса", icon: ShieldCheck },
  { title: "Сделка и регистрация", icon: ClipboardList },
  { title: "Title deed", icon: FileText },
  { title: "Визовый сценарий", icon: ScrollText },
  { title: "Residence / Golden Visa review", icon: Trophy },
];

const AREAS = [
  { name: "Downtown Dubai", best: "Premium lifestyle / rental", desc: "Центральная локация, высокий спрос, премиальный сегмент." },
  { name: "Dubai Marina", best: "Expat lifestyle / rental", desc: "Популярный район для жизни и аренды." },
  { name: "Business Bay", best: "Business + rental", desc: "Рядом с деловой активностью и Downtown." },
  { name: "Palm Jumeirah", best: "Luxury / lifestyle", desc: "Премиальный сегмент и lifestyle-покупка." },
  { name: "JVC", best: "Budget-friendly investment", desc: "Более доступный входной бюджет и rental demand." },
  { name: "Dubai Hills Estate", best: "Family living", desc: "Семейная инфраструктура и lifestyle." },
  { name: "Dubai Creek Harbour", best: "Growth potential", desc: "Развивающийся район с долгосрочной перспективой." },
  { name: "Bluewaters Island", best: "Premium / lifestyle", desc: "Ограниченное предложение и туристический спрос." },
];

const RO_VS_OFFPLAN = [
  { label: "Подходит для", ready: "Быстрое заселение, аренда, ряд визовых сценариев", offplan: "Инвестиции на этапе строительства" },
  { label: "Сроки", ready: "Быстрее после сделки", offplan: "Зависит от застройщика и даты сдачи" },
  { label: "Доход от аренды", ready: "Возможен быстрее", offplan: "После завершения проекта" },
  { label: "Риски", ready: "Проверка состояния и документов", offplan: "Сроки, застройщик, условия оплаты" },
  { label: "Визовый сценарий", ready: "Может быть проще для оценки", offplan: "Требует отдельной проверки" },
  { label: "Платежи", ready: "Обычно больше upfront", offplan: "Возможны payment plans" },
];

const COSTS = [
  { title: "Стоимость объекта", desc: "Базовая цена покупки.", icon: Home },
  { title: "DLD / регистрационные сборы", desc: "Сборы регистрации сделки.", icon: ScrollText },
  { title: "Agency fee", desc: "Комиссия агентства, если применимо.", icon: Briefcase },
  { title: "NOC / developer fees", desc: "Платежи и согласования застройщика.", icon: Hammer },
  { title: "Mortgage costs", desc: "Если используется ипотека.", icon: Banknote },
  { title: "Service charges", desc: "Содержание и обслуживание объекта.", icon: KeyRound },
  { title: "Оценка / valuation", desc: "Если требуется банком или процедурой.", icon: Search },
  { title: "Страхование / оформление", desc: "Сопутствующие документы, если применимо.", icon: ShieldCheck },
  { title: "Visa / Emirates ID / medical", desc: "Если идёт визовый сценарий.", icon: BadgeCheck },
];

const GV_CARDS: CardLink[] = [
  { title: "Investor Residence", desc: "Возможный сценарий для владельцев недвижимости при соблюдении требований.", href: UAE_RESIDENCY, icon: ScrollText },
  { title: "Golden Visa", desc: "Долгосрочный маршрут для соответствующих инвесторов.", href: UAE_GOLDEN, icon: Trophy },
  { title: "Family Scenario", desc: "Возможность рассмотреть dependents при подходящем профиле.", href: UAE_FAMILY, icon: Heart },
  { title: "Eligibility Review", desc: "Проверка объекта, стоимости, документов и актуальных требований.", href: ELIGIBILITY, icon: Target },
];

const PROCESS = [
  { title: "Анализ цели и бюджета", desc: "Инвестиции, аренда, семья, резидентство или Golden Visa." },
  { title: "Выбор района и объекта", desc: "Подбор района, типа и стадии готовности." },
  { title: "Due diligence", desc: "Проверка документов, статуса и условий сделки." },
  { title: "Reservation / SPA", desc: "Резервация, договор, платёжный график." },
  { title: "Registration / Title deed", desc: "Регистрация и подтверждение собственности." },
  { title: "Visa scenario review", desc: "Проверка возможности residence / Golden Visa." },
  { title: "Следующий шаг", desc: "Аренда, переезд, family scenario или документы." },
];

const REQUIRED_DOCS = [
  { title: "Паспорт", icon: FileText },
  { title: "Контактные данные", icon: MessageCircle },
  { title: "Бюджет и источник средств", icon: Banknote },
  { title: "Цель покупки", icon: Target },
  { title: "Данные семьи (если нужен family scenario)", icon: Users },
  { title: "Документы по оплате / банковские", icon: CreditCard },
  { title: "Договор / reservation form", icon: ClipboardList },
  { title: "Title deed или документы объекта", icon: ScrollText },
  { title: "Документы для визового сценария", icon: ShieldCheck },
];

const FAMILY_CARDS: CardLink[] = [
  { title: "Район для жизни", desc: "Подбор района с учётом стиля жизни и инфраструктуры.", href: CONTACT, icon: MapPin },
  { title: "Школы и инфраструктура", desc: "Близость школ, медицины и транспорта.", href: CONTACT, icon: GraduationCap },
  { title: "Family visa scenario", desc: "Возможные визы для супруги/супруга и детей.", href: UAE_FAMILY, icon: Heart },
  { title: "Расходы по составу семьи", desc: "Расчёт под количество членов семьи.", href: COST, icon: Calculator },
  { title: "Сроки переезда", desc: "Этапы и ориентировочные сроки.", href: ELIGIBILITY, icon: ListChecks },
  { title: "Документы dependents", desc: "Свидетельства, переводы, апостили.", href: DOCS, icon: FileText },
];

const DUE_DILIGENCE = [
  "Статус объекта",
  "Документы собственности",
  "Developer reputation",
  "Payment plan",
  "Service charges",
  "Mortgage status, если применимо",
  "Возможность аренды",
  "Связь с визовым сценарием",
];

const RISKS = [
  "Не каждый объект подходит под визовый сценарий",
  "Off-plan может требовать отдельной проверки",
  "Golden Visa зависит от требований программы",
  "Расходы не ограничиваются ценой объекта",
  "Mortgage и joint ownership требуют отдельной оценки",
  "Сервисные сборы и содержание объекта нужно учитывать заранее",
  "Рынок недвижимости связан с инвестиционными рисками",
];

const RELATED: CardLink[] = [
  { title: "Golden Visa ОАЭ", desc: "Долгосрочный маршрут для подходящих категорий.", href: UAE_GOLDEN, icon: Trophy },
  { title: "Резидентская виза ОАЭ", desc: "Маршруты резидентства и условия.", href: UAE_RESIDENCY, icon: ScrollText },
  { title: "Открытие компании в ОАЭ", desc: "Бизнес как часть общей стратегии.", href: UAE_REGISTER, icon: Building2 },
  { title: "Семейная виза ОАЭ", desc: "Визы для супруги/супруга и детей.", href: UAE_FAMILY, icon: Heart },
  { title: "Визы в ОАЭ", desc: "Туристическая, бизнес, семейная и др.", href: UAE_VISA, icon: Plane },
  { title: "ОАЭ Country Hub", desc: "Все услуги по ОАЭ в одном месте.", href: UAE_HUB, icon: Globe2 },
];

const TOOLS: CardLink[] = [
  { title: "Проверка eligibility", desc: "Может ли покупка быть связана с резидентским сценарием.", href: ELIGIBILITY, icon: Target },
  { title: "Расчёт стоимости", desc: "Бюджет покупки и сопутствующие расходы.", href: COST, icon: Calculator },
  { title: "Список документов", desc: "Предварительный checklist под ваш сценарий.", href: DOCS, icon: ClipboardList },
];

const FAQS = [
  { q: "Могут ли граждане России купить недвижимость в Дубае?", a: "Да, иностранные покупатели, в том числе из России, могут приобретать недвижимость в обозначенных зонах freehold. Конкретные условия и форма сделки зависят от объекта, статуса собственности и актуальных правил." },
  { q: "Нужно ли иметь резидентскую визу для покупки недвижимости?", a: "Резидентство не является обязательным условием для покупки в freehold-зонах. При этом отдельные шаги (банковский счёт, регистрация, виза) могут требовать дополнительных документов и личного присутствия." },
  { q: "Даёт ли покупка недвижимости право на резидентскую визу?", a: "В ряде случаев покупка объекта определённой стоимости может быть связана с инвесторской резидентской визой, но это не происходит автоматически и зависит от объекта, документов и требований органов." },
  { q: "Можно ли получить Golden Visa через недвижимость?", a: "При соответствии актуальным порогам стоимости и требованиям к объекту такой сценарий возможен. Условия программы могут меняться, поэтому нужна индивидуальная оценка кейса." },
  { q: "Что лучше: готовый объект или off-plan?", a: "Готовый объект подходит, когда важны быстрое использование и предсказуемость; off-plan — когда приоритет инвестиции и payment plan. Финальный выбор зависит от цели, бюджета и сроков." },
  { q: "Какие расходы есть кроме цены объекта?", a: "Помимо цены: DLD/регистрационные сборы, agency fee, NOC/developer fees, ипотечные расходы (если применимо), service charges, оценка, оформление, а также расходы визового сценария." },
  { q: "Можно ли купить недвижимость удалённо?", a: "Часть шагов начинается удалённо: подбор, due diligence, бронирование. Регистрация, банковские этапы и медкомиссия (если в визовом сценарии) обычно требуют присутствия." },
  { q: "Можно ли перевезти семью после покупки?", a: "Если основной заявитель оформляет резидентство, как правило, можно рассмотреть визы для супруги/супруга и детей. Сценарий зависит от объекта и требований." },
  { q: "Какие документы нужны для первичной оценки?", a: "Достаточно общей информации: бюджет, цель, состав семьи, страна проживания. Полный список формируется после выбора объекта и сценария." },
  { q: "Что Residency24 не гарантирует?", a: "Мы не гарантируем одобрение визы, конкретный доход от аренды или рост стоимости. Наша работа — оценка сценария, due diligence и сопровождение подготовки документов." },
];

const GUIDES = [
  { title: "Готовый объект или off-plan: что выбрать в Дубае?", desc: "Сравнение по срокам, рискам и доходу.", href: BLOG },
  { title: "Golden Visa ОАЭ через недвижимость: что важно знать?", desc: "Условия, объекты и подводные камни.", href: BLOG },
  { title: "Лучшие районы Дубая для покупки недвижимости", desc: "Жизнь, аренда и долгосрочный потенциал.", href: BLOG },
  { title: "Какие расходы учитывать при покупке квартиры в Дубае?", desc: "DLD, NOC, service charges и другие пункты.", href: BLOG },
  { title: "Недвижимость в Дубае и семейная релокация", desc: "Школы, район, визы для dependents.", href: BLOG },
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
              {c.cta || "Подробнее"} <ArrowRight className="w-4 h-4" />
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

export default function RuPropertyPurchaseClient() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [heroForm, setHeroForm] = useState({ name: "", phone: "", budget: "", goal: "", message: "" });
  const [heroSent, setHeroSent] = useState(false);
  const [finalForm, setFinalForm] = useState({ name: "", phone: "", budget: "", goal: "", area: "", message: "" });
  const [finalSent, setFinalSent] = useState(false);

  const submitHero = (e: React.FormEvent) => {
    e.preventDefault();
    if (!heroForm.name || !heroForm.phone) return;
    if (typeof window !== "undefined" && (window as any).gtag) (window as any).gtag("event", "lead_form_submit", { service: "ru_uae_property_hero" });
    setHeroSent(true);
  };

  const submitFinal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!finalForm.name || !finalForm.phone) return;
    if (typeof window !== "undefined" && (window as any).gtag) (window as any).gtag("event", "lead_form_submit", { service: "ru_uae_property_final" });
    setFinalSent(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <SharedBreadcrumb items={[{ label: "ОАЭ", href: UAE_HUB }, { label: "Недвижимость" }]} />

      {/* HERO */}
      <section className="relative overflow-hidden bg-navy text-white">
        <div className="absolute inset-0 opacity-[0.18] pointer-events-none" style={{ backgroundImage: "radial-gradient(circle at 20% 20%, hsl(var(--gold)) 0, transparent 35%), radial-gradient(circle at 80% 60%, hsl(var(--navy-lt)) 0, transparent 45%)" }} />
        <div className="absolute inset-0 opacity-[0.06] pointer-events-none" style={{ backgroundImage: "linear-gradient(hsl(var(--gold)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--gold)) 1px, transparent 1px)", backgroundSize: "48px 48px" }} />
        <div className="relative max-w-7xl mx-auto px-4 py-14 md:py-20">
          <div className="grid lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 bg-white/10 border border-gold/30 rounded-full px-3 py-1 text-xs text-gold-lt mb-5">
                <MapPin className="w-3.5 h-3.5" /> 🇦🇪 Дубай · Абу-Даби · Freehold areas
              </div>
              <h1 className="text-3xl md:text-5xl font-bold leading-tight">Покупка недвижимости в Дубае и ОАЭ с учётом инвестиций и резидентства</h1>
              <p className="mt-5 text-base md:text-lg text-white/80 max-w-2xl">
                Помогаем русскоязычным клиентам выбрать недвижимость в Дубае и ОАЭ под конкретную цель: инвестиции, аренда, семейная релокация, резидентская виза или Golden Visa.
              </p>

              <ul className="mt-6 grid sm:grid-cols-2 gap-2 max-w-xl">
                {[
                  "Поддержка на русском языке",
                  "Покупка под инвестиции, семью или резидентство",
                  "Проверка сценария до выбора объекта",
                  "Оценка расходов и документов",
                  "Без ложных гарантий по визе",
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
                  <Target className="w-4 h-4" /> Проверить сценарий
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
                    <div className="w-9 h-9 rounded-lg bg-navy text-gold flex items-center justify-center"><Home className="w-4 h-4" /></div>
                    <div>
                      <div className="text-xs uppercase tracking-wider text-gold-dk font-semibold">Бесплатная оценка</div>
                      <div className="font-bold text-navy">Подбор объекта под цель</div>
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
                      <select value={heroForm.budget} onChange={(e) => setHeroForm({ ...heroForm, budget: e.target.value })} className="w-full bg-surface border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-navy transition-colors min-h-[44px]">
                        <option value="">Бюджет покупки</option>
                        <option>До 200 000 USD</option>
                        <option>200 000 – 500 000 USD</option>
                        <option>500 000 – 1 000 000 USD</option>
                        <option>1 000 000 – 2 000 000 USD</option>
                        <option>Свыше 2 000 000 USD</option>
                      </select>
                      <select value={heroForm.goal} onChange={(e) => setHeroForm({ ...heroForm, goal: e.target.value })} className="w-full bg-surface border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-navy transition-colors min-h-[44px]">
                        <option value="">Цель покупки</option>
                        <option>Инвестиции</option>
                        <option>Аренда</option>
                        <option>Резидентство</option>
                        <option>Golden Visa</option>
                        <option>Семейная релокация</option>
                        <option>Сохранение капитала</option>
                      </select>
                      <textarea placeholder="Сообщение (необязательно)" value={heroForm.message} onChange={(e) => setHeroForm({ ...heroForm, message: e.target.value })} rows={2} className="w-full bg-surface border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-navy transition-colors" />
                      <button type="submit" className="w-full bg-navy text-white font-semibold px-5 py-3 rounded-xl hover:bg-navy-lt transition-colors min-h-[48px]">
                        Получить консультацию
                      </button>
                      <p className="text-[11px] text-muted-foreground text-center">
                        Мы используем данные только для предварительной оценки сценария.
                      </p>
                    </form>
                  )}
                </div>
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

      {/* GOAL SELECTOR */}
      <section className="py-16 md:py-20 bg-surface">
        <div className="max-w-7xl mx-auto px-4">
          <SectionHead eyebrow="Цель покупки" title="Какая цель покупки?" subtitle="Один и тот же объект может быть хорошим или плохим выбором — в зависимости от вашей цели." />
          <CardGrid items={GOALS} />
        </div>
      </section>

      {/* WHY DUBAI */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <SectionHead eyebrow="Почему Дубай" title="Почему русскоязычные клиенты рассматривают недвижимость в Дубае" subtitle="Дубай привлекает не только объектами, но и связью недвижимости с релокацией, арендой, международной мобильностью и возможными визовыми сценариями." />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {WHY_DUBAI.map((w) => {
              const Icon = w.icon;
              return (
                <div key={w.title} className="rounded-2xl border border-border p-6 hover:border-gold transition-colors bg-white">
                  <div className="w-11 h-11 rounded-xl bg-navy text-gold flex items-center justify-center mb-4"><Icon className="w-5 h-5" /></div>
                  <div className="font-semibold text-navy">{w.title}</div>
                  <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{w.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* PROPERTY + RESIDENCY ROUTE */}
      <section className="py-16 md:py-20 bg-surface">
        <div className="max-w-7xl mx-auto px-4">
          <SectionHead eyebrow="Маршрут" title="Недвижимость может быть частью визового сценария" subtitle="Покупка объекта может открыть путь к резидентской визе или Golden Visa, но всё зависит от стоимости, типа объекта, статуса собственности, документов и актуальных требований." />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4">
            {ROUTE_TIMELINE.map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={s.title} className="relative rounded-2xl bg-white border border-border p-5">
                  <div className="absolute -top-3 left-5 w-7 h-7 rounded-full bg-gold text-navy text-xs font-bold flex items-center justify-center">{i + 1}</div>
                  <div className="w-10 h-10 rounded-lg bg-navy text-gold flex items-center justify-center mt-2 mb-3"><Icon className="w-4 h-4" /></div>
                  <div className="font-semibold text-navy text-sm">{s.title}</div>
                </div>
              );
            })}
          </div>
          <div className="mt-8 text-center">
            <a href={ELIGIBILITY} className="inline-flex items-center gap-2 bg-navy text-white font-semibold px-6 py-3 rounded-xl hover:bg-navy-lt transition-colors">
              Проверить, подходит ли мой сценарий <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* AREAS */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <SectionHead eyebrow="Районы" title="Популярные районы Дубая по цели покупки" subtitle="Выбор района должен зависеть от цели: жизнь, аренда, рост капитала, премиальный lifestyle или семейная релокация." />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {AREAS.map((a) => (
              <div key={a.name} className="rounded-2xl border border-border bg-white overflow-hidden hover:shadow-lg transition-shadow flex flex-col">
                <div className="relative h-32 bg-gradient-to-br from-navy to-navy-lt overflow-hidden">
                  <svg viewBox="0 0 240 120" className="absolute inset-0 w-full h-full opacity-80">
                    <defs>
                      <linearGradient id={`bld-${a.name}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0" stopColor="hsl(var(--gold))" stopOpacity="0.85" />
                        <stop offset="1" stopColor="hsl(var(--gold-dk))" stopOpacity="0.3" />
                      </linearGradient>
                    </defs>
                    {[
                      [10, 60, 30, 60],
                      [50, 40, 25, 80],
                      [85, 55, 35, 65],
                      [130, 25, 30, 95],
                      [170, 50, 25, 70],
                      [205, 45, 25, 75],
                    ].map(([x, y, w, h], i) => (
                      <rect key={i} x={x} y={y} width={w} height={h} fill={`url(#bld-${a.name})`} opacity={0.4 + i * 0.08} />
                    ))}
                    <rect x="0" y="105" width="240" height="15" fill="hsl(var(--navy))" opacity="0.6" />
                  </svg>
                  <div className="absolute top-3 left-3 bg-white/15 backdrop-blur-sm border border-gold/30 text-gold-lt text-[10px] uppercase tracking-wider font-semibold px-2 py-1 rounded-full">
                    {a.best}
                  </div>
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <div className="font-semibold text-navy">{a.name}</div>
                  <p className="text-sm text-muted-foreground mt-1 flex-1 leading-relaxed">{a.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <a href={CONTACT} className="inline-flex items-center gap-2 bg-navy text-white font-semibold px-6 py-3 rounded-xl hover:bg-navy-lt transition-colors">
              Помогите выбрать район <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* READY VS OFF-PLAN */}
      <section className="py-16 md:py-20 bg-surface">
        <div className="max-w-7xl mx-auto px-4">
          <SectionHead eyebrow="Тип объекта" title="Готовый объект или off-plan — что выбрать?" subtitle="Тип объекта влияет на сроки, риски, платежный план, доход от аренды и возможный визовый сценарий." />

          <div className="hidden md:block rounded-2xl overflow-hidden border border-border bg-white">
            <div className="grid grid-cols-3 bg-navy text-white text-sm font-semibold">
              <div className="px-5 py-4">Критерий</div>
              <div className="px-5 py-4 flex items-center gap-2"><BadgeCheck className="w-4 h-4 text-gold" /> Готовый объект</div>
              <div className="px-5 py-4 flex items-center gap-2"><Hammer className="w-4 h-4 text-gold" /> Off-plan</div>
            </div>
            {RO_VS_OFFPLAN.map((r, i) => (
              <div key={r.label} className={`grid grid-cols-3 text-sm ${i % 2 === 0 ? "bg-surface" : "bg-white"}`}>
                <div className="px-5 py-4 font-semibold text-navy border-t border-border">{r.label}</div>
                <div className="px-5 py-4 text-ink/85 border-t border-border">{r.ready}</div>
                <div className="px-5 py-4 text-ink/85 border-t border-border">{r.offplan}</div>
              </div>
            ))}
          </div>

          <div className="md:hidden grid grid-cols-1 gap-4">
            <div className="rounded-2xl border border-border bg-white p-5">
              <div className="flex items-center gap-2 font-bold text-navy"><BadgeCheck className="w-5 h-5 text-gold-dk" /> Готовый объект</div>
              <ul className="mt-3 space-y-2 text-sm text-ink/85">
                {RO_VS_OFFPLAN.map((c) => (<li key={c.label}><span className="text-gold-dk font-semibold">{c.label}:</span> {c.ready}</li>))}
              </ul>
            </div>
            <div className="rounded-2xl border border-border bg-white p-5">
              <div className="flex items-center gap-2 font-bold text-navy"><Hammer className="w-5 h-5 text-gold-dk" /> Off-plan</div>
              <ul className="mt-3 space-y-2 text-sm text-ink/85">
                {RO_VS_OFFPLAN.map((c) => (<li key={c.label}><span className="text-gold-dk font-semibold">{c.label}:</span> {c.offplan}</li>))}
              </ul>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <a href={CONTACT} className="inline-flex items-center justify-center gap-2 bg-navy text-white font-semibold px-6 py-3 rounded-xl hover:bg-navy-lt transition-colors">
              Сравнить варианты под мой бюджет <ArrowRight className="w-4 h-4" />
            </a>
            <a href={COMPARE_COMPANY_PROPERTY} className="inline-flex items-center justify-center gap-2 bg-gold-lt text-navy font-semibold px-6 py-3 rounded-xl hover:bg-gold transition-colors">
              Компания vs недвижимость
            </a>
          </div>
        </div>
      </section>

      {/* COSTS */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <SectionHead eyebrow="Расходы" title="Какие расходы нужно учитывать кроме цены объекта?" subtitle="Бюджет покупки — это не только цена недвижимости. Важно заранее учитывать регистрационные, сервисные, банковские и визовые расходы." />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {COSTS.map((c) => {
              const Icon = c.icon;
              return (
                <div key={c.title} className="rounded-2xl bg-surface border border-border p-5">
                  <div className="w-10 h-10 rounded-lg bg-gold-lt text-navy flex items-center justify-center mb-3"><Icon className="w-5 h-5" /></div>
                  <div className="font-semibold text-navy text-sm">{c.title}</div>
                  <div className="text-xs text-muted-foreground mt-1 leading-relaxed">{c.desc}</div>
                </div>
              );
            })}
          </div>
          <div className="mt-6 max-w-3xl mx-auto rounded-xl border border-gold/40 bg-gold-lt/40 px-5 py-4 text-sm text-ink/85 flex items-start gap-3">
            <AlertTriangle className="w-4 h-4 text-gold-dk mt-0.5 shrink-0" />
            <span>Размер расходов зависит от объекта, застройщика, формы оплаты, статуса сделки и актуальных правил.</span>
          </div>
          <div className="mt-8 text-center">
            <a href={COST} className="inline-flex items-center gap-2 bg-navy text-white font-semibold px-6 py-3 rounded-xl hover:bg-navy-lt transition-colors">
              <Calculator className="w-4 h-4" /> Рассчитать ориентировочный бюджет
            </a>
          </div>
        </div>
      </section>

      {/* GOLDEN VISA / RESIDENCE */}
      <section className="py-16 md:py-20 bg-gradient-to-b from-surface to-gold-lt/30">
        <div className="max-w-7xl mx-auto px-4">
          <SectionHead eyebrow="Резидентство" title="Golden Visa и резидентство через недвижимость" subtitle="Недвижимость может быть связана с резидентскими программами, но eligibility зависит от стоимости объекта, формы собственности, статуса объекта, документов и актуальных требований." />
          <CardGrid items={GV_CARDS} cols={2} />
          <div className="mt-8 max-w-3xl mx-auto rounded-xl border border-gold/40 bg-white px-5 py-4 text-sm text-ink/85 flex items-start gap-3">
            <ShieldCheck className="w-4 h-4 text-navy mt-0.5 shrink-0" />
            <span>Покупка недвижимости не означает автоматическое получение визы. Визовый сценарий нужно проверять до сделки.</span>
          </div>
          <div className="mt-8 text-center">
            <a href={ELIGIBILITY} className="inline-flex items-center gap-2 bg-navy text-white font-semibold px-6 py-3 rounded-xl hover:bg-navy-lt transition-colors">
              Проверить eligibility по недвижимости <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <SectionHead eyebrow="Процесс" title="Как проходит покупка недвижимости" subtitle="Процесс зависит от объекта и формы сделки, но обычно проходит через несколько ключевых этапов." />
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-7 gap-4">
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
          <SectionHead eyebrow="Документы" title="Какие документы могут понадобиться?" subtitle="Точный список зависит от объекта, формы оплаты, статуса покупателя и визового сценария." />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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

      {/* FAMILY */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <SectionHead eyebrow="Семья" title="Покупка недвижимости и релокация семьи" subtitle="Если цель покупки связана с переездом семьи, нужно заранее оценить район, жильё, визовый сценарий, расходы и документы для dependents." />
          <CardGrid items={FAMILY_CARDS} />
          <div className="mt-8 text-center">
            <a href={ELIGIBILITY} className="inline-flex items-center gap-2 bg-navy text-white font-semibold px-6 py-3 rounded-xl hover:bg-navy-lt transition-colors">
              Проверить семейный сценарий <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* DUE DILIGENCE */}
      <section className="py-16 md:py-20 bg-surface">
        <div className="max-w-5xl mx-auto px-4">
          <SectionHead eyebrow="Due diligence" title="Проверка объекта до сделки" subtitle="Перед покупкой важно проверить не только цену и район, но и документы, статус собственности, условия оплаты и соответствие цели покупки." />
          <div className="rounded-2xl bg-white border border-border p-6 md:p-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {DUE_DILIGENCE.map((d) => (
                <div key={d} className="flex items-start gap-2 text-sm text-ink"><Check className="w-4 h-4 text-navy mt-0.5 shrink-0" /> {d}</div>
              ))}
            </div>
            <div className="mt-6 text-center">
              <a href={CONTACT} className="inline-flex items-center gap-2 bg-navy text-white font-semibold px-6 py-3 rounded-xl hover:bg-navy-lt transition-colors">
                Проверить объект перед покупкой <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* RISKS */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <SectionHead eyebrow="Прозрачность" title="Что важно знать до покупки" subtitle="Мы заранее объясняем ограничения, чтобы покупатель не принимал решение только по цене или красивой презентации объекта." />
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
                  Информация на странице носит общий характер. Условия покупки, расходы, визовые сценарии и результат зависят от объекта, документов, профиля покупателя и актуальных требований соответствующих органов.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* RELATED */}
      <section className="py-16 md:py-20 bg-surface">
        <div className="max-w-7xl mx-auto px-4">
          <SectionHead eyebrow="Связанные услуги" title="Связанные услуги по ОАЭ" subtitle="Откройте дополнительные сценарии, которые часто рассматриваются вместе с покупкой недвижимости." />
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

      {/* TOOLS */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <SectionHead eyebrow="Инструменты" title="Инструменты для оценки покупки" subtitle="Используйте инструменты Residency24, чтобы оценить сценарий и подготовиться к сделке." />
          <CardGrid items={TOOLS} />
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 md:py-20 bg-surface">
        <div className="max-w-3xl mx-auto px-4">
          <SectionHead eyebrow="FAQ" title="Частые вопросы о покупке недвижимости в Дубае и ОАЭ" subtitle="Коротко о главном — без обещаний и громких слов." />
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
          <SectionHead eyebrow="Блог" title="Полезные материалы о недвижимости в ОАЭ" subtitle="Гайды и разборы для русскоязычных покупателей." />
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
            <h2 className="text-2xl md:text-4xl font-bold">Начните с оценки вашего сценария покупки</h2>
            <p className="text-white/80 mt-3 text-base md:text-lg">
              Расскажите нам о бюджете, цели покупки, составе семьи и интересующем районе — мы подскажем, какие варианты стоит рассмотреть.
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
                <select value={finalForm.budget} onChange={(e) => setFinalForm({ ...finalForm, budget: e.target.value })} className="bg-white/10 border border-gold/30 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold transition-colors min-h-[48px]">
                  <option value="" className="text-navy">Бюджет</option>
                  <option className="text-navy">До 200 000 USD</option>
                  <option className="text-navy">200 000 – 500 000 USD</option>
                  <option className="text-navy">500 000 – 1 000 000 USD</option>
                  <option className="text-navy">1 000 000 – 2 000 000 USD</option>
                  <option className="text-navy">Свыше 2 000 000 USD</option>
                </select>
                <select value={finalForm.goal} onChange={(e) => setFinalForm({ ...finalForm, goal: e.target.value })} className="bg-white/10 border border-gold/30 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold transition-colors min-h-[48px]">
                  <option value="" className="text-navy">Цель покупки</option>
                  <option className="text-navy">Инвестиции</option>
                  <option className="text-navy">Аренда</option>
                  <option className="text-navy">Резидентство</option>
                  <option className="text-navy">Golden Visa</option>
                  <option className="text-navy">Семейная релокация</option>
                  <option className="text-navy">Сохранение капитала</option>
                </select>
                <select value={finalForm.area} onChange={(e) => setFinalForm({ ...finalForm, area: e.target.value })} className="md:col-span-2 bg-white/10 border border-gold/30 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold transition-colors min-h-[48px]">
                  <option value="" className="text-navy">Интересующий район</option>
                  {AREAS.map((a) => (<option key={a.name} className="text-navy">{a.name}</option>))}
                  <option className="text-navy">Ещё не определён</option>
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
                  Мы используем данные только для предварительной оценки вашего сценария. Покупка недвижимости не означает автоматическое получение визы.
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
