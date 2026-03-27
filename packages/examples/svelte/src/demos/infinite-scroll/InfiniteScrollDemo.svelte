<script lang="ts">
  import { SimpleTable } from "@simple-table/svelte";
  import type { Theme, Row } from "@simple-table/svelte";
  import { infiniteScrollConfig, generateInfiniteScrollData } from "@simple-table/examples-shared";
  import "simple-table-core/styles.css";

  let { height = "400px", theme }: { height?: string | number; theme?: Theme } = $props();

  const BATCH_SIZE = 30;
  const MAX_ROWS = 200;

  let rows = $state<Row[]>([...infiniteScrollConfig.rows]);
  let loading = $state(false);
  let hasMore = $state(true);

  function handleLoadMore() {
    if (loading || !hasMore) return;
    loading = true;
    setTimeout(() => {
      const newRows = generateInfiniteScrollData(rows.length, BATCH_SIZE);
      rows = [...rows, ...newRows];
      loading = false;
      if (rows.length >= MAX_ROWS) hasMore = false;
    }, 800);
  }
</script>

<SimpleTable
  defaultHeaders={infiniteScrollConfig.headers}
  {rows}
  isLoading={loading}
  onLoadMore={handleLoadMore}
  {height}
  {theme}
/>
