/**
 * COLUMN EDITOR HEAVY-CLICK / HEADER-REORDER REPRO
 *
 * Chartmetric-style Track List stress case for:
 * 1. Column editor checkboxes sometimes need multiple clicks (esp. nested columns
 *    on a heavy table) — suspected cause: setHeaders → full header re-render +
 *    column-editor popout rebuild (twice) destroying the checkbox mid-interaction.
 * 2. Header drag reorder animation quality under deep nested groups
 *    (spotify_7d_* leaves under Spotify → 7d, etc.).
 *
 * Manual:
 * - Open Storybook → Tests/52 - Column Editor Heavy Click Repro
 * - Rapidly toggle nested checkboxes in the column editor (groups + leafs)
 * - Open "Track List drag playground (slow)", set Duration, drag Spotify 7d leaves
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

/** Slow default so mid-drag FLIP is easy to follow in the playground / continuity play. */
const SLOW_DURATION = 1500;
/**
 * TEMP fast-feedback knobs for TrackListTenInterruptContinuity.
 * Flip back to the slow values when validating the full play.
 */
const CONTINUITY_FAST_FEEDBACK = true;
const CONTINUITY_DURATION = CONTINUITY_FAST_FEEDBACK ? 450 : SLOW_DURATION;
/** Streams handoff phase — walk the sibling band many times under dense sampling. */
const HANDOFF_SWAPS = 120;
/**
 * Storybook Interactions / test-runner budget for the long continuity play.
 * Dense per-frame sampling + many interrupt swaps can run ~10–20 minutes.
 */
const CONTINUITY_PLAY_TIMEOUT_MS = 20 * 60 * 1000;

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
          "Track-List-style nested columns + expensive cells for column-editor multi-click and header-drag animation QA (slow duration control on the playground story).",
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
  text.textContent = Number.isFinite(Number(value)) ? Number(value).toLocaleString() : value;

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
      width: "auto",
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
      hide: true,
    },
    {
      accessor: "meta",
      label: "Metadata",
      width: 280,
      type: "string",
      children: [
        { accessor: "album", label: "Album", width: 160, type: "string" },
        { accessor: "genre", label: "Genre", width: 120, type: "string", hide: true },
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
  mode: "heavy" | "light" | "spotify7d";
  rowCount: number;
  enableReorder: boolean;
  /** When false, hide the column editor so drag QA is unobstructed. Default true. */
  enableColumnEditor?: boolean;
  /** Open the editor on mount. Default true when editor is enabled. */
  enableColumnEditorInitOpen?: boolean;
  /** Default true. Continuity tests turn this off so all leaves stay mounted at scroll 0. */
  enableVirtualization?: boolean;
  animations?: { enabled: boolean; duration: number };
  /** Optional banner above the table (playground instructions). */
  banner?: string;
}

/** Lean Track List: identity + Spotify → 7d leaves only (fast continuity fixture). */
const createSpotify7dHeaders = (): ColumnDef[] => [
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
    width: 180,
    type: "string",
    pinned: "left",
    sortable: true,
  },
  {
    accessor: "spotify_group",
    label: "Spotify",
    width: 960,
    type: "string",
    children: [
      {
        accessor: "spotify_7d_group",
        label: "7D",
        width: 960,
        type: "string",
        children: METRIC_LEAVES.map((metric) => ({
          accessor: `spotify_7d_${metric}`,
          label: metric.charAt(0).toUpperCase() + metric.slice(1),
          width: 120,
          type: "number" as const,
          align: "right" as const,
          sortable: true,
        })),
      },
    ],
  },
];

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

  if (options.banner) {
    const banner = document.createElement("p");
    banner.style.margin = "0 0 10px";
    banner.style.fontSize = "13px";
    banner.style.lineHeight = "1.45";
    banner.style.color = "#334155";
    banner.textContent = options.banner;
    root.appendChild(banner);
  }

  const tableHost = document.createElement("div");
  tableHost.dataset.testid = "table-host";
  tableHost.style.flex = "1";
  tableHost.style.minHeight = "0";
  root.appendChild(tableHost);

  const headers =
    options.mode === "heavy"
      ? createTrackHeaders()
      : options.mode === "spotify7d"
        ? createSpotify7dHeaders()
        : createLightHeaders();
  const rows =
    options.mode === "heavy" || options.mode === "spotify7d"
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

  const enableColumnEditor = options.enableColumnEditor !== false;

  const table = new SimpleTableVanilla(tableHost, {
    columns: headers,
    rows,
    getRowId: (p) => String((p.row as TrackRow).id),
    height: "100%",
    theme: "modern-light",
    columnResizing: true,
    columnReordering: options.enableReorder,
    enableVirtualization: options.enableVirtualization,
    enableColumnEditor,
    enableColumnEditorInitOpen: enableColumnEditor && options.enableColumnEditorInitOpen !== false,
    columnEditorConfig: enableColumnEditor
      ? {
          searchEnabled: true,
        }
      : undefined,
    animations: options.animations,
    onColumnVisibilityChange: () => {
      getSnapshot().visibilityChangeCount += 1;
    },
  });

  table.mount();

  (root as HTMLDivElement & { __table?: SimpleTableVanilla }).__table = table;
  return root;
}

// ---------------------------------------------------------------------------
// Drag helpers (Track List leaf reorder)
// ---------------------------------------------------------------------------

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

/**
 * Column virtualization culls off-screen leaves. Scroll the main pane until
 * every accessor has a header cell in the DOM (or attempts are exhausted).
 */
const ensureLeavesInView = async (
  canvasElement: HTMLElement,
  accessors: readonly string[],
): Promise<void> => {
  await waitUntil(() => !!canvasElement.querySelector(".st-body-main"), {
    timeoutMs: 10_000,
  });
  const bodyMain = canvasElement.querySelector<HTMLElement>(".st-body-main");
  if (!bodyMain) throw new Error(".st-body-main not found");

  const allPresent = () =>
    accessors.every((a) => !!canvasElement.querySelector(`.st-header-cell[data-accessor="${a}"]`));

  if (allPresent()) return;

  // Spotify 7d band sits just after the Metadata group — a modest scroll
  // usually brings the full 8-leaf set into the virtualized window.
  const candidates = [0, 120, 200, 280, 360, 480, 600, 800];
  for (const scrollLeft of candidates) {
    bodyMain.scrollLeft = scrollLeft;
    bodyMain.dispatchEvent(new Event("scroll", { bubbles: true }));
    await sleep(80);
    await new Promise((r) => requestAnimationFrame(() => r(undefined)));
    if (allPresent()) return;
  }

  throw new Error(
    `Could not bring leaves into view: missing ${accessors
      .filter((a) => !canvasElement.querySelector(`.st-header-cell[data-accessor="${a}"]`))
      .join(", ")}`,
  );
};

const findHeaderCell = (canvasElement: HTMLElement, accessor: string): HTMLElement | null =>
  canvasElement.querySelector<HTMLElement>(`.st-header-cell[data-accessor="${accessor}"]`);

const findHeaderLabel = (canvasElement: HTMLElement, accessor: string): HTMLElement => {
  const cell = findHeaderCell(canvasElement, accessor);
  const label = cell?.querySelector<HTMLElement>(".st-header-label");
  if (!label) throw new Error(`Header label for "${accessor}" not found`);
  return label;
};

const parseTranslateX = (transform: string): number => {
  if (!transform || transform === "none") return 0;
  const t3 = transform.match(/translate3d\(\s*(-?[\d.]+)px/);
  if (t3) return parseFloat(t3[1]);
  const m = transform.match(/matrix\(\s*([^)]+)\)/);
  if (m) {
    const parts = m[1].split(",").map((p) => parseFloat(p.trim()));
    if (parts.length >= 6) return parts[4];
  }
  return 0;
};

const leafLeftOrder = (canvasElement: HTMLElement, accessors: readonly string[]): string =>
  accessors
    .slice()
    .sort((a, b) => {
      const aL = parseFloat(findHeaderCell(canvasElement, a)?.style.left || "0");
      const bL = parseFloat(findHeaderCell(canvasElement, b)?.style.left || "0");
      return aL - bL;
    })
    .join(",");

const SPOTIFY_7D_LEAVES = [
  "spotify_7d_streams",
  "spotify_7d_listeners",
  "spotify_7d_followers",
  "spotify_7d_saves",
  "spotify_7d_shares",
  "spotify_7d_playlists",
  "spotify_7d_skipRate",
  "spotify_7d_completion",
] as const;

const styleLeftOf = (canvasElement: HTMLElement, accessor: string): number =>
  parseFloat(findHeaderCell(canvasElement, accessor)?.style.left || "0");

/** Painted X (page coords) — includes FLIP translate. */
const visualLeftOf = (canvasElement: HTMLElement, accessor: string): number => {
  const cell = findHeaderCell(canvasElement, accessor);
  if (!cell) return NaN;
  return cell.getBoundingClientRect().left;
};

/**
 * Page-space X of the element's layout box (style.left), stripping FLIP translate.
 */
const styleBoxLeftOf = (canvasElement: HTMLElement, accessor: string): number => {
  const cell = findHeaderCell(canvasElement, accessor);
  if (!cell) return NaN;
  return (
    cell.getBoundingClientRect().left - parseTranslateX(window.getComputedStyle(cell).transform)
  );
};

const orderedLeaves = (canvasElement: HTMLElement, accessors: readonly string[]): string[] =>
  accessors.slice().sort((a, b) => styleLeftOf(canvasElement, a) - styleLeftOf(canvasElement, b));

/** Slot X positions currently occupied by the leaf set (sorted ascending). */
const slotLefts = (canvasElement: HTMLElement, accessors: readonly string[]): number[] =>
  orderedLeaves(canvasElement, accessors).map((a) => styleLeftOf(canvasElement, a));

