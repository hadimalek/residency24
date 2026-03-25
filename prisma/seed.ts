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
  // Create default admin user
  const passwordHash = await bcrypt.hash("admin123", 10);
  await prisma.user.upsert({
    where: { email: "admin@residency24.com" },
    update: {},
    create: {
      email: "admin@residency24.com",
      passwordHash,
      name: "مدیر سیستم",
      role: "ADMIN",
    },
  });

  // Check if already seeded with multilingual prompts
  const existingCount = await prisma.prompt.count({ where: { type: "SYSTEM", language: "en" } });
  if (existingCount > 0) {
    console.log("Already seeded. Skipping.");
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

  console.log("Seed completed!");
  console.log("Admin: admin@residency24.com / admin123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
