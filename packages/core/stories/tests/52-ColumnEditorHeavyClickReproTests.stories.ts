/**
 * COLUMN EDITOR HEAVY-CLICK / HEADER-REORDER REPRO
 *
 * Chartmetric-style Track List stress case for two client-reported issues:
 * 1. Column editor checkboxes sometimes need multiple clicks (esp. nested columns
 *    on a heavy table) — suspected cause: setHeaders → full header re-render +
 *    column-editor popout rebuild (twice) destroying the checkbox mid-interaction.
 * 2. Header drag reorder can feel sticky; final animation sometimes settles at the
 *    previous position rather than the new one.
 *
 * Manual:
 * - Open Storybook → Tests/52 - Column Editor Heavy Click Repro
 * - Rapidly toggle nested checkboxes in the column editor (groups + leafs)
 * - Drag column headers left/right and watch settle animation
 *
 * Light vs Heavy stories isolate whether render cost correlates with missed clicks
 * (customer could repro on Track List but not lighter Influencer List).
 */

import type { Meta } from "@storybook/html";
import { expect } from "@storybook/test";
import {
  SimpleTableVanilla,
  type CellRendererProps,
  type ColumnDef,
  type Row,
} from "../../src/index";
import { waitForTable, waitUntil } from "./testUtils";

const meta: Meta = {
  title: "Tests/52 - Column Editor Heavy Click Repro",
  // Helpers like resetClickRepro must not become blank CSF stories.
  excludeStories: ["resetClickRepro"],
  parameters: {
    layout: "fullscreen",
    chromatic: { disableSnapshot: true },
    docs: {
      description: {
        component:
          "Track-List-style nested columns + expensive cells to reproduce column-editor multi-click and header-reorder settle glitches.",
      },
    },
  },
};

export default meta;

// ---------------------------------------------------------------------------
// Play-test counters (not Storybook stories — see meta.excludeStories)
// ---------------------------------------------------------------------------

interface ClickReproSnapshot {
  checkboxClickAttempts: number;
  visibilityChangeCount: number;
}

declare global {
  interface Window {
    __columnEditorClickRepro?: ClickReproSnapshot;
  }
}

const createSnapshot = (): ClickReproSnapshot => ({
  checkboxClickAttempts: 0,
  visibilityChangeCount: 0,
});

const getSnapshot = (): ClickReproSnapshot => {
  if (!window.__columnEditorClickRepro) {
    window.__columnEditorClickRepro = createSnapshot();
  }
  return window.__columnEditorClickRepro;
};

export const resetClickRepro = (): void => {
  window.__columnEditorClickRepro = createSnapshot();
};

// ---------------------------------------------------------------------------
// Track-List-style nested headers (deeper/wider than Influencers light case)
// ---------------------------------------------------------------------------

const PLATFORM_GROUPS = [
  { id: "spotify", label: "Spotify" },
  { id: "apple", label: "Apple Music" },
  { id: "youtube", label: "YouTube" },
  { id: "amazon", label: "Amazon" },
  { id: "tidal", label: "Tidal" },
] as const;

const METRIC_LEAVES = [
  "streams",
  "listeners",
  "followers",
  "saves",
  "shares",
  "playlists",
  "skipRate",
  "completion",
] as const;

const PERIODS = ["7d", "28d", "90d"] as const;

type TrackRow = Row & {
  id: number;
  track: string;
  artist: string;
  album: string;
  genre: string;
  [key: string]: string | number;
};

const expensiveCell = ({ row, accessor }: CellRendererProps): HTMLElement => {
  // Deliberately DOM-heavy so each visibility toggle + full onRender is costly
  // (mirrors custom renderers on Track List).
  const wrap = document.createElement("div");
  wrap.style.display = "flex";
  wrap.style.flexDirection = "column";
  wrap.style.gap = "4px";
  wrap.style.width = "100%";
  wrap.style.padding = "2px 0";

  const value = String((row as TrackRow)[accessor] ?? "");
  const top = document.createElement("div");
  top.style.display = "flex";
  top.style.alignItems = "center";
  top.style.gap = "6px";

  const spark = document.createElement("div");
  spark.style.display = "flex";
  spark.style.alignItems = "flex-end";
  spark.style.gap = "1px";
  spark.style.height = "18px";
  const seed = Number(value) || 1;
  for (let i = 0; i < 8; i++) {
    const bar = document.createElement("span");
    const h = 4 + ((seed * (i + 3)) % 14);
    bar.style.width = "3px";
    bar.style.height = `${h}px`;
    bar.style.background = i % 2 === 0 ? "#94a3b8" : "#64748b";
    bar.style.borderRadius = "1px";
    spark.appendChild(bar);
  }

  const text = document.createElement("span");
  text.style.fontVariantNumeric = "tabular-nums";
  text.style.fontSize = "12px";
  text.textContent = Number.isFinite(Number(value))
    ? Number(value).toLocaleString()
    : value;

  top.appendChild(spark);
  top.appendChild(text);

  const sub = document.createElement("div");
  sub.style.fontSize = "10px";
  sub.style.color = "#64748b";
  sub.textContent = `${accessor} · ${(row as TrackRow).track}`;

  wrap.appendChild(top);
  wrap.appendChild(sub);
  return wrap;
};

