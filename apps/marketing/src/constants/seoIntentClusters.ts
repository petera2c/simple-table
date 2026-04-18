/**
 * Search intent clusters for multi-framework SEO. Map Google Search Console
 * queries into these buckets (Performance → Queries → filter) to prioritize
 * content: pillars, hub copy, and internal links.
 */
export type SeoIntentClusterId =
  | "react_data_grid"
  | "vue_data_grid"
  | "angular_data_grid"
  | "svelte_data_grid"
  | "solid_data_grid"
  | "vanilla_typescript"
  | "generic_data_grid"
  | "brand_simple_table";

export type SeoIntentCluster = {
  id: SeoIntentClusterId;
  /** Example query fragments to match in GSC exports (not exhaustive). */
  exampleQueryFragments: string[];
  /** Primary on-site surfaces that should satisfy this intent. */
  targetSurfaces: string[];
};

export const SEO_INTENT_CLUSTERS: SeoIntentCluster[] = [
  {
    id: "react_data_grid",
    exampleQueryFragments: ["react data grid", "react table", "@simple-table/react"],
    targetSurfaces: ["/frameworks/react", "/blog/best-free-react-data-grid-2026"],
  },
  {
    id: "vue_data_grid",
    exampleQueryFragments: ["vue data grid", "vue 3 table", "nuxt table", "@simple-table/vue"],
    targetSurfaces: ["/frameworks/vue", "/blog/vue-nuxt-data-grid-simple-table"],
  },
  {
    id: "angular_data_grid",
    exampleQueryFragments: ["angular data grid", "angular table component", "@simple-table/angular"],
    targetSurfaces: ["/frameworks/angular", "/blog/angular-data-grid-simple-table"],
  },
  {
    id: "svelte_data_grid",
    exampleQueryFragments: ["svelte data table", "sveltekit grid", "@simple-table/svelte"],
    targetSurfaces: ["/frameworks/svelte", "/blog/sveltekit-data-table-simple-table"],
  },
  {
    id: "solid_data_grid",
    exampleQueryFragments: ["solidjs table", "solid table", "@simple-table/solid"],
    targetSurfaces: ["/frameworks/solid", "/blog/solidjs-data-grid-simple-table"],
  },
  {
    id: "vanilla_typescript",
    exampleQueryFragments: ["vanilla js data grid", "typescript table no framework", "simple-table-core"],
    targetSurfaces: ["/frameworks/vanilla", "/blog/vanilla-typescript-data-grid-simple-table-core"],
  },
  {
    id: "generic_data_grid",
    exampleQueryFragments: ["javascript data grid", "typescript data grid", "lightweight datagrid"],
    targetSurfaces: ["/", "/frameworks", "/comparisons/simple-table-vs-ag-grid"],
  },
  {
    id: "brand_simple_table",
    exampleQueryFragments: ["simple table", "simple-table npm"],
    targetSurfaces: ["/", "/docs/installation"],
  },
];
