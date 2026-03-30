<script lang="ts">
  import { SimpleTable } from "@simple-table/svelte";
  import type { Theme } from "@simple-table/svelte";
  import { liveUpdateConfig, liveUpdateData } from "@simple-table/examples-shared";
  import "@simple-table/svelte/styles.css";

  let { height = "400px", theme }: { height?: string | number; theme?: Theme } = $props();

  let tableRef: any;

  $effect(() => {
    if (!tableRef) return;
    const api = tableRef.getAPI?.();
    if (!api) return;

    const currentData = JSON.parse(JSON.stringify(liveUpdateData));
    const timerMap = new Map<string | number, ReturnType<typeof setTimeout>>();
    const currentPeriodSales = new Map<string | number, number>();
    let isActive = true;

    const createRowTimer = (rowId: string | number) => {
      const scheduleUpdate = () => {
        if (!isActive) return;
        const interval = 300 + Math.random() * 700;
        const timerId = setTimeout(() => {
          if (!isActive) return;
          const currentApi = tableRef?.getAPI?.();
          if (!currentApi) return;
          const idx = currentData.findIndex((r: any) => r.id === rowId);
          if (idx === -1) return;
          const product = currentData[idx];

          if (typeof product.price === "number") {
            const newPrice = parseFloat((product.price * (0.95 + Math.random() * 0.1)).toFixed(2));
            currentData[idx].price = newPrice;
            currentApi.updateData({ accessor: "price", rowIndex: idx, newValue: newPrice });
          }
          if (typeof product.stock === "number") {
            const newStock = Math.max(0, product.stock + Math.floor((Math.random() - 0.5) * 6));
            currentData[idx].stock = newStock;
            currentApi.updateData({ accessor: "stock", rowIndex: idx, newValue: newStock });
            if (Array.isArray(product.stockHistory)) {
              const updated = [...product.stockHistory.slice(1), newStock];
              currentData[idx].stockHistory = updated;
              currentApi.updateData({ accessor: "stockHistory", rowIndex: idx, newValue: updated });
            }
          }
          if (Math.random() < 0.6 && typeof product.sales === "number") {
            const inc = Math.floor(Math.random() * 3) + 1;
            currentData[idx].sales = product.sales + inc;
            currentApi.updateData({ accessor: "sales", rowIndex: idx, newValue: currentData[idx].sales });
            currentPeriodSales.set(rowId, (currentPeriodSales.get(rowId) || 0) + inc);
          }
          scheduleUpdate();
        }, interval);
        timerMap.set(rowId, timerId);
      };
      scheduleUpdate();
    };

    const syncTimers = () => {
      const currentApi = tableRef?.getAPI?.();
      if (!currentApi) return;
      const visibleRows = currentApi.getVisibleRows();
      const visibleIds = new Set(visibleRows.map((vr: any) => vr.row.id));
      timerMap.forEach((tid, rid) => {
        if (!visibleIds.has(rid)) {
          clearTimeout(tid);
          timerMap.delete(rid);
        }
      });
      visibleRows.forEach((vr: any) => {
        const rid = vr.row.id;
        if (!timerMap.has(rid)) createRowTimer(rid);
      });
    };

    const salesRotate = setInterval(() => {
      const currentApi = tableRef?.getAPI?.();
      if (!currentApi || !isActive) return;
      currentData.forEach((row: any, i: number) => {
        if (Array.isArray(row.salesHistory)) {
          const rid = row.id;
          const sp = currentPeriodSales.get(rid) || 0;
          const updated = [...row.salesHistory.slice(1), sp];
          currentData[i].salesHistory = updated;
          currentApi.updateData({ accessor: "salesHistory", rowIndex: i, newValue: updated });
          currentPeriodSales.set(rid, 0);
        }
      });
    }, 2000);

    syncTimers();
    const syncInt = setInterval(syncTimers, 500);

    return () => {
      isActive = false;
      clearInterval(syncInt);
      clearInterval(salesRotate);
      timerMap.forEach((t) => clearTimeout(t));
      timerMap.clear();
    };
  });
</script>

<SimpleTable
  bind:this={tableRef}
  defaultHeaders={liveUpdateConfig.headers}
  rows={liveUpdateConfig.rows}
  {height}
  {theme}
/>
