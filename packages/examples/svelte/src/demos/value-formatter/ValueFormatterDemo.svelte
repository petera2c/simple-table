<script lang="ts">
  import { SimpleTable } from "@simple-table/svelte";
  import type { Theme, GetRowIdParams } from "@simple-table/svelte";
  import { valueFormatterConfig } from "./value-formatter.demo-data";
  import type { FormattedEmployee } from "./value-formatter.demo-data";
  import "@simple-table/svelte/styles.css";

  let { height = "400px", theme }: { height?: string | number; theme?: Theme } = $props();

  const getRowId = ({ row }: GetRowIdParams<FormattedEmployee>) => row.id;
</script>

<SimpleTable
  columns={valueFormatterConfig.headers}
  rows={valueFormatterConfig.rows}
  getRowId={getRowId}
  {height}
  {theme}
  selectableCells={valueFormatterConfig.tableProps.selectableCells}
/>
