<script lang="ts">
  import { SimpleTable } from "@simple-table/svelte";
  import type { Theme } from "@simple-table/svelte";
  import { collapsibleColumnsConfig } from "@simple-table/examples-shared";
  import "simple-table-core/styles.css";

  let { height = "400px", theme }: { height?: string | number; theme?: Theme } = $props();
</script>

<SimpleTable
  defaultHeaders={collapsibleColumnsConfig.headers}
  rows={collapsibleColumnsConfig.rows}
  columnResizing={collapsibleColumnsConfig.tableProps.columnResizing}
  {height}
  {theme}
/>
