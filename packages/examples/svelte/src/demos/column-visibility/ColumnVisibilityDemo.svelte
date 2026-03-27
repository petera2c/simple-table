<script lang="ts">
  import { SimpleTable } from "@simple-table/svelte";
  import type { Theme } from "@simple-table/svelte";
  import { columnVisibilityConfig } from "@simple-table/examples-shared";
  import "simple-table-core/styles.css";

  let { height = "400px", theme }: { height?: string | number; theme?: Theme } = $props();
</script>

<SimpleTable
  defaultHeaders={columnVisibilityConfig.headers}
  rows={columnVisibilityConfig.rows}
  editColumns={true}
  {height}
  {theme}
/>
