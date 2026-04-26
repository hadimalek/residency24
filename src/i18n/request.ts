import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  // Phase A scaffolding: messages are intentionally empty.
  // Translations live in src/translations.ts (4565 lines) and are consumed via
  // src/contexts/LanguageContext.tsx. Migration to next-intl message dictionaries
  // is incremental and out of scope for Phase A.
  // See BLOCKED_QUESTIONS.md (Q1) and docs/migration/20_I18N_CURRENT_STATE.md.
  return {
    locale,
    messages: {},
  };
});
