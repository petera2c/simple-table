import type { HubFrameworkId } from "@/constants/frameworkIntegrationHub";

/** Pillar blog slug per integration hub (deep guides + SEO landing pages). */
export const FRAMEWORK_HUB_PILLAR_BLOG_SLUG: Record<HubFrameworkId, string> = {
  react: "best-free-react-data-grid-2026",
  vue: "vue-nuxt-data-grid-simple-table",
  angular: "angular-data-grid-simple-table",
  svelte: "sveltekit-data-table-simple-table",
  solid: "solidjs-data-grid-simple-table",
  vanilla: "vanilla-typescript-data-grid-simple-table-core",
};
