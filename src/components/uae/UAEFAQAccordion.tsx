"use client";

import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import type { Lang } from "@/translations";

const FAQ_DATA: Record<Lang, Array<{ q: string; a: string }>> = {
  fa: [
    { q: "حداقل سرمایه برای گلدن ویزا امارات چقدر است؟", a: "برای مسیر ملک: ۲ میلیون درهم. برای مسیر شرکت: از ۲۰,۰۰۰ درهم. رزیدنسی۲۴ بهترین مسیر را برای وضعیت شما پیدا می‌کند." },
    { q: "آیا برای ثبت شرکت در دبی حتماً باید به امارات بروم؟", a: "خیر. رزیدنسی۲۴ فرآیند ثبت شرکت را کاملاً از راه دور انجام می‌دهد. تنها برای گرفتن اثر انگشت نیاز به یک بار حضور است." },
    { q: "آیا می‌توانم همزمان در ایران و امارات اقامت داشته باشم؟", a: "بله. گلدن ویزا امارات هیچ شرط حداقل اقامتی ندارد. می‌توانید هر مقدار خارج از امارات باشید." },
    { q: "گلدن ویزای امارات چه کسانی را شامل می‌شود؟", a: "همسر، فرزندان زیر ۱۸ سال (دختران تا هر سن)، پسران تا ۲۵ سال اگر دانشجو باشند، و کارگر خانگی." },
    { q: "هزینه واقعی ثبت شرکت در دبی چقدر است؟", a: "Free Zone از ۱۸,۰۰۰ درهم، Mainland LLC از ۲۱,۰۰۰ درهم. تمدید سالانه ۱۲,۰۰۰-۲۵,۰۰۰ درهم." },
    { q: "آیا ملک off-plan برای گلدن ویزا واجد شرایط است؟", a: "بله. از ژانویه ۲۰۲۴، ملک‌های off-plan در هر مرحله ساخت (مشروط به ارزش ۲ میلیون درهم) واجد شرایط هستند." },
    { q: "چه مدت طول می‌کشد تا اقامت امارات صادر شود؟", a: "ویزا از طریق شرکت ۷-۱۴ روز. گلدن ویزا ۳-۶ هفته. ویزای توریستی ۲۴-۴۸ ساعت." },
    { q: "آیا مالیات ۹٪ شرکتی به همه شرکت‌ها تعلق می‌گیرد؟", a: "فقط برای سود بالای ۳۷۵,۰۰۰ درهم اعمال می‌شود. اکثر استارتاپ‌ها و شرکت‌های کوچک معاف هستند." },
  ],
  en: [
    { q: "What is the minimum investment for a UAE Golden Visa?", a: "Property route: AED 2 million. Company route: Golden Visa fees from AED 20,000. Residency24 identifies the most cost-effective path for you." },
    { q: "Can I register a company in Dubai without visiting?", a: "Yes. Residency24 handles the entire process remotely. You only need to visit once for biometrics." },
    { q: "Can I maintain residency in my home country while holding UAE residency?", a: "Yes. The UAE Golden Visa has no minimum stay requirement. You can remain outside the UAE for as long as you wish." },
    { q: "Who can be included in my UAE Golden Visa?", a: "Spouse, children under 18 (daughters of any age), sons up to 25 if in education, and one domestic worker." },
    { q: "What are the real costs of company registration in Dubai?", a: "Free Zone from AED 18,000, Mainland LLC from AED 21,000. Annual renewal typically AED 12,000\u201325,000." },
    { q: "Is off-plan property eligible for the UAE Golden Visa?", a: "Yes. Since January 2024, off-plan properties at any construction stage qualify provided the value reaches AED 2 million." },
    { q: "How long does UAE residency take to process?", a: "Company investor visa: 7\u201314 days. Golden Visa: 3\u20136 weeks. Tourist visa: 24\u201348 hours." },
    { q: "Does the 9% corporate tax apply to all UAE companies?", a: "Only applies to profits above AED 375,000 (~USD 102,000). Most startups and SMEs remain effectively exempt." },
  ],
  ar: [
    { q: "ما هو الحد الأدنى للاستثمار للحصول على الإقامة الذهبية في الإمارات؟", a: "عبر العقار: 2 مليون درهم. عبر الشركة: من 20,000 درهم. رزيدنسي24 يحدد المسار الأنسب لوضعك." },
    { q: "هل يمكنني تأسيس شركة في دبي دون زيارة الإمارات؟", a: "نعم. تتولى رزيدنسي24 كامل الإجراءات عن بُعد. تحتاج زيارة واحدة فقط للبصمة." },
    { q: "هل يمكن الجمع بين الإقامة في الإمارات والإقامة في بلدي؟", a: "نعم. لا تشترط الإقامة الذهبية حداً أدنى للإقامة." },
    { q: "من يمكن تضمينه في الإقامة الذهبية الإماراتية؟", a: "الزوج/الزوجة، والأبناء دون 18 عاماً، والأبناء حتى 25 عاماً إن كانوا طلاباً، وعامل منزلي." },
    { q: "ما هي التكلفة الفعلية لتأسيس شركة في دبي؟", a: "المنطقة الحرة: من 18,000 درهم. البر الرئيسي: من 21,000 درهم. التجديد السنوي: 12,000-25,000 درهم." },
    { q: "هل العقارات على الخارطة مؤهلة للإقامة الذهبية؟", a: "نعم. منذ يناير 2024، تؤهل العقارات على الخارطة للإقامة الذهبية بشرط أن تبلغ قيمتها 2 مليون درهم." },
    { q: "كم يستغرق الحصول على الإقامة في الإمارات؟", a: "تأشيرة المستثمر عبر الشركة: 7-14 يوماً. الإقامة الذهبية: 3-6 أسابيع. السياحية: 24-48 ساعة." },
    { q: "هل تنطبق ضريبة الشركات 9٪ على جميع الشركات؟", a: "تنطبق فقط على الأرباح التي تتجاوز 375,000 درهم. معظم الشركات الناشئة والصغيرة معفاة." },
  ],
  ru: [
    { q: "Каков минимальный размер инвестиций для золотой визы ОАЭ?", a: "Через недвижимость: 2 млн дирхам. Через компанию: от 20 000 дирхам. Residency24 подберёт оптимальный путь." },
    { q: "Можно ли зарегистрировать компанию в Дубае удалённо?", a: "Да. Residency24 ведёт весь процесс дистанционно. Личное присутствие нужно только один раз — для биометрии." },
    { q: "Можно ли сохранить резидентство в другой стране при наличии ВНЖ ОАЭ?", a: "Да. Золотая виза ОАЭ не требует минимального срока проживания." },
    { q: "Кого можно включить в золотую визу ОАЭ?", a: "Супруга/супругу, детей до 18 лет, сыновей до 25 лет при условии учёбы, и одного домашнего работника." },
    { q: "Каковы реальные расходы на регистрацию компании в Дубае?", a: "Свободная зона: от 18 000 дирхам. ООО на материке: от 21 000 дирхам. Ежегодное продление: 12 000\u201325 000 дирхам." },
    { q: "Подходит ли строящаяся недвижимость для золотой визы?", a: "Да. С января 2024 года строящаяся недвижимость при стоимости от 2 млн дирхам даёт право на золотую визу." },
    { q: "Сколько времени занимает оформление ВНЖ ОАЭ?", a: "Инвесторская виза через компанию: 7\u201314 дней. Золотая виза: 3\u20136 недель. Туристическая виза: 24\u201348 часов." },
    { q: "Распространяется ли корпоративный налог 9% на все компании ОАЭ?", a: "Только на прибыль свыше 375 000 дирхам. Большинство стартапов и малого бизнеса освобождены." },
  ],
};