/** Insert-style sibling reorder (matches DragHandlerManager.swapHeaders). */
const applyInsertReorder = (order: string[], fromAcc: string, toAcc: string): string[] => {
  const next = order.slice();
  const from = next.indexOf(fromAcc);
  const to = next.indexOf(toAcc);
  if (from < 0 || to < 0 || from === to) return next;
  const [removed] = next.splice(from, 1);
  next.splice(to, 0, removed);
  return next;
};

const expectedLeftMap = (order: string[], slots: number[]): Map<string, number> => {
  const map = new Map<string, number>();
  order.forEach((accessor, index) => {
    map.set(accessor, slots[index] ?? NaN);
  });
  return map;
};

const hasActiveFlip = (canvasElement: HTMLElement, accessor: string): boolean => {
  const cell = findHeaderCell(canvasElement, accessor);
  if (!cell) return false;
  // Prefer computed matrix — WAAPI fill:forwards can leave a stale start
  // translate on style.transform while paint is already at identity.
  const computed = window.getComputedStyle(cell).transform;
  if (computed && computed !== "none" && Math.abs(parseTranslateX(computed)) > 0.5) {
    return true;
  }
  // Running/paused WAAPI still counts even near identity for one frame.
  if (typeof cell.getAnimations === "function") {
    for (const anim of cell.getAnimations()) {
      if (anim.playState !== "running" && anim.playState !== "paused") continue;
      const timing = anim.effect?.getComputedTiming?.();
      const duration = timing?.duration;
      const current = anim.currentTime;
      if (
        typeof duration === "number" &&
        Number.isFinite(duration) &&
        duration > 0 &&
        typeof current === "number" &&
        Number.isFinite(current) &&
        current < duration - 0.5
      ) {
        return true;
      }
    }
  }
  return false;
};

type LeafMotion = {
  accessor: string;
  /** Expected style.left destination after the swap that created/updated this motion */
  destLeft: number;
  /** Painted X when we last sampled */
  visualAtSample: number;
  /** style.left before the swap that last retargeted this motion */
  originLeft: number;
  updatedAtStep: number;
};

/** Discrete event slack (release / dragstart) — one leaf is 120px. */
const VISUAL_JUMP_PX = 90;
/**
 * Max paint discontinuity (px). Any |Δvisual| ≥ 1 on retarget / hold / clock
 * drift must fail — the visible per-hover hitch is ~1–2px.
 */
const MAX_DISCONTINUITY_PX = 0.99;
/**
 * Fallback per-frame ceiling when no CSS animation clock is available
 * (holding invert before transition start, or settled). Real mid-FLIP
 * samples use {@link MAX_DISCONTINUITY_PX} against the predicted visual instead.
 *
 * Note: Chrome `[Violation] requestAnimationFrame handler took Nms` during
 * column-drag usually means main-thread FLIP bake/start thrash — compositor
 * peers advance while JS is busy, which shows up as the ~1–2px hover hitch
 * these budgets are meant to catch.
 */
const FRAME_JUMP_PX = 12;
/** How far a sample may stray from the FLIP corridor (visual ↔ dest). */
const PATH_SLACK_PX = 8;
/**
 * Max paint drift when style.left retargets (FLIP invert must hold the pixel).
 */
const RETARGET_JUMP_PX = MAX_DISCONTINUITY_PX;
/**
 * Max |painted − clock-predicted| while a linear transform transition runs.
 */
const CLOCK_DRIFT_PX = MAX_DISCONTINUITY_PX;
/**
 * Holding-invert / baked (no WAAPI clock): paint must stay put across frames.
 */
const HOLD_JUMP_PX = MAX_DISCONTINUITY_PX;
/** Header vs first body cell for the same leaf should paint together. */
/** Mirror-loop / compositor lag budget between header WAAPI and body copy. */
const HEADER_BODY_SYNC_PX = 20;
/** Just clears REVERT_TO_PREVIOUS_HEADERS_DELAY (150ms); keep swaps aggressive. */
const BETWEEN_SWAP_MS = CONTINUITY_FAST_FEEDBACK ? 160 : 155;
/** Short post-swap sample window so the next interrupt lands while peers are mid-FLIP. */
const POST_SWAP_WATCH_MS = CONTINUITY_FAST_FEEDBACK
  ? 80
  : Math.min(220, Math.floor(SLOW_DURATION * 0.15));
/** Pointer steps for dragover→reorder (fewer = faster commit). */
const DRAGOVER_STEPS = CONTINUITY_FAST_FEEDBACK ? 3 : 8;
/**
 * rAF samples between dragover pointer steps.
 * Fast mode samples harder on the commit frame so a second-reorder teleport
 * cannot hide between dragover and the next pointer step.
 */
const DRAGOVER_FRAMES_PER_STEP = CONTINUITY_FAST_FEEDBACK ? 2 : 1;

const nextFrame = (): Promise<void> =>
  new Promise((r) => requestAnimationFrame(() => r(undefined)));

/** First painted body cell for a leaf (row 0 band) — catches header/body desync. */
const bodyVisualLeftOf = (canvasElement: HTMLElement, accessor: string): number => {
  const cell = canvasElement.querySelector<HTMLElement>(
    `.st-body-main .st-cell[data-accessor="${accessor}"]`,
  );
  if (!cell) return NaN;
  return cell.getBoundingClientRect().left;
};

type FlipClock = {
  /** Eased progress 0..1 from getComputedTiming().progress */
  progress: number;
  duration: number;
  current: number;
};

/** Read the running/paused transform transition clock on a header cell. */
const readFlipClock = (element: HTMLElement | null): FlipClock | null => {
  if (!element || typeof element.getAnimations !== "function") return null;
  for (const anim of element.getAnimations()) {
    if (anim.playState !== "running" && anim.playState !== "paused") continue;
    const timing = anim.effect?.getComputedTiming?.();
    if (!timing) continue;
    const { duration } = timing;
    const current = anim.currentTime;
    if (
      typeof duration !== "number" ||
      !Number.isFinite(duration) ||
      duration <= 0 ||
      typeof current !== "number" ||
      !Number.isFinite(current)
    ) {
      continue;
    }
    // Prefer transformed progress (respects easing). Fall back to linear
    // current/duration — column-reorder FLIPs are linear, so this matches.
    let progress =
      typeof timing.progress === "number" && Number.isFinite(timing.progress)
        ? timing.progress
        : current / duration;
    progress = Math.min(1, Math.max(0, progress));
    return { progress, duration, current };
  }
  return null;
};

/**
 * Infer the transition's starting remain (visual−dest at progress 0) from a
 * mid-flight sample. Linear / eased progress both satisfy
 * remain = startRemain × (1 − progress).
 */
const inferStartRemain = (remainX: number, progress: number): number => {
  if (progress <= 0.001) return remainX;
  if (progress >= 0.999) return remainX;
  return remainX / (1 - progress);
};

type LeafSample = {
  visual: number;
  destPage: number;
  styleLeft: number;
  bodyVisual: number;
  flipping: boolean;
  /** Signed paint offset from layout box (≈ live translate X). */
  remainX: number;
  flip: FlipClock | null;
  /** performance.now() at sample time — pairs with flip.current for hitch detection. */
  sampleAt: number;
};

const sampleLeaf = (canvasElement: HTMLElement, accessor: string): LeafSample => {
  const cell = findHeaderCell(canvasElement, accessor);
  const visual = cell ? cell.getBoundingClientRect().left : NaN;
  const destPage = cell
    ? visual - parseTranslateX(window.getComputedStyle(cell).transform)
    : NaN;
  const remainX = visual - destPage;
  return {
    visual,
    destPage,
    styleLeft: styleLeftOf(canvasElement, accessor),
    bodyVisual: bodyVisualLeftOf(canvasElement, accessor),
    flipping: hasActiveFlip(canvasElement, accessor),
    remainX,
    flip: readFlipClock(cell),
    sampleAt: performance.now(),
  };
};

/** Sync assert for the hot rAF path — instrumented `await expect` is too slow
 *  and lets many real animation frames elapse between samples. */
const logContinuityFail = (
  message: string,
  detail?: Record<string, unknown>,
): void => {
  console.error(`[continuity:fail] ${message}`);
  if (detail) {
    try {
      console.error(`[continuity:fail:json] ${JSON.stringify(detail)}`);
    } catch {
      console.error(`[continuity:fail:detail]`, detail);
    }
  }
};

const assertTrue = (
  condition: boolean,
  message: string,
  detail?: Record<string, unknown>,
): void => {
  if (!condition) {
    logContinuityFail(message, detail);
    throw new Error(message);
  }
};

/**
 * Fallback frame-jump budget when no animation clock is available.
 * Baked/holding invert must stay put ({@link HOLD_JUMP_PX}).
 * Never allow a ≥1px discontinuity through this path.
 */
const maxAllowedFrameJump = (prev: LeafSample): number => {
  if (prev.flipping) {
    return HOLD_JUMP_PX;
  }
  return FRAME_JUMP_PX;
};

const sampleDetail = (accessor: string, s: LeafSample, isDragged: boolean) => ({
  accessor,
  isDragged,
  visual: Number(s.visual.toFixed(3)),
  destPage: Number(s.destPage.toFixed(3)),
  styleLeft: s.styleLeft,
  remainX: Number(s.remainX.toFixed(3)),
  bodyVisual: Number.isFinite(s.bodyVisual) ? Number(s.bodyVisual.toFixed(3)) : null,
  flipping: s.flipping,
  flip: s.flip
    ? {
        progress: Number(s.flip.progress.toFixed(4)),
        duration: s.flip.duration,
        current: Number(s.flip.current.toFixed(2)),
      }
    : null,
  sampleAt: Number(s.sampleAt.toFixed(2)),
});

