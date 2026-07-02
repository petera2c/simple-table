<script lang="ts">
  import {SimpleTable} from "@simple-table/svelte";  import type { Theme } from "@simple-table/svelte";
  import { columnAlignmentConfig } from "./column-alignment.demo-data";
  import "@simple-table/svelte/styles.css";

  let { height = "400px", theme }: { height?: string | number; theme?: Theme } = $props();
</script>

<SimpleTable
  defaultHeaders={columnAlignmentConfig.headers}
  rows={columnAlignmentConfig.rows}
  {height}
  {theme}
/>
