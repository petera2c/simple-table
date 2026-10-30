<script lang="ts">
  import { SimpleTable } from "@simple-table/svelte";
  import type { Theme, SvelteColumnDef, GetRowIdParams } from "@simple-table/svelte";
  import { billingConfig } from "./billing.demo-data";
  import type { BillingRow } from "./billing.demo-data";
  import BillingNameCell from "./BillingNameCell.svelte";
  import "@simple-table/svelte/styles.css";

  let { height = "400px", theme }: { height?: string | number; theme?: Theme } = $props();

  const headers: SvelteColumnDef<BillingRow>[] = billingConfig.headers.map((h) => {
    if (h.accessor === "name") {
      return { ...h, cellRenderer: BillingNameCell };
    }
    return { ...h };
  });

  const getRowId = ({ row }: GetRowIdParams<BillingRow>) => row.id;
</script>

<SimpleTable
  autoExpandColumns={true}
  columnReordering={true}
  columnResizing={true}
  columns={headers}
  enableColumnEditor={true}
  {getRowId}
  {height}
  initialSortColumn="amount"
  initialSortDirection="desc"
  rowGrouping={["invoices", "charges"]}
  rows={billingConfig.rows}
  selectableCells={true}
  {theme}
  oddColumnBackground={true}
/>
