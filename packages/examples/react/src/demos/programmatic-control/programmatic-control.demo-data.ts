// Self-contained demo table setup for this example.
import type { ReactHeaderObject } from "@simple-table/react";


export const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  Available: { bg: "#dcfce7", color: "#166534" },
  "Low Stock": { bg: "#fef3c7", color: "#92400e" },
  "Out of Stock": { bg: "#fee2e2", color: "#991b1b" },
};

export const programmaticControlData = [
  { id: 1, name: "Wireless Keyboard", category: "Electronics", price: 49.99, stock: 145, status: "Available" },
  { id: 2, name: "Ergonomic Mouse", category: "Electronics", price: 29.99, stock: 12, status: "Low Stock" },
  { id: 3, name: "USB-C Hub", category: "Electronics", price: 39.99, stock: 234, status: "Available" },
  { id: 4, name: "Standing Desk", category: "Furniture", price: 399.99, stock: 0, status: "Out of Stock" },
  { id: 5, name: "Office Chair", category: "Furniture", price: 249.99, stock: 56, status: "Available" },
  { id: 6, name: "Monitor Stand", category: "Furniture", price: 79.99, stock: 8, status: "Low Stock" },
  { id: 7, name: "Notebook Set", category: "Stationery", price: 12.99, stock: 445, status: "Available" },
  { id: 8, name: "Pen Collection", category: "Stationery", price: 19.99, stock: 312, status: "Available" },
  { id: 9, name: "Desk Organizer", category: "Stationery", price: 24.99, stock: 5, status: "Low Stock" },
  { id: 10, name: "Coffee Maker", category: "Appliances", price: 89.99, stock: 78, status: "Available" },
  { id: 11, name: "Electric Kettle", category: "Appliances", price: 34.99, stock: 134, status: "Available" },
  { id: 12, name: "Desk Lamp LED", category: "Appliances", price: 44.99, stock: 0, status: "Out of Stock" },
];

export const programmaticControlHeaders: ReactHeaderObject[] = [
  { accessor: "id", label: "ID", width: 70, type: "number", isSortable: true, filterable: true },
  { accessor: "name", label: "Product Name", width: "1fr", minWidth: 150, type: "string", isSortable: true, filterable: true },
  {
    accessor: "category",
    label: "Category",
    width: 140,
    type: "enum",
    isSortable: true,
    filterable: true,
    enumOptions: ["Electronics", "Furniture", "Stationery", "Appliances"].map((v) => ({ label: v, value: v })),
  },
  { accessor: "price", label: "Price", width: 110, align: "right", type: "number", isSortable: true, filterable: true, valueFormatter: ({ value }) => `$${(value as number).toFixed(2)}` },
  { accessor: "stock", label: "Stock", width: 100, align: "right", type: "number", isSortable: true, filterable: true },
  {
    accessor: "status",
    label: "Status",
    width: 110,
    type: "enum",
    isSortable: true,
    filterable: true,
    enumOptions: ["Available", "Low Stock", "Out of Stock"].map((v) => ({ label: v, value: v })),
  },
];

export const programmaticControlConfig = {
  headers: programmaticControlHeaders,
  rows: programmaticControlData,
} as const;

export { STATUS_COLORS as PROGRAMMATIC_CONTROL_STATUS_COLORS };
