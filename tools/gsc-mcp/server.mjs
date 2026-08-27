#!/usr/bin/env node
/**
 * MCP server exposing Google Search Console over stdio.
 *
 * Tools:
 *   gsc_list_sites        which properties the authorised account can see
 *   gsc_search_analytics  clicks/impressions/ctr/position by any dimensions
 *   gsc_inspect_url       per-URL index status — the "why isn't this indexed" tool
 *   gsc_list_sitemaps     submitted sitemaps with their error/warning counts
 *   gsc_top_pages         convenience wrapper: worst/best pages for a period
 *
 * Auth lives in google-auth.mjs; run `npm run auth` once before using this.
 * The scope is webmasters.readonly, so nothing here can change the property.
 */
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { googleFetch } from "./google-auth.mjs";

const WM = "https://www.googleapis.com/webmasters/v3";
const INSPECT = "https://searchconsole.googleapis.com/v1/urlInspection/index:inspect";

/**
 * Default property. A GSC "Domain property" is addressed as sc-domain:example.com;
 * a URL-prefix property as the URL itself. Overridable per call and by env.
 */
const DEFAULT_SITE = process.env.GSC_SITE_URL || "sc-domain:residency24.com";

const DIMENSIONS = ["date", "query", "page", "country", "device", "searchAppearance"];

function isoDaysAgo(n) {
  const d = new Date(Date.now() - n * 86400000);
  return d.toISOString().slice(0, 10);
}

const TOOLS = [
  {
    name: "gsc_list_sites",
    description:
      "List the Search Console properties the authorised Google account can access, with permission level. Start here when a call returns 403 — it shows whether the property is visible at all and in which exact form (sc-domain:… vs https://…).",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
  },
  {
    name: "gsc_search_analytics",
    description:
      "Query Search Console performance data: clicks, impressions, CTR and average position, grouped by any combination of dimensions. This is the main analysis tool. Note Search Console data lags ~2-3 days, so end_date defaults to 3 days ago.",
    inputSchema: {
      type: "object",
      properties: {
        site_url: { type: "string", description: `Property. Default: ${DEFAULT_SITE}` },
        start_date: { type: "string", description: "YYYY-MM-DD. Default: 28 days before end_date." },
        end_date: { type: "string", description: "YYYY-MM-DD. Default: 3 days ago (data lag)." },
        dimensions: {
          type: "array",
          items: { type: "string", enum: DIMENSIONS },
          description: "e.g. [\"query\"], [\"page\"], [\"date\"], [\"page\",\"query\"].",
        },
        row_limit: { type: "number", description: "1-25000. Default 100." },
        start_row: { type: "number", description: "Offset for paging. Default 0." },
        search_type: {
          type: "string",
          enum: ["web", "image", "video", "news", "discover", "googleNews"],
          description: "Default web.",
        },
        filters: {
          type: "array",
          description:
            "Dimension filters, ANDed together, e.g. [{dimension:'page',operator:'contains',expression:'/fa/blog/'}].",
          items: {
            type: "object",
            properties: {
              dimension: { type: "string", enum: DIMENSIONS },
              operator: {
                type: "string",
                enum: ["equals", "notEquals", "contains", "notContains", "includingRegex", "excludingRegex"],
              },
              expression: { type: "string" },
            },
            required: ["dimension", "operator", "expression"],
          },
        },
      },
      additionalProperties: false,
    },
  },
  {
    name: "gsc_inspect_url",
    description:
      "URL Inspection: Google's own verdict for one URL — indexing state, why it was or wasn't indexed, the canonical Google picked vs the one declared, last crawl, robots.txt state, sitemaps referencing it, plus mobile-usability and rich-result findings. The tool that answers 'why is this page not in the index'. Quota is 2000/day per property.",
    inputSchema: {
      type: "object",
      properties: {
        url: { type: "string", description: "Full URL to inspect, must be inside the property." },
        site_url: { type: "string", description: `Property. Default: ${DEFAULT_SITE}` },
        language_code: { type: "string", description: "BCP-47 for the returned messages. Default en." },
      },
      required: ["url"],
      additionalProperties: false,
    },
  },
  {
    name: "gsc_list_sitemaps",
    description:
      "List submitted sitemaps for the property: last downloaded, last submitted, whether Google flagged errors or warnings, and how many URLs it found per content type. Pass sitemap_url for one sitemap's detail.",
    inputSchema: {
      type: "object",
      properties: {
        site_url: { type: "string", description: `Property. Default: ${DEFAULT_SITE}` },
        sitemap_url: { type: "string", description: "Optional: a single sitemap's full URL." },
      },
      additionalProperties: false,
    },
  },
  {
    name: "gsc_top_pages",
    description:
      "Convenience wrapper over gsc_search_analytics: pages ranked by clicks or impressions for a period, optionally filtered to a path prefix. Use it for quick 'how is /fa/blog/ doing' questions instead of assembling a full query.",
    inputSchema: {
      type: "object",
      properties: {
        site_url: { type: "string", description: `Property. Default: ${DEFAULT_SITE}` },
        days: { type: "number", description: "Trailing window. Default 28." },
        path_contains: { type: "string", description: "Only pages whose URL contains this." },
        order_by: { type: "string", enum: ["clicks", "impressions"], description: "Default clicks." },
        limit: { type: "number", description: "Default 25." },
      },
      additionalProperties: false,
    },
  },
];

