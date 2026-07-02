import { SimpleTable } from "@simple-table/react";
import type { Theme, ReactHeaderObject, CellRendererProps } from "@simple-table/react";
import { billingConfig } from "./billing.demo-data";
import type { BillingRow } from "./billing.demo-data";
import "@simple-table/react/styles.css";

const BillingDemo = ({ height = "400px", theme }: { height?: string | number; theme?: Theme }) => {
  const headers: ReactHeaderObject[] = billingConfig.headers.map((h) => {
    if (h.accessor === "name") {
      return {
        ...h,
        cellRenderer: ({ row: r }: CellRendererProps) => {
          const d = r as unknown as BillingRow;
          return <div className={d.type === "account" ? "font-semibold" : ""}>{d.name}</div>;
        },
      };
    }
    return h;
  });

  return (
    <SimpleTable
      columnReordering
      columnResizing
      defaultHeaders={headers}
      editColumns
      height={height}
      initialSortColumn="amount"
      initialSortDirection="desc"
      rowGrouping={["invoices", "charges"]}
      rows={billingConfig.rows}
      selectableCells
      theme={theme}
      useOddColumnBackground
    />
  );
};

export default BillingDemo;
