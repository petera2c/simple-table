<script lang="ts">
  import {SimpleTable, defaultHeadersFromCore} from "@simple-table/svelte";
  import type { Theme } from "@simple-table/svelte";
  import { singleRowChildrenConfig } from "./single-row-children.demo-data";
  import "@simple-table/svelte/styles.css";

  let { height = "400px", theme }: { height?: string | number; theme?: Theme } = $props();
</script>

<SimpleTable
  defaultHeaders={defaultHeadersFromCore(singleRowChildrenConfig.headers)}
  rows={singleRowChildrenConfig.rows}
  columnResizing={singleRowChildrenConfig.tableProps.columnResizing}
  selectableCells={singleRowChildrenConfig.tableProps.selectableCells}
  {height}
  {theme}
/>
