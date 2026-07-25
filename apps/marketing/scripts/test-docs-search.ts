/**
 * Regression suite for docs search quality.
 *
 * Uses the same Fuse config as the DocsSearch UI against docsSearchIndex.json.
 * Run after generate-search-index (see package.json test:docs-search).
 *
 * Failures print the top hits so you can see ranking, not just pass/fail.
 */
import { readFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import Fuse from "fuse.js";
import type { SearchableDoc } from "../src/types/search";
import { DOCS_SEARCH_FUSE_OPTIONS, getDocsSearchSnippet } from "../src/utils/docsSearchFuse";
import { DOCS_SEARCH_CASES } from "./docs-search-cases";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const indexPath = path.join(__dirname, "../src/constants/docsSearchIndex.json");

function main(): void {
  const index = JSON.parse(readFileSync(indexPath, "utf-8")) as SearchableDoc[];
  const fuse = new Fuse(index, DOCS_SEARCH_FUSE_OPTIONS);

  let failed = 0;
  const failures: string[] = [];

  console.log(
    `Docs search regression: ${DOCS_SEARCH_CASES.length} cases against ${index.length} pages\n`,
  );

  for (const { query, expectTop, note, expectSnippetIncludes } of DOCS_SEARCH_CASES) {
    const results = fuse.search(query).slice(0, 5);
    const top = results[0];
    const topId = top?.item.id;
    const topFive = results
      .map((r, i) => `${i + 1}. ${r.item.id} (${(r.score ?? 0).toFixed(3)})`)
      .join("  ");

    if (topId !== expectTop) {
      failed += 1;
      const detail = [
        `FAIL  "${query}"`,
        `      expected #1: ${expectTop}`,
        `      actual #1:  ${topId ?? "(no results)"}`,
        `      top 5:      ${topFive || "(none)"}`,
        note ? `      note:        ${note}` : "",
      ]
        .filter(Boolean)
        .join("\n");
      console.log(detail);
      failures.push(detail);
      continue;
    }

    if (expectSnippetIncludes && top) {
      const snippet = getDocsSearchSnippet(top.item, top.matches, query).text;
      if (!snippet.toLowerCase().includes(expectSnippetIncludes.toLowerCase())) {
        failed += 1;
        const detail = [
          `FAIL  "${query}" (snippet)`,
          `      expected snippet to include: ${expectSnippetIncludes}`,
          `      actual snippet:              ${snippet}`,
          note ? `      note:        ${note}` : "",
        ]
          .filter(Boolean)
          .join("\n");
        console.log(detail);
        failures.push(detail);
        continue;
      }
    }

    const snippetHint = expectSnippetIncludes ? ` [snippet ✓]` : "";
    console.log(`PASS  "${query}" → ${topId}${snippetHint}`);
  }

  console.log(`\n${DOCS_SEARCH_CASES.length - failed} passed, ${failed} failed`);

  if (failed > 0) {
    process.exitCode = 1;
  }
}

main();
