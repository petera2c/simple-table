import { FRAMEWORK_LABELS, type Framework } from "@/constants/frameworks";

/**
 * Paste-ready AI prompt for installing Simple Table and building a basic table.
 * Short prose style (TanStack-like): detect framework from the project, with the
 * site selector as a soft hint — not a hard assumption.
 */
export function getAiTablePrompt(framework: Framework): string {
  const label = FRAMEWORK_LABELS[framework];

  return `Build a Simple Table data grid for this TypeScript app. Detect the UI framework in the project (likely ${label}), install the official Simple Table adapter for it, import its styles, and show a basic table with sample columns and rows. Prefer https://www.simple-table.com/docs/quick-start over inventing APIs.`;
}
