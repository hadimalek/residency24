"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import * as LucideIcons from "lucide-react";
import Link from "next/link";

export interface CrossSellItem {
  titleKey: string;
  descriptionKey: string;
  icon: string;
  href: string;
  isHighlighted?: boolean;
  badgeKey?: string;
}

export interface SharedCrossSellProps {
  items: CrossSellItem[];
  titleKey: string;
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

export default function SharedCrossSell({
  items,
  titleKey,
}: SharedCrossSellProps) {
  const { t, lang, isRTL } = useLanguage();
  const title = getNestedValue(t, titleKey);
  const Arrow = isRTL ? ChevronLeft : ChevronRight;

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      className="py-16 bg-white"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-[#001E6E] font-bold text-2xl md:text-3xl text-center mb-10">
          {title}
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {items.map((item, i) => (
            <Link
              key={i}
              href={item.href}
              className={`group bg-white rounded-xl p-5 transition-shadow hover:shadow-md relative flex flex-col ${
                item.isHighlighted
                  ? "border-2 border-[#DCC896]"
                  : "border border-[#E5E7EB]"
              }`}
            >
              {item.badgeKey && (
                <span className="absolute -top-2.5 start-4 bg-[#DCC896] text-[#001E6E] text-[10px] font-semibold px-2 py-0.5 rounded">
                  {getNestedValue(t, item.badgeKey)}
                </span>
              )}

              <div className="bg-[#001E6E]/[0.08] rounded-lg p-2 w-fit mb-3">
                <LucideIcon name={item.icon} className="text-[#001E6E]" />
              </div>

              <h3 className="text-[#001E6E] font-semibold text-sm mb-1">
                {getNestedValue(t, item.titleKey)}
              </h3>
              <p className="text-[#6E6E6E] text-xs leading-relaxed flex-1">
                {getNestedValue(t, item.descriptionKey)}
              </p>

              <Arrow
                size={16}
                className="text-[#DCC896] mt-3 group-hover:translate-x-1 transition-transform"
              />
            </Link>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
