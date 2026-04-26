import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const SYSTEM_PROMPTS = [
  {
    language: "fa",
    personaName: "مشاور رزیدنسی۲۴",
    content: `تو مشاور متخصص رزیدنسی۲۴ هستی — یک شرکت معتبر مشاوره اقامت و ثبت شرکت بین‌المللی.
شخصیت تو: مشاور متخصص، شریک قابل اعتماد، راهنمای بین‌المللی.

قوانین پاسخ‌دهی:
- همیشه به فارسی پاسخ بده
- لحن: گرم، رسمی-دوستانه، شفاف
- اعداد دقیق بگو — «از ۱۸,۰۰۰ AED» نه «ارزان»
- فعل فعال استفاده کن — «ما کمک می‌کنیم» نه «انجام می‌شود»
- هر پاسخ با یک CTA واضح تمام کن
- اگر سوال خارج از حوزه اقامت/ویزا/ثبت شرکت بود، مودبانه ریدایرکت کن
- از ایموجی استفاده نکن مگر کاربر بخواهد

رزیدنسی۲۴ در دبی، مشهد و مسقط دفتر دارد.
خدمات اصلی: ثبت شرکت امارات، گلدن ویزا، خرید ملک دبی، اقامت عمان، شهروندی ترکیه`,
  },
  {
    language: "en",
    personaName: "Residency24 Advisor",
    content: `You are the AI advisor for Residency24 — a leading international residency and company formation consultancy.
Your personality: Expert consultant, trusted partner, global guide.

Response rules:
- Always respond in English
- Tone: Professional, ROI-focused, concise
- Use specific numbers — "from AED 18,000" not "affordable"
- Active voice — "We help you" not "assistance is provided"
- End every response with a clear CTA
- If question is outside residency/visa/company formation, politely redirect

Residency24 has offices in Dubai, Mashhad, and Muscat.
Core services: UAE Company Formation, Golden Visa, Dubai Property Investment, Oman Residency, Turkey Citizenship`,
  },
  {
    language: "ar",
    personaName: "مستشار ريزيدنسي٢٤",
    content: `أنت مستشار ريزيدنسي٢٤ — شركة رائدة في استشارات الإقامة وتأسيس الشركات الدولية.
شخصيتك: خبير موثوق، شريك استراتيجي، مرشد دولي.

قواعد الرد:
- الرد دائماً باللغة العربية
- اللهجة: محترمة، موثوقة، عائلية
- استخدم الأرقام الدقيقة — «من ١٨,٠٠٠ درهم» لا «بأسعار معقولة»
- اختم كل رد بدعوة واضحة للتواصل
- إذا كان السؤال خارج نطاق الإقامة/التأشيرة/تأسيس الشركات، وجّه بلطف

ريزيدنسي٢٤ لديها مكاتب في دبي ومشهد ومسقط.
الخدمات الأساسية: تأسيس الشركات في الإمارات، الإقامة الذهبية، الاستثمار العقاري في دبي، إقامة عُمان، الجنسية التركية`,
  },
  {
    language: "ru",
    personaName: "Консультант Residency24",
    content: `Вы консультант Residency24 — ведущей международной компании по вопросам резидентства и регистрации бизнеса.
Ваш стиль: эксперт, надёжный партнёр, международный проводник.

Правила ответов:
- Всегда отвечать на русском языке
- Тон: прямой, практичный, ориентированный на решение
- Конкретные цифры — «от 18,000 AED» а не «доступно»
- Завершать каждый ответ чётким призывом к действию
- Если вопрос вне темы — вежливо перенаправить

Офисы Residency24 в Дубае, Мешхеде и Маскате.
Основные услуги: регистрация компании в ОАЭ, Золотая Виза, недвижимость в Дубае, резидентство Омана, гражданство Турции`,
  },
];

