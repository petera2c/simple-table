import { onMount, onCleanup } from "solid-js";
import {SimpleTable, defaultHeadersFromCore} from "@simple-table/solid";
import type { Theme, TableAPI } from "@simple-table/solid";
import { liveUpdateConfig, liveUpdateData } from "./live-update.demo-data";
import "@simple-table/solid/styles.css";

export default function LiveUpdateDemo(props: { height?: string | number; theme?: Theme }) {
  let tableRef: TableAPI | undefined;
  let cleanupFn: (() => void) | undefined;

  onMount(() => {
    if (!tableRef) return;
    const currentData = JSON.parse(JSON.stringify(liveUpdateData));
    const timerMap = new Map<string | number, ReturnType<typeof setTimeout>>();
    const currentPeriodSales = new Map<string | number, number>();
    let isActive = true;

    const createRowTimer = (rowId: string | number) => {
      const scheduleUpdate = () => {
        if (!isActive) return;
        const interval = 300 + Math.random() * 700;
        const timerId = setTimeout(() => {
          if (!isActive || !tableRef) return;
          const idx = currentData.findIndex((r: (typeof liveUpdateData)[number]) => r.id === rowId);
          if (idx === -1) return;
          const product = currentData[idx];

          if (typeof product.price === "number") {
            const newPrice = parseFloat((product.price * (0.95 + Math.random() * 0.1)).toFixed(2));
            currentData[idx].price = newPrice;
            tableRef.updateData({ accessor: "price", rowIndex: idx, newValue: newPrice });
          }
          if (typeof product.stock === "number") {
            const newStock = Math.max(0, product.stock + Math.floor((Math.random() - 0.5) * 6));
            currentData[idx].stock = newStock;
            tableRef.updateData({ accessor: "stock", rowIndex: idx, newValue: newStock });
            if (Array.isArray(product.stockHistory)) {
              const updated = [...product.stockHistory.slice(1), newStock];
              currentData[idx].stockHistory = updated;
              tableRef.updateData({ accessor: "stockHistory", rowIndex: idx, newValue: updated });
            }
          }
          if (Math.random() < 0.6 && typeof product.sales === "number") {
            const inc = Math.floor(Math.random() * 3) + 1;
            currentData[idx].sales = product.sales + inc;
            tableRef.updateData({ accessor: "sales", rowIndex: idx, newValue: currentData[idx].sales });
            currentPeriodSales.set(rowId, (currentPeriodSales.get(rowId) || 0) + inc);
          }
          scheduleUpdate();
        }, interval);
        timerMap.set(rowId, timerId);
      };
      scheduleUpdate();
    };

    const syncTimers = () => {
      if (!tableRef) return;
      const visibleRows = tableRef.getVisibleRows();
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
      if (!tableRef || !isActive) return;
      currentData.forEach((row: (typeof liveUpdateData)[number], i: number) => {
        if (Array.isArray(row.salesHistory)) {
          const rid = row.id;
          const sp = currentPeriodSales.get(rid) || 0;
          const updated = [...row.salesHistory.slice(1), sp];
          currentData[i].salesHistory = updated;
          tableRef!.updateData({ accessor: "salesHistory", rowIndex: i, newValue: updated });
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

  onCleanup(() => cleanupFn?.());

  return (
    <SimpleTable
      ref={(api) => (tableRef = api)}
      defaultHeaders={defaultHeadersFromCore(liveUpdateConfig.headers)}
      rows={liveUpdateConfig.rows}
      height={props.height ?? "400px"}
      theme={props.theme}
    />
  );
}
