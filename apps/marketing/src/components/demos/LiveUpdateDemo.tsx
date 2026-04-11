import { SimpleTable } from "@simple-table/react";
import type { TableAPI, ReactHeaderObject, Theme, CellRendererProps } from "@simple-table/react";
import { useRef, useEffect } from "react";
import "@simple-table/react/styles.css";

// Define headers
const headers: ReactHeaderObject[] = [
  { accessor: "id", label: "ID", width: 60, type: "number" },
  { accessor: "product", label: "Product", width: 180, type: "string" },
  {
    accessor: "price",
    label: "Price",
    width: "1fr",
    type: "number",
    cellRenderer: ({ row }: CellRendererProps) => {
      const price = row.price;
      if (typeof price === "number") {
        return `$${price.toFixed(2)}`;
      }
      return `$0.00`;
    },
  },
  { accessor: "stock", label: "In Stock", width: 100, type: "number" },
  {
    accessor: "stockHistory",
    label: "Stock Trend",
    width: 140,
    type: "lineAreaChart",
    align: "center",
    tooltip: "Stock levels over the last 20 updates",
    chartOptions: {
      color: "#10b981",
      fillColor: "#34d399",
      fillOpacity: 0.2,
      strokeWidth: 2,
      height: 35,
    },
  },
  { accessor: "sales", label: "Sales", width: 100, type: "number" },
  {
    accessor: "salesHistory",
    label: "Sales Trend",
    width: 140,
    type: "barChart",
    align: "center",
    tooltip: "Sales activity over the last 12 updates",
    chartOptions: {
      color: "#f59e0b",
      gap: 2,
      height: 35,
    },
  },
];

// Helper to generate initial history array
const generateStockHistory = (currentStock: number, length = 20) => {
  const history = [];
  for (let i = 0; i < length; i++) {
    const variation = (Math.random() - 0.5) * 30;
    history.push(Math.max(0, Math.round(currentStock + variation)));
  }
  return history;
};

const generateSalesHistory = (_currentSales: number, length = 12) => {
  const history = [];
  // Generate realistic bar chart data matching live update behavior
  // Each bar represents sales in a 2-second period
  for (let i = 0; i < length; i++) {
    const salesInPeriod = Math.floor(Math.random() * 4); // 0-3 sales per period
    history.push(salesInPeriod);
  }
  return history;
};

// Sample data
const initialData = [
  {
    id: 1,
    product: "Organic Green Tea",
    price: 24.99,
    stock: 156,
    sales: 342,
    stockHistory: generateStockHistory(156),
    salesHistory: generateSalesHistory(342),
  },
  {
    id: 2,
    product: "Bluetooth Headphones",
    price: 89.99,
    stock: 73,
    sales: 187,
    stockHistory: generateStockHistory(73),
    salesHistory: generateSalesHistory(187),
  },
  {
    id: 3,
    product: "Bamboo Yoga Mat",
    price: 45.99,
    stock: 92,
    sales: 256,
    stockHistory: generateStockHistory(92),
    salesHistory: generateSalesHistory(256),
  },
  {
    id: 4,
    product: "Smart Water Bottle",
    price: 34.99,
    stock: 48,
    sales: 134,
    stockHistory: generateStockHistory(48),
    salesHistory: generateSalesHistory(134),
  },
  {
    id: 5,
    product: "Ceramic Coffee Mug",
    price: 18.99,
    stock: 124,
    sales: 298,
    stockHistory: generateStockHistory(124),
    salesHistory: generateSalesHistory(298),
  },
  {
    id: 6,
    product: "Wireless Phone Charger",
    price: 29.99,
    stock: 67,
    sales: 156,
    stockHistory: generateStockHistory(67),
    salesHistory: generateSalesHistory(156),
  },
  {
    id: 7,
    product: "Essential Oil Diffuser",
    price: 52.99,
    stock: 89,
    sales: 203,
    stockHistory: generateStockHistory(89),
    salesHistory: generateSalesHistory(203),
  },
  {
    id: 8,
    product: "Stainless Steel Tumbler",
    price: 22.99,
    stock: 134,
    sales: 267,
    stockHistory: generateStockHistory(134),
    salesHistory: generateSalesHistory(267),
  },
  {
    id: 9,
    product: "LED Desk Lamp",
    price: 39.99,
    stock: 95,
    sales: 176,
    stockHistory: generateStockHistory(95),
    salesHistory: generateSalesHistory(176),
  },
  {
    id: 10,
    product: "Organic Cotton Towel",
    price: 26.99,
    stock: 87,
    sales: 145,
    stockHistory: generateStockHistory(87),
    salesHistory: generateSalesHistory(145),
  },
  {
    id: 11,
    product: "Portable Phone Stand",
    price: 15.99,
    stock: 203,
    sales: 387,
    stockHistory: generateStockHistory(203),
    salesHistory: generateSalesHistory(387),
  },
  {
    id: 12,
    product: "Aromatherapy Candle",
    price: 31.99,
    stock: 56,
    sales: 112,
    stockHistory: generateStockHistory(56),
    salesHistory: generateSalesHistory(112),
  },
];

