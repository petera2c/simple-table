<script lang="ts">
  import { SimpleTable } from "@simple-table/svelte";
  import type { Theme, GetRowIdParams } from "@simple-table/svelte";
  import { customThemeConfig } from "./custom-theme.demo-data";
  import type { ThemeContact } from "./custom-theme.demo-data";
  import "@simple-table/svelte/styles.css";
  import "./custom-theme.css";

  let { height = "400px", theme }: { height?: string | number; theme?: Theme } = $props();

  const getRowId = ({ row }: GetRowIdParams<ThemeContact>) => row.id;
</script>

<SimpleTable
  columns={customThemeConfig.headers}
  rows={customThemeConfig.rows}
  getRowId={getRowId}
  theme={theme ?? "custom"}
  customTheme={customThemeConfig.tableProps.customTheme}
  columnResizing={true}
  selectableCells={true}
  {height}
/>
