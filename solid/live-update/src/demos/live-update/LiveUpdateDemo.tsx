import { onMount, onCleanup } from "solid-js";
import { SimpleTable } from "@simple-table/solid";
import type { Theme, TableAPI } from "@simple-table/solid";
import {
  liveUpdateConfig,
  liveUpdateData,
  type LiveUpdateProduct,
} from "./live-update.demo-data";
import "@simple-table/solid/styles.css";

export default function LiveUpdateDemo(props: { height?: string | number; theme?: Theme }) {
  let tableRef: TableAPI<LiveUpdateProduct> | undefined;
  let cleanupFn: (() => void) | undefined;

  onMount(() => {
    if (!tableRef) return;
    const currentData: LiveUpdateProduct[] = JSON.parse(JSON.stringify(liveUpdateData));
    const timerMap = new Map<number, ReturnType<typeof setTimeout>>();
    const currentPeriodSales = new Map<number, number>();
    let isActive = true;

    const createRowTimer = (rowId: number) => {
      const scheduleUpdate = () => {
        if (!isActive) return;
        const interval = 300 + Math.random() * 700;
        const timerId = setTimeout(() => {
          if (!isActive || !tableRef) return;
          const idx = currentData.findIndex((r) => r.id === rowId);
          if (idx === -1) return;
          const product = currentData[idx];

          const newPrice = parseFloat((product.price * (0.95 + Math.random() * 0.1)).toFixed(2));
          currentData[idx].price = newPrice;
          tableRef.updateData({ accessor: "price", rowId, newValue: newPrice });

          const newStock = Math.max(0, product.stock + Math.floor((Math.random() - 0.5) * 6));
          currentData[idx].stock = newStock;
          tableRef.updateData({ accessor: "stock", rowId, newValue: newStock });
          if (product.stockHistory.length > 0) {
            const updated = [...product.stockHistory.slice(1), newStock];
            currentData[idx].stockHistory = updated;
            tableRef.updateData({ accessor: "stockHistory", rowId, newValue: updated });
          }

          if (Math.random() < 0.6) {
            const inc = Math.floor(Math.random() * 3) + 1;
            currentData[idx].sales = product.sales + inc;
            tableRef.updateData({ accessor: "sales", rowId, newValue: currentData[idx].sales });
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
      const visibleIds = new Set(
        visibleRows.map((vr) => vr.row.id).filter((id): id is number => typeof id === "number"),
      );
      timerMap.forEach((tid, rid) => {
        if (!visibleIds.has(rid)) {
          clearTimeout(tid);
          timerMap.delete(rid);
        }
      });
      visibleRows.forEach((vr) => {
        const rowId = vr.row.id;
        if (typeof rowId === "number" && !timerMap.has(rowId)) createRowTimer(rowId);
      });
    };

    const salesRotate = setInterval(() => {
      if (!tableRef || !isActive) return;
      currentData.forEach((row, i) => {
        if (row.salesHistory.length > 0) {
          const rid = row.id;
          const sp = currentPeriodSales.get(rid) || 0;
          const updated = [...row.salesHistory.slice(1), sp];
          currentData[i].salesHistory = updated;
          tableRef!.updateData({ accessor: "salesHistory", rowId: rid, newValue: updated });
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
      columns={liveUpdateConfig.headers}
      getRowId={({ row }) => row.id}
      rows={liveUpdateConfig.rows}
      height={props.height ?? "400px"}
      theme={props.theme}
    />
  );
}