const LiveUpdateDemo = ({
  height = "400px",
  theme,
}: {
  height?: string | number;
  theme?: Theme;
}) => {
  // Keep a local copy of the data to update
  const tableRef = useRef<TableAPI | null>(null);

  // Set up intervals for automatic updates (like Infrastructure example)
  useEffect(() => {
    // Keep a copy of the current data in memory for calculations
    const currentData = JSON.parse(JSON.stringify(initialData));
    const timerMap = new Map<string | number, NodeJS.Timeout>();
    // Track sales in the current period for each product
    const currentPeriodSales = new Map<string | number, number>();
    let isActive = true;

    // Configuration for individual product update timers
    const UPDATE_CONFIG = {
      minInterval: 300, // 0.3 seconds
      maxInterval: 1000, // 1 second
    };

    // Function to create an update timer for a specific row
    const createRowTimer = (rowId: string | number) => {
      const scheduleUpdate = () => {
        if (!isActive) return;

        // Random interval for this specific update
        const interval =
          UPDATE_CONFIG.minInterval +
          Math.random() * (UPDATE_CONFIG.maxInterval - UPDATE_CONFIG.minInterval);

        const timerId = setTimeout(() => {
          if (!isActive || !tableRef.current) return;

          // Find the current row in data
          const actualRowIndex = currentData.findIndex(
            (row: (typeof initialData)[0]) => row.id === rowId,
          );
          if (actualRowIndex === -1) {
            return;
          }

          const product = currentData[actualRowIndex];

          // Update price (±5% from current)
          const currentPrice = product.price as number;
          if (typeof currentPrice === "number") {
            const randomFactor = 0.95 + Math.random() * 0.1;
            const newPrice = parseFloat((currentPrice * randomFactor).toFixed(2));

            currentData[actualRowIndex].price = newPrice;

            tableRef.current?.updateData({
              accessor: "price",
              rowIndex: actualRowIndex,
              newValue: newPrice,
            });
          }

          // Update stock (small fluctuations)
          const currentStock = product.stock as number;
          if (typeof currentStock === "number") {
            const stockChange = Math.floor((Math.random() - 0.5) * 6); // -3 to +3
            const newStock = Math.max(0, currentStock + stockChange);

            currentData[actualRowIndex].stock = newStock;

            tableRef.current?.updateData({
              accessor: "stock",
              rowIndex: actualRowIndex,
              newValue: newStock,
            });

            // Update stock history chart
            const currentStockHistory = product.stockHistory as number[];
            if (Array.isArray(currentStockHistory) && currentStockHistory.length > 0) {
              const updatedStockHistory = [...currentStockHistory.slice(1), newStock];
              currentData[actualRowIndex].stockHistory = updatedStockHistory;
              tableRef.current?.updateData({
                accessor: "stockHistory",
                rowIndex: actualRowIndex,
                newValue: updatedStockHistory,
              });
            }
          }

          // Update sales (60% chance)
          if (Math.random() < 0.6) {
            const currentSales = product.sales as number;
            if (typeof currentSales === "number") {
              const salesIncrement = Math.floor(Math.random() * 3) + 1; // 1-3 sales
              const newSales = currentSales + salesIncrement;

              currentData[actualRowIndex].sales = newSales;

              tableRef.current?.updateData({
                accessor: "sales",
                rowIndex: actualRowIndex,
                newValue: newSales,
              });

              // Track sales for the current period (for the bar chart)
              const currentPeriodCount = currentPeriodSales.get(rowId) || 0;
              currentPeriodSales.set(rowId, currentPeriodCount + salesIncrement);
            }
          }

          // Schedule the next update for this row
          scheduleUpdate();
        }, interval);

        timerMap.set(rowId, timerId);
      };

      scheduleUpdate();
    };

    // Function to sync timers with visible rows
    const syncTimers = () => {
      if (!tableRef.current) return;

      const visibleRows = tableRef.current.getVisibleRows();
      const visibleRowIds = new Set(visibleRows.map((vr) => vr.row.id as string | number));

      // Remove timers for rows that are no longer visible
      timerMap.forEach((timerId, rowId) => {
        if (!visibleRowIds.has(rowId)) {
          clearTimeout(timerId);
          timerMap.delete(rowId);
        }
      });

      // Create timers for newly visible rows
      visibleRows.forEach((visibleRow) => {
        const rowId = visibleRow.row.id as string | number;
        if (!timerMap.has(rowId)) {
          createRowTimer(rowId);
        }
      });
    };

    // Periodically rotate sales history (shift to new bar)
    const salesRotateInterval = setInterval(() => {
      if (!tableRef.current || !isActive) return;

      currentData.forEach((row: (typeof initialData)[0], rowIndex: number) => {
        const currentSalesHistory = row.salesHistory as number[];
        if (Array.isArray(currentSalesHistory) && currentSalesHistory.length > 0) {
          // Get the sales count for this period (default to 0 if no sales)
          const rowId = row.id as string | number;
          const salesInPeriod = currentPeriodSales.get(rowId) || 0;

          // Rotate: remove first bar and add new bar with the period's sales
          const updatedSalesHistory = [...currentSalesHistory.slice(1), salesInPeriod];
          currentData[rowIndex].salesHistory = updatedSalesHistory;
          tableRef.current?.updateData({
            accessor: "salesHistory",
            rowIndex,
            newValue: updatedSalesHistory,
          });

          // Reset the period counter for this product
          currentPeriodSales.set(rowId, 0);
        }
      });
    }, 2000); // Rotate every 2 seconds

    // Initial sync
    syncTimers();

    // Set up interval to periodically check for visible row changes
    const syncInterval = setInterval(syncTimers, 500);

    // Clean up intervals on unmount
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
      defaultHeaders={headers}
      rows={initialData}
      ref={tableRef}
      height={height}
      theme={theme}
    />
  );
};

export default LiveUpdateDemo;
