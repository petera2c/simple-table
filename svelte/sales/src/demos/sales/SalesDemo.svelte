<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { SimpleTable } from "@simple-table/svelte";
  import type {
    Theme,
    SvelteColumnDef,
    SvelteCellRenderer,
    CellChangeProps,
    GetRowIdParams,
  } from "@simple-table/svelte";
  import { salesHeadersCore, salesSampleRows } from "./sales.demo-data";
  import type { SalesRow } from "./sales.demo-data";
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

  const renderers: Partial<Record<string, SvelteCellRenderer<SalesRow>>> = {
    dealValue: SalesDealValueCell,
    isWon: SalesIsWonCell,
    commission: SalesCommissionCell,
    profitMargin: SalesProfitMarginCell,
    dealProfit: SalesDealProfitCell,
  };

  function applyCellComponents(hdrs: SvelteColumnDef<SalesRow>[]): SvelteColumnDef<SalesRow>[] {
    return hdrs.map((h) => {
      const cellRenderer = renderers[String(h.accessor)];
      return {
        ...h,
        ...(cellRenderer ? { cellRenderer } : {}),
        ...(h.children ? { children: applyCellComponents(h.children) } : {}),
      };
    });
  }

  const headers = $derived(applyCellComponents(salesHeadersCore));

  let data = $state<SalesRow[]>(salesSampleRows.map((r) => ({ ...r })));
  let isMobile = $state(false);

  const getRowId = ({ row }: GetRowIdParams<SalesRow>) => row.id;

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

  function handleCellEdit({ accessor, newValue, row }: CellChangeProps<SalesRow>) {
    data = data.map((item) => (item.id === row.id ? { ...item, [accessor]: newValue } : item));
  }
</script>

<SimpleTable
  columns={headers}
  rows={data}
  {getRowId}
  height={formatTableHeight(height)}
  {theme}
  autoExpandColumns={!isMobile}
  enableColumnEditor={true}
  selectableCells={true}
  columnResizing={true}
  columnReordering={true}
  initialSortColumn="dealValue"
  initialSortDirection="desc"
  onCellEdit={handleCellEdit}
/>