const KNOWLEDGE = [
  { lang: "fa", name: "ثبت شرکت امارات", order: 1, content: `انواع شرکت: Free Zone (مالکیت ۱۰۰٪، از ۵,۰۰۰ درهم)، Mainland (فعالیت در کل امارات، از ۱۵,۰۰۰ درهم)، Offshore (هلدینگ، از ۱۰,۰۰۰ درهم). مناطق آزاد معروف: DMCC, JAFZA, IFZA, RAK FTZ. مراحل: انتخاب فعالیت → نام شرکت → مدارک → لایسنس → حساب بانکی → ویزا. مالیات شرکتی ۹٪ برای سود بالای ۳۷۵,۰۰۰ درهم.` },
  { lang: "fa", name: "گلدن ویزای امارات", order: 2, content: `ویزای اقامت ۵ یا ۱۰ ساله. شرایط: سرمایه‌گذاری حداقل ۲ میلیون درهم، خرید ملک ۲M+، کارآفرینان، متخصصان. بدون نیاز به اسپانسر. امکان اسپانسر خانواده. هزینه: از ۲,۰۰۰ تا ۴,۰۰۰ درهم.` },
  { lang: "fa", name: "خرید ملک دبی", order: 3, content: `خرید ملک از ۷۵۰,۰۰۰ درهم → ویزای ۲ ساله سرمایه‌گذار. از ۲ میلیون درهم → گلدن ویزا. مناطق پرسود: Downtown Dubai (~6%), Dubai Marina (~7%), JVC (~8%).` },
  { lang: "fa", name: "اقامت عمان", order: 4, content: `هزینه‌های پایین‌تر از دبی. مناطق آزاد: Duqm, Salalah, Sohar. ثبت شرکت از ۵,۰۰۰ ریال عمانی. ویزای سرمایه‌گذار با خرید ملک ۵۰,۰۰۰+ ریال.` },
  { lang: "fa", name: "شهروندی ترکیه", order: 5, content: `سرمایه‌گذاری ۴۰۰,۰۰۰ دلار در ملک → شهروندی ترکیه. پاسپورت ترکیه: سفر بدون ویزا به ۱۱۰+ کشور. زمان: ۳-۶ ماه. شامل خانواده.` },
  { lang: "en", name: "UAE Company Registration", order: 1, content: `Types: Free Zone (100% ownership, from AED 5,000), Mainland (operate across UAE, from AED 15,000), Offshore (holding, from AED 10,000). Popular free zones: DMCC, JAFZA, IFZA, RAK FTZ. Corporate tax 9% on profit above AED 375,000.` },
  { lang: "en", name: "UAE Golden Visa", order: 2, content: `5 or 10-year residency visa. Eligibility: AED 2M+ investment, AED 2M+ property, entrepreneurs, skilled professionals. No sponsor required. Family sponsorship included. Cost: AED 2,000-4,000.` },
  { lang: "en", name: "Dubai Property Investment", order: 3, content: `AED 750,000+ property → 2-year investor visa. AED 2M+ → Golden Visa. Top ROI areas: Downtown (~6%), Marina (~7%), JVC (~8%).` },
  { lang: "en", name: "Oman Residency", order: 4, content: `Lower costs than Dubai. Free zones: Duqm, Salalah, Sohar. Company registration from OMR 5,000. Investor visa with OMR 50,000+ property.` },
  { lang: "en", name: "Turkey Citizenship", order: 5, content: `$400,000 property investment → Turkish citizenship. Passport: visa-free to 110+ countries. Processing: 3-6 months. Family included.` },
  { lang: "ar", name: "تأسيس الشركات في الإمارات", order: 1, content: `الأنواع: منطقة حرة (ملكية 100%، من 5,000 درهم)، البر الرئيسي (من 15,000 درهم)، أوفشور (من 10,000 درهم). المناطق الحرة: DMCC, JAFZA, IFZA. ضريبة 9% فوق 375,000 درهم.` },
  { lang: "ar", name: "الإقامة الذهبية", order: 2, content: `تأشيرة 5 أو 10 سنوات. الشروط: استثمار 2 مليون درهم+. بدون كفيل. كفالة الأسرة. التكلفة: 2,000-4,000 درهم.` },
  { lang: "ar", name: "الاستثمار العقاري في دبي", order: 3, content: `عقار 750,000 درهم+ → تأشيرة مستثمر سنتين. 2 مليون+ → الإقامة الذهبية.` },
  { lang: "ar", name: "إقامة عُمان", order: 4, content: `تكاليف أقل من دبي. المناطق الحرة: الدقم، صلالة، صحار. تأسيس شركة من 5,000 ريال.` },
  { lang: "ar", name: "الجنسية التركية", order: 5, content: `استثمار 400,000 دولار → الجنسية التركية. جواز سفر: 110+ دولة. المدة: 3-6 أشهر.` },
  { lang: "ru", name: "Регистрация компании в ОАЭ", order: 1, content: `Типы: Свободная зона (100%, от 5,000 AED), Материк (от 15,000 AED), Оффшор (от 10,000 AED). Зоны: DMCC, JAFZA, IFZA. Налог 9% свыше 375,000 AED.` },
  { lang: "ru", name: "Золотая Виза ОАЭ", order: 2, content: `5 или 10 лет. Инвестиции от 2 млн AED. Без спонсора. Семья включена. Стоимость: 2,000-4,000 AED.` },
  { lang: "ru", name: "Недвижимость в Дубае", order: 3, content: `От 750,000 AED → 2-летняя виза. От 2 млн → Золотая Виза. Районы: Downtown (~6%), Marina (~7%), JVC (~8%).` },
  { lang: "ru", name: "Резидентство Омана", order: 4, content: `Дешевле Дубая. Зоны: Дукм, Салала, Сохар. Компания от 5,000 OMR.` },
  { lang: "ru", name: "Гражданство Турции", order: 5, content: `$400,000 → гражданство. Паспорт: 110+ стран. Срок: 3-6 месяцев.` },
];

