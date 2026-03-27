import { SimpleTableVanilla } from "simple-table-core";
import type { Theme } from "simple-table-core";
import { csvExportConfig } from "@simple-table/examples-shared";
import "simple-table-core/styles.css";

export function renderCsvExportDemo(
  container: HTMLElement,
  options?: { height?: string | number; theme?: Theme }
): SimpleTableVanilla {
  const wrapper = document.createElement("div");

  const controls = document.createElement("div");
  controls.style.marginBottom = "8px";

  const exportBtn = document.createElement("button");
  exportBtn.textContent = "Export to CSV";
  controls.appendChild(exportBtn);

  const exportCustomBtn = document.createElement("button");
  exportCustomBtn.textContent = "Export with Custom Name";
  exportCustomBtn.style.marginLeft = "8px";
  controls.appendChild(exportCustomBtn);

  const tableContainer = document.createElement("div");
  wrapper.appendChild(controls);
  wrapper.appendChild(tableContainer);
  container.appendChild(wrapper);

  const table = new SimpleTableVanilla(tableContainer, {
    defaultHeaders: csvExportConfig.headers,
    rows: csvExportConfig.rows,
    height: options?.height ?? "400px",
    theme: options?.theme,
  });

  exportBtn.addEventListener("click", () => {
    table.getAPI().exportToCSV();
  });

  exportCustomBtn.addEventListener("click", () => {
    table.getAPI().exportToCSV({ filename: "custom-export" });
  });

  return table;
}
