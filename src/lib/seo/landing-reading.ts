import { listPosts } from "@/lib/cms/queries";

/**
 * Articles worth linking from a service landing page.
 *
 * The internal link graph runs one way. A crawl of the live site found 5,838
 * links from articles to landing pages and 15 the other way — one landing page
 * out of 76 linked to any article at all. So the blog pours everything into the
 * commercial pages and gets nothing back: the median article has 3 inbound
 * internal links and 97 of them have exactly one, and those articles are the
 * pages that actually rank (positions 5-9, where the landings sit at 37).
 *
 * This closes the loop. It also gives each landing page the topical support a
 * commercial page needs, and shortens the path to articles that were four or
 * five clicks deep.
 *
 * Matching is on the article slug, not the title: slugs are English
 * transliterations in every locale — verified, zero non-ASCII across all 387
 * articles — so one pattern set works for fa, en, ar and ru alike. Where a
 * landing is country-specific, an article has to match the country *and* the
 * topic, otherwise a Turkish property guide would surface under Oman property.
 */
interface Topic {
  /** Required for a country-scoped landing; omitted for a country hub. */
  country?: RegExp;
  /** What the page is about. */
  topic: RegExp;
  /** Category slugs to draw from as well, when the taxonomy has a match. */
  categories?: string[];
}

const UAE = /\b(uae|dubai|abu-?dhabi|sharjah|ajman|rak|ras-al-khaimah|emirat)/;
const OMAN = /\b(oman|muscat|salalah|sohar|duqm)/;
const TURKEY = /\b(turkey|turkish|istanbul|antalya|tapu)/;

// Deliberately narrow. A bare `licen` pulled in a driving-licence guide, bare
// `shop` pulled in shopping malls, and bare `tax` pulled a property-tax article
// under company registration.
// `vat` needs its word boundaries: without them it matches inside "private",
// which pulled a property article in under company registration.
const COMPANY = /(compan|business|llc|(trade|commercial|business)-licen|free-?zone|corporate-tax|freelancer-tax|trading|entrepreneur|start-?up|restaurant|beauty-salon|online-(store|shop)|cafe|clinic|invoice|accounting|\bvat\b)/;
const PROPERTY = /(propert|real-estate|estate|apartment|studio|villa|off-?plan|mortgage|emaar|rent|tapu|title-deed|appraisal|roi)/;
// `renewal` alone matched a company-licence renewal guide.
const RESIDENCY = /(residenc|resident|golden-visa|investor-visa|iqama|emirates-id|10-year|(visa|residence|residency|permit)-renewal)/;
const TOURIST = /(tourist|visit-visa|visa-on-arrival|transit|airport|entry|e-?visa|schengen|travel)/;
const WORK = /(job|work|salary|employ|freelance|skilled|labour|labor|cv|resume|hiring|green-visa|nomad)/;
const CITIZENSHIP = /(citizenship|passport|naturali)/;

const TOPICS: Record<string, Topic> = {
  // UAE
  uae: { topic: UAE, categories: ["country-guides", "migration-destinations"] },
  "uae/company-registration": { country: UAE, topic: COMPANY, categories: ["company-formation", "investment-guide"] },
  "uae/golden-visa": { country: UAE, topic: RESIDENCY, categories: ["visas-and-residency", "immigration-documents"] },
  "uae/green-visa": { country: UAE, topic: WORK, categories: ["visas-and-residency", "work-immigration-guide"] },
  "uae/buy-property": { country: UAE, topic: PROPERTY, categories: ["property-buying-guide", "investment-guide"] },
  "uae/tourist-visa": { country: UAE, topic: TOURIST, categories: ["travel-and-entertainment", "immigration-documents"] },

  // Oman
  oman: { topic: OMAN, categories: ["country-guides", "migration-destinations"] },
  "oman/company-registration": { country: OMAN, topic: COMPANY, categories: ["company-formation", "investment-guide"] },
  "oman/residency-visa": { country: OMAN, topic: RESIDENCY, categories: ["visas-and-residency", "immigration-documents"] },
  "oman/buy-property": { country: OMAN, topic: PROPERTY, categories: ["property-buying-guide", "investment-guide"] },
  "oman/tourist-visa": { country: OMAN, topic: TOURIST, categories: ["travel-and-entertainment"] },

  // Turkey
  turkey: { topic: TURKEY, categories: ["country-guides", "migration-destinations"] },
  "turkey/citizenship": { country: TURKEY, topic: CITIZENSHIP, categories: ["visas-and-residency"] },
  "turkey/company-registration": { country: TURKEY, topic: COMPANY, categories: ["company-formation", "investment-guide"] },
  "turkey/buy-property": { country: TURKEY, topic: PROPERTY, categories: ["property-buying-guide", "investment-guide"] },
  "turkey/tourist-visa": { country: TURKEY, topic: TOURIST, categories: ["travel-and-entertainment"] },

  "compare/uae-vs-oman-vs-turkey": { topic: /(vs|versus|compar|better|which)/, categories: ["migration-destinations"] },
};

export interface ReadingItem {
  slug: string;
  title: string;
  excerpt: string | null;
  category: string | null;
}

/** Route paths this has a topic for — used by the pages that render the block. */
export function hasLandingReading(route: string): boolean {
  return route in TOPICS;
}

/**
 * Picks up to `limit` articles for a landing route in one locale.
 *
 * A country-scoped landing needs the country in the slug as well as the topic.
 * Category membership counts as a topic match on its own, since an article
 * filed under "property-buying-guide" is about property whatever its slug says.
 * Ordering is the query's own — newest first — so the block stays current
 * without anyone maintaining a list.
 */
export async function getLandingReading(
  route: string,
  lang: string,
  limit = 6
): Promise<ReadingItem[]> {
  const t = TOPICS[route];
  if (!t) return [];

  // One query per locale, then filter in memory: the alternative is a query per
  // category plus a slug LIKE, and this list is a few hundred rows.
  const { data: posts } = await listPosts({ lang, page: 1, perPage: 500 });

  const cats = new Set(t.categories ?? []);
  const eligible: ReadingItem[] = [];
  for (const p of posts) {
    const slug = String(p.slug ?? "");
    if (!slug) continue;
    if (t.country && !t.country.test(slug)) continue;
    const byTopic = t.topic.test(slug);
    const byCategory = p.category ? cats.has(p.category.slug) : false;
    if (!byTopic && !byCategory) continue;
    eligible.push({
      slug,
      title: String(p.title ?? slug),
      excerpt: p.excerpt ? String(p.excerpt) : null,
      category: p.category ? p.category.slug : null,
    });
  }

  // Take a different slice of the pool on each route.
  //
  // Newest-first meant every landing in a locale surfaced the same handful of
  // recent articles: 45 landings produced 219 links but reached only 133 of the
  // 387 articles, while the ones that need the link most are older — the
  // WordPress-era posts that used to rank and now sit on a single inbound link
  // from a category hub. Ordering by a hash of route+slug spreads the picks
  // across the pool instead of stacking them, and being a hash rather than a
  // shuffle it is stable: the same page links to the same articles on every
  // build, so nothing churns between deploys.
  return eligible
    .map((item) => ({ item, k: hash(`${route}:${item.slug}`) }))
    .sort((a, b) => a.k - b.k)
    .slice(0, limit)
    .map(({ item }) => item);
}

/** FNV-1a, 32-bit. Stable across builds and processes, unlike Math.random. */
function hash(s: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h;
}
