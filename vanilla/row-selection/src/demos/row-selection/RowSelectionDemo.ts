import { SimpleTableVanilla } from "simple-table-core";
import type { Theme, HeaderObject } from "simple-table-core";
import { rowSelectionConfig, rowSelectionData } from "./row-selection.demo-data";
import type { LibraryBook } from "./row-selection.demo-data";
import "simple-table-core/styles.css";

export function renderRowSelectionDemo(
  container: HTMLElement,
  options?: { height?: string | number; theme?: Theme },
): SimpleTableVanilla {
  const wrapper = document.createElement("div");
  wrapper.style.cssText = "display:flex;flex-direction:column;gap:12px";

  const infoPanel = document.createElement("div");
  infoPanel.style.cssText =
    "padding:12px;background-color:#f0f9ff;border-radius:8px;border:1px solid #bae6fd";
  infoPanel.innerHTML = `
    <div style="font-weight:bold;margin-bottom:4px;color:#0c4a6e">Library Management Demo</div>
    <div style="font-size:13px;color:#475569;margin-bottom:6px">Click rows to select books. Use the checkbox column to select multiple.</div>
    <div style="font-size:13px;color:#334155"><strong>Selected Books: </strong><span id="selected-titles">None</span></div>
  `;

  const tableContainer = document.createElement("div");
  wrapper.appendChild(infoPanel);
  wrapper.appendChild(tableContainer);
  container.appendChild(wrapper);

  const titlesSpan = infoPanel.querySelector("#selected-titles")!;

  const headers: HeaderObject[] = rowSelectionConfig.headers.map((h) => {
    if (h.accessor === "status") {
      return {
        ...h,
        cellRenderer: ({ row }: { row: Record<string, unknown> }) => {
          const s = String(row.status);
          const color = s === "Available" ? "#16a34a" : s === "Checked Out" ? "#ea580c" : "#dc2626";
          return `<span style="color:${color};font-weight:bold">${s}</span>`;
        },
      };
    }
    return { ...h };
  });

  const table = new SimpleTableVanilla(tableContainer, {
    defaultHeaders: headers,
    rows: rowSelectionConfig.rows,
    height: options?.height ?? "348px",
    theme: options?.theme,
    enableRowSelection: true,
    columnResizing: true,
    columnReordering: true,
    selectableCells: true,
    onRowSelectionChange: (selection) => {
      const selected: LibraryBook[] = rowSelectionData.filter((book) =>
        selection.selectedRows.has(String(book.id)),
      );
      titlesSpan.textContent =
        selected.length > 0 ? selected.map((b) => b.title).join(", ") : "None";
    },
  });

  return table;
}
