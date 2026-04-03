"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

export interface Step {
  number: number;
  title: string;
  description: string;
  icon: LucideIcon;
  duration?: string;
  isHighlighted?: boolean;
}

interface SharedHowItWorksProps {
  steps: Step[];
  title?: string;
  subtitle?: string;
  variant?: "numbered" | "timeline" | "cards";
}

const SharedHowItWorks = ({ steps, title, subtitle, variant = "numbered" }: SharedHowItWorksProps) => {
  const { t } = useLanguage();

  return (
    <section className="py-16 bg-white">
      <div className="max-w-5xl mx-auto px-4">
        {title && (
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-navy">{title}</h2>
            {subtitle && <p className="text-muted-foreground mt-2">{subtitle}</p>}
          </div>
        )}

        {variant === "cards" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.1 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                  className={`bg-white border rounded-2xl p-5 text-center flex flex-col items-center hover:shadow-md transition-shadow ${
                    step.isHighlighted ? "border-2 border-gold" : "border-border"
                  }`}
                >
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-navy text-gold font-bold text-sm mb-3">
                    {step.number}
                  </span>
                  <Icon className="w-8 h-8 text-navy mb-2" />
                  <h3 className="text-sm font-semibold text-navy mb-1">{step.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{step.description}</p>
                  {step.duration && (
                    <span className="text-xs font-bold text-gold mt-2">{step.duration}</span>
                  )}
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.1 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                  className={`flex gap-4 items-start bg-white border rounded-xl p-5 ${
                    step.isHighlighted ? "border-2 border-gold" : "border-border"
                  }`}
                >
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-navy text-gold font-bold text-sm">
                      {step.number}
                    </span>
                    <Icon className="w-5 h-5 text-gold" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-navy text-sm mb-1">{step.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                    {step.duration && (
                      <span className="inline-block text-xs bg-gold-lt text-navy px-2 py-0.5 rounded font-medium mt-2">
                        {step.duration}
                      </span>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default SharedHowItWorks;