/**
 * When both samples have a transform clock, painted X must match
 * destPage + startRemain×(1−progress) within {@link CLOCK_DRIFT_PX}.
 */
const assertClockPredictedVisual = (
  accessor: string,
  prev: LeafSample,
  next: LeafSample,
  label: string,
  isDragged: boolean,
): boolean => {
  if (!prev.flip || !next.flip) return false;
  // Dest rewrite is handled by the retarget assert; clock model assumes a fixed box.
  if (Math.abs(next.destPage - prev.destPage) > 1.5) return false;

  const startRemain = inferStartRemain(prev.remainX, prev.flip.progress);
  const expectedRemain = startRemain * (1 - next.flip.progress);
  const expectedVisual = next.destPage + expectedRemain;
  const drift = Math.abs(next.visual - expectedVisual);
  const frameJump = Math.abs(next.visual - prev.visual);

  assertTrue(
    drift < 1,
    `${label}: ${accessor} drifted from FLIP clock prediction ` +
      `(visual=${next.visual.toFixed(1)} expected=${expectedVisual.toFixed(1)}, ` +
      `Δ=${drift.toFixed(1)}, max=${CLOCK_DRIFT_PX}, ` +
      `progress ${prev.flip.progress.toFixed(3)}→${next.flip.progress.toFixed(3)}, ` +
      `remain ${prev.remainX.toFixed(1)}→${next.remainX.toFixed(1)})`,
    {
      kind: "clock-drift",
      label,
      drift,
      expectedVisual,
      expectedRemain,
      startRemain,
      frameJump,
      prev: sampleDetail(accessor, prev, isDragged),
      next: sampleDetail(accessor, next, isDragged),
    },
  );

  // Progress should not run backward on the same transition.
  assertTrue(
    next.flip.progress + 0.02 >= prev.flip.progress,
    `${label}: ${accessor} FLIP progress went backward ` +
      `(${prev.flip.progress.toFixed(3)} → ${next.flip.progress.toFixed(3)})`,
    {
      kind: "progress-backward",
      label,
      prev: sampleDetail(accessor, prev, isDragged),
      next: sampleDetail(accessor, next, isDragged),
    },
  );

  // NOTE: Do NOT assert animDt vs wallDt (clock-leap / clock-stall).
  // Those caught soft-pause stop-start on the old CSS-transition FLIP path.
  // ColumnReorderAnimator uses compositor WAAPI; when Storybook Interactions
  // instruments expects, main-thread sampling gaps make animDt≫wallDt without
  // a painted hitch (false FAIL around interaction ~265 on re-hit/post-swap).
  // Painted continuity is enforced by drift + travel checks below / callers.
  const animDt = next.flip.current - prev.flip.current;
  if (animDt > 0 && next.flip.duration === prev.flip.duration) {
    const expectedJump = Math.abs(startRemain) * (animDt / next.flip.duration);
    assertTrue(
      Math.abs(frameJump - expectedJump) < 1,
      `${label}: ${accessor} frame travel ≠ clock-predicted travel ` +
        `(Δvisual=${frameJump.toFixed(1)} expected=${expectedJump.toFixed(1)}, ` +
        `animΔ=${animDt.toFixed(1)}ms)`,
      {
        kind: "travel-mismatch",
        label,
        frameJump,
        expectedJump,
        animDt,
        startRemain,
        prev: sampleDetail(accessor, prev, isDragged),
        next: sampleDetail(accessor, next, isDragged),
      },
    );
  }

  return true;
};

const assertLeafFrameContinuity = (
  accessor: string,
  prev: LeafSample,
  next: LeafSample,
  label: string,
  motion: LeafMotion | undefined,
  opts: { isDragged?: boolean } = {},
): void => {
  const isDragged = opts.isDragged === true;
  const frameJump = Math.abs(next.visual - prev.visual);
  const destChanged = Math.abs(next.destPage - prev.destPage) > 1.5;
  // Retarget: invert must pin paint. Dragged column included — that opening
  // jump on reorder is exactly what we want to catch.
  const allowedJump = destChanged ? RETARGET_JUMP_PX : maxAllowedFrameJump(prev);

  // Surface discontinuous motion (≥0.75px) on retarget/hold paths.
  if (
    frameJump >= 0.75 &&
    (destChanged || !prev.flip || !next.flip)
  ) {
    console.warn(
      `[continuity:microjump] ${label} ${accessor}` +
        `${isDragged ? " (dragged)" : ""}${destChanged ? " retarget" : ""} ` +
        `Δ=${frameJump.toFixed(2)} allowed=${allowedJump.toFixed(2)} ` +
        `visual ${prev.visual.toFixed(2)}→${next.visual.toFixed(2)} ` +
        `remain ${prev.remainX.toFixed(2)}→${next.remainX.toFixed(2)} ` +
        `dest ${prev.destPage.toFixed(2)}→${next.destPage.toFixed(2)} ` +
        `flip=${Boolean(prev.flip)}→${Boolean(next.flip)}`,
    );
  }

  if (destChanged) {
    assertTrue(
      frameJump < 1,
      `${label}: ${accessor}${isDragged ? " (dragged)" : ""} jumped at reorder start ` +
        `(${prev.visual.toFixed(1)} → ${next.visual.toFixed(1)}, Δ=${frameJump.toFixed(1)}, ` +
        `dest ${prev.destPage.toFixed(1)} → ${next.destPage.toFixed(1)}, ` +
        `max=${RETARGET_JUMP_PX})`,
      {
        kind: "retarget-jump",
        label,
        frameJump,
        allowedJump,
        prev: sampleDetail(accessor, prev, isDragged),
        next: sampleDetail(accessor, next, isDragged),
        motion: motion
          ? { destLeft: motion.destLeft, originLeft: motion.originLeft, step: motion.updatedAtStep }
          : null,
      },
    );
  } else {
    const usedClock = assertClockPredictedVisual(accessor, prev, next, label, isDragged);
    if (!usedClock) {
      // End-of-FLIP: samples can straddle completion (remain Npx → 0), especially
      // when Storybook Interactions makes rAF sampling sparse. Landing on the
      // dest box with travel ≤ prior remain is completion, not a hitch.
      let settlingToDest = false;
      if (
        prev.flipping &&
        !next.flipping &&
        Math.abs(next.visual - next.destPage) < 0.5 &&
        frameJump <= Math.abs(prev.remainX) + 0.5
      ) {
        settlingToDest = true;
      }

      if (!settlingToDest && next.flip && Math.abs(prev.remainX) > 0.5) {
        const startRemain = inferStartRemain(next.remainX, next.flip.progress);
        const startDrift = Math.abs(startRemain - prev.remainX);
        assertTrue(
          startDrift < 1,
          `${label}: ${accessor} FLIP start remain jumped at transition start ` +
            `(held=${prev.remainX.toFixed(1)} inferred=${startRemain.toFixed(1)}, ` +
            `Δ=${startDrift.toFixed(1)})`,
          {
            kind: "start-remain-jump",
            label,
            startRemain,
            startDrift,
            prev: sampleDetail(accessor, prev, isDragged),
            next: sampleDetail(accessor, next, isDragged),
          },
        );
      }
      if (!settlingToDest) {
        assertTrue(
          frameJump < 1,
          `${label}: ${accessor} teleported between frames ` +
            `(${prev.visual.toFixed(1)} → ${next.visual.toFixed(1)}, Δ=${frameJump.toFixed(1)}, ` +
            `allowed=${allowedJump.toFixed(1)})`,
          {
            kind: "frame-teleport",
            label,
            frameJump,
            allowedJump,
            prev: sampleDetail(accessor, prev, isDragged),
            next: sampleDetail(accessor, next, isDragged),
          },
        );
      }
    }
  }

  if (motion && !destChanged) {
    assertTrue(
      Math.abs(next.styleLeft - motion.destLeft) < 1.5,
      `${label}: ${accessor} style.left drifted from expected dest ` +
        `(${next.styleLeft} vs ${motion.destLeft})`,
    );
  } else if (motion && destChanged) {
    motion.destLeft = next.styleLeft;
  }

  if (!destChanged && (next.flipping || motion)) {
    const pathMin = Math.min(prev.visual, next.destPage) - PATH_SLACK_PX;
    const pathMax = Math.max(prev.visual, next.destPage) + PATH_SLACK_PX;
    assertTrue(
      next.visual >= pathMin && next.visual <= pathMax,
      `${label}: ${accessor} left FLIP path between frames ` +
        `(${prev.visual.toFixed(1)} → ${next.visual.toFixed(1)}, ` +
        `destPage=${next.destPage.toFixed(1)})`,
    );

    const distBefore = Math.abs(prev.visual - prev.destPage);
    const distNow = Math.abs(next.visual - next.destPage);
    assertTrue(
      distNow <= distBefore + PATH_SLACK_PX,
      `${label}: ${accessor} moved away from dest between frames. ` +
        `dist ${distBefore.toFixed(1)} → ${distNow.toFixed(1)}`,
    );
  } else if (!destChanged && !next.flipping && !motion) {
    assertTrue(
      Math.abs(next.visual - next.destPage) < 1.5,
      `${label}: settled ${accessor} drifted from layout box ` +
        `(visual=${next.visual.toFixed(1)} box=${next.destPage.toFixed(1)})`,
    );
  }

  if (!isDragged && Number.isFinite(next.bodyVisual) && Number.isFinite(prev.bodyVisual)) {
    const headerBodyGap = Math.abs(next.visual - next.bodyVisual);
    assertTrue(
      headerBodyGap <= HEADER_BODY_SYNC_PX,
      `${label}: ${accessor} header/body desync ` +
        `(header=${next.visual.toFixed(1)} body=${next.bodyVisual.toFixed(1)} ` +
        `gap=${headerBodyGap.toFixed(1)})`,
    );

    const bodyJump = Math.abs(next.bodyVisual - prev.bodyVisual);
    if (destChanged) {
      assertTrue(
        bodyJump <= RETARGET_JUMP_PX,
        `${label}: ${accessor} body jumped at reorder start ` +
          `(${prev.bodyVisual.toFixed(1)} → ${next.bodyVisual.toFixed(1)}, Δ=${bodyJump.toFixed(1)}, ` +
          `max=${RETARGET_JUMP_PX})`,
      );
    } else {
      // Body must track the header's step — not a separate loose distance budget.
      assertTrue(
        bodyJump <= frameJump + CLOCK_DRIFT_PX ||
          (!prev.flipping && !next.flipping && bodyJump < 1.5),
        `${label}: ${accessor} body teleported between frames ` +
          `(${prev.bodyVisual.toFixed(1)} → ${next.bodyVisual.toFixed(1)}, Δ=${bodyJump.toFixed(1)}, ` +
          `headerΔ=${frameJump.toFixed(1)})`,
      );
    }
  }
};

