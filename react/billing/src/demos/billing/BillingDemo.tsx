import { SimpleTable } from "@simple-table/react";
import type { Theme, ReactColumnDef } from "@simple-table/react";
import { billingConfig } from "./billing.demo-data";
import type { BillingRow } from "./billing.demo-data";
import "@simple-table/react/styles.css";

const BillingDemo = ({ height = "400px", theme }: { height?: string | number; theme?: Theme }) => {
  const headers: ReactColumnDef<BillingRow>[] = billingConfig.headers.map((h) => {
    if (h.accessor === "name") {
      return {
        ...h,
        cellRenderer: ({ row }) => (
          <div className={row.type === "account" ? "font-semibold" : ""}>{row.name}</div>
        )
      };
    }
    return h;
  });

  return (
    <SimpleTable
      autoExpandColumns
      columnReordering
      columnResizing
      columns={headers}
      enableColumnEditor
      getRowId={({ row }) => row.id}
      height={height}
      initialSortColumn="amount"
      initialSortDirection="desc"
      rowGrouping={["invoices", "charges"]}
      rows={billingConfig.rows}
      selectableCells
      theme={theme}
      oddColumnBackground
    />
  );
};

export default BillingDemo;
