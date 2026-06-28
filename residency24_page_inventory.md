# Residency24 — Page Inventory

> Note: this file did not exist in the repo; it is created here as a minimal,
> ongoing inventory starting with the P037 entry. Extend as other pages are catalogued.

| ID | Page | Tier | Route (4 langs) | Status | Translation | Images | Schema |
|----|------|------|-----------------|--------|-------------|--------|--------|
| P004 | UAE Golden Visa | T1 | `/uae/golden-visa/` · `/{fa,ar,ru}/uae/golden-visa/` | Built | All 4 | — (HeroChat, no image) | Breadcrumb · Service · HowTo · FAQ |
| P037 | UAE Green Visa | T2 | `/uae/green-visa/` · `/{fa,ar,ru}/uae/green-visa/` | Built | **FA complete**; EN/AR/RU = `[TRANSLATE]` placeholders (pending Hassan/Elham) | 4 required + 1 optional (Unsplash hotlinks via `MediaImage`, fallback-safe) | Breadcrumb · Service (audience + AggregateOffer) · FAQPage · ImageObject |

## P037 — UAE Green Visa (details)
- **Sections (S01–S10):** Breadcrumb · Hero (mandatory image, custom Split + ChatModal) ·
  EligibilityCheck (3 pathways) · Why (4 cards) · PathwayTabs (Radix tabs, 3 + images) ·
  Pricing (SharedPricingTable) · Comparison (Green vs Golden) · HowItWorks (5 steps, +process banner) ·
  FAQ (10) · CrossSell + Final CTA + TrustBar/ContactBar.
- **Components:** `src/components/p037/{GreenVisaHero,EligibilityCheck,WhyGreenVisa,PathwayTabs,GreenVisaComparison}.tsx`.
- **Route:** `src/app/[lang]/uae/green-visa/{page,layout,GreenVisaPageClient}.tsx`.
- **Translations:** `hero_p037` + `page_p037` in all 4 lang blocks of `src/translations.ts`.
- **Images:** `page_p037.images.{hero,skilledPathway,freelancerPathway,investorPathway,processBanner}` (Unsplash URLs — verify/swap; see CREDITS.md).
- **Internal links:** linked from UAE hub (P002, all 4 langs) and Golden Visa (P004) cross-sell.
- **Locked components used as-is:** Navbar, Footer, WhatsAppFloat, TrustBar, ContactBar, ChatModal.
  (HeroChat intentionally not used — it has no image support; mandatory hero image required a custom hero.)
