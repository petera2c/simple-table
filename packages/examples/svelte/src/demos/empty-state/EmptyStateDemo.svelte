<script lang="ts">
  import { SimpleTable } from "@simple-table/svelte";
  import type { Theme } from "@simple-table/svelte";
  import { emptyStateConfig } from "./empty-state.demo-data";
  import TableEmptyState from "./TableEmptyState.svelte";
  import "@simple-table/svelte/styles.css";

  let { height = "400px", theme }: { height?: string | number; theme?: Theme } = $props();
</script>

<SimpleTable
  defaultHeaders={emptyStateConfig.headers}
  rows={emptyStateConfig.rows}
  tableEmptyStateRenderer={TableEmptyState}
  {height}
  {theme}
/>
