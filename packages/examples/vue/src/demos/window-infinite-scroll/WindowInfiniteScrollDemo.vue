<script setup lang="ts">
import { ref, computed } from "vue";
import { SimpleTable } from "@simple-table/vue";
import type { Theme, Row } from "@simple-table/vue";
import {
  generateWindowScrollRows,
  windowScrollHeaders,
} from "./window-infinite-scroll.demo-data";
import "@simple-table/vue/styles.css";

// `height` is intentionally ignored — this demo is about *not* setting one.
defineProps<{ height?: string | number; theme?: Theme }>();

const INITIAL_ROWS = 50;
const BATCH_SIZE = 50;
const MAX_ROWS = 5_000;
const LOAD_DELAY_MS = 350;

const wrapperRef = ref<HTMLDivElement | null>(null);

const rows = ref<Row[]>(generateWindowScrollRows(0, INITIAL_ROWS));
const loading = ref(false);
const hasMore = ref(true);

const statusLabel = computed(() =>
  loading.value
    ? "Loading more rows…"
    : hasMore.value
      ? `${rows.value.length.toLocaleString()} rows loaded · scroll for more`
      : `${rows.value.length.toLocaleString()} rows loaded · end of dataset`
);

// Getter form so we don't capture the wrapper before Vue attaches the ref.
// In a regular app outside this preview shell, pass scrollParent="window".
const getScrollParent = () => wrapperRef.value?.parentElement ?? null;

const getRowId = (p: { row: Row }) => String((p.row as { id?: number })?.id);

function handleLoadMore() {
  if (loading.value || !hasMore.value) return;
  loading.value = true;

  setTimeout(() => {
    const next = generateWindowScrollRows(rows.value.length, BATCH_SIZE);
    const updated = [...rows.value, ...next];
    if (updated.length >= MAX_ROWS) {
      hasMore.value = false;
      rows.value = updated.slice(0, MAX_ROWS);
    } else {
      rows.value = updated;
    }
    loading.value = false;
  }, LOAD_DELAY_MS);
}
</script>

<template>
  <div ref="wrapperRef" :style="{ maxWidth: '1100px', margin: '0 auto' }">
    <h1 :style="{ fontSize: '28px', margin: '0 0 12px 0', color: '#0f172a' }">
      Window-Scroll Infinite Loading
    </h1>
    <p
      :style="{
        fontSize: '15px',
        lineHeight: '1.6',
        color: '#475569',
        margin: '0 0 16px 0',
      }"
    >
      This table has no <code>height</code> or <code>maxHeight</code>. It grows to its natural
      size inside the page, and uses the outer scroll container (<code>scrollParent</code>) to
      drive both row virtualization and <code>onLoadMore</code>. The header pins to the top of
      the outer scroll viewport as you scroll. Scroll down — new rows stream in as you approach
      the bottom.
    </p>

    <div
      :style="{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        padding: '6px 12px',
        marginBottom: '16px',
        background: '#eef2ff',
        color: '#3730a3',
        borderRadius: '999px',
        fontSize: '13px',
        fontWeight: 500,
      }"
    >
      <span
        :style="{
          display: 'inline-block',
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          background: '#6366f1',
        }"
      />
      <span>{{ statusLabel }}</span>
    </div>

    <SimpleTable
      :default-headers="windowScrollHeaders"
      :rows="rows"
      :theme="$props.theme"
      :get-row-id="getRowId"
      :scroll-parent="getScrollParent"
      :infinite-scroll-threshold="400"
      :on-load-more="handleLoadMore"
      :is-loading="loading && rows.length === 0"
    />

    <p
      :style="{
        fontSize: '13px',
        color: '#94a3b8',
        margin: '24px 0 48px 0',
        textAlign: 'center',
      }"
    >
      End of demo content. Keep scrolling near the bottom and onLoadMore will keep firing until
      the dataset is exhausted.
    </p>
  </div>
</template>
