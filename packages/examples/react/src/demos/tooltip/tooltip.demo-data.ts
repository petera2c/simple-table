// Self-contained demo table setup for this example.
import type { HeaderObject, Row } from "@simple-table/react";


export const tooltipData: Row[] = [
  { id: 1, productName: "MacBook Pro M3 Max", category: "Laptops", price: 3299.99, stock: 12, rating: 4.8, lastUpdated: "2024-01-15" },
  { id: 2, productName: "Logitech MX Master 3S", category: "Peripherals", price: 99.99, stock: 45, rating: 4.6, lastUpdated: "2024-01-18" },
  { id: 3, productName: "Samsung 49-inch Ultrawide Monitor", category: "Displays", price: 899.99, stock: 8, rating: 4.7, lastUpdated: "2024-01-20" },
  { id: 4, productName: "Mechanical Gaming Keyboard RGB", category: "Peripherals", price: 189.99, stock: 23, rating: 4.4, lastUpdated: "2024-01-22" },
  { id: 5, productName: "Dell XPS 13 OLED", category: "Laptops", price: 1299.99, stock: 15, rating: 4.5, lastUpdated: "2024-01-25" },
  { id: 6, productName: "Apple Magic Trackpad", category: "Peripherals", price: 149.99, stock: 67, rating: 4.3, lastUpdated: "2024-01-28" },
  { id: 7, productName: "LG 32-inch 4K Monitor", category: "Displays", price: 449.99, stock: 19, rating: 4.6, lastUpdated: "2024-02-01" },
  { id: 8, productName: "ThinkPad X1 Carbon Gen 11", category: "Laptops", price: 1899.99, stock: 6, rating: 4.7, lastUpdated: "2024-02-03" },
  { id: 9, productName: "Razer DeathAdder V3 Pro", category: "Peripherals", price: 149.99, stock: 34, rating: 4.8, lastUpdated: "2024-02-05" },
  { id: 10, productName: "ASUS ROG Swift 27-inch", category: "Displays", price: 699.99, stock: 11, rating: 4.5, lastUpdated: "2024-02-08" },
  { id: 11, productName: "Surface Laptop Studio 2", category: "Laptops", price: 2199.99, stock: 4, rating: 4.4, lastUpdated: "2024-02-10" },
  { id: 12, productName: "Keychron K8 Wireless Keyboard", category: "Peripherals", price: 89.99, stock: 28, rating: 4.6, lastUpdated: "2024-02-12" },
  { id: 13, productName: "HP EliteBook 850 G10", category: "Laptops", price: 1599.99, stock: 9, rating: 4.3, lastUpdated: "2024-02-14" },
  { id: 14, productName: "BenQ PD3200U 32-inch", category: "Displays", price: 799.99, stock: 7, rating: 4.7, lastUpdated: "2024-02-16" },
  { id: 15, productName: "Corsair K95 RGB Platinum", category: "Peripherals", price: 199.99, stock: 16, rating: 4.5, lastUpdated: "2024-02-18" },
];

export const tooltipHeaders: HeaderObject[] = [
  { accessor: "productName", label: "Product", width: 200, isSortable: true, tooltip: "Complete product name including model specifications and key features" },
  { accessor: "category", label: "Category", width: 150, isSortable: true, filterable: true, tooltip: "Product classification: Laptops, Displays, or Peripherals for easy filtering" },
  {
    accessor: "price",
    label: "Price",
    width: 120,
    align: "right",
    isSortable: true,
    tooltip: "Current retail price in US dollars (USD) including all standard features",
    valueFormatter: ({ value }) => `$${(value as number).toFixed(2)}`,
  },
  { accessor: "stock", label: "Stock", width: 100, align: "right", isSortable: true, tooltip: "Available inventory count - number of units currently in warehouse stock" },
  {
    accessor: "rating",
    label: "Rating",
    width: 100,
    align: "center",
    isSortable: true,
    tooltip: "Customer satisfaction rating based on verified purchase reviews (scale: 1-5 stars)",
    valueFormatter: ({ value }) => `${value}/5`,
  },
  { accessor: "lastUpdated", label: "Last Updated", width: 150, isSortable: true, tooltip: "Most recent inventory update date in YYYY-MM-DD format" },
];

export const tooltipConfig = {
  headers: tooltipHeaders,
  rows: tooltipData,
  tableProps: {
    columnResizing: true,
    columnReordering: true,
    selectableCells: true,
  },
} as const;
