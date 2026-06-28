import { useEffect, RefObject } from "react";
import type { TableAPI, Row, CellValue } from "@simple-table/react";

/** Throttled below the frame budget so ticks and scrolling rarely share a rAF. */
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

/**
 * Simulates a live market feed: each tick nudges the price of a few visible
 * coins, recomputes the 24h change, and pushes a new point onto the sparkline
 * history. Uses `updateData` so only the affected cells re-render (and flash).
 */
export function useCryptoTicker(tableRef: RefObject<TableAPI>, data: Row[]) {
  useEffect(() => {
    let isActive = true;
    const idToIndex = new Map<string, number>();
    for (let i = 0; i < data.length; i++) {
      idToIndex.set(String(data[i]!.id), i);
    }

    const tick = () => {
      if (!isActive) return;
      const api = tableRef.current;
      if (!api) return;

      const visible = api.getVisibleRows();
      if (!visible.length) return;

      for (const vr of pickRandomSubset(visible, ROWS_PER_TICK)) {
        const idx = idToIndex.get(String(vr.row.id));
        if (idx === undefined) continue;

        const currentPrice = vr.row.price as number;
        if (typeof currentPrice !== "number") continue;

        const drift = (Math.random() - 0.5) * 0.012; // +/- 0.6% per tick
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
    };

    const intervalId = setInterval(tick, TICK_MS);
    return () => {
      isActive = false;
      clearInterval(intervalId);
    };
  }, [tableRef, data]);
}
