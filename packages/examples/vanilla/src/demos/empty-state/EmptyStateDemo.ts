import { SimpleTableVanilla } from "simple-table-core";
import type { Theme } from "simple-table-core";
import { emptyStateConfig } from "@simple-table/examples-shared";
import "simple-table-core/styles.css";

function buildEmptyStateEl(): HTMLElement {
  const wrapper = document.createElement("div");
  wrapper.style.cssText = "display:flex;flex-direction:column;align-items:center;justify-content:center;padding:48px 16px;color:#94a3b8";

  const icon = document.createElement("div");
  icon.style.cssText = "font-size:32px;margin-bottom:8px";
  icon.textContent = "\uD83D\uDCED";
  wrapper.appendChild(icon);

  const title = document.createElement("div");
  title.style.cssText = "font-size:15px;font-weight:600";
  title.textContent = "No data available";
  wrapper.appendChild(title);

  const sub = document.createElement("div");
  sub.style.cssText = "font-size:13px;margin-top:4px";
  sub.textContent = "Try adding some records to see them here.";
  wrapper.appendChild(sub);

  return wrapper;
}

export function renderEmptyStateDemo(
  container: HTMLElement,
  options?: { height?: string | number; theme?: Theme }
): SimpleTableVanilla {
  const table = new SimpleTableVanilla(container, {
    defaultHeaders: [...emptyStateConfig.headers],
    rows: emptyStateConfig.rows,
    height: options?.height ?? "400px",
    theme: options?.theme,
    tableEmptyStateRenderer: buildEmptyStateEl(),
  });
  return table;
}
