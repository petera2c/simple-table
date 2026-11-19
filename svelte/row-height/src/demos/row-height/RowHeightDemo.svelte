<script lang="ts">
  import { SimpleTable } from "@simple-table/svelte";
  import type { Theme, GetRowIdParams } from "@simple-table/svelte";
  import { rowHeightConfig } from "./row-height.demo-data";
  import type { ArchitectStaff } from "./row-height.demo-data";
  import "@simple-table/svelte/styles.css";

  let { height = "400px", theme }: { height?: string | number; theme?: Theme } = $props();

  const getRowId = ({ row }: GetRowIdParams<ArchitectStaff>) => row.id;
</script>

<SimpleTable
  columns={rowHeightConfig.headers}
  rows={rowHeightConfig.rows}
  getRowId={getRowId}
  {height}
  {theme}
  customTheme={rowHeightConfig.tableProps.customTheme}
/>
