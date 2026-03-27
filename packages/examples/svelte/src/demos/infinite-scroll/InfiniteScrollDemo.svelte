<script lang="ts">
  import { SimpleTable } from "@simple-table/svelte";
  import type { Theme } from "@simple-table/svelte";
  import type { Row } from "simple-table-core";
  import { infiniteScrollConfig, generateInfiniteScrollData } from "@simple-table/examples-shared";
  import "simple-table-core/styles.css";

  let { height = "400px", theme }: { height?: string | number; theme?: Theme } = $props();

  const MAX_ROWS = 200;
  const BATCH_SIZE = 15;

  let rows = $state<Row[]>(generateInfiniteScrollData(0, 30) as Row[]);
  let loading = $state(false);
  let hasMore = $state(true);

  function handleLoadMore() {
    if (loading || !hasMore) return;
    loading = true;
    setTimeout(() => {
      const newRows = generateInfiniteScrollData(rows.length, BATCH_SIZE) as Row[];
      rows = [...rows, ...newRows];
      if (rows.length >= MAX_ROWS) hasMore = false;
      loading = false;
    }, 500);
  }
</script>

<div>
  <div style="margin-bottom: 8px; font-size: 13px; color: #666">
    {rows.length} rows loaded{hasMore ? "" : " (all loaded)"}
  </div>
  <SimpleTable
    defaultHeaders={infiniteScrollConfig.headers}
    {rows}
    isLoading={loading}
    onLoadMore={handleLoadMore}
    {height}
    {theme}
  />
</div>
