<script lang="ts">
  import { SimpleTable } from "@simple-table/svelte";
  import type { Theme } from "@simple-table/svelte";
  import { customThemeConfig } from "@simple-table/examples-shared";
  import "simple-table-core/styles.css";

  let { height = "400px", theme }: { height?: string | number; theme?: Theme } = $props();

  const customThemeOverrides = {
    rowHeight: 40,
    headerHeight: 44,
    fontSize: 13,
  };
</script>

<SimpleTable
  defaultHeaders={customThemeConfig.headers}
  rows={customThemeConfig.rows}
  theme="custom"
  customTheme={customThemeOverrides}
  {height}
/>
