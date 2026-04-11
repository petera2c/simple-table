<script lang="ts">
  import { SimpleTable } from "@simple-table/svelte";
  import type { Theme } from "@simple-table/svelte";
  import { columnSortingConfig } from "@simple-table/examples-shared";
  import "@simple-table/svelte/styles.css";

  let { height = "400px", theme }: { height?: string | number; theme?: Theme } = $props();
</script>

<SimpleTable
  defaultHeaders={columnSortingConfig.headers}
  rows={columnSortingConfig.rows}
  {height}
  {theme}
  initialSortColumn={columnSortingConfig.tableProps.initialSortColumn}
  initialSortDirection={columnSortingConfig.tableProps.initialSortDirection}
/>
