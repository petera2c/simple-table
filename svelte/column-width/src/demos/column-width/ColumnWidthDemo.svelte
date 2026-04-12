<script lang="ts">
  import {SimpleTable, defaultHeadersFromCore} from "@simple-table/svelte";
  import type { Theme } from "@simple-table/svelte";
  import { columnWidthConfig } from "./column-width.demo-data";
  import "@simple-table/svelte/styles.css";

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
  defaultHeaders={defaultHeadersFromCore(columnWidthConfig.headers)}
  rows={columnWidthConfig.rows}
  {height}
  {theme}
/>
