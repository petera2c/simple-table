<script lang="ts">
  import {SimpleTable} from "@simple-table/svelte";  import type { Theme } from "@simple-table/svelte";
  import { columnFilteringConfig } from "./column-filtering.demo-data";
  import "@simple-table/svelte/styles.css";

  let { height = "400px", theme }: { height?: string | number; theme?: Theme } = $props();
</script>

<SimpleTable
  defaultHeaders={columnFilteringConfig.headers}
  rows={columnFilteringConfig.rows}
  {height}
  {theme}
/>