export { FAQ_DATA };

export default function UAEFAQAccordion() {
  const { lang, t, isRTL } = useLanguage();
  const [open, setOpen] = useState<number | null>(null);
  const items = FAQ_DATA[lang as Lang] || FAQ_DATA.en;

  return (
    <section dir={isRTL ? "rtl" : "ltr"} className="py-16 px-4 bg-white">
      <div className="max-w-[800px] mx-auto">
        <h2 className="text-center text-2xl font-bold text-navy mb-8">
          {t.uae_faq_title}
        </h2>

        <div className="flex flex-col gap-2">
          {items.map((item, i) => (
            <div key={i} className="border border-border rounded-xl overflow-hidden">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className={`w-full flex items-center justify-between px-5 py-4 text-sm font-semibold text-navy transition-colors ${
                  isRTL ? "flex-row-reverse text-right" : "text-left"
                } ${open === i ? "bg-navy/5" : "bg-white hover:bg-muted/30"}`}
              >
                {item.q}
                <span className="text-lg text-navy flex-shrink-0 ms-3">
                  {open === i ? "\u2212" : "+"}
                </span>
              </button>
              {open === i && (
                <div className={`px-5 pb-4 pt-2 bg-muted/20 text-sm text-muted-foreground leading-relaxed ${isRTL ? "text-right" : "text-left"}`}>
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
