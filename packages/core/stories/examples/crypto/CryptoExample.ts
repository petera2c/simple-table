/**
 * CryptoExample – vanilla port of the marketing crypto dashboard with a live
 * market-feed ticker (`updateData` on visible rows).
 */
import type { CellValue, Row, TableAPI } from "../../../src/index";
import { renderVanillaTable, addParagraph } from "../../utils";
import { defaultVanillaArgs, type UniversalVanillaArgs } from "../../vanillaStoryConfig";
import { generateCryptoData } from "./crypto-data";
import { getCryptoHeaders } from "./crypto-headers";

const TICK_MS = 90;
const ROWS_PER_TICK = 6;

export const cryptoExampleDefaults = {
  columnResizing: true,
  columnReordering: true,
  selectableCells: true,
  editColumns: true,
  cellUpdateFlash: true,
  height: "70dvh",
  customTheme: { headerHeight: 40, rowHeight: 64 },
};

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
 * Simulates a live market feed: each tick nudges price / 24h change / sparkline
 * on a few visible rows via `updateData` (cell flash + filter/sort recompute).
 */
function startCryptoTicker(getApi: () => TableAPI | null | undefined, rows: Row[]): () => void {
  let isActive = true;
  const idToIndex = new Map<string, number>();
  for (let i = 0; i < rows.length; i++) {
    idToIndex.set(String(rows[i]!.id), i);
  }

  const tick = () => {
    if (!isActive) return;
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
  };

  const intervalId = setInterval(tick, TICK_MS);
  return () => {
    isActive = false;
    clearInterval(intervalId);
  };
}

export function renderCryptoExample(args?: Partial<UniversalVanillaArgs>): HTMLElement {
  const options = { ...defaultVanillaArgs, ...cryptoExampleDefaults, ...args };
  const data = generateCryptoData(200);

  const { wrapper, h2, tableContainer, table } = renderVanillaTable(
    getCryptoHeaders(),
    data,
    {
      ...options,
      getRowId: (params: { row?: { id?: unknown } }) => String(params.row?.id),
    },
  );

  h2.textContent = "Crypto Market";
  addParagraph(
    wrapper,
    "Live market feed: visible rows update via TableAPI.updateData (price, 24h %, sparkline). Sort or filter a live column to see visibility/order stay in sync.",
    tableContainer,
  );

  const stopTicker = startCryptoTicker(() => table.getAPI(), data);
  const originalDestroy = table.destroy.bind(table);
  table.destroy = () => {
    stopTicker();
    originalDestroy();
  };

  // Storybook may tear down the canvas without calling destroy — stop the
  // interval when the wrapper leaves the document.
  const observer = new MutationObserver(() => {
    if (!document.body.contains(wrapper)) {
      stopTicker();
      observer.disconnect();
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });

  return wrapper;
}
