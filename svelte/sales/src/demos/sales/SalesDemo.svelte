<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { SimpleTable } from "@simple-table/svelte";
  import type { Theme, SvelteHeaderObject, CellChangeProps, Row } from "@simple-table/svelte";
  import { salesHeadersCore, salesSampleRows } from "./sales.demo-data";
  import SalesDealValueCell from "./SalesDealValueCell.svelte";
  import SalesIsWonCell from "./SalesIsWonCell.svelte";
  import SalesCommissionCell from "./SalesCommissionCell.svelte";
  import SalesProfitMarginCell from "./SalesProfitMarginCell.svelte";
  import SalesDealProfitCell from "./SalesDealProfitCell.svelte";
  import "@simple-table/svelte/styles.css";

  let { height, theme }: { height?: string | number | null; theme?: Theme } = $props();

  function formatTableHeight(h?: string | number | null): string {
    if (h == null) return "70dvh";
    if (typeof h === "number") return `${h}px`;
    return h;
  }

  const renderers: Record<string, unknown> = {
    dealValue: SalesDealValueCell,
    isWon: SalesIsWonCell,
    commission: SalesCommissionCell,
    profitMargin: SalesProfitMarginCell,
    dealProfit: SalesDealProfitCell,
  };

  function applyCellComponents(hdrs: SvelteHeaderObject[]): SvelteHeaderObject[] {
    return hdrs.map((h) => ({
      ...h,
      ...(renderers[h.accessor as string] ? { cellRenderer: renderers[h.accessor as string] } : {}),
      ...(h.children ? { children: applyCellComponents(h.children as SvelteHeaderObject[]) } : {}),
    }));
  }

  const headers = $derived(
    applyCellComponents(JSON.parse(JSON.stringify(salesHeadersCore)) as SvelteHeaderObject[]),
  );

  let data = $state<Row[]>(salesSampleRows.map((r) => ({ ...r })) as Row[]);
  let isMobile = $state(false);

  function checkMobile() {
    isMobile = window.innerWidth < 768;
  }

  onMount(() => {
    checkMobile();
    window.addEventListener("resize", checkMobile);
  });

  onDestroy(() => {
    window.removeEventListener("resize", checkMobile);
  });

  function handleCellEdit({ accessor, newValue, row }: CellChangeProps) {
    data = data.map((item) => (item.id === row.id ? { ...item, [accessor]: newValue } : item)) as Row[];
  }
</script>

<SimpleTable
  defaultHeaders={headers}
  rows={data}
  height={formatTableHeight(height)}
  {theme}
  autoExpandColumns={!isMobile}
  editColumns={true}
  selectableCells={true}
  columnResizing={true}
  columnReordering={true}
  initialSortColumn="dealValue"
  initialSortDirection="desc"
  onCellEdit={handleCellEdit}
/>
