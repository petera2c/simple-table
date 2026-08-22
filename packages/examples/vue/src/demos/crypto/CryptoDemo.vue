<template>
  <SimpleTable
    :auto-expand-columns="true"
    ref="tableRef"
    :columns="cryptoConfig.headers"
    :rows="cryptoConfig.rows"
    :get-row-id="getRowId"
    :height="height"
    :theme="theme"
    column-reordering
    column-resizing
    enable-column-editor
    selectable-cells
    cell-update-flash
    :custom-theme="{ headerHeight: 40, rowHeight: 48 }"
  />
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { SimpleTable } from "@simple-table/vue";
import type { Theme, TableAPI, CellValue, GetRowIdParams, SimpleTableExposed } from "@simple-table/vue";
import { cryptoConfig } from "./crypto.demo-data";
import type { CryptoCoin } from "./crypto.demo-data";
import "@simple-table/vue/styles.css";

withDefaults(defineProps<{ height?: string | number; theme?: Theme }>(), { height: "70dvh" });

const tableRef = ref<SimpleTableExposed<CryptoCoin> | null>(null);
const getRowId = ({ row }: GetRowIdParams<CryptoCoin>) => row.id;
let cleanupFn: (() => void) | null = null;

const TICK_MS = 90;
const ROWS_PER_TICK = 6;

function pickRandomSubset<T>(arr: T[], n: number): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const t = copy[i]!;
    copy[i] = copy[j]!;
    copy[j] = t;
  }
  return copy.slice(0, Math.min(n, copy.length));
}

function applyRowPatch(api: TableAPI<CryptoCoin>, rowId: string | number, patch: Partial<CryptoCoin>) {
  for (const accessor of Object.keys(patch)) {
    const newValue = patch[accessor as keyof CryptoCoin];
    if (newValue === undefined) continue;
    api.updateData({ accessor, rowId, newValue: newValue as CellValue });
  }
}

function runTick(getApi: () => TableAPI<CryptoCoin> | null | undefined) {
  const api = getApi();
  if (!api) return;
  const visible = api.getVisibleRows();
  if (!visible.length) return;
  for (const vr of pickRandomSubset(visible, ROWS_PER_TICK)) {
    const rowId = vr.row.id as string | number | undefined;
    if (rowId === undefined || rowId === null || rowId === "") continue;
    const currentPrice = vr.row.price as number;
    if (typeof currentPrice !== "number") continue;
    const drift = (Math.random() - 0.5) * 0.012;
    const newPrice = Math.max(currentPrice * (1 + drift), currentPrice * 0.0001);
    const round = newPrice >= 1 ? 1e2 : 1e6;
    const newPriceRounded = Math.round(newPrice * round) / round;
    const currentChange = (vr.row.change24h as number) ?? 0;
    const newChange = Math.round((currentChange + drift * 100) * 100) / 100;
    const history = vr.row.priceHistory as number[];
    const patch: Partial<CryptoCoin> = { price: newPriceRounded, change24h: newChange };
    if (Array.isArray(history) && history.length > 0) {
      patch.priceHistory = [...history.slice(1), newPriceRounded];
    }
    applyRowPatch(api, rowId, patch);
  }
}

onMounted(() => {
  const intervalId = setInterval(() => runTick(() => tableRef.value?.getAPI() ?? null), TICK_MS);
  cleanupFn = () => clearInterval(intervalId);
});

onUnmounted(() => cleanupFn?.());
</script>
