/**
 * Bilingual content for the "Buy property in Dubai / UAE" ads landing.
 *
 * Two SEPARATE landings share this component, one per language:
 *   - /landing/real-state-dubai      → English (CONTENT.en)
 *   - /ru/landing/real-state-dubai   → Russian (CONTENT.ru)
 * The client picks the object by locale (ru → Russian, everything else → English).
 * These are noindex ads pages (see ../layout.tsx), so the copy is self-contained
 * here rather than in the 4-language src/translations.ts.
 *
 * Editorial rules (mirror the strategy doc + the site's tone):
 *   - No guaranteed yield / visa promises. Figures are indicative.
 *   - Prices/availability are "on request" and confirmed per unit.
 *   - Proof placeholders (cases, advisor) are indicative, to be swapped for
 *     verified data later.
 */

const en = {
  meta: {
    title: "Buy Property in Dubai & the UAE — Guided Selection | Residency24",
    description:
      "We help you find property in Dubai and the UAE for your goal, budget and purchase format — ready and off-plan units, a clear cost and yield breakdown, and expert guidance.",
  },

  hero: {
    pill: "Property in Dubai & the UAE · expert guidance",
    h1: "Property in Dubai & the UAE for your goals — with expert guidance",
    sub: "We'll find current units for investment or personal living, compare areas, purchase formats and costs — with no promises of guaranteed yield or an automatic visa.",
    bullets: [
      "Guidance and support throughout the deal",
      "Ready and off-plan units in Dubai & the UAE",
      "Transparent cost breakdown before you buy",
      "Help vetting the developer and paperwork",
    ],
    cta_primary: "Get a property shortlist",
    cta_whatsapp: "Message on WhatsApp",
    advisor: {
      pill: "AI advisor · Free · 24/7",
      h3: "Ask the AI advisor",
      p: "Instant answers about buying property in Dubai and the UAE.",
      placeholder: "e.g. how much does an apartment in Dubai cost?",
      questions_label: "Popular questions:",
      questions: [
        "How much does an apartment in Dubai cost?",
        "How is off-plan different from ready property?",
        "Can I buy property in the UAE remotely?",
        "What costs are there beyond the property price?",
      ],
    },
  },

  trust: [
    "Guidance in your language",
    "Current projects and terms",
    "Clear explanation of steps and costs",
    "No yield or visa guarantees",
  ],

  stats: [
    { display: "Dubai & the UAE", label: "Core markets" },
    { display: "Off-plan + ready", label: "Purchase formats" },
    { display: "Cost breakdown", label: "Before the deal" },
    { display: "EN · RU · FA · AR", label: "Support languages" },
  ],

  projects: {
    tag: "Projects",
    h2: "Current projects in Dubai & the UAE",
    sub: "A selection from leading developers — DAMAC, Emaar and Beyond. We'll send the full shortlist for your goal and budget after a short form.",
    note: "Projects by DAMAC, Emaar and Beyond. Prices and availability are confirmed per request and depend on the unit type and project stage.",
    cta: "Get project details",
    cards: [
      { img: "damac-islands-2", name: "DAMAC Islands 2", developer: "DAMAC", area: "Dubai", type: "Villas, twin-villas, townhouses", price: "Price on request", meta: "Waterfront community with lagoons", status: "Off-plan" },
      { img: "damac-district", name: "DAMAC District — Tower A", developer: "DAMAC", area: "DAMAC Hills", type: "Apartments", price: "Price on request", meta: "Live · Work · Play by the golf course", status: "Off-plan" },
      { img: "emaar-lavita", name: "Lavita", developer: "Emaar", area: "The Oasis by Emaar", type: "6–7 bedroom mansions", price: "Price on request", meta: "43 mansions · 21,000–35,500 sq.ft", status: "Off-plan" },
      { img: "emaar-palmiera", name: "Palmiera", developer: "Emaar", area: "The Oasis by Emaar", type: "Townhouses & villas, 3–6 bedrooms", price: "Price on request", meta: "Villas by the lagoon and water canals", status: "Off-plan" },
      { img: "beyond-kanyon", name: "Kanyon", developer: "Beyond", area: "Dubai Maritime City", type: "1–3 bedroom apartments", price: "Price on request", meta: "Tower in the Forest District · spa & sky pool", status: "Off-plan" },
      { img: "beyond-soulever", name: "Soulever", developer: "Beyond", area: "Dubai Maritime City", type: "Luxury apartments", price: "Price on request", meta: "Twin towers by the coast, next to Forest & Cove", status: "Off-plan" },
    ],
  },

  goals: {
    tag: "Where to start",
    h2: "What do you want to do?",
    sub: "Pick a goal — we'll show suitable units, indicative costs and the next step.",
    cards: [
      { title: "Buy income property", desc: "Ready units in Dubai for rental income — with a yield calculation.", cta: "Learn more" },
      { title: "Invest in off-plan", desc: "Under-construction projects with growth potential and flexible payment plans.", cta: "Learn more" },
      { title: "Buy a house or villa", desc: "Villas and townhouses for family living — area, schools, amenities.", cta: "Learn more" },
      { title: "Relocate your family", desc: "A unit matched to your family's needs and daily life.", cta: "Learn more" },
      { title: "Calculate the costs", desc: "Compare units by price per m², costs and indicative yield.", cta: "Learn more" },
      { title: "Personal living", desc: "A home for your lifestyle and budget — for yourself, not for rent.", cta: "Learn more" },
    ],
  },

  areas: {
    tag: "Areas",
    h2: "Where to look in the UAE",
    sub: "Dubai is the core market. We source other emirates when suitable units for your goal are available.",
    cards: [
      { name: "Dubai", desc: "The widest choice: Marina, Downtown, Business Bay, Creek Harbour, JVC and other areas." },
      { name: "Abu Dhabi", desc: "A calmer market and select projects — sourced on request." },
      { name: "Ras Al Khaimah", desc: "Coastal and resort projects — considered when current options are available." },
    ],
  },

  readyOffplan: {
    tag: "Purchase format",
    h2: "Ready or off-plan — which suits you?",
    sub: "We'll explain the difference without one-sided promotion — the choice depends on your goal and time horizon.",
    ready: {
      title: "Ready property",
      points: ["Use or rent out immediately", "Clear rental income", "Full payment or mortgage", "Less dependent on developer timelines"],
    },
    offplan: {
      title: "Off-plan (under construction)",
      points: ["Lower entry price and installment plans", "Growth potential by handover", "Staged payments via escrow", "Handover timing depends on the developer"],
    },
    cta: "Compare options for my goal",
  },

  why: {
    tag: "Advantages",
    h2: "Why clients choose us",
    sub: "We work on transparency and careful unit selection — without loud promises.",
    cards: [
      { title: "Support in your language", desc: "Managers, documents and correspondence — no language barrier." },
      { title: "Selection by goal", desc: "We help pick the unit and market for your objective, not push one option." },
      { title: "Transparent assessment", desc: "We explain costs, timelines and deal risks up front." },
      { title: "No false guarantees", desc: "We don't promise a fixed yield or an automatic visa." },
      { title: "Unit vetting", desc: "We help with due diligence: developer, contract, terms." },
      { title: "Deal support", desc: "We guide you from selection to handover and the next step." },
    ],
  },

  process: {
    tag: "Process",
    h2: "How the deal works",
    sub: "We don't just show a list of units — we help you through the deal step by step.",
    steps: [
      { title: "Goal & budget", description: "We define the objective: income, capital growth or personal living." },
      { title: "Unit selection", description: "We compare areas, developers and unit types within budget." },
      { title: "Due diligence", description: "Developer, contract, and a cost and yield breakdown." },
      { title: "Reservation / contract", description: "Reserving the unit and paperwork — with every step explained." },
      { title: "Registration & handover", description: "Registration at the DLD and handover, then the next step." },
    ],
    remote: "Some steps — selection, reservation and part of the payment — can be done remotely. Certain stages may require personal presence or a notarised power of attorney; this depends on the unit and your situation.",
  },

  costs: {
    tag: "Costs",
    h2: "Costs beyond the property price",
    sub: "An indicative list of associated costs when buying in Dubai. Exact amounts depend on the unit and the deal.",
    items: [
      { name: "DLD registration", note: "≈ 4% of the property value (Dubai Land Department)" },
      { name: "Admin / trustee fees", note: "Fixed fees for registering the transaction" },
      { name: "Developer NOC", note: "Transfer no-objection fee (for resale)" },
      { name: "Agency commission", note: "Usually ≈ 2% — confirmed per unit" },
      { name: "Mortgage (if needed)", note: "Bank and valuation fees when financing" },
      { name: "Service charge", note: "Annual maintenance — depends on the project" },
    ],
    note: "This information is general. Final costs, yield and timelines depend on the unit, developer and market conditions at the time of the deal.",
    cta: "Calculate the total budget",
  },

  cases: {
    tag: "Examples",
    h2: "How it looks in practice",
    sub: "Generalised examples of client requests. Verifiable reviews and case studies will be added separately.",
    cards: [
      { img: "case-investor", goal: "Investment", text: "Sourced a ready studio in Dubai Marina for rental, with a yield and cost breakdown." },
      { img: "case-family", goal: "Family relocation", text: "Helped a family choose a townhouse considering the area, schools and amenities." },
      { img: "case-entrepreneur", goal: "Off-plan", text: "Guided an off-plan purchase in Business Bay with a 60/40 installment plan and developer vetting." },
      { img: "case-business", goal: "Diversification", text: "Compared the UAE with neighbouring markets and selected a unit for a long-term strategy." },
    ],
  },

  residency: {
    tag: "Residency",
    h2: "Property and the resident visa",
    sub: "Buying property above a certain amount may grant eligibility for a UAE resident visa. This is not automatic — conditions are checked separately against the official rules (ICP).",
    cta: "Check visa conditions",
  },

  faq: {
    tag: "FAQ",
    h2: "Frequently asked questions",
    items: [
      { question: "Can I buy property in the UAE remotely?", answer: "Yes — many steps such as selecting the unit, reserving and part of the payment can be done remotely. Final registration sometimes requires personal presence or a notarised power of attorney." },
      { question: "How much does an apartment in Dubai cost?", answer: "The range is wide: studios in affordable areas from roughly $190,000, units in premium areas considerably higher. We'll send an exact shortlist for your budget after a short form." },
      { question: "How is off-plan different from ready property?", answer: "Off-plan is bought during construction — a lower entry price and installments, but handover depends on the developer's timeline. A ready unit can be used or rented immediately." },
      { question: "What costs are there beyond the property price?", answer: "Typically DLD registration (≈ 4%), admin fees and agency commission, plus bank fees for a mortgage and an annual service charge where applicable." },
      { question: "How are off-plan payments protected?", answer: "Payments go to regulated escrow accounts tied to construction milestones — the developer doesn't receive the full amount up front." },
      { question: "Does buying property grant a resident visa?", answer: "A purchase above a certain amount may grant eligibility, but not automatically. Conditions and eligibility are checked separately against the official rules." },
    ],
  },

  form: {
    namePlaceholder: "Your name",
    phonePlaceholder: "WhatsApp number",
    phoneHint: "Please include your country code.",
    cta: "Get a property shortlist",
    cta_title: "Get a shortlist matched to your goal",
    cta_sub: "Leave your name and WhatsApp number — an advisor will confirm your goal and send suitable options.",
    sending: "Sending…",
    thankYou: "Thank you! An advisor will contact you shortly.",
    errorRequired: "Please enter your name and WhatsApp number.",
    errorGeneric: "Something went wrong. Please try again.",
    consent: "By submitting this form you agree to be contacted. We respect your privacy and never share your data with third parties.",
  },
};

