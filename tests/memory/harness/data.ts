import type { HeaderObject, Row } from "simple-table-core";

export type StockRow = Row & {
  id: string;
  symbol: string;
  price: number;
  change: number;
  changePct: number;
  bid: number;
  ask: number;
  volume: number;
  high: number;
  low: number;
  history: number[];
};

const SYMBOL_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

function symbolFor(index: number): string {
  // Deterministic, collision-free 4-letter-ish ticker derived from the index.
  let n = index;
  let s = "";
  for (let i = 0; i < 4; i++) {
    s += SYMBOL_ALPHABET[n % 26];
    n = Math.floor(n / 26);
  }
  return s;
}

/**
 * Deterministic stock dataset. No randomness at generation time so heap
 * baselines are reproducible across runs; the workload (updateData bursts)
 * introduces the churn we actually want to measure.
 */
export function makeStockRows(count: number): StockRow[] {
  const rows: StockRow[] = [];
  for (let i = 0; i < count; i++) {
    const price = 50 + (i % 500);
    rows.push({
      id: `row-${i}`,
      symbol: symbolFor(i),
      price,
      change: 0,
      changePct: 0,
      bid: price - 0.05,
      ask: price + 0.05,
      volume: 1000 + i,
      high: price + 5,
      low: price - 5,
      history: Array.from({ length: 20 }, (_, k) => price + Math.sin(i + k)),
    });
  }
  return rows;
}

export const stockHeaders: HeaderObject[] = [
  { accessor: "symbol", label: "Symbol", width: 90, type: "string", sortable: true },
  { accessor: "price", label: "Price", width: 100, type: "number", sortable: true },
  { accessor: "change", label: "Chg", width: 90, type: "number", sortable: true },
  { accessor: "changePct", label: "Chg %", width: 90, type: "number", sortable: true },
  { accessor: "bid", label: "Bid", width: 90, type: "number" },
  { accessor: "ask", label: "Ask", width: 90, type: "number" },
  { accessor: "volume", label: "Volume", width: 110, type: "number", sortable: true },
  { accessor: "high", label: "High", width: 90, type: "number" },
  { accessor: "low", label: "Low", width: 90, type: "number" },
];

/** Accessors mutated by a single tick of the live-update workload. */
export const TICK_ACCESSORS = [
  "price",
  "change",
  "changePct",
  "bid",
  "ask",
  "volume",
] as const;
