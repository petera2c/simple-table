import { SimpleTableVanilla } from "simple-table-core";
import type { LiveUpdateProduct } from "./live-update.demo-data";
import type { Theme, GetRowIdParams } from "simple-table-core";
import { liveUpdateConfig, liveUpdateData } from "./live-update.demo-data";
import "simple-table-core/styles.css";

export function renderLiveUpdateDemo(
  container: HTMLElement,
  options?: { height?: string | number; theme?: Theme }
): SimpleTableVanilla<LiveUpdateProduct> & { _cleanup?: () => void } {
  const getRowId = ({ row }: GetRowIdParams<LiveUpdateProduct>) => row.id;

  const table = new SimpleTableVanilla(container, {
    columns: liveUpdateConfig.headers,
    rows: liveUpdateConfig.rows,
    getRowId,
    height: options?.height ?? "400px",
    theme: options?.theme,
  });

  const currentData: LiveUpdateProduct[] = JSON.parse(JSON.stringify(liveUpdateData));
  const timerMap = new Map<number, ReturnType<typeof setTimeout>>();
  const currentPeriodSales = new Map<number, number>();
  let isActive = true;

  const createRowTimer = (rowId: number) => {
    const scheduleUpdate = () => {
      if (!isActive) return;
      const interval = 300 + Math.random() * 700;
      const timerId = setTimeout(() => {
        if (!isActive) return;
        const api = table.getAPI();
        const idx = currentData.findIndex((r) => r.id === rowId);
        if (idx === -1) return;
        const product = currentData[idx];

        if (typeof product.price === "number") {
          const newPrice = parseFloat((product.price * (0.95 + Math.random() * 0.1)).toFixed(2));
          currentData[idx].price = newPrice;
          api.updateData({ accessor: "price", rowId, newValue: newPrice });
        }
        if (typeof product.stock === "number") {
          const newStock = Math.max(0, product.stock + Math.floor((Math.random() - 0.5) * 6));
          currentData[idx].stock = newStock;
          api.updateData({ accessor: "stock", rowId, newValue: newStock });
          if (Array.isArray(product.stockHistory)) {
            const updated = [...product.stockHistory.slice(1), newStock];
            currentData[idx].stockHistory = updated;
            api.updateData({ accessor: "stockHistory", rowId, newValue: updated });
          }
        }
        if (Math.random() < 0.6 && typeof product.sales === "number") {
          const inc = Math.floor(Math.random() * 3) + 1;
          currentData[idx].sales = product.sales + inc;
          api.updateData({ accessor: "sales", rowId, newValue: currentData[idx].sales });
          currentPeriodSales.set(rowId, (currentPeriodSales.get(rowId) || 0) + inc);
        }
        scheduleUpdate();
      }, interval);
      timerMap.set(rowId, timerId);
    };
    scheduleUpdate();
  };

  const syncTimers = () => {
    const api = table.getAPI();
    const visibleRows = api.getVisibleRows();
    const visibleIds = new Set(
      visibleRows.flatMap((vr) => (typeof vr.row.id === "number" ? [vr.row.id] : [])),
    );
    timerMap.forEach((tid, rid) => {
      if (!visibleIds.has(rid)) {
        clearTimeout(tid);
        timerMap.delete(rid);
      }
    });
    visibleRows.forEach((vr) => {
      const rid = vr.row.id;
      if (typeof rid !== "number") return;
      if (!timerMap.has(rid)) createRowTimer(rid);
    });
  };

  const salesRotate = setInterval(() => {
    if (!isActive) return;
    const api = table.getAPI();
    currentData.forEach((row, i) => {
      if (Array.isArray(row.salesHistory)) {
        const rid = row.id;
        const sp = currentPeriodSales.get(rid) || 0;
        const updated = [...row.salesHistory.slice(1), sp];
        currentData[i].salesHistory = updated;
        api.updateData({ accessor: "salesHistory", rowId: rid, newValue: updated });
        currentPeriodSales.set(rid, 0);
      }
    });
  }, 2000);

  const syncInt = setInterval(syncTimers, 500);

  const originalDestroy = table.destroy.bind(table);
  table.destroy = () => {
    isActive = false;
    clearInterval(syncInt);
    clearInterval(salesRotate);
    timerMap.forEach((t) => clearTimeout(t));
    timerMap.clear();
    originalDestroy();
  };

  const originalMount = table.mount.bind(table);
  table.mount = () => {
    originalMount();
    syncTimers();
  };

  return table;
}
