<script lang="ts">
  import { SimpleTable } from "@simple-table/svelte";
  import type { Theme } from "@simple-table/svelte";
  import { nestedHeadersConfig } from "@simple-table/examples-shared";
  import "simple-table-core/styles.css";

  let { height = "400px", theme }: { height?: string | number; theme?: Theme } = $props();
</script>

<SimpleTable
  defaultHeaders={nestedHeadersConfig.headers}
  rows={nestedHeadersConfig.rows}
  {height}
  {theme}
  columnResizing={true}
/>
