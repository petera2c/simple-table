/**
 * Shared helpers for vanilla stories (examples and tests).
 */
import { SimpleTableVanilla } from "../src/index";
import type { HeaderObject, Row } from "../src/index";

/** Instance type of the table (class is a value; use InstanceType<typeof C> for the type of instances). */
type TableInstance = InstanceType<typeof SimpleTableVanilla>;

export interface RenderVanillaTableResult {
  wrapper: HTMLDivElement & { _table?: TableInstance };
  h2: HTMLHeadingElement;
  tableContainer: HTMLDivElement;
  table: TableInstance;
}

export function renderVanillaTable(
  headers: HeaderObject[],
  data: Row[],
  options: Record<string, unknown> = {}
): RenderVanillaTableResult {
  const wrapper = document.createElement("div") as HTMLDivElement & {
    _table?: TableInstance;
  };
  wrapper.style.padding = "2rem";

  const h2 = document.createElement("h2");
  h2.style.marginBottom = "1rem";
  wrapper.appendChild(h2);

  const tableContainer = document.createElement("div");
  wrapper.appendChild(tableContainer);

  const table = new SimpleTableVanilla(tableContainer, {
    defaultHeaders: headers,
    rows: data,
    ...options,
  });
  table.mount();
  wrapper._table = table;

  return { wrapper, h2, tableContainer, table };
}

export function addParagraph(
  wrapper: HTMLElement,
  text: string,
  beforeElement: Element | null = null
): HTMLParagraphElement {
  const p = document.createElement("p");
  p.style.marginBottom = "1rem";
  p.style.color = "#666";
  p.textContent = text;
  const target = beforeElement || wrapper.querySelector("div:last-child");
  wrapper.insertBefore(p, target);
  return p;
}

export interface ControlPanelSection {
  heading: string;
  buttons: { label: string; onClick: () => void }[];
}

/**
 * Adds a gray control panel with section headings and buttons above a given element (e.g. table container).
 */
export function addControlPanel(
  wrapper: HTMLElement,
  sections: ControlPanelSection[],
  insertBefore: Element
): HTMLDivElement {
  const panel = document.createElement("div");
  panel.style.marginBottom = "1.25rem";
  panel.style.padding = "1rem";
  panel.style.backgroundColor = "#f5f5f5";
  panel.style.borderRadius = "8px";

  for (const section of sections) {
    const h4 = document.createElement("h4");
    h4.style.marginTop = "0";
    h4.style.marginBottom = "0.5rem";
    h4.style.fontSize = "1rem";
    h4.textContent = section.heading;
    panel.appendChild(h4);

    const btnRow = document.createElement("div");
    btnRow.style.display = "flex";
    btnRow.style.gap = "0.5rem";
    btnRow.style.flexWrap = "wrap";
    btnRow.style.marginBottom = "1rem";
    for (const { label, onClick } of section.buttons) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.textContent = label;
      btn.style.padding = "8px 16px";
      btn.style.backgroundColor = "#007bff";
      btn.style.color = "white";
      btn.style.border = "none";
      btn.style.borderRadius = "4px";
      btn.style.cursor = "pointer";
      btn.addEventListener("click", onClick);
      btnRow.appendChild(btn);
    }
    panel.appendChild(btnRow);
  }

  wrapper.insertBefore(panel, insertBefore);
  return panel;
}
