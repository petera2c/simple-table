import { SimpleTableVanilla } from "simple-table-core";
import type { Theme } from "simple-table-core";
import { rowGroupingConfig } from "@simple-table/examples-shared";
import "simple-table-core/styles.css";

export function renderRowGroupingDemo(
  container: HTMLElement,
  options?: { height?: string | number; theme?: Theme }
): SimpleTableVanilla {
  const wrapper = document.createElement("div");

  const controls = document.createElement("div");
  controls.style.cssText = "margin-bottom: 8px; display: flex; gap: 8px; flex-wrap: wrap";

  const buttonDefs: Array<{ label: string; action: () => void }> = [];
  let table: SimpleTableVanilla;

  buttonDefs.push(
    { label: "Expand All", action: () => table.getAPI().expandAll() },
    { label: "Collapse All", action: () => table.getAPI().collapseAll() },
    { label: "Expand Depth 0", action: () => table.getAPI().expandDepth(0) },
    { label: "Collapse Depth 0", action: () => table.getAPI().collapseDepth(0) },
    { label: "Toggle Depth 0", action: () => table.getAPI().toggleDepth(0) },
  );

  for (const { label, action } of buttonDefs) {
    const btn = document.createElement("button");
    btn.textContent = label;
    btn.addEventListener("click", action);
    controls.appendChild(btn);
  }

  const tableContainer = document.createElement("div");
  wrapper.appendChild(controls);
  wrapper.appendChild(tableContainer);
  container.appendChild(wrapper);

  table = new SimpleTableVanilla(tableContainer, {
    defaultHeaders: rowGroupingConfig.headers,
    rows: rowGroupingConfig.rows,
    height: options?.height ?? "400px",
    theme: options?.theme,
    rowGrouping: ["id"],
  });

  return table;
}
