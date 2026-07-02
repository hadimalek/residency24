/**
 * Dedicated footer for /landing/* ad pages: NO links or menus — only the
 * required compliance disclaimer. Text is intentionally English-only and
 * rendered LTR on all locales. (Site-wide Footer stays untouched.)
 */
const DISCLAIMER =
  "Disclaimer: PropertyCapital24 is an independent private consultancy specializing in real estate investment. We are not a government agency, embassy, or official representative of the UAE, Oman, or any other country, and we are not affiliated with any government body. All transactions are conducted directly with licensed developers and brokers under the oversight of the relevant regulatory authorities (including RERA in the UAE). The yields, prices, and timelines shown are indicative, based on current market data, and are not guaranteed. Past performance does not guarantee future returns. All real estate investments carry risk.";

export default function LandingFooter() {
  return (
    <footer className="bg-navy" dir="ltr">
      <div className="max-w-4xl mx-auto px-4 py-10">
        <p className="text-[12.5px] leading-relaxed text-white/60 text-start">{DISCLAIMER}</p>
      </div>
    </footer>
  );
}