/**
 * Sample every Spotify 7d leaf on every animation frame until duration elapses
 * and/or `until` returns true. Updates motion.visualAtSample as it goes.
 * Returns frames sampled (for density assertions / HUD).
 */
const watchLeafContinuity = async (
  canvasElement: HTMLElement,
  motions: Map<string, LeafMotion>,
  label: string,
  opts: {
    durationMs?: number;
    until?: () => boolean;
    /** When true, also assert settled leaves stay glued (default true). */
    watchAllLeaves?: boolean;
    /** Active drag source — native drag paint needs looser per-frame limits. */
    dragged?: string;
  } = {},
): Promise<number> => {
  const watchAll = opts.watchAllLeaves !== false;
  const last = new Map<string, LeafSample>();
  for (const accessor of SPOTIFY_7D_LEAVES) {
    last.set(accessor, sampleLeaf(canvasElement, accessor));
  }

  const deadline =
    opts.durationMs !== undefined ? Date.now() + opts.durationMs : Number.POSITIVE_INFINITY;
  let frames = 0;

  while (Date.now() < deadline) {
    if (opts.until?.()) break;
    await nextFrame();
    frames += 1;

    // Read every leaf synchronously first so samples share one paint, then
    // assert (also sync). Instrumented awaits between reads were letting
    // ~100ms of FLIP elapse and looking like teleports.
    const round = new Map<string, LeafSample>();
    for (const accessor of SPOTIFY_7D_LEAVES) {
      const motion = motions.get(accessor);
      if (!watchAll && !motion && !hasActiveFlip(canvasElement, accessor)) continue;
      round.set(accessor, sampleLeaf(canvasElement, accessor));
    }
    for (const [accessor, next] of round) {
      const prev = last.get(accessor)!;
      assertLeafFrameContinuity(
        accessor,
        prev,
        next,
        `${label}#f${frames}`,
        motions.get(accessor),
        {
          isDragged: accessor === opts.dragged,
        },
      );
      last.set(accessor, next);
      const motion = motions.get(accessor);
      if (motion) motion.visualAtSample = next.visual;
    }
  }

  return frames;
};

type DragSession = {
  dataTransfer: DataTransfer;
  sourceAccessor: string;
  lastClientX: number;
  lastClientY: number;
};

const beginLeafDrag = (canvasElement: HTMLElement, sourceAccessor: string): DragSession => {
  const sourceLabel = findHeaderLabel(canvasElement, sourceAccessor);
  const rect = sourceLabel.getBoundingClientRect();
  const clientX = rect.left + rect.width / 2;
  const clientY = rect.top + rect.height / 2;
  const dataTransfer = new DataTransfer();
  dataTransfer.setData("text/plain", "column-drag");
  dataTransfer.effectAllowed = "move";
  sourceLabel.dispatchEvent(
    new DragEvent("dragstart", {
      bubbles: true,
      cancelable: true,
      clientX,
      clientY,
      screenX: clientX,
      screenY: clientY,
      dataTransfer,
    }),
  );
  return { dataTransfer, sourceAccessor, lastClientX: clientX, lastClientY: clientY };
};

const endLeafDrag = (session: DragSession, canvasElement: HTMLElement): void => {
  const sourceLabel = findHeaderLabel(canvasElement, session.sourceAccessor);
  const { lastClientX: clientX, lastClientY: clientY, dataTransfer } = session;
  sourceLabel.dispatchEvent(
    new DragEvent("drop", {
      bubbles: true,
      cancelable: true,
      clientX,
      clientY,
      screenX: clientX,
      screenY: clientY,
      dataTransfer,
    }),
  );
  sourceLabel.dispatchEvent(
    new DragEvent("dragend", {
      bubbles: true,
      cancelable: true,
      clientX,
      clientY,
      screenX: clientX,
      screenY: clientY,
      dataTransfer,
    }),
  );
};

const snapshotLeafVisuals = (canvasElement: HTMLElement): Map<string, number> => {
  const map = new Map<string, number>();
  for (const accessor of SPOTIFY_7D_LEAVES) {
    map.set(accessor, visualLeftOf(canvasElement, accessor));
  }
  return map;
};

const snapshotLeafStyleLefts = (canvasElement: HTMLElement): Map<string, number> => {
  const map = new Map<string, number>();
  for (const accessor of SPOTIFY_7D_LEAVES) {
    map.set(accessor, styleLeftOf(canvasElement, accessor));
  }
  return map;
};

/**
 * Fire dragovers from the last pointer position onto target until style order
 * changes (or attempts exhausted). Stays inside an open drag session.
 *
 * Starts at least 50px away from the target so dragging.ts distance gates
 * (`distance < 10` and anti-ping-pong `distance < 40`) can clear.
 *
 * Returns visuals sampled immediately before the dragover that changed order —
 * prior FLIPs may progress during the long pointer travel, so continuity
 * asserts must compare against that moment (not against the pre-travel sample).
 *
 * When `motions` is provided, every animation frame during travel is checked
 * so mid-drag teleports cannot hide between pointer steps.
 */
