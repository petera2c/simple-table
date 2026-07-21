/**
 * Curated blog tag taxonomy. Posts may only use these values.
 * Grouped as: frameworks → content types → themes / features / competitors.
 */

export const BLOG_FRAMEWORK_TAGS = [
  "react",
  "vue",
  "angular",
  "svelte",
  "solid",
  "vanilla",
] as const;

export const BLOG_CONTENT_TYPE_TAGS = [
  "tutorials",
  "comparison",
  "alternatives",
  "features",
  "article",
] as const;

export const BLOG_THEME_TAGS = [
  "best-practices",
  "performance",
  "customization",
  "pricing",
  "accessibility",
  "mobile",
  "data-grid",
  "headless",
] as const;

export const BLOG_FEATURE_TAGS = [
  "column-pinning",
  "column-resizing",
  "filtering",
  "row-selection",
  "tree-data",
  "cell-editing",
  "pivot",
  "infinite-scroll",
] as const;

export const BLOG_COMPETITOR_TAGS = [
  "ag-grid",
  "handsontable",
  "tanstack-table",
  "material-ui",
  "tabulator",
] as const;

export const BLOG_TAGS = [
  ...BLOG_FRAMEWORK_TAGS,
  ...BLOG_CONTENT_TYPE_TAGS,
  ...BLOG_THEME_TAGS,
  ...BLOG_FEATURE_TAGS,
  ...BLOG_COMPETITOR_TAGS,
] as const;

export type BlogTag = (typeof BLOG_TAGS)[number];

const BLOG_TAG_SET = new Set<string>(BLOG_TAGS);

export function isBlogTag(value: string): value is BlogTag {
  return BLOG_TAG_SET.has(value);
}
