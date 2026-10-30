<script lang="ts">
  import { SimpleTable } from "@simple-table/svelte";
  import type { Theme, GetRowIdParams } from "@simple-table/svelte";
  import { columnWidthConfig } from "./column-width.demo-data";
  import type { StartupEmployee } from "./column-width.demo-data";
  import "@simple-table/svelte/styles.css";

  let { height = "400px", theme }: { height?: string | number; theme?: Theme } = $props();
  let isMobile = $state(false);

  const getRowId = ({ row }: GetRowIdParams<StartupEmployee>) => row.id;

  function checkMobile() {
    isMobile = window.innerWidth < 768;
  }

  $effect(() => {
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  });
</script>

<SimpleTable
  autoExpandColumns={!isMobile}
  columnResizing={true}
  columns={columnWidthConfig.headers}
  rows={columnWidthConfig.rows}
  getRowId={getRowId}
  {height}
  {theme}
/>