const PAGES = [
  { lang: "fa", slug: "uae/company-registration", name: "ثبت شرکت امارات", context: "تمرکز بر مقایسه Mainland و Free Zone. DMCC, JAFZA, IFZA را معرفی کن.", cta: "برای مشاوره رایگان ثبت شرکت، همین الان با ما تماس بگیرید." },
  { lang: "fa", slug: "uae/golden-visa", name: "گلدن ویزا امارات", context: "تمرکز بر شرایط ۲ میلیون درهم، مدت ۱۰ ساله، اسپانسر خانواده.", cta: "بررسی رایگان شرایط گلدن ویزای شما — همین الان تماس بگیرید." },
  { lang: "fa", slug: "uae/buy-property", name: "خرید ملک دبی", context: "مناطق پرسود: Downtown, Marina, JVC. آستانه ۷۵۰K و ۲M درهم.", cta: "مشاوره رایگان خرید ملک در دبی — تماس بگیرید." },
  { lang: "en", slug: "uae/company-registration", name: "UAE Company Setup", context: "Focus on Mainland vs Free Zone. Mention DMCC, JAFZA, IFZA.", cta: "Get your free company setup consultation today." },
  { lang: "en", slug: "uae/golden-visa", name: "UAE Golden Visa", context: "Focus on AED 2M eligibility, 10-year, family inclusion.", cta: "Check your Golden Visa eligibility — free consultation." },
  { lang: "en", slug: "uae/buy-property", name: "Dubai Property", context: "Areas: Downtown, Marina, JVC. ROI. AED 750K threshold.", cta: "Get your free property investment consultation." },
  { lang: "ar", slug: "uae/company-registration", name: "تأسيس الشركات", context: "مقارنة البر الرئيسي والمناطق الحرة.", cta: "احصل على استشارة مجانية." },
  { lang: "ar", slug: "uae/golden-visa", name: "الإقامة الذهبية", context: "شروط 2 مليون درهم، 10 سنوات.", cta: "تحقق من أهليتك مجاناً." },
  { lang: "ru", slug: "uae/company-registration", name: "Регистрация компании", context: "Сравнение Материка и Свободных зон.", cta: "Бесплатная консультация." },
  { lang: "ru", slug: "uae/golden-visa", name: "Золотая Виза", context: "2 млн AED, 10 лет, семья.", cta: "Проверьте eligibility бесплатно." },
];

