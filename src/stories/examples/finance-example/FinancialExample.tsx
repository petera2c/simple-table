import { useEffect, useRef } from "react";

import { HEADERS } from "./finance-headers";
import financeData from "./finance-data.json";
import TableRefType from "../../../types/TableRefType";
import SimpleTable from "../../../components/simple-table/SimpleTable";
import { UniversalTableProps } from "../StoryWrapper";

// Configuration for stock price updates
const UPDATE_CONFIG = {
  // Random interval range in milliseconds
  minInterval: 2000, // Minimum time between updates
  maxInterval: 2500, // Maximum time between updates

  // What percentage of stocks to update each time
  minStocksPercent: 0.6, // 60%
  maxStocksPercent: 0.8, // 80%
};

// Default args specific to FinanceExample - exported for reuse in stories and tests
export const financeExampleDefaults = {
  columnResizing: true,
  columnReordering: true,
  selectableCells: true,
  height: "90dvh",
};

export const FinancialExample = (props: UniversalTableProps) => {
  const tableRef = useRef<TableRefType | null>(null);

  useEffect(() => {
    // Keep a copy of the current data in memory for calculations
    let timeoutId: NodeJS.Timeout;
    let isActive = true;

    const scheduleNextUpdate = () => {
      if (!isActive) return;

      // Random interval based on configuration
      const intervalRange = UPDATE_CONFIG.maxInterval - UPDATE_CONFIG.minInterval;
      const nextInterval = Math.random() * intervalRange + UPDATE_CONFIG.minInterval;

      timeoutId = setTimeout(() => {
        if (!isActive || !tableRef.current) return;

        // Get current visible rows for this update cycle
        const visibleRows = tableRef.current.getVisibleRows();

        if (visibleRows.length === 0) {
          scheduleNextUpdate();
          return;
        }

        // Select percentage of visible stocks to update based on configuration
        const totalVisibleStocks = visibleRows.length;
        const stocksPercent =
          UPDATE_CONFIG.minStocksPercent +
          Math.random() * (UPDATE_CONFIG.maxStocksPercent - UPDATE_CONFIG.minStocksPercent);
        const stocksToUpdate = Math.floor(totalVisibleStocks * stocksPercent);

        // Randomly select which visible stocks to update
        const indicesToUpdate = [];
        const usedIndices = new Set();

        for (let i = 0; i < stocksToUpdate; i++) {
          let randomIndex;
          do {
            randomIndex = Math.floor(Math.random() * totalVisibleStocks);
          } while (usedIndices.has(randomIndex));

          usedIndices.add(randomIndex);
          indicesToUpdate.push(randomIndex);
        }

        // Update selected stocks with more realistic price movements
        indicesToUpdate.forEach((visibleIndex) => {
          // Get fresh visible rows for each update to handle scrolling
          const currentVisibleRows = tableRef.current?.getVisibleRows();
          if (!currentVisibleRows || visibleIndex >= currentVisibleRows.length) {
            return;
          }

          const visibleRow = currentVisibleRows[visibleIndex];
          const stock = visibleRow.row;
          const currentPrice = stock.price as number;
          const storedChangePercent = stock.priceChangePercent as number;

          // Find the actual index in the financeData array using the stock id
          const actualRowIndex = financeData.findIndex((row) => row.id === stock.id);
          if (actualRowIndex === -1) {
            return;
          }

          // Skip if price is not a valid number
          if (typeof currentPrice !== "number" || typeof storedChangePercent !== "number") {
            return;
          }

          // Much more subtle price changes (0.01% to 0.15%)
          // 70% chance for tiny movements, 20% for small movements, 10% for slightly larger
          let priceChangePercent;
          const random = Math.random();

          if (random < 0.05) {
            // 5% chance for a larger drop (-0.15% to -0.05%)
            priceChangePercent = -(Math.random() * 0.1 + 0.05);
          } else if (random < 0.25) {
            // 20% chance for a small drop (-0.05% to 0%)
            priceChangePercent = -(Math.random() * 0.05);
          } else if (random < 0.75) {
            // 50% chance for a tiny gain (0% to 0.05%)
            priceChangePercent = Math.random() * 0.05;
          } else if (random < 0.95) {
            // 20% chance for a small gain (0.05% to 0.1%)
            priceChangePercent = Math.random() * 0.05 + 0.05;
          } else {
            // 5% chance for a larger gain (0.1% to 0.15%)
            priceChangePercent = Math.random() * 0.05 + 0.1;
          }

          // Calculate the new price
          const priceChange = currentPrice * (priceChangePercent / 100);
          const newPrice = currentPrice + priceChange;

          // Much more conservative update to the displayed change percentage
          const newChangePercent = storedChangePercent + priceChangePercent * 0.3;

          // Update the table with flash animation using updateData
          if (tableRef.current) {
            tableRef.current.updateData({
              accessor: "price",
              rowIndex: actualRowIndex,
              newValue: newPrice,
            });

            tableRef.current.updateData({
              accessor: "priceChangePercent",
              rowIndex: actualRowIndex,
              newValue: parseFloat(newChangePercent.toFixed(3)),
            });
          }
        });

        // Schedule the next update
        scheduleNextUpdate();
      }, nextInterval);
    };

    // Start the first update
    scheduleNextUpdate();

    // Cleanup function
    return () => {
      isActive = false;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, []);

  return (
    <SimpleTable
      {...props}
      defaultHeaders={HEADERS}
      rows={financeData}
      tableRef={tableRef}
      // Default settings for this example
      columnResizing={props.columnResizing ?? true}
      columnReordering={props.columnReordering ?? true}
      selectableCells={props.selectableCells ?? true}
      height={props.height ?? "90dvh"}
      cellUpdateFlash={true}
    />
  );
};
