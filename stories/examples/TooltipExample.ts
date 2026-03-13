/**
 * Tooltip Example – vanilla port of React TooltipExample.
 * Same data, headers, and props as React version.
 */
import type { HeaderObject, Row } from "../../src/index";
import { renderVanillaTable } from "../utils";
import { defaultVanillaArgs, type UniversalVanillaArgs } from "../vanillaStoryConfig";

const EXAMPLE_DATA: Row[] = [
  { id: 1, productName: "Laptop Pro", category: "Electronics", price: 1299.99, stock: 45, rating: 4.5, lastUpdated: "2024-01-15" },
  { id: 2, productName: "Wireless Mouse", category: "Accessories", price: 29.99, stock: 120, rating: 4.2, lastUpdated: "2024-01-18" },
  { id: 3, productName: "USB-C Cable", category: "Accessories", price: 12.99, stock: 250, rating: 4.0, lastUpdated: "2024-01-20" },
  { id: 4, productName: "Gaming Keyboard", category: "Electronics", price: 149.99, stock: 67, rating: 4.7, lastUpdated: "2024-01-22" },
  { id: 5, productName: "Monitor 27in", category: "Electronics", price: 349.99, stock: 32, rating: 4.6, lastUpdated: "2024-01-25" },
];

const HEADERS: HeaderObject[] = [
  { accessor: "productName", label: "Product", width: 200, isSortable: true, tooltip: "The name of the product in our inventory" },
  { accessor: "category", label: "Category", width: 150, isSortable: true, filterable: true, tooltip: "Product category classification" },
  {
    accessor: "price",
    label: "Price",
    width: 120,
    isSortable: true,
    align: "right",
    tooltip: "Current retail price in USD",
    valueFormatter: ({ value }: { value?: unknown }) => `$${Number(value).toFixed(2)}`,
  },
  { accessor: "stock", label: "Stock", width: 100, isSortable: true, align: "right", tooltip: "Available inventory units in warehouse" },
  {
    accessor: "rating",
    label: "Rating",
    width: 100,
    isSortable: true,
    align: "center",
    tooltip: "Average customer rating (1-5 stars)",
    valueFormatter: ({ value }: { value?: unknown }) => `${value}/5`,
  },
  { accessor: "lastUpdated", label: "Last Updated", width: 150, isSortable: true, tooltip: "Date of last inventory update" },
];

export const tooltipExampleDefaults = {
  columnResizing: true,
  columnReordering: true,
  selectableCells: true,
  height: "calc(100dvh - 112px)",
};

export function renderTooltipExample(args?: Partial<UniversalVanillaArgs>): HTMLElement {
  const options = { ...defaultVanillaArgs, ...tooltipExampleDefaults, ...args };
  const { wrapper, h2 } = renderVanillaTable(HEADERS, EXAMPLE_DATA, {
    ...options,
    getRowId: (params: { row?: { id?: unknown } }) => String(params.row?.id),
  });
  h2.textContent = "Tooltip";
  return wrapper;
}
