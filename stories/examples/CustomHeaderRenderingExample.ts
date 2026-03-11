/**
 * CustomHeaderRendering Example – vanilla port of React CustomHeaderRenderingExample.
 */
import type { HeaderObject, Row } from "../../src/index";
import { renderVanillaTable } from "../utils";

const HEADERS: HeaderObject[] = [
  {
    accessor: "id",
    label: "ID",
    width: 80,
    headerRenderer: () => {
      const el = document.createElement("div");
      el.textContent = "Custom ID";
      el.style.fontWeight = "bold";
      return el;
    },
  },
  { accessor: "name", label: "Name", width: 150 },
  { accessor: "role", label: "Role", width: 120 },
];

const ROWS: Row[] = [
  { id: 1, name: "Alice", role: "Dev" },
  { id: 2, name: "Bob", role: "Design" },
];

export function renderCustomHeaderRenderingExample(): HTMLElement {
  const { wrapper, h2 } = renderVanillaTable(HEADERS, ROWS, {
    getRowId: (params: { row?: { id?: unknown } }) => String(params.row?.id),
  });
  h2.textContent = "Custom Header Rendering";
  return wrapper;
}
