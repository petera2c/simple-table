<script lang="ts">
  import { SimpleTable } from "@simple-table/svelte";
  import type { Theme } from "@simple-table/svelte";
  import { emptyStateConfig } from "@simple-table/examples-shared";
  import "simple-table-core/styles.css";

  let { height = "400px", theme }: { height?: string | number; theme?: Theme } = $props();

  function createEmptyState() {
    const el = document.createElement("div");
    el.style.cssText = "display:flex;flex-direction:column;align-items:center;justify-content:center;padding:48px;color:#888;";
    el.innerHTML = '<div style="font-size:32px;margin-bottom:8px;">∅</div><div>No data available</div>';
    return el;
  }

  const emptyState = createEmptyState();
</script>

<SimpleTable
  defaultHeaders={emptyStateConfig.headers}
  rows={emptyStateConfig.rows}
  tableEmptyStateRenderer={emptyState}
  {height}
  {theme}
/>
