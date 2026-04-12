<script lang="ts">
  import { SimpleTable } from "@simple-table/svelte";
  import type { Theme, HeaderObject, CellRenderer, Row } from "@simple-table/svelte";
  import { billingConfig } from "./billing.demo-data";
  import type { BillingRow } from "./billing.demo-data";
  import "@simple-table/svelte/styles.css";

  let { height = "400px", theme }: { height?: string | number; theme?: Theme } = $props();

  const nameRenderer: CellRenderer = ({ row }) => {
    const d = row as unknown as BillingRow;
    if (d.type === "account") {
      const span = document.createElement("span");
      span.style.fontWeight = "600";
      span.textContent = d.name;
      return span;
    }
    return d.name;
  };

  const headers: HeaderObject[] = billingConfig.headers.map((h) => {
    if (h.accessor === "name") {
      return { ...h, cellRenderer: nameRenderer };
    }
    return { ...h };
  });
</script>

<SimpleTable
  columnReordering={true}
  columnResizing={true}
  defaultHeaders={headers}
  editColumns={true}
  {height}
  initialSortColumn="amount"
  initialSortDirection="desc"
  rowGrouping={["invoices", "charges"]}
  rows={billingConfig.rows as unknown as Row[]}
  selectableCells={true}
  {theme}
  useOddColumnBackground={true}
/>
