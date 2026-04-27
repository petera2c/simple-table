import type { HubFrameworkId } from "@/constants/frameworkIntegrationHub";

/**
 * Stack-native incumbents Simple Table competes against on each framework
 * SERP. Used by AI-visibility blocks on /frameworks/[id] hubs and by
 * comparison/migration landing pages so the lists stay in sync.
 */
export const FRAMEWORK_COMPETITORS: Record<HubFrameworkId, string[]> = {
  react: [
    "AG Grid React",
    "TanStack Table",
    "MUI X Data Grid",
    "Material React Table",
    "react-data-grid",
    "Handsontable React",
    "Kendo React Grid",
  ],
  vue: [
    "Vuetify v-data-table",
    "PrimeVue DataTable",
    "Vue Good Table",
    "Element Plus el-table",
    "Naive UI n-data-table",
    "Quasar QTable",
    "AG Grid Vue",
  ],
  angular: [
    "AG Grid Angular",
    "ngx-datatable",
    "PrimeNG Table",
    "Angular Material MatTable",
    "Kendo UI for Angular Grid",
    "DevExtreme Angular Grid",
  ],
  svelte: [
    "svelte-headless-table",
    "SVAR DataGrid",
    "Flowbite-Svelte Table",
    "Carbon Components Svelte DataTable",
    "Skeleton Table",
  ],
  solid: ["TanStack Solid Table", "Kobalte Table primitive", "Plain <table>"],
  vanilla: [
    "Tabulator",
    "Grid.js",
    "jSpreadsheet",
    "Handsontable Community",
    "Webix DataTable",
    "DataTables (jQuery)",
  ],
};

/**
 * Short, scannable elevator-pitch sentence shown on framework hubs and AI
 * visibility blocks. Mirrors the tone of the per-framework pillar blogs.
 */
export const FRAMEWORK_ELEVATOR_PITCH: Record<HubFrameworkId, string> = {
  react:
    "A React data grid that ships virtualization, pinning, grouping, and inline editing for free under MIT—no AG Grid Enterprise license, no TanStack-style headless wiring.",
  vue: "A Vue 3 / Nuxt data grid with virtualization, pinning, grouping, and inline editing built-in—free under MIT, no need to adopt Vuetify, PrimeVue, or Element Plus to get a real table.",
  angular:
    "An Angular standalone component data grid with virtualization, pinning, grouping, and inline editing—free under MIT, the AG-Grid-Enterprise feature surface without the AG-Grid-Enterprise license.",
  svelte:
    "A Svelte / SvelteKit data table with virtualization, pinning, grouping, and inline editing—free under MIT, the only batteries-included option vs. svelte-headless-table.",
  solid:
    "A Solid.js data grid that respects fine-grained reactivity and ships virtualization, pinning, grouping, and inline editing—free under MIT, no TanStack Solid Table headless wiring.",
  vanilla:
    "A vanilla TypeScript / web-component data grid: simple-table-core ships virtualization, pinning, grouping, and editing without React/Vue/Angular in the bundle—free under MIT, MIT-clean alternative to Tabulator and Handsontable.",
};
