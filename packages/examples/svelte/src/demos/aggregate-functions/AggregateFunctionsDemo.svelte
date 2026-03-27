<script lang="ts">
  import { SimpleTable } from "@simple-table/svelte";
  import type { Theme } from "@simple-table/svelte";
  import { aggregateFunctionsConfig } from "@simple-table/examples-shared";
  import "simple-table-core/styles.css";

  let { height = "400px", theme }: { height?: string | number; theme?: Theme } = $props();
</script>

<SimpleTable
  defaultHeaders={aggregateFunctionsConfig.headers}
  rows={aggregateFunctionsConfig.rows}
  rowGrouping={aggregateFunctionsConfig.tableProps.rowGrouping}
  columnResizing={aggregateFunctionsConfig.tableProps.columnResizing}
  {height}
  {theme}
/>
