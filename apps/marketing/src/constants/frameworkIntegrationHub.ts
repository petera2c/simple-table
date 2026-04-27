/**
 * Canonical integration metadata for each supported stack.
 * Used by /frameworks/* hub pages and linked from non-React blog posts.
 */

export type HubFrameworkId = "react" | "vue" | "angular" | "svelte" | "solid" | "vanilla";

export type FrameworkHubEntry = {
  id: HubFrameworkId;
  label: string;
  npmPackage: string;
  /** Packages to list in install docs. Adapters depend on simple-table-core on npm, so only the adapter is needed unless you import from simple-table-core directly (vanilla uses core only). */
  installPackages: string;
  peerSummary: string;
  stylesImport: string;
  /** Relative path under the monorepo for the runnable demo app. */
  examplesMonorepoPath: string;
  /** Primary docs path on the marketing site (React-oriented feature docs). */
  featureDocsPath: string;
  /** Minimal snippet body (no language fence) for display in hub. */
  minimalSnippet: string;
};

const REPO_TREE = "https://github.com/petera2c/simple-table/tree/main";

export const FRAMEWORK_HUB_ENTRIES: FrameworkHubEntry[] = [
  {
    id: "react",
    label: "React",
    npmPackage: "@simple-table/react",
    installPackages: "@simple-table/react",
    peerSummary: "React 18+",
    stylesImport: `import "@simple-table/react/styles.css";`,
    examplesMonorepoPath: "packages/examples/react",
    featureDocsPath: "/docs/installation",
    minimalSnippet: `import { SimpleTable } from "@simple-table/react";
import "@simple-table/react/styles.css";`,
  },
  {
    id: "vue",
    label: "Vue",
    npmPackage: "@simple-table/vue",
    installPackages: "@simple-table/vue",
    peerSummary: "Vue 3+",
    stylesImport: `import "@simple-table/vue/styles.css";`,
    examplesMonorepoPath: "packages/examples/vue",
    featureDocsPath: "/docs/quick-start",
    minimalSnippet: `import { SimpleTable } from "@simple-table/vue";
import "@simple-table/vue/styles.css";`,
  },
  {
    id: "angular",
    label: "Angular",
    npmPackage: "@simple-table/angular",
    installPackages: "@simple-table/angular",
    peerSummary: "Angular 17+ (standalone components supported)",
    stylesImport: `import "@simple-table/angular/styles.css";`,
    examplesMonorepoPath: "packages/examples/angular",
    featureDocsPath: "/docs/quick-start",
    minimalSnippet: `import { SimpleTableComponent } from "@simple-table/angular";
import "@simple-table/angular/styles.css";`,
  },
  {
    id: "svelte",
    label: "Svelte",
    npmPackage: "@simple-table/svelte",
    installPackages: "@simple-table/svelte",
    peerSummary: "Svelte 4+",
    stylesImport: `import "@simple-table/svelte/styles.css";`,
    examplesMonorepoPath: "packages/examples/svelte",
    featureDocsPath: "/docs/quick-start",
    minimalSnippet: `import { SimpleTable } from "@simple-table/svelte";
import "@simple-table/svelte/styles.css";`,
  },
  {
    id: "solid",
    label: "Solid",
    npmPackage: "@simple-table/solid",
    installPackages: "@simple-table/solid",
    peerSummary: "solid-js 1+",
    stylesImport: `import "@simple-table/solid/styles.css";`,
    examplesMonorepoPath: "packages/examples/solid",
    featureDocsPath: "/docs/quick-start",
    minimalSnippet: `import { SimpleTable } from "@simple-table/solid";
import "@simple-table/solid/styles.css";`,
  },
  {
    id: "vanilla",
    label: "Vanilla JS / TypeScript",
    npmPackage: "simple-table-core",
    installPackages: "simple-table-core",
    peerSummary: "None (bring your own DOM glue)",
    stylesImport: `import "simple-table-core/styles.css";`,
    examplesMonorepoPath: "packages/examples/vanilla",
    featureDocsPath: "/docs/quick-start",
    minimalSnippet: `import { SimpleTableVanilla } from "simple-table-core";
import "simple-table-core/styles.css";`,
  },
];

export const FRAMEWORK_HUB_BY_ID: Record<HubFrameworkId, FrameworkHubEntry> =
  FRAMEWORK_HUB_ENTRIES.reduce(
    (acc, entry) => {
      acc[entry.id] = entry;
      return acc;
    },
    {} as Record<HubFrameworkId, FrameworkHubEntry>
  );

export const FRAMEWORK_HUB_IDS = FRAMEWORK_HUB_ENTRIES.map((e) => e.id);

export type ExampleSlug =
  | "billing"
  | "crm"
  | "hr"
  | "infrastructure"
  | "manufacturing"
  | "music"
  | "sales";

export const EXAMPLE_SLUGS: ExampleSlug[] = [
  "billing",
  "crm",
  "hr",
  "infrastructure",
  "manufacturing",
  "music",
  "sales",
];

/** Human-readable list for marketing copy (matches common site phrasing). */
export const SIMPLE_TABLE_FRAMEWORKS_SHORT =
  "React, Vue, Angular, Svelte, Solid, and vanilla TypeScript";

/** One sentence for comparisons, CTAs, and meta descriptions. */
export const SIMPLE_TABLE_MULTI_FRAMEWORK_TAGLINE = `Simple Table pairs a shared core (simple-table-core) with official adapters for ${SIMPLE_TABLE_FRAMEWORKS_SHORT}.`;

export function getNpmPackageUrl(pkg: string): string {
  return `https://www.npmjs.com/package/${encodeURIComponent(pkg)}`;
}

export function getExamplesSourceUrl(monorepoPath: string): string {
  return `${REPO_TREE}/${monorepoPath}`;
}
