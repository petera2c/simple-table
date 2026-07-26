<script lang="ts">
  import { SimpleTable } from "@simple-table/svelte";
  import type { Theme, GetRowIdParams } from "@simple-table/svelte";
  import { infiniteScrollConfig, generateInfiniteScrollData } from "./infinite-scroll.demo-data";
  import type { InfiniteScrollEmployee } from "./infinite-scroll.demo-data";
  import "@simple-table/svelte/styles.css";

  let { height = "400px", theme }: { height?: string | number; theme?: Theme } = $props();

  const MAX_ROWS = 200;
  const BATCH_SIZE = 15;

  let rows = $state<InfiniteScrollEmployee[]>(generateInfiniteScrollData(0, 30));
  let loading = $state(false);
  let hasMore = $state(true);

  const getRowId = ({ row }: GetRowIdParams<InfiniteScrollEmployee>) => row.id;

  function handleLoadMore() {
    if (loading || !hasMore) return;
    loading = true;
    setTimeout(() => {
      const newRows = generateInfiniteScrollData(rows.length, BATCH_SIZE);
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
    columns={infiniteScrollConfig.headers}
    {rows}
    {getRowId}
    isLoading={loading}
    onLoadMore={handleLoadMore}
    {height}
    {theme}
  />
</div>
