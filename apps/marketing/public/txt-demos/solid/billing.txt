import { SimpleTable } from "@simple-table/solid";
import type { Theme, SolidHeaderObject } from "@simple-table/solid";
import { billingConfig } from "@simple-table/examples-shared";
import type { BillingRow } from "@simple-table/examples-shared";
import "@simple-table/solid/styles.css";

export default function BillingDemo(props: { height?: string | number; theme?: Theme }) {
  const headers: SolidHeaderObject[] = billingConfig.headers.map((h) => {
    if (h.accessor === "name") {
      return {
        ...h,
        cellRenderer: ({ row }) => {
          const d = row as unknown as BillingRow;
          return <div class={d.type === "account" ? "font-semibold" : ""}>{d.name}</div>;
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
      height={props.height ?? "400px"}
      initialSortColumn="amount"
      initialSortDirection="desc"
      rowGrouping={["invoices", "charges"]}
      rows={billingConfig.rows}
      selectableCells
      theme={props.theme}
      useOddColumnBackground
    />
  );
}
