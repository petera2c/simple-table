import { SimpleTableVanilla } from "simple-table-core";
import type { Theme, HeaderObject, CellRenderer } from "simple-table-core";
import { cellRendererConfig } from "@simple-table/examples-shared";
import "simple-table-core/styles.css";

const statusRenderer: CellRenderer = ({ value }) => {
  const v = value as string;
  const span = document.createElement("span");
  span.style.fontWeight = "600";
  span.style.color = v === "active" ? "#22c55e" : v === "pending" ? "#f59e0b" : "#94a3b8";
  span.textContent = `${v === "active" ? "\u25CF" : "\u25CB"} ${v}`;
  return span;
};

const progressRenderer: CellRenderer = ({ value }) => `${value}%`;

const ratingRenderer: CellRenderer = ({ value }) => {
  const n = value as number;
  const span = document.createElement("span");
  span.style.color = "#f59e0b";
  span.textContent = "\u2605".repeat(n) + "\u2606".repeat(5 - n);
  return span;
};

const verifiedRenderer: CellRenderer = ({ value }) => {
  const ok = value as boolean;
  const span = document.createElement("span");
  span.style.color = ok ? "#22c55e" : "#94a3b8";
  span.textContent = ok ? "\u2713 Yes" : "\u2717 No";
  return span;
};

const tagsRenderer: CellRenderer = ({ row }) => {
  const container = document.createElement("span");
  for (const t of row.tags as string[]) {
    const tag = document.createElement("span");
    tag.textContent = t;
    tag.style.cssText = "display:inline-block;padding:1px 6px;margin:0 2px;border-radius:3px;background:#e2e8f0;font-size:11px";
    container.appendChild(tag);
  }
  return container;
};

const RENDERERS: Record<string, CellRenderer> = {
  status: statusRenderer,
  progress: progressRenderer,
  rating: ratingRenderer,
  verified: verifiedRenderer,
  tags: tagsRenderer,
};

export function renderCellRendererDemo(
  container: HTMLElement,
  options?: { height?: string | number; theme?: Theme }
): SimpleTableVanilla {
  const headers: HeaderObject[] = cellRendererConfig.headers.map((h) => {
    const renderer = RENDERERS[h.accessor as string];
    return renderer ? { ...h, cellRenderer: renderer } : { ...h };
  });

  const table = new SimpleTableVanilla(container, {
    defaultHeaders: headers,
    rows: cellRendererConfig.rows,
    height: options?.height ?? "400px",
    theme: options?.theme,
    selectableCells: cellRendererConfig.tableProps.selectableCells,
    customTheme: cellRendererConfig.tableProps.customTheme,
  });
  return table;
}
