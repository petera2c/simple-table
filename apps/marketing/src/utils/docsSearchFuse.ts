import Fuse, { type FuseResultMatch, type IFuseOptions } from "fuse.js";
import type { SearchableDoc } from "@/types/search";

/** Fuse options used by DocsSearch UI and the search regression suite. */
export const DOCS_SEARCH_FUSE_OPTIONS: IFuseOptions<SearchableDoc> = {
  keys: [
    { name: "title", weight: 2.5 },
    // Page-derived terms (pattern titles, props) — not SEO keyword lists
    { name: "keywords", weight: 2 },
    { name: "headings", weight: 1.8 },
    { name: "content", weight: 1 },
    // SEO description is display fallback only — keep weight low so meta isn't ranking bait
    { name: "description", weight: 0.4 },
  ],
  threshold: 0.3,
  includeScore: true,
  includeMatches: true,
  minMatchCharLength: 3,
  ignoreLocation: true,
  distance: 100,
  findAllMatches: false,
};

export function createDocsSearchFuse(index: SearchableDoc[]): Fuse<SearchableDoc> {
  return new Fuse(index, DOCS_SEARCH_FUSE_OPTIONS);
}

export type DocsSearchSnippet = {
  text: string;
  /** Fuse field name for highlightMatches, when indices apply to this string */
  field: "headings" | "content" | "description";
  /** Array index when field is headings */
  arrayIndex?: number;
};

function queryTokens(query: string): string[] {
  return query
    .toLowerCase()
    .split(/[\s/|,–—:_-]+/)
    .map((t) => t.trim())
    .filter((t) => t.length >= 3);
}

function tokenHitCount(text: string, tokens: string[]): number {
  const lower = text.toLowerCase();
  return tokens.reduce((count, token) => (lower.includes(token) ? count + 1 : count), 0);
}

/** Pick the heading that covers the most query tokens (ties → longer heading). */
function bestHeadingForQuery(headings: string[], tokens: string[]): string | null {
  if (tokens.length === 0) return null;
  let best: string | null = null;
  let bestScore = 0;
  for (const heading of headings) {
    const score = tokenHitCount(heading, tokens);
    if (score > bestScore || (score === bestScore && score > 0 && heading.length > (best?.length ?? 0))) {
      best = heading;
      bestScore = score;
    }
  }
  return bestScore > 0 ? best : null;
}

/** Build a short excerpt of `text` centered on the first query token hit. */
function excerptAroundMatch(text: string, tokens: string[], maxLen = 160): string {
  const lower = text.toLowerCase();
  let hit = -1;
  let hitLen = 0;
  for (const token of tokens) {
    const idx = lower.indexOf(token);
    if (idx !== -1 && (hit === -1 || idx < hit)) {
      hit = idx;
      hitLen = token.length;
    }
  }
  if (hit === -1) {
    return text.length <= maxLen ? text : `${text.slice(0, maxLen).trim()}…`;
  }
  const pad = Math.floor((maxLen - hitLen) / 2);
  let start = Math.max(0, hit - pad);
  let end = Math.min(text.length, hit + hitLen + pad);
  if (start > 0) {
    const space = text.lastIndexOf(" ", start);
    if (space !== -1 && start - space < 24) start = space + 1;
  }
  if (end < text.length) {
    const space = text.indexOf(" ", end);
    if (space !== -1 && space - end < 24) end = space;
  }
  const slice = text.slice(start, end).trim();
  return `${start > 0 ? "…" : ""}${slice}${end < text.length ? "…" : ""}`;
}

/**
 * Prefer a matched heading or content excerpt over the SEO description so the
 * dropdown shows the visible page text that actually matched the query.
 */
export function getDocsSearchSnippet(
  doc: SearchableDoc,
  _matches: readonly FuseResultMatch[] | undefined,
  query: string,
): DocsSearchSnippet {
  const tokens = queryTokens(query);

  // 1) Heading that contains the most query tokens (exact substring)
  const headingHit = bestHeadingForQuery(doc.headings, tokens);
  if (headingHit) {
    return {
      text: headingHit,
      field: "headings",
      arrayIndex: doc.headings.indexOf(headingHit),
    };
  }

  // 2) Content excerpt around the first token hit
  if (doc.content && tokenHitCount(doc.content, tokens) > 0) {
    return {
      text: excerptAroundMatch(doc.content, tokens),
      field: "content",
    };
  }

  // 3) Keywords that match (e.g. prop names) — show the keyword itself
  const keywordHit = doc.keywords.find((k) => tokenHitCount(k, tokens) > 0);
  if (keywordHit) {
    return {
      text: keywordHit,
      field: "content",
    };
  }

  // 4) SEO description fallback
  return {
    text: doc.description,
    field: "description",
  };
}
