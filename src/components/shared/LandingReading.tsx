import type { Lang } from "@/translations";
import { getLandingReading } from "@/lib/seo/landing-reading";
import SharedRelatedReading from "./SharedRelatedReading";

/**
 * Server-side wrapper: fetches the articles for a landing route and renders the
 * block. Each landing page builds this in its `page.tsx` and hands the result to
 * its client component as a prop, which is how a Server Component's output gets
 * inside a Client Component's tree — the query stays on the server and the links
 * arrive in the HTML.
 *
 * Renders nothing when a locale has no matching articles. That is the intended
 * outcome, not a gap to pad: /ar/uae/tourist-visa has no Arabic articles on the
 * subject, and six loosely-related links would be worse than none.
 */
export default async function LandingReading({
  route,
  lang,
  limit = 6,
}: {
  route: string;
  lang: Lang;
  limit?: number;
}) {
  const items = await getLandingReading(route, lang, limit).catch(() => []);
  return <SharedRelatedReading items={items} lang={lang} />;
}
