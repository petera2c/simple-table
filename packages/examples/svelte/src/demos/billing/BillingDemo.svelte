<script lang="ts">
  import { SimpleTable } from "@simple-table/svelte";
  import type { Theme, HeaderObject, Row } from "@simple-table/svelte";
  import { billingConfig } from "./billing.demo-data";
  import BillingNameCell from "./BillingNameCell.svelte";
  import "@simple-table/svelte/styles.css";

  let { height = "400px", theme }: { height?: string | number; theme?: Theme } = $props();

  const headers: HeaderObject[] = billingConfig.headers.map((h) => {
    if (h.accessor === "name") {
      return { ...h, cellRenderer: BillingNameCell };
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
