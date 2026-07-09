/**
 * RadioStationsExample – client-style radio stations grid.
 *
 * Mirrors a Chartmetric-style table captured from client HTML:
 * window/external scroll (no height/maxHeight), footer on top, custom theme,
 * five left-pinned identity columns, two equal main metric columns, ~3235 rows
 * at 65px row height.
 */
import { SimpleTableVanilla } from "../../src/index";
import type {
  CellRendererProps,
  FooterRendererProps,
  HeaderObject,
  Row,
} from "../../src/index";
import { defaultVanillaArgs, type UniversalVanillaArgs } from "../vanillaStoryConfig";

const ROW_COUNT = 3235;
const ROW_HEIGHT = 65;
const HEADER_HEIGHT = 36;

const GENRES = [
  "Hot AC",
  "Top 40/Pop",
  "Top 40/Urban",
  "Rhythmic",
  "Alternative Rock",
  "Country",
  "AAA",
];

const AREAS = [
  "Los Angeles",
  "New York",
  "Chicago",
  "Boston",
  "Dallas",
  "Houston",
  "Philadelphia",
];

const STATION_NAMES = [
  "KBIG 104.3 MYfm",
  "WHTZ Z100",
  "102.7 KIIS FM KVVS",
  "Hot 97",
  "WKTU - 103.5 KTU",
  "WWPR-FM Power 105.1",
  "WTMX - The MIX 101.9 FM",
  "WNEW-FM Fresh 102.7 (US Only)",
  "KRRL-FM Real 92.3",
  "WXKS-FM kiss 108",
  "POWER106",
  "KHKS 106.1 KISS-FM",
  "WNYL ALT 92.3",
  "KYSR ALT 98.7 FM",
  "KKGO Go Country 105 (US Only)",
  "KROQ",
  "KTBZ-FM 94.5 The Buzz",
  "WNSH New York's Country 94.7 FM",
  "Hot 104 Radio",
  "WKLB Country 102.5 FM",
  "WUSN-FM",
  "WUSL POWER 99 FM",
  "93XRT",
];

/** Seeded PRNG so row metrics stay stable across remounts. */
function mulberry32(seed: number) {
  return () => {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

interface RadioStationRow extends Row {
  id: number;
  __index__: number;
  name: string;
  genre: string;
  broadcast_area: string;
  country: string;
  wikipedia_views: number;
  aqh: number;
}

function createRadioStationRows(count: number): RadioStationRow[] {
  const rand = mulberry32(42);
  return Array.from({ length: count }, (_, i) => {
    const aqh = Math.round((70_000 - i * 18 - rand() * 40) / 100) * 100;
    return {
      id: i,
      __index__: i + 1,
      name: STATION_NAMES[i % STATION_NAMES.length],
      genre: GENRES[i % GENRES.length],
      broadcast_area: AREAS[i % AREAS.length],
      country: "US",
      wikipedia_views: Math.floor(10 + rand() * 160),
      aqh: Math.max(1_000, aqh),
    };
  });
}

function formatNumber(value: unknown): string {
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n)) return String(value ?? "");
  return n.toLocaleString("en-US");
}

function stationCellRenderer({ value }: CellRendererProps): HTMLElement {
  const container = document.createElement("div");
  Object.assign(container.style, {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    minWidth: "0",
    width: "100%",
  });

  const cover = document.createElement("div");
  Object.assign(cover.style, {
    width: "40px",
    height: "40px",
    borderRadius: "4px",
    background: "linear-gradient(135deg, #94a3b8, #64748b)",
    flexShrink: "0",
  });
  container.appendChild(cover);

  const name = document.createElement("span");
  Object.assign(name.style, {
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    fontWeight: "500",
    color: "#1e293b",
  });
  name.title = String(value ?? "");
  name.textContent = String(value ?? "");
  container.appendChild(name);

  return container;
}

function countryCellRenderer({ value }: CellRendererProps): HTMLElement {
  const wrap = document.createElement("span");
  Object.assign(wrap.style, {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
  });
  wrap.title = "United States";

  const flag = document.createElement("span");
  flag.textContent = "🇺🇸";
  flag.setAttribute("aria-hidden", "true");
  wrap.appendChild(flag);

  const link = document.createElement("a");
  link.href = "#";
  link.textContent = String(value ?? "US");
  link.addEventListener("click", (e) => e.preventDefault());
  wrap.appendChild(link);

  return wrap;
}

