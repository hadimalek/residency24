/**
 * Dedicated header for /landing/* ad pages: logo only, deliberately with NO
 * links, menus, or language switcher so paid traffic can't navigate away.
 * (The site-wide Navbar stays untouched — this replaces it per landing page.)
 */
export default function LandingHeader() {
  return (
    <div className="bg-navy">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-center md:justify-start">
        <img src="/residency24-logo-white.svg" alt="Residency24" className="h-9" />
      </div>
    </div>
  );
}
