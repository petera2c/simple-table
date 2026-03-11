/**
 * Tooltip Example – vanilla port of React TooltipExample.
 */
import { renderVanillaTable } from "../utils";

const ROWS: Record<string, unknown>[] = [
  { id: 1, productName: "Laptop Pro", category: "Electronics", price: 1299.99, stock: 45, rating: 4.5, lastUpdated: "2024-01-15" },
  { id: 2, productName: "Wireless Mouse", category: "Accessories", price: 29.99, stock: 120, rating: 4.2, lastUpdated: "2024-01-18" },
  { id: 3, productName: "USB-C Cable", category: "Accessories", price: 12.99, stock: 250, rating: 4.0, lastUpdated: "2024-01-20" },
  { id: 4, productName: "Gaming Keyboard", category: "Electronics", price: 149.99, stock: 67, rating: 4.7, lastUpdated: "2024-01-22" },
  { id: 5, productName: "Monitor 27in", category: "Electronics", price: 349.99, stock: 32, rating: 4.6, lastUpdated: "2024-01-25" },
];

const HEADERS: Record<string, unknown>[] = [
  { accessor: "productName", label: "Product", width: 200, isSortable: true, tooltip: "The name of the product in our inventory" },
  { accessor: "category", label: "Category", width: 150, isSortable: true, tooltip: "Product category for filtering" },
  { accessor: "price", label: "Price", width: 120, isSortable: true, tooltip: "Current retail price in USD" },
  { accessor: "stock", label: "Stock", width: 100, isSortable: true, tooltip: "Units in warehouse" },
  { accessor: "rating", label: "Rating", width: 100, isSortable: true, tooltip: "Customer rating 1-5" },
  { accessor: "lastUpdated", label: "Updated", width: 120, isSortable: true, tooltip: "Last inventory update date" },
];

export function renderTooltipExample(): HTMLElement {
  const { wrapper, h2 } = renderVanillaTable(HEADERS, ROWS, {
    getRowId: (params: { row?: { id?: unknown } }) => String(params.row?.id),
  });
  h2.textContent = "Tooltip";
  return wrapper;
}
