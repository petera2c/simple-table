/**
 * CryptoExample – vanilla port of the marketing crypto dashboard with a live
 * market-feed ticker (`updateData` on visible rows).
 */
import type { TableAPI } from "../../../src/index";
import { renderVanillaTable, addParagraph } from "../../utils";
import { defaultVanillaArgs, type UniversalVanillaArgs } from "../../vanillaStoryConfig";
import { generateCryptoData, type CryptoCoin } from "./crypto-data";
import { getCryptoHeaders } from "./crypto-headers";

const TICK_MS = 90;
const ROWS_PER_TICK = 6;

export const cryptoExampleDefaults = {
  columnResizing: true,
  columnReordering: true,
  selectableCells: true,
  enableColumnEditor: true,
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

/**
 * Simulates a live market feed: each tick nudges price / 24h change / sparkline
 * on a few visible rows via `updateData` (cell flash + filter/sort recompute).
 */
function startCryptoTicker(getApi: () => TableAPI<CryptoCoin> | null | undefined): () => void {
  let isActive = true;

  const tick = () => {
    if (!isActive) return;
    const api = getApi();
    if (!api) return;

    const visible = api.getVisibleRows();
    if (!visible.length) return;

    for (const vr of pickRandomSubset(visible, ROWS_PER_TICK)) {
      const row = vr.row;
      const rowId = row.id;
      if (typeof row.price !== "number") continue;

      const drift = (Math.random() - 0.5) * 0.012;
      const newPrice = Math.max(row.price * (1 + drift), row.price * 0.0001);
      const round = newPrice >= 1 ? 1e2 : 1e6;
      const newPriceRounded = Math.round(newPrice * round) / round;

      const currentChange = typeof row.change24h === "number" ? row.change24h : 0;
      const newChange = Math.round((currentChange + drift * 100) * 100) / 100;

      api.updateData({ accessor: "price", rowId, newValue: newPriceRounded });
      api.updateData({ accessor: "change24h", rowId, newValue: newChange });

      const history = row.priceHistory;
      if (Array.isArray(history) && history.length > 0) {
        api.updateData({
          accessor: "priceHistory",
          rowId,
          newValue: [...history.slice(1), newPriceRounded],
        });
      }
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

  const { wrapper, h2, tableContainer, table } = renderVanillaTable<CryptoCoin>(
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

  const stopTicker = startCryptoTicker(() => table.getAPI());
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
