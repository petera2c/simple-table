<script lang="ts">
  import { SimpleTable } from "@simple-table/svelte";
  import type { Theme } from "@simple-table/svelte";
  import { footerRendererConfig } from "./footer-renderer.demo-data";
  import { footerDemoTheme } from "./footer-demo-theme";
  import FooterDemoBar from "./FooterDemoBar.svelte";
  import "@simple-table/svelte/styles.css";

  let { height = "400px", theme }: { height?: string | number; theme?: Theme } = $props();

  $effect.pre(() => {
    footerDemoTheme.set(theme);
  });
</script>

<SimpleTable
  defaultHeaders={footerRendererConfig.headers}
  rows={footerRendererConfig.rows}
  footerRenderer={FooterDemoBar}
  shouldPaginate={true}
  rowsPerPage={10}
  hideFooter={false}
  {height}
  {theme}
/>
