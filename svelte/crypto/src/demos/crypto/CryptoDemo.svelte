<script lang="ts">
  import { SimpleTable } from "@simple-table/svelte";
  import type { Theme, TableAPI, CellValue, GetRowIdParams } from "@simple-table/svelte";
  import { cryptoConfig } from "./crypto.demo-data";
  import type { CryptoCoin } from "./crypto.demo-data";
  import "@simple-table/svelte/styles.css";

  let { height = "70dvh", theme }: { height?: string | number; theme?: Theme } = $props();
  let tableRef = $state<{ getAPI: () => TableAPI<CryptoCoin> | null } | null>(null);

  const TICK_MS = 90;
  const ROWS_PER_TICK = 6;

  const getRowId = ({ row }: GetRowIdParams<CryptoCoin>) => row.id;

  function pickRandomSubset<T>(arr: T[], n: number): T[] {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const t = copy[i]!;
      copy[i] = copy[j]!;
      copy[j] = t;
    }
    return copy.slice(0, Math.min(n, copy.length));
  }

  function applyRowPatch(api: TableAPI<CryptoCoin>, rowId: string | number, patch: Partial<CryptoCoin>) {
    for (const accessor of Object.keys(patch) as Array<keyof CryptoCoin>) {
      const newValue = patch[accessor];
      if (newValue === undefined) continue;
      api.updateData({ accessor, rowId, newValue: newValue as CellValue });
    }
  }

  function runTick(getApi: () => TableAPI<CryptoCoin> | null | undefined) {
    const api = getApi();
    if (!api) return;
    const visible = api.getVisibleRows();
    if (!visible.length) return;
    for (const vr of pickRandomSubset(visible, ROWS_PER_TICK)) {
      const rowId = vr.row.id;
      const drift = (Math.random() - 0.5) * 0.012;
      const newPrice = Math.max(vr.row.price * (1 + drift), vr.row.price * 0.0001);
      const round = newPrice >= 1 ? 1e2 : 1e6;
      const newPriceRounded = Math.round(newPrice * round) / round;
      const newChange = Math.round((vr.row.change24h + drift * 100) * 100) / 100;
      const patch: Partial<CryptoCoin> = { price: newPriceRounded, change24h: newChange };
      if (vr.row.priceHistory.length > 0) {
        patch.priceHistory = [...vr.row.priceHistory.slice(1), newPriceRounded];
      }
      applyRowPatch(api, rowId, patch);
    }
  }

  $effect(() => {
    if (!tableRef) return;
    const intervalId = setInterval(() => runTick(() => tableRef?.getAPI() ?? null), TICK_MS);
    return () => clearInterval(intervalId);
  });
</script>

<SimpleTable
  autoExpandColumns={true}
  bind:this={tableRef}
  columns={cryptoConfig.headers}
  rows={cryptoConfig.rows}
  {getRowId}
  {height}
  {theme}
  columnReordering
  columnResizing
  enableColumnEditor
  selectableCells
  cellUpdateFlash
  customTheme={{ headerHeight: 40, rowHeight: 48 }}
/>
