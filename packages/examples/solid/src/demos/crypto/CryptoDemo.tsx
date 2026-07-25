import { onMount, onCleanup } from "solid-js";
import { SimpleTable } from "@simple-table/solid";
import type { Theme, TableAPI, Row, CellValue } from "@simple-table/solid";
import { cryptoConfig, cryptoData } from "./crypto.demo-data";
import "@simple-table/solid/styles.css";

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

function applyRowPatch(api: TableAPI, rowIndex: number, patch: Partial<Row>) {
  for (const accessor of Object.keys(patch)) {
    const newValue = patch[accessor];
    if (newValue === undefined) continue;
    api.updateData({ accessor, rowIndex, newValue: newValue as CellValue });
  }
}

function runTick(getApi: () => TableAPI | null | undefined, idToIndex: Map<string, number>) {
  const api = getApi();
  if (!api) return;
  const visible = api.getVisibleRows();
  if (!visible.length) return;
  for (const vr of pickRandomSubset(visible, ROWS_PER_TICK)) {
    const idx = idToIndex.get(String(vr.row.id));
    if (idx === undefined) continue;
    const currentPrice = vr.row.price as number;
    if (typeof currentPrice !== "number") continue;
    const drift = (Math.random() - 0.5) * 0.012;
    const newPrice = Math.max(currentPrice * (1 + drift), currentPrice * 0.0001);
    const round = newPrice >= 1 ? 1e2 : 1e6;
    const newPriceRounded = Math.round(newPrice * round) / round;
    const currentChange = (vr.row.change24h as number) ?? 0;
    const newChange = Math.round((currentChange + drift * 100) * 100) / 100;
    const history = vr.row.priceHistory as number[];
    const patch: Partial<Row> = { price: newPriceRounded, change24h: newChange };
    if (Array.isArray(history) && history.length > 0) {
      patch.priceHistory = [...history.slice(1), newPriceRounded];
    }
    applyRowPatch(api, idx, patch);
  }
}

export default function CryptoDemo(props: { height?: string | number; theme?: Theme }) {
  let tableRef: TableAPI | undefined;
  let cleanupFn: (() => void) | undefined;

  onMount(() => {
    const idToIndex = new Map<string, number>();
    for (let i = 0; i < cryptoData.length; i++) idToIndex.set(String(cryptoData[i]!.id), i);
    const intervalId = setInterval(() => runTick(() => tableRef ?? null, idToIndex), TICK_MS);
    cleanupFn = () => clearInterval(intervalId);
  });
  onCleanup(() => cleanupFn?.());

  return (
    <SimpleTable
      ref={(api) => (tableRef = api)}
      columns={cryptoConfig.headers}
      rows={cryptoConfig.rows}
      height={props.height ?? "70dvh"}
      theme={props.theme}
      columnReordering
      columnResizing
      enableColumnEditor
      selectableCells
      cellUpdateFlash
      customTheme={{ headerHeight: 40, rowHeight: 48 }}
    />
  );
}