async function main() {
  // Create default admin user.
  // Credentials read from env so production can override the bundled defaults.
  const adminEmail = process.env.ADMIN_EMAIL || "admin@residency24.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
  const adminName = process.env.ADMIN_NAME || "مدیر سیستم";
  const passwordHash = await bcrypt.hash(adminPassword, 10);
  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      passwordHash,
      name: adminName,
      role: "ADMIN",
    },
  });

  // ── Seed CMS sample data (idempotent — runs every time, skips when present)
  await seedCmsContent();

  // Check if already seeded with multilingual prompts (existing chat module)
  const existingCount = await prisma.prompt.count({ where: { type: "SYSTEM", language: "en" } });
  if (existingCount > 0) {
    console.log("Chat prompts already seeded. Skipping prompt block.");
    // Even if prompts are seeded, the CMS section above ran. Return now.
    return;
  }

  // Seed system prompts per language
  for (const sp of SYSTEM_PROMPTS) {
    await prisma.prompt.create({
      data: {
        name: `System Prompt - ${sp.language.toUpperCase()}`,
        type: "SYSTEM",
        language: sp.language,
        personaName: sp.personaName,
        content: sp.content,
        isActive: true,
        sortOrder: 0,
      },
    });
  }
  console.log(`Seeded ${SYSTEM_PROMPTS.length} system prompts`);

  // Seed knowledge base per language
  for (const ks of KNOWLEDGE) {
    await prisma.prompt.create({
      data: {
        name: ks.name,
        type: "KNOWLEDGE",
        language: ks.lang,
        content: ks.content,
        isActive: true,
        sortOrder: ks.order,
      },
    });
  }
  console.log(`Seeded ${KNOWLEDGE.length} knowledge sections`);

  // Seed page prompts
  for (const pp of PAGES) {
    await prisma.pagePrompt.create({
      data: {
        language: pp.lang,
        pageSlug: pp.slug,
        pageName: pp.name,
        contextPrompt: pp.context,
        ctaText: pp.cta,
        isActive: true,
      },
    });
  }
  console.log(`Seeded ${PAGES.length} page prompts`);

  // Seed default AI provider (user must update API key via admin panel)
  const existingProvider = await prisma.provider.count();
  if (existingProvider === 0) {
    await prisma.provider.create({
      data: {
        name: "OpenAI",
        apiKey: process.env.OPENAI_API_KEY || "sk-CHANGE-ME",
        model: "gpt-4o-mini",
        baseUrl: "https://api.openai.com/v1",
        temperature: 0.7,
        maxTokens: 1000,
        isActive: true,
      },
    });
    console.log("Seeded default AI provider (update API key in admin panel)");
  }

  console.log("Seed completed!");
  console.log("Admin: admin@residency24.com / admin123");
}

// ============================================================
// CMS SEED — Phase A
// 4 Languages · 3 Countries · 5 VisaTypes · 3 Services · 5 FAQs
// Idempotent: each entity uses upsert keyed by its natural unique field.
// ============================================================

const LANGUAGES = [
  { code: "en", name: "English",  nativeName: "English",   direction: "ltr", sortOrder: 0 },
  { code: "fa", name: "Persian",  nativeName: "فارسی",     direction: "rtl", sortOrder: 1 },
  { code: "ar", name: "Arabic",   nativeName: "العربية",   direction: "rtl", sortOrder: 2 },
  { code: "ru", name: "Russian",  nativeName: "Русский",   direction: "ltr", sortOrder: 3 },
];

