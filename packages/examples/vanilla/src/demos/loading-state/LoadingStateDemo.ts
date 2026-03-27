import { SimpleTableVanilla } from "simple-table-core";
import type { Theme } from "simple-table-core";
import { loadingStateConfig } from "@simple-table/examples-shared";
import "simple-table-core/styles.css";

export function renderLoadingStateDemo(
  container: HTMLElement,
  options?: { height?: string | number; theme?: Theme }
): SimpleTableVanilla {
  const wrapper = document.createElement("div");

  const controls = document.createElement("div");
  controls.style.marginBottom = "8px";

  const reloadBtn = document.createElement("button");
  reloadBtn.textContent = "Reload Data";
  controls.appendChild(reloadBtn);

  const tableContainer = document.createElement("div");
  wrapper.appendChild(controls);
  wrapper.appendChild(tableContainer);
  container.appendChild(wrapper);

  const table = new SimpleTableVanilla(tableContainer, {
    defaultHeaders: loadingStateConfig.headers,
    rows: loadingStateConfig.rows,
    height: options?.height ?? "400px",
    theme: options?.theme,
    isLoading: true,
  });

  setTimeout(() => table.update({ isLoading: false }), 2000);

  reloadBtn.addEventListener("click", () => {
    table.update({ isLoading: true });
    setTimeout(() => table.update({ isLoading: false }), 2000);
  });

  return table;
}
