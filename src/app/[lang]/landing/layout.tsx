import type { Metadata } from "next";

// All /landing/* pages are built for Google Ads traffic only — keep them out of
// the organic index. Child pages inherit this via Next.js metadata merging
// (their generateMetadata does not set `robots`). follow:true preserves link equity.
export const metadata: Metadata = {
  robots: { index: false, follow: true },
};

export default function LandingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
