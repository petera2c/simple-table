<script lang="ts">
  import { SimpleTable } from "@simple-table/svelte";
  import type { Theme, GetRowIdParams } from "@simple-table/svelte";
  import { aggregateFunctionsConfig } from "./aggregate-functions.demo-data";
  import type { AggregateFunctionsRow } from "./aggregate-functions.demo-data";
  import "@simple-table/svelte/styles.css";

  let { height = "400px", theme }: { height?: string | number; theme?: Theme } = $props();

  const getRowId = ({ row }: GetRowIdParams<AggregateFunctionsRow>) => row.id;
</script>

<SimpleTable
  columns={aggregateFunctionsConfig.headers}
  rows={aggregateFunctionsConfig.rows}
  getRowId={getRowId}
  rowGrouping={aggregateFunctionsConfig.tableProps.rowGrouping}
  columnResizing={true}
  {height}
  {theme}
/>
