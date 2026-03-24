/**
 * ClipboardFormatting Example – vanilla port of React ClipboardFormattingExample.
 * Same financial data, headers, valueFormatters, and useFormattedValueForClipboard as React.
 */
import type { HeaderObject, Row, Theme } from "../../src/index";
import { renderVanillaTable } from "../utils";
import { defaultVanillaArgs, type UniversalVanillaArgs } from "../vanillaStoryConfig";

const ROWS: Row[] = [
  { id: 1, product: "Widget Pro", unitPrice: 49.99, quantity: 150, revenue: 7498.5, margin: 0.35, category: "electronics", lastUpdate: "2024-01-15T10:30:00Z" },
  { id: 2, product: "Gadget Plus", unitPrice: 89.99, quantity: 85, revenue: 7649.15, margin: 0.42, category: "electronics", lastUpdate: "2024-01-16T14:20:00Z" },
  { id: 3, product: "Tool Master", unitPrice: 129.99, quantity: 60, revenue: 7799.4, margin: 0.38, category: "tools", lastUpdate: "2024-01-17T09:15:00Z" },
  { id: 4, product: "Super Deluxe", unitPrice: 199.99, quantity: 45, revenue: 8999.55, margin: 0.48, category: "premium", lastUpdate: "2024-01-18T16:45:00Z" },
  { id: 5, product: "Basic Kit", unitPrice: 24.99, quantity: 320, revenue: 7996.8, margin: 0.28, category: "basics", lastUpdate: "2024-01-19T11:00:00Z" },
  { id: 6, product: "Premium Pack", unitPrice: 149.99, quantity: 72, revenue: 10799.28, margin: 0.45, category: "premium", lastUpdate: "2024-01-20T13:30:00Z" },
];

const HEADERS: HeaderObject[] = [
  { accessor: "product", label: "Product Name", width: 160, isSortable: true, type: "string" },
  {
    accessor: "unitPrice",
    label: "Unit Price (Formatted Copy)",
    width: 200,
    isSortable: true,
    type: "number",
    valueFormatter: ({ value }: { value?: unknown }) => {
      if (typeof value === "number") return `$${value.toFixed(2)}`;
      return String(value);
    },
    useFormattedValueForClipboard: true,
    tooltip: "When you copy this cell, it will include the $ symbol",
  },
  {
    accessor: "quantity",
    label: "Quantity (Raw Copy)",
    width: 180,
    isSortable: true,
    type: "number",
    valueFormatter: ({ value }: { value?: unknown }) => {
      if (typeof value === "number") return `${value} units`;
      return String(value);
    },
    useFormattedValueForClipboard: false,
    tooltip: "When you copy this cell, it will be just the number",
  },
  {
    accessor: "revenue",
    label: "Revenue (Formatted Copy)",
    width: 200,
    isSortable: true,
    type: "number",
    valueFormatter: ({ value }: { value?: unknown }) => {
      if (typeof value === "number") {
        return `$${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      }
      return String(value);
    },
    useFormattedValueForClipboard: true,
    tooltip: "Copies as formatted currency with thousand separators",
  },
  {
    accessor: "margin",
    label: "Profit Margin (Formatted Copy)",
    width: 210,
    isSortable: true,
    type: "number",
    valueFormatter: ({ value }: { value?: unknown }) => {
      if (typeof value === "number") return `${(value * 100).toFixed(1)}%`;
      return String(value);
    },
    useFormattedValueForClipboard: true,
    tooltip: "Copies as percentage with % symbol",
  },
  {
    accessor: "category",
    label: "Category",
    width: 130,
    isSortable: true,
    type: "string",
    valueFormatter: ({ value }: { value?: unknown }) => {
      const str = String(value);
      return str.charAt(0).toUpperCase() + str.slice(1);
    },
    useFormattedValueForClipboard: true,
  },
  {
    accessor: "lastUpdate",
    label: "Last Update (Formatted Copy)",
    width: 220,
    isSortable: true,
    type: "date",
    valueFormatter: ({ value }: { value?: unknown }) => {
      if (typeof value === "string") {
        const date = new Date(value);
        return date.toLocaleString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
      }
      return String(value);
    },
    useFormattedValueForClipboard: true,
    tooltip: "Copies as formatted date/time string",
  },
];

export const clipboardFormattingExampleDefaults = {
  theme: "modern-light" as Theme,
  selectableCells: true,
  height: "500px",
};

export function renderClipboardFormattingExample(args?: Partial<UniversalVanillaArgs>): HTMLElement {
  const options = { ...defaultVanillaArgs, ...clipboardFormattingExampleDefaults, ...args };
  const { wrapper, h2 } = renderVanillaTable(HEADERS, ROWS, {
    ...options,
    getRowId: (params: { row?: { id?: unknown } }) => String(params.row?.id),
  });
  h2.textContent = "Clipboard Formatting with useFormattedValueForClipboard";
  const desc = document.createElement("div");
  desc.style.marginTop = "10px";
  desc.style.fontSize = "14px";
  desc.style.lineHeight = "1.6";
  desc.style.marginBottom = "1rem";
  desc.style.color = "#333";
  desc.innerHTML = `
    <p><strong>This example demonstrates clipboard copy behavior:</strong></p>
    <ul>
      <li><strong>Unit Price, Revenue, Margin, Last Update:</strong> These columns have <code>useFormattedValueForClipboard: true</code>, so when you copy cells (Ctrl+C / Cmd+C), you'll get the formatted values (with $, %, date formatting, etc.).</li>
      <li><strong>Quantity:</strong> This column has <code>useFormattedValueForClipboard: false</code>, so copying gives you the raw numeric value without " units" suffix.</li>
      <li><strong>Try it:</strong> Click on cells to select them, then press Ctrl+C (Cmd+C on Mac) and paste into a text editor or spreadsheet to see the difference!</li>
    </ul>
    <p style="margin-top: 10px; padding: 10px; background-color: #f0f8ff; border-radius: 4px;"><strong>💡 Tip:</strong> This is useful when you want users to copy human-readable formatted values instead of raw data, or vice versa depending on your use case.</p>
  `;
  wrapper.insertBefore(desc, wrapper.querySelector("div:last-child"));
  return wrapper;
}