const COUNTRIES = [
  {
    slug: "uae", iso2: "AE", iso3: "ARE", region: "Middle East", isFeatured: true, sortOrder: 0,
    translations: {
      en: { name: "United Arab Emirates", shortDescription: "Global business hub with 0% personal tax and 10-year Golden Visas." },
      fa: { name: "امارات متحده عربی",     shortDescription: "هاب جهانی کسب‌وکار با ۰٪ مالیات شخصی و گلدن ویزای ۱۰ ساله." },
      ar: { name: "الإمارات العربية المتحدة", shortDescription: "مركز أعمال عالمي مع ضريبة شخصية 0٪ وإقامة ذهبية لمدة 10 سنوات." },
      ru: { name: "ОАЭ",                   shortDescription: "Глобальный бизнес-хаб с 0% подоходным налогом и 10-летней Золотой визой." },
    },
  },
  {
    slug: "oman", iso2: "OM", iso3: "OMN", region: "Middle East", isFeatured: true, sortOrder: 1,
    translations: {
      en: { name: "Oman",   shortDescription: "Affordable residency and free zones (Duqm, Salalah, Sohar)." },
      fa: { name: "عمان",   shortDescription: "اقامت مقرون به صرفه و مناطق آزاد (دقم، صلاله، صحار)." },
      ar: { name: "عُمان",  shortDescription: "إقامة بأسعار معقولة ومناطق حرة (الدقم، صلالة، صحار)." },
      ru: { name: "Оман",   shortDescription: "Доступное резидентство и свободные зоны (Дукм, Салала, Сохар)." },
    },
  },
  {
    slug: "turkey", iso2: "TR", iso3: "TUR", region: "Eurasia", isFeatured: true, sortOrder: 2,
    translations: {
      en: { name: "Turkey", shortDescription: "Citizenship by investment from $400,000 — visa-free travel to 110+ countries." },
      fa: { name: "ترکیه", shortDescription: "شهروندی از طریق سرمایه‌گذاری از ۴۰۰,۰۰۰ دلار — سفر بدون ویزا به ۱۱۰+ کشور." },
      ar: { name: "تركيا", shortDescription: "الجنسية مقابل الاستثمار من 400,000 دولار — سفر بدون تأشيرة إلى أكثر من 110 دولة." },
      ru: { name: "Турция", shortDescription: "Гражданство за инвестиции от $400 000 — безвизовый въезд в 110+ стран." },
    },
  },
];

const VISA_TYPES = [
  { slug: "uae-golden-visa",       category: "golden",    isFeatured: true, sortOrder: 0,
    translations: {
      en: { name: "UAE Golden Visa",        shortDescription: "10-year residency for investors and skilled professionals, no sponsor required." },
      fa: { name: "گلدن ویزای امارات",      shortDescription: "اقامت ۱۰ ساله برای سرمایه‌گذاران و متخصصان بدون نیاز به اسپانسر." },
      ar: { name: "الإقامة الذهبية الإماراتية", shortDescription: "إقامة 10 سنوات للمستثمرين والمتخصصين، بدون كفيل." },
      ru: { name: "Золотая виза ОАЭ",       shortDescription: "10-летняя резиденция для инвесторов и квалифицированных специалистов, без спонсора." },
    },
  },
  { slug: "uae-investor-visa",     category: "investor",  isFeatured: true, sortOrder: 1,
    translations: {
      en: { name: "UAE Investor Visa",       shortDescription: "2-year residency from AED 750,000 in real estate." },
      fa: { name: "ویزای سرمایه‌گذار امارات", shortDescription: "اقامت ۲ ساله از خرید ملک ۷۵۰,۰۰۰ درهم." },
      ar: { name: "تأشيرة المستثمر الإماراتية", shortDescription: "إقامة سنتين بشراء عقار من 750,000 درهم." },
      ru: { name: "Инвесторская виза ОАЭ",   shortDescription: "ВНЖ на 2 года от 750 000 AED в недвижимости." },
    },
  },
  { slug: "uae-tourist-visa",      category: "tourist",   isFeatured: false, sortOrder: 2,
    translations: {
      en: { name: "UAE Tourist Visa",  shortDescription: "30-, 60-, or 90-day visa for short-term visits." },
      fa: { name: "ویزای توریستی امارات", shortDescription: "ویزای ۳۰، ۶۰ یا ۹۰ روزه برای بازدید کوتاه‌مدت." },
      ar: { name: "تأشيرة سياحية إماراتية", shortDescription: "تأشيرة 30 أو 60 أو 90 يوماً للزيارات قصيرة الأمد." },
      ru: { name: "Туристическая виза ОАЭ", shortDescription: "Виза на 30, 60 или 90 дней для краткосрочных визитов." },
    },
  },
  { slug: "oman-investor-visa",    category: "investor",  isFeatured: true, sortOrder: 3,
    translations: {
      en: { name: "Oman Investor Visa", shortDescription: "Residency through OMR 50,000+ property purchase or company registration." },
      fa: { name: "ویزای سرمایه‌گذاری عمان", shortDescription: "اقامت از طریق خرید ملک ۵۰,۰۰۰+ ریال عمانی یا ثبت شرکت." },
      ar: { name: "تأشيرة المستثمر العماني", shortDescription: "إقامة من خلال شراء عقار بقيمة 50,000 ريال عماني أو تأسيس شركة." },
      ru: { name: "Инвесторская виза Омана", shortDescription: "ВНЖ через покупку недвижимости от 50 000 OMR или регистрацию компании." },
    },
  },
  { slug: "turkey-citizenship",    category: "citizenship", isFeatured: true, sortOrder: 4,
    translations: {
      en: { name: "Turkish Citizenship by Investment", shortDescription: "Citizenship from $400,000 property investment in 3-6 months." },
      fa: { name: "شهروندی ترکیه از طریق سرمایه‌گذاری", shortDescription: "شهروندی از سرمایه‌گذاری ۴۰۰,۰۰۰ دلاری در ملک ظرف ۳-۶ ماه." },
      ar: { name: "الجنسية التركية بالاستثمار", shortDescription: "الجنسية مقابل استثمار عقاري بقيمة 400,000 دولار خلال 3-6 أشهر." },
      ru: { name: "Турецкое гражданство за инвестиции", shortDescription: "Гражданство за инвестиции $400 000 в недвижимость за 3-6 месяцев." },
    },
  },
];

