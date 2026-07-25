/**
 * Generate Fuse.js search index for documentation pages.
 *
 * Sources of truth:
 * - docsNavigation.ts → page list, paths, sections
 * - docsSeo.ts + SEO_STRINGS → title, description, keywords
 * - docs-pages/*Content.tsx → headings + searchable content
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
const HIDDEN_DOC_IDS = new Set(["column-editing"]);

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

function stripJsxNoise(text: string): string {
  return text
    .replace(/\{[^}]*\}/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function extractTextFromComponent(componentPath: string): {
  headings: string[];
  content: string;
} {
  try {
    const source = fs.readFileSync(componentPath, "utf-8");
    const headings: string[] = [];
    const paragraphs: string[] = [];

    // Explicit JSX headings
    const headingRegex = /<h[123][^>]*>([\s\S]*?)<\/h[123]>/g;
    let match: RegExpExecArray | null;
    while ((match = headingRegex.exec(source)) !== null) {
      const headingContent = stripJsxNoise(match[1]);
      if (headingContent) headings.push(headingContent);
    }

    // Pattern / DocsStep titles: title: "Export to CSV"
    const titleLiteralRegex = /\btitle:\s*["']([^"']{3,80})["']/g;
    while ((match = titleLiteralRegex.exec(source)) !== null) {
      const title = match[1].trim();
      if (title && !title.includes("http") && !title.includes("className")) {
        headings.push(title);
      }
    }

    // Paragraphs
    const paragraphRegex = /<p[^>]*>([\s\S]*?)<\/p>/g;
    while ((match = paragraphRegex.exec(source)) !== null) {
      const paragraphContent = stripJsxNoise(match[1]);
      if (paragraphContent) paragraphs.push(paragraphContent);
    }

    // List items
    const listItemRegex = /<li[^>]*>([\s\S]*?)<\/li>/g;
    while ((match = listItemRegex.exec(source)) !== null) {
      const listItemContent = stripJsxNoise(match[1]);
      if (listItemContent) paragraphs.push(listItemContent);
    }

    // PropInfo name/key literals (API surface for search)
    const propNameRegex = /\b(?:name|key):\s*["']([A-Za-z][A-Za-z0-9_.]{2,60})["']/g;
    while ((match = propNameRegex.exec(source)) !== null) {
      paragraphs.push(match[1]);
    }

    // Longer prose string literals (intro copy, descriptions)
    const stringLiteralRegex = /["'`]([^"'`]{20,}?)["'`]/g;
    while ((match = stringLiteralRegex.exec(source)) !== null) {
      const stringContent = match[1].trim();
      if (
        stringContent &&
        !stringContent.includes("import") &&
        !stringContent.includes("http") &&
        !stringContent.includes("className") &&
        !stringContent.includes("=") &&
        stringContent.length < 500 &&
        /[a-z]{3,}/i.test(stringContent)
      ) {
        paragraphs.push(stringContent);
      }
    }

    return {
      headings: uniqueStrings(headings),
      content: uniqueStrings(paragraphs).join(" "),
    };
  } catch (error) {
    console.error(`Error extracting text from ${componentPath}:`, error);
    return { headings: [], content: "" };
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

      const { headings, content } = extractTextFromComponent(componentPath);
      const seo = getDocSeoEntry(docId);

      searchIndex.push({
        id: docId,
        path: subsection.path,
        title: seo?.title ?? subsection.label,
        description: seo?.description ?? `Documentation for ${subsection.label}`,
        keywords: seo?.keywords ?? ["simple-table", "documentation", subsection.label],
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
