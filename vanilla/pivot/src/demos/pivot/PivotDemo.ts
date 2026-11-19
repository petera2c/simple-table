import { SimpleTableVanilla } from "simple-table-core";
import type { PivotConfig, Theme } from "simple-table-core";
import { pivotDemoConfig } from "./pivot.demo-data";
import type { PivotFact } from "./pivot.demo-data";
import "simple-table-core/styles.css";

const INITIAL_PIVOT: PivotConfig<PivotFact> = {
  rows: ["region", "product"],
  columns: ["quarter"],
  values: [{ accessor: "sales", aggregation: { type: "sum" } }],
};

export function renderPivotDemo(
  container: HTMLElement,
  options?: { height?: string | number; theme?: Theme }
): SimpleTableVanilla<PivotFact> {
  let pivotEnabled = true;
  let pivot: PivotConfig<PivotFact> | null = INITIAL_PIVOT;
  let table: SimpleTableVanilla<PivotFact> | null = null;

  const root = document.createElement("div");

  const label = document.createElement("label");
  label.style.cssText =
    "display:flex;align-items:center;gap:8px;margin-bottom:12px;font-size:14px;color:#374151";

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = true;
  checkbox.setAttribute("aria-label", "Pivot mode");
  checkbox.addEventListener("change", () => {
    pivotEnabled = checkbox.checked;
    if (pivotEnabled && pivot === null) {
      pivot = INITIAL_PIVOT;
    }
    table?.updateConfig({
      pivot: pivotEnabled ? pivot : null,
      enablePivotPanel: pivotEnabled,
    });
  });

  const text = document.createElement("span");
  text.textContent = "Pivot mode";
  label.append(checkbox, text);

  const tableHost = document.createElement("div");
  tableHost.style.width = "100%";
  root.append(label, tableHost);
  container.replaceChildren(root);

  table = new SimpleTableVanilla(tableHost, {
    columns: pivotDemoConfig.headers,
    rows: pivotDemoConfig.rows,
    pivot,
    autoExpandColumns: true,
    columnResizing: true,
    enableColumnEditor: true,
    enableColumnEditorInitOpen: true,
    enablePivotPanel: true,
    height: options?.height ?? "500px",
    selectableCells: true,
    theme: options?.theme,
    getRowId: ({ row }) => (row?.id == null ? undefined : String(row.id)),
    onPivotChange: (next) => {
      pivot = next;
    },
  });

  return table;
}
