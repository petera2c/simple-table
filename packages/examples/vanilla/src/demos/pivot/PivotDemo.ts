import { SimpleTableVanilla } from "simple-table-core";
import type { Theme } from "simple-table-core";
import { pivotDemoConfig, pivotPresets } from "./pivot.demo-data";
import "simple-table-core/styles.css";

export function renderPivotDemo(
  container: HTMLElement,
  options?: { height?: string | number; theme?: Theme }
): SimpleTableVanilla {
  let activeId = pivotPresets[0].id;
  let table: SimpleTableVanilla | null = null;

  const root = document.createElement("div");
  root.style.cssText = "display:flex;flex-direction:column;gap:12px;width:100%";

  const buttons = document.createElement("div");
  buttons.style.cssText = "display:flex;flex-wrap:wrap;gap:8px";

  const tableHost = document.createElement("div");
  tableHost.style.cssText = "width:100%";

  const paintButtons = () => {
    buttons.replaceChildren();
    for (const preset of pivotPresets) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.textContent = preset.label;
      const selected = preset.id === activeId;
      btn.style.cssText = `padding:6px 12px;border-radius:6px;border:none;cursor:pointer;font-size:13px;font-weight:500;background:${
        selected ? "#2563eb" : "#e5e7eb"
      };color:${selected ? "#fff" : "#374151"}`;
      btn.addEventListener("click", () => {
        activeId = preset.id;
        paintButtons();
        const active = pivotPresets.find((p) => p.id === activeId) ?? pivotPresets[0];
        table?.updateConfig({
          pivot: active.pivot,
          expandAll: active.pivot.rows.length > 1,
        });
      });
      buttons.appendChild(btn);
    }
  };

  paintButtons();
  root.append(buttons, tableHost);
  container.replaceChildren(root);

  const active = pivotPresets.find((p) => p.id === activeId) ?? pivotPresets[0];
  table = new SimpleTableVanilla(tableHost, {
    defaultHeaders: pivotDemoConfig.headers,
    rows: pivotDemoConfig.rows,
    pivot: active.pivot,
    columnResizing: true,
    expandAll: active.pivot.rows.length > 1,
    height: options?.height ?? "400px",
    selectableCells: true,
    theme: options?.theme,
  });
  return table;
}
