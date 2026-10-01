<script lang="ts">
  import { SimpleTable } from "@simple-table/svelte";
  import type { Theme, TableAPI, GetRowIdParams } from "@simple-table/svelte";
  import { liveUpdateConfig, liveUpdateData } from "./live-update.demo-data";
  import type { LiveUpdateProduct } from "./live-update.demo-data";
  import "@simple-table/svelte/styles.css";

  let { height = "400px", theme }: { height?: string | number; theme?: Theme } = $props();

  let tableRef = $state<{ getAPI: () => TableAPI<LiveUpdateProduct> | null } | null>(null);
  const getRowId = ({ row }: GetRowIdParams<LiveUpdateProduct>) => row.id;

  $effect(() => {
    if (!tableRef) return;
    const api = tableRef.getAPI?.();
    if (!api) return;

    const currentData: LiveUpdateProduct[] = liveUpdateData.map((row) => ({ ...row }));
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
          const idx = currentData.findIndex((r) => r.id === rowId);
          if (idx === -1) return;
          const product = currentData[idx];

          const newPrice = parseFloat((product.price * (0.95 + Math.random() * 0.1)).toFixed(2));
          currentData[idx] = { ...product, price: newPrice };
          currentApi.updateData({ accessor: "price", rowId, newValue: newPrice });

          const newStock = Math.max(0, product.stock + Math.floor((Math.random() - 0.5) * 6));
          const updatedStockHistory = [...product.stockHistory.slice(1), newStock];
          currentData[idx] = { ...currentData[idx], stock: newStock, stockHistory: updatedStockHistory };
          currentApi.updateData({ accessor: "stock", rowId, newValue: newStock });
          currentApi.updateData({ accessor: "stockHistory", rowId, newValue: updatedStockHistory });

          if (Math.random() < 0.6) {
            const newSales = product.sales + Math.floor(Math.random() * 3) + 1;
            currentData[idx] = { ...currentData[idx], sales: newSales };
            currentApi.updateData({ accessor: "sales", rowId, newValue: newSales });
            currentPeriodSales.set(rowId, (currentPeriodSales.get(rowId) || 0) + (newSales - product.sales));
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
      const visibleIds = new Set(visibleRows.map((vr) => vr.row.id));
      timerMap.forEach((tid, rid) => {
        if (!visibleIds.has(rid)) {
          clearTimeout(tid);
          timerMap.delete(rid);
        }
      });
      visibleRows.forEach((vr) => {
        const rid = vr.row.id;
        if (!timerMap.has(rid)) createRowTimer(rid);
      });
    };

    const salesRotate = setInterval(() => {
      const currentApi = tableRef?.getAPI?.();
      if (!currentApi || !isActive) return;
      currentData.forEach((row, i) => {
        const sp = currentPeriodSales.get(row.id) || 0;
        const updated = [...row.salesHistory.slice(1), sp];
        currentData[i] = { ...row, salesHistory: updated };
        currentApi.updateData({ accessor: "salesHistory", rowId: row.id, newValue: updated });
        currentPeriodSales.set(row.id, 0);
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
  columns={liveUpdateConfig.headers}
  rows={liveUpdateConfig.rows}
  {getRowId}
  {height}
  {theme}
/>