const createTrackHeaders = (): ColumnDef[] => {
  const identity: ColumnDef[] = [
    {
      accessor: "id",
      label: "#",
      width: 64,
      type: "number",
      pinned: "left",
      sortable: true,
    },
    {
      accessor: "track",
      label: "Track",
      width: 220,
      type: "string",
      pinned: "left",
      sortable: true,
    },
    {
      accessor: "artist",
      label: "Artist",
      width: 160,
      type: "string",
      pinned: "left",
    },
    {
      accessor: "meta",
      label: "Metadata",
      width: 280,
      type: "string",
      children: [
        { accessor: "album", label: "Album", width: 160, type: "string" },
        { accessor: "genre", label: "Genre", width: 120, type: "string" },
      ],
    },
  ];

  const platformGroups: ColumnDef[] = PLATFORM_GROUPS.map((platform) => ({
    accessor: `${platform.id}_group`,
    label: platform.label,
    width: 960,
    type: "string",
    children: PERIODS.map((period) => ({
      accessor: `${platform.id}_${period}_group`,
      label: period.toUpperCase(),
      width: 320,
      type: "string",
      children: METRIC_LEAVES.map((metric) => ({
        accessor: `${platform.id}_${period}_${metric}`,
        label: metric.charAt(0).toUpperCase() + metric.slice(1),
        width: 120,
        type: "number" as const,
        align: "right" as const,
        sortable: true,
        cellRenderer: expensiveCell,
      })),
    })),
  }));

  return [...identity, ...platformGroups];
};

const createTrackRows = (count: number): TrackRow[] =>
  Array.from({ length: count }, (_, index) => {
    const row: TrackRow = {
      id: index + 1,
      track: `Track ${index + 1}`,
      artist: `Artist ${(index % 40) + 1}`,
      album: `Album ${(index % 25) + 1}`,
      genre: ["Pop", "Hip-Hop", "Rock", "Electronic", "R&B"][index % 5],
    };
    PLATFORM_GROUPS.forEach((platform, pIdx) => {
      PERIODS.forEach((period, periodIdx) => {
        METRIC_LEAVES.forEach((metric, metricIdx) => {
          row[`${platform.id}_${period}_${metric}`] = Math.round(
            (index + 1) * (pIdx + 2) * (periodIdx + 1) * (metricIdx + 3) * 17.3,
          );
        });
      });
    });
    return row;
  });

const createLightHeaders = (): ColumnDef[] => [
  { accessor: "id", label: "ID", width: 80, type: "number" },
  {
    accessor: "location",
    label: "Location",
    width: 150,
    type: "string",
    children: [
      { accessor: "city", label: "City", width: 150, type: "string" },
      { accessor: "region", label: "Region", width: 120, type: "string" },
    ],
  },
  { accessor: "name", label: "Name", width: 160, type: "string" },
];

const createLightRows = (count: number): Row[] =>
  Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    name: `Row ${index + 1}`,
    city: ["NYC", "LA", "CHI", "AUS", "SEA"][index % 5],
    region: ["East", "West", "Central"][index % 3],
  }));

// ---------------------------------------------------------------------------
// Layout
// ---------------------------------------------------------------------------

interface LayoutOptions {
  mode: "heavy" | "light";
  rowCount: number;
  enableReorder: boolean;
}

