import { SimpleTableVanilla } from "simple-table-core";
import type { Theme, HeaderObject } from "simple-table-core";
import { csvExportHeaders, csvExportData, csvExportConfig } from "./csv-export.demo-data";
import "simple-table-core/styles.css";

export function renderCsvExportDemo(
  container: HTMLElement,
  options?: { height?: string | number; theme?: Theme },
): SimpleTableVanilla {
  const wrapper = document.createElement("div");

  const controls = document.createElement("div");
  controls.style.cssText = "display:flex;gap:8px;margin-bottom:12px";

  const exportBtn = document.createElement("button");
  exportBtn.textContent = "Export to CSV";
  exportBtn.style.padding = "6px 16px";
  controls.appendChild(exportBtn);

  const infoBtn = document.createElement("button");
  infoBtn.textContent = "Get Table Info";
  infoBtn.style.padding = "6px 16px";
  controls.appendChild(infoBtn);

  const tableContainer = document.createElement("div");
  wrapper.appendChild(controls);
  wrapper.appendChild(tableContainer);
  container.appendChild(wrapper);

  const headers: HeaderObject[] = csvExportHeaders.map((h) => {
    if (h.accessor === "actions") {
      return {
        ...h,
        cellRenderer: () =>
          `<button style="background:#3b82f6;color:white;border:none;padding:4px 12px;border-radius:4px;cursor:pointer;font-size:12px;font-weight:bold">View</button>`,
      };
    }
    return { ...h };
  });

  const table = new SimpleTableVanilla(tableContainer, {
    defaultHeaders: headers,
    rows: csvExportData,
    editColumns: csvExportConfig.tableProps.editColumns,
    selectableCells: csvExportConfig.tableProps.selectableCells,
    customTheme: csvExportConfig.tableProps.customTheme,
    height: options?.height ?? "400px",
    theme: options?.theme,
  });

  exportBtn.addEventListener("click", () => {
    table.getAPI().exportToCSV();
  });

  infoBtn.addEventListener("click", () => {
    const api = table.getAPI();
    const rows = api.getAllRows();
    const hdrs = api.getHeaders();
    const totalRevenue = rows.reduce(
      (sum, r) => sum + (Number((r.row as { revenue?: unknown }).revenue) || 0),
      0,
    );
    alert(
      `Table Info:\n• ${rows.length} rows\n• ${hdrs.length} columns\n• Columns: ${hdrs.map((h) => h.label).join(", ")}\n• Total Revenue: $${totalRevenue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    );
  });

  return table;
}
