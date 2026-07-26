<script lang="ts">
  import { SimpleTable } from "@simple-table/svelte";
  import type { Theme, GetRowIdParams } from "@simple-table/svelte";
  import { collapsibleColumnsConfig } from "./collapsible-columns.demo-data";
  import type { CollapsibleSalesRep } from "./collapsible-columns.demo-data";
  import "@simple-table/svelte/styles.css";

  let { height = "400px", theme }: { height?: string | number; theme?: Theme } = $props();

  const getRowId = ({ row }: GetRowIdParams<CollapsibleSalesRep>) => row.id;
</script>

<SimpleTable
  columns={collapsibleColumnsConfig.headers}
  rows={collapsibleColumnsConfig.rows}
  getRowId={getRowId}
  columnResizing={true}
  enableColumnEditor={true}
  selectableCells={true}
  columnReordering={true}
  {height}
  {theme}
/>
