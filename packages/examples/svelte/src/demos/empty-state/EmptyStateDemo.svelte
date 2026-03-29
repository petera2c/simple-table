<script lang="ts">
  import { SimpleTable } from "@simple-table/svelte";
  import type { Theme } from "@simple-table/svelte";
  import { emptyStateConfig, buildEmptyStateElement } from "@simple-table/examples-shared";
  import "simple-table-core/styles.css";

  let { height = "400px", theme }: { height?: string | number; theme?: Theme } = $props();

  const emptyState = buildEmptyStateElement();
</script>

<SimpleTable
  defaultHeaders={emptyStateConfig.headers}
  rows={emptyStateConfig.rows}
  tableEmptyStateRenderer={emptyState}
  {height}
  {theme}
/>
