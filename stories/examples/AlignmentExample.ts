/**
 * Alignment Example – vanilla port of React AlignmentExample.
 */
import { RETAIL_SALES_HEADERS } from "../data/retail-data";
import { generateRetailSalesData } from "../data/retail-data";
import { SimpleTableVanilla } from "../../src/index";

type TableInstance = InstanceType<typeof SimpleTableVanilla>;

export function renderAlignmentExample(): HTMLElement {
  const wrapper = document.createElement("div");
  wrapper.style.padding = "2rem";

  const btn = document.createElement("button");
  btn.textContent = "Export to CSV";
  btn.type = "button";
  btn.style.marginBottom = "1rem";
  wrapper.appendChild(btn);

  const tableContainer = document.createElement("div");
  wrapper.appendChild(tableContainer);

  const table = new SimpleTableVanilla(tableContainer, {
    defaultHeaders: RETAIL_SALES_HEADERS,
    rows: generateRetailSalesData(),
    rowGrouping: ["stores"],
    height: "calc(100dvh - 112px)",
    getRowId: (params: { row?: { id?: unknown } }) => String(params.row?.id),
    columnResizing: true,
    columnReordering: true,
    selectableCells: true,
    selectableColumns: true,
    editColumns: true,
  });
  table.mount();
  (wrapper as HTMLDivElement & { _table?: TableInstance })._table = table;
  btn.addEventListener("click", () => table.getAPI().exportToCSV());

  return wrapper;
}
