import { SimpleTableVanilla } from "simple-table-core";
import type { Theme, QuickFilterMode } from "simple-table-core";
import { quickFilterConfig } from "@simple-table/examples-shared";
import "simple-table-core/styles.css";

export function renderQuickFilterDemo(
  container: HTMLElement,
  options?: { height?: string | number; theme?: Theme }
): SimpleTableVanilla {
  let searchText = "";
  let filterMode: QuickFilterMode = "simple";
  let caseSensitive = false;

  const wrapper = document.createElement("div");

  const controlsRow = document.createElement("div");
  controlsRow.style.cssText = "display:flex;flex-wrap:wrap;gap:8px;margin-bottom:12px;align-items:center";

  const input = document.createElement("input");
  input.type = "text";
  input.placeholder = "Search...";
  input.style.cssText = "padding:6px 12px;border-radius:6px;border:1px solid #d1d5db;font-size:13px;min-width:200px";
  input.addEventListener("input", () => {
    searchText = input.value;
    table.update({ quickFilter: { text: searchText, mode: filterMode, caseSensitive } });
  });
  controlsRow.appendChild(input);

  const tableContainer = document.createElement("div");
  wrapper.appendChild(controlsRow);
  wrapper.appendChild(tableContainer);
  container.appendChild(wrapper);

  const table = new SimpleTableVanilla(tableContainer, {
    defaultHeaders: quickFilterConfig.headers,
    rows: quickFilterConfig.rows,
    height: options?.height ?? "400px",
    theme: options?.theme,
    quickFilter: { text: searchText, mode: filterMode, caseSensitive },
  });

  function applyBtnStyle(btn: HTMLButtonElement, active: boolean) {
    btn.style.cssText = `padding:6px 14px;border-radius:6px;cursor:pointer;font-size:13px;border:${active ? "2px solid #3b82f6" : "1px solid #d1d5db"};background:${active ? "#eff6ff" : "#fff"};color:${active ? "#1d4ed8" : "#374151"};font-weight:${active ? 600 : 400}`;
  }

  const simpleBtn = document.createElement("button");
  simpleBtn.textContent = "Simple";
  const smartBtn = document.createElement("button");
  smartBtn.textContent = "Smart";
  const caseBtn = document.createElement("button");
  caseBtn.textContent = "Case Sensitive";

  function updateButtons() {
    applyBtnStyle(simpleBtn, filterMode === "simple");
    applyBtnStyle(smartBtn, filterMode === "smart");
    applyBtnStyle(caseBtn, caseSensitive);
  }

  simpleBtn.addEventListener("click", () => {
    filterMode = "simple";
    table.update({ quickFilter: { text: searchText, mode: filterMode, caseSensitive } });
    updateButtons();
  });
  smartBtn.addEventListener("click", () => {
    filterMode = "smart";
    table.update({ quickFilter: { text: searchText, mode: filterMode, caseSensitive } });
    updateButtons();
  });
  caseBtn.addEventListener("click", () => {
    caseSensitive = !caseSensitive;
    table.update({ quickFilter: { text: searchText, mode: filterMode, caseSensitive } });
    updateButtons();
  });

  controlsRow.appendChild(simpleBtn);
  controlsRow.appendChild(smartBtn);
  controlsRow.appendChild(caseBtn);
  updateButtons();

  return table;
}
