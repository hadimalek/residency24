"use client";

import { useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import Navbar from "@/components/Navbar";
import HeroChat from "@/components/HeroChat";
import TrustBar from "@/components/TrustBar";
import PropertyStats from "@/components/p005/PropertyStats";
import ValueProps from "@/components/p005/ValueProps";
import PropertyVisaTable from "@/components/p005/PropertyVisaTable";
import NationalityHooks from "@/components/NationalityHooks";
import DubaiAreasGrid from "@/components/p005/DubaiAreasGrid";
import HowToBuy from "@/components/p005/HowToBuy";
import CostTable from "@/components/p005/CostTable";
import PropertyLeadForm from "@/components/p005/PropertyLeadForm";
import PropertyTestimonials from "@/components/p005/PropertyTestimonials";
import RelatedServices from "@/components/p005/RelatedServices";
import PropertyFAQ from "@/components/p005/PropertyFAQ";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import type { Lang } from "@/translations";

const BASE_URL = "https://residency24.com";

function buildSchemas(lang: Lang, bp: any) {
  const pageUrl = `${BASE_URL}/${lang}/uae/buy-property/`;
  const homeLabel: Record<Lang, string> = { fa: "خانه", en: "Home", ar: "الرئيسية", ru: "Главная" };

  const service = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: bp.hero_headline,
    description: bp.hero_sub,
    provider: {
      "@type": "Organization",
      name: "Residency24",
      url: `${BASE_URL}/${lang}/`,
    },
    areaServed: { "@type": "City", name: "Dubai" },
    url: pageUrl,
  };

  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: (bp.faq_items as { q: string; a: string }[]).map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  const areas = [
    { name: { en: "Downtown Dubai", fa: "داون‌تاون دبی", ar: "وسط مدينة دبي", ru: "Даунтаун Дубай" } },
    { name: { en: "Dubai Marina", fa: "دبی مارینا", ar: "دبي مارينا", ru: "Дубай Марина" } },
    { name: { en: "JVC", fa: "JVC", ar: "JVC", ru: "JVC" } },
    { name: { en: "Business Bay", fa: "بیزینس‌بی", ar: "خليج الأعمال", ru: "Бизнес Бэй" } },
    { name: { en: "Dubai Hills Estate", fa: "دبی هیلز", ar: "تلال دبي", ru: "Дубай Хиллс" } },
    { name: { en: "Palm Jumeirah", fa: "پالم جمیرا", ar: "جزيرة النخلة", ru: "Пальма Джумейра" } },
    { name: { en: "Dubai South", fa: "دبی ساوث", ar: "دبي الجنوب", ru: "Дубай Саут" } },
  ];

  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: bp.areas_title,
    itemListElement: areas.map((a, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: a.name[lang],
    })),
  };

  const howTo = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: bp.how_title,
    step: (bp.how_steps as { title: string; desc: string }[]).map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.title,
      text: s.desc,
    })),
  };

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: homeLabel[lang], item: `${BASE_URL}/${lang}/` },
      { "@type": "ListItem", position: 2, name: bp.breadcrumb_uae, item: `${BASE_URL}/${lang}/uae/` },
      { "@type": "ListItem", position: 3, name: bp.breadcrumb_property, item: pageUrl },
    ],
  };

  return [service, faq, itemList, howTo, breadcrumb];
}

export default function BuyPropertyClient({ h1 }: { h1: string }) {
  const { t, lang } = useLanguage();
  const bp = t.bp;

  useEffect(() => {
    const schemas = buildSchemas(lang, bp);
    const scripts: HTMLScriptElement[] = schemas.map((schema) => {
      const s = document.createElement("script");
      s.type = "application/ld+json";
      s.text = JSON.stringify(schema);
      document.head.appendChild(s);
      return s;
    });
    return () => {
      scripts.forEach((s) => {
        if (s.parentNode) s.parentNode.removeChild(s);
      });
    };
  }, [lang, bp]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <h1 className="sr-only">{h1}</h1>
      <HeroChat />
      <TrustBar />
      <PropertyStats />
      <ValueProps />
      <PropertyVisaTable />
      <NationalityHooks />
      <DubaiAreasGrid />
      <HowToBuy />
      <CostTable />
      <PropertyLeadForm />
      <PropertyTestimonials />
      <RelatedServices />
      <PropertyFAQ />
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