const dragOverUntilReorder = async (
  canvasElement: HTMLElement,
  session: DragSession,
  targetAccessor: string,
  opts?: {
    expectOrder?: string;
    motions?: Map<string, LeafMotion>;
    watchLabel?: string;
    dragged?: string;
  },
): Promise<{
  ok: boolean;
  visualsBeforeReorder: Map<string, number>;
  visualsAtCommit: Map<string, number>;
}> => {
  const targetLabel = findHeaderLabel(canvasElement, targetAccessor);
  const targetCell = targetLabel.closest(".st-header-cell") ?? targetLabel;
  const targetRect = targetLabel.getBoundingClientRect();
  const endX = targetRect.left + targetRect.width / 2;
  const endY = targetRect.top + targetRect.height / 2;

  // Guarantee a long enough pointer travel for the distance gates.
  let startX = session.lastClientX;
  let startY = session.lastClientY;
  const travel = Math.hypot(endX - startX, endY - startY);
  if (travel < 50) {
    startX = endX - 60;
    startY = endY;
  }

  const orderBefore = leafLeftOrder(canvasElement, SPOTIFY_7D_LEAVES);
  let visualsBeforeReorder = snapshotLeafVisuals(canvasElement);
  let styleLeftsBeforeReorder = snapshotLeafStyleLefts(canvasElement);
  const lastSamples = new Map<string, LeafSample>();
  const captureLastSamples = () => {
    for (const accessor of SPOTIFY_7D_LEAVES) {
      lastSamples.set(accessor, sampleLeaf(canvasElement, accessor));
    }
  };
  captureLastSamples();
  let frame = 0;

  const watchFrames = async (count: number) => {
    if (!opts?.motions) {
      for (let i = 0; i < count; i++) await nextFrame();
      return;
    }
    for (let i = 0; i < count; i++) {
      await nextFrame();
      frame += 1;
      const round = new Map<string, LeafSample>();
      for (const accessor of SPOTIFY_7D_LEAVES) {
        round.set(accessor, sampleLeaf(canvasElement, accessor));
      }
      for (const [accessor, next] of round) {
        const prev = lastSamples.get(accessor)!;
        assertLeafFrameContinuity(
          accessor,
          prev,
          next,
          `${opts.watchLabel ?? "dragover"}#f${frame}`,
          opts.motions.get(accessor),
          { isDragged: accessor === opts.dragged },
        );
        lastSamples.set(accessor, next);
        const motion = opts.motions.get(accessor);
        if (motion) motion.visualAtSample = next.visual;
      }
    }
  };

  const attempts = 2;
  for (let attempt = 0; attempt < attempts; attempt++) {
    if (attempt > 0) {
      if (opts?.motions) {
        await watchLeafContinuity(
          canvasElement,
          opts.motions,
          `${opts.watchLabel ?? "dragover"} retry`,
          {
            durationMs: BETWEEN_SWAP_MS,
            watchAllLeaves: true,
            dragged: opts.dragged,
          },
        );
      } else {
        await sleep(BETWEEN_SWAP_MS);
      }
      // Retry wait lets in-flight FLIPs advance; rAF continuity must start
      // from paint after that wait, not from lastSamples before it.
      captureLastSamples();
      startX = endX - 80 * (attempt % 2 === 0 ? 1 : -1);
      startY = endY;
    }
    const steps = DRAGOVER_STEPS;
    for (let i = 0; i <= steps; i++) {
      const progress = i / steps;
      const x = startX + (endX - startX) * progress;
      const y = startY + (endY - startY) * progress;
      session.lastClientX = x;
      session.lastClientY = y;
      // Sample before the event so we still have pre-reorder painted positions
      // even if this dragover commits the swap synchronously.
      visualsBeforeReorder = snapshotLeafVisuals(canvasElement);
      styleLeftsBeforeReorder = snapshotLeafStyleLefts(canvasElement);
      targetCell.dispatchEvent(
        new DragEvent("dragover", {
          bubbles: true,
          cancelable: true,
          clientX: x,
          clientY: y,
          screenX: x,
          screenY: y,
          dataTransfer: session.dataTransfer,
        }),
      );
      // Assert paint continuity in the same turn as the reorder commit —
      // waiting for rAF first lets FLIP travel (or a hitch) hide between samples.
      const orderNow = leafLeftOrder(canvasElement, SPOTIFY_7D_LEAVES);
      if (orderNow !== orderBefore) {
        for (const accessor of SPOTIFY_7D_LEAVES) {
          const prevVisual = visualsBeforeReorder.get(accessor);
          if (prevVisual === undefined) continue;
          const prevStyleLeft = styleLeftsBeforeReorder.get(accessor);
          const styleLeftNow = styleLeftOf(canvasElement, accessor);
          const destChanged =
            prevStyleLeft === undefined || Math.abs(styleLeftNow - prevStyleLeft) > 1.5;
          const visual = visualLeftOf(canvasElement, accessor);
          const jump = Math.abs(visual - prevVisual);
          const isDraggedLeaf = accessor === opts?.dragged;
          const flipping = hasActiveFlip(canvasElement, accessor);
          const remainX = visual - styleBoxLeftOf(canvasElement, accessor);
          if (jump >= 0.75) {
            console.warn(
              `[continuity:microjump] ${opts?.watchLabel ?? "dragover"} commit-sync ${accessor}` +
                `${isDraggedLeaf ? " (dragged)" : ""}${destChanged ? " retarget" : ""} ` +
                `Δ=${jump.toFixed(2)} ` +
                `visual ${prevVisual.toFixed(2)}→${visual.toFixed(2)} ` +
                `styleLeft ${prevStyleLeft ?? "?"}→${styleLeftNow} remain=${remainX.toFixed(2)}`,
            );
          }
          assertTrue(
            jump < 1,
            `${opts?.watchLabel ?? "dragover"}: ${accessor}` +
              `${isDraggedLeaf ? " (dragged)" : ""} jumped at reorder commit ` +
              `(${prevVisual.toFixed(1)} → ${visual.toFixed(1)}, Δ=${jump.toFixed(1)}, ` +
              `max=0.99${destChanged ? ", retarget" : ""})`,
            {
              kind: "reorder-commit-jump",
              label: opts?.watchLabel ?? "dragover",
              accessor,
              isDragged: isDraggedLeaf,
              destChanged,
              jump,
              prevVisual,
              visual,
              prevStyleLeft,
              styleLeftNow,
              remainX,
              flipping,
            },
          );
        }
        // Capture hold visuals NOW — any await (watchFrames / expect) lets WAAPI
        // advance and would falsely fail a post-await jump check.
        const visualsAtCommit = snapshotLeafVisuals(canvasElement);
        // Post-commit dest + held paint: the next rAF is a new FLIP, not a
        // dest-rewrite vs a stale pre-swap sample. Also point each motion at
        // the new style.left so destLeft checks match this swap.
        captureLastSamples();
        if (opts?.motions) {
          for (const accessor of SPOTIFY_7D_LEAVES) {
            const motion = opts.motions.get(accessor);
            if (!motion) continue;
            motion.destLeft = styleLeftOf(canvasElement, accessor);
            motion.visualAtSample = visualsAtCommit.get(accessor) ?? motion.visualAtSample;
          }
        }
        const ok = opts?.expectOrder ? orderNow === opts.expectOrder : true;
        await watchFrames(DRAGOVER_FRAMES_PER_STEP);
        return { ok, visualsBeforeReorder, visualsAtCommit };
      }
      await watchFrames(DRAGOVER_FRAMES_PER_STEP);
    }
  }
  return { ok: false, visualsBeforeReorder, visualsAtCommit: visualsBeforeReorder };
};

/**
 * Drag source leaf onto target leaf with enough distance to clear the
 * drag throttle / distance gates in dragging.ts.
 */
const dragLeafOntoLeaf = async (
  canvasElement: HTMLElement,
  sourceAccessor: string,
  targetAccessor: string,
  opts?: { sampleFlip?: (saw: boolean) => void },
): Promise<boolean> => {
  const session = beginLeafDrag(canvasElement, sourceAccessor);
  let sawFlip = false;
  const pollFlip = () => {
    if (sawFlip) return;
    for (const accessor of [sourceAccessor, targetAccessor]) {
      if (hasActiveFlip(canvasElement, accessor)) {
        sawFlip = true;
        opts?.sampleFlip?.(true);
        return;
      }
    }
  };

  const steps = 10;
  const targetLabel = findHeaderLabel(canvasElement, targetAccessor);
  const targetCell = targetLabel.closest(".st-header-cell") ?? targetLabel;
  const startX = session.lastClientX;
  const startY = session.lastClientY;
  const targetRect = targetLabel.getBoundingClientRect();
  const endX = targetRect.left + targetRect.width / 2;
  const endY = targetRect.top + targetRect.height / 2;

  for (let i = 0; i <= steps; i++) {
    const progress = i / steps;
    const x = startX + (endX - startX) * progress;
    const y = startY + (endY - startY) * progress;
    session.lastClientX = x;
    session.lastClientY = y;
    targetCell.dispatchEvent(
      new DragEvent("dragover", {
        bubbles: true,
        cancelable: true,
        clientX: x,
        clientY: y,
        screenX: x,
        screenY: y,
        dataTransfer: session.dataTransfer,
      }),
    );
    for (let frame = 0; frame < 4; frame++) {
      await new Promise((r) => requestAnimationFrame(() => r(undefined)));
      pollFlip();
      if (sawFlip) break;
    }
  }

  const sawBeforeDragEnd = sawFlip;
  endLeafDrag(session, canvasElement);
  await sleep(120);
  return sawBeforeDragEnd;
};

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
        !!canvasElement.querySelector(".st-column-editor-popout.open, .st-column-editor-popout"),
      { timeoutMs: 5000 },
    );

    const popout =
      canvasElement.querySelector(".st-column-editor-popout.open") ??
      canvasElement.querySelector(".st-column-editor-popout");
    expect(popout).toBeTruthy();

    const items = () => Array.from(canvasElement.querySelectorAll(".st-header-checkbox-item"));

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
      await waitUntil(() => getSnapshot().visibilityChangeCount > beforeVisibility + i, {
        timeoutMs: 3000,
      });
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
    await waitUntil(() => !!canvasElement.querySelector(".st-header-checkbox-item"), {
      timeoutMs: 3000,
    });
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

type DragPlaygroundArgs = {
  duration: number;
};

/**
 * Manual QA surface for the exact Track List fixture from client repros.
 * Use the Duration control to slow FLIP so header + body slides are visible.
 */
export const TrackListDragPlaygroundSlow = {
  name: "Track List drag playground (slow)",
  args: {
    duration: SLOW_DURATION,
  } satisfies DragPlaygroundArgs,
  argTypes: {
    duration: {
      name: "Duration (ms)",
      control: { type: "range", min: 400, max: 3000, step: 100 },
      description: "animations.duration — slow down to watch mid-drag FLIP",
    },
  },
  render: (args: DragPlaygroundArgs) =>
    buildReproLayout({
      mode: "heavy",
      rowCount: 40,
      enableReorder: true,
      enableColumnEditor: false,
      animations: { enabled: true, duration: args.duration ?? SLOW_DURATION },
      banner:
        `Drag Spotify → 7d leaves (e.g. Completion onto Shares). ` +
        `FLIP duration: ${args.duration ?? SLOW_DURATION}ms. ` +
        `Headers and body cells should slide on each dragover swap.`,
    }),
};

/**
 * Scripted drag of two Spotify 7d siblings; asserts mid-drag FLIP + order change.
 */
export const TrackListDragAnimatesMidSwap = {
  name: "Track List drag animates mid-swap",
  render: () =>
    buildReproLayout({
      mode: "heavy",
      rowCount: 24,
      enableReorder: true,
      enableColumnEditor: false,
      animations: { enabled: true, duration: SLOW_DURATION },
      banner:
        `Automated: drag spotify_7d_completion → spotify_7d_shares ` +
        `(${SLOW_DURATION}ms). Expect FLIP during dragover and swapped left order.`,
    }),
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable(canvasElement);
    await sleep(400);

    const source = "spotify_7d_completion";
    const target = "spotify_7d_shares";
    const siblings = [...SPOTIFY_7D_LEAVES];
    await ensureLeavesInView(canvasElement, siblings);

    for (const accessor of [source, target]) {
      expect(findHeaderCell(canvasElement, accessor), `missing ${accessor}`).toBeTruthy();
    }

    const orderBefore = leafLeftOrder(canvasElement, siblings);
    const sourceLeftBefore = parseFloat(findHeaderCell(canvasElement, source)!.style.left || "0");
    const targetLeftBefore = parseFloat(findHeaderCell(canvasElement, target)!.style.left || "0");
    expect(sourceLeftBefore).toBeGreaterThan(targetLeftBefore);

    const sawFlipBeforeDragEnd = await dragLeafOntoLeaf(canvasElement, source, target);

    const orderAfter = leafLeftOrder(canvasElement, siblings);
    expect(
      orderAfter !== orderBefore,
      `Expected Spotify 7d leaf order to change after drag. before=${orderBefore} after=${orderAfter}`,
    ).toBe(true);

    expect(
      sawFlipBeforeDragEnd,
      "Expected a non-zero header FLIP transform/transition during dragover " +
        "(before dragend) when reordering Track List leaves.",
    ).toBe(true);

    // Body cells for the moved columns should also have participated (or settled).
    const bodySample = canvasElement.querySelector<HTMLElement>(
      `.st-body-main .st-cell[data-accessor="${source}"]`,
    );
    expect(bodySample, "missing body cell for dragged leaf").toBeTruthy();
  },
};

