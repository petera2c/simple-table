import { SimpleTableVanilla } from "simple-table-core";
import type { Theme } from "simple-table-core";
import { externalFilterConfig } from "@simple-table/examples-shared";
import "simple-table-core/styles.css";

export function renderExternalFilterDemo(
  container: HTMLElement,
  options?: { height?: string | number; theme?: Theme }
): SimpleTableVanilla {
  const wrapper = document.createElement("div");

  const controls = document.createElement("div");
  controls.style.marginBottom = "8px";

  const input = document.createElement("input");
  input.type = "text";
  input.placeholder = "Filter rows...";
  input.style.padding = "4px 8px";
  controls.appendChild(input);

  const tableContainer = document.createElement("div");
  wrapper.appendChild(controls);
  wrapper.appendChild(tableContainer);
  container.appendChild(wrapper);

  const table = new SimpleTableVanilla(tableContainer, {
    defaultHeaders: externalFilterConfig.headers,
    rows: externalFilterConfig.rows,
    height: options?.height ?? "400px",
    theme: options?.theme,
  });

  input.addEventListener("input", () => {
    const text = input.value.toLowerCase();
    if (!text) {
      table.update({ rows: externalFilterConfig.rows });
      return;
    }
    const filtered = externalFilterConfig.rows.filter((row) =>
      Object.values(row).some((val) =>
        String(val).toLowerCase().includes(text)
      )
    );
    table.update({ rows: filtered });
  });

  return table;
}
