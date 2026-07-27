import { useEffect, RefObject } from "react";
import type { TableAPI } from "@simple-table/react";
import type { CryptoCoin } from "./useCryptoData";

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

/**
 * Simulates a live market feed: each tick nudges the price of a few visible
 * coins, recomputes the 24h change, and pushes a new point onto the sparkline
 * history. Uses `updateData` so only the affected cells re-render (and flash).
 */
export function useCryptoTicker(
  tableRef: RefObject<TableAPI<CryptoCoin> | null>,
  _data: CryptoCoin[],
) {
  useEffect(() => {
    let isActive = true;

    const tick = () => {
      if (!isActive) return;
      const api = tableRef.current;
      if (!api) return;

      const visible = api.getVisibleRows();
      if (!visible.length) return;

      for (const vr of pickRandomSubset(visible, ROWS_PER_TICK)) {
        const row = vr.row;
        const rowId = row.id;

        const drift = (Math.random() - 0.5) * 0.012; // +/- 0.6% per tick
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
    };

    const intervalId = setInterval(tick, TICK_MS);
    return () => {
      isActive = false;
      clearInterval(intervalId);
    };
  }, [tableRef]);
}
