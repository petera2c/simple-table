<script lang="ts">
  import {SimpleTable, defaultHeadersFromCore} from "@simple-table/svelte";
  import type { Theme } from "@simple-table/svelte";
  import { customThemeConfig } from "./custom-theme.demo-data";
  import "@simple-table/svelte/styles.css";
  import "./custom-theme.css";

  let { height = "400px", theme }: { height?: string | number; theme?: Theme } = $props();
</script>

<SimpleTable
  defaultHeaders={defaultHeadersFromCore(customThemeConfig.headers)}
  rows={customThemeConfig.rows}
  theme={theme ?? "custom"}
  customTheme={customThemeConfig.tableProps.customTheme}
  columnResizing={true}
  selectableCells={true}
  {height}
/>