const SERVICES = [
  { slug: "company-formation",   category: "company-formation",  isFeatured: true, sortOrder: 0,
    translations: {
      en: { name: "Company Formation",        shortDescription: "Mainland, Free Zone, and Offshore company setup with 100% foreign ownership." },
      fa: { name: "ثبت شرکت",                 shortDescription: "تأسیس شرکت در مین‌لند، فری‌زون و آفشور با مالکیت ۱۰۰٪ خارجی." },
      ar: { name: "تأسيس الشركات",            shortDescription: "تأسيس شركات البر الرئيسي والمنطقة الحرة والأوفشور بملكية أجنبية 100٪." },
      ru: { name: "Регистрация компании",     shortDescription: "Регистрация компаний на материке, в свободной зоне и оффшоре со 100% иностранным владением." },
    },
  },
  { slug: "property-investment", category: "property-investment", isFeatured: true, sortOrder: 1,
    translations: {
      en: { name: "Property Investment", shortDescription: "Curated Dubai, Oman, and Istanbul properties with residency eligibility." },
      fa: { name: "سرمایه‌گذاری در ملک", shortDescription: "املاک منتخب دبی، عمان و استانبول با امکان اخذ اقامت." },
      ar: { name: "الاستثمار العقاري",  shortDescription: "عقارات منتقاة في دبي وعُمان وإسطنبول مع إمكانية الإقامة." },
      ru: { name: "Инвестиции в недвижимость", shortDescription: "Подобранная недвижимость в Дубае, Омане и Стамбуле с правом на ВНЖ." },
    },
  },
  { slug: "residency-advisory",  category: "advisory",            isFeatured: true, sortOrder: 2,
    translations: {
      en: { name: "Residency Advisory", shortDescription: "End-to-end guidance from eligibility to landing." },
      fa: { name: "مشاوره اقامت",        shortDescription: "راهنمایی کامل از بررسی شرایط تا فرود در کشور مقصد." },
      ar: { name: "استشارات الإقامة",   shortDescription: "إرشاد متكامل من تقييم الأهلية إلى الوصول." },
      ru: { name: "Консультации по ВНЖ", shortDescription: "Сопровождение от проверки права до получения документов." },
    },
  },
];

