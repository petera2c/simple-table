import { SimpleTableVanilla } from "simple-table-core";
import type { CryptoCoin } from "./crypto.demo-data";
import type { Theme, TableAPI, GetRowIdParams } from "simple-table-core";
import { cryptoConfig } from "./crypto.demo-data";
import "simple-table-core/styles.css";

const TICK_MS = 90;
const ROWS_PER_TICK = 6;

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

const getRowId = ({ row }: GetRowIdParams<CryptoCoin>) => row.id;

function runTick(getApi: () => TableAPI<CryptoCoin> | null | undefined) {
  const api = getApi();
  if (!api) return;
  const visible = api.getVisibleRows();
  if (!visible.length) return;
  for (const vr of pickRandomSubset(visible, ROWS_PER_TICK)) {
    const row = vr.row;
    const rowId = row.id;
    const drift = (Math.random() - 0.5) * 0.012;
    const newPrice = Math.max(row.price * (1 + drift), row.price * 0.0001);
    const round = newPrice >= 1 ? 1e2 : 1e6;
    const newPriceRounded = Math.round(newPrice * round) / round;
    const newChange = Math.round((row.change24h + drift * 100) * 100) / 100;
    api.updateData({ accessor: "price", rowId, newValue: newPriceRounded });
    api.updateData({ accessor: "change24h", rowId, newValue: newChange });
    if (row.priceHistory.length > 0) {
      api.updateData({
        accessor: "priceHistory",
        rowId,
        newValue: [...row.priceHistory.slice(1), newPriceRounded],
      });
    }
  }
}

export function renderCryptoDemo(
  container: HTMLElement,
  options?: { height?: string | number; theme?: Theme }
): SimpleTableVanilla<CryptoCoin> {
  const table = new SimpleTableVanilla<CryptoCoin>(container, {
    columns: cryptoConfig.headers,
    rows: cryptoConfig.rows,
    getRowId,
    height: options?.height ?? "70dvh",
    theme: options?.theme,
    columnReordering: true,
    columnResizing: true,
    enableColumnEditor: true,
    selectableCells: true,
    cellUpdateFlash: true,
    customTheme: { headerHeight: 40, rowHeight: 48 },
  });

  const intervalId = setInterval(() => runTick(() => table.getAPI()), TICK_MS);
  const originalDestroy = table.destroy.bind(table);
  table.destroy = () => {
    clearInterval(intervalId);
    originalDestroy();
  };

  return table;
}
