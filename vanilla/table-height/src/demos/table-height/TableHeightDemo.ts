import { SimpleTableVanilla } from "simple-table-core";
import type { Theme } from "simple-table-core";
import { tableHeightConfig } from "./table-height.demo-data";
import "simple-table-core/styles.css";

export function renderTableHeightDemo(
  container: HTMLElement,
  options?: { height?: string | number; theme?: Theme }
): SimpleTableVanilla {
  const wrapper = document.createElement("div");

  const btnContainer = document.createElement("div");
  btnContainer.style.cssText = "display: flex; gap: 8px; margin-bottom: 12px";

  const heights = ["200px", "300px", "400px"];
  let selectedHeight = "400px";

  const tableContainer = document.createElement("div");
  wrapper.appendChild(btnContainer);
  wrapper.appendChild(tableContainer);
  container.appendChild(wrapper);

  const table = new SimpleTableVanilla(tableContainer, {
    defaultHeaders: tableHeightConfig.headers,
    rows: tableHeightConfig.rows,
    height: selectedHeight,
    theme: options?.theme,
  });

  const buttons: HTMLButtonElement[] = [];
  for (const h of heights) {
    const btn = document.createElement("button");
    btn.textContent = h;
    btn.style.cssText = `padding: 6px 12px; border-radius: 4px; border: 1px solid #ccc; cursor: pointer; font-size: 14px; font-weight: 500;`;
    btn.addEventListener("click", () => {
      selectedHeight = h;
      table.updateConfig({ height: h });
      updateButtons();
    });
    buttons.push(btn);
    btnContainer.appendChild(btn);
  }

  function updateButtons() {
    buttons.forEach((btn, i) => {
      const isActive = heights[i] === selectedHeight;
      btn.style.background = isActive ? "#3b82f6" : "#f3f4f6";
      btn.style.color = isActive ? "#fff" : "#374151";
    });
  }
  updateButtons();

  return table;
}
