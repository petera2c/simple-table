/**
 * CellHighlighting Example – vanilla port of React CellHighlighting.
 * Aligns with main-branch schema and demonstrates value-based cell highlighting via cellRenderer.
 */
import type { HeaderObject, Row } from "../../src/index";
import { renderVanillaTable } from "../utils";
import { defaultVanillaArgs, type UniversalVanillaArgs } from "../vanillaStoryConfig";

// Define headers with conditional cell styling (growth, status, risk)
const HEADERS: HeaderObject[] = [
  { accessor: "id", label: "ID", width: 80, type: "number" },
  { accessor: "product", label: "Product", minWidth: 100, width: "1fr", type: "string" },
  {
    accessor: "sales",
    label: "Sales",
    width: 120,
    align: "right",
    type: "number",
  },
  {
    accessor: "growth",
    label: "Growth %",
    width: 120,
    align: "right",
    type: "number",
    cellRenderer: ({ value, row }) => {
      const div = document.createElement("div");
      div.style.width = "100%";
      div.style.textAlign = "right";
      const num = typeof value === "number" ? value : Number(row.growth);
      div.textContent = String(num);
      if (num < 0) {
        div.style.backgroundColor = "rgba(220, 53, 69, 0.2)";
        div.style.color = "var(--st-cell-color, #333)";
      } else if (num > 0) {
        div.style.backgroundColor = "rgba(40, 167, 69, 0.2)";
        div.style.color = "var(--st-cell-color, #333)";
      }
      return div;
    },
  },
  {
    accessor: "status",
    label: "Status",
    width: 150,
    type: "string",
    cellRenderer: ({ value, row }) => {
      const div = document.createElement("div");
      div.style.width = "100%";
      const status = (value ?? row.status) as string;
      div.textContent = String(status ?? "");
      if (status === "Out of Stock") {
        div.style.backgroundColor = "rgba(220, 53, 69, 0.25)";
      } else if (status === "Low Stock") {
        div.style.backgroundColor = "rgba(255, 193, 7, 0.3)";
      } else if (status === "In Stock") {
        div.style.backgroundColor = "rgba(40, 167, 69, 0.2)";
      }
      return div;
    },
  },
  {
    accessor: "risk",
    label: "Risk",
    width: 120,
    type: "string",
    cellRenderer: ({ value, row }) => {
      const div = document.createElement("div");
      div.style.width = "100%";
      const risk = (value ?? row.risk) as string;
      div.textContent = String(risk ?? "");
      if (risk === "High") {
        div.style.backgroundColor = "rgba(220, 53, 69, 0.25)";
      } else if (risk === "Medium") {
        div.style.backgroundColor = "rgba(255, 193, 7, 0.3)";
      } else if (risk === "Low") {
        div.style.backgroundColor = "rgba(40, 167, 69, 0.2)";
      }
      return div;
    },
  },
];

// Sample data with values to highlight – same as main branch
const ROWS: Row[] = [
  { id: 1, product: "Laptop", sales: 1250, growth: 15, status: "In Stock", risk: "Low" },
  { id: 2, product: "Smartphone", sales: 2430, growth: -5, status: "Low Stock", risk: "Medium" },
  { id: 3, product: "Tablet", sales: 890, growth: 23, status: "In Stock", risk: "Low" },
  { id: 4, product: "Headphones", sales: 560, growth: -12, status: "Out of Stock", risk: "High" },
  { id: 5, product: "Monitor", sales: 1180, growth: 8, status: "In Stock", risk: "Low" },
  { id: 6, product: "Keyboard", sales: 350, growth: -2, status: "Low Stock", risk: "Medium" },
  { id: 7, product: "Mouse", sales: 410, growth: 5, status: "In Stock", risk: "Low" },
  { id: 8, product: "Speaker", sales: 680, growth: -8, status: "Out of Stock", risk: "High" },
];

export const cellHighlightingExampleDefaults = {
  height: "300px",
  selectableCells: true,
  selectableColumns: true,
};

export function renderCellHighlightingExample(args?: Partial<UniversalVanillaArgs>): HTMLElement {
  const options = { ...defaultVanillaArgs, ...cellHighlightingExampleDefaults, ...args };
  const { wrapper, h2 } = renderVanillaTable(HEADERS, ROWS, {
    ...options,
    getRowId: (params: { row?: { id?: unknown } }) => String(params.row?.id),
  });
  h2.textContent = "Cell Highlighting";
  return wrapper;
}
