import { SimpleTable } from "@simple-table/solid";
import type { Theme, SolidColumnDef, CellRendererProps } from "@simple-table/solid";
import { billingConfig } from "./billing.demo-data";
import type { BillingRow } from "./billing.demo-data";
import "@simple-table/solid/styles.css";

export default function BillingDemo(props: { height?: string | number; theme?: Theme }) {
  const headers: SolidColumnDef<BillingRow>[] = billingConfig.headers.map((h) => {
    if (h.accessor === "name") {
      return {
        ...h,
        cellRenderer: ({ row }: CellRendererProps<BillingRow>) => (
          <div class={row.type === "account" ? "font-semibold" : ""}>{row.name}</div>
        ),
      };
    }
    return h;
  });

  return (
    <SimpleTable
      columnReordering
      columnResizing
      columns={headers}
      enableColumnEditor
      getRowId={({ row }) => row.id}
      height={props.height ?? "400px"}
      initialSortColumn="amount"
      initialSortDirection="desc"
      rowGrouping={["invoices", "charges"]}
      rows={billingConfig.rows}
      selectableCells
      theme={props.theme}
      oddColumnBackground
    />
  );
}
