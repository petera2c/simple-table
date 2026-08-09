import { isBlogTag, type BlogTag } from "@/constants/blogTags";

type TagRule = {
  tag: BlogTag;
  /** Word-boundary-friendly patterns matched against the provided haystack. */
  patterns: RegExp[];
};

const FRAMEWORK_RULES: TagRule[] = [
  { tag: "react", patterns: [/\breact\b/, /\bnext\.?js\b/, /\bremix\b/] },
  { tag: "vue", patterns: [/\bvue\b/, /\bvue\s*3\b/, /\bnuxt\b/] },
  { tag: "angular", patterns: [/\bangular\b/] },
  { tag: "svelte", patterns: [/\bsvelte\b/, /\bsveltekit\b/] },
  { tag: "solid", patterns: [/\bsolid(?:js)?\b/] },
  { tag: "vanilla", patterns: [/\bvanilla(?:[\s-]?js)?\b/, /\bvanilla[\s-]typescript\b/] },
];

const CONTENT_TYPE_RULES: TagRule[] = [
  { tag: "alternatives", patterns: [/\balternatives?\b/] },
  {
    tag: "comparison",
    patterns: [/\bversus\b/, /\bvs\.?\b/, /\bcomparison\b/, /\bcompare[ds]?\b/],
  },
  {
    tag: "tutorials",
    patterns: [/\bguide\b/, /\btutorial\b/, /\bhow[\s-]to\b/, /\bimplementation\b/],
  },
];

const THEME_RULES: TagRule[] = [
  { tag: "best-practices", patterns: [/\bbest[\s-]practices?\b/, /\bproduction\b/] },
  {
    tag: "performance",
    patterns: [
      /\bperformance\b/,
      /\bvirtual(?:[\s-]?scroll(?:ing)?)?\b/,
      /\bvirtuali[sz]ation\b/,
      /\bpagination\b/,
    ],
  },
  { tag: "customization", patterns: [/\bcustomi[sz](?:e|ation|ing)\b/, /\bthem(?:e|ing)\b/] },
  { tag: "pricing", patterns: [/\bpricing\b/] },
  { tag: "accessibility", patterns: [/\baccessibility\b/, /\ba11y\b/] },
  { tag: "mobile", patterns: [/\bmobile\b/] },
  { tag: "data-grid", patterns: [/\bdata[\s-]grids?\b/, /\bdatagrid\b/] },
  { tag: "headless", patterns: [/\bheadless\b/] },
];

/** Feature tags: match slug/title only to avoid description keyword noise. */
const FEATURE_RULES: TagRule[] = [
  { tag: "column-pinning", patterns: [/\bcolumn[\s-]pinning\b/, /\bpinn(?:ed|ing)\b/] },
  { tag: "column-resizing", patterns: [/\bcolumn[\s-]resiz(?:e|ing)\b/] },
  { tag: "filtering", patterns: [/\bfilter(?:ing)?\b/] },
  { tag: "row-selection", patterns: [/\brow[\s-]selection\b/] },
  { tag: "tree-data", patterns: [/\btree[\s-]data\b/, /\bhierarchical\b/] },
  {
    tag: "cell-editing",
    patterns: [/\bcell[\s-]editing\b/, /\binline[\s-]editing\b/],
  },
  { tag: "pivot", patterns: [/\bpivot\b/] },
  { tag: "infinite-scroll", patterns: [/\binfinite[\s-]scroll(?:ing)?\b/] },
];

const COMPETITOR_RULES: TagRule[] = [
  { tag: "ag-grid", patterns: [/\bag[\s-]?grid\b/] },
  { tag: "handsontable", patterns: [/\bhandsontable\b/] },
  { tag: "tanstack-table", patterns: [/\btanstack(?:[\s-]table)?\b/] },
  { tag: "material-ui", patterns: [/\bmaterial[\s-]?ui\b/, /\bmui\b/] },
  { tag: "tabulator", patterns: [/\btabulator\b/] },
];

function matchesAny(haystack: string, patterns: RegExp[]): boolean {
  return patterns.some((pattern) => pattern.test(haystack));
}

function collectTags(haystack: string, rules: TagRule[]): BlogTag[] {
  const tags: BlogTag[] = [];
  for (const rule of rules) {
    if (matchesAny(haystack, rule.patterns) && isBlogTag(rule.tag)) {
      tags.push(rule.tag);
    }
  }
  return tags;
}

function toHaystack(...parts: string[]): string {
  return parts
    .flatMap((part) => [part, part.replace(/-/g, " ")])
    .join("\n")
    .toLowerCase();
}

/**
 * Infer curated blog tags for a Soro RSS article from slug/title/description.
 * Prefer specific signals over the generic "article" fallback.
 */
export function inferSoroArticleTags(input: {
  slug: string;
  title: string;
  description: string;
}): BlogTag[] {
  const fullHaystack = toHaystack(input.slug, input.title, input.description);
  const titleHaystack = toHaystack(input.slug, input.title);
  const slugHaystack = toHaystack(input.slug);

  const frameworks = collectTags(fullHaystack, FRAMEWORK_RULES);

  // Only treat JS/TS as vanilla when the slug itself is framework-agnostic JS/TS.
  if (
    frameworks.length === 0 &&
    (/\bjavascript\b/.test(slugHaystack) ||
      /\btypescript\b/.test(slugHaystack) ||
      /\bvanilla\b/.test(slugHaystack))
  ) {
    frameworks.push("vanilla");
  }

  const tags: BlogTag[] = [
    ...frameworks,
    ...collectTags(fullHaystack, CONTENT_TYPE_RULES),
    ...collectTags(fullHaystack, THEME_RULES),
    ...collectTags(titleHaystack, FEATURE_RULES),
    ...collectTags(fullHaystack, COMPETITOR_RULES),
  ];

  const unique = Array.from(new Set(tags));
  return unique.length > 0 ? unique : ["article"];
}
