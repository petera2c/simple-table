/**
 * Shared helpers for vanilla stories (examples and tests).
 */
import { SimpleTableVanilla } from "../src/index";
import type { ColumnDef, Row, RowData, SimpleTableConfigInput } from "../src/index";

/**
 * Config passed through to {@link SimpleTableVanilla}, minus `columns` /
 * `columns` / `rows` which are supplied as the first two arguments of
 * {@link renderVanillaTable}.
 *
 * Keys are constrained to {@link SimpleTableConfigInput} so consumer aliases
 * (e.g. `enableColumnEditor`) and typos / misplaced props (e.g. top-level
 * `rowHeight` instead of `customTheme.rowHeight`) fail at compile time.
 * Values stay loose (`unknown`) so story callbacks that are slightly narrower
 * than the public types still typecheck.
 */
export type RenderVanillaTableOptions = {
  [K in keyof Omit<SimpleTableConfigInput, "columns" | "rows">]?: unknown;
};

export interface RenderVanillaTableResult<TData extends RowData = Row> {
  wrapper: HTMLDivElement & { _table?: SimpleTableVanilla<TData> };
  h2: HTMLHeadingElement;
  tableContainer: HTMLDivElement;
  table: SimpleTableVanilla<TData>;
}

export function renderVanillaTable<TData extends RowData = Row>(
  headers: ColumnDef<TData>[],
  data: TData[],
  options: RenderVanillaTableOptions = {},
): RenderVanillaTableResult<TData> {
  const wrapper = document.createElement("div") as HTMLDivElement & {
    _table?: SimpleTableVanilla<TData>;
  };
  wrapper.style.padding = "2rem";

  const h2 = document.createElement("h2");
  h2.style.marginBottom = "1rem";
  wrapper.appendChild(h2);

  const tableContainer = document.createElement("div");
  wrapper.appendChild(tableContainer);

  // Keys are already constrained by RenderVanillaTableOptions; cast values
  // through to the constructor (stories often use slightly narrower callbacks).
  const table = new SimpleTableVanilla<TData>(tableContainer, {
    columns: headers,
    rows: data,
    ...options,
  } as SimpleTableConfigInput<TData>);
  table.mount();
  wrapper._table = table;

  return { wrapper, h2, tableContainer, table };
}

export function addParagraph(
  wrapper: HTMLElement,
  text: string,
  beforeElement: Element | null = null,
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
  insertBefore: Element,
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
