<script lang="ts">
  import {SimpleTable} from "@simple-table/svelte";  import type { Theme } from "@simple-table/svelte";
  import { nestedTablesConfig, generateNestedTablesData } from "./nested-tables.demo-data";
  import "@simple-table/svelte/styles.css";

  let { height = "500px", theme }: { height?: string | number; theme?: Theme } = $props();

  const sampleData = generateNestedTablesData(25);
</script>

<SimpleTable
  autoExpandColumns={nestedTablesConfig.tableProps.autoExpandColumns}
  defaultHeaders={nestedTablesConfig.headers}
  rows={sampleData}
  rowGrouping={nestedTablesConfig.tableProps.rowGrouping}
  getRowId={nestedTablesConfig.tableProps.getRowId}
  expandAll={nestedTablesConfig.tableProps.expandAll}
  columnResizing={nestedTablesConfig.tableProps.columnResizing}
  {height}
  {theme}
/>
