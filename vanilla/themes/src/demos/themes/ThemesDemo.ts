import { SimpleTableVanilla } from "simple-table-core";
import type { Theme } from "simple-table-core";
import { themesConfig, AVAILABLE_THEMES } from "./themes.demo-data";
import "simple-table-core/styles.css";

export function renderThemesDemo(
  container: HTMLElement,
  options?: { height?: string | number; theme?: Theme }
): SimpleTableVanilla {
  let selectedTheme: Theme = options?.theme ?? "light";

  const wrapper = document.createElement("div");

  const buttonRow = document.createElement("div");
  buttonRow.style.cssText = "display:flex;flex-wrap:wrap;gap:8px;margin-bottom:12px";

  const tableContainer = document.createElement("div");
  wrapper.appendChild(buttonRow);
  wrapper.appendChild(tableContainer);
  container.appendChild(wrapper);

  const table = new SimpleTableVanilla(tableContainer, {
    defaultHeaders: themesConfig.headers,
    rows: themesConfig.rows,
    height: options?.height ?? "400px",
    theme: selectedTheme,
  });

  function renderButtons() {
    buttonRow.innerHTML = "";
    for (const t of AVAILABLE_THEMES) {
      const btn = document.createElement("button");
      btn.textContent = t.label;
      const active = selectedTheme === t.value;
      btn.style.cssText = `padding:6px 14px;border-radius:6px;cursor:pointer;font-size:13px;border:${active ? "2px solid #3b82f6" : "1px solid #d1d5db"};background:${active ? "#eff6ff" : "#fff"};color:${active ? "#1d4ed8" : "#374151"};font-weight:${active ? 600 : 400}`;
      btn.addEventListener("click", () => {
        selectedTheme = t.value;
        table.update({ theme: selectedTheme });
        renderButtons();
      });
      buttonRow.appendChild(btn);
    }
  }

  renderButtons();
  return table;
}
