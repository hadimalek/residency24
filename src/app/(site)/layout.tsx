"use client";

import { LanguageProvider } from "@/contexts/LanguageContext";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return <LanguageProvider>{children}</LanguageProvider>;
}
