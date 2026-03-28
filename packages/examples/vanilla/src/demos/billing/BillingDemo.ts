import { SimpleTableVanilla } from "simple-table-core";
import type { Theme, HeaderObject, CellRenderer, Row } from "simple-table-core";
import { billingConfig } from "@simple-table/examples-shared";
import type { BillingRow } from "@simple-table/examples-shared";
import "simple-table-core/styles.css";

export function renderBillingDemo(
  container: HTMLElement,
  options?: { height?: string | number; theme?: Theme },
): SimpleTableVanilla {
  const nameRenderer: CellRenderer = ({ row }) => {
    const d = row as unknown as BillingRow;
    const name = d.name;
    if (d.type === "account") {
      const span = document.createElement("span");
      span.style.fontWeight = "600";
      span.textContent = name;
      return span;
    }
    return name;
  };

  const headers: HeaderObject[] = billingConfig.headers.map((h) => {
    if (h.accessor === "name") {
      return { ...h, cellRenderer: nameRenderer };
    }
    return { ...h };
  });

  const table = new SimpleTableVanilla(container, {
    columnReordering: true,
    columnResizing: true,
    defaultHeaders: headers,
    editColumns: true,
    height: options?.height ?? "400px",
    initialSortColumn: "amount",
    initialSortDirection: "desc",
    rowGrouping: ["invoices", "charges"],
    rows: billingConfig.rows as unknown as Row[],
    selectableCells: true,
    theme: options?.theme,
    useOddColumnBackground: true,
  });

  return table;
}
