<script lang="ts">
  import { SimpleTable } from "@simple-table/svelte";
  import type { Theme, GetRowIdParams } from "@simple-table/svelte";
  import { emptyStateConfig } from "./empty-state.demo-data";
  import type { EmptyEmployee } from "./empty-state.demo-data";
  import TableEmptyState from "./TableEmptyState.svelte";
  import "@simple-table/svelte/styles.css";

  let { height = "400px", theme }: { height?: string | number; theme?: Theme } = $props();

  const getRowId = ({ row }: GetRowIdParams<EmptyEmployee>) => row.id;
</script>

<SimpleTable
  columns={emptyStateConfig.headers}
  rows={emptyStateConfig.rows}
  getRowId={getRowId}
  tableEmptyStateRenderer={TableEmptyState}
  {height}
  {theme}
/>