const ru: typeof en = {
  meta: {
    title: "Купить недвижимость в Дубае и ОАЭ — подбор с поддержкой | Residency24",
    description:
      "Подберём недвижимость в Дубае и ОАЭ под вашу цель, бюджет и формат покупки — готовые и off-plan объекты, расчёт расходов и доходности, консультация на русском.",
  },

  hero: {
    pill: "Недвижимость в Дубае и ОАЭ · консультация на русском",
    h1: "Недвижимость в Дубае и ОАЭ под ваши цели — с поддержкой на русском",
    sub: "Подберём актуальные объекты для инвестиций или личного проживания, сравним районы, формат покупки и расходы — без обещаний гарантированной доходности и автоматической визы.",
    bullets: [
      "Консультация и сопровождение на русском",
      "Готовые и off-plan объекты в Дубае и ОАЭ",
      "Прозрачный расчёт расходов до сделки",
      "Помощь с проверкой застройщика и документами",
    ],
    cta_primary: "Получить подборку объектов",
    cta_whatsapp: "Написать в WhatsApp",
    advisor: {
      pill: "AI-консультант · Бесплатно · 24/7",
      h3: "Спросите AI-консультанта",
      p: "Мгновенные ответы о покупке недвижимости в Дубае и ОАЭ.",
      placeholder: "Например: сколько стоит квартира в Дубае?",
      questions_label: "Популярные вопросы:",
      questions: [
        "Сколько стоит квартира в Дубае?",
        "Чем off-plan отличается от готовой недвижимости?",
        "Можно ли купить недвижимость в ОАЭ удалённо?",
        "Какие расходы кроме цены объекта?",
      ],
    },
  },

  trust: [
    "Консультация на русском",
    "Актуальные проекты и условия",
    "Понятное объяснение этапов и расходов",
    "Без гарантий доходности и визы",
  ],

  stats: [
    { display: "Дубай и ОАЭ", label: "Основные рынки" },
    { display: "Off-plan + готовое", label: "Форматы покупки" },
    { display: "Расчёт расходов", label: "До сделки" },
    { display: "RU · EN · FA · AR", label: "Языки поддержки" },
  ],

  projects: {
    tag: "Объекты",
    h2: "Актуальные проекты в Дубае и ОАЭ",
    sub: "Подборка проектов от ведущих застройщиков — DAMAC, Emaar и Beyond. Полную подборку под вашу цель и бюджет пришлём после короткой анкеты.",
    note: "Проекты застройщиков DAMAC, Emaar и Beyond. Цены и наличие уточняются под ваш запрос и зависят от типа объекта и стадии проекта.",
    cta: "Получить детали проекта",
    cards: [
      { img: "damac-islands-2", name: "DAMAC Islands 2", developer: "DAMAC", area: "Дубай", type: "Виллы, твин-виллы, таунхаусы", price: "Цена по запросу", meta: "Сообщество у воды с лагунами", status: "Off-plan" },
      { img: "damac-district", name: "DAMAC District — Tower A", developer: "DAMAC", area: "DAMAC Hills", type: "Апартаменты", price: "Цена по запросу", meta: "Live · Work · Play у гольф-поля", status: "Off-plan" },
      { img: "emaar-lavita", name: "Lavita", developer: "Emaar", area: "The Oasis by Emaar", type: "Особняки 6–7 спален", price: "Цена по запросу", meta: "43 особняка · 21 000–35 500 sq.ft", status: "Off-plan" },
      { img: "emaar-palmiera", name: "Palmiera", developer: "Emaar", area: "The Oasis by Emaar", type: "Таунхаусы и виллы 3–6 спален", price: "Цена по запросу", meta: "Виллы у лагуны и водных каналов", status: "Off-plan" },
      { img: "beyond-kanyon", name: "Kanyon", developer: "Beyond", area: "Dubai Maritime City", type: "Апартаменты 1–3 спальни", price: "Цена по запросу", meta: "Небоскрёб в Forest District · спа и sky pool", status: "Off-plan" },
      { img: "beyond-soulever", name: "Soulever", developer: "Beyond", area: "Dubai Maritime City", type: "Люксовые апартаменты", price: "Цена по запросу", meta: "Две башни у побережья, рядом с Forest & Cove", status: "Off-plan" },
    ],
  },

  goals: {
    tag: "С чего начать",
    h2: "Что вы хотите сделать?",
    sub: "Выберите цель — покажем подходящие объекты, ориентировочные расходы и следующий шаг.",
    cards: [
      { title: "Купить доходную недвижимость", desc: "Готовые объекты в Дубае под арендный доход — с расчётом доходности.", cta: "Подробнее" },
      { title: "Инвестировать в off-plan", desc: "Строящиеся проекты с потенциалом роста и гибкими планами оплаты.", cta: "Подробнее" },
      { title: "Купить дом или виллу", desc: "Виллы и таунхаусы для жизни семьи — район, школы, инфраструктура.", cta: "Подробнее" },
      { title: "Переезд семьи", desc: "Подбор объекта под нужды вашей семьи и повседневную жизнь.", cta: "Подробнее" },
      { title: "Рассчитать расходы", desc: "Сравните объекты по цене за м², расходам и ориентировочной доходности.", cta: "Подробнее" },
      { title: "Личное проживание", desc: "Объект под ваш образ жизни и бюджет — для себя, а не под аренду.", cta: "Подробнее" },
    ],
  },

  areas: {
    tag: "Районы",
    h2: "Где искать в ОАЭ",
    sub: "Дубай — основной рынок. Другие эмираты подбираем при наличии подходящих объектов под вашу цель.",
    cards: [
      { name: "Дубай", desc: "Самый широкий выбор: Marina, Downtown, Business Bay, Creek Harbour, JVC и другие районы." },
      { name: "Абу-Даби", desc: "Более спокойный рынок и отдельные проекты — подбираем по запросу." },
      { name: "Рас-эль-Хайма", desc: "Прибрежные и курортные проекты — рассматриваем при наличии актуальных вариантов." },
    ],
  },

  readyOffplan: {
    tag: "Формат покупки",
    h2: "Готовое или off-plan — что подходит вам?",
    sub: "Разберём разницу без одностороннего продвижения — выбор зависит от вашей цели и горизонта.",
    ready: {
      title: "Готовая недвижимость",
      points: ["Можно использовать или сдавать сразу", "Понятный арендный доход", "Оплата целиком или ипотека", "Меньше зависимость от сроков застройщика"],
    },
    offplan: {
      title: "Off-plan (на стадии строительства)",
      points: ["Ниже цена входа и планы рассрочки", "Потенциал роста стоимости к сдаче", "Платежи по этапам через эскроу", "Срок передачи зависит от застройщика"],
    },
    cta: "Сравнить варианты под мою цель",
  },

  why: {
    tag: "Преимущества",
    h2: "Почему клиенты выбирают нас",
    sub: "Работаем на прозрачности и тщательном подборе объекта — без громких обещаний.",
    cards: [
      { title: "Поддержка на русском", desc: "Менеджеры, документы и переписка — без языкового барьера." },
      { title: "Выбор под цель", desc: "Помогаем выбрать объект и рынок под вашу задачу, а не навязываем один вариант." },
      { title: "Прозрачная оценка", desc: "Заранее объясняем расходы, сроки и риски сделки." },
      { title: "Без ложных гарантий", desc: "Не обещаем фиксированную доходность или автоматическую визу." },
      { title: "Проверка объекта", desc: "Помогаем с due diligence: застройщик, договор, условия." },
      { title: "Сопровождение сделки", desc: "Ведём от подбора до передачи объекта и следующего шага." },
    ],
  },

  process: {
    tag: "Процесс",
    h2: "Как проходит сделка",
    sub: "Мы не просто показываем список объектов — помогаем пройти сделку по шагам.",
    steps: [
      { title: "Цель и бюджет", description: "Определяем задачу: доход, рост капитала или личное проживание." },
      { title: "Подбор объекта", description: "Сравниваем районы, застройщиков и типы объектов в рамках бюджета." },
      { title: "Проверка", description: "Due diligence: застройщик, договор, расчёт расходов и доходности." },
      { title: "Бронирование / договор", description: "Резерв объекта и оформление — с объяснением каждого шага." },
      { title: "Регистрация и передача", description: "Оформление в DLD и передача объекта, дальше — следующий шаг." },
    ],
    remote: "Часть шагов — подбор, бронирование и часть оплаты — можно сделать удалённо. Для отдельных этапов может понадобиться личное присутствие или нотариальная доверенность; условия зависят от объекта и вашей ситуации.",
  },

  costs: {
    tag: "Расходы",
    h2: "Расходы кроме цены объекта",
    sub: "Ориентировочный список сопутствующих расходов при покупке в Дубае. Точные суммы зависят от объекта и сделки.",
    items: [
      { name: "Регистрация в DLD", note: "≈ 4% от стоимости объекта (Dubai Land Department)" },
      { name: "Административные сборы / трасти", note: "Фиксированные сборы за регистрацию сделки" },
      { name: "NOC застройщика", note: "Сбор за разрешение на передачу (для вторички)" },
      { name: "Комиссия агентства", note: "Обычно ≈ 2% — уточняется по объекту" },
      { name: "Ипотека (если нужна)", note: "Банковские и оценочные сборы при финансировании" },
      { name: "Service charge", note: "Ежегодное обслуживание — зависит от проекта" },
    ],
    note: "Информация носит общий характер. Итоговые расходы, доходность и сроки зависят от объекта, застройщика и рыночных условий на момент сделки.",
    cta: "Рассчитать общий бюджет",
  },

  cases: {
    tag: "Примеры",
    h2: "Как это выглядит на практике",
    sub: "Обобщённые примеры запросов клиентов. Проверяемые отзывы и кейсы добавим отдельно.",
    cards: [
      { img: "case-investor", goal: "Инвестиции", text: "Подобрали готовую студию в Dubai Marina под аренду с расчётом доходности и расходов." },
      { img: "case-family", goal: "Переезд семьи", text: "Помогли семье выбрать таунхаус с учётом района, школ и инфраструктуры." },
      { img: "case-entrepreneur", goal: "Off-plan", text: "Сопроводили покупку off-plan в Business Bay с планом рассрочки 60/40 и проверкой застройщика." },
      { img: "case-business", goal: "Диверсификация", text: "Сравнили ОАЭ и соседние рынки и подобрали объект под долгосрочную стратегию." },
    ],
  },

  residency: {
    tag: "Резидентство",
    h2: "Недвижимость и виза резидента",
    sub: "Покупка недвижимости от определённой суммы может давать право на резидентскую визу ОАЭ. Это не происходит автоматически — условия проверяются отдельно по официальным правилам (ICP).",
    cta: "Проверить условия визы",
  },

  faq: {
    tag: "FAQ",
    h2: "Частые вопросы",
    items: [
      { question: "Можно ли купить недвижимость в ОАЭ удалённо?", answer: "Да, многие шаги — выбор объекта, бронирование и часть оплаты — можно сделать удалённо. Для финального оформления иногда нужно личное присутствие или нотариальная доверенность." },
      { question: "Сколько стоит квартира в Дубае?", answer: "Диапазон широкий: студии в доступных районах — примерно от $190 000, объекты в премиальных районах — существенно выше. Точную подборку под бюджет пришлём после короткой анкеты." },
      { question: "Чем off-plan отличается от готовой недвижимости?", answer: "Off-plan покупается на стадии строительства — ниже цена входа и есть рассрочка, но передача зависит от сроков застройщика. Готовый объект можно использовать или сдавать сразу." },
      { question: "Какие расходы кроме цены объекта?", answer: "Обычно это регистрация в DLD (≈ 4%), административные сборы, комиссия агентства, при необходимости — банковские сборы по ипотеке и ежегодный service charge." },
      { question: "Как защищены платежи по off-plan?", answer: "Платежи поступают на регулируемые эскроу-счета, привязанные к этапам строительства — застройщик не получает всю сумму сразу." },
      { question: "Даёт ли покупка недвижимости визу резидента?", answer: "Покупка от определённой суммы может давать право на визу, но не автоматически. Условия и право на визу проверяются отдельно по официальным правилам." },
    ],
  },

  form: {
    namePlaceholder: "Ваше имя",
    phonePlaceholder: "Номер WhatsApp",
    phoneHint: "Пожалуйста, укажите код страны.",
    cta: "Получить подборку объектов",
    cta_title: "Получите подборку объектов под вашу цель",
    cta_sub: "Оставьте имя и номер WhatsApp — русскоязычный консультант уточнит цель и пришлёт подходящие варианты.",
    sending: "Отправка…",
    thankYou: "Спасибо! Русскоязычный консультант свяжется с вами в ближайшее время.",
    errorRequired: "Пожалуйста, укажите имя и номер WhatsApp.",
    errorGeneric: "Что-то пошло не так. Попробуйте ещё раз.",
    consent: "Отправляя форму, вы соглашаетесь на то, чтобы мы с вами связались. Мы уважаем вашу конфиденциальность и не передаём ваши данные третьим лицам.",
  },
};

export const CONTENT = { en, ru };

/** Pick the landing content for a locale: ru → Russian, everything else → English. */
export function getLandingContent(lang: string): LandingContent {
  return lang === "ru" ? CONTENT.ru : CONTENT.en;
}

export type LandingContent = typeof en;
