/**
 * ClipboardFormatting Example – vanilla port of React ClipboardFormattingExample.
 */
import { renderVanillaTable } from "../utils";
import { createBasicData } from "./BasicExample";

const HEADERS: Record<string, unknown>[] = [
  { accessor: "id", label: "ID", width: 80 },
  { accessor: "name", label: "Name", width: 150 },
  { accessor: "age", label: "Age", width: 100 },
  { accessor: "role", label: "Role", width: 150 },
];

export function renderClipboardFormattingExample(): HTMLElement {
  const { wrapper, h2 } = renderVanillaTable(HEADERS, createBasicData(20), {
    height: "400px",
    getRowId: (params: { row?: { id?: unknown } }) => String(params.row?.id),
  });
  h2.textContent = "Clipboard Formatting";
  return wrapper;
}
