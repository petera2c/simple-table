import { useRef, useEffect } from "react";
import { SimpleTable, defaultHeadersFromCore } from "@simple-table/react";
import type { Theme, TableAPI } from "@simple-table/react";
import { liveUpdateConfig, liveUpdateData } from "./live-update.demo-data";
import "@simple-table/react/styles.css";

const LiveUpdateDemo = ({ height = "400px", theme }: { height?: string | number; theme?: Theme }) => {
  const tableRef = useRef<TableAPI>(null);

  useEffect(() => {
    const currentData = JSON.parse(JSON.stringify(liveUpdateData));
    const timerMap = new Map<string | number, ReturnType<typeof setTimeout>>();
    const currentPeriodSales = new Map<string | number, number>();
    let isActive = true;

    const UPDATE_CONFIG = { minInterval: 300, maxInterval: 1000 };

    const createRowTimer = (rowId: string | number) => {
      const scheduleUpdate = () => {
        if (!isActive) return;
        const interval = UPDATE_CONFIG.minInterval + Math.random() * (UPDATE_CONFIG.maxInterval - UPDATE_CONFIG.minInterval);

        const timerId = setTimeout(() => {
          if (!isActive || !tableRef.current) return;
          const actualRowIndex = currentData.findIndex((row: (typeof liveUpdateData)[0]) => row.id === rowId);
          if (actualRowIndex === -1) return;
          const product = currentData[actualRowIndex];

          const currentPrice = product.price as number;
          if (typeof currentPrice === "number") {
            const newPrice = parseFloat((currentPrice * (0.95 + Math.random() * 0.1)).toFixed(2));
            currentData[actualRowIndex].price = newPrice;
            tableRef.current?.updateData({ accessor: "price", rowIndex: actualRowIndex, newValue: newPrice });
          }

          const currentStock = product.stock as number;
          if (typeof currentStock === "number") {
            const newStock = Math.max(0, currentStock + Math.floor((Math.random() - 0.5) * 6));
            currentData[actualRowIndex].stock = newStock;
            tableRef.current?.updateData({ accessor: "stock", rowIndex: actualRowIndex, newValue: newStock });
            const currentStockHistory = product.stockHistory as number[];
            if (Array.isArray(currentStockHistory) && currentStockHistory.length > 0) {
              const updatedStockHistory = [...currentStockHistory.slice(1), newStock];
              currentData[actualRowIndex].stockHistory = updatedStockHistory;
              tableRef.current?.updateData({ accessor: "stockHistory", rowIndex: actualRowIndex, newValue: updatedStockHistory });
            }
          }

          if (Math.random() < 0.6) {
            const currentSales = product.sales as number;
            if (typeof currentSales === "number") {
              const salesIncrement = Math.floor(Math.random() * 3) + 1;
              const newSales = currentSales + salesIncrement;
              currentData[actualRowIndex].sales = newSales;
              tableRef.current?.updateData({ accessor: "sales", rowIndex: actualRowIndex, newValue: newSales });
              currentPeriodSales.set(rowId, (currentPeriodSales.get(rowId) || 0) + salesIncrement);
            }
          }

          scheduleUpdate();
        }, interval);
        timerMap.set(rowId, timerId);
      };
      scheduleUpdate();
    };

    const syncTimers = () => {
      if (!tableRef.current) return;
      const visibleRows = tableRef.current.getVisibleRows();
      const visibleRowIds = new Set(visibleRows.map((vr) => vr.row.id as string | number));
      timerMap.forEach((timerId, rowId) => {
        if (!visibleRowIds.has(rowId)) { clearTimeout(timerId); timerMap.delete(rowId); }
      });
      visibleRows.forEach((visibleRow) => {
        const rowId = visibleRow.row.id as string | number;
        if (!timerMap.has(rowId)) createRowTimer(rowId);
      });
    };

    const salesRotateInterval = setInterval(() => {
      if (!tableRef.current || !isActive) return;
      currentData.forEach((row: (typeof liveUpdateData)[0], rowIndex: number) => {
        const currentSalesHistory = row.salesHistory as number[];
        if (Array.isArray(currentSalesHistory) && currentSalesHistory.length > 0) {
          const rowId = row.id as string | number;
          const salesInPeriod = currentPeriodSales.get(rowId) || 0;
          const updatedSalesHistory = [...currentSalesHistory.slice(1), salesInPeriod];
          currentData[rowIndex].salesHistory = updatedSalesHistory;
          tableRef.current?.updateData({ accessor: "salesHistory", rowIndex, newValue: updatedSalesHistory });
          currentPeriodSales.set(rowId, 0);
        }
      });
    }, 2000);

    syncTimers();
    const syncInterval = setInterval(syncTimers, 500);

    return () => {
      isActive = false;
      clearInterval(syncInterval);
      clearInterval(salesRotateInterval);
      timerMap.forEach((timerId) => clearTimeout(timerId));
      timerMap.clear();
    };
  }, []);

  return (
    <SimpleTable
      defaultHeaders={defaultHeadersFromCore(liveUpdateConfig.headers)}
      rows={liveUpdateConfig.rows}
      ref={tableRef}
      height={height}
      theme={theme}
    />
  );
};

export default LiveUpdateDemo;
