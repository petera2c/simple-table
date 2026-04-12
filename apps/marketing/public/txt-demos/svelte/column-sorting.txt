<script lang="ts">
  import {SimpleTable, defaultHeadersFromCore} from "@simple-table/svelte";
  import type { Theme } from "@simple-table/svelte";
  import { columnSortingConfig } from "./column-sorting.demo-data";
  import "@simple-table/svelte/styles.css";

  let { height = "400px", theme }: { height?: string | number; theme?: Theme } = $props();
</script>

<SimpleTable
  defaultHeaders={defaultHeadersFromCore(columnSortingConfig.headers)}
  rows={columnSortingConfig.rows}
  {height}
  {theme}
  initialSortColumn={columnSortingConfig.tableProps.initialSortColumn}
  initialSortDirection={columnSortingConfig.tableProps.initialSortDirection}
/>
