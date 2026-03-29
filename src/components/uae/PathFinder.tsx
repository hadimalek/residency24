"use client";

import { useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";

type Step = "q1" | "q2" | "q3" | "result";

interface Answers {
  goal?: string;
  budget?: string;
  time?: string;
}

const RESULT_MAP: Record<string, Record<string, { slug: string; key: string }>> = {
  visit: { _default: { slug: "visa/uae", key: "tourist_visa" } },
  invest: { _default: { slug: "uae/buy-property", key: "property" } },
  business: {
    high: { slug: "uae/golden-visa", key: "golden_visa" },
    vhigh: { slug: "uae/golden-visa", key: "golden_visa" },
    _default: { slug: "uae/company-registration", key: "company" },
  },
  residency: {
    high: { slug: "uae/golden-visa", key: "golden_visa" },
    vhigh: { slug: "uae/golden-visa", key: "golden_visa" },
    _default: { slug: "uae/company-registration", key: "company" },
  },
};

function getResult(answers: Answers) {
  const goalMap = RESULT_MAP[answers.goal || "residency"] || RESULT_MAP.residency;
  return goalMap[answers.budget || ""] || goalMap._default;
}

const RESULT_LABELS: Record<string, Record<string, string>> = {
  tourist_visa: { fa: "ویزای توریستی امارات", en: "UAE Tourist Visa", ar: "التأشيرة السياحية الإماراتية", ru: "Туристическая виза ОАЭ" },
  company:      { fa: "ثبت شرکت در دبی", en: "Company Registration in Dubai", ar: "تأسيس شركة في دبي", ru: "Регистрация компании в Дубае" },
  golden_visa:  { fa: "گلدن ویزا امارات", en: "UAE Golden Visa", ar: "الإقامة الذهبية الإماراتية", ru: "Золотая виза ОАЭ" },
  property:     { fa: "خرید ملک در دبی", en: "Buy Property in Dubai", ar: "شراء عقار في دبي", ru: "Покупка недвижимости в Дубае" },
};

const Q1_OPTIONS = [
  { id: "residency", icon: "\u{1F3E0}", labelKey: "pf_opt_residency" },
  { id: "business",  icon: "\u{1F4BC}", labelKey: "pf_opt_business" },
  { id: "invest",    icon: "\u{1F4C8}", labelKey: "pf_opt_invest" },
  { id: "visit",     icon: "\u{2708}\u{FE0F}", labelKey: "pf_opt_visit" },
];

const Q2_OPTIONS = [
  { id: "low",   icon: "\u{1F4B5}", labelKey: "pf_budget_low" },
  { id: "mid",   icon: "\u{1F4B0}", labelKey: "pf_budget_mid" },
  { id: "high",  icon: "\u{1F48E}", labelKey: "pf_budget_high" },
  { id: "vhigh", icon: "\u{1F3E6}", labelKey: "pf_budget_vhigh" },
];

const Q3_OPTIONS = [
  { id: "urgent", icon: "\u{26A1}", labelKey: "pf_time_urgent" },
  { id: "normal", icon: "\u{1F4C5}", labelKey: "pf_time_normal" },
  { id: "plan",   icon: "\u{1F5D3}\u{FE0F}", labelKey: "pf_time_plan" },
];

function OptionButton({ icon, label, onClick, isRTL }: { icon: string; label: string; onClick: () => void; isRTL: boolean }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 bg-white border-2 border-border rounded-xl px-5 py-4
        text-sm font-medium text-foreground transition-all hover:border-navy hover:bg-navy/5
        ${isRTL ? "flex-row-reverse text-right" : "text-left"}`}
    >
      <span className="text-xl">{icon}</span>
      {label}
    </button>
  );
}

export default function PathFinder() {
  const { lang, t, isRTL } = useLanguage();
  const [step, setStep] = useState<Step>("q1");
  const [answers, setAnswers] = useState<Answers>({});

  const handleQ1 = (goal: string) => { setAnswers({ goal }); setStep("q2"); };
  const handleQ2 = (budget: string) => { setAnswers((a) => ({ ...a, budget })); setStep("q3"); };
  const handleQ3 = (time: string) => { setAnswers((a) => ({ ...a, time })); setStep("result"); };
  const reset = () => { setAnswers({}); setStep("q1"); };

  const result = step === "result" ? getResult(answers) : null;

  return (
    <section dir={isRTL ? "rtl" : "ltr"} className="py-16 px-4 bg-navy">
      <div className="max-w-[640px] mx-auto">
        <h2 className="text-center text-2xl font-bold text-gold mb-8">
          {t.pf_section_title}
        </h2>

        <div className="bg-white rounded-2xl p-8">
          {/* Q1 */}
          {step === "q1" && (
            <>
              <p className="font-bold text-navy mb-4">{t.pf_q1_title}</p>
              <div className="flex flex-col gap-3">
                {Q1_OPTIONS.map((o) => (
                  <OptionButton key={o.id} icon={o.icon} label={t[o.labelKey]} onClick={() => handleQ1(o.id)} isRTL={isRTL} />
                ))}
              </div>
            </>
          )}

          {/* Q2 */}
          {step === "q2" && (
            <>
              <p className="font-bold text-navy mb-4">{t.pf_q2_title}</p>
              <div className="flex flex-col gap-3">
                {Q2_OPTIONS.map((o) => (
                  <OptionButton key={o.id} icon={o.icon} label={t[o.labelKey]} onClick={() => handleQ2(o.id)} isRTL={isRTL} />
                ))}
              </div>
            </>
          )}

          {/* Q3 */}
          {step === "q3" && (
            <>
              <p className="font-bold text-navy mb-4">{t.pf_q3_title}</p>
              <div className="flex flex-col gap-3">
                {Q3_OPTIONS.map((o) => (
                  <OptionButton key={o.id} icon={o.icon} label={t[o.labelKey]} onClick={() => handleQ3(o.id)} isRTL={isRTL} />
                ))}
              </div>
            </>
          )}

          {/* Result */}
          {step === "result" && result && (
            <div className="text-center">
              <div className="text-5xl mb-2">{"\u{1F3AF}"}</div>
              <p className="text-muted-foreground text-sm mb-1">
                {t.pf_recommendation}
              </p>
              <h3 className="text-xl font-bold text-navy mb-6">
                {RESULT_LABELS[result.key]?.[lang]}
              </h3>
              <div className="flex gap-3 justify-center flex-wrap">
                <Link
                  href={`/${lang}/${result.slug}/`}
                  className="bg-navy text-gold rounded-xl px-6 py-2.5 font-bold text-sm hover:bg-navy/90 transition-colors"
                >
                  {t.pf_result_detail}
                </Link>
                <a
                  href={`https://wa.me/971562009131?text=${encodeURIComponent(RESULT_LABELS[result.key]?.[lang] || "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#25D366] text-white rounded-xl px-6 py-2.5 font-bold text-sm hover:bg-[#20bd5a] transition-colors inline-flex items-center"
                >
                  {t.pf_result_cta}
                </a>
              </div>
              <button onClick={reset} className="mt-4 text-muted-foreground text-xs hover:text-foreground transition-colors">
                {"\u21A9"} {t.pf_restart}
              </button>
            </div>
          )}

          {/* Progress dots */}
          {step !== "result" && (
            <div className="flex justify-center gap-1.5 mt-6">
              {(["q1", "q2", "q3"] as Step[]).map((s) => (
                <div key={s} className={`w-2 h-2 rounded-full ${step === s ? "bg-navy" : "bg-border"}`} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
