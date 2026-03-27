import type { HeaderObject, Row } from "simple-table-core";

export const footerRendererData: Row[] = [
  { id: 1, product: "Laptop Pro 16", category: "Electronics", quantity: 150, price: 1299.99, total: 194998.50 },
  { id: 2, product: "Wireless Mouse", category: "Accessories", quantity: 420, price: 29.99, total: 12595.80 },
  { id: 3, product: "USB-C Hub", category: "Accessories", quantity: 310, price: 49.99, total: 15496.90 },
  { id: 4, product: "Mechanical Keyboard", category: "Accessories", quantity: 275, price: 89.99, total: 24747.25 },
  { id: 5, product: "Monitor 27\"", category: "Electronics", quantity: 95, price: 449.99, total: 42749.05 },
  { id: 6, product: "Webcam HD", category: "Electronics", quantity: 380, price: 79.99, total: 30396.20 },
  { id: 7, product: "Desk Lamp", category: "Furniture", quantity: 200, price: 34.99, total: 6998.00 },
  { id: 8, product: "Standing Desk", category: "Furniture", quantity: 60, price: 599.99, total: 35999.40 },
  { id: 9, product: "Headphones", category: "Electronics", quantity: 520, price: 199.99, total: 103994.80 },
  { id: 10, product: "Cable Kit", category: "Accessories", quantity: 890, price: 14.99, total: 13341.10 },
  { id: 11, product: "Monitor Arm", category: "Furniture", quantity: 145, price: 129.99, total: 18848.55 },
  { id: 12, product: "Mousepad XL", category: "Accessories", quantity: 650, price: 19.99, total: 12993.50 },
];

export const footerRendererHeaders: HeaderObject[] = [
  { accessor: "id", label: "ID", width: 60, type: "number" },
  { accessor: "product", label: "Product", width: 180, type: "string", isSortable: true },
  { accessor: "category", label: "Category", width: 130, type: "string", isSortable: true },
  { accessor: "quantity", label: "Qty", width: 80, type: "number", isSortable: true },
  {
    accessor: "price",
    label: "Price",
    width: 110,
    type: "number",
    isSortable: true,
    valueFormatter: ({ value }) => `$${(value as number).toFixed(2)}`,
  },
  {
    accessor: "total",
    label: "Total",
    width: 130,
    type: "number",
    isSortable: true,
    valueFormatter: ({ value }) => `$${(value as number).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
  },
];

export const footerRendererConfig = {
  headers: footerRendererHeaders,
  rows: footerRendererData,
  tableProps: {
    shouldPaginate: true,
    rowsPerPage: 5,
  },
} as const;