async function searchAnalytics(a) {
  const site = a.site_url || DEFAULT_SITE;
  const endDate = a.end_date || isoDaysAgo(3);
  const startDate =
    a.start_date ||
    new Date(new Date(endDate).getTime() - 28 * 86400000).toISOString().slice(0, 10);

  const body = {
    startDate,
    endDate,
    dimensions: a.dimensions?.length ? a.dimensions : ["query"],
    rowLimit: Math.min(Math.max(a.row_limit ?? 100, 1), 25000),
    startRow: a.start_row ?? 0,
    type: a.search_type ?? "web",
  };
  if (a.filters?.length) {
    body.dimensionFilterGroups = [{ groupType: "and", filters: a.filters }];
  }

  const data = await googleFetch(
    `${WM}/sites/${encodeURIComponent(site)}/searchAnalytics/query`,
    { method: "POST", body }
  );

  const dims = body.dimensions;
  const rows = (data?.rows ?? []).map((r) => {
    const out = {};
    dims.forEach((d, i) => (out[d] = r.keys?.[i]));
    out.clicks = r.clicks;
    out.impressions = r.impressions;
    out.ctr = r.ctr != null ? +(r.ctr * 100).toFixed(2) + "%" : null;
    out.position = r.position != null ? +r.position.toFixed(1) : null;
    return out;
  });

  return {
    site_url: site,
    range: { start: startDate, end: endDate },
    dimensions: dims,
    row_count: rows.length,
    totals: rows.reduce(
      (t, r) => ({ clicks: t.clicks + (r.clicks ?? 0), impressions: t.impressions + (r.impressions ?? 0) }),
      { clicks: 0, impressions: 0 }
    ),
    rows,
  };
}

async function handle(name, args = {}) {
  switch (name) {
    case "gsc_list_sites": {
      const data = await googleFetch(`${WM}/sites`);
      return {
        default_site_used_by_this_server: DEFAULT_SITE,
        sites: (data?.siteEntry ?? []).map((s) => ({
          site_url: s.siteUrl,
          permission: s.permissionLevel,
        })),
      };
    }

    case "gsc_search_analytics":
      return searchAnalytics(args);

    case "gsc_top_pages":
      return searchAnalytics({
        site_url: args.site_url,
        end_date: isoDaysAgo(3),
        start_date: new Date(Date.now() - ((args.days ?? 28) + 3) * 86400000)
          .toISOString()
          .slice(0, 10),
        dimensions: ["page"],
        row_limit: args.limit ?? 25,
        ...(args.path_contains
          ? { filters: [{ dimension: "page", operator: "contains", expression: args.path_contains }] }
          : {}),
      }).then((res) => {
        const key = args.order_by === "impressions" ? "impressions" : "clicks";
        res.rows.sort((x, y) => (y[key] ?? 0) - (x[key] ?? 0));
        res.ordered_by = key;
        return res;
      });

    case "gsc_inspect_url": {
      const data = await googleFetch(INSPECT, {
        method: "POST",
        body: {
          inspectionUrl: args.url,
          siteUrl: args.site_url || DEFAULT_SITE,
          languageCode: args.language_code || "en",
        },
      });
      const r = data?.inspectionResult ?? {};
      const idx = r.indexStatusResult ?? {};
      return {
        inspected: args.url,
        // Flattened because the raw payload nests the useful bits three deep.
        verdict: idx.verdict,
        coverage_state: idx.coverageState,
        robots_txt: idx.robotsTxtState,
        indexing_allowed: idx.indexingState,
        last_crawled: idx.lastCrawlTime,
        crawled_as: idx.crawledAs,
        page_fetch: idx.pageFetchState,
        google_canonical: idx.googleCanonical,
        declared_canonical: idx.userCanonical,
        canonical_mismatch:
          idx.googleCanonical && idx.userCanonical
            ? idx.googleCanonical !== idx.userCanonical
            : null,
        referring_urls: idx.referringUrls,
        sitemaps_referencing: idx.sitemap,
        mobile_usability: r.mobileUsabilityResult?.verdict,
        rich_results: r.richResultsResult?.verdict,
        inspection_link: r.inspectionResultLink,
      };
    }

    case "gsc_list_sitemaps": {
      const site = args.site_url || DEFAULT_SITE;
      const url = args.sitemap_url
        ? `${WM}/sites/${encodeURIComponent(site)}/sitemaps/${encodeURIComponent(args.sitemap_url)}`
        : `${WM}/sites/${encodeURIComponent(site)}/sitemaps`;
      const data = await googleFetch(url);
      const list = args.sitemap_url ? [data] : (data?.sitemap ?? []);
      return {
        site_url: site,
        sitemaps: list.map((s) => ({
          path: s.path,
          type: s.type,
          is_index: s.isSitemapsIndex ?? false,
          is_pending: s.isPending ?? false,
          last_submitted: s.lastSubmitted,
          last_downloaded: s.lastDownloaded,
          errors: Number(s.errors ?? 0),
          warnings: Number(s.warnings ?? 0),
          contents: (s.contents ?? []).map((c) => ({
            type: c.type,
            submitted: Number(c.submitted ?? 0),
            indexed: c.indexed != null ? Number(c.indexed) : null,
          })),
        })),
      };
    }

    default:
      throw new Error(`unknown tool: ${name}`);
  }
}

const server = new Server(
  { name: "residency24-gsc", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools: TOOLS }));

server.setRequestHandler(CallToolRequestSchema, async (req) => {
  try {
    const result = await handle(req.params.name, req.params.arguments ?? {});
    return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
  } catch (e) {
    // Report as tool-level failure rather than a protocol error, so the message
    // (which carries Google's own explanation) reaches the caller.
    return { isError: true, content: [{ type: "text", text: e.message }] };
  }
});

await server.connect(new StdioServerTransport());
