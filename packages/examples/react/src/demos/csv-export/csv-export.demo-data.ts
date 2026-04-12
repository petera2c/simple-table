// Self-contained demo table setup for this example.
import type { ReactHeaderObject } from "@simple-table/react";


const CATEGORY_CODES: Record<string, string> = {
  electronics: "ELEC",
  furniture: "FURN",
  stationery: "STAT",
  appliances: "APPL",
};

export const csvExportData = [
  { id: "db-1001", sku: "PRD-1001", product: "Wireless Keyboard", category: "Electronics", price: 49.99, stock: 145, sold: 234, revenue: 11697.66, actions: "" },
  { id: "db-1002", sku: "PRD-1002", product: "Ergonomic Mouse", category: "Electronics", price: 29.99, stock: 89, sold: 456, revenue: 13675.44, actions: "" },
  { id: "db-1003", sku: "PRD-1003", product: "USB-C Hub", category: "Electronics", price: 39.99, stock: 234, sold: 178, revenue: 7118.22, actions: "" },
  { id: "db-2001", sku: "PRD-2001", product: "Standing Desk", category: "Furniture", price: 399.99, stock: 23, sold: 67, revenue: 26799.33, actions: "" },
  { id: "db-2002", sku: "PRD-2002", product: "Office Chair", category: "Furniture", price: 249.99, stock: 56, sold: 123, revenue: 30748.77, actions: "" },
  { id: "db-2003", sku: "PRD-2003", product: "Monitor Stand", category: "Furniture", price: 79.99, stock: 167, sold: 89, revenue: 7119.11, actions: "" },
  { id: "db-3001", sku: "PRD-3001", product: "Notebook Set", category: "Stationery", price: 12.99, stock: 445, sold: 678, revenue: 8807.22, actions: "" },
  { id: "db-3002", sku: "PRD-3002", product: "Pen Collection", category: "Stationery", price: 19.99, stock: 312, sold: 534, revenue: 10674.66, actions: "" },
  { id: "db-3003", sku: "PRD-3003", product: "Desk Organizer", category: "Stationery", price: 24.99, stock: 198, sold: 289, revenue: 7222.11, actions: "" },
  { id: "db-4001", sku: "PRD-4001", product: "Coffee Maker", category: "Appliances", price: 89.99, stock: 78, sold: 156, revenue: 14038.44, actions: "" },
  { id: "db-4002", sku: "PRD-4002", product: "Electric Kettle", category: "Appliances", price: 34.99, stock: 134, sold: 267, revenue: 9342.33, actions: "" },
  { id: "db-4003", sku: "PRD-4003", product: "Desk Lamp LED", category: "Appliances", price: 44.99, stock: 201, sold: 198, revenue: 8908.02, actions: "" },
];

export const csvExportHeaders: ReactHeaderObject[] = [
  { accessor: "id", label: "Internal ID", width: 80, type: "string", excludeFromRender: true },
  { accessor: "sku", label: "SKU", width: 100, isSortable: true, type: "string" },
  { accessor: "product", label: "Product Name", minWidth: 120, width: "1fr", isSortable: true, type: "string" },
  {
    accessor: "category",
    label: "Category",
    width: 130,
    isSortable: true,
    type: "string",
    valueFormatter: ({ value }) => {
      const s = String(value);
      return s.charAt(0).toUpperCase() + s.slice(1);
    },
    exportValueGetter: ({ value }) => {
      const code = CATEGORY_CODES[String(value).toLowerCase()] ?? String(value).toUpperCase();
      return `${value} (${code})`;
    },
  },
  {
    accessor: "price",
    label: "Price",
    width: 100,
    isSortable: true,
    type: "number",
    valueFormatter: ({ value }) => `$${(value as number).toFixed(2)}`,
    useFormattedValueForCSV: true,
    useFormattedValueForClipboard: true,
  },
  { accessor: "stock", label: "In Stock", width: 100, isSortable: true, type: "number" },
  { accessor: "sold", label: "Units Sold", width: 110, isSortable: true, type: "number" },
  {
    accessor: "revenue",
    label: "Revenue",
    width: 120,
    isSortable: true,
    type: "number",
    valueFormatter: ({ value }) =>
      `$${(value as number).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    useFormattedValueForCSV: true,
    useFormattedValueForClipboard: true,
  },
  { accessor: "actions", label: "Actions", width: 100, type: "string", excludeFromCsv: true },
];

export const csvExportConfig = {
  headers: csvExportHeaders,
  rows: csvExportData,
  tableProps: { editColumns: true, selectableCells: true, customTheme: { rowHeight: 32 } },
} as const;
