<script lang="ts">
  import { SimpleTable } from "@simple-table/svelte";
  import type { Theme, GetRowIdParams } from "@simple-table/svelte";
  import { columnSelectionConfig } from "./column-selection.demo-data";
  import type { TeamMember } from "./column-selection.demo-data";
  import "@simple-table/svelte/styles.css";

  let { height = "400px", theme }: { height?: string | number; theme?: Theme } = $props();

  const getRowId = ({ row }: GetRowIdParams<TeamMember>) => row.id;
</script>

<SimpleTable
  columns={columnSelectionConfig.headers}
  rows={columnSelectionConfig.rows}
  getRowId={getRowId}
  {height}
  {theme}
  selectableColumns={columnSelectionConfig.tableProps.selectableColumns}
/>
