/**
 * Canonical inventory of comparison landing pages for homepage, footer, and CTAs.
 */

export type ComparisonFrameworkTag =
  | "react"
  | "vue"
  | "angular"
  | "svelte"
  | "vanilla"
  | "multi";

export interface ComparisonEntry {
  title: string;
  description: string;
  link: string;
  framework: ComparisonFrameworkTag;
}

export const COMPARISON_ENTRIES: ComparisonEntry[] = [
  {
    title: "vs AG Grid",
    description:
      "Compare our lightweight solution against AG Grid's enterprise features and pricing",
    link: "/comparisons/simple-table-vs-ag-grid",
    framework: "react",
  },
  {
    title: "vs AG Grid (Angular)",
    description: "AG Grid Enterprise pricing and features vs Simple Table for Angular apps",
    link: "/comparisons/simple-table-vs-ag-grid-angular",
    framework: "angular",
  },
  {
    title: "vs Handsontable",
    description: "See how we match up to Handsontable's spreadsheet-like functionality",
    link: "/comparisons/simple-table-vs-handsontable",
    framework: "multi",
  },
  {
    title: "vs TanStack Table",
    description: "See how our ready-to-use solution compares to TanStack's headless approach",
    link: "/comparisons/simple-table-vs-tanstack",
    framework: "react",
  },
  {
    title: "vs Material React Table",
    description: "Discover the benefits over Material React Table and the MUI stack",
    link: "/comparisons/simple-table-vs-material-react",
    framework: "react",
  },
  {
    title: "vs Ant Design Table",
    description: "Compare with Ant Design's table component for feature-rich applications",
    link: "/comparisons/simple-table-vs-ant-design",
    framework: "react",
  },
  {
    title: "vs Syncfusion",
    description: "Enterprise Syncfusion DataGrid pricing and bundle size vs Simple Table",
    link: "/comparisons/simple-table-vs-syncfusion",
    framework: "multi",
  },
  {
    title: "vs Tabulator",
    description: "Tabulator vs Simple Table for React-first JavaScript data grids",
    link: "/comparisons/simple-table-vs-tabulator",
    framework: "react",
  },
  {
    title: "vs Tabulator (Vanilla)",
    description: "Vanilla JS Tabulator vs Simple Table Core for framework-free apps",
    link: "/comparisons/simple-table-vs-tabulator-vanilla",
    framework: "vanilla",
  },
  {
    title: "vs Vuetify Data Table",
    description: "Vuetify's data table vs Simple Table for Vue 3 applications",
    link: "/comparisons/simple-table-vs-vuetify",
    framework: "vue",
  },
  {
    title: "vs PrimeVue DataTable",
    description: "PrimeVue DataTable vs Simple Table for Vue data-heavy UIs",
    link: "/comparisons/simple-table-vs-primevue-datatable",
    framework: "vue",
  },
  {
    title: "vs PrimeNG Table",
    description: "PrimeNG Table vs Simple Table for Angular enterprise apps",
    link: "/comparisons/simple-table-vs-primeng-table",
    framework: "angular",
  },
  {
    title: "vs ngx-datatable",
    description: "ngx-datatable vs Simple Table for Angular grids",
    link: "/comparisons/simple-table-vs-ngx-datatable",
    framework: "angular",
  },
  {
    title: "vs Svelte Headless Table",
    description: "Headless Svelte tables vs Simple Table's batteries-included adapter",
    link: "/comparisons/simple-table-vs-svelte-headless-table",
    framework: "svelte",
  },
];

export const COMPARISON_FOOTER_LINKS = COMPARISON_ENTRIES.map((entry) => ({
  href: entry.link,
  label: `Simple Table ${entry.title}`,
}));