/**
 * Slow leftward crawl: each neighbor touch starts a reorder while earlier
 * slides are still mid-flight. Asserts mid-flight clocks do not stall
 * (soft-pause stop-start jitter).
 */
export const TrackListSlowLeftwardNoJitter = {
  name: "Track List slow leftward no jitter",
  parameters: {
    test: { timeout: 120_000 },
  },
  render: () =>
    buildReproLayout({
      mode: "heavy",
      rowCount: 16,
      enableReorder: true,
      enableColumnEditor: false,
      enableVirtualization: false,
      animations: { enabled: true, duration: CONTINUITY_DURATION },
      banner:
        `Automated: drag completion slowly left across Spotify 7d leaves. ` +
        `Mid-flight siblings must keep sliding (no soft-pause stop-start).`,
    }),
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable(canvasElement);
    await sleep(120);

    const dragged = "spotify_7d_completion";
    await ensureLeavesInView(canvasElement, SPOTIFY_7D_LEAVES);
    const bodyMain = canvasElement.querySelector<HTMLElement>(".st-body-main");
    if (bodyMain) {
      bodyMain.scrollLeft = 0;
      bodyMain.dispatchEvent(new Event("scroll", { bubbles: true }));
      await sleep(40);
    }

    for (const accessor of SPOTIFY_7D_LEAVES) {
      await expect(findHeaderCell(canvasElement, accessor), `missing ${accessor}`).toBeTruthy();
    }

    const slots = slotLefts(canvasElement, SPOTIFY_7D_LEAVES);
    let order = orderedLeaves(canvasElement, SPOTIFY_7D_LEAVES);
    await expect(order[order.length - 1]).toBe(dragged);

    const motions = new Map<string, LeafMotion>();
    let totalWatchFrames = 0;
    let session = beginLeafDrag(canvasElement, dragged);
    const unfreezeScroll = freezeMainScroll(canvasElement);

    // Walk left through neighbors in visual order (right→left excluding dragged).
    const leftwardTargets = [...SPOTIFY_7D_LEAVES].filter((a) => a !== dragged).reverse();

    try {
      let step = 0;
      for (let i = 0; i < leftwardTargets.length; i++) {
        const forceTarget = leftwardTargets[i];
        // Clear anti-ping-pong, but keep watching so mid-flight stalls fail.
        totalWatchFrames += await watchLeafContinuity(canvasElement, motions, `crawl gap ${i + 1}`, {
          durationMs: BETWEEN_SWAP_MS,
          watchAllLeaves: true,
          dragged,
        });

        const nextOrder = applyInsertReorder(order, dragged, forceTarget);
        if (nextOrder.join(",") === order.join(",")) continue;

        const result = await runInterruptSwap(
          canvasElement,
          session,
          dragged,
          order,
          slots,
          motions,
          step,
          `slow leftward crawl ${i + 1}/${leftwardTargets.length} → ${forceTarget}`,
          { forceTarget },
        );
        order = result.order;
        totalWatchFrames += result.watchFrames;
        step += 1;
      }

      endLeafDrag(session, canvasElement);
      totalWatchFrames += await watchLeafContinuity(canvasElement, motions, "crawl settle", {
        durationMs: CONTINUITY_DURATION + 100,
        watchAllLeaves: true,
      });

      await expect(
        totalWatchFrames > 80,
        `expected dense crawl sampling; got ${totalWatchFrames}`,
      ).toBe(true);
      console.log(
        `[continuity] slow-leftward crawl steps=${step} watchFrames=${totalWatchFrames}`,
      );
    } finally {
      unfreezeScroll();
    }
  },
};

/**
 * Pick a settled leaf target that changes insert order.
 *
 * Production ignores dragover on mid-FLIP headers (visual hit-testing would
 * otherwise ping-pong / flip back). Continuity plays still exercise mid-flight
 * motion — they just drop on settled siblings while others are sliding.
 */
const pickReorderTarget = (
  canvasElement: HTMLElement,
  order: string[],
  dragged: string,
  fallbackIndex: number,
  opts: { settledOnly?: boolean } = {},
): string | null => {
  const others = order.filter((a) => a !== dragged);
  const settledOnly = opts.settledOnly !== false;
  const candidates = settledOnly
    ? others.filter((a) => !hasActiveFlip(canvasElement, a))
    : others;

  // Rotate fallback so we walk around the band instead of always picking the first.
  if (candidates.length === 0) return null;
  const rotated = [
    ...candidates.slice(fallbackIndex % candidates.length),
    ...candidates.slice(0, fallbackIndex % candidates.length),
  ];

  for (const target of rotated) {
    const next = applyInsertReorder(order, dragged, target);
    if (next.join(",") !== order.join(",")) return target;
  }
  return null;
};

const isSettledLeaf = (canvasElement: HTMLElement, accessor: string): boolean => {
  const cell = findHeaderCell(canvasElement, accessor);
  if (!cell) return false;
  // Prefer computed/paint over style.transform: WAAPI fill:forwards can leave a
  // stale start translate on style while the painted matrix is already identity.
  const computed = window.getComputedStyle(cell).transform;
  if (computed && computed !== "none" && Math.abs(parseTranslateX(computed)) > 0.5) {
    return false;
  }
  const visual = visualLeftOf(canvasElement, accessor);
  const box = styleBoxLeftOf(canvasElement, accessor);
  return Math.abs(visual - box) < 1.5;
};

/** Keep horizontal scroll fixed so viewport visuals aren't shifted by clamp/reflow. */
const freezeMainScroll = (canvasElement: HTMLElement): (() => void) => {
  const panes = [
    canvasElement.querySelector<HTMLElement>(".st-body-main"),
    canvasElement.querySelector<HTMLElement>(".st-header-main"),
  ].filter((el): el is HTMLElement => !!el);
  if (panes.length === 0) return () => undefined;
  const locked = panes[0].scrollLeft;
  for (const pane of panes) pane.scrollLeft = locked;
  const onScroll = (event: Event) => {
    const target = event.target as HTMLElement;
    if (target.scrollLeft !== locked) target.scrollLeft = locked;
  };
  for (const pane of panes) pane.addEventListener("scroll", onScroll);
  return () => {
    for (const pane of panes) {
      pane.removeEventListener("scroll", onScroll);
      pane.scrollLeft = locked;
    }
  };
};

/** Drop motions that have finished so later progress checks don't treat them as mid-flight. */
const pruneSettledMotions = (
  canvasElement: HTMLElement,
  motions: Map<string, LeafMotion>,
): string[] => {
  const settled: string[] = [];
  for (const accessor of [...motions.keys()]) {
    if (isSettledLeaf(canvasElement, accessor)) {
      motions.delete(accessor);
      settled.push(accessor);
    }
  }
  return settled;
};

