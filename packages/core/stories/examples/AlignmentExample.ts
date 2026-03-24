/**
 * Alignment Example – vanilla port of React AlignmentExample.
 */
import { RETAIL_SALES_HEADERS } from "../data/retail-data";
import { generateRetailSalesData } from "../data/retail-data";
import { SimpleTableVanilla } from "../../src/index";
import { defaultVanillaArgs, type UniversalVanillaArgs } from "../vanillaStoryConfig";

type TableInstance = InstanceType<typeof SimpleTableVanilla>;

export const alignmentExampleDefaults = {
  columnResizing: true,
  columnReordering: true,
  selectableCells: true,
  selectableColumns: true,
  editColumns: true,
  height: "calc(100dvh - 112px)",
};

export function renderAlignmentExample(args?: Partial<UniversalVanillaArgs>): HTMLElement {
  const wrapper = document.createElement("div");
  wrapper.style.padding = "2rem";

  const btn = document.createElement("button");
  btn.textContent = "Export to CSV";
  btn.type = "button";
  btn.style.marginBottom = "1rem";
  wrapper.appendChild(btn);

  const tableContainer = document.createElement("div");
  wrapper.appendChild(tableContainer);

  const options = { ...defaultVanillaArgs, ...alignmentExampleDefaults, ...args };
  const table = new SimpleTableVanilla(tableContainer, {
    defaultHeaders: RETAIL_SALES_HEADERS,
    rows: generateRetailSalesData(),
    rowGrouping: ["stores"],
    getRowId: (params: { row?: { id?: unknown } }) => String(params.row?.id),
    ...options,
  });
  table.mount();
  (wrapper as HTMLDivElement & { _table?: TableInstance })._table = table;
  btn.addEventListener("click", () => table.getAPI().exportToCSV());

  return wrapper;
}
