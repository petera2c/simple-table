import { useRef, useEffect } from "react";
import { SimpleTable } from "@simple-table/react";
import type { Theme, TableAPI, CellValue } from "@simple-table/react";
import { cryptoConfig, type CryptoCoin } from "./crypto.demo-data";
import "@simple-table/react/styles.css";

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

function applyRowPatch(
  api: TableAPI<CryptoCoin>,
  rowId: string,
  patch: Partial<CryptoCoin>,
) {
  for (const accessor of Object.keys(patch) as (keyof CryptoCoin)[]) {
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
    if (typeof rowId !== "string" || rowId === "") continue;
    const currentPrice = vr.row.price;
    if (typeof currentPrice !== "number") continue;
    const drift = (Math.random() - 0.5) * 0.012;
    const newPrice = Math.max(currentPrice * (1 + drift), currentPrice * 0.0001);
    const round = newPrice >= 1 ? 1e2 : 1e6;
    const newPriceRounded = Math.round(newPrice * round) / round;
    const currentChange = typeof vr.row.change24h === "number" ? vr.row.change24h : 0;
    const newChange = Math.round((currentChange + drift * 100) * 100) / 100;
    const history = vr.row.priceHistory;
    const patch: Partial<CryptoCoin> = { price: newPriceRounded, change24h: newChange };
    if (Array.isArray(history) && history.length > 0) {
      patch.priceHistory = [...history.slice(1), newPriceRounded];
    }
    applyRowPatch(api, rowId, patch);
  }
}

const CryptoDemo = ({ height = "70dvh", theme }: { height?: string | number; theme?: Theme }) => {
  const tableRef = useRef<TableAPI<CryptoCoin>>(null);
  useEffect(() => {
    const intervalId = setInterval(() => runTick(() => tableRef.current), TICK_MS);
    return () => clearInterval(intervalId);
  }, []);
  return (
    <SimpleTable<CryptoCoin>
      columns={cryptoConfig.headers}
      rows={cryptoConfig.rows}
      ref={tableRef}
      getRowId={({ row }) => row.id}
      height={height}
      theme={theme}
      columnReordering
      columnResizing
      enableColumnEditor
      selectableCells
      cellUpdateFlash
      customTheme={{ headerHeight: 40, rowHeight: 48 }}
    />
  );
};

export default CryptoDemo;