const runInterruptSwap = async (
  canvasElement: HTMLElement,
  session: DragSession,
  dragged: string,
  order: string[],
  slots: number[],
  motions: Map<string, LeafMotion>,
  step: number,
  label: string,
  opts: {
    /** When true, wait until some other leaf is mid-FLIP before picking a settled drop target. */
    requireOthersAnimating?: boolean;
    forceTarget?: string;
  } = {},
): Promise<{ order: string[]; target: string; watchFrames: number }> => {
  let target = opts.forceTarget ?? null;
  if (target) {
    const next = applyInsertReorder(order, dragged, target);
    if (next.join(",") === order.join(",")) {
      target = null;
    }
  }

  // Wait for a settled drop target (and optional mid-flight context). Mid-FLIP
  // headers are not valid drop targets anymore.
  const pickDeadline = Date.now() + CONTINUITY_DURATION + 500;
  let waitFrames = 0;
  while (Date.now() < pickDeadline) {
    if (opts.requireOthersAnimating) {
      const othersAnimating = SPOTIFY_7D_LEAVES.some(
        (a) => a !== dragged && hasActiveFlip(canvasElement, a),
      );
      if (!othersAnimating) {
        // No live FLIPs yet — proceed with a settled target anyway.
      }
    }

    if (target) {
      if (!hasActiveFlip(canvasElement, target)) break;
      // Forced target still sliding — wait for it to settle.
    } else {
      target = pickReorderTarget(canvasElement, order, dragged, step, { settledOnly: true });
      if (target) {
        if (!opts.requireOthersAnimating) break;
        const othersAnimating = SPOTIFY_7D_LEAVES.some(
          (a) => a !== dragged && a !== target && hasActiveFlip(canvasElement, a),
        );
        // Prefer dropping while siblings are mid-flight; if the band has fully
        // settled, still take the settled target so the play can continue.
        if (othersAnimating || Date.now() > pickDeadline - 80) break;
      }
    }

    waitFrames += await watchLeafContinuity(
      canvasElement,
      motions,
      `${label} wait-settled-target`,
      {
        durationMs: 60,
        watchAllLeaves: true,
        dragged,
      },
    );
    if (!opts.forceTarget) target = null;
  }

  if (!target) {
    target = pickReorderTarget(canvasElement, order, dragged, step, { settledOnly: true });
  }
  await expect(target, `${label}: no settled reorder target from ${order.join(",")}`).toBeTruthy();
  await expect(
    !hasActiveFlip(canvasElement, target!),
    `${label}: drop target ${target} is still mid-FLIP (production ignores these)`,
  ).toBe(true);

  const originLefts = new Map<string, number>();
  for (const accessor of SPOTIFY_7D_LEAVES) {
    originLefts.set(accessor, styleLeftOf(canvasElement, accessor));
  }

  const expectedOrder = applyInsertReorder(order, dragged, target!);
  const expectedDest = expectedLeftMap(expectedOrder, slots);
  const expectOrderKey = expectedOrder.join(",");

  const {
    ok: reordered,
    visualsBeforeReorder,
    visualsAtCommit,
  } = await dragOverUntilReorder(canvasElement, session, target!, {
    expectOrder: expectOrderKey,
    motions,
    watchLabel: `${label} dragover`,
    dragged,
  });
  await expect(
    reordered,
    `${label}: drag ${dragged} → ${target} should apply insert reorder. ` +
      `before=${order.join(",")} expected=${expectOrderKey} ` +
      `actual=${leafLeftOrder(canvasElement, SPOTIFY_7D_LEAVES)}`,
  ).toBe(true);

  // visualsAtCommit was sampled in the same turn as the reorder hold
  // (before watchFrames / this await). Do not re-snapshot here — WAAPI will
  // have advanced and a <1px jump check against pre-reorder would flake.

  for (const accessor of SPOTIFY_7D_LEAVES) {
    const actual = styleLeftOf(canvasElement, accessor);
    const expected = expectedDest.get(accessor)!;
    await expect(
      Math.abs(actual - expected) < 1.5,
      `${label}: ${accessor} style.left=${actual}, expected dest=${expected}`,
    ).toBe(true);
  }

  for (const accessor of SPOTIFY_7D_LEAVES) {
    const destLeft = expectedDest.get(accessor)!;
    const prevLeft = originLefts.get(accessor)!;
    if (Math.abs(destLeft - prevLeft) < 1) {
      const existing = motions.get(accessor);
      if (existing) existing.destLeft = destLeft;
      continue;
    }

    const visual = visualsAtCommit.get(accessor)!;
    const prevVisual = visualsBeforeReorder.get(accessor)!;
    const destPage = styleBoxLeftOf(canvasElement, accessor);
    const swapJump = Math.abs(visual - prevVisual);
    const isDraggedLeaf = accessor === dragged;

    // Hold was already assertTrue'd sync in dragOverUntilReorder; keep this
    // as a belt-and-suspenders check on the same captured map.
    await expect(
      swapJump < 1,
      `${label}: ${accessor}${isDraggedLeaf ? " (dragged)" : ""} jumped at reorder start ` +
        `(${prevVisual.toFixed(1)} → ${visual.toFixed(1)}, Δ=${swapJump.toFixed(1)}, ` +
        `destPage=${destPage.toFixed(1)}, max=${RETARGET_JUMP_PX})`,
    ).toBe(true);

    const pathMin = Math.min(prevVisual, destPage) - PATH_SLACK_PX;
    const pathMax = Math.max(prevVisual, destPage) + PATH_SLACK_PX;
    await expect(
      visual >= pathMin && visual <= pathMax,
      `${label}: ${accessor} visual left the FLIP path on swap ` +
        `(${prevVisual.toFixed(1)} → ${visual.toFixed(1)}, destPage=${destPage.toFixed(1)}). ` +
        `originLeft=${prevLeft} destLeft=${destLeft}`,
    ).toBe(true);

    motions.set(accessor, {
      accessor,
      destLeft,
      visualAtSample: visual,
      originLeft: prevLeft,
      updatedAtStep: step,
    });
  }

  const watchFrames =
    waitFrames +
    (await watchLeafContinuity(canvasElement, motions, `${label} post-swap`, {
      durationMs: POST_SWAP_WATCH_MS,
      watchAllLeaves: true,
      dragged,
    }));
  return { order: expectedOrder, target: target!, watchFrames };
};

/**
 * Mid-flight interrupt continuity on Spotify 7d leaves:
 *  1. Rapid reorders via settled drop targets while other leaves are mid-FLIP
 *     (production ignores dragover on mid-FLIP headers)
 *  2. Hold the drag until early targets settle, then drag over them again
 *  3. Mid-flight burst, then release and *immediately* start dragging
 *     streams while those FLIPs are still flying
 *  4. Streams keeps interrupting (and occasionally re-hitting settled leaves)
 *
 * Dense sampling: every animation frame checks every Spotify 7d leaf's painted
 * header (+ matching body cell) for teleports / path breaks / header-body
 * desync — during dragover travel, post-swap ease, between-swap gaps, and
 * settle waits. Full Track List fixture + slow FLIP; play budget is 20 minutes.
 */
