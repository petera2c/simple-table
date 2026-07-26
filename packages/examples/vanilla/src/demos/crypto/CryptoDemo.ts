import { SimpleTableVanilla } from "simple-table-core";
import type { CryptoCoin } from "./crypto.demo-data";
import type { Theme, TableAPI, Row, CellValue, GetRowIdParams } from "simple-table-core";
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

function applyRowPatch(api: TableAPI, rowId: string | number, patch: Partial<CryptoCoin>) {
  for (const accessor of Object.keys(patch) as Array<keyof CryptoCoin>) {
    const newValue = patch[accessor];
    if (newValue === undefined) continue;
    api.updateData({ accessor, rowId, newValue: newValue as CellValue });
  }
}

function runTick(getApi: () => TableAPI | null | undefined) {
  const api = getApi();
  if (!api) return;
  const visible = api.getVisibleRows();
  if (!visible.length) return;
  for (const vr of pickRandomSubset(visible, ROWS_PER_TICK)) {
    const row = vr.row;
    const rowId = row.id;
    if (typeof rowId !== "string" && typeof rowId !== "number") continue;
    if (rowId === "") continue;
    if (typeof row.price !== "number") continue;
    const drift = (Math.random() - 0.5) * 0.012;
    const newPrice = Math.max(row.price * (1 + drift), row.price * 0.0001);
    const round = newPrice >= 1 ? 1e2 : 1e6;
    const newPriceRounded = Math.round(newPrice * round) / round;
    const currentChange = typeof row.change24h === "number" ? row.change24h : 0;
    const newChange = Math.round((currentChange + drift * 100) * 100) / 100;
    const patch: Partial<CryptoCoin> = { price: newPriceRounded, change24h: newChange };
    const history = row.priceHistory;
    if (Array.isArray(history) && history.length > 0) {
      patch.priceHistory = [...history.slice(1), newPriceRounded];
    }
    applyRowPatch(api, rowId, patch);
  }
}

export function renderCryptoDemo(
  container: HTMLElement,
  options?: { height?: string | number; theme?: Theme }
): SimpleTableVanilla<CryptoCoin> {
  const table = new SimpleTableVanilla(container, {
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
