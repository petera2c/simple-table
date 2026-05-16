<script lang="ts">
  import { SimpleTable } from "@simple-table/svelte";
  import type { Theme, Row } from "@simple-table/svelte";
  import {
    generateWindowScrollRows,
    windowScrollHeaders,
  } from "./window-infinite-scroll.demo-data";
  import "@simple-table/svelte/styles.css";

  // `height` is intentionally ignored — this demo is about *not* setting one.
  let { theme }: { height?: string | number; theme?: Theme } = $props();

  const INITIAL_ROWS = 50;
  const BATCH_SIZE = 50;
  const MAX_ROWS = 5_000;
  const LOAD_DELAY_MS = 350;

  let wrapper: HTMLDivElement | undefined = $state();
  let rows = $state<Row[]>(generateWindowScrollRows(0, INITIAL_ROWS));
  let loading = $state(false);
  let hasMore = $state(true);

  let statusLabel = $derived(
    loading
      ? "Loading more rows…"
      : hasMore
        ? `${rows.length.toLocaleString()} rows loaded · scroll for more`
        : `${rows.length.toLocaleString()} rows loaded · end of dataset`
  );

  // Getter form so we don't capture the wrapper before Svelte attaches the ref.
  // In a regular app outside this preview shell, pass scrollParent="window".
  const getScrollParent = () => wrapper?.parentElement ?? null;

  const getRowId = (p: { row: Row }) => String((p.row as { id?: number })?.id);

  function handleLoadMore() {
    if (loading || !hasMore) return;
    loading = true;

    setTimeout(() => {
      const next = generateWindowScrollRows(rows.length, BATCH_SIZE);
      const updated = [...rows, ...next];
      if (updated.length >= MAX_ROWS) {
        hasMore = false;
        rows = updated.slice(0, MAX_ROWS);
      } else {
        rows = updated;
      }
      loading = false;
    }, LOAD_DELAY_MS);
  }
</script>

<div bind:this={wrapper} style="max-width: 1100px; margin: 0 auto">
  <h1 style="font-size: 28px; margin: 0 0 12px 0; color: #0f172a">
    Window-Scroll Infinite Loading
  </h1>
  <p
    style="font-size: 15px; line-height: 1.6; color: #475569; margin: 0 0 16px 0"
  >
    This table has no <code>height</code> or <code>maxHeight</code>. It grows to its natural
    size inside the page, and uses the outer scroll container (<code>scrollParent</code>) to
    drive both row virtualization and <code>onLoadMore</code>. The header pins to the top of
    the outer scroll viewport as you scroll. Scroll down — new rows stream in as you approach
    the bottom.
  </p>

  <div
    style="display: inline-flex; align-items: center; gap: 8px; padding: 6px 12px; margin-bottom: 16px; background: #eef2ff; color: #3730a3; border-radius: 999px; font-size: 13px; font-weight: 500"
  >
    <span
      style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: #6366f1"
    ></span>
    <span>{statusLabel}</span>
  </div>

  <SimpleTable
    defaultHeaders={windowScrollHeaders}
    {rows}
    {theme}
    {getRowId}
    scrollParent={getScrollParent}
    infiniteScrollThreshold={400}
    onLoadMore={handleLoadMore}
    isLoading={loading && rows.length === 0}
  />

  <p
    style="font-size: 13px; color: #94a3b8; margin: 24px 0 48px 0; text-align: center"
  >
    End of demo content. Keep scrolling near the bottom and onLoadMore will keep firing until
    the dataset is exhausted.
  </p>
</div>
