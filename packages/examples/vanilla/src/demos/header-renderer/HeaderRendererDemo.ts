import { SimpleTableVanilla } from "simple-table-core";
import type { Theme, HeaderObject, HeaderRenderer } from "simple-table-core";
import { headerRendererConfig } from "@simple-table/examples-shared";
import "simple-table-core/styles.css";

const customHeaderRenderer: HeaderRenderer = ({ header, components }) => {
  const wrapper = document.createElement("div");
  wrapper.style.cssText = "display:flex;align-items:center;gap:4px;width:100%";

  const label = document.createElement("span");
  label.style.cssText = "font-weight:700;font-size:12px";
  label.textContent = header.label;
  wrapper.appendChild(label);

  if (components?.sortIcon) {
    if (typeof components.sortIcon === "string") {
      const s = document.createElement("span");
      s.innerHTML = components.sortIcon;
      wrapper.appendChild(s);
    } else {
      wrapper.appendChild(components.sortIcon as Node);
    }
  }

  return wrapper;
};

export function renderHeaderRendererDemo(
  container: HTMLElement,
  options?: { height?: string | number; theme?: Theme }
): SimpleTableVanilla {
  const headers: HeaderObject[] = headerRendererConfig.headers.map((h) => ({
    ...h,
    headerRenderer: customHeaderRenderer,
  }));

  const table = new SimpleTableVanilla(container, {
    defaultHeaders: headers,
    rows: headerRendererConfig.rows,
    height: options?.height ?? "400px",
    theme: options?.theme,
    selectableCells: headerRendererConfig.tableProps.selectableCells,
    columnResizing: headerRendererConfig.tableProps.columnResizing,
  });
  return table;
}
