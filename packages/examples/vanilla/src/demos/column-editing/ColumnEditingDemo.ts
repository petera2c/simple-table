import { SimpleTableVanilla } from "simple-table-core";
import type { Theme, HeaderObject } from "simple-table-core";
import { columnEditingData, columnEditingHeaders } from "@simple-table/examples-shared";
import "simple-table-core/styles.css";

export function renderColumnEditingDemo(
  container: HTMLElement,
  options?: { height?: string | number; theme?: Theme },
): SimpleTableVanilla {
  const wrapper = document.createElement("div");

  const toolbar = document.createElement("div");
  toolbar.style.marginBottom = "12px";

  const btn = document.createElement("button");
  btn.textContent = "+ Add Column";
  Object.assign(btn.style, { backgroundColor: "#007bff", color: "white", border: "none", padding: "6px 14px", borderRadius: "4px", cursor: "pointer", fontSize: "13px" });

  const info = document.createElement("span");
  Object.assign(info.style, { marginLeft: "12px", color: "#64748b", fontSize: "13px" });

  toolbar.appendChild(btn);
  toolbar.appendChild(info);
  wrapper.appendChild(toolbar);

  const tableContainer = document.createElement("div");
  wrapper.appendChild(tableContainer);
  container.appendChild(wrapper);

  let additionalColumns: HeaderObject[] = [];

  const table = new SimpleTableVanilla(tableContainer, {
    defaultHeaders: [...columnEditingHeaders],
    rows: columnEditingData,
    height: options?.height ?? "400px",
    theme: options?.theme,
    enableHeaderEditing: true,
    selectableColumns: true,
  });

  btn.addEventListener("click", () => {
    const n = additionalColumns.length + 1;
    const col: HeaderObject = { accessor: `custom-${n}`, label: `Custom ${n}`, width: 120, type: "string" };
    additionalColumns = [...additionalColumns, col];
    info.textContent = `Added: ${col.label}`;
    table.setConfig({ defaultHeaders: [...columnEditingHeaders, ...additionalColumns] });
  });

  return table;
}