function getHeaders(): HeaderObject[] {
  return [
    {
      accessor: "__index__",
      label: "#",
      width: 70,
      type: "number",
      align: "center",
      pinned: "left",
      isSortable: false,
    },
    {
      accessor: "name",
      label: "Station",
      width: 220,
      type: "string",
      align: "left",
      pinned: "left",
      isSortable: true,
      cellRenderer: stationCellRenderer,
    },
    {
      accessor: "genre",
      label: "Format",
      width: 150,
      type: "string",
      align: "left",
      pinned: "left",
      isSortable: true,
    },
    {
      accessor: "broadcast_area",
      label: "Broadcast Area",
      width: 160,
      type: "string",
      align: "left",
      pinned: "left",
      isSortable: true,
    },
    {
      accessor: "country",
      label: "Country",
      width: 328,
      type: "string",
      align: "left",
      pinned: "left",
      isSortable: true,
      cellRenderer: countryCellRenderer,
    },
    {
      accessor: "wikipedia_views",
      label: "Views",
      width: "1fr",
      minWidth: 120,
      type: "number",
      align: "right",
      isSortable: true,
      valueFormatter: ({ value }) => formatNumber(value),
    },
    {
      accessor: "aqh",
      label: "AQH",
      width: "1fr",
      minWidth: 120,
      type: "number",
      align: "right",
      isSortable: true,
      valueFormatter: ({ value }) => formatNumber(value),
    },
  ];
}

const radioRows = createRadioStationRows(ROW_COUNT);

function createClientFooter(props: FooterRendererProps): HTMLElement {
  const wrap = document.createElement("div");
  Object.assign(wrap.style, {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "12px 16px",
    minHeight: "49px",
    boxSizing: "border-box",
    borderBottom: "1px solid #e2e8f0",
    background: "#f8fafc",
    fontSize: "13px",
    color: "#475569",
  });

  const left = document.createElement("span");
  left.textContent = `${props.totalRows.toLocaleString("en-US")} radio stations`;
  wrap.appendChild(left);

  const right = document.createElement("span");
  right.textContent = "Radio stations";
  wrap.appendChild(right);

  return wrap;
}

export const radioStationsExampleDefaults: Partial<UniversalVanillaArgs> = {
  columnReordering: true,
  columnResizing: true,
  autoExpandColumns: true,
  editColumns: true,
  theme: "custom",
  customTheme: {
    rowHeight: ROW_HEIGHT,
    headerHeight: HEADER_HEIGHT,
  },
  // height / maxHeight intentionally omitted: external scroll owns the viewport
};

export function renderRadioStationsExample(args?: Partial<UniversalVanillaArgs>): HTMLElement {
  const options = { ...defaultVanillaArgs, ...radioStationsExampleDefaults, ...args };

  const wrapper = document.createElement("div");

  // Page-like scroll host (Storybook iframe can't always use real `window`
  // scroll cleanly). Same external-scroll mode as `scrollParent: "window"`.
  const scrollContainer = document.createElement("div");
  Object.assign(scrollContainer.style, {
    height: "100vh",
    overflow: "auto",
    boxSizing: "border-box",
    padding: "1rem",
    background: "#fff",
  });
  wrapper.appendChild(scrollContainer);

  const h2 = document.createElement("h2");
  h2.style.margin = "0 0 0.75rem";
  h2.textContent = "Radio Stations";
  scrollContainer.appendChild(h2);

  const tableContainer = document.createElement("div");
  scrollContainer.appendChild(tableContainer);

  const table = new SimpleTableVanilla(tableContainer, {
    defaultHeaders: getHeaders(),
    rows: radioRows,
    getRowId: (p) => String((p.row as RadioStationRow | undefined)?.id),
    theme: options.theme,
    customTheme: options.customTheme,
    columnReordering: options.columnReordering,
    columnResizing: options.columnResizing,
    autoExpandColumns: options.autoExpandColumns,
    editColumns: options.editColumns,
    editColumnsInitOpen: options.editColumnsInitOpen,
    columnEditorConfig: {
      text: "All Columns",
      searchEnabled: true,
      searchPlaceholder: "Search columns",
    },
    footerPosition: "top",
    footerRenderer: createClientFooter,
    shouldPaginate: false,
    hideFooter: options.hideFooter,
    initialSortColumn: "aqh",
    initialSortDirection: "desc",
    // No height/maxHeight: table grows; outer scroll drives virtualization.
    scrollParent: scrollContainer,
  });
  table.mount();

  (wrapper as HTMLDivElement & { _table?: SimpleTableVanilla })._table = table;
  return wrapper;
}
