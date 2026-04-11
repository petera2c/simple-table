<script lang="ts">
  import { SimpleTable } from "@simple-table/svelte";
  import type { Theme } from "@simple-table/svelte";
  import { customThemeConfig } from "@simple-table/examples-shared";
  import "@simple-table/svelte/styles.css";
  import "../../../../shared/src/styles/custom-theme.css";

  let { height = "400px", theme }: { height?: string | number; theme?: Theme } = $props();
</script>

<SimpleTable
  defaultHeaders={customThemeConfig.headers}
  rows={customThemeConfig.rows}
  theme={theme ?? "custom"}
  customTheme={customThemeConfig.tableProps.customTheme}
  columnResizing={true}
  selectableCells={true}
  {height}
/>