const FAQS = [
  {
    category: "general", sortOrder: 0,
    translations: {
      en: { question: "What is the UAE Golden Visa?",                        answer: "A long-term residency visa (5 or 10 years) for investors, entrepreneurs, and skilled professionals. From AED 9,648." },
      fa: { question: "گلدن ویزای امارات چیست؟",                              answer: "یک ویزای اقامت بلندمدت ۵ یا ۱۰ ساله برای سرمایه‌گذاران، کارآفرینان و متخصصان. از ۹,۶۴۸ درهم." },
      ar: { question: "ما هي الإقامة الذهبية الإماراتية؟",                     answer: "تأشيرة إقامة طويلة الأمد (5 أو 10 سنوات) للمستثمرين ورواد الأعمال والمتخصصين. من 9,648 درهم." },
      ru: { question: "Что такое Золотая виза ОАЭ?",                          answer: "Долгосрочная резиденция (5 или 10 лет) для инвесторов и специалистов. От 9 648 AED." },
    },
  },
  {
    category: "cost", sortOrder: 1,
    translations: {
      en: { question: "How much does company registration in Dubai cost?",   answer: "Free Zone setup starts at AED 11,900; Mainland from AED 15,000. Final cost depends on activity license fees." },
      fa: { question: "هزینه ثبت شرکت در دبی چقدر است؟",                      answer: "ثبت در فری‌زون از ۱۱,۹۰۰ درهم و در مین‌لند از ۱۵,۰۰۰ درهم شروع می‌شود. هزینه نهایی به نوع لایسنس بستگی دارد." },
      ar: { question: "ما تكلفة تأسيس شركة في دبي؟",                          answer: "تبدأ المنطقة الحرة من 11,900 درهم؛ البر الرئيسي من 15,000 درهم. التكلفة النهائية تعتمد على نوع الرخصة." },
      ru: { question: "Сколько стоит регистрация компании в Дубае?",         answer: "Свободная зона — от 11 900 AED; материк — от 15 000 AED. Итоговая цена зависит от типа лицензии." },
    },
  },
  {
    category: "eligibility", sortOrder: 2,
    translations: {
      en: { question: "Can I get residency by buying property in Dubai?",     answer: "Yes. AED 750,000+ qualifies for a 2-year investor visa; AED 2M+ qualifies for the 10-year Golden Visa." },
      fa: { question: "آیا با خرید ملک در دبی می‌توان اقامت گرفت؟",            answer: "بله. ۷۵۰,۰۰۰ درهم → ویزای ۲ ساله سرمایه‌گذار. ۲ میلیون درهم → گلدن ویزای ۱۰ ساله." },
      ar: { question: "هل يمكن الحصول على إقامة بشراء عقار في دبي؟",            answer: "نعم. 750,000 درهم → تأشيرة مستثمر سنتين. 2 مليون درهم → الإقامة الذهبية لمدة 10 سنوات." },
      ru: { question: "Можно ли получить ВНЖ через покупку недвижимости?",    answer: "Да. От 750 000 AED — инвесторская виза на 2 года; от 2 млн AED — Золотая виза на 10 лет." },
    },
  },
  {
    category: "process", sortOrder: 3,
    translations: {
      en: { question: "How long does Turkish citizenship take?",              answer: "Typically 3-6 months from $400,000 property purchase to passport issuance, including spouse and minor children." },
      fa: { question: "اخذ شهروندی ترکیه چقدر طول می‌کشد؟",                   answer: "معمولاً ۳ تا ۶ ماه از خرید ملک ۴۰۰,۰۰۰ دلاری تا صدور پاسپورت، شامل همسر و فرزندان زیر سن." },
      ar: { question: "كم تستغرق الجنسية التركية؟",                            answer: "عادةً 3 إلى 6 أشهر من شراء عقار بقيمة 400,000 دولار حتى استلام الجواز، شاملاً الزوج والأبناء القاصرين." },
      ru: { question: "Сколько времени занимает турецкое гражданство?",       answer: "Обычно 3-6 месяцев от покупки недвижимости за $400 000 до выдачи паспорта, включая супруга и несовершеннолетних детей." },
    },
  },
  {
    category: "general", sortOrder: 4,
    translations: {
      en: { question: "Does Residency24 support multilingual clients?",        answer: "Yes. Full service in English, Persian, Arabic, and Russian, with offices in Dubai, Mashhad, and Muscat." },
      fa: { question: "آیا رزیدنسی۲۴ از مشتریان چندزبانه پشتیبانی می‌کند؟",     answer: "بله. خدمات کامل به انگلیسی، فارسی، عربی و روسی با دفاتر در دبی، مشهد و مسقط." },
      ar: { question: "هل تدعم Residency24 عملاء متعددي اللغات؟",               answer: "نعم. خدمة كاملة بالإنجليزية والفارسية والعربية والروسية، مع مكاتب في دبي ومشهد ومسقط." },
      ru: { question: "Поддерживает ли Residency24 многоязычных клиентов?",     answer: "Да. Полное обслуживание на английском, персидском, арабском и русском в Дубае, Мешхеде и Маскате." },
    },
  },
];

