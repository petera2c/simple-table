import { SimpleTableVanilla } from "simple-table-core";
import type { Theme } from "simple-table-core";
import { programmaticControlConfig } from "@simple-table/examples-shared";
import "simple-table-core/styles.css";

export function renderProgrammaticControlDemo(
  container: HTMLElement,
  options?: { height?: string | number; theme?: Theme }
): SimpleTableVanilla {
  const wrapper = document.createElement("div");

  const controls = document.createElement("div");
  controls.style.cssText = "margin-bottom: 8px; display: flex; gap: 8px; flex-wrap: wrap";

  const buttons: Array<{ label: string; action: () => void }> = [];
  let table: SimpleTableVanilla;

  buttons.push(
    { label: "Sort by ID (Asc)", action: () => table.getAPI().applySortState({ accessor: "id", direction: "asc" }) },
    { label: "Sort by ID (Desc)", action: () => table.getAPI().applySortState({ accessor: "id", direction: "desc" }) },
    { label: "Clear Sort", action: () => table.getAPI().applySortState() },
    { label: "Clear All Filters", action: () => table.getAPI().clearAllFilters() },
    { label: "Export CSV", action: () => table.getAPI().exportToCSV() },
  );

  for (const { label, action } of buttons) {
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
    defaultHeaders: programmaticControlConfig.headers,
    rows: programmaticControlConfig.rows,
    height: options?.height ?? "400px",
    theme: options?.theme,
  });

  return table;
}
