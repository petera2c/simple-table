<script lang="ts">
  import { SimpleTable } from "@simple-table/svelte";
  import type { Theme } from "@simple-table/svelte";
  import { columnSelectionConfig } from "@simple-table/examples-shared";
  import "simple-table-core/styles.css";

  let { height = "400px", theme }: { height?: string | number; theme?: Theme } = $props();
</script>

<SimpleTable
  defaultHeaders={columnSelectionConfig.headers}
  rows={columnSelectionConfig.rows}
  {height}
  {theme}
  selectableColumns={columnSelectionConfig.tableProps.selectableColumns}
/>
