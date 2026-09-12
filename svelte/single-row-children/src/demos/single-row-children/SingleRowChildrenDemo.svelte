<script lang="ts">
  import { SimpleTable } from "@simple-table/svelte";
  import type { Theme, GetRowIdParams } from "@simple-table/svelte";
  import { singleRowChildrenConfig } from "./single-row-children.demo-data";
  import type { StudentRecord } from "./single-row-children.demo-data";
  import "@simple-table/svelte/styles.css";

  let { height = "400px", theme }: { height?: string | number; theme?: Theme } = $props();

  const getRowId = ({ row }: GetRowIdParams<StudentRecord>) => row.id;
</script>

<SimpleTable
  columns={singleRowChildrenConfig.headers}
  rows={singleRowChildrenConfig.rows}
  getRowId={getRowId}
  columnResizing={singleRowChildrenConfig.tableProps.columnResizing}
  selectableCells={singleRowChildrenConfig.tableProps.selectableCells}
  {height}
  {theme}
/>
