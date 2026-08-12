import type { Metadata } from "next";
import Script from "next/script";
import { QueryProvider } from "@/components/providers/QueryProvider";
import "./globals.css";

const GTM_ID = "GTM-T9HSKHXL";

export const metadata: Metadata = {
  title: "Residency24",
  description: "Residency, Company Registration & Property Investment in UAE, Oman & Turkey",
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <head>
        {/* Locale is in the [lang] segment (below the root <html>), so we can't
            read it here without opting the whole tree into dynamic rendering.
            This tiny inline script fixes <html lang>/<dir> from the URL BEFORE
            first paint — correct for RTL (fa/ar), screen readers, and the
            JS-rendered DOM crawlers see — while keeping every page static. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){try{var m=location.pathname.match(/^\\/(fa|ar|ru)(\\/|$)/);var l=m?m[1]:'en';var e=document.documentElement;e.lang=l;e.dir=(l==='fa'||l==='ar')?'rtl':'ltr';}catch(e){}})();",
          }}
        />
        {/* Fonts: plain <link> (not CSS @import) so the font CSS downloads in
            parallel with the app CSS instead of chained behind it. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=Vazirmatn:wght@300;400;500;600;700;800&display=swap"
        />
        <Script
          id="gtm-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`,
          }}
        />
      </head>
      <body>
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
