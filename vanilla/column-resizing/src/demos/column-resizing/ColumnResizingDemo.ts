import { SimpleTableVanilla } from "simple-table-core";
import type { Theme, HeaderObject } from "simple-table-core";
import { columnResizingHeaders, columnResizingData, COLUMN_RESIZING_STORAGE_KEY } from "./column-resizing.demo-data";
import "simple-table-core/styles.css";

export function renderColumnResizingDemo(
  container: HTMLElement,
  options?: { height?: string | number; theme?: Theme },
): SimpleTableVanilla {
  const wrapper = document.createElement("div");
  wrapper.style.position = "relative";
  wrapper.style.height = "100%";

  const toast = document.createElement("div");
  Object.assign(toast.style, {
    position: "absolute", top: "8px", right: "8px", background: "#10b981", color: "white",
    padding: "8px 16px", borderRadius: "6px", fontSize: "14px", fontWeight: "500",
    zIndex: "1000", boxShadow: "0 2px 8px rgba(0,0,0,0.15)", display: "none",
  });
  wrapper.appendChild(toast);

  const tableContainer = document.createElement("div");
  wrapper.appendChild(tableContainer);
  container.appendChild(wrapper);

  let headers: HeaderObject[] = [...columnResizingHeaders];
  try {
    const saved = localStorage.getItem(COLUMN_RESIZING_STORAGE_KEY);
    if (saved) {
      const widthMap = JSON.parse(saved);
      headers = columnResizingHeaders.map((h) => ({ ...h, width: widthMap[h.accessor] ?? h.width }));
    }
  } catch { /* ignore */ }

  const table = new SimpleTableVanilla(tableContainer, {
    defaultHeaders: headers,
    rows: columnResizingData,
    height: options?.height ?? "400px",
    theme: options?.theme,
    columnResizing: true,
    onColumnWidthChange: (updatedHeaders: HeaderObject[]) => {
      try {
        const widthMap: Record<string, unknown> = {};
        for (const h of updatedHeaders) widthMap[h.accessor] = h.width;
        localStorage.setItem(COLUMN_RESIZING_STORAGE_KEY, JSON.stringify(widthMap));
        toast.textContent = "Column widths saved!";
        toast.style.display = "block";
        setTimeout(() => { toast.style.display = "none"; }, 2000);
      } catch {
        toast.textContent = "Failed to save widths";
        toast.style.display = "block";
        setTimeout(() => { toast.style.display = "none"; }, 2000);
      }
    },
  });

  return table;
}
