// Self-contained demo table setup for this example.
import type { ReactHeaderObject } from "@simple-table/react";


export const liveUpdateHeaders: ReactHeaderObject[] = [
  { accessor: "id", label: "ID", width: 60, type: "number" },
  { accessor: "product", label: "Product", width: 180, type: "string" },
  {
    accessor: "price", label: "Price", width: "1fr", type: "number",
    valueFormatter: ({ value }) => typeof value === "number" ? `$${value.toFixed(2)}` : "$0.00",
  },
  { accessor: "stock", label: "In Stock", width: 100, type: "number" },
  {
    accessor: "stockHistory", label: "Stock Trend", width: 140, type: "lineAreaChart", align: "center",
    tooltip: "Stock levels over the last 20 updates",
    chartOptions: { color: "#10b981", fillColor: "#34d399", fillOpacity: 0.2, strokeWidth: 2, height: 35 },
  },
  { accessor: "sales", label: "Sales", width: 100, type: "number" },
  {
    accessor: "salesHistory", label: "Sales Trend", width: 140, type: "barChart", align: "center",
    tooltip: "Sales activity over the last 12 updates",
    chartOptions: { color: "#f59e0b", gap: 2, height: 35 },
  },
];

export const generateStockHistory = (currentStock: number, length = 20) => {
  const history: number[] = [];
  for (let i = 0; i < length; i++) {
    const variation = (Math.random() - 0.5) * 30;
    history.push(Math.max(0, Math.round(currentStock + variation)));
  }
  return history;
};

export const generateSalesHistory = (_currentSales: number, length = 12) => {
  const history: number[] = [];
  for (let i = 0; i < length; i++) {
    history.push(Math.floor(Math.random() * 4));
  }
  return history;
};

export const liveUpdateData = [
  { id: 1, product: "Organic Green Tea", price: 24.99, stock: 156, sales: 342, stockHistory: generateStockHistory(156), salesHistory: generateSalesHistory(342) },
  { id: 2, product: "Bluetooth Headphones", price: 89.99, stock: 73, sales: 187, stockHistory: generateStockHistory(73), salesHistory: generateSalesHistory(187) },
  { id: 3, product: "Bamboo Yoga Mat", price: 45.99, stock: 92, sales: 256, stockHistory: generateStockHistory(92), salesHistory: generateSalesHistory(256) },
  { id: 4, product: "Smart Water Bottle", price: 34.99, stock: 48, sales: 134, stockHistory: generateStockHistory(48), salesHistory: generateSalesHistory(134) },
  { id: 5, product: "Ceramic Coffee Mug", price: 18.99, stock: 124, sales: 298, stockHistory: generateStockHistory(124), salesHistory: generateSalesHistory(298) },
  { id: 6, product: "Wireless Phone Charger", price: 29.99, stock: 67, sales: 156, stockHistory: generateStockHistory(67), salesHistory: generateSalesHistory(156) },
  { id: 7, product: "Essential Oil Diffuser", price: 52.99, stock: 89, sales: 203, stockHistory: generateStockHistory(89), salesHistory: generateSalesHistory(203) },
  { id: 8, product: "Stainless Steel Tumbler", price: 22.99, stock: 134, sales: 267, stockHistory: generateStockHistory(134), salesHistory: generateSalesHistory(267) },
  { id: 9, product: "LED Desk Lamp", price: 39.99, stock: 95, sales: 176, stockHistory: generateStockHistory(95), salesHistory: generateSalesHistory(176) },
  { id: 10, product: "Organic Cotton Towel", price: 26.99, stock: 87, sales: 145, stockHistory: generateStockHistory(87), salesHistory: generateSalesHistory(145) },
  { id: 11, product: "Portable Phone Stand", price: 15.99, stock: 203, sales: 387, stockHistory: generateStockHistory(203), salesHistory: generateSalesHistory(387) },
  { id: 12, product: "Aromatherapy Candle", price: 31.99, stock: 56, sales: 112, stockHistory: generateStockHistory(56), salesHistory: generateSalesHistory(112) },
];

export const liveUpdateConfig = {
  headers: liveUpdateHeaders,
  rows: liveUpdateData,
} as const;
