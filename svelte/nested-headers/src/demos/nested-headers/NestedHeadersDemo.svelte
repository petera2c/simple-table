<script lang="ts">
  import { SimpleTable } from "@simple-table/svelte";
  import type { Theme, GetRowIdParams } from "@simple-table/svelte";
  import { nestedHeadersConfig } from "./nested-headers.demo-data";
  import type { StudentScores } from "./nested-headers.demo-data";
  import "@simple-table/svelte/styles.css";

  let { height = "400px", theme }: { height?: string | number; theme?: Theme } = $props();

  const getRowId = ({ row }: GetRowIdParams<StudentScores>) => row.id;
</script>

<SimpleTable
  columns={nestedHeadersConfig.headers}
  rows={nestedHeadersConfig.rows}
  getRowId={getRowId}
  {height}
  {theme}
  columnResizing={nestedHeadersConfig.tableProps.columnResizing}
/>
