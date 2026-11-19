<script lang="ts">
  import { SimpleTable } from "@simple-table/svelte";
  import type { Theme, GetRowIdParams } from "@simple-table/svelte";
  import { columnFilteringConfig } from "./column-filtering.demo-data";
  import type { ColumnFilteringEmployee } from "./column-filtering.demo-data";
  import "@simple-table/svelte/styles.css";

  let { height = "400px", theme }: { height?: string | number; theme?: Theme } = $props();

  const getRowId = ({ row }: GetRowIdParams<ColumnFilteringEmployee>) => row.id;
</script>

<SimpleTable
  columns={columnFilteringConfig.headers}
  rows={columnFilteringConfig.rows}
  getRowId={getRowId}
  {height}
  {theme}
/>
