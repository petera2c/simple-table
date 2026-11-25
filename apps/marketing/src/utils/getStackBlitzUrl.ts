import type { Framework } from "@/providers/FrameworkProvider";

const BASE_URL = "https://stackblitz.com/github/petera2c/simple-table/tree/stackblitz-examples";

/**
 * Docs demos that have no folder of their own on the stackblitz-examples branch
 * (scripts/generate-stackblitz.mjs DEMO_LIST). They open the closest full example
 * instead of a missing path.
 */
const STACKBLITZ_DEMO_ALIASES: Record<string, string> = {
  "row-selection-single": "row-selection",
  "row-selection-click": "row-selection",
  "row-selection-api": "row-selection",
};

export function getStackBlitzUrl(demoId: string, framework: Framework): string {
  const target = STACKBLITZ_DEMO_ALIASES[demoId] ?? demoId;
  return `${BASE_URL}/${framework}/${target}`;
}
