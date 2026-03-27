import { SimpleTableVanilla } from "simple-table-core";
import type { Theme } from "simple-table-core";
import { rowGroupingConfig } from "@simple-table/examples-shared";
import "simple-table-core/styles.css";

export function renderRowGroupingDemo(
  container: HTMLElement,
  options?: { height?: string | number; theme?: Theme }
): SimpleTableVanilla {
  const wrapper = document.createElement("div");
  wrapper.style.cssText = "display:flex;flex-direction:column;gap:12px";

  const controls = document.createElement("div");
  controls.style.cssText = "display:flex;gap:8px;flex-wrap:wrap;align-items:center";

  const label = document.createElement("span");
  label.textContent = "Control Expansion:";
  label.style.cssText = "font-size:13px;font-weight:600;margin-right:8px";
  controls.appendChild(label);

  const tableContainer = document.createElement("div");
  wrapper.appendChild(controls);
  wrapper.appendChild(tableContainer);
  container.appendChild(wrapper);

  const table = new SimpleTableVanilla(tableContainer, {
    defaultHeaders: rowGroupingConfig.headers,
    rows: rowGroupingConfig.rows,
    height: options?.height ?? "400px",
    theme: options?.theme,
    rowGrouping: rowGroupingConfig.tableProps.rowGrouping,
    enableStickyParents: true,
    getRowId: rowGroupingConfig.tableProps.getRowId,
    columnResizing: true,
  });

  const api = table.getAPI();

  const buttons: Array<{ label: string; color: string; action: () => void }> = [
    { label: "Expand All", color: "#28a745", action: () => api.expandAll() },
    { label: "Collapse All", color: "#dc3545", action: () => api.collapseAll() },
    { label: "Only Divisions", color: "#007bff", action: () => { api.collapseAll(); api.expandDepth(0); } },
    { label: "Divisions + Departments", color: "#6c757d", action: () => api.setExpandedDepths(new Set([0, 1])) },
    { label: "Toggle Divisions", color: "#6f42c1", action: () => api.toggleDepth(0) },
  ];

  for (const { label: text, color, action } of buttons) {
    const btn = document.createElement("button");
    btn.textContent = text;
    btn.style.cssText = `padding:6px 12px;background:${color};color:white;border:none;border-radius:4px;cursor:pointer;font-size:12px;font-weight:500`;
    btn.addEventListener("click", action);
    controls.appendChild(btn);
  }

  return table;
}
