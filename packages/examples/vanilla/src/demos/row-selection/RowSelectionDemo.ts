import { SimpleTableVanilla } from "simple-table-core";
import type { Theme } from "simple-table-core";
import { rowSelectionConfig } from "@simple-table/examples-shared";
import "simple-table-core/styles.css";

export function renderRowSelectionDemo(
  container: HTMLElement,
  options?: { height?: string | number; theme?: Theme }
): SimpleTableVanilla {
  const wrapper = document.createElement("div");

  const status = document.createElement("div");
  status.style.marginBottom = "8px";
  status.textContent = "Selected rows: 0";

  const tableContainer = document.createElement("div");
  wrapper.appendChild(status);
  wrapper.appendChild(tableContainer);
  container.appendChild(wrapper);

  const table = new SimpleTableVanilla(tableContainer, {
    defaultHeaders: rowSelectionConfig.headers,
    rows: rowSelectionConfig.rows,
    height: options?.height ?? "400px",
    theme: options?.theme,
    enableRowSelection: true,
    onRowSelectionChange: (selection) => {
      status.textContent = `Selected rows: ${selection.selectedRows.size}`;
    },
  });
  return table;
}
