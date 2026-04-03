"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import * as LucideIcons from "lucide-react";

export interface Step {
  number: number;
  titleKey: string;
  descriptionKey: string;
  icon?: string;
  duration?: string;
  isHighlighted?: boolean;
}

export interface SharedHowItWorksProps {
  steps: Step[];
  titleKey: string;
  subtitleKey?: string;
  variant?: "timeline" | "cards" | "numbered";
}

function getNestedValue(obj: any, path: string): string {
  return path.split(".").reduce((acc, key) => acc?.[key], obj) ?? path;
}

function LucideIcon({ name, className }: { name: string; className?: string }) {
  const iconMap: Record<string, React.ComponentType<any>> = LucideIcons as any;
  const pascalName = name
    .split("-")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join("");
  const Icon = iconMap[pascalName];
  if (!Icon) return null;
  return <Icon size={20} className={className} />;
}

export default function SharedHowItWorks({
  steps,
  titleKey,
  subtitleKey,
  variant = "numbered",
}: SharedHowItWorksProps) {
  const { t, isRTL } = useLanguage();

  const title = getNestedValue(t, titleKey);
  const subtitle = subtitleKey ? getNestedValue(t, subtitleKey) : undefined;

  return (
    <section
      className="py-20 bg-[#F8F8F8]"
      style={{ direction: isRTL ? "rtl" : "ltr" }}
    >
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-14">
          <h2 className="text-[#001E6E] font-bold text-2xl md:text-3xl mb-2">
            {title}
          </h2>
          {subtitle && (
            <p className="text-[#6E6E6E] text-[15px]">{subtitle}</p>
          )}
        </div>

        {variant === "numbered" && (
          <NumberedVariant steps={steps} t={t} isRTL={isRTL} />
        )}
        {variant === "cards" && (
          <CardsVariant steps={steps} t={t} />
        )}
        {variant === "timeline" && (
          <TimelineVariant steps={steps} t={t} isRTL={isRTL} />
        )}
      </div>
    </section>
  );
}

function NumberedVariant({
  steps,
  t,
  isRTL,
}: {
  steps: Step[];
  t: any;
  isRTL: boolean;
}) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 relative">
      <div className="hidden md:block absolute top-6 inset-x-[12%] border-t-2 border-dashed border-[#DCC896]/30" />
      {steps.map((step, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.4, delay: i * 0.12 }}
          className={`text-center relative flex flex-col items-center ${
            step.isHighlighted ? "ring-2 ring-[#DCC896] rounded-xl p-4" : ""
          }`}
        >
          <div className="w-12 h-12 rounded-full bg-[#001E6E] text-[#DCC896] flex items-center justify-center text-sm font-bold mb-4 relative z-10">
            {String(step.number).padStart(2, "0")}
          </div>
          <h3 className="text-base font-semibold text-[#001E6E] mb-1">
            {getNestedValue(t, step.titleKey)}
          </h3>
          <p className="text-[13px] text-[#6E6E6E] leading-relaxed">
            {getNestedValue(t, step.descriptionKey)}
          </p>
          {step.duration && (
            <span className="text-xs text-[#DCC896] mt-2 font-medium">
              {step.duration}
            </span>
          )}
        </motion.div>
      ))}
    </div>
  );
}

function CardsVariant({ steps, t }: { steps: Step[]; t: any }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {steps.map((step, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.4, delay: i * 0.12 }}
          className={`bg-white border rounded-xl p-5 ${
            step.isHighlighted
              ? "border-2 border-[#DCC896]"
              : "border-[#E5E7EB]"
          }`}
        >
          <div className="flex items-center gap-3 mb-3">
            {step.icon && (
              <div className="bg-[#001E6E]/8 rounded-lg p-2">
                <LucideIcon name={step.icon} className="text-[#001E6E]" />
              </div>
            )}
            <span className="text-xs text-[#DCC896] font-bold">
              {String(step.number).padStart(2, "0")}
            </span>
          </div>
          <h3 className="text-sm font-semibold text-[#001E6E] mb-1">
            {getNestedValue(t, step.titleKey)}
          </h3>
          <p className="text-xs text-[#6E6E6E] leading-relaxed">
            {getNestedValue(t, step.descriptionKey)}
          </p>
          {step.duration && (
            <span className="inline-block text-xs text-[#DCC896] mt-2 font-medium">
              {step.duration}
            </span>
          )}
        </motion.div>
      ))}
    </div>
  );
}

function TimelineVariant({
  steps,
  t,
  isRTL,
}: {
  steps: Step[];
  t: any;
  isRTL: boolean;
}) {
  return (
    <div className="relative">
      <div className="hidden md:block absolute left-1/2 -translate-x-px top-0 bottom-0 w-0.5 bg-[#DCC896]/30" />
      <div className="space-y-8">
        {steps.map((step, i) => {
          const isLeft = i % 2 === 0;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: isLeft ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.4, delay: i * 0.12 }}
              className={`flex flex-col md:flex-row items-center gap-4 ${
                isLeft ? "md:flex-row" : "md:flex-row-reverse"
              }`}
            >
              <div
                className={`flex-1 ${isLeft ? "md:text-end" : "md:text-start"}`}
              >
                <h3 className="text-sm font-semibold text-[#001E6E] mb-1">
                  {getNestedValue(t, step.titleKey)}
                </h3>
                <p className="text-xs text-[#6E6E6E] leading-relaxed">
                  {getNestedValue(t, step.descriptionKey)}
                </p>
                {step.duration && (
                  <span className="text-xs text-[#DCC896] mt-1 inline-block font-medium">
                    {step.duration}
                  </span>
                )}
              </div>
              <div
                className={`w-10 h-10 rounded-full bg-[#001E6E] text-[#DCC896] flex items-center justify-center text-sm font-bold flex-shrink-0 z-10 ${
                  step.isHighlighted ? "ring-2 ring-[#DCC896]" : ""
                }`}
              >
                {String(step.number).padStart(2, "0")}
              </div>
              <div className="flex-1 hidden md:block" />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
