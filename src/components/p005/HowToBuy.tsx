"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import { Target, Users, CreditCard, Search, FileSignature, CheckCircle, Landmark, Building, Key, Star } from "lucide-react";

const STEP_ICONS = [Target, Users, CreditCard, Search, FileSignature, CheckCircle, Landmark, Building, Key, Star];

const HowToBuy = () => {
  const { t } = useLanguage();
  const bp = t.bp;
  const steps: { title: string; desc: string; time: string }[] = bp.how_steps;

  return (
    <section className="py-16 bg-surface">
      <div className="max-w-5xl mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-navy text-center mb-10">
          {bp.how_title}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {steps.map((step, i) => {
            const Icon = STEP_ICONS[i];
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="flex gap-4 items-start bg-white rounded-xl p-5"
              >
                <div className="flex items-center gap-3 shrink-0">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-navy text-gold font-bold text-sm">
                    {i + 1}
                  </span>
                  <Icon className="w-5 h-5 text-gold" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-navy text-sm mb-1">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-2">{step.desc}</p>
                  <span className="inline-block text-xs bg-gold-lt text-navy px-2 py-0.5 rounded font-medium">
                    {step.time}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowToBuy;
