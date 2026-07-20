/**
 * 90-day earned-distribution cadence for Simple Table marketing.
 * Use these drafts on Reddit, X, Indie Hackers, and Discord — do not buy backlinks.
 */

export type DistributionChannel = "reddit" | "x" | "indieHackers" | "showHn" | "discord" | "github";

export interface CadenceItem {
  week: number;
  channel: DistributionChannel;
  action: string;
  draft?: string;
  linkTarget?: string;
}

export const DISTRIBUTION_RULES = {
  never: [
    "Buy Fiverr / marketplace dofollow backlinks",
    "Mass AI guest posts on irrelevant blogs",
    "Spammy self-promo without answering the thread",
  ],
  always: [
    "Lead with a useful answer or demo",
    "Link to your own comparison, docs, benchmarks, or case study pages",
    "Disclose sponsorships; use rel=sponsored on paid placements",
  ],
} as const;

export const WEEKLY_TARGETS = {
  reddit: "1 thoughtful post or helpful comment per week",
  discordGithub: "Fast replies; turn good issues into docs snippets",
  x: "3 short posts per week (demo GIFs, migration tips, comparison one-liners)",
  indieHackersOrShowHn: "1 launch-style update every 4–6 weeks",
} as const;

/** Ready-to-adapt post drafts for the first 12 weeks. */
export const DISTRIBUTION_CADENCE: CadenceItem[] = [
  {
    week: 1,
    channel: "reddit",
    action: "Answer an AG Grid alternative / pricing thread in r/reactjs or r/webdev",
    draft:
      "If budget is the issue: AG Grid Enterprise is per-developer; we ship a batteries-included grid at ~85KB with free for pre-revenue and per-product Pro. Live CRM demo + vs AG Grid comparison linked in replies if useful.",
    linkTarget: "/comparisons/simple-table-vs-ag-grid",
  },
  {
    week: 1,
    channel: "x",
    action: "Post CRM demo + ChartMetric savings one-liner",
    draft:
      "ChartMetric skipped AG Grid Enterprise pricing and saved $19K+ year one. Case study + live CRM demo: simple-table.com/case-studies/chartmetric",
    linkTarget: "/case-studies/chartmetric",
  },
  {
    week: 2,
    channel: "reddit",
    action: "Helpful reply in r/vuejs or r/angular about data grids",
    draft:
      "If you want a shared API across Vue/Angular/React from one core, Simple Table has official adapters — hubs at /frameworks. Happy to answer install questions.",
    linkTarget: "/frameworks",
  },
  {
    week: 2,
    channel: "x",
    action: "Bundle size comparison graphic / numbers",
    draft:
      "Bundle reality check (min+gzip): Simple Table 84.6 kB vs AG Grid Community+Enterprise ~529 kB. Methodology + links: simple-table.com/benchmarks",
    linkTarget: "/benchmarks",
  },
  {
    week: 3,
    channel: "discord",
    action: "Pin install + pricing FAQ answers; invite from support threads",
    draft:
      "Free = Community License (zero revenue). Pro = commercial EULA + priority support. Features are the same — see /pricing.",
    linkTarget: "/pricing",
  },
  {
    week: 3,
    channel: "x",
    action: "Migration tip for leaving AG Grid",
    draft:
      "Migrating off AG Grid? Start with one screen, keep virtualization, swap pricing model to per-product. Migration guides: simple-table.com/migrations",
    linkTarget: "/migrations/from-ag-grid-angular",
  },
  {
    week: 4,
    channel: "indieHackers",
    action: "Launch-style update: pricing vs AG Grid + multi-framework story",
    draft:
      "Built a lightweight data grid alternative to AG Grid/Handsontable. Free for pre-revenue, Pro per product (not per seat). Looking for feedback from indie SaaS builders shipping admin/CRM tables.",
    linkTarget: "/pricing",
  },
  {
    week: 5,
    channel: "reddit",
    action: "Comment on Handsontable / spreadsheet grid thread",
    draft:
      "If you need Excel formulas, Handsontable wins. If you need a fast data grid without commercial spreadsheet licensing, compare features here — we published a pricing breakdown too.",
    linkTarget: "/comparisons/simple-table-vs-handsontable",
  },
  {
    week: 6,
    channel: "x",
    action: "Theme Builder shareable theme CTA",
    draft:
      "Design your grid theme in the browser, copy CSS variables, drop into React/Vue/Angular. Theme Builder: simple-table.com/theme-builder",
    linkTarget: "/theme-builder",
  },
  {
    week: 7,
    channel: "reddit",
    action: "Answer TanStack Table vs ready-made grid question",
    draft:
      "TanStack is great when you want to own the UI. If you want sorting/filter/pin/virtualization without building the chrome, here's our headless vs batteries-included comparison.",
    linkTarget: "/comparisons/simple-table-vs-tanstack",
  },
  {
    week: 8,
    channel: "showHn",
    action: "Show HN or HN comment with benchmarks + CRM demo",
    draft:
      "Show HN: Simple Table – ~85KB multi-framework data grid (AG Grid alternative). Benchmarks + live CRM example linked.",
    linkTarget: "/benchmarks",
  },
  {
    week: 9,
    channel: "reddit",
    action: "Helpful reply with case study proof",
    draft:
      "Real customer eval (ChartMetric) across AG Grid / TanStack / MUI — written up here if useful.",
    linkTarget: "/case-studies/chartmetric",
  },
  {
    week: 10,
    channel: "x",
    action: "1M rows / virtualization tip",
    draft:
      "Virtualize rows, keep column count sane, measure FPS. Walkthrough: simple-table.com/blog/handling-one-million-rows + benchmarks page.",
    linkTarget: "/blog/handling-one-million-rows",
  },
  {
    week: 11,
    channel: "github",
    action: "Convert a recurring issue into a docs snippet; link from README",
    draft: "Docs PR from Discord/GitHub questions this month; link install + framework hubs.",
    linkTarget: "/docs/installation",
  },
  {
    week: 12,
    channel: "indieHackers",
    action: "Month-3 update: installs, case studies, what you learned",
    draft:
      "Update: shipped benchmarks page, clearer Free vs Pro licensing. Still hunting feedback from teams leaving AG Grid Enterprise pricing.",
    linkTarget: "/case-studies",
  },
];

export const EARNED_OUTREACH_TARGETS = [
  "Awesome lists / React component roundups (editorial submission)",
  "Framework Discord showcases (Vue, Angular, Svelte)",
  "Guest technical posts accepted on merit (disclose if sponsored)",
  "One strong Product Hunt launch — not weekly spam",
  "Newsletter ads only with disclosure + sponsored links",
] as const;

export function getCadenceForWeek(week: number): CadenceItem[] {
  return DISTRIBUTION_CADENCE.filter((item) => item.week === week);
}
