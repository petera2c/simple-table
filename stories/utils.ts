/**
 * Shared helpers for vanilla stories (examples and tests).
 */
import { SimpleTableVanilla } from "../dist/index.es.js";

/** Instance type of the table (class is a value; use InstanceType<typeof C> for the type of instances). */
type TableInstance = InstanceType<typeof SimpleTableVanilla>;

export interface RenderVanillaTableResult {
  wrapper: HTMLDivElement & { _table?: TableInstance };
  h2: HTMLHeadingElement;
  tableContainer: HTMLDivElement;
  table: TableInstance;
}

export function renderVanillaTable(
  headers: Record<string, unknown>[],
  data: Record<string, unknown>[],
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
