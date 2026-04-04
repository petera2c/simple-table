<script lang="ts">
  import {SimpleTable, defaultHeadersFromCore} from "@simple-table/svelte";
  import type { Theme } from "@simple-table/svelte";
  import { aggregateFunctionsConfig } from "./aggregate-functions.demo-data";
  import "@simple-table/svelte/styles.css";

  let { height = "400px", theme }: { height?: string | number; theme?: Theme } = $props();
</script>

<SimpleTable
  defaultHeaders={defaultHeadersFromCore(aggregateFunctionsConfig.headers)}
  rows={aggregateFunctionsConfig.rows}
  rowGrouping={aggregateFunctionsConfig.tableProps.rowGrouping}
  columnResizing={true}
  {height}
  {theme}
/>
