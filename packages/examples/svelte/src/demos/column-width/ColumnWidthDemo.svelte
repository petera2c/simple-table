<script lang="ts">
  import { SimpleTable } from "@simple-table/svelte";
  import type { Theme } from "@simple-table/svelte";
  import { columnWidthConfig } from "@simple-table/examples-shared";
  import "simple-table-core/styles.css";

  let { height = "400px", theme }: { height?: string | number; theme?: Theme } = $props();
  let isMobile = $state(false);

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
  defaultHeaders={columnWidthConfig.headers}
  rows={columnWidthConfig.rows}
  {height}
  {theme}
/>
