/**
 * Generate Fuse.js search index for documentation pages.
 *
 * Sources of truth:
 * - docsNavigation.ts → page list, paths, sections
 * - docsSeo.ts + SEO_STRINGS → result title / description (display only)
 * - docs-pages/*Content.tsx → all searchable text (headings, body copy, props)
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { docSections } from "../src/constants/docsNavigation";
import { getDocSeoEntry } from "../src/constants/docsSeo";
import type { SearchableDoc } from "../src/types/search";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const docsContentPath = path.join(__dirname, "../src/components/pages/docs-pages");
const outputPath = path.join(__dirname, "../src/constants/docsSearchIndex.json");

/** Temporarily hidden from nav/search. */
const HIDDEN_DOC_IDS = new Set(["column-editing", "tdgp"]);

/**
 * Slug → Content filename when PascalCase conversion does not match the file on disk.
 */
const CONTENT_FILE_ALIASES: Record<string, string> = {
  "csv-export": "CSVExportContent.tsx",
  "live-updates": "LiveUpdateContent.tsx",
  tooltips: "TooltipContent.tsx",
};

function slugToContentFileName(slug: string): string {
  if (CONTENT_FILE_ALIASES[slug]) return CONTENT_FILE_ALIASES[slug];
  const pascal = slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
  return `${pascal}Content.tsx`;
}

function uniqueStrings(values: string[]): string[] {
  return [...new Set(values.map((v) => v.trim()).filter(Boolean))];
}

function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#123;/g, "{")
    .replace(/&#125;/g, "}");
}

