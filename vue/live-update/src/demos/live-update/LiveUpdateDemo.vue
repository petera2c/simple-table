<template>
  <SimpleTable
    ref="tableRef"
    :default-headers="defaultHeadersFromCore(liveUpdateConfig.headers)"
    :rows="liveUpdateConfig.rows"
    :height="height"
    :theme="theme"
  />
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import {SimpleTable, defaultHeadersFromCore} from "@simple-table/vue";
import type { Theme, TableAPI } from "@simple-table/vue";
import { liveUpdateConfig, liveUpdateData } from "./live-update.demo-data";
import "@simple-table/vue/styles.css";

withDefaults(defineProps<{ height?: string | number; theme?: Theme }>(), { height: "400px" });

const tableRef = ref<{ getAPI: () => TableAPI | null } | null>(null);

let cleanupFn: (() => void) | null = null;

onMounted(() => {
  const currentData = JSON.parse(JSON.stringify(liveUpdateData));
  const timerMap = new Map<string | number, ReturnType<typeof setTimeout>>();
  const currentPeriodSales = new Map<string | number, number>();
  let isActive = true;

  const getAPI = () => tableRef.value?.getAPI() ?? null;

  const createRowTimer = (rowId: string | number) => {
    const scheduleUpdate = () => {
      if (!isActive) return;
      const interval = 300 + Math.random() * 700;
      const timerId = setTimeout(() => {
        if (!isActive) return;
        const api = getAPI();
        if (!api) return;
        const idx = currentData.findIndex((r: any) => r.id === rowId);
        if (idx === -1) return;
        const product = currentData[idx];

        if (typeof product.price === "number") {
          const newPrice = parseFloat((product.price * (0.95 + Math.random() * 0.1)).toFixed(2));
          currentData[idx].price = newPrice;
          api.updateData({ accessor: "price", rowIndex: idx, newValue: newPrice });
        }
        if (typeof product.stock === "number") {
          const newStock = Math.max(0, product.stock + Math.floor((Math.random() - 0.5) * 6));
          currentData[idx].stock = newStock;
          api.updateData({ accessor: "stock", rowIndex: idx, newValue: newStock });
          if (Array.isArray(product.stockHistory)) {
            const updated = [...product.stockHistory.slice(1), newStock];
            currentData[idx].stockHistory = updated;
            api.updateData({ accessor: "stockHistory", rowIndex: idx, newValue: updated });
          }
        }
        if (Math.random() < 0.6 && typeof product.sales === "number") {
          const inc = Math.floor(Math.random() * 3) + 1;
          currentData[idx].sales = product.sales + inc;
          api.updateData({ accessor: "sales", rowIndex: idx, newValue: currentData[idx].sales });
          currentPeriodSales.set(rowId, (currentPeriodSales.get(rowId) || 0) + inc);
        }
        scheduleUpdate();
      }, interval);
      timerMap.set(rowId, timerId);
    };
    scheduleUpdate();
  };

  const syncTimers = () => {
    const api = getAPI();
    if (!api) return;
    const visibleRows = api.getVisibleRows();
    const visibleIds = new Set(visibleRows.map((vr) => vr.row.id as string | number));
    timerMap.forEach((tid, rid) => {
      if (!visibleIds.has(rid)) {
        clearTimeout(tid);
        timerMap.delete(rid);
      }
    });
    visibleRows.forEach((vr) => {
      const rid = vr.row.id as string | number;
      if (!timerMap.has(rid)) createRowTimer(rid);
    });
  };

  const salesRotate = setInterval(() => {
    const api = getAPI();
    if (!api || !isActive) return;
    currentData.forEach((row: any, i: number) => {
      if (Array.isArray(row.salesHistory)) {
        const rid = row.id;
        const sp = currentPeriodSales.get(rid) || 0;
        const updated = [...row.salesHistory.slice(1), sp];
        currentData[i].salesHistory = updated;
        api.updateData({ accessor: "salesHistory", rowIndex: i, newValue: updated });
        currentPeriodSales.set(rid, 0);
      }
    });
  }, 2000);

  syncTimers();
  const syncInt = setInterval(syncTimers, 500);

  cleanupFn = () => {
    isActive = false;
    clearInterval(syncInt);
    clearInterval(salesRotate);
    timerMap.forEach((t) => clearTimeout(t));
    timerMap.clear();
  };
});

onUnmounted(() => {
  cleanupFn?.();
});
</script>
