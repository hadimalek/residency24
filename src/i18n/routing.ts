import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";

export const routing = defineRouting({
  locales: ["en", "fa", "ru", "ar"],
  defaultLocale: "en",
  localePrefix: "as-needed",
  localeDetection: false,
});

export type Locale = (typeof routing.locales)[number];
export type SupportedLocale = Locale;

export const RTL_LOCALES: Locale[] = ["fa", "ar"];
export const isRTL = (locale: Locale) => RTL_LOCALES.includes(locale);

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
