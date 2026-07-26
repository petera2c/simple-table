<script lang="ts">
  import { SimpleTable } from "@simple-table/svelte";
  import type { Theme, GetRowIdParams } from "@simple-table/svelte";
  import { footerRendererConfig } from "./footer-renderer.demo-data";
  import type { CatalogProduct } from "./footer-renderer.demo-data";
  import { footerDemoTheme } from "./footer-demo-theme";
  import FooterDemoBar from "./FooterDemoBar.svelte";
  import "@simple-table/svelte/styles.css";

  let { height = "400px", theme }: { height?: string | number; theme?: Theme } = $props();

  const getRowId = ({ row }: GetRowIdParams<CatalogProduct>) => row.id;

  $effect.pre(() => {
    footerDemoTheme.set(theme);
  });
</script>

<SimpleTable
  columns={footerRendererConfig.headers}
  rows={footerRendererConfig.rows}
  {getRowId}
  footerRenderer={FooterDemoBar}
  enablePagination={true}
  rowsPerPage={10}
  hideFooter={false}
  {height}
  {theme}
/>
