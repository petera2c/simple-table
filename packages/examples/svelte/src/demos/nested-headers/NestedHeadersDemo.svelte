<script lang="ts">
  import {SimpleTable, defaultHeadersFromCore} from "@simple-table/svelte";
  import type { Theme } from "@simple-table/svelte";
  import { nestedHeadersConfig } from "./nested-headers.demo-data";
  import "@simple-table/svelte/styles.css";

  let { height = "400px", theme }: { height?: string | number; theme?: Theme } = $props();
</script>

<SimpleTable
  defaultHeaders={defaultHeadersFromCore(nestedHeadersConfig.headers)}
  rows={nestedHeadersConfig.rows}
  {height}
  {theme}
  columnResizing={nestedHeadersConfig.tableProps.columnResizing}
/>