async function seedCmsContent() {
  // Languages — upsert by code
  for (const lang of LANGUAGES) {
    await prisma.language.upsert({
      where: { code: lang.code },
      update: {},
      create: lang,
    });
  }

  // Skip CMS content if any country already exists (idempotent guard)
  const countriesCount = await prisma.country.count();
  if (countriesCount > 0) {
    console.log("CMS content already seeded. Skipping.");
    return;
  }

  // Countries
  for (const c of COUNTRIES) {
    const country = await prisma.country.create({
      data: {
        slug: c.slug, iso2: c.iso2, iso3: c.iso3, region: c.region,
        isFeatured: c.isFeatured, sortOrder: c.sortOrder, isActive: true,
      },
    });
    for (const [locale, t] of Object.entries(c.translations)) {
      await prisma.countryTranslation.create({
        data: { countryId: country.id, locale, ...t },
      });
    }
  }
  console.log(`Seeded ${COUNTRIES.length} countries with translations.`);

  // Visa types
  for (const v of VISA_TYPES) {
    const visa = await prisma.visaType.create({
      data: {
        slug: v.slug, category: v.category, isFeatured: v.isFeatured,
        sortOrder: v.sortOrder, isActive: true,
      },
    });
    for (const [locale, t] of Object.entries(v.translations)) {
      await prisma.visaTypeTranslation.create({
        data: { visaTypeId: visa.id, locale, ...t },
      });
    }
  }
  console.log(`Seeded ${VISA_TYPES.length} visa types with translations.`);

  // Services
  for (const s of SERVICES) {
    const service = await prisma.service.create({
      data: {
        slug: s.slug, category: s.category, isFeatured: s.isFeatured,
        sortOrder: s.sortOrder, isActive: true,
      },
    });
    for (const [locale, t] of Object.entries(s.translations)) {
      await prisma.serviceTranslation.create({
        data: { serviceId: service.id, locale, ...t },
      });
    }
  }
  console.log(`Seeded ${SERVICES.length} services with translations.`);

  // Country–VisaType junctions
  const uae = await prisma.country.findUniqueOrThrow({ where: { slug: "uae" } });
  const oman = await prisma.country.findUniqueOrThrow({ where: { slug: "oman" } });
  const turkey = await prisma.country.findUniqueOrThrow({ where: { slug: "turkey" } });
  const visaSlugs = await prisma.visaType.findMany({ select: { id: true, slug: true } });
  const visaBySlug = Object.fromEntries(visaSlugs.map((v) => [v.slug, v.id]));

  await prisma.countryVisaType.createMany({
    data: [
      { countryId: uae.id,    visaTypeId: visaBySlug["uae-golden-visa"],    isPrimary: true },
      { countryId: uae.id,    visaTypeId: visaBySlug["uae-investor-visa"]                  },
      { countryId: uae.id,    visaTypeId: visaBySlug["uae-tourist-visa"]                   },
      { countryId: oman.id,   visaTypeId: visaBySlug["oman-investor-visa"], isPrimary: true },
      { countryId: turkey.id, visaTypeId: visaBySlug["turkey-citizenship"], isPrimary: true },
    ],
  });

  // Country–Service junctions (every service available in every country)
  const services = await prisma.service.findMany({ select: { id: true } });
  await prisma.countryService.createMany({
    data: [uae, oman, turkey].flatMap((country) =>
      services.map((s) => ({ countryId: country.id, serviceId: s.id }))
    ),
  });

  // FAQs
  for (const f of FAQS) {
    const faq = await prisma.faq.create({
      data: {
        category: f.category, sortOrder: f.sortOrder, isActive: true,
      },
    });
    for (const [locale, t] of Object.entries(f.translations)) {
      await prisma.faqTranslation.create({
        data: { faqId: faq.id, locale, ...t },
      });
    }
  }
  console.log(`Seeded ${FAQS.length} FAQs with translations.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
