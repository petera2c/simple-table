<script lang="ts">
  import { SimpleTable } from "@simple-table/svelte";
  import type { Theme, GetRowIdParams } from "@simple-table/svelte";
  import { columnSortingConfig } from "./column-sorting.demo-data";
  import type { FacultyMember } from "./column-sorting.demo-data";
  import "@simple-table/svelte/styles.css";

  let { height = "400px", theme }: { height?: string | number; theme?: Theme } = $props();

  const getRowId = ({ row }: GetRowIdParams<FacultyMember>) => row.id;
</script>

<SimpleTable
  columns={columnSortingConfig.headers}
  rows={columnSortingConfig.rows}
  getRowId={getRowId}
  {height}
  {theme}
  initialSortColumn="age"
  initialSortDirection="desc"
/>
