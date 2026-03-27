<script lang="ts">
  import { SimpleTable } from "simple-table-svelte";
  import type { Theme } from "simple-table-svelte";
  import { quickStartConfig } from "@simple-table/examples-shared";
  import "simple-table-core/styles.css";

  let { height = "300px", theme }: { height?: string | number; theme?: Theme } = $props();
</script>

<SimpleTable
  defaultHeaders={quickStartConfig.headers}
  rows={quickStartConfig.rows}
  {height}
  {theme}
  editColumns={quickStartConfig.tableProps.editColumns}
  selectableCells={quickStartConfig.tableProps.selectableCells}
  customTheme={quickStartConfig.tableProps.customTheme}
/>
