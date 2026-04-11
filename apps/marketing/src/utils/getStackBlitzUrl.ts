import type { Framework } from "@/providers/FrameworkProvider";

const BASE_URL = "https://stackblitz.com/github/petera2c/simple-table/tree/stackblitz-examples";

export function getStackBlitzUrl(demoId: string, framework: Framework): string {
  return `${BASE_URL}/${framework}/${demoId}`;
}
