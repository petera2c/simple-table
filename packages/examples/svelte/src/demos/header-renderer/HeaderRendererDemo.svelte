<script lang="ts">
  import { SimpleTable } from "@simple-table/svelte";
  import type { Theme } from "@simple-table/svelte";
  import { headerRendererConfig } from "@simple-table/examples-shared";
  import "simple-table-core/styles.css";

  let { height = "400px", theme }: { height?: string | number; theme?: Theme } = $props();
</script>

<SimpleTable
  defaultHeaders={headerRendererConfig.headers}
  rows={headerRendererConfig.rows}
  columnResizing={headerRendererConfig.tableProps.columnResizing}
  selectableCells={headerRendererConfig.tableProps.selectableCells}
  {height}
  {theme}
/>