function buildReproLayout(options: LayoutOptions): HTMLDivElement {
  resetClickRepro();

  const root = document.createElement("div");
  root.style.display = "flex";
  root.style.flexDirection = "column";
  root.style.height = "100vh";
  root.style.boxSizing = "border-box";
  root.style.padding = "12px 16px";
  root.style.background = "#f8fafc";
  root.style.fontFamily = "system-ui, sans-serif";

  const tableHost = document.createElement("div");
  tableHost.dataset.testid = "table-host";
  tableHost.style.flex = "1";
  tableHost.style.minHeight = "0";
  root.appendChild(tableHost);

  const headers =
    options.mode === "heavy" ? createTrackHeaders() : createLightHeaders();
  const rows =
    options.mode === "heavy"
      ? createTrackRows(options.rowCount)
      : createLightRows(options.rowCount);

  // Capture-phase listener for play-test metrics (no on-screen HUD).
  root.addEventListener(
    "click",
    (event) => {
      const target = event.target as HTMLElement | null;
      if (!target) return;
      if (
        target.closest(".st-checkbox-label") ||
        target.classList.contains("st-checkbox-input") ||
        target.classList.contains("st-checkbox-custom")
      ) {
        getSnapshot().checkboxClickAttempts += 1;
      }
    },
    true,
  );

  const table = new SimpleTableVanilla(tableHost, {
    columns: headers,
    rows,
    getRowId: (p) => String((p.row as TrackRow).id),
    height: "100%",
    theme: "modern-light",
    columnResizing: true,
    columnReordering: options.enableReorder,
    enableColumnEditor: true,
    enableColumnEditorInitOpen: true,
    columnEditorConfig: {
      searchEnabled: true,
    },
    onColumnVisibilityChange: () => {
      getSnapshot().visibilityChangeCount += 1;
    },
  });

  table.mount();

  (root as HTMLDivElement & { __table?: SimpleTableVanilla }).__table = table;
  return root;
}

// ---------------------------------------------------------------------------
// Stories
// ---------------------------------------------------------------------------

export const HeavyTrackListColumnEditor = {
  name: "Heavy Track List (column editor multi-click)",
  render: () =>
    buildReproLayout({
      mode: "heavy",
      rowCount: 120,
      enableReorder: true,
    }),
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable(canvasElement);
    await waitUntil(
      () =>
        !!canvasElement.querySelector(
          ".st-column-editor-popout.open, .st-column-editor-popout",
        ),
      { timeoutMs: 5000 },
    );

    const popout =
      canvasElement.querySelector(".st-column-editor-popout.open") ??
      canvasElement.querySelector(".st-column-editor-popout");
    expect(popout).toBeTruthy();

    const items = () =>
      Array.from(canvasElement.querySelectorAll(".st-header-checkbox-item"));

    // Prefer nested leaf rows (indented) — these are the ones that felt sticky.
    const nestedLeaves = items().filter((item) => {
      const pad = parseInt((item as HTMLElement).style.paddingLeft || "0", 10);
      return pad >= 32;
    });
    expect(nestedLeaves.length).toBeGreaterThan(5);

    resetClickRepro();
    const beforeVisibility = getSnapshot().visibilityChangeCount;

    // Re-query after each toggle so play does not click detached nodes.
    const toggleCount = 3;
    for (let i = 0; i < toggleCount; i++) {
      const leaves = items().filter((item) => {
        const pad = parseInt((item as HTMLElement).style.paddingLeft || "0", 10);
        return pad >= 32;
      });
      const input = leaves[i]?.querySelector(".st-checkbox-input") as HTMLInputElement | null;
      expect(input, `missing nested checkbox at index ${i}`).toBeTruthy();
      input!.click();
      await waitUntil(
        () => getSnapshot().visibilityChangeCount > beforeVisibility + i,
        { timeoutMs: 3000 },
      );
    }

    const after = getSnapshot();
    expect(after.visibilityChangeCount - beforeVisibility).toBeGreaterThanOrEqual(toggleCount);
  },
};

export const LightNestedColumnEditorControl = {
  name: "Light nested (control)",
  render: () =>
    buildReproLayout({
      mode: "light",
      rowCount: 8,
      enableReorder: true,
    }),
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    await waitUntil(
      () => !!canvasElement.querySelector(".st-header-checkbox-item"),
      { timeoutMs: 3000 },
    );
    const items = canvasElement.querySelectorAll(".st-header-checkbox-item");
    expect(items.length).toBeGreaterThan(2);
  },
};

export const HeavyHeaderReorderSettle = {
  name: "Heavy Track List (header drag settle)",
  render: () =>
    buildReproLayout({
      mode: "heavy",
      rowCount: 80,
      enableReorder: true,
    }),
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable();
    const labels = canvasElement.querySelectorAll(".st-header-label[draggable='true']");
    expect(labels.length).toBeGreaterThan(3);
  },
};
