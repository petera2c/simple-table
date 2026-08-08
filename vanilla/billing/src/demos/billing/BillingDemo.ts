import { SimpleTableVanilla } from "simple-table-core";
import type { Theme, ColumnDef, CellRenderer, Row, GetRowIdParams } from "simple-table-core";
import { billingConfig } from "./billing.demo-data";
import type { BillingRow } from "./billing.demo-data";
import "simple-table-core/styles.css";


const getRowId = ({ row }: GetRowIdParams<BillingRow>) => row.id;
export function renderBillingDemo(
  container: HTMLElement,
  options?: { height?: string | number; theme?: Theme },
): SimpleTableVanilla<BillingRow> {
  const nameRenderer: CellRenderer<BillingRow> = ({ row }) => {
    const d = row ;
    const name = d.name;
    if (d.type === "account") {
      const span = document.createElement("span");
      span.style.fontWeight = "600";
      span.textContent = name;
      return span;
    }
    return name;
  };

  const headers: ColumnDef<BillingRow>[] = billingConfig.headers.map((h) => {
    if (h.accessor === "name") {
      return { ...h, cellRenderer: nameRenderer };
    }
    return { ...h };
  });

  const table = new SimpleTableVanilla(container, {
    getRowId,
    columnReordering: true,
    columnResizing: true,
    columns: headers,
    enableColumnEditor: true,
    height: options?.height ?? "400px",
    initialSortColumn: "amount",
    initialSortDirection: "desc",
    rowGrouping: ["invoices", "charges"],
    rows: billingConfig.rows ,
    selectableCells: true,
    theme: options?.theme,
    oddColumnBackground: true,
  });

  return table;
}
