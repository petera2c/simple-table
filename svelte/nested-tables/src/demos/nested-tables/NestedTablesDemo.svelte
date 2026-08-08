<script lang="ts">
  import { SimpleTable } from "@simple-table/svelte";
  import type { Theme, GetRowIdParams } from "@simple-table/svelte";
  import {
    nestedTablesConfig,
    generateNestedTablesData,
    type NestedCompany,
  } from "./nested-tables.demo-data";
  import "@simple-table/svelte/styles.css";

  let { height = "500px", theme }: { height?: string | number; theme?: Theme } = $props();

  const sampleData = generateNestedTablesData(25);
  const getRowId = ({ row }: GetRowIdParams<NestedCompany>) => row.id;
</script>

<SimpleTable
  autoExpandColumns={nestedTablesConfig.tableProps.autoExpandColumns}
  columns={nestedTablesConfig.headers}
  rows={sampleData}
  rowGrouping={nestedTablesConfig.tableProps.rowGrouping}
  {getRowId}
  expandAll={nestedTablesConfig.tableProps.expandAll}
  columnResizing={nestedTablesConfig.tableProps.columnResizing}
  {height}
  {theme}
/>
