/**
 * InfluencersExample – vanilla port of React InfluencersDemo.
 *
 * Chartmetric influencers stress replica:
 * - Nested headers (~5560px main width)
 * - Custom DOM cell/header renderers
 * - excludeFromRender + width: 150 repro column (`id`)
 * - autoExpandColumns, column editor, resize/reorder
 * - footerPosition top
 * - Infinite scroll: initial 26 rows, fetch +26 near bottom
 * - Skeleton placeholder rows while the next page loads
 * - rowHeight 90, headerHeight 36
 */
import { SimpleTableVanilla } from "../../../src/index";
import type { FooterRendererProps, Row } from "../../../src/index";
import { defaultVanillaArgs, type UniversalVanillaArgs } from "../../vanillaStoryConfig";
import { generateInfluencerData } from "./influencers-data";
import {
  buildInfluencerHeaders,
  countLoadedRows,
  createSkeletonRows,
  isSkeletonRow,
  type InfluencerRow,
} from "./influencers-headers";

const INITIAL_BATCH = 26;
const BATCH_SIZE = 26;
const TOTAL_INFLUENCERS = 520;
const LOAD_DELAY_MS = 450;

export const influencersExampleDefaults: Partial<UniversalVanillaArgs> = {
  columnReordering: true,
  columnResizing: true,
  autoExpandColumns: true,
  enableColumnEditor: true,
  theme: "modern-light",
  customTheme: {
    headerHeight: 36,
    rowHeight: 90,
  },
  height: "90dvh",
};

function createFooter(loaded: number, total: number, loading: boolean): HTMLElement {
  const wrap = document.createElement("div");
  Object.assign(wrap.style, {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "10px 16px",
    fontSize: "13px",
    color: "#475569",
    background: "#f8fafc",
    borderBottom: "1px solid #e2e8f0",
    height: "49px",
    boxSizing: "border-box",
  });

  const left = document.createElement("span");
  left.style.fontWeight = "600";
  left.textContent = `Showing 1–${loaded} of ${total.toLocaleString()} influencers`;
  if (loading) {
    const loadingEl = document.createElement("span");
    Object.assign(loadingEl.style, {
      fontWeight: "400",
      color: "#64748b",
      marginLeft: "8px",
    });
    loadingEl.textContent = "Loading…";
    left.appendChild(loadingEl);
  }
  wrap.appendChild(left);

  const right = document.createElement("span");
  right.style.color = "#64748b";
  right.textContent = "Chartmetric stress replica · infinite scroll";
  wrap.appendChild(right);

  return wrap;
}

export function renderInfluencersExample(args?: Partial<UniversalVanillaArgs>): HTMLElement {
  const options = { ...defaultVanillaArgs, ...influencersExampleDefaults, ...args };

  const wrapper = document.createElement("div");
  Object.assign(wrapper.style, {
    display: "flex",
    flexDirection: "column",
    height: typeof options.height === "number" ? `${options.height}px` : (options.height ?? "90dvh"),
    boxSizing: "border-box",
    padding: "1rem",
    background: "#fff",
  });

  const h2 = document.createElement("h2");
  h2.style.margin = "0 0 0.75rem";
  h2.textContent = "Influencers";
  wrapper.appendChild(h2);

  const tableContainer = document.createElement("div");
  Object.assign(tableContainer.style, { flex: "1", minHeight: "0" });
  wrapper.appendChild(tableContainer);

  let rows: InfluencerRow[] = generateInfluencerData(0, INITIAL_BATCH);
  let loading = false;
  let loadingGuard = false;

  // Stable renderer: closes over `rows` / `loading`. Core busts the custom-footer
  // cache on `update({ rows })`, and `footerRenderKey` covers the loading flag
  // when row count is unchanged (skeleton swap → real data).
  const footerRenderer = (_props: FooterRendererProps): HTMLElement =>
    createFooter(countLoadedRows(rows), TOTAL_INFLUENCERS, loading);

  const table = new SimpleTableVanilla(tableContainer, {
    columns: buildInfluencerHeaders(),
    rows: rows as Row[],
    getRowId: (p) => String((p.row as InfluencerRow | undefined)?.id),
    theme: options.theme,
    customTheme: options.customTheme,
    height: "100%",
    columnReordering: options.columnReordering,
    columnResizing: options.columnResizing,
    autoExpandColumns: options.autoExpandColumns,
    enableColumnEditor: options.enableColumnEditor,
    enableColumnEditorInitOpen: options.enableColumnEditorInitOpen,
    columnEditorConfig: {
      text: "All Columns",
      searchEnabled: true,
      searchPlaceholder: "Search columns",
    },
    footerPosition: "top",
    footerRenderer,
    footerRenderKey: "idle",
    infiniteScrollThreshold: 200,
    onLoadMore: () => {
      const loaded = countLoadedRows(rows);
      if (loadingGuard || loaded >= TOTAL_INFLUENCERS) return;
      loadingGuard = true;
      loading = true;

      const remaining = TOTAL_INFLUENCERS - loaded;
      const batch = Math.min(BATCH_SIZE, remaining);
      const withoutSkeletons = rows.filter((row) => !isSkeletonRow(row));
      rows = [...withoutSkeletons, ...createSkeletonRows(loaded, batch)];
      table.update({
        rows: rows as Row[],
        footerRenderKey: "loading",
      });

      window.setTimeout(() => {
        const clean = rows.filter((row) => !isSkeletonRow(row));
        const stillRemaining = TOTAL_INFLUENCERS - clean.length;
        if (stillRemaining > 0) {
          const nextBatch = Math.min(BATCH_SIZE, stillRemaining);
          rows = [...clean, ...generateInfluencerData(clean.length, nextBatch)];
        } else {
          rows = clean;
        }
        loading = false;
        loadingGuard = false;
        table.update({
          rows: rows as Row[],
          footerRenderKey: "idle",
        });
      }, LOAD_DELAY_MS);
    },
  });
  table.mount();

  (wrapper as HTMLDivElement & { _table?: SimpleTableVanilla })._table = table;
  return wrapper;
}
