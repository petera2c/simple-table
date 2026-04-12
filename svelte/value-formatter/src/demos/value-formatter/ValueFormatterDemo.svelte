<script lang="ts">
  import {SimpleTable, defaultHeadersFromCore} from "@simple-table/svelte";
  import type { Theme } from "@simple-table/svelte";
  import { valueFormatterConfig } from "./value-formatter.demo-data";
  import "@simple-table/svelte/styles.css";

  let { height = "400px", theme }: { height?: string | number; theme?: Theme } = $props();
</script>

<SimpleTable
  defaultHeaders={defaultHeadersFromCore(valueFormatterConfig.headers)}
  rows={valueFormatterConfig.rows}
  {height}
  {theme}
  selectableCells={valueFormatterConfig.tableProps.selectableCells}
/>