export const TrackListTenInterruptContinuity = {
  name: "Track List 10× interrupt continuity",
  parameters: {
    // Storybook Interactions / test-runner: this play is intentionally long.
    // Fast-feedback mode shortens the budget while iterating on teleports.
    test: {
      timeout: CONTINUITY_FAST_FEEDBACK ? 120_000 : CONTINUITY_PLAY_TIMEOUT_MS,
    },
  },
  render: () =>
    buildReproLayout({
      mode: "heavy",
      rowCount: CONTINUITY_FAST_FEEDBACK ? 16 : 40,
      enableReorder: true,
      enableColumnEditor: false,
      enableVirtualization: false,
      animations: { enabled: true, duration: CONTINUITY_DURATION },
      banner:
        `Automated continuity (dense per-frame sampling` +
        `${CONTINUITY_FAST_FEEDBACK ? ", FAST FEEDBACK (trimmed phases)" : ", ~20min budget"}) on full Track ` +
        `List: settled-target reorders while others mid-FLIP, re-hit settled targets, hand off to streams mid-flight ` +
        `for ${CONTINUITY_FAST_FEEDBACK ? 8 : HANDOFF_SWAPS} swaps (${CONTINUITY_DURATION}ms FLIP).`,
    }),
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitForTable(canvasElement);
    await sleep(CONTINUITY_FAST_FEEDBACK ? 120 : 400);

    // Fast mode exercises every phase with trimmed counts (not burst-only).
    const BURST_SWAPS = CONTINUITY_FAST_FEEDBACK ? 10 : 24;
    const SETTLED_REHIT_SWAPS = CONTINUITY_FAST_FEEDBACK ? 4 : 16;
    const PRE_HANDOFF_BURST = CONTINUITY_FAST_FEEDBACK ? 6 : 20;
    const handoffSwaps = CONTINUITY_FAST_FEEDBACK ? 8 : HANDOFF_SWAPS;
    const dragged = "spotify_7d_completion";
    const handoffDragged = "spotify_7d_streams";
    let totalWatchFrames = 0;

    await ensureLeavesInView(canvasElement, SPOTIFY_7D_LEAVES);
    const bodyMain = canvasElement.querySelector<HTMLElement>(".st-body-main");
    if (bodyMain) {
      bodyMain.scrollLeft = 0;
      bodyMain.dispatchEvent(new Event("scroll", { bubbles: true }));
      await sleep(40);
    }

    for (const accessor of SPOTIFY_7D_LEAVES) {
      await expect(findHeaderCell(canvasElement, accessor), `missing ${accessor}`).toBeTruthy();
    }

    const slots = slotLefts(canvasElement, SPOTIFY_7D_LEAVES);
    await expect(slots.length).toBe(SPOTIFY_7D_LEAVES.length);

    let order = orderedLeaves(canvasElement, SPOTIFY_7D_LEAVES);
    await expect(order[order.length - 1]).toBe(dragged);

    const motions = new Map<string, LeafMotion>();
    const targetsHit: string[] = [];
    let step = 0;
    let session = beginLeafDrag(canvasElement, dragged);
    const unfreezeScroll = freezeMainScroll(canvasElement);

    const watchGap = async (label: string, durationMs: number, draggedCol: string = dragged) => {
      totalWatchFrames += await watchLeafContinuity(canvasElement, motions, label, {
        durationMs,
        watchAllLeaves: true,
        dragged: draggedCol,
      });
    };

    try {
      for (let i = 0; i < BURST_SWAPS; i++) {
        await watchGap(`burst gap ${i + 1}`, BETWEEN_SWAP_MS);
        const result = await runInterruptSwap(
          canvasElement,
          session,
          dragged,
          order,
          slots,
          motions,
          step,
          `burst step ${i + 1}`,
          { requireOthersAnimating: i % 2 === 1 },
        );
        order = result.order;
        targetsHit.push(result.target);
        totalWatchFrames += result.watchFrames;
        step += 1;
      }

      const earlyTargets = [...new Set(targetsHit.filter((t) => t !== dragged))];
      await expect(
        earlyTargets.length >= 2,
        `need ≥2 distinct early targets; got ${earlyTargets.join(",")}`,
      ).toBe(true);

      const settleDeadline = Date.now() + CONTINUITY_DURATION + 400;
      while (Date.now() < settleDeadline) {
        const settledEarly = earlyTargets.filter((a) => isSettledLeaf(canvasElement, a));
        if (settledEarly.length >= Math.min(2, earlyTargets.length)) break;
        await watchGap("early-settle wait", 80);
      }

      pruneSettledMotions(canvasElement, motions);

      for (let i = 0; i < SETTLED_REHIT_SWAPS; i++) {
        const rehitDeadline = Date.now() + CONTINUITY_DURATION + 400;
        let forceTarget: string | null = null;
        while (Date.now() < rehitDeadline) {
          forceTarget =
            earlyTargets.find((t) => {
              if (!isSettledLeaf(canvasElement, t)) return false;
              return applyInsertReorder(order, dragged, t).join(",") !== order.join(",");
            }) ?? null;
          if (forceTarget) break;
          await watchGap(`re-hit wait ${i + 1}`, 80);
        }
        await expect(
          forceTarget,
          `re-hit ${i + 1}: no settled early target changes order from ${order.join(",")}`,
        ).toBeTruthy();

        await watchGap(`re-hit gap ${i + 1}`, BETWEEN_SWAP_MS);
        const settledVisual = visualLeftOf(canvasElement, forceTarget!);
        const settledBox = styleBoxLeftOf(canvasElement, forceTarget!);
        await expect(
          Math.abs(settledVisual - settledBox) < 1.5,
          `re-hit ${i + 1}: ${forceTarget} not fully settled ` +
            `(${settledVisual.toFixed(1)} vs ${settledBox.toFixed(1)})`,
        ).toBe(true);

        const result = await runInterruptSwap(
          canvasElement,
          session,
          dragged,
          order,
          slots,
          motions,
          step,
          `re-hit settled step ${i + 1} → ${forceTarget}`,
          { forceTarget: forceTarget! },
        );
        order = result.order;
        totalWatchFrames += result.watchFrames;
        step += 1;
      }

      // Fresh mid-flight burst so the handoff starts against live FLIPs.
      for (let i = 0; i < PRE_HANDOFF_BURST; i++) {
        await watchGap(`pre-handoff gap ${i + 1}`, BETWEEN_SWAP_MS);
        const result = await runInterruptSwap(
          canvasElement,
          session,
          dragged,
          order,
          slots,
          motions,
          step,
          `pre-handoff burst ${i + 1}`,
          { requireOthersAnimating: true },
        );
        order = result.order;
        totalWatchFrames += result.watchFrames;
        step += 1;
      }

      // Brief dense sample right before release so we catch last-frame glitches.
      totalWatchFrames += await watchLeafContinuity(canvasElement, motions, "pre-release", {
        durationMs: 120,
        watchAllLeaves: true,
        dragged,
      });

      const preReleaseVisuals = new Map<string, number>();
      for (const accessor of SPOTIFY_7D_LEAVES) {
        preReleaseVisuals.set(accessor, visualLeftOf(canvasElement, accessor));
      }
      const animatingBeforeRelease = SPOTIFY_7D_LEAVES.filter((a) =>
        hasActiveFlip(canvasElement, a),
      );
      await expect(
        animatingBeforeRelease.length > 0,
        `expected mid-FLIP headers before release; order=${order.join(",")}`,
      ).toBe(true);

      // Release → grab streams immediately while prior FLIPs are still flying.
      endLeafDrag(session, canvasElement);

      const stillFlyingAfterRelease = SPOTIFY_7D_LEAVES.filter((a) =>
        hasActiveFlip(canvasElement, a),
      );
      await expect(
        stillFlyingAfterRelease.length > 0,
        "prior-drag FLIPs must still be mid-flight when starting the streams drag",
      ).toBe(true);

      for (const accessor of animatingBeforeRelease) {
        const visualNow = visualLeftOf(canvasElement, accessor);
        const prev = preReleaseVisuals.get(accessor)!;
        await expect(
          Math.abs(visualNow - prev) < VISUAL_JUMP_PX,
          `after release: ${accessor} teleported (${prev.toFixed(1)} → ${visualNow.toFixed(1)})`,
        ).toBe(true);
        const motion = motions.get(accessor);
        if (motion) motion.visualAtSample = visualNow;
      }

      await expect(
        order.includes(handoffDragged),
        `handoff column ${handoffDragged} missing from order`,
      ).toBe(true);

      const visualsAtNewDragStart = new Map<string, number>();
      for (const accessor of SPOTIFY_7D_LEAVES) {
        visualsAtNewDragStart.set(accessor, visualLeftOf(canvasElement, accessor));
        const motion = motions.get(accessor);
        if (motion) motion.visualAtSample = visualsAtNewDragStart.get(accessor)!;
      }

      session = beginLeafDrag(canvasElement, handoffDragged);

      // dragstart must not settle leftover FLIPs from the completion drag.
      const stillFlyingAfterDragStart = SPOTIFY_7D_LEAVES.filter(
        (a) => a !== handoffDragged && hasActiveFlip(canvasElement, a),
      );
      await expect(
        stillFlyingAfterDragStart.length > 0,
        "expected prior-drag FLIPs to keep flying after streams dragstart",
      ).toBe(true);

      for (const accessor of stillFlyingAfterRelease) {
        if (accessor === handoffDragged) continue;
        const visualNow = visualLeftOf(canvasElement, accessor);
        const prev = visualsAtNewDragStart.get(accessor)!;
        await expect(
          Math.abs(visualNow - prev) < VISUAL_JUMP_PX,
          `after dragstart(${handoffDragged}): ${accessor} teleported ` +
            `(${prev.toFixed(1)} → ${visualNow.toFixed(1)})`,
        ).toBe(true);
      }

      // Keep sampling through the handoff seam (release → new dragstart).
      totalWatchFrames += await watchLeafContinuity(canvasElement, motions, "handoff seam", {
        durationMs: 200,
        watchAllLeaves: true,
        dragged: handoffDragged,
      });

      // First swaps drop on settled siblings while prior FLIPs are mid-flight;
      // later ones also re-hit settled siblings explicitly.
      const handoffRoster = SPOTIFY_7D_LEAVES.filter((a) => a !== handoffDragged);
      const MID_FLIGHT_HANDOFF = CONTINUITY_FAST_FEEDBACK
        ? Math.max(4, handoffSwaps - 3)
        : Math.max(80, handoffSwaps - 40);
      for (let i = 0; i < handoffSwaps; i++) {
        await watchGap(`handoff gap ${i + 1}`, BETWEEN_SWAP_MS, handoffDragged);

        let forceTarget: string | undefined;
        const preferSettledRehit = i >= MID_FLIGHT_HANDOFF && i % 2 === 1;
        if (preferSettledRehit) {
          const rehitDeadline = Date.now() + CONTINUITY_DURATION + 300;
          while (Date.now() < rehitDeadline) {
            const settled = handoffRoster.find((t) => {
              if (!isSettledLeaf(canvasElement, t)) return false;
              return applyInsertReorder(order, handoffDragged, t).join(",") !== order.join(",");
            });
            if (settled) {
              forceTarget = settled;
              break;
            }
            await watchGap(`handoff re-hit wait ${i + 1}`, 60, handoffDragged);
          }
          if (forceTarget)
            await watchGap(`handoff re-hit gap ${i + 1}`, BETWEEN_SWAP_MS, handoffDragged);
        }
        if (!forceTarget) {
          // Prefer a settled candidate; skip mid-FLIP leaves (ignored in production).
          for (let idx = 0; idx < handoffRoster.length; idx++) {
            const rotated = handoffRoster[(i + idx) % handoffRoster.length];
            if (hasActiveFlip(canvasElement, rotated)) continue;
            if (applyInsertReorder(order, handoffDragged, rotated).join(",") !== order.join(",")) {
              forceTarget = rotated;
              break;
            }
          }
        }

        const result = await runInterruptSwap(
          canvasElement,
          session,
          handoffDragged,
          order,
          slots,
          motions,
          step,
          `handoff step ${i + 1}/${handoffSwaps} (dragging ${handoffDragged}` +
            `${i < MID_FLIGHT_HANDOFF ? ", mid-flight overlap" : ""})`,
          forceTarget
            ? { forceTarget }
            : { requireOthersAnimating: i < MID_FLIGHT_HANDOFF },
        );
        order = result.order;
        totalWatchFrames += result.watchFrames;
        step += 1;
      }

      endLeafDrag(session, canvasElement);

      const finalOrder = orderedLeaves(canvasElement, SPOTIFY_7D_LEAVES);
      await expect(finalOrder.join(",")).toBe(order.join(","));

      // Watch through final settle — cover distance-scaled WAAPI (up to ~2500ms).
      totalWatchFrames += await watchLeafContinuity(canvasElement, motions, "final settle", {
        durationMs: Math.max(CONTINUITY_DURATION, 2500) + 250,
        watchAllLeaves: true,
      });
      const settledDest = expectedLeftMap(order, slots);
      for (const accessor of SPOTIFY_7D_LEAVES) {
        // Paint/layout settle — do not require style.transform === "" yet.
        // WAAPI fill:forwards can leave a stale start translate on style until
        // the finished handler clears it, while getBoundingClientRect is home.
        await expect(
          isSettledLeaf(canvasElement, accessor),
          `${accessor} not visually settled after final watch`,
        ).toBe(true);
        await expect(
          Math.abs(styleLeftOf(canvasElement, accessor) - settledDest.get(accessor)!) < 1.5,
          `${accessor} settled style.left mismatch`,
        ).toBe(true);
      }

      // ~8 leaves × frames; full play is dense, fast mode is a shorter sample.
      const minWatchFrames = CONTINUITY_FAST_FEEDBACK ? 200 : 5_000;
      await expect(
        totalWatchFrames > minWatchFrames,
        `expected dense sampling (>${minWatchFrames} frames); got ${totalWatchFrames}`,
      ).toBe(true);
      console.log(
        `[continuity]${CONTINUITY_FAST_FEEDBACK ? " FAST FEEDBACK" : ""} ` +
          `steps=${step} watchFrames=${totalWatchFrames} ` +
          `(~${totalWatchFrames * SPOTIFY_7D_LEAVES.length} leaf samples` +
          `${CONTINUITY_FAST_FEEDBACK ? "; set CONTINUITY_FAST_FEEDBACK=false for full play" : ""})`,
      );
    } finally {
      unfreezeScroll();
    }
  },
};