function stripJsxNoise(text: string): string {
  return decodeHtmlEntities(text)
    .replace(/\{["'] ["']\}/g, " ")
    .replace(/\{[^}]*\}/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Significant words from a heading for keyword boost (Fuse weights keywords higher). */
function keywordTokensFromHeading(heading: string): string[] {
  return heading
    .split(/[\s/|,–—:_-]+/)
    .map((w) => w.trim())
    .filter((w) => w.length >= 4 && /[a-zA-Z]/.test(w));
}

/** Pull a quoted / backtick string starting at `source[start]` (must be on a quote). */
function readQuotedString(source: string, start: number): string | null {
  const quote = source[start];
  if (quote !== '"' && quote !== "'" && quote !== "`") return null;

  let i = start + 1;
  let value = "";
  while (i < source.length) {
    const ch = source[i];
    if (ch === "\\") {
      value += source[i + 1] ?? "";
      i += 2;
      continue;
    }
    if (ch === quote) {
      return value;
    }
    // Template interpolations — keep surrounding text, skip expression
    if (quote === "`" && ch === "$" && source[i + 1] === "{") {
      let depth = 1;
      i += 2;
      while (i < source.length && depth > 0) {
        if (source[i] === "{") depth += 1;
        else if (source[i] === "}") depth -= 1;
        i += 1;
      }
      value += " ";
      continue;
    }
    value += ch;
    i += 1;
  }
  return null;
}

/** Match `key: "..." | '...' | \`...\`` including multiline values. */
function extractKeyedStrings(source: string, key: string): string[] {
  const results: string[] = [];
  const keyRegex = new RegExp(`\\b${key}\\s*:\\s*`, "g");
  let keyMatch: RegExpExecArray | null;
  while ((keyMatch = keyRegex.exec(source)) !== null) {
    let i = keyMatch.index + keyMatch[0].length;
    while (i < source.length && /\s/.test(source[i])) i += 1;
    const quoted = readQuotedString(source, i);
    if (quoted?.trim()) results.push(quoted.trim());
  }
  return results;
}

function looksLikeProse(text: string): boolean {
  if (text.length < 4 || text.length > 800) return false;
  if (!/[a-zA-Z]{3,}/.test(text)) return false;
  if (text.includes("import ") || text.includes("from \"")) return false;
  if (text.includes("http://") || text.includes("https://")) return false;
  if (text.includes("className")) return false;
  if (text.includes("codeByFramework") || text.includes("PropInfo")) return false;
  // Skip dense code / JSX attribute dumps
  if ((text.match(/[{}<>]/g) ?? []).length > 6) return false;
  return true;
}

function extractTextFromComponent(componentPath: string): {
  headings: string[];
  content: string;
  terms: string[];
} {
  try {
    const source = fs.readFileSync(componentPath, "utf-8");
    const headings: string[] = [];
    const paragraphs: string[] = [];
    const terms: string[] = [];

    // Explicit JSX headings
    const headingRegex = /<h[123][^>]*>([\s\S]*?)<\/h[123]>/g;
    let match: RegExpExecArray | null;
    while ((match = headingRegex.exec(source)) !== null) {
      const headingContent = stripJsxNoise(match[1]);
      if (headingContent) headings.push(headingContent);
    }

    // Pattern / DocsStep titles: title: "Export to CSV"
    for (const title of extractKeyedStrings(source, "title")) {
      if (title.length >= 3 && title.length <= 120 && !title.includes("http") && looksLikeProse(title)) {
        headings.push(title);
      } else if (title.length >= 3 && title.length <= 120 && !title.includes("http") && !title.includes("className")) {
        // Short titles like "Override icons" are prose enough
        headings.push(title);
      }
    }

    // Pattern body strings when body is a plain string (not JSX)
    for (const body of extractKeyedStrings(source, "body")) {
      if (looksLikeProse(body)) paragraphs.push(body);
    }

    // Paragraphs / list items / motion wrappers with visible copy.
    // Require a tag boundary after the name so <Link> does not match as <li>.
    const blockRegex =
      /<(?:p|li|motion\.p)(?:\s[^>]*)?>([\s\S]*?)<\/(?:p|li|motion\.p)>/g;
    while ((match = blockRegex.exec(source)) !== null) {
      const blockContent = stripJsxNoise(match[1]);
      if (blockContent) paragraphs.push(blockContent);
    }

    // Inline <code>…</code> — index in content only (not keywords), so cross-links
    // like Animations → cellUpdateFlash don't outrank the prop's home page.
    const codeRegex = /<code[^>]*>([\s\S]*?)<\/code>/g;
    while ((match = codeRegex.exec(source)) !== null) {
      const codeText = stripJsxNoise(match[1]);
      if (codeText.length >= 2 && codeText.length <= 80) {
        paragraphs.push(codeText);
      }
    }

    // JSX text nodes (pattern bodies, notes) — catches prose that isn't in <p>
    const textNodeRegex = />([^<{][^<]*)</g;
    while ((match = textNodeRegex.exec(source)) !== null) {
      const nodeText = stripJsxNoise(match[1]);
      if (
        looksLikeProse(nodeText) &&
        !nodeText.startsWith("import ") &&
        !nodeText.includes("className") &&
        !nodeText.includes("codeByFramework") &&
        !/^\),/.test(nodeText)
      ) {
        paragraphs.push(nodeText);
      }
    }

    // PropInfo name/key literals (API surface for search)
    for (const propName of [
      ...extractKeyedStrings(source, "name"),
      ...extractKeyedStrings(source, "key"),
    ]) {
      if (/^[A-Za-z][A-Za-z0-9_.]{2,60}$/.test(propName)) {
        terms.push(propName);
        paragraphs.push(propName);
      }
    }

    // Prop descriptions / examples (visible in PropTable)
    for (const description of extractKeyedStrings(source, "description")) {
      if (looksLikeProse(description) || description.length >= 12) {
        paragraphs.push(description);
      }
    }
    for (const example of extractKeyedStrings(source, "example")) {
      if (example.length >= 3 && example.length <= 200) {
        paragraphs.push(example);
      }
    }

    // Longer prose string literals used as visible copy
    for (const key of ["label", "note", "subtitle", "heading", "text"]) {
      for (const value of extractKeyedStrings(source, key)) {
        if (looksLikeProse(value)) paragraphs.push(value);
      }
    }

    const uniqueHeadings = uniqueStrings(headings);
    const pageTerms = uniqueStrings([
      ...terms,
      ...uniqueHeadings,
      ...uniqueHeadings.flatMap(keywordTokensFromHeading),
    ]);

    return {
      headings: uniqueHeadings,
      content: uniqueStrings(paragraphs).join(" "),
      terms: pageTerms,
    };
  } catch (error) {
    console.error(`Error extracting text from ${componentPath}:`, error);
    return { headings: [], content: "", terms: [] };
  }
}

function generateSearchIndex(): void {
  console.log("Generating search index for documentation pages...\n");

  const searchIndex: SearchableDoc[] = [];

  for (const section of docSections) {
    for (const subsection of section.subsections) {
      const docId = subsection.id;
      if (HIDDEN_DOC_IDS.has(docId)) {
        console.log(`Skipping hidden page: ${docId}`);
        continue;
      }

      const contentFileName = slugToContentFileName(docId);
      const componentPath = path.join(docsContentPath, contentFileName);

      if (!fs.existsSync(componentPath)) {
        console.warn(`Missing Content file for ${docId}: ${contentFileName}`);
        continue;
      }

      console.log(`Processing: ${docId}`);

      const { headings, content, terms } = extractTextFromComponent(componentPath);
      const seo = getDocSeoEntry(docId);

      searchIndex.push({
        id: docId,
        path: subsection.path,
        // SEO title/description for result card display only — not stuffed for ranking.
        title: seo?.title ?? subsection.label,
        description: seo?.description ?? `Documentation for ${subsection.label}`,
        // Keywords come from visible page terms (pattern titles, props), not SEO_STRINGS.
        keywords: terms.length > 0 ? terms : [subsection.label],
        content,
        section: section.label,
        headings,
      });
    }
  }

  // Stable order for diffs
  searchIndex.sort((a, b) => a.id.localeCompare(b.id));

  fs.writeFileSync(outputPath, `${JSON.stringify(searchIndex, null, 2)}\n`);

  console.log(`\nSearch index generated successfully!`);
  console.log(`${searchIndex.length} pages indexed`);
  console.log(`Output: ${outputPath}`);

  console.log("\nIndex Summary:");
  const sections = [...new Set(searchIndex.map((entry) => entry.section))];
  for (const sectionLabel of sections) {
    const count = searchIndex.filter((entry) => entry.section === sectionLabel).length;
    console.log(`   ${sectionLabel}: ${count} pages`);
  }
}

generateSearchIndex();
